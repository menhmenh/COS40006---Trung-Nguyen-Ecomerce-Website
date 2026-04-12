import express, { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { paymentGatewayService } from '../services/payment-gateway.service';
import { billingService } from '../services/billing.service';
import { getPool } from '../config/database';
import * as sql from 'mssql';

const router = Router();

router.post(
  '/setup-payment-method',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { paymentMethodToken } = req.body;

      if (!paymentMethodToken) {
        return res.status(400).json({
          success: false,
          error: 'paymentMethodToken is required',
        });
      }

      const userId = (req as any).user.id;
      const email = (req as any).user.email;
      const name = (req as any).user.name;
      const stripeCustomerId = await paymentGatewayService.getOrCreateStripeCustomer(
        userId,
        email,
        name,
      );

      await paymentGatewayService.addPaymentMethod(stripeCustomerId, paymentMethodToken);

      res.json({
        success: true,
        message: 'Payment method added successfully',
        stripeCustomerId,
      });
    } catch (error: any) {
      console.error('Error setting up payment method:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to setup payment method',
      });
    }
  },
);

router.get(
  '/payment-methods',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).user.id;
      const pool = await getPool();

      const customerResult = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT stripe_customer_id FROM dbo.payment_methods
          WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
        `);

      const stripeCustomerId = customerResult.recordset?.[0]?.stripe_customer_id;
      if (!stripeCustomerId) {
        return res.json({ success: true, data: [] });
      }

      const paymentMethods = await paymentGatewayService.listPaymentMethods(stripeCustomerId);
      const customer = await paymentGatewayService.getCustomer(stripeCustomerId);
      const defaultPaymentMethod =
        typeof customer === 'object' &&
        !('deleted' in customer) &&
        typeof customer.invoice_settings?.default_payment_method === 'string'
          ? customer.invoice_settings.default_payment_method
          : null;

      const formatted = paymentMethods.map((pm: any) => ({
        payment_method_id: pm.id,
        stripe_payment_method_id: pm.id,
        card_brand: pm.card?.brand || 'card',
        card_last4: pm.card?.last4 || '0000',
        is_default: defaultPaymentMethod === pm.id,
        created_date: new Date(pm.created * 1000).toISOString(),
      }));

      res.json({
        success: true,
        data: formatted,
      });
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch payment methods',
      });
    }
  },
);

router.put(
  '/payment-methods/:paymentMethodId/default',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { paymentMethodId } = req.params;
      const userId = (req as any).user.id;
      const pool = await getPool();

      const customerResult = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT stripe_customer_id FROM dbo.payment_methods
          WHERE user_id = @user_id AND stripe_customer_id IS NOT NULL
        `);

      const stripeCustomerId = customerResult.recordset?.[0]?.stripe_customer_id;
      if (!stripeCustomerId) {
        return res.status(404).json({
          success: false,
          error: 'Stripe customer not found',
        });
      }

      await paymentGatewayService.setDefaultPaymentMethod(stripeCustomerId, paymentMethodId);

      res.json({
        success: true,
        message: 'Default payment method updated successfully',
      });
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to set default payment method',
      });
    }
  },
);

router.delete(
  '/payment-methods/:paymentMethodId',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { paymentMethodId } = req.params;

      await paymentGatewayService.deletePaymentMethod(paymentMethodId);

      res.json({
        success: true,
        message: 'Payment method deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete payment method',
      });
    }
  },
);

router.post(
  '/process-payment',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).user.id;
      const { subscriptionOrderId } = req.body;

      if (!subscriptionOrderId) {
        return res.status(400).json({
          success: false,
          error: 'subscriptionOrderId is required',
        });
      }

      const pool = await getPool();
      const orderResult = await pool
        .request()
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT so.amount, s.user_id
          FROM dbo.subscription_orders so
          JOIN dbo.subscriptions s ON so.subscription_id = s.subscription_id
          WHERE so.subscription_order_id = @subscription_order_id
            AND s.user_id = @user_id
        `);

      if (!orderResult.recordset || orderResult.recordset.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Subscription order not found or access denied',
        });
      }

      const success = await billingService.retryFailedCharge(subscriptionOrderId);

      res.json({
        success,
        message: success ? 'Payment processed successfully' : 'Payment processing failed',
      });
    } catch (error: any) {
      console.error('Error processing payment:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to process payment',
      });
    }
  },
);

router.post('/webhook', async (req: express.Request, res: express.Response) => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).json({ success: false, error: 'Webhook not configured' });
    }

    let event;

    try {
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentGatewayService.handlePaymentSucceeded(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        await paymentGatewayService.handlePaymentFailed(
          event.data.object.id,
          event.data.object.last_payment_error?.message || 'Payment failed',
        );
        break;
      case 'payment_intent.canceled':
        await paymentGatewayService.handlePaymentFailed(event.data.object.id, 'Payment canceled');
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
    });
  }
});

router.get(
  '/billing-history/:subscriptionId',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).user.id;
      const { subscriptionId } = req.params;
      const pool = await getPool();

      const subResult = await pool
        .request()
        .input('subscription_id', sql.Char(36), subscriptionId)
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT subscription_id FROM dbo.subscriptions
          WHERE subscription_id = @subscription_id AND user_id = @user_id
        `);

      if (!subResult.recordset || subResult.recordset.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Subscription not found or access denied',
        });
      }

      const billingHistory = await billingService.getBillingHistory(subscriptionId, 12);

      res.json({
        success: true,
        billingHistory,
      });
    } catch (error: any) {
      console.error('Error fetching billing history:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch billing history',
      });
    }
  },
);

router.post(
  '/refund',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as any).user.id;
      const { subscriptionOrderId, amount, reason } = req.body;

      if (!subscriptionOrderId) {
        return res.status(400).json({
          success: false,
          error: 'subscriptionOrderId is required',
        });
      }

      const pool = await getPool();
      const orderResult = await pool
        .request()
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT so.stripe_payment_intent, so.amount, so.payment_status, s.user_id
          FROM dbo.subscription_orders so
          JOIN dbo.subscriptions s ON so.subscription_id = s.subscription_id
          WHERE so.subscription_order_id = @subscription_order_id
            AND s.user_id = @user_id
        `);

      if (!orderResult.recordset || orderResult.recordset.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Subscription order not found or access denied',
        });
      }

      const order = orderResult.recordset[0];

      if (order.payment_status !== 'PAID') {
        return res.status(400).json({
          success: false,
          error: 'Only paid orders can be refunded',
        });
      }

      if (!order.stripe_payment_intent) {
        return res.status(400).json({
          success: false,
          error: 'No payment intent found for this order',
        });
      }

      const refundId = await paymentGatewayService.refundPayment(
        order.stripe_payment_intent,
        amount,
      );

      await pool
        .request()
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .input('refund_id', sql.NVarChar(100), refundId)
        .input('payment_status', sql.NVarChar(50), 'REFUNDED')
        .input('refund_reason', sql.NVarChar(500), reason || 'Customer requested')
        .query(`
          UPDATE dbo.subscription_orders
          SET payment_status = @payment_status,
              stripe_refund_id = @refund_id,
              refund_reason = @refund_reason,
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id
        `);

      res.json({
        success: true,
        message: 'Refund processed successfully',
        refundId,
      });
    } catch (error: any) {
      console.error('Error processing refund:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to process refund',
      });
    }
  },
);

export default router;
