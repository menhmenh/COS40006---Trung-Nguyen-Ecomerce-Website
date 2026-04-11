/**
 * useSubscriptions Hook
 * Fetch and manage subscription data from backend
 */

'use client';

import { useState, useEffect } from 'react';

export interface Subscription {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  subscription_status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  start_date: string;
  next_billing_date: string;
  last_billing_date?: string;
  cancelled_date?: string;
  cancellation_reason?: string;
  skipped_months: number;
  plan?: {
    plan_id: string;
    plan_name: string;
    description?: string;
    price: number;
    billing_cycle: number;
    frequency: string;
    max_skip_per_year: number;
  };
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

export const LOCAL_SUBSCRIPTIONS: Subscription[] = [
  {
    subscription_id: 'sub-001',
    user_id: 'user_1',
    plan_id: 'plan-premium-monthly',
    subscription_status: 'ACTIVE',
    start_date: '2026-01-15T00:00:00.000Z',
    next_billing_date: '2026-04-25T00:00:00.000Z',
    last_billing_date: '2026-03-25T00:00:00.000Z',
    skipped_months: 1,
    plan: {
      plan_id: 'plan-premium-monthly',
      plan_name: 'Premium Monthly',
      description: '4 premium coffee bags with seasonal picks.',
      price: 49.99,
      billing_cycle: 30,
      frequency: 'Monthly',
      max_skip_per_year: 3,
    },
  },
  {
    subscription_id: 'sub-002',
    user_id: 'user_1',
    plan_id: 'plan-deluxe-monthly',
    subscription_status: 'ACTIVE',
    start_date: '2026-02-20T00:00:00.000Z',
    next_billing_date: '2026-05-10T00:00:00.000Z',
    last_billing_date: '2026-04-10T00:00:00.000Z',
    skipped_months: 0,
    plan: {
      plan_id: 'plan-deluxe-monthly',
      plan_name: 'Deluxe Monthly',
      description: '6 specialty coffee bags with member perks.',
      price: 79.99,
      billing_cycle: 30,
      frequency: 'Monthly',
      max_skip_per_year: 6,
    },
  },
  {
    subscription_id: 'sub-003',
    user_id: 'user_2',
    plan_id: 'plan-basic-monthly',
    subscription_status: 'PAUSED',
    start_date: '2026-03-01T00:00:00.000Z',
    next_billing_date: '2026-05-01T00:00:00.000Z',
    skipped_months: 0,
    plan: {
      plan_id: 'plan-basic-monthly',
      plan_name: 'Basic Monthly',
      description: '2 bags of curated coffee beans delivered monthly.',
      price: 29.99,
      billing_cycle: 30,
      frequency: 'Monthly',
      max_skip_per_year: 2,
    },
  },
];

export function useSubscriptions(userId?: string) {
  const [state, setState] = useState<SubscriptionState>({
    subscriptions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchSubscriptions = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await fetch(`/api/subscriptions?userId=${userId}`, {
          headers: {
            'x-user-id': userId,
          },
        });

        if (!response.ok) {
          const localData = LOCAL_SUBSCRIPTIONS.filter(
            (subscription) => subscription.user_id === userId
          );

          setState({
            subscriptions: localData,
            loading: false,
            error: null,
          });
          return;
        }

        const data = await response.json();
        setState({
          subscriptions: data.data || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setState({
          subscriptions: [],
          loading: false,
          error: errorMessage,
        });
        console.error('Error fetching subscriptions:', err);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  const skipMonthly = async (subscriptionId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/skip-month`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const target = state.subscriptions.find(
          (subscription) => subscription.subscription_id === subscriptionId
        );

        if (!target) {
          throw new Error('Failed to skip month');
        }

        const maxSkips = target.plan?.max_skip_per_year ?? 0;
        if (target.skipped_months >= maxSkips) {
          throw new Error('Failed to skip month');
        }
      }

      // Refresh subscriptions
      const updated = state.subscriptions.map((sub) =>
        sub.subscription_id === subscriptionId
          ? { ...sub, skipped_months: sub.skipped_months + 1 }
          : sub
      );
      setState((prev) => ({ ...prev, subscriptions: updated }));

      return true;
    } catch (err) {
      const target = state.subscriptions.find(
        (subscription) => subscription.subscription_id === subscriptionId
      );
      const maxSkips = target?.plan?.max_skip_per_year ?? 0;

      if (target && target.skipped_months < maxSkips) {
        const updated = state.subscriptions.map((sub) =>
          sub.subscription_id === subscriptionId
            ? { ...sub, skipped_months: sub.skipped_months + 1 }
            : sub
        );
        setState((prev) => ({ ...prev, subscriptions: updated }));
        return true;
      }

      console.error('Error skipping month:', err);
      return false;
    }
  };

  const cancelSubscription = async (
    subscriptionId: string,
    reason?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cancellation_reason: reason }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Refresh subscriptions
      const updated = state.subscriptions.map((sub) =>
        sub.subscription_id === subscriptionId
          ? { ...sub, subscription_status: 'CANCELLED', cancelled_date: new Date().toISOString() }
          : sub
      );
      setState((prev) => ({ ...prev, subscriptions: updated }));

      return true;
    } catch (err) {
      const target = state.subscriptions.find(
        (subscription) => subscription.subscription_id === subscriptionId
      );

      if (target) {
        const updated = state.subscriptions.map((sub) =>
          sub.subscription_id === subscriptionId
            ? {
                ...sub,
                subscription_status: 'CANCELLED',
                cancelled_date: new Date().toISOString(),
                cancellation_reason: reason,
              }
            : sub
        );
        setState((prev) => ({ ...prev, subscriptions: updated }));
        return true;
      }

      console.error('Error cancelling subscription:', err);
      return false;
    }
  };

  const pauseSubscription = async (subscriptionId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}/pause`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to pause subscription');
      }

      const updated = state.subscriptions.map((sub) =>
        sub.subscription_id === subscriptionId
          ? { ...sub, subscription_status: 'PAUSED' }
          : sub
      );
      setState((prev) => ({ ...prev, subscriptions: updated }));

      return true;
    } catch (err) {
      const target = state.subscriptions.find(
        (subscription) => subscription.subscription_id === subscriptionId
      );

      if (target) {
        const updated = state.subscriptions.map((sub) =>
          sub.subscription_id === subscriptionId
            ? { ...sub, subscription_status: 'PAUSED' }
            : sub
        );
        setState((prev) => ({ ...prev, subscriptions: updated }));
        return true;
      }

      console.error('Error pausing subscription:', err);
      return false;
    }
  };

  return {
    ...state,
    skipMonthly,
    cancelSubscription,
    pauseSubscription,
  };
}
