import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDTO, UpdateSubscriptionDTO } from '../models/subscription.model';

export class SubscriptionController {
  /**
   * GET /api/subscriptions
   * Get all subscriptions for the current user
   */
  async getUserSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const subscriptions = await subscriptionService.getUserSubscriptions(userId);

      res.status(200).json({
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      });
    } catch (error) {
      console.error('Error in getUserSubscriptions:', error);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  }

  /**
   * GET /api/subscriptions/:id
   * Get subscription details by ID
   */
  async getSubscriptionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subscription = await subscriptionService.getSubscriptionById(id);

      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      console.error('Error in getSubscriptionById:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  }

  /**
   * POST /api/subscriptions
   * Create a new subscription
   */
  async createSubscription(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const data: CreateSubscriptionDTO = {
        user_id: userId,
        plan_id: req.body.plan_id,
        delivery_address_id: req.body.delivery_address_id,
        payment_method_id: req.body.payment_method_id,
      };

      // Validate required fields
      if (!data.plan_id || !data.delivery_address_id || !data.payment_method_id) {
        res.status(400).json({
          error: 'Missing required fields: plan_id, delivery_address_id, payment_method_id',
        });
        return;
      }

      const subscription = await subscriptionService.createSubscription(data);

      res.status(201).json({
        success: true,
        message: 'Subscription created successfully',
        data: subscription,
      });
    } catch (error) {
      console.error('Error in createSubscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }

  /**
   * PUT /api/subscriptions/:id
   * Update subscription details
   */
  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateSubscriptionDTO = req.body;

      // Verify subscription exists
      const subscription = await subscriptionService.getSubscriptionById(id);
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      // Verify user owns this subscription
      if (subscription.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const updated = await subscriptionService.updateSubscription(id, data);

      res.status(200).json({
        success: true,
        message: 'Subscription updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  }

  /**
   * PUT /api/subscriptions/:id/pause
   * Pause a subscription
   */
  async pauseSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await subscriptionService.getSubscriptionById(id);
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      if (subscription.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const updated = await subscriptionService.updateSubscriptionStatus(id, 'PAUSED');

      res.status(200).json({
        success: true,
        message: 'Subscription paused successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error in pauseSubscription:', error);
      res.status(500).json({ error: 'Failed to pause subscription' });
    }
  }

  /**
   * PUT /api/subscriptions/:id/resume
   * Resume a paused subscription
   */
  async resumeSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await subscriptionService.getSubscriptionById(id);
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      if (subscription.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const updated = await subscriptionService.updateSubscriptionStatus(id, 'ACTIVE');

      res.status(200).json({
        success: true,
        message: 'Subscription resumed successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error in resumeSubscription:', error);
      res.status(500).json({ error: 'Failed to resume subscription' });
    }
  }

  /**
   * DELETE /api/subscriptions/:id
   * Cancel a subscription
   */
  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const subscription = await subscriptionService.getSubscriptionById(id);
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      if (subscription.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const updated = await subscriptionService.updateSubscriptionStatus(
        id,
        'CANCELLED',
        reason
      );

      res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }

  /**
   * POST /api/subscriptions/:id/skip
   * Skip the next billing month
   */
  async skipBillingMonth(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const subscription = await subscriptionService.getSubscriptionById(id);
      if (!subscription) {
        res.status(404).json({ error: 'Subscription not found' });
        return;
      }

      if (subscription.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      // Check if user has remaining skips
      const plan = await subscriptionService.getPlanById(subscription.plan_id);
      if (subscription.skipped_months >= (plan?.max_skip_per_year || 3)) {
        res.status(400).json({
          error: 'Maximum skip limit reached',
          maxSkips: plan?.max_skip_per_year,
        });
        return;
      }

      const updated = await subscriptionService.skipNextBillingMonth(id);

      res.status(200).json({
        success: true,
        message: 'Billing month skipped successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error in skipBillingMonth:', error);
      res.status(500).json({ error: 'Failed to skip billing month' });
    }
  }

  /**
   * GET /api/subscription-plans
   * Get all available subscription plans
   */
  async getAllPlans(req: Request, res: Response): Promise<void> {
    try {
      const plans = await subscriptionService.getAllPlans();

      res.status(200).json({
        success: true,
        data: plans,
        count: plans.length,
      });
    } catch (error) {
      console.error('Error in getAllPlans:', error);
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  }

  /**
   * GET /api/subscription-plans/:id
   * Get subscription plan details
   */
  async getPlanById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await subscriptionService.getPlanById(id);

      if (!plan) {
        res.status(404).json({ error: 'Plan not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      console.error('Error in getPlanById:', error);
      res.status(500).json({ error: 'Failed to fetch plan' });
    }
  }
}

export const subscriptionController = new SubscriptionController();
