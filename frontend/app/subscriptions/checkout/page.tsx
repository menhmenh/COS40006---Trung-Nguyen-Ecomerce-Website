'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Coffee,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { fetchBackend, parseBackendResponse } from '@/lib/backend-api';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

function createPlaceholderId() {
  return `00000000-0000-4000-8000-${Date.now().toString().slice(-12).padStart(12, '0')}`;
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading checkout...</div>}>
      <SubscriptionCheckoutContent />
    </Suspense>
  );
}

function SubscriptionCheckoutContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const planId = (searchParams.get('plan') || '').trim();

  const selectedPlan = useMemo(
    () => SUBSCRIPTION_PLANS.find((plan) => plan.id === planId),
    [planId],
  );

  const perks = [
    { icon: Coffee, text: 'Freshly roasted and curated beans every month' },
    { icon: Truck, text: 'Free delivery with tracking updates' },
    { icon: ShieldCheck, text: 'Pause, skip, or cancel anytime' },
  ];

  const handleConfirmSubscription = async () => {
    if (!selectedPlan || isSubmitting) return;

    if (!user) {
      toast({
        title: 'Please sign in first',
        description: 'You need an account to activate a subscription.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetchBackend('/api/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          delivery_address_id: createPlaceholderId(),
          payment_method_id: createPlaceholderId(),
        }),
      });

      await parseBackendResponse(response);

      toast({
        title: 'Subscription confirmed',
        description: `${selectedPlan.name} has been activated for your account.`,
      });
      router.push('/subscriptions');
    } catch (error) {
      console.error('Confirm subscription failed:', error);
      toast({
        title: 'Could not confirm subscription',
        description:
          error instanceof Error ? error.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[80vh] bg-linear-to-br from-slate-50 via-amber-50/30 to-orange-50/40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="container mx-auto px-4 py-10 md:py-14"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-amber-100 text-amber-900 hover:bg-amber-100">
                  <Sparkles className="mr-1 size-3.5" /> Secure Checkout
                </Badge>
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                  Subscription Checkout
                </h1>
                <p className="mt-2 text-slate-600">
                  Review your plan and confirm your monthly coffee ritual.
                </p>
              </div>
              <Link href="/subscriptions/plans">
                <Button variant="outline" className="border-slate-300">
                  Change Plan
                </Button>
              </Link>
            </div>

            {!selectedPlan ? (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle>Plan not found</CardTitle>
                  <CardDescription>Invalid or missing plan in URL query.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/subscriptions/plans">
                    <Button>Back to Plans</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="border-slate-200 shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Coffee className="size-6 text-amber-600" />
                      {selectedPlan.name}
                    </CardTitle>
                    <CardDescription>{selectedPlan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-4">
                      <p className="mb-1 text-sm text-slate-600">Monthly total</p>
                      <p className="text-3xl font-bold text-slate-900">
                        ${selectedPlan.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {perks.map((perk) => {
                        const Icon = perk.icon;
                        return (
                          <div
                            key={perk.text}
                            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                          >
                            <Icon className="mt-0.5 size-5 text-emerald-600" />
                            <p className="text-sm text-slate-700">{perk.text}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-900">
                        Current backend assumptions
                      </p>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-amber-600" />
                          A placeholder delivery address id will be created for now.
                        </p>
                        <p className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-amber-600" />
                          Add real payment-method onboarding later to replace placeholder ids.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-fit border-slate-200 shadow-sm lg:sticky lg:top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Everything included in your first shipment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Plan</span>
                      <span className="font-semibold text-slate-900">{selectedPlan.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Billing cycle</span>
                      <span className="font-semibold text-slate-900">Monthly</span>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="flex items-end justify-between">
                      <span className="font-medium text-slate-700">Total</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${selectedPlan.price.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={handleConfirmSubscription}
                      disabled={isSubmitting}
                      className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white hover:opacity-95"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 size-4" /> Confirm Subscription
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-slate-500">
                      Secure checkout. You can cancel anytime.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
