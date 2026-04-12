'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchBackend, parseBackendResponse } from '@/lib/backend-api';

export interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  description?: string;
  price: number;
  billing_cycle: number;
  frequency: string;
  max_skip_per_year: number;
}

export interface Subscription {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  subscription_status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  start_date: string;
  next_billing_date: string;
  last_billing_date?: string;
  cancelled_date?: string;
  cancellation_reason?: string;
  skipped_months: number;
  payment_method_id?: string;
  delivery_address_id?: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

type SubscriptionResponse = {
  success: boolean;
  data: Subscription[];
  count: number;
};

type SingleSubscriptionResponse = {
  success: boolean;
  data: Subscription;
};

export function useSubscriptions(userId?: string) {
  const [state, setState] = useState<SubscriptionState>({
    subscriptions: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!userId) {
      setState({
        subscriptions: [],
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetchBackend('/api/subscriptions');
      const payload = await parseBackendResponse<SubscriptionResponse>(response);

      setState({
        subscriptions: payload.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        subscriptions: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const skipMonthly = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      try {
        const response = await fetchBackend(`/api/subscriptions/${subscriptionId}/skip`, {
          method: 'POST',
        });
        const payload = await parseBackendResponse<SingleSubscriptionResponse>(response);

        setState((prev) => ({
          ...prev,
          subscriptions: prev.subscriptions.map((subscription) =>
            subscription.subscription_id === subscriptionId ? payload.data : subscription,
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error skipping month:', error);
        return false;
      }
    },
    [],
  );

  const cancelSubscription = useCallback(
    async (subscriptionId: string, reason?: string): Promise<boolean> => {
      try {
        const response = await fetchBackend(`/api/subscriptions/${subscriptionId}`, {
          method: 'DELETE',
          body: JSON.stringify({ reason }),
        });
        const payload = await parseBackendResponse<SingleSubscriptionResponse>(response);

        setState((prev) => ({
          ...prev,
          subscriptions: prev.subscriptions.map((subscription) =>
            subscription.subscription_id === subscriptionId ? payload.data : subscription,
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        return false;
      }
    },
    [],
  );

  const pauseSubscription = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      try {
        const response = await fetchBackend(`/api/subscriptions/${subscriptionId}/pause`, {
          method: 'PUT',
        });
        const payload = await parseBackendResponse<SingleSubscriptionResponse>(response);

        setState((prev) => ({
          ...prev,
          subscriptions: prev.subscriptions.map((subscription) =>
            subscription.subscription_id === subscriptionId ? payload.data : subscription,
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error pausing subscription:', error);
        return false;
      }
    },
    [],
  );

  const resumeSubscription = useCallback(
    async (subscriptionId: string): Promise<boolean> => {
      try {
        const response = await fetchBackend(`/api/subscriptions/${subscriptionId}/resume`, {
          method: 'PUT',
        });
        const payload = await parseBackendResponse<SingleSubscriptionResponse>(response);

        setState((prev) => ({
          ...prev,
          subscriptions: prev.subscriptions.map((subscription) =>
            subscription.subscription_id === subscriptionId ? payload.data : subscription,
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error resuming subscription:', error);
        return false;
      }
    },
    [],
  );

  return {
    ...state,
    refresh,
    skipMonthly,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
  };
}
