import express, { Router, Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
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

router.get('/:invoiceId', authenticate, async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await invoiceService.getInvoiceById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.user_id !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

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

router.get('/subscription/:subscriptionId', authenticate, async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 12;
    const invoices = await invoiceService.getInvoicesBySubscription(subscriptionId, limit);
    const filtered = invoices.filter((invoice) => invoice.user_id === req.user?.id);

    return res.status(200).json({
      success: true,
      data: filtered,
      count: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching subscription invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch subscription invoices' });
  }
});

router.get('/summary/dashboard', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
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

router.get('/admin/overdue', authenticate, async (req: Request, res: Response) => {
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
