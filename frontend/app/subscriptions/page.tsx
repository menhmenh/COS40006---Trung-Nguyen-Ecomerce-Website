'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { Coffee, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-blue-100 text-blue-800',
};

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { subscriptions, loading, error } = useSubscriptions(user?.id);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-[80vh] bg-linear-to-br from-slate-50 via-amber-50/20 to-orange-50/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Your Subscriptions</h1>
              <p className="mt-2 text-slate-600">
                Manage your monthly coffee plans, billing dates, and invoices.
              </p>
            </div>
            <Link href="/subscriptions/plans">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Subscription
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-600">Loading subscriptions...</div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <p className="font-semibold">Unable to load subscriptions</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Coffee className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                <h2 className="text-2xl font-semibold text-slate-900">No active subscriptions</h2>
                <p className="mt-2 text-slate-600">
                  Choose a monthly box to start recurring deliveries.
                </p>
                <Link href="/subscriptions/plans" className="mt-6 inline-block">
                  <Button className="bg-amber-600 hover:bg-amber-700">Browse Plans</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {subscriptions.map((subscription) => (
                <Card key={subscription.subscription_id} className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{subscription.plan?.plan_name || 'Subscription Plan'}</CardTitle>
                        <CardDescription className="mt-1">
                          {subscription.plan?.description || 'Monthly recurring plan'}
                        </CardDescription>
                      </div>
                      <Badge className={statusColors[subscription.subscription_status] || ''}>
                        {subscription.subscription_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-slate-500">Price</p>
                        <p className="text-xl font-semibold text-slate-900">
                          ${Number(subscription.plan?.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-slate-500">Next Billing</p>
                        <p className="flex items-center gap-2 text-slate-900">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          {format(new Date(subscription.next_billing_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>
                        Skipped months: {subscription.skipped_months}/
                        {subscription.plan?.max_skip_per_year || 0}
                      </span>
                      <Link href={`/subscriptions/${subscription.subscription_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
