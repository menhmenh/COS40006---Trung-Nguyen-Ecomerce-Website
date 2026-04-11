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
          throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
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
        throw new Error('Failed to skip month');
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
