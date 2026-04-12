import * as sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/database';
import {
  ISubscription,
  ISubscriptionPlan,
  ISubscriptionOrder,
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
} from '../models/subscription.model';

export class SubscriptionService {
  private mapSubscriptionRecord(record: any): ISubscription & { plan?: ISubscriptionPlan } {
    return {
      subscription_id: record.subscription_id,
      user_id: record.user_id,
      plan_id: record.plan_id,
      subscription_status: record.subscription_status,
      start_date: record.start_date,
      next_billing_date: record.next_billing_date,
      last_billing_date: record.last_billing_date,
      cancelled_date: record.cancelled_date,
      cancellation_reason: record.cancellation_reason,
      payment_method_id: record.payment_method_id,
      delivery_address_id: record.delivery_address_id,
      skipped_months: record.skipped_months,
      created_date: record.created_date,
      updated_date: record.updated_date,
      plan: record.plan_plan_id
        ? {
            plan_id: record.plan_plan_id,
            plan_name: record.plan_name,
            description: record.plan_description,
            price: Number(record.plan_price || 0),
            billing_cycle: record.plan_billing_cycle,
            frequency: record.plan_frequency,
            max_skip_per_year: record.plan_max_skip_per_year,
            status: record.plan_status,
            created_date: record.plan_created_date,
            updated_date: record.plan_updated_date,
            created_by: record.plan_created_by,
          }
        : undefined,
    };
  }

  private async getSubscriptionWithPlan(subscriptionId: string): Promise<(ISubscription & { plan?: ISubscriptionPlan }) | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('subscription_id', sql.NVarChar(36), subscriptionId)
      .query(`
        SELECT
          s.*,
          p.plan_id AS plan_plan_id,
          p.plan_name,
          p.description AS plan_description,
          p.price AS plan_price,
          p.billing_cycle AS plan_billing_cycle,
          p.frequency AS plan_frequency,
          p.max_skip_per_year AS plan_max_skip_per_year,
          p.status AS plan_status,
          p.created_date AS plan_created_date,
          p.updated_date AS plan_updated_date,
          p.created_by AS plan_created_by
        FROM dbo.subscriptions s
        LEFT JOIN dbo.subscription_plans p ON p.plan_id = s.plan_id
        WHERE s.subscription_id = @subscription_id;
      `);

