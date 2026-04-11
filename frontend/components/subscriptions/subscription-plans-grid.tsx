'use client';

import { motion } from 'framer-motion';
import { SubscriptionCard } from './subscription-card';

interface SubscriptionFeature {
  text: string;
  included: boolean;
}

interface SubscriptionPlan {
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

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

export function SubscriptionPlansGrid({ plans }: SubscriptionPlansGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,

      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
    >
      {plans.map((plan, index) => (
        <motion.div key={plan.id} variants={itemVariants}>
          <SubscriptionCard plan={plan} />
        </motion.div>
      ))}
    </motion.div>
  );
}
