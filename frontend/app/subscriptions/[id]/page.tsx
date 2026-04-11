'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InvoiceHistory from '@/components/account/invoice-history';
import { LOCAL_SUBSCRIPTIONS } from '@/hooks/use-subscriptions';
import { ArrowLeft, Calendar, DollarSign, Coffee } from 'lucide-react';
import { format } from 'date-fns';

interface Subscription {
  subscription_id: string;
  plan_id: string;
  subscription_status: string;
  start_date: string;
  next_billing_date: string;
  skipped_months: number;
  plan?: {
    plan_name: string;
    description: string;
    price: number;
    billing_cycle: number;
    max_skip_per_year: number;
  };
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalize = (value: string) =>
      value.toLowerCase().trim().replace(/\s+/g, '-');

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/subscriptions/${subscriptionId}`);

        if (!response.ok) {
          const fallback = LOCAL_SUBSCRIPTIONS.find(
            (item) =>
              item.subscription_id === subscriptionId ||
              item.plan_id === subscriptionId ||
              normalize(item.plan?.plan_name || '') === normalize(subscriptionId)
          );

          if (fallback) {
            setSubscription(fallback as Subscription);
            setError(null);
            return;
          }

          setSubscription(null);
          setError('Subscription not found');
          return;
        }

        const data = await response.json();
        const apiSubscription = data?.data as Subscription | undefined;

        if (!apiSubscription) {
          setSubscription(null);
          setError('Subscription not found');
          return;
        }

        setSubscription(apiSubscription);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading subscription details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !subscription) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error || 'Subscription not found'}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {subscription.plan?.plan_name || 'Subscription'}
              </h1>
              <p className="text-gray-600">{subscription.plan?.description}</p>
            </div>
            <Badge className={statusColors[subscription.subscription_status] || ''}>
              {subscription.subscription_status}
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-bold">
                  ${subscription.plan?.price || '0.00'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">per {subscription.plan?.billing_cycle || 30} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Start Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="text-lg font-bold">
                  {format(new Date(subscription.start_date), 'MMM d')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{format(new Date(subscription.start_date), 'yyyy')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Next Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span className="text-lg font-bold">
                  {format(new Date(subscription.next_billing_date), 'MMM d')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {format(new Date(subscription.next_billing_date), 'yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Skipped Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-bold">
                  {subscription.skipped_months} / {subscription.plan?.max_skip_per_year || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">this year</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice History */}
        <div>
          <InvoiceHistory subscriptionId={subscriptionId} limit={20} />
        </div>
      </div>
      <Footer />
    </>
  );
}
