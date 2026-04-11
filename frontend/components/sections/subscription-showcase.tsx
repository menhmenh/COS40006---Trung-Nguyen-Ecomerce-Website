'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coffee, Zap, Heart, ArrowRight, Check } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
  hover: {
    y: -8,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3 },
  },
}

export function SubscriptionShowcase() {
  const plans = [
    {
      name: 'Basic Monthly',
      price: '$29.99',
      description: 'Perfect for coffee lovers',
      features: [
        '2 bags of premium coffee',
        'Access to exclusive blends',
        'Free shipping',
        'Skip months anytime',
      ],
      icon: Coffee,
      gradient: 'from-amber-50 to-orange-50',
      accentColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Premium Monthly',
      price: '$49.99',
      description: 'For the true enthusiast',
      features: [
        '4 bags of premium coffee',
        'Free priority shipping',
        '24/7 customer support',
        'Quarterly surprise gift',
      ],
      icon: Zap,
      gradient: 'from-green-50 to-emerald-50',
      accentColor: 'text-green-600',
      borderColor: 'border-green-200',
      badgeColor: 'bg-green-100 text-green-800',
      popular: true,
    },
    {
      name: 'Deluxe Monthly',
      price: '$79.99',
      description: 'The ultimate experience',
      features: [
        '6 bags of premium coffee',
        'Access to rare blends',
        'Free express shipping',
        'Monthly exclusive gifts',
      ],
      icon: Heart,
      gradient: 'from-red-50 to-rose-50',
      accentColor: 'text-red-600',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-800',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-linear-to-b from-white via-slate-50/30 to-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-amber-100/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-green-100/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-0 px-4 py-2 text-sm font-semibold"
              >
                <Coffee className="w-4 h-4 mr-2" />
                COFFEE MONTHLY BOX
              </Badge>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3E2723] tracking-tight">
              Your Perfect Coffee
              <br />
              <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Delivered Monthly
              </span>
            </h2>

            <p className="text-lg md:text-xl text-[#5D4037] leading-relaxed max-w-2xl mx-auto">
              Discover freshly roasted, single-origin coffee curated just for you. Skip months, handpick your roasts, and enjoy world-class coffee delivered to your door.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-[#5D4037]">
                <Check className="w-5 h-5 text-green-600" />
                <span>100% Fresh Roasted</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5D4037]">
                <Check className="w-5 h-5 text-green-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5D4037]">
                <Check className="w-5 h-5 text-green-600" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </motion.div>

          {/* Plans Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 lg:gap-10"
            variants={containerVariants}
          >
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.name}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                    plan.popular
                      ? `${plan.gradient} ${plan.borderColor} shadow-xl`
                      : `bg-white ${plan.borderColor} border`
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1.5 font-bold">
                        MOST POPULAR
                      </Badge>
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-lg ${plan.badgeColor} flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Icon className={`w-7 h-7 ${plan.accentColor}`} />
                  </motion.div>

                  {/* Plan Name & Price */}
                  <h3 className="text-2xl font-bold text-[#3E2723] mb-2">{plan.name}</h3>
                  <p className="text-[#5D4037] text-sm mb-4">{plan.description}</p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mb-6"
                  >
                    <span className={`text-4xl font-bold ${plan.accentColor}`}>{plan.price}</span>
                    <span className="text-[#5D4037] text-sm">/month</span>
                  </motion.div>

                  {/* Features */}
                  <motion.ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIdx) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (featureIdx + 1), duration: 0.3 }}
                        className="flex items-start gap-3 text-[#5D4037]"
                      >
                        <Check className={`w-5 h-5 mt-0.5 shrink-0 ${plan.accentColor}`} />
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/subscriptions/plans">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-[#3E2723] hover:bg-[#2A1B18] text-white'
                            : `bg-white text-[#3E2723] border-2 border-[#3E2723] hover:bg-[#3E2723] hover:text-white`
                        } rounded-lg py-6 font-bold tracking-wide transition-all duration-300 group`}
                      >
                        Subscribe Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${plan.accentColor} rounded-b-2xl opacity-50`} />
                </motion.div>
              )
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-8"
          >
            <p className="text-[#5D4037] mb-6">
              Want to learn more about our subscription plans?
            </p>
            <Link href="/subscriptions/plans">
              <Button
                size="lg"
                className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full px-8 py-6 text-base font-bold tracking-wide"
              >
                View All Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
