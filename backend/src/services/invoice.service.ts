/**
 * Invoice Generation Service
 * Phase 3: Invoice System Implementation
 * Handles invoice creation, storage, and retrieval for subscriptions
 */

import * as sql from 'mssql';
import { getPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface Invoice {
  invoice_id: string;
  subscription_order_id: string;
  subscription_id: string;
  user_id: string;
  invoice_number: string;
  billing_date: Date;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  invoice_url?: string;
  pdf_url?: string;
  sent_date?: Date;
  payment_date?: Date;
  notes?: string;
  created_date: Date;
  updated_date: Date;
}

class InvoiceService {
  /**
   * Create invoice for subscription order
   */
  async createInvoice(
    subscriptionOrderId: string,
    subscriptionId: string,
    userId: string,
    amount: number,
    taxAmount: number = 0,
    notes?: string
  ): Promise<Invoice> {
    try {
      const pool = await getPool();
      const invoiceId = uuidv4();
      const invoiceNumber = await this.generateInvoiceNumber();
      const billingDate = new Date();
      const totalAmount = amount + taxAmount;

      // Create invoice table if it doesn't exist
      await this.ensureInvoiceTableExists();

      // Insert invoice
      const result = await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .input('subscription_order_id', sql.Char(36), subscriptionOrderId)
        .input('subscription_id', sql.Char(36), subscriptionId)
        .input('user_id', sql.Char(36), userId)
        .input('invoice_number', sql.VarChar(50), invoiceNumber)
        .input('billing_date', sql.DateTime2, billingDate)
        .input('amount', sql.Decimal(10, 2), amount)
        .input('tax_amount', sql.Decimal(10, 2), taxAmount)
        .input('total_amount', sql.Decimal(10, 2), totalAmount)
        .input('status', sql.VarChar(20), 'DRAFT')
        .input('notes', sql.NVarChar(sql.MAX), notes || null)
        .query(`
          INSERT INTO dbo.invoices
            (invoice_id, subscription_order_id, subscription_id, user_id, invoice_number, 
             billing_date, amount, tax_amount, total_amount, status, notes)
          VALUES
            (@invoice_id, @subscription_order_id, @subscription_id, @user_id, @invoice_number,
             @billing_date, @amount, @tax_amount, @total_amount, @status, @notes)
        `);

      console.log(`✅ Invoice created: ${invoiceNumber}`);

      return {
        invoice_id: invoiceId,
        subscription_order_id: subscriptionOrderId,
        subscription_id: subscriptionId,
        user_id: userId,
        invoice_number: invoiceNumber,
        billing_date: billingDate,
        amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'DRAFT',
        notes,
        created_date: new Date(),
        updated_date: new Date(),
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .query(`
          SELECT * FROM dbo.invoices
          WHERE invoice_id = @invoice_id
        `);

      return result.recordset?.[0] || null;
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoices by subscription
   */
  async getInvoicesBySubscription(
    subscriptionId: string,
    limit: number = 12
  ): Promise<Invoice[]> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('subscription_id', sql.Char(36), subscriptionId)
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) *
          FROM dbo.invoices
          WHERE subscription_id = @subscription_id
          ORDER BY billing_date DESC
        `);

      return result.recordset || [];
    } catch (error) {
      console.error('Error getting invoices by subscription:', error);
      throw error;
    }
  }

  /**
   * Get invoices by user
   */
  async getInvoicesByUser(userId: string, limit: number = 50): Promise<Invoice[]> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) *
          FROM dbo.invoices
          WHERE user_id = @user_id
          ORDER BY billing_date DESC
        `);

      return result.recordset || [];
    } catch (error) {
      console.error('Error getting invoices by user:', error);
      throw error;
    }
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(
    invoiceId: string,
    status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  ): Promise<void> {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .input('status', sql.VarChar(20), status)
        .input('current_date', sql.DateTime2, new Date())
        .query(`
          UPDATE dbo.invoices
          SET status = @status, updated_date = @current_date
          WHERE invoice_id = @invoice_id
        `);

      console.log(`✅ Invoice ${invoiceId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  /**
   * Mark invoice as sent
   */
  async markInvoiceAsSent(invoiceId: string): Promise<void> {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .input('sent_date', sql.DateTime2, new Date())
        .query(`
          UPDATE dbo.invoices
          SET status = 'SENT', sent_date = @sent_date, updated_date = GETUTCDATE()
          WHERE invoice_id = @invoice_id
        `);

      console.log(`✅ Invoice ${invoiceId} marked as sent`);
    } catch (error) {
      console.error('Error marking invoice as sent:', error);
      throw error;
    }
  }

  /**
   * Mark invoice as paid
   */
  async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .input('payment_date', sql.DateTime2, new Date())
        .query(`
          UPDATE dbo.invoices
          SET status = 'PAID', payment_date = @payment_date, updated_date = GETUTCDATE()
          WHERE invoice_id = @invoice_id
        `);

      console.log(`✅ Invoice ${invoiceId} marked as paid`);
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  /**
   * Update invoice URL
   */
  async updateInvoiceUrl(invoiceId: string, invoiceUrl: string, pdfUrl?: string): Promise<void> {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('invoice_id', sql.Char(36), invoiceId)
        .input('invoice_url', sql.NVarChar(500), invoiceUrl)
        .input('pdf_url', sql.NVarChar(500), pdfUrl || null)
        .query(`
          UPDATE dbo.invoices
          SET invoice_url = @invoice_url,
              pdf_url = @pdf_url,
              updated_date = GETUTCDATE()
          WHERE invoice_id = @invoice_id
        `);
    } catch (error) {
      console.error('Error updating invoice URL:', error);
      throw error;
    }
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(daysOverdue: number = 30): Promise<Invoice[]> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('days_overdue', sql.Int, daysOverdue)
        .query(`
          SELECT *
          FROM dbo.invoices
          WHERE status NOT IN ('PAID', 'CANCELLED')
            AND DATEDIFF(DAY, billing_date, GETUTCDATE()) > @days_overdue
          ORDER BY billing_date ASC
        `);

      return result.recordset || [];
    } catch (error) {
      console.error('Error getting overdue invoices:', error);
      throw error;
    }
  }

  /**
   * Get invoice summary for dashboard
   */
  async getInvoiceSummary(userId: string): Promise<{
    total_invoices: number;
    total_revenue: number;
    paid_invoices: number;
    unpaid_invoices: number;
    overdue_invoices: number;
  }> {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('user_id', sql.Char(36), userId)
        .query(`
          SELECT 
            COUNT(*) as total_invoices,
            SUM(total_amount) as total_revenue,
            SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) as paid_invoices,
            SUM(CASE WHEN status NOT IN ('PAID', 'CANCELLED') THEN 1 ELSE 0 END) as unpaid_invoices,
            SUM(CASE WHEN status NOT IN ('PAID', 'CANCELLED') AND DATEDIFF(DAY, billing_date, GETUTCDATE()) > 30 THEN 1 ELSE 0 END) as overdue_invoices
          FROM dbo.invoices
          WHERE user_id = @user_id
        `);

      const summary = result.recordset?.[0];
      return {
        total_invoices: summary?.total_invoices || 0,
        total_revenue: parseFloat(summary?.total_revenue || 0),
        paid_invoices: summary?.paid_invoices || 0,
        unpaid_invoices: summary?.unpaid_invoices || 0,
        overdue_invoices: summary?.overdue_invoices || 0,
      };
    } catch (error) {
      console.error('Error getting invoice summary:', error);
      throw error;
    }
  }

  /**
   * Generate invoice number with format: INV-YYYYMMDD-XXXX
   */
  private async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `INV-${dateStr}-${randomNum}`;
  }

  /**
   * Ensure invoice table exists in database
   */
  private async ensureInvoiceTableExists(): Promise<void> {
    try {
      const pool = await getPool();

      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'invoices')
        BEGIN
          CREATE TABLE dbo.invoices (
            invoice_id CHAR(36) PRIMARY KEY,
            subscription_order_id CHAR(36) NOT NULL,
            subscription_id CHAR(36) NOT NULL,
            user_id CHAR(36) NOT NULL,
            invoice_number VARCHAR(50) NOT NULL UNIQUE,
            billing_date DATETIME2 NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(20) DEFAULT 'DRAFT',
            invoice_url NVARCHAR(500),
            pdf_url NVARCHAR(500),
            sent_date DATETIME2,
            payment_date DATETIME2,
            notes NVARCHAR(MAX),
            created_date DATETIME2 DEFAULT GETUTCDATE(),
            updated_date DATETIME2 DEFAULT GETUTCDATE(),
            FOREIGN KEY (subscription_order_id) REFERENCES dbo.subscription_orders(subscription_order_id),
            FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
            INDEX idx_user (user_id),
            INDEX idx_subscription (subscription_id),
            INDEX idx_status (status),
            INDEX idx_billing_date (billing_date),
            INDEX idx_invoice_number (invoice_number)
          )
        END
      `);
    } catch (error) {
      // Table might already exist, continue
      if (error instanceof Error && !error.message.includes('already exists')) {
        console.warn('Warning creating invoices table:', error);
      }
    }
  }
}

export const invoiceService = new InvoiceService();
