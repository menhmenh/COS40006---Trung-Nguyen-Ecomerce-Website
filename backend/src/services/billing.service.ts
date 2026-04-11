/**
 * Billing Service for handling recurring charges and payment processing
 * Phase 2: Billing System Implementation
 */

import * as sql from 'mssql';
import { getPool } from '../config/database';
import { subscriptionService } from './subscription.service';
import { paymentGatewayService } from './payment-gateway.service';

export class BillingService {
  /**
   * Process monthly billing for subscriptions due
   * This will be called by a scheduled job
   */
  async processMontlyBilling(): Promise<{ processed: number; failed: number }> {
    try {
      const subscriptions = await subscriptionService.getSubscriptionsDueForBilling();

      let processed = 0;
      let failed = 0;
      const pool = await getPool();

      for (const subscription of subscriptions) {
        try {
          // Get subscription plan price
          const plan = await subscriptionService.getPlanById(subscription.plan_id);

          if (!plan) {
            console.error(`Plan not found for subscription ${subscription.subscription_id}`);
            failed++;
            continue;
          }

          // Create subscription order record
          const order = await subscriptionService.createSubscriptionOrder(
            subscription.subscription_id,
            plan.price
          );

          // Get Stripe customer ID for the subscription
          const stripeCustomer = await pool
            .request()
            .input('user_id', sql.Char(36), subscription.user_id)
            .query(`
              SELECT stripe_customer_id FROM dbo.payment_methods
              WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
            `);

          let stripeCustomerId = stripeCustomer.recordset?.[0]?.stripe_customer_id;

          // If no Stripe customer exists, try to create one
          if (!stripeCustomerId) {
            console.log(
              `No Stripe customer found for user ${subscription.user_id}. Skipping payment processing.`
            );
            // Mark order as pending for manual processing or later retry
            await pool
              .request()
              .input('subscription_order_id', sql.Char(36), order.subscription_order_id)
              .query(`
                UPDATE dbo.subscription_orders
                SET payment_status = 'PENDING_PAYMENT_METHOD'
                WHERE subscription_order_id = @subscription_order_id
              `);
            failed++;
            continue;
          }

          // Process payment with Stripe
          const paymentResult = await paymentGatewayService.processSubscriptionPayment(
            order.subscription_order_id,
            plan.price,
            stripeCustomerId,
            'USD'
          );

          console.log(
            `Payment processed for subscription order: ${order.subscription_order_id} - Status: ${paymentResult.status}`
          );

          processed++;

          // Update next billing date
          const nextBillingDate = new Date(subscription.next_billing_date);
          nextBillingDate.setDate(nextBillingDate.getDate() + (plan.billing_cycle || 30));

          await pool
            .request()
            .input('subscription_id', sql.NVarChar(36), subscription.subscription_id)
            .input('next_billing_date', sql.Date, nextBillingDate)
            .input('last_billing_date', sql.Date, new Date())
            .query(`
              UPDATE dbo.subscriptions
              SET next_billing_date = @next_billing_date,
                  last_billing_date = @last_billing_date,
                  updated_date = GETUTCDATE()
              WHERE subscription_id = @subscription_id;
            `);
        } catch (error) {
          console.error(
            `Error processing billing for subscription ${subscription.subscription_id}:`,
            error
          );
          failed++;
        }
      }

      return { processed, failed };
    } catch (error) {
      console.error('Error in processMonthlyBilling:', error);
      throw error;
    }
  }

  /**
   * Retry failed charge
   */
  async retryFailedCharge(subscriptionOrderId: string): Promise<boolean> {
    try {
      const pool = await getPool();

      // Get the failed order
      const orderResult = await pool
        .request()
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .query(`
          SELECT so.subscription_id, so.amount, so.stripe_payment_intent,
                 s.user_id
          FROM dbo.subscription_orders so
          JOIN dbo.subscriptions s ON so.subscription_id = s.subscription_id
          WHERE so.subscription_order_id = @subscription_order_id
        `);

      if (!orderResult.recordset || orderResult.recordset.length === 0) {
        console.error(`Subscription order not found: ${subscriptionOrderId}`);
        return false;
      }

      const order = orderResult.recordset[0];

      // Get Stripe customer ID
      const stripeCustomer = await pool
        .request()
        .input('user_id', sql.Char(36), order.user_id)
        .query(`
          SELECT stripe_customer_id FROM dbo.payment_methods
          WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
        `);

      if (!stripeCustomer.recordset?.[0]?.stripe_customer_id) {
        console.error(`No Stripe customer found for retry`);
        return false;
      }

      // Retry the payment by creating a new payment intent
      const paymentResult = await paymentGatewayService.processSubscriptionPayment(
        subscriptionOrderId,
        order.amount,
        stripeCustomer.recordset[0].stripe_customer_id,
        'USD'
      );

      console.log(`Retried charge for order ${subscriptionOrderId}: ${paymentResult.status}`);
      return paymentResult.status === 'succeeded' || paymentResult.status === 'processing';
    } catch (error) {
      console.error('Error retrying charge:', error);
      throw error;
    }
  }

  /**
   * Get billing history for a subscription
   */
  async getBillingHistory(subscriptionId: string, limit: number = 12): Promise<any[]> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('subscription_id', sql.NVarChar(36), subscriptionId)
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) *
          FROM dbo.subscription_orders
          WHERE subscription_id = @subscription_id
          ORDER BY billing_month DESC;
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error getting billing history:', error);
      throw error;
    }
  }
}

export const billingService = new BillingService();
