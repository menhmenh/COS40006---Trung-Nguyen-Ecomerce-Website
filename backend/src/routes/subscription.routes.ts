import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Subscription routes (protected)
router.get('/', authenticate, subscriptionController.getUserSubscriptions.bind(subscriptionController));
router.post('/', authenticate, subscriptionController.createSubscription.bind(subscriptionController));
router.get('/plans', subscriptionController.getAllPlans.bind(subscriptionController));
router.get('/plans/:id', subscriptionController.getPlanById.bind(subscriptionController));
router.get('/:id', authenticate, subscriptionController.getSubscriptionById.bind(subscriptionController));
router.put('/:id', authenticate, subscriptionController.updateSubscription.bind(subscriptionController));
router.put('/:id/pause', authenticate, subscriptionController.pauseSubscription.bind(subscriptionController));
router.put('/:id/resume', authenticate, subscriptionController.resumeSubscription.bind(subscriptionController));
router.delete('/:id', authenticate, subscriptionController.cancelSubscription.bind(subscriptionController));
router.post('/:id/skip', authenticate, subscriptionController.skipBillingMonth.bind(subscriptionController));

export default router;
