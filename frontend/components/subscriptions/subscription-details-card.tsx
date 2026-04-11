'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Pause, Play, Gift, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Subscription {
  subscription_id: string;
  planName: string;
  price: number;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  createdDate: string;
  coffeeQuantity: number;
  skippedMonths: number;
  maxSkipPerYear: number;
}

export function SubscriptionDetailsCard({ subscription }: { subscription: Subscription }) {
  const [selectedAction, setSelectedAction] = useState<'pause' | 'skip' | 'cancel' | null>(null);

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active':
        return 'from-green-500 to-emerald-500';
      case 'paused':
        return 'from-amber-500 to-orange-500';
      case 'cancelled':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-slate-500 to-gray-500';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (subscription.status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = () => {
    switch (subscription.status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const canSkipMonth = subscription.skippedMonths < subscription.maxSkipPerYear;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
    hover: {
      y: -4,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" whileHover="hover">
        <Card className="overflow-hidden h-full bg-linear-to-br from-white via-slate-50 to-white border-2 border-slate-200">
          {/* Header with gradient background */}
          <div className={`relative h-32 bg-linear-to-r ${getStatusColor()} overflow-hidden`}>
            <motion.div
              className="absolute inset-0 bg-pattern opacity-10"
              animate={{
                backgroundPosition: ['0px 0px', '30px 30px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between p-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-white">{subscription.planName}</h3>
                <p className="text-white/80 text-sm">Subscription</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' as const, stiffness: 200 }}
              >
                <Badge
                  variant={getStatusBadgeVariant()}
                  className="text-sm font-bold px-4 py-2"
                >
                  {getStatusText()}
                </Badge>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
            {/* Price */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Monthly Cost</span>
              <motion.div
                className="text-3xl font-bold bg-linear-to-r from-ambient-600 to-orange-600 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                ${subscription.price}
              </motion.div>
            </motion.div>

            {/* Details grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg"
            >
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-amber-600">{subscription.coffeeQuantity}</div>
                <div className="text-xs text-slate-600 font-medium">Bags/Month</div>
              </div>
              <div className="text-center space-y-2">
                <Calendar className="w-6 h-6 mx-auto text-blue-600" />
                <div className="text-xs text-slate-600 font-medium">Next Shipment</div>
              </div>
            </motion.div>

            {/* Next billing date */}
            <motion.div
              variants={itemVariants}
              className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded space-y-1"
            >
              <p className="text-xs font-semibold text-blue-900 uppercase">Next Billing</p>
              <p className="text-lg font-bold text-blue-900">{subscription.nextBillingDate}</p>
              <p className="text-xs text-blue-700">
                Your coffee ships 3-5 business days after billing
              </p>
            </motion.div>

            {/* Skip month indicator */}
            <motion.div
              variants={itemVariants}
              className={`p-4 rounded-lg border-2 space-y-2 ${
                canSkipMonth
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Skip Months</span>
                <span className="font-bold text-slate-900">
                  {subscription.skippedMonths}/{subscription.maxSkipPerYear}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-linear-to-r from-emerald-400 to-green-500 h-2 rounded-full"
                  animate={{
                    width: `${(subscription.skippedMonths / subscription.maxSkipPerYear) * 100}%`,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                  }}
                />
              </div>
              <p className="text-xs text-slate-600">
                {canSkipMonth
                  ? 'You can skip your next month'
                  : 'Monthly skip limit reached'}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-3 pt-4 border-t border-slate-200"
            >
              {subscription.status === 'active' && (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full border-2 hover:bg-amber-50"
                      onClick={() => setSelectedAction('pause')}
                    >
                      <Pause className="mr-2 size-4" />
                      Pause Subscription
                    </Button>
                  </motion.div>
                  {canSkipMonth && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-2 hover:bg-sky-50"
                        onClick={() => setSelectedAction('skip')}
                      >
                        <Gift className="mr-2 size-4" />
                        Skip Next Month
                      </Button>
                    </motion.div>
                  )}
                </>
              )}

              {subscription.status === 'paused' && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-linear-to-r from-emerald-500 to-green-500 text-white"
                    onClick={() => setSelectedAction('pause')}
                  >
                    <Play className="mr-2 size-4" />
                    Resume Subscription
                  </Button>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setSelectedAction('cancel')}
                >
                  Cancel Subscription
                </Button>
              </motion.div>

              <Link href={`/subscriptions/${subscription.subscription_id}`} className="block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="ghost" className="w-full border-2">
                    View Details
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Action modals */}
      <AnimatePresence>
        {selectedAction === 'pause' && (
          <PauseSubscriptionModal
            subscription={subscription}
            onClose={() => setSelectedAction(null)}
          />
        )}
        {selectedAction === 'skip' && (
          <SkipMonthModal subscription={subscription} onClose={() => setSelectedAction(null)} />
        )}
        {selectedAction === 'cancel' && (
          <CancelSubscriptionModal
            subscription={subscription}
            onClose={() => setSelectedAction(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Pause subscription modal
function PauseSubscriptionModal({
  subscription,
  onClose,
}: {
  subscription: Subscription;
  onClose: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {subscription.status === 'paused' ? (
                <>
                  <Play className="text-emerald-600" />
                  Resume Your Subscription
                </>
              ) : (
                <>
                  <Pause className="text-amber-600" />
                  Pause Your Subscription
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {subscription.status === 'paused'
                ? 'Your subscription is currently paused. You can resume it anytime.'
                : 'Pause your subscription temporarily. You can resume anytime with no penalty.'}
            </DialogDescription>
          </DialogHeader>

          {!isPaused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-4"
            >
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded space-y-2">
                <p className="font-semibold text-amber-900">What happens when you pause?</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>✓ No charges until you resume</li>
                  <li>✓ Your subscription details are saved</li>
                  <li>✓ Resume anytime without re-entering preferences</li>
                  <li>✓ Your member benefits stay active</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsPaused(true)}
                  className="flex-1 bg-linear-to-r from-amber-500 to-orange-500 text-white"
                >
                  {subscription.status === 'paused' ? 'Resume Now' : 'Confirm Pause'}
                </Button>
              </div>
            </motion.div>
          )}

          {isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex justify-center"
              >
                <CheckCircle className="text-emerald-600 size-16" />
              </motion.div>
              <p className="text-slate-900 font-semibold">Done!</p>
              <p className="text-slate-600 text-sm">
                Your subscription has been {subscription.status === 'paused' ? 'resumed' : 'paused'}.
              </p>
              <Button onClick={onClose} className="w-full bg-linear-to-r from-emerald-500 to-green-500 text-white">
                Got It
              </Button>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Skip month modal
function SkipMonthModal({
  subscription,
  onClose,
}: {
  subscription: Subscription;
  onClose: () => void;
}) {
  const [isSkipped, setIsSkipped] = useState(false);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Gift className="text-blue-600" />
              Skip Your Next Month
            </DialogTitle>
            <DialogDescription>
              You'll still have your subscription active, but your next shipment will be delayed by one month.
            </DialogDescription>
          </DialogHeader>

          {!isSkipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-4"
            >
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded space-y-2">
                <p className="font-semibold text-blue-900">Next shipment will be:</p>
                <p className="text-lg font-bold text-blue-900">
                  {new Date(new Date().setMonth(new Date().getMonth() + 2)).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-700">
                  Remaining skips: {subscription.maxSkipPerYear - subscription.skippedMonths - 1}/{subscription.maxSkipPerYear}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Keep Schedule
                </Button>
                <Button
                  onClick={() => setIsSkipped(true)}
                  className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white"
                >
                  Skip Month
                </Button>
              </div>
            </motion.div>
          )}

          {isSkipped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex justify-center"
              >
                <CheckCircle className="text-emerald-600 size-16" />
              </motion.div>
              <p className="text-slate-900 font-semibold">Month Skipped!</p>
              <p className="text-slate-600 text-sm">
                Your next shipment will arrive next month as scheduled.
              </p>
              <Button onClick={onClose} className="w-full bg-linear-to-r from-emerald-500 to-green-500 text-white">
                Great!
              </Button>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Cancel subscription modal
function CancelSubscriptionModal({
  subscription,
  onClose,
}: {
  subscription: Subscription;
  onClose: () => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="text-red-600" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription>
              We're sorry to see you go. Are you sure you want to cancel?
            </DialogDescription>
          </DialogHeader>

          {!isCancelling && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 py-4"
            >
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded space-y-2">
                <p className="font-semibold text-red-900">Before you go:</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>✗ No more monthly shipments</li>
                  <li>✗ Member benefits end immediately</li>
                  <li>✓ You can resubscribe anytime</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Keep subscription
                </Button>
                <Button
                  onClick={() => setIsCancelling(true)}
                  variant="destructive"
                  className="flex-1"
                >
                  Cancel It
                </Button>
              </div>
            </motion.div>
          )}

          {isCancelling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="flex justify-center"
              >
                <AlertCircle className="text-red-600 size-16" />
              </motion.div>
              <p className="text-slate-900 font-semibold">Subscription Cancelled</p>
              <p className="text-slate-600 text-sm">
                Your subscription has been cancelled. We'd love to have you back anytime.
              </p>
              <Button onClick={onClose} className="w-full bg-linear-to-r from-slate-500 to-gray-500 text-white">
                Done
              </Button>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
