/**
 * Payment Gateway Service - Stripe Integration
 * Handles all payment processing for subscriptions
 */

import Stripe from 'stripe';
import * as sql from 'mssql';
import { getPool } from '../config/database';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  error?: string;
}

interface CustomerData {
  stripeCustomerId: string;
  userId: string;
  email: string;
}

export class PaymentGatewayService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_API_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_API_KEY environment variable is not set');
    }
    this.stripe = new Stripe(apiKey);
  }

  /**
   * Create a Stripe customer for a user
   */
  async createStripeCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name: name || `Customer ${userId}`,
        metadata: { userId },
      });

      // Store Stripe customer ID in database
      const pool = await getPool();
      await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .input('stripe_customer_id', sql.NVarChar(100), customer.id)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM dbo.payment_methods WHERE user_id = @user_id)
          BEGIN
            INSERT INTO dbo.payment_methods (payment_method_id, user_id, stripe_customer_id, created_date)
            VALUES (NEWID(), @user_id, @stripe_customer_id, GETUTCDATE())
          END
          ELSE
          BEGIN
            UPDATE dbo.payment_methods
            SET stripe_customer_id = @stripe_customer_id, updated_date = GETUTCDATE()
            WHERE user_id = @user_id
          END
        `);

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateStripeCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    try {
      const pool = await getPool();

      // Check if customer already exists
      const existingCustomer = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT stripe_customer_id FROM dbo.payment_methods
          WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
        `);

      if (
        existingCustomer.recordset &&
        existingCustomer.recordset.length > 0 &&
        existingCustomer.recordset[0].stripe_customer_id
      ) {
        return existingCustomer.recordset[0].stripe_customer_id;
      }

      // Create new customer if doesn't exist
      return await this.createStripeCustomer(userId, email, name);
    } catch (error) {
      console.error('Error getting or creating Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Add a payment method (card) for a customer
   */
  async addPaymentMethod(
    stripeCustomerId: string,
    paymentMethodToken: string
  ): Promise<string> {
    try {
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodToken, {
        customer: stripeCustomerId,
      });

      // Set as default payment method
      await this.stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodToken,
        },
      });

      return paymentMethodToken;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  /**
   * Process a payment for a subscription
   */
  async processSubscriptionPayment(
    subscriptionOrderId: string,
    amount: number,
    stripeCustomerId: string,
    currency: string = 'USD'
  ): Promise<PaymentIntent> {
    try {
      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        metadata: {
          subscriptionOrderId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update subscription order with payment intent
      const pool = await getPool();
      await pool
        .request()
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .input('stripe_payment_intent', sql.NVarChar(100), paymentIntent.id)
        .input('payment_status', sql.NVarChar(50), 'PROCESSING')
        .query(`
          UPDATE dbo.subscription_orders
          SET stripe_payment_intent = @stripe_payment_intent,
              payment_status = @payment_status,
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id
        `);

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error processing subscription payment:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        error:
          paymentIntent.last_payment_error?.message ||
          (paymentIntent.status === 'succeeded' ? undefined : 'Payment not completed'),
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment webhook
   */
  async handlePaymentSucceeded(paymentIntentId: string): Promise<void> {
    try {
      const pool = await getPool();

      // Get the subscription order by payment intent
      const orderResult = await pool
        .request()
        .input('stripe_payment_intent', sql.NVarChar(100), paymentIntentId)
        .query(`
          SELECT subscription_order_id, subscription_id, amount
          FROM dbo.subscription_orders
          WHERE stripe_payment_intent = @stripe_payment_intent
        `);

      if (
        !orderResult.recordset ||
        orderResult.recordset.length === 0
      ) {
        console.warn(`No subscription order found for payment intent ${paymentIntentId}`);
        return;
      }

      const order = orderResult.recordset[0];

      // Update order status to PAID
      await pool
        .request()
        .input('subscription_order_id', sql.Char(36), order.subscription_order_id)
        .input('payment_status', sql.NVarChar(50), 'PAID')
        .input('charge_date', sql.DateTime2, new Date())
        .query(`
          UPDATE dbo.subscription_orders
          SET payment_status = @payment_status,
              charge_date = @charge_date,
              retry_count = 0,
              status = 'COMPLETED',
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id
        `);

      console.log(
        `✅ Payment succeeded for subscription order: ${order.subscription_order_id}`
      );
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment webhook
   */
  async handlePaymentFailed(
    paymentIntentId: string,
    errorMessage: string
  ): Promise<void> {
    try {
      const pool = await getPool();

      // Get the subscription order by payment intent
      const orderResult = await pool
        .request()
        .input('stripe_payment_intent', sql.NVarChar(100), paymentIntentId)
        .query(`
          SELECT subscription_order_id, subscription_id, retry_count
          FROM dbo.subscription_orders
          WHERE stripe_payment_intent = @stripe_payment_intent
        `);

      if (!orderResult.recordset || orderResult.recordset.length === 0) {
        console.warn(`No subscription order found for payment intent ${paymentIntentId}`);
        return;
      }

      const order = orderResult.recordset[0];

      // Increment retry count
      const newRetryCount = (order.retry_count || 0) + 1;

      // Update order status to FAILED
      await pool
        .request()
        .input('subscription_order_id', sql.Char(36), order.subscription_order_id)
        .input('payment_status', sql.NVarChar(50), 'FAILED')
        .input('retry_count', sql.Int, newRetryCount)
        .input('error_message', sql.NVarChar(500), errorMessage)
        .input('last_retry_date', sql.DateTime2, new Date())
        .query(`
          UPDATE dbo.subscription_orders
          SET payment_status = @payment_status,
              retry_count = @retry_count,
              error_message = @error_message,
              last_retry_date = @last_retry_date,
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id
        `);

      console.error(
        `❌ Payment failed for subscription order: ${order.subscription_order_id} - ${errorMessage}`
      );
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  /**
   * List payment methods for a customer
   */
  async listPaymentMethods(stripeCustomerId: string): Promise<any[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing payment methods:', error);
      throw error;
    }
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
      console.log(`✅ Payment method ${paymentMethodId} deleted`);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<string> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund.id;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
}

export const paymentGatewayService = new PaymentGatewayService();