    return result.recordset.length > 0
      ? this.mapSubscriptionRecord(result.recordset[0])
      : null;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(data: CreateSubscriptionDTO): Promise<ISubscription> {
    const pool = await getPool();
    const subscriptionId = uuidv4();
    const startDate = new Date();
    const nextBillingDate = new Date(startDate);
    nextBillingDate.setDate(nextBillingDate.getDate() + 30); // Default 30 days

    try {
      const result = await pool
        .request()
        .input('subscription_id', sql.NVarChar(36), subscriptionId)
        .input('user_id', sql.NVarChar(36), data.user_id)
        .input('plan_id', sql.NVarChar(36), data.plan_id)
        .input('subscription_status', sql.NVarChar(50), 'ACTIVE')
        .input('start_date', sql.Date, startDate)
        .input('next_billing_date', sql.Date, nextBillingDate)
        .input('delivery_address_id', sql.NVarChar(36), data.delivery_address_id)
        .input('payment_method_id', sql.NVarChar(36), data.payment_method_id)
        .query(`
          INSERT INTO dbo.subscriptions (
            subscription_id, user_id, plan_id, subscription_status,
            start_date, next_billing_date, delivery_address_id, payment_method_id
          )
          VALUES (
            @subscription_id, @user_id, @plan_id, @subscription_status,
            @start_date, @next_billing_date, @delivery_address_id, @payment_method_id
          );
          
          SELECT * FROM dbo.subscriptions WHERE subscription_id = @subscription_id;
        `);

      return (await this.getSubscriptionWithPlan(subscriptionId)) as ISubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId: string): Promise<ISubscription | null> {
    try {
      return await this.getSubscriptionWithPlan(subscriptionId);
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(userId: string): Promise<ISubscription[]> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .input('user_id', sql.NVarChar(36), userId)
        .query(`
          SELECT
            s.*,
            p.plan_id AS plan_plan_id,
            p.plan_name,
            p.description AS plan_description,
            p.price AS plan_price,
            p.billing_cycle AS plan_billing_cycle,
            p.frequency AS plan_frequency,
            p.max_skip_per_year AS plan_max_skip_per_year,
            p.status AS plan_status,
            p.created_date AS plan_created_date,
            p.updated_date AS plan_updated_date,
            p.created_by AS plan_created_by
          FROM dbo.subscriptions s
          LEFT JOIN dbo.subscription_plans p ON p.plan_id = s.plan_id
          WHERE user_id = @user_id
          ORDER BY s.created_date DESC;
        `);

      return result.recordset.map((record) => this.mapSubscriptionRecord(record));
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      throw error;
    }
  }

  /**
   * Update subscription status (pause, resume, cancel)
   */
  async updateSubscriptionStatus(
    subscriptionId: string,
    newStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED',
    reason?: string
  ): Promise<ISubscription> {
    const pool = await getPool();

    try {
      let query = `
        UPDATE dbo.subscriptions
        SET subscription_status = @status,
            updated_date = GETUTCDATE()
      `;

      if (newStatus === 'CANCELLED') {
        query += `, cancelled_date = GETUTCDATE(), cancellation_reason = @reason`;
      }

      query += ` WHERE subscription_id = @subscription_id;
        SELECT * FROM dbo.subscriptions WHERE subscription_id = @subscription_id;
      `;

      const result = await pool
        .request()
        .input('subscription_id', sql.NVarChar(36), subscriptionId)
        .input('status', sql.NVarChar(50), newStatus)
        .input('reason', sql.NVarChar(500), reason || null)
        .query(query);

      return (await this.getSubscriptionWithPlan(subscriptionId)) as ISubscription;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Update subscription delivery address or payment method
   */
  async updateSubscription(
    subscriptionId: string,
    data: UpdateSubscriptionDTO
  ): Promise<ISubscription> {
    const pool = await getPool();

    try {
      let query = `
        UPDATE dbo.subscriptions
        SET updated_date = GETUTCDATE()
      `;

      const request = pool.request().input('subscription_id', sql.NVarChar(36), subscriptionId);

      if (data.delivery_address_id) {
        query += `, delivery_address_id = @delivery_address_id`;
        request.input('delivery_address_id', sql.NVarChar(36), data.delivery_address_id);
      }

      if (data.payment_method_id) {
        query += `, payment_method_id = @payment_method_id`;
        request.input('payment_method_id', sql.NVarChar(36), data.payment_method_id);
      }

      query += ` WHERE subscription_id = @subscription_id;
        SELECT * FROM dbo.subscriptions WHERE subscription_id = @subscription_id;
      `;

      await request.query(query);
      return (await this.getSubscriptionWithPlan(subscriptionId)) as ISubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Skip the next billing month
   */
  async skipNextBillingMonth(subscriptionId: string): Promise<ISubscription> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .input('subscription_id', sql.NVarChar(36), subscriptionId)
        .query(`
          UPDATE dbo.subscriptions
          SET next_billing_date = DATEADD(DAY, 30, next_billing_date),
              skipped_months = skipped_months + 1,
              updated_date = GETUTCDATE()
          WHERE subscription_id = @subscription_id;
          
          SELECT * FROM dbo.subscriptions WHERE subscription_id = @subscription_id;
        `);

      return (await this.getSubscriptionWithPlan(subscriptionId)) as ISubscription;
    } catch (error) {
      console.error('Error skipping billing month:', error);
      throw error;
    }
  }

  /**
   * Get subscription plan by ID
   */
  async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .input('plan_id', sql.NVarChar(36), planId)
        .query(`
          SELECT * FROM dbo.subscription_plans WHERE plan_id = @plan_id;
        `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error getting plan:', error);
      throw error;
    }
  }

  /**
   * Get all active subscription plans
   */
  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .query(`
          SELECT * FROM dbo.subscription_plans
          WHERE status = 'ACTIVE'
          ORDER BY price ASC;
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error getting plans:', error);
      throw error;
    }
  }

  /**
   * Create a new subscription plan (Admin)
   */
  async createPlan(
    data: any,
    createdBy: string
  ): Promise<ISubscriptionPlan> {
    const pool = await getPool();
    const planId = uuidv4();

    try {
      const result = await pool
        .request()
        .input('plan_id', sql.NVarChar(36), planId)
        .input('plan_name', sql.NVarChar(100), data.plan_name)
        .input('description', sql.NVarChar(sql.MAX), data.description || null)
        .input('price', sql.Decimal(10, 2), data.price)
        .input('billing_cycle', sql.Int, data.billing_cycle || 30)
        .input('frequency', sql.NVarChar(20), data.frequency || 'MONTHLY')
        .input('max_skip_per_year', sql.Int, data.max_skip_per_year || 3)
        .input('created_by', sql.NVarChar(36), createdBy)
        .query(`
          INSERT INTO dbo.subscription_plans (
            plan_id, plan_name, description, price, billing_cycle, frequency, max_skip_per_year, created_by
          )
          VALUES (
            @plan_id, @plan_name, @description, @price, @billing_cycle, @frequency, @max_skip_per_year, @created_by
          );
          
          SELECT * FROM dbo.subscription_plans WHERE plan_id = @plan_id;
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  /**
   * Get subscriptions due for billing
   */
  async getSubscriptionsDueForBilling(): Promise<ISubscription[]> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .query(`
          SELECT * FROM dbo.subscriptions
          WHERE subscription_status = 'ACTIVE'
          AND next_billing_date <= CAST(GETUTCDATE() AS DATE)
          ORDER BY next_billing_date ASC;
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error getting subscriptions due for billing:', error);
      throw error;
    }
  }

  /**
   * Create a subscription order record
   */
  async createSubscriptionOrder(
    subscriptionId: string,
    amount: number
  ): Promise<ISubscriptionOrder> {
    const pool = await getPool();
    const orderId = uuidv4();
    const billingMonth = new Date();
    billingMonth.setDate(1); // First day of current month

    try {
      const result = await pool
        .request()
        .input('subscription_order_id', sql.NVarChar(36), orderId)
        .input('subscription_id', sql.NVarChar(36), subscriptionId)
        .input('billing_month', sql.Date, billingMonth)
        .input('amount', sql.Decimal(10, 2), amount)
        .query(`
          INSERT INTO dbo.subscription_orders (
            subscription_order_id, subscription_id, billing_month, amount
          )
          VALUES (
            @subscription_order_id, @subscription_id, @billing_month, @amount
          );
          
          SELECT * FROM dbo.subscription_orders WHERE subscription_order_id = @subscription_order_id;
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error creating subscription order:', error);
      throw error;
    }
  }

  /**
   * Update subscription order payment status
   */
  async updateSubscriptionOrderPaymentStatus(
    orderId: string,
    status: 'PAID' | 'FAILED',
    chargeDate?: Date,
    errorMessage?: string
  ): Promise<ISubscriptionOrder> {
    const pool = await getPool();

    try {
      const result = await pool
        .request()
        .input('subscription_order_id', sql.NVarChar(36), orderId)
        .input('payment_status', sql.NVarChar(50), status)
        .input('charge_date', sql.DateTime2, chargeDate || new Date())
        .input('error_message', sql.NVarChar(), errorMessage || null)
        .query(`
          UPDATE dbo.subscription_orders
          SET payment_status = @payment_status,
              charge_date = @charge_date,
              error_message = @error_message,
              updated_date = GETUTCDATE()
          WHERE subscription_order_id = @subscription_order_id;
          
          SELECT * FROM dbo.subscription_orders WHERE subscription_order_id = @subscription_order_id;
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error updating subscription order:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
