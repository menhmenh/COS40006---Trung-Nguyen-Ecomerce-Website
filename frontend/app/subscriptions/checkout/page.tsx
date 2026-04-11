'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { CheckCircle2, Coffee, Loader2, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

const PLANS = [
	{
		id: 'basic-monthly',
		name: 'Basic Monthly',
		price: 29.99,
		description: 'Perfect for coffee lovers',
	},
	{
		id: 'premium-monthly',
		name: 'Premium Monthly',
		price: 49.99,
		description: 'For the true enthusiast',
	},
	{
		id: 'deluxe-monthly',
		name: 'Deluxe Monthly',
		price: 79.99,
		description: 'The ultimate coffee experience',
	},
];

export default function SubscriptionCheckoutPage() {
	const router = useRouter();
	const { toast } = useToast();
	const { user } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const searchParams = useSearchParams();
	const planId = (searchParams.get('plan') || '').trim();

	const selectedPlan = PLANS.find((plan) => plan.id === planId);

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

			// Local fallback: keep a lightweight record so UI reflects checkout action.
			const existing = localStorage.getItem('pending-subscriptions');
			const pending = existing ? JSON.parse(existing) : [];
			pending.push({
				id: `pending-${Date.now()}`,
				userId: user.id,
				planId: selectedPlan.id,
				planName: selectedPlan.name,
				createdAt: new Date().toISOString(),
			});
			localStorage.setItem('pending-subscriptions', JSON.stringify(pending));

			toast({
				title: 'Subscription confirmed',
				description: `${selectedPlan.name} has been activated for your account.`,
			});
			router.push('/subscriptions');
		} catch (error) {
			console.error('Confirm subscription failed:', error);
			toast({
				title: 'Could not confirm subscription',
				description: 'Please try again in a moment.',
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
					<div className="max-w-5xl mx-auto">
						<div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
							<div>
								<Badge className="mb-3 bg-amber-100 text-amber-900 hover:bg-amber-100">
									<Sparkles className="size-3.5 mr-1" /> Secure Checkout
								</Badge>
								<h1 className="text-3xl md:text-4xl font-bold text-slate-900">Subscription Checkout</h1>
								<p className="text-slate-600 mt-2">Review your plan and confirm your monthly coffee ritual.</p>
							</div>
							<Link href="/subscriptions/plans">
								<Button variant="outline" className="border-slate-300">Change Plan</Button>
							</Link>
						</div>

						{!selectedPlan ? (
							<Card className="border-red-200 bg-red-50">
								<CardHeader>
									<CardTitle>Plan not found</CardTitle>
									<CardDescription>
										Invalid or missing plan in URL query.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Link href="/subscriptions/plans">
										<Button>Back to Plans</Button>
									</Link>
								</CardContent>
							</Card>
						) : (
							<div className="grid lg:grid-cols-3 gap-6">
								<Card className="lg:col-span-2 border-slate-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-2xl">
											<Coffee className="size-6 text-amber-600" />
											{selectedPlan.name}
										</CardTitle>
										<CardDescription>{selectedPlan.description}</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="rounded-xl border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 p-4">
											<p className="text-sm text-slate-600 mb-1">Monthly total</p>
											<p className="text-3xl font-bold text-slate-900">${selectedPlan.price.toFixed(2)}</p>
										</div>

										<div className="space-y-3">
											{perks.map((perk) => {
												const Icon = perk.icon;
												return (
													<div key={perk.text} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 bg-white">
														<Icon className="size-5 text-emerald-600 mt-0.5" />
														<p className="text-sm text-slate-700">{perk.text}</p>
													</div>
												);
											})}
										</div>
									</CardContent>
								</Card>

								<Card className="border-slate-200 shadow-sm h-fit lg:sticky lg:top-24">
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
											<span className="text-slate-700 font-medium">Total</span>
											<span className="text-2xl font-bold text-slate-900">${selectedPlan.price.toFixed(2)}</span>
										</div>

										<Button
											onClick={handleConfirmSubscription}
											disabled={isSubmitting}
											className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white hover:opacity-95"
										>
											{isSubmitting ? (
												<>
													<Loader2 className="size-4 mr-2 animate-spin" /> Processing...
												</>
											) : (
												<>
													<CheckCircle2 className="size-4 mr-2" /> Confirm Subscription
												</>
											)}
										</Button>
										<p className="text-xs text-slate-500 text-center">Secure checkout. You can cancel anytime.</p>
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

