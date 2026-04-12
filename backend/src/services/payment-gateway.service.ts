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

export class PaymentGatewayService {
  private stripe: Stripe | null;

  constructor() {
    const apiKey = process.env.STRIPE_API_KEY;
    this.stripe = apiKey ? new Stripe(apiKey) : null;
  }

  private getStripe(): Stripe {
    if (!this.stripe) {
      throw new Error('STRIPE_API_KEY environment variable is not set');
    }

    return this.stripe;
  }

  async getCustomer(stripeCustomerId: string) {
    return this.getStripe().customers.retrieve(stripeCustomerId);
  }

  async createStripeCustomer(
    userId: string,
    email: string,
    name?: string,
  ): Promise<string> {
    try {
      const customer = await this.getStripe().customers.create({
        email,
        name: name || `Customer ${userId}`,
        metadata: { userId },
      });

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

  async getOrCreateStripeCustomer(
    userId: string,
    email: string,
    name?: string,
  ): Promise<string> {
    try {
      const pool = await getPool();
      const existingCustomer = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT stripe_customer_id FROM dbo.payment_methods
          WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
        `);

      const stripeCustomerId = existingCustomer.recordset?.[0]?.stripe_customer_id;
      if (stripeCustomerId) {
        return stripeCustomerId;
      }

      return await this.createStripeCustomer(userId, email, name);
    } catch (error) {
      console.error('Error getting or creating Stripe customer:', error);
      throw error;
    }
  }

  async addPaymentMethod(
    stripeCustomerId: string,
    paymentMethodToken: string,
  ): Promise<string> {
    try {
      const stripe = this.getStripe();

      await stripe.paymentMethods.attach(paymentMethodToken, {
        customer: stripeCustomerId,
      });

      await stripe.customers.update(stripeCustomerId, {
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

  async setDefaultPaymentMethod(
    stripeCustomerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    try {
      await this.getStripe().customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }

  async processSubscriptionPayment(
    subscriptionOrderId: string,
    amount: number,
    stripeCustomerId: string,
    currency: string = 'USD',
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.getStripe().paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        metadata: {
          subscriptionOrderId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

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

  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.getStripe().paymentIntents.retrieve(paymentIntentId);

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

  async handlePaymentSucceeded(paymentIntentId: string): Promise<void> {
    try {
      const pool = await getPool();
      const orderResult = await pool
        .request()
        .input('stripe_payment_intent', sql.NVarChar(100), paymentIntentId)
        .query(`
          SELECT subscription_order_id, subscription_id, amount
          FROM dbo.subscription_orders
          WHERE stripe_payment_intent = @stripe_payment_intent
        `);

      if (!orderResult.recordset || orderResult.recordset.length === 0) {
        console.warn(`No subscription order found for payment intent ${paymentIntentId}`);
        return;
      }

      const order = orderResult.recordset[0];

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
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  async handlePaymentFailed(
    paymentIntentId: string,
    errorMessage: string,
  ): Promise<void> {
    try {
      const pool = await getPool();
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
      const newRetryCount = (order.retry_count || 0) + 1;

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
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  async listPaymentMethods(stripeCustomerId: string): Promise<any[]> {
    try {
      const paymentMethods = await this.getStripe().paymentMethods.list({
        customer: stripeCustomerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing payment methods:', error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await this.getStripe().paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<string> {
    try {
      const refund = await this.getStripe().refunds.create({
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
