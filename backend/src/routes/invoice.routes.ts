/**
 * Invoice Routes
 * Phase 3: Invoice API Endpoints
 */

import express, { Router, Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';

const router: Router = express.Router();

/**
 * Get invoices for current user
 * GET /api/invoices
 * Query params: limit (default: 50)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const invoices = await invoiceService.getInvoicesByUser(userId, limit);

    return res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

/**
 * Get invoice by ID
 * GET /api/invoices/:invoiceId
 */
router.get('/:invoiceId', async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await invoiceService.getInvoiceById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Mark as viewed
    await invoiceService.updateInvoiceStatus(invoiceId, 'VIEWED');

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

/**
 * Get invoices by subscription
 * GET /api/subscriptions/:subscriptionId/invoices
 */
router.get('/subscription/:subscriptionId', async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;

    const invoices = await invoiceService.getInvoicesBySubscription(subscriptionId, limit);

    return res.status(200).json({
      success: true,
      data: invoices,
      count: invoices.length,
    });
  } catch (error) {
    console.error('Error fetching subscription invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription invoices' });
  }
});

/**
 * Get invoice summary for dashboard
 * GET /api/invoices/summary/dashboard
 */
router.get('/summary/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = req.body.user_id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const summary = await invoiceService.getInvoiceSummary(userId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching invoice summary:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice summary' });
  }
});

/**
 * Admin: Get overdue invoices
 * GET /api/admin/invoices/overdue
 */
router.get('/admin/overdue', async (req: Request, res: Response) => {
  try {
    const daysOverdue = parseInt(req.query.daysOverdue as string) || 30;
    const overdueInvoices = await invoiceService.getOverdueInvoices(daysOverdue);

    return res.status(200).json({
      success: true,
      data: overdueInvoices,
      count: overdueInvoices.length,
    });
  } catch (error) {
    console.error('Error fetching overdue invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch overdue invoices' });
  }
});

export default router;
