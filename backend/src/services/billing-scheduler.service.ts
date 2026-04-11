/**
 * Billing Scheduler Service
 * Handles automated recurring billing using node-cron
 * Phase 3: Billing Automation Implementation
 */

import cron from 'node-cron';
import { billingService } from './billing.service';
import { getPool } from '../config/database';
import * as sql from 'mssql';

interface ScheduledJob {
  name: string;
  task: cron.ScheduledTask | null;
  lastRun?: Date;
  nextRun?: Date;
  status: 'running' | 'stopped' | 'error';
}

class BillingScheduler {
  private jobs: Map<string, ScheduledJob> = new Map();
  private isInitialized = false;
  
  // Configuration
  private readonly BILLING_CRON_SCHEDULE = '0 2 * * *'; // Run daily at 2 AM UTC
  private readonly RETRY_CRON_SCHEDULE = '0 3 * * *'; // Run retry at 3 AM UTC
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY_HOURS = 24;

  /**
   * Initialize the billing scheduler
   * Call this in the main application startup
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('ℹ️  Billing Scheduler already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Billing Scheduler...');

      // Schedule daily billing job
      this.scheduleDailyBilling();

      // Schedule retry failed charges job
      this.scheduleFailedChargeRetry();

      // Schedule billing summary report
      this.scheduleBillingReport();

      this.isInitialized = true;
      console.log('✅ Billing Scheduler initialized successfully');
      console.log('📅 Scheduled Jobs:');
      this.jobs.forEach((job, name) => {
        console.log(`   - ${name}: ${job.status}`);
      });
    } catch (error) {
      console.error('❌ Failed to initialize Billing Scheduler:', error);
      throw error;
    }
  }

  /**
   * Schedule daily billing job
   * Processes subscriptions due for billing
   */
  private scheduleDailyBilling(): void {
    console.log(`📋 Scheduling daily billing at: ${this.BILLING_CRON_SCHEDULE}`);

    const task = cron.schedule(this.BILLING_CRON_SCHEDULE, async () => {
      const jobName = 'Daily Billing';
      console.log(`\n⏰ [${new Date().toISOString()}] Starting ${jobName}...`);

      const job = this.jobs.get(jobName);
      if (job) {
        job.lastRun = new Date();
        job.status = 'running';
      }

      try {
        const result = await billingService.processMontlyBilling();
        console.log(
          `✅ ${jobName} completed: ${result.processed} processed, ${result.failed} failed`
        );

        // Log billing summary to database
        await this.logBillingSummary('DAILY_BILLING', result.processed, result.failed, 'SUCCESS');

        if (job) {
          job.status = 'running';
          job.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
      } catch (error) {
        console.error(`❌ Error in ${jobName}:`, error);
        await this.logBillingSummary(
          'DAILY_BILLING',
          0,
          0,
          'ERROR',
          error instanceof Error ? error.message : 'Unknown error'
        );

        if (job) {
          job.status = 'error';
        }
      }
    });

    // Set task to not require specific timezone (use system timezone)
    this.jobs.set('Daily Billing', {
      name: 'Daily Billing',
      task,
      status: 'running',
      nextRun: this.calculateNextRun(this.BILLING_CRON_SCHEDULE),
    });
  }

  /**
   * Schedule failed charge retry job
   * Retries charges that failed in previous attempts
   */
  private scheduleFailedChargeRetry(): void {
    console.log(`🔄 Scheduling failed charge retry at: ${this.RETRY_CRON_SCHEDULE}`);

    const task = cron.schedule(this.RETRY_CRON_SCHEDULE, async () => {
      const jobName = 'Retry Failed Charges';
      console.log(`\n⏰ [${new Date().toISOString()}] Starting ${jobName}...`);

      const job = this.jobs.get(jobName);
      if (job) {
        job.lastRun = new Date();
        job.status = 'running';
      }

      try {
        const retryCount = await this.retryFailedCharges();
        console.log(`✅ ${jobName} completed: ${retryCount} charges retried`);

        await this.logBillingSummary(
          'RETRY_CHARGES',
          retryCount,
          0,
          'SUCCESS'
        );

        if (job) {
          job.status = 'running';
          job.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
      } catch (error) {
        console.error(`❌ Error in ${jobName}:`, error);
        await this.logBillingSummary(
          'RETRY_CHARGES',
          0,
          0,
          'ERROR',
          error instanceof Error ? error.message : 'Unknown error'
        );

        if (job) {
          job.status = 'error';
        }
      }
    });

    this.jobs.set('Retry Failed Charges', {
      name: 'Retry Failed Charges',
      task,
      status: 'running',
      nextRun: this.calculateNextRun(this.RETRY_CRON_SCHEDULE),
    });
  }

  /**
   * Schedule billing summary report job
   * Generates daily billing reports
   */
  private scheduleBillingReport(): void {
    const reportSchedule = '0 4 * * *'; // Run at 4 AM UTC
    console.log(`📊 Scheduling billing report at: ${reportSchedule}`);

    const task = cron.schedule(reportSchedule, async () => {
      const jobName = 'Billing Report';
      console.log(`\n⏰ [${new Date().toISOString()}] Generating ${jobName}...`);

      const job = this.jobs.get(jobName);
      if (job) {
        job.lastRun = new Date();
        job.status = 'running';
      }

      try {
        const report = await this.generateBillingReport();
        console.log(`✅ ${jobName} generated:`, report);

        if (job) {
          job.status = 'running';
          job.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
      } catch (error) {
        console.error(`❌ Error in ${jobName}:`, error);

        if (job) {
          job.status = 'error';
        }
      }
    });

    this.jobs.set('Billing Report', {
      name: 'Billing Report',
      task,
      status: 'running',
      nextRun: this.calculateNextRun(reportSchedule),
    });
  }

  /**
   * Retry failed charges
   * Finds charges that failed and retries them up to MAX_RETRY_ATTEMPTS
   */
  private async retryFailedCharges(): Promise<number> {
    try {
      const pool = await getPool();

      // Get failed orders that haven't exceeded retry limit
      const failedOrders = await pool
        .request()
        .input('max_retries', sql.Int, this.MAX_RETRY_ATTEMPTS)
        .input('retry_delay_hours', sql.Int, this.RETRY_DELAY_HOURS)
        .query(`
          SELECT subscription_order_id, subscription_id, amount
          FROM dbo.subscription_orders
          WHERE payment_status = 'FAILED'
            AND (retry_count IS NULL OR retry_count < @max_retries)
            AND (last_retry_date IS NULL 
              OR DATEDIFF(HOUR, last_retry_date, GETUTCDATE()) >= @retry_delay_hours)
          ORDER BY billing_month ASC
        `);

      let retryCount = 0;

      for (const order of failedOrders.recordset) {
        try {
          const success = await billingService.retryFailedCharge(order.subscription_order_id);

          if (success) {
            // Update retry count
            await pool
              .request()
              .input('subscription_order_id', sql.Char(36), order.subscription_order_id)
              .query(`
                UPDATE dbo.subscription_orders
                SET retry_count = ISNULL(retry_count, 0) + 1,
                    last_retry_date = GETUTCDATE(),
                    payment_status = 'SUCCEEDED',
                    updated_date = GETUTCDATE()
                WHERE subscription_order_id = @subscription_order_id
              `);

            console.log(`✅ Successfully retried charge: ${order.subscription_order_id}`);
            retryCount++;
          } else {
            // Increment retry count but keep as failed
            await pool
              .request()
              .input('subscription_order_id', sql.Char(36), order.subscription_order_id)
              .query(`
                UPDATE dbo.subscription_orders
                SET retry_count = ISNULL(retry_count, 0) + 1,
                    last_retry_date = GETUTCDATE()
                WHERE subscription_order_id = @subscription_order_id
              `);

            console.log(`⚠️  Retry failed, will try later: ${order.subscription_order_id}`);
          }
        } catch (error) {
          console.error(`❌ Error retrying order ${order.subscription_order_id}:`, error);
        }
      }

      return retryCount;
    } catch (error) {
      console.error('Error in retryFailedCharges:', error);
      throw error;
    }
  }

  /**
   * Generate daily billing report
   */
  private async generateBillingReport(): Promise<any> {
    try {
      const pool = await getPool();
      const today = new Date().toISOString().split('T')[0];

      const report = await pool
        .request()
        .input('billing_date', sql.Date, new Date(today))
        .query(`
          SELECT 
            COUNT(DISTINCT subscription_id) as total_subscriptions,
            COUNT(subscription_order_id) as total_charges,
            SUM(CASE WHEN payment_status = 'SUCCEEDED' THEN amount ELSE 0 END) as total_revenue,
            SUM(CASE WHEN payment_status = 'FAILED' THEN 1 ELSE 0 END) as failed_charges,
            SUM(CASE WHEN payment_status = 'PENDING_PAYMENT_METHOD' THEN 1 ELSE 0 END) as pending_charges
          FROM dbo.subscription_orders
          WHERE CAST(billing_month AS DATE) = @billing_date
        `);

      const stats = report.recordset[0];
      console.log(`📊 Billing Report for ${today}:`, stats);

      // Save report to database
      await pool
        .request()
        .input('report_date', sql.Date, new Date(today))
        .input('total_subscriptions', sql.Int, stats.total_subscriptions || 0)
        .input('total_charges', sql.Int, stats.total_charges || 0)
        .input('total_revenue', sql.Decimal(15, 2), stats.total_revenue || 0)
        .input('failed_charges', sql.Int, stats.failed_charges || 0)
        .input('pending_charges', sql.Int, stats.pending_charges || 0)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'billing_reports')
          BEGIN
            CREATE TABLE dbo.billing_reports (
              report_id CHAR(36) PRIMARY KEY,
              report_date DATE NOT NULL,
              total_subscriptions INT,
              total_charges INT,
              total_revenue DECIMAL(15,2),
              failed_charges INT,
              pending_charges INT,
              created_date DATETIME2 DEFAULT GETUTCDATE()
            )
          END

          INSERT INTO dbo.billing_reports 
            (report_id, report_date, total_subscriptions, total_charges, total_revenue, failed_charges, pending_charges)
          VALUES 
            (NEWID(), @report_date, @total_subscriptions, @total_charges, @total_revenue, @failed_charges, @pending_charges)
        `);

      return stats;
    } catch (error) {
      console.error('Error generating billing report:', error);
      throw error;
    }
  }

  /**
   * Log billing summary to database for monitoring
   */
  private async logBillingSummary(
    jobType: string,
    successCount: number,
    failureCount: number,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      const pool = await getPool();

      // Create table if it doesn't exist
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'billing_job_logs')
        BEGIN
          CREATE TABLE dbo.billing_job_logs (
            job_log_id CHAR(36) PRIMARY KEY,
            job_type VARCHAR(50) NOT NULL,
            success_count INT DEFAULT 0,
            failure_count INT DEFAULT 0,
            status VARCHAR(20) NOT NULL,
            error_message NVARCHAR(MAX),
            run_date DATETIME2 DEFAULT GETUTCDATE(),
            created_date DATETIME2 DEFAULT GETUTCDATE()
          )
        END
      `);

      // Insert log
      await pool
        .request()
        .input('job_id', sql.Char(36), this.generateId())
        .input('job_type', sql.VarChar(50), jobType)
        .input('success_count', sql.Int, successCount)
        .input('failure_count', sql.Int, failureCount)
        .input('status', sql.VarChar(20), status)
        .input('error_message', sql.NVarChar(sql.MAX), errorMessage || null)
        .query(`
          INSERT INTO dbo.billing_job_logs 
            (job_log_id, job_type, success_count, failure_count, status, error_message)
          VALUES 
            (@job_id, @job_type, @success_count, @failure_count, @status, @error_message)
        `);
    } catch (error) {
      console.error('Error logging billing summary:', error);
      // Don't throw - logging shouldn't break the process
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll(): void {
    console.log('🛑 Stopping all billing scheduler jobs...');
    this.jobs.forEach((job) => {
      if (job.task) {
        job.task.stop();
        job.status = 'stopped';
      }
    });
    console.log('✅ All jobs stopped');
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    initialized: boolean;
    jobs: Array<{
      name: string;
      status: string;
      lastRun?: Date;
      nextRun?: Date;
    }>;
  } {
    return {
      initialized: this.isInitialized,
      jobs: Array.from(this.jobs.values()).map((job) => ({
        name: job.name,
        status: job.status,
        lastRun: job.lastRun,
        nextRun: job.nextRun,
      })),
    };
  }

  /**
   * Helper: Calculate next run time for a cron schedule
   */
  private calculateNextRun(cronExpression: string): Date {
    // Simple calculation - add 24 hours for daily jobs
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  /**
   * Helper: Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const billingScheduler = new BillingScheduler();
