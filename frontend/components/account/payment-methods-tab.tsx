/**
 * Payment Methods Tab
 * Manage payment methods for subscriptions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { fetchBackend, parseBackendResponse } from '@/lib/backend-api';
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
import { CreditCard, Trash2, CheckCircle2 } from 'lucide-react';

interface PaymentMethod {
  payment_method_id: string;
  stripe_payment_method_id: string;
  card_brand: string;
  card_last4: string;
  is_default: boolean;
  created_date: string;
}

interface PaymentMethodsTabProps {
  userId: string;
}

export default function PaymentMethodsTab({ userId }: PaymentMethodsTabProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await fetchBackend('/api/payments/payment-methods');
        const data = await parseBackendResponse<{ data: PaymentMethod[] }>(response);
        setPaymentMethods(data.data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching payment methods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [userId]);

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetchBackend(`/api/payments/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }

      setPaymentMethods((prev) =>
        prev.filter((method) => method.payment_method_id !== paymentMethodId)
      );
      alert('Payment method deleted successfully!');
    } catch (err) {
      alert('Failed to delete payment method');
      console.error('Error deleting payment method:', err);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const response = await fetchBackend(
        `/api/payments/payment-methods/${paymentMethodId}/default`,
        {
          method: 'PUT',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to set default payment method');
      }

      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          is_default: method.payment_method_id === paymentMethodId,
        }))
      );
      alert('Default payment method updated!');
    } catch (err) {
      alert('Failed to update default payment method');
      console.error('Error setting default:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading payment methods</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <Button disabled className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60">
          Add Payment Method
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Payment method onboarding UI is not wired yet. Existing Stripe methods can still be listed,
        set as default, and removed.
      </p>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
            <p className="text-gray-600 mb-6">
              Add payment methods from the backend/Stripe integration until the frontend onboarding
              form is implemented.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.payment_method_id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-amber-500 to-orange-500 rounded-lg p-3">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg capitalize">
                          {method.card_brand} Card
                        </h4>
                        {method.is_default && (
                          <Badge className="bg-green-100 text-green-800">Default</Badge>
                        )}
                      </div>
                      <p className="text-gray-600">
                        **** **** **** {method.card_last4}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.payment_method_id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Set Default
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={paymentMethods.length === 1}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this payment method? This action cannot be
                          undone.
                        </AlertDialogDescription>
                        <div className="flex gap-4">
                          <AlertDialogCancel>Keep Method</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePaymentMethod(method.payment_method_id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Method
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
