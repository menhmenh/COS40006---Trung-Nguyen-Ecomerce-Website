/**
 * Utility functions for subscription operations
 */

/**
 * Calculate next billing date based on billing cycle
 */
export function calculateNextBillingDate(startDate: Date, billingCycleDays: number = 30): Date {
  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + billingCycleDays);
  return nextDate;
}

/**
 * Format subscription status for display
 */
export function formatSubscriptionStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    ACTIVE: '🟢 Active',
    PAUSED: '🟡 Paused',
    CANCELLED: '🔴 Cancelled',
    PENDING: '🔵 Pending',
  };
  return statusMap[status] || status;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Check if subscription is due for billing
 */
export function isSubscriptionDueForBilling(nextBillingDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextBillingDate <= today;
}

/**
 * Calculate subscription metrics
 */
export function calculateSubscriptionMetrics(subscriptions: any[]) {
  return {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.subscription_status === 'ACTIVE').length,
    paused: subscriptions.filter((s) => s.subscription_status === 'PAUSED').length,
    cancelled: subscriptions.filter((s) => s.subscription_status === 'CANCELLED').length,
    pendingBilling: subscriptions.filter((s) => isSubscriptionDueForBilling(s.next_billing_date)).length,
  };
}
