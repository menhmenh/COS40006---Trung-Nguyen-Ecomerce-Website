// Export all subscription components

export { SubscriptionCard } from './subscription-card';
export { SubscriptionPlansGrid } from './subscription-plans-grid';
export { SubscriptionDetailsCard } from './subscription-details-card';
export { SubscriptionHeroSection } from './subscription-hero-section';

// Types
export interface SubscriptionFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  description: string;
  features: SubscriptionFeature[];
  isPopular?: boolean;
  savings?: number;
  coffeeQuantity: number;
  roastTypes: string[];
}

export interface SubscriptionData {
  id: string;
  planName: string;
  price: number;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  createdDate: string;
  coffeeQuantity: number;
  skippedMonths: number;
  maxSkipPerYear: number;
}
