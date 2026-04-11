'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Coffee, Zap, Gift, Heart } from 'lucide-react';
import Link from 'next/link';

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

export function SubscriptionCard({ plan }: { plan: SubscriptionPlan }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i + 0.2,
        duration: 0.3,
      },
    }),
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.15,
        duration: 0.4,
      },
    },
  };

  // Gradient backgrounds based on plan tier
  const getGradient = () => {
    if (plan.name.includes('Deluxe')) {
      return 'bg-linear-to-br from-amber-50 via-orange-50 to-red-50 border-amber-200';
    }
    if (plan.name.includes('Premium')) {
      return 'bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 border-emerald-200';
    }
    return 'bg-linear-to-br from-slate-50 via-gray-50 to-zinc-50 border-slate-200';
  };

  const getAccentColor = () => {
    if (plan.name.includes('Deluxe')) return 'from-amber-500 to-orange-500';
    if (plan.name.includes('Premium')) return 'from-green-500 to-emerald-500';
    return 'from-slate-500 to-gray-500';
  };

  const getIconColor = () => {
    if (plan.name.includes('Deluxe')) return 'text-amber-600';
    if (plan.name.includes('Premium')) return 'text-green-600';
    return 'text-slate-600';
  };

  const getBadgeVariant = () => {
    if (plan.isPopular) return 'default';
    if (plan.name.includes('Premium')) return 'secondary';
    return 'outline';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full"
    >
      <Card
        className={`relative overflow-hidden h-full flex flex-col ${getGradient()} transition-all duration-300 border-2`}
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-white/50 to-transparent rounded-full -mr-8 -mt-8" />

        {/* Popular badge */}
        {plan.isPopular && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="absolute top-4 right-4 z-10"
          >
            <Badge
              className={`bg-linear-to-r ${getAccentColor()} text-white font-bold px-3 py-1 shadow-lg`}
            >
              Most Popular
            </Badge>
          </motion.div>
        )}

        {/* Savings badge */}
        {plan.savings && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="absolute top-4 left-4 z-10"
          >
            <Badge variant="destructive" className="font-bold px-3 py-1">
              Save {plan.savings}%
            </Badge>
          </motion.div>
        )}

        <div className="p-6 md:p-8 flex flex-col h-full gap-6 relative z-10">
          {/* Plan header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600">{plan.description}</p>
              </div>
              <motion.div
                className={`${getIconColor()}`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Coffee size={32} />
              </motion.div>
            </div>
          </div>

          {/* Price section */}
          <motion.div
            variants={priceVariants}
            className="space-y-2 pb-4 border-b border-slate-200/50"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold text-slate-900">
                ${plan.price}
              </span>
              <span className="text-slate-600 font-medium">
                /{plan.billingCycle === 'monthly' ? 'month' : plan.billingCycle === 'quarterly' ? '3 months' : 'year'}
              </span>
            </div>
            <p className="text-xs text-slate-500">First month ships in 3-5 business days</p>
          </motion.div>

          {/* Coffee details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-linear-to-r ${getAccentColor()} bg-opacity-10`}>
                <Gift className={`size-5 ${getIconColor()}`} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{plan.coffeeQuantity} bags per month</p>
                <p className="text-xs text-slate-600">Premium roasted coffee</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {plan.roastTypes.map((roast) => (
                <motion.div
                  key={roast}
                  whileHover={{ scale: 1.05 }}
                  className="text-xs px-3 py-1 bg-white/50 rounded-full text-slate-700 font-medium border border-slate-200/50"
                >
                  {roast}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-3 flex-1">
            {plan.features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="flex items-start gap-3"
              >
                {feature.included ? (
                  <motion.div
                    className="mt-0.5 p-1 rounded-full bg-linear-to-r from-green-400 to-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.1 * idx + 0.5, duration: 0.5 }}
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                ) : (
                  <div className="mt-0.5 p-1 rounded-full bg-slate-200">
                    <Check size={16} className="text-slate-400" />
                  </div>
                )}
                <span
                  className={`text-sm ${
                    feature.included ? 'text-slate-700 font-medium' : 'text-slate-500 line-through'
                  }`}
                >
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Link href={`/subscriptions/checkout?plan=${plan.id}`}>
              <Button
                className={`w-full py-6 text-base font-bold rounded-lg transition-all duration-300 ${
                  plan.isPopular
                    ? `bg-linear-to-r ${getAccentColor()} text-white shadow-lg hover:shadow-xl`
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileHover={{ x: 4 }}
                >
                  {plan.isPopular && <Zap size={18} />}
                  Get {plan.name}
                  {plan.isPopular && <Zap size={18} />}
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-1 pt-2 border-t border-slate-200/50">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                size={16}
                className="fill-red-400 text-red-400"
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
