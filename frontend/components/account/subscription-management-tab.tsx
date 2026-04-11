/**
 * SubscriptionManagementTab
 * Component for managing user subscriptions in account dashboard
 */

'use client';

import React, { useState } from 'react';
import { useSubscriptions, Subscription } from '@/hooks/use-subscriptions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Coffee, Calendar, DollarSign, MoreVertical, Pause, X, SkipForward } from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionManagementTabProps {
  userId: string;
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
};

export default function SubscriptionManagementTab({ userId }: SubscriptionManagementTabProps) {
  const { subscriptions, loading, error, skipMonthly, cancelSubscription, pauseSubscription } =
    useSubscriptions(userId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading subscriptions</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Coffee className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subscriptions Yet</h3>
        <p className="text-gray-600 mb-6">Start your coffee journey with our subscription plans</p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <a href="/subscriptions/plans">Browse Plans</a>
        </Button>
      </div>
    );
  }

  const handleSkipMonth = async (subscription: Subscription) => {
    const canSkip =
      subscription.plan && subscription.skipped_months < subscription.plan.max_skip_per_year;

    if (!canSkip) {
      alert('You have reached the maximum skip limit for this year');
      return;
    }

    const success = await skipMonthly(subscription.subscription_id);
    if (success) {
      alert('Month skipped successfully!');
    } else {
      alert('Failed to skip month');
    }
  };

  const handlePauseSubscription = async (subscription: Subscription) => {
    const success = await pauseSubscription(subscription.subscription_id);
    if (success) {
      alert('Subscription paused successfully!');
    } else {
      alert('Failed to pause subscription');
    }
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    const success = await cancelSubscription(subscription.subscription_id, 'User requested');
    if (success) {
      alert('Subscription cancelled successfully!');
    } else {
      alert('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.subscription_id} className="overflow-hidden">
            <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    <CardTitle>{subscription.plan?.plan_name || 'Unknown Plan'}</CardTitle>
                    <Badge
                      className={`ml-auto ${statusColors[subscription.subscription_status]}`}
                    >
                      {statusLabels[subscription.subscription_status]}
                    </Badge>
                  </div>
                  <CardDescription>
                    Started on {format(new Date(subscription.start_date), 'MMM d, yyyy')}
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {subscription.subscription_status === 'ACTIVE' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleSkipMonth(subscription)}
                          disabled={
                            subscription.plan &&
                            subscription.skipped_months >= subscription.plan.max_skip_per_year
                          }
                        >
                          <SkipForward className="mr-2 h-4 w-4" />
                          Skip This Month
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handlePauseSubscription(subscription)}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </DropdownMenuItem>
                      </>
                    )}

                    {subscription.subscription_status !== 'CANCELLED' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this subscription? This action cannot
                            be undone.
                          </AlertDialogDescription>
                          <div className="flex gap-4">
                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelSubscription(subscription)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Subscription
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-lg font-semibold">
                      ${subscription.plan?.price || '0.00'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Next Billing</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(subscription.next_billing_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Coffee className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Skipped Months</p>
                    <p className="text-lg font-semibold">
                      {subscription.skipped_months} /{' '}
                      {subscription.plan?.max_skip_per_year || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-sm mb-2">Plan Details</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {subscription.plan?.description || 'No description available'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Frequency:</span> {subscription.plan?.frequency}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {subscription.subscription_status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSkipMonth(subscription)}
                    disabled={
                      subscription.plan &&
                      subscription.skipped_months >= subscription.plan.max_skip_per_year
                    }
                  >
                    <SkipForward className="mr-2 h-4 w-4" />
                    Skip Month
                  </Button>
                )}

                <Button asChild variant="outline" size="sm">
                  <a href={`/subscriptions/${subscription.subscription_id}/invoices`}>
                    View Invoices
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
