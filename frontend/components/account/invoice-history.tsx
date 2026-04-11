/**
 * Invoice History Component
 * Display and manage invoices for subscriptions
 */

'use client';

import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  subscription_id: string;
  billing_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  pdf_url?: string;
  invoice_url?: string;
}

interface InvoiceHistoryProps {
  userId?: string;
  subscriptionId?: string;
  limit?: number;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  VIEWED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function InvoiceHistory({
  userId,
  subscriptionId,
  limit = 12,
}: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = '/api/invoices';
        if (subscriptionId) {
          url = `/api/invoices/subscription/${subscriptionId}?limit=${limit}`;
        } else if (userId) {
          url = `/api/invoices?limit=${limit}`;
        }

        const response = await fetch(url, {
          headers: userId ? { 'x-user-id': userId } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch invoices: ${response.statusText}`);
        }

        const data = await response.json();
        setInvoices(data.data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userId, subscriptionId, limit]);

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');

      const data = await response.json();
      const invoice = data.data;

      if (invoice.invoice_url) {
        window.open(invoice.invoice_url, '_blank');
      } else {
        alert('Invoice URL not available');
      }
    } catch (error) {
      alert('Failed to view invoice');
      console.error('Error viewing invoice:', error);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
    } else {
      alert('PDF not available for download');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error loading invoices</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices</h3>
        <p className="text-gray-600">
          {subscriptionId
            ? 'No invoices found for this subscription.'
            : 'Your invoices will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>View and download your invoices</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice_id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{format(new Date(invoice.billing_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>${invoice.tax_amount.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">${invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.invoice_id)}
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {invoice.pdf_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {invoices.length >= limit && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Showing the latest {invoices.length} invoices
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
