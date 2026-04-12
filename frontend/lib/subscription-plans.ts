export type SubscriptionPlanRecord = {
  id: string
  name: string
  price: number
  billingCycle: 'monthly'
  description: string
  coffeeQuantity: number
  roastTypes: string[]
  isPopular?: boolean
  savings?: number
  features: Array<{ text: string; included: boolean }>
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanRecord[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Basic Monthly',
    price: 29.99,
    billingCycle: 'monthly',
    description: 'Perfect for coffee lovers',
    coffeeQuantity: 2,
    roastTypes: ['Medium Roast'],
    features: [
      { text: '2 bags of premium coffee per month', included: true },
      { text: 'Access to exclusive blends', included: true },
      { text: 'Free shipping', included: true },
      { text: 'Customer support', included: true },
      { text: 'Skip months anytime', included: false },
      { text: 'Priority shipping', included: false },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Premium Monthly',
    price: 49.99,
    billingCycle: 'monthly',
    description: 'For the true enthusiast',
    coffeeQuantity: 4,
    roastTypes: ['Light Roast', 'Medium Roast', 'Dark Roast'],
    isPopular: true,
    features: [
      { text: '4 bags of premium coffee per month', included: true },
      { text: 'Access to exclusive blends', included: true },
      { text: 'Free priority shipping', included: true },
      { text: '24/7 customer support', included: true },
      { text: 'Skip up to 3 months per year', included: true },
      { text: 'Quarterly surprise gift', included: true },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Deluxe Monthly',
    price: 79.99,
    billingCycle: 'monthly',
    description: 'The ultimate coffee experience',
    coffeeQuantity: 6,
    roastTypes: ['Light', 'Medium', 'Dark', 'Single Origin'],
    savings: 15,
    features: [
      { text: '6 bags of premium coffee per month', included: true },
      { text: 'Access to exclusive & rare blends', included: true },
      { text: 'Free express shipping', included: true },
      { text: 'Premium customer support', included: true },
      { text: 'Skip up to 6 months per year', included: true },
      { text: 'Monthly exclusive gift items', included: true },
    ],
  },
]
