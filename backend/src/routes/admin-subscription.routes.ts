import { Router } from 'express';
import { adminSubscriptionController } from '../controllers/admin-subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Admin-only routes (should add admin role check middleware)
router.get('/subscriptions', authenticate, adminSubscriptionController.getAllSubscriptions.bind(adminSubscriptionController));
router.post('/subscription-plans', authenticate, adminSubscriptionController.createPlan.bind(adminSubscriptionController));
router.get('/subscriptions/analytics', authenticate, adminSubscriptionController.getAnalytics.bind(adminSubscriptionController));
router.get('/subscriptions/billing-failed', authenticate, adminSubscriptionController.getFailedCharges.bind(adminSubscriptionController));
router.post('/subscriptions/retry-charge', authenticate, adminSubscriptionController.retryCharge.bind(adminSubscriptionController));
router.get('/subscriptions/billing-report', authenticate, adminSubscriptionController.getBillingReport.bind(adminSubscriptionController));

export default router;
