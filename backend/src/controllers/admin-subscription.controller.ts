import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service';

export class AdminSubscriptionController {
  /**
   * GET /api/admin/subscriptions
   * Get all subscriptions (admin only)
   */
  async getAllSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement pagination and filtering
      const pool = require('../config/database').getPool();
      const result = await (await pool)
        .request()
        .query(`
          SELECT 
            s.*,
            sp.plan_name,
            sp.price,
            COUNT(o.subscription_order_id) as total_orders
          FROM dbo.subscriptions s
          LEFT JOIN dbo.subscription_plans sp ON s.plan_id = sp.plan_id
          LEFT JOIN dbo.subscription_orders o ON s.subscription_id = o.subscription_id
          GROUP BY s.subscription_id, s.user_id, s.plan_id, s.subscription_status,
                   s.start_date, s.next_billing_date, s.last_billing_date,
                   s.cancelled_date, s.cancellation_reason, s.payment_method_id,
                   s.delivery_address_id, s.skipped_months, s.created_date,
                   s.updated_date, sp.plan_name, sp.price
          ORDER BY s.created_date DESC;
        `);

      res.status(200).json({
        success: true,
        data: result.recordset,
        count: result.recordset.length,
      });
    } catch (error) {
      console.error('Error in getAllSubscriptions:', error);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  }

  /**
   * POST /api/admin/subscription-plans
   * Create a new subscription plan (admin only)
   */
  async createPlan(req: Request, res: Response): Promise<void> {
    try {
      const { plan_name, description, price, billing_cycle, frequency, max_skip_per_year } =
        req.body;

      if (!plan_name || price === undefined) {
        res.status(400).json({ error: 'Missing required fields: plan_name, price' });
        return;
      }

      const plan = await subscriptionService.createPlan(
        {
          plan_name,
          description,
          price,
          billing_cycle: billing_cycle || 30,
          frequency: frequency || 'MONTHLY',
          max_skip_per_year: max_skip_per_year || 3,
        },
        req.user?.id
      );

      res.status(201).json({
        success: true,
        message: 'Subscription plan created successfully',
        data: plan,
      });
    } catch (error) {
      console.error('Error in createPlan:', error);
      res.status(500).json({ error: 'Failed to create plan' });
    }
  }

  /**
   * GET /api/admin/subscriptions/analytics
   * Get subscription analytics
   */
  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const pool = require('../config/database').getPool();
      
      const result = await (await pool)
        .request()
        .query(`
          SELECT
            COUNT(*) as total_subscriptions,
            SUM(CASE WHEN subscription_status = 'ACTIVE' THEN 1 ELSE 0 END) as active_subscriptions,
            SUM(CASE WHEN subscription_status = 'PAUSED' THEN 1 ELSE 0 END) as paused_subscriptions,
            SUM(CASE WHEN subscription_status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_subscriptions,
            (SELECT COUNT(*) FROM dbo.subscription_plans WHERE status = 'ACTIVE') as total_plans,
            (SELECT SUM(amount) FROM dbo.subscription_orders WHERE payment_status = 'PAID') as total_revenue
          FROM dbo.subscriptions;
        `);

      const stats = result.recordset[0];

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  /**
   * GET /api/admin/subscriptions/billing-failed
   * Get failed billing charges
   */
  async getFailedCharges(req: Request, res: Response): Promise<void> {
    try {
      const pool = require('../config/database').getPool();
      
      const result = await (await pool)
        .request()
        .query(`
          SELECT 
            so.*,
            s.user_id,
            sp.plan_name,
            sp.price
          FROM dbo.subscription_orders so
          JOIN dbo.subscriptions s ON so.subscription_id = s.subscription_id
          JOIN dbo.subscription_plans sp ON s.plan_id = sp.plan_id
          WHERE so.payment_status = 'FAILED'
          ORDER BY so.created_date DESC;
        `);

      res.status(200).json({
        success: true,
        data: result.recordset,
        count: result.recordset.length,
      });
    } catch (error) {
      console.error('Error in getFailedCharges:', error);
      res.status(500).json({ error: 'Failed to fetch failed charges' });
    }
  }

  /**
   * POST /api/admin/subscriptions/retry-charge
   * Retry a failed charge
   */
  async retryCharge(req: Request, res: Response): Promise<void> {
    try {
      const { subscription_order_id } = req.body;

      if (!subscription_order_id) {
        res.status(400).json({ error: 'subscription_order_id is required' });
        return;
      }

      // TODO: Integrate with payment provider to retry charge
      // For now, just update the retry count
      const pool = require('../config/database').getPool();
      
      const result = await (await pool)
        .request()
        .input('subscription_order_id', subscription_order_id)
        .query(`
          UPDATE dbo.subscription_orders
          SET retry_count = retry_count + 1,
              last_retry_date = GETUTCDATE(),
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id;
          
          SELECT * FROM dbo.subscription_orders WHERE subscription_order_id = @subscription_order_id;
        `);

      res.status(200).json({
        success: true,
        message: 'Charge retry initiated',
        data: result.recordset[0],
      });
    } catch (error) {
      console.error('Error in retryCharge:', error);
      res.status(500).json({ error: 'Failed to retry charge' });
    }
  }

  /**
   * GET /api/admin/subscriptions/billing-report
   * Get billing report
   */
  async getBillingReport(req: Request, res: Response): Promise<void> {
    try {
      const pool = require('../config/database').getPool();
      const { startDate, endDate } = req.query;

      let query = `
        SELECT 
          CAST(so.created_date AS DATE) as billing_date,
          COUNT(*) as total_charges,
          SUM(CASE WHEN so.payment_status = 'PAID' THEN 1 ELSE 0 END) as successful_charges,
          SUM(CASE WHEN so.payment_status = 'FAILED' THEN 1 ELSE 0 END) as failed_charges,
          SUM(CASE WHEN so.payment_status = 'PAID' THEN so.amount ELSE 0 END) as total_revenue
        FROM dbo.subscription_orders so
      `;

      if (startDate && endDate) {
        query += ` WHERE so.created_date >= @startDate AND so.created_date <= @endDate`;
      }

      query += ` GROUP BY CAST(so.created_date AS DATE)
        ORDER BY billing_date DESC;`;

      const request = (await pool).request();
      if (startDate) request.input('startDate', startDate);
      if (endDate) request.input('endDate', endDate);

      const result = await request.query(query);

      res.status(200).json({
        success: true,
        data: result.recordset,
      });
    } catch (error) {
      console.error('Error in getBillingReport:', error);
      res.status(500).json({ error: 'Failed to generate billing report' });
    }
  }
}

export const adminSubscriptionController = new AdminSubscriptionController();
