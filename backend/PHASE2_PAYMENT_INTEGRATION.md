# Phase 2: Payment Gateway Integration - Implementation Guide

**Date:** April 11, 2026  
**Status:** ✅ Complete  
**Framework:** Stripe Payment Processing

---

## 🎯 Overview

Phase 2 implements a complete payment gateway integration using Stripe, enabling automated recurring billing for coffee subscriptions. The system handles payment processing, webhook management, payment method management, and refunds.

---

## 📋 Components Implemented

### 1. Payment Gateway Service (`src/services/payment-gateway.service.ts`)

**Class:** `PaymentGatewayService`

#### Key Methods:

| Method | Purpose |
|--------|---------|
| `createStripeCustomer()` | Create a new Stripe customer for a user |
| `getOrCreateStripeCustomer()` | Get existing or create new Stripe customer |
| `addPaymentMethod()` | Add/attach card to Stripe customer |
| `processSubscriptionPayment()` | Create payment intent for subscription charge |
| `confirmPaymentIntent()` | Verify payment completion status |
| `handlePaymentSucceeded()` | Process successful payment webhook |
| `handlePaymentFailed()` | Process failed payment webhook |
| `listPaymentMethods()` | List all payment methods for customer |
| `deletePaymentMethod()` | Remove payment method |
| `refundPayment()` | Issue refund for completed payment |

#### Features:
- Automatic payment intent creation
- Payment method management (add/remove cards)
- Webhook event handling for payment lifecycle
- Automatic retry count tracking
- Error message logging

---

### 2. Updated Billing Service (`src/services/billing.service.ts`)

#### Integration Points:
- `processMontlyBilling()` - Now processes payments through Stripe
- `retryFailedCharge()` - Automatic retry mechanism for failed payments
- `getBillingHistory()` - Retrieve payment history

#### Workflow:
```
1. Get subscriptions due for billing
2. For each subscription:
   - Get subscription plan
   - Create subscription order record
   - Retrieve Stripe customer ID
   - Process payment via Stripe
   - Update subscription next billing date
3. Return summary: processed/failed counts
```

---

### 3. Payment Routes (`src/routes/payment.routes.ts`)

#### Endpoints:

**POST `/api/payments/setup-payment-method`**
- Add a new payment method for the user
- Requires: `paymentMethodToken` (Stripe token)
- Response: Stripe customer ID

**GET `/api/payments/payment-methods`**
- List all payment methods for authenticated user
- Response: Array of payment methods with card details

**DELETE `/api/payments/payment-methods/:paymentMethodId`**
- Remove a payment method
- Parameter: `paymentMethodId`

**POST `/api/payments/process-payment`**
- Manually process/retry a payment
- Requires: `subscriptionOrderId`
- Response: Success status

**POST `/api/payments/webhook`**
- Stripe webhook endpoint
- Handles: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
- Signature verification support

**GET `/api/payments/billing-history/:subscriptionId`**
- Get billing history for a subscription (last 12 months)
- Parameter: `subscriptionId`
- Response: Array of billing records

**POST `/api/payments/refund`**
- Request refund for a paid order
- Requires: `subscriptionOrderId`, optional `amount` and `reason`
- Response: Refund ID

---

### 4. Database Schema Updates

**New Table: `payment_methods`**
```sql
CREATE TABLE dbo.payment_methods (
    payment_method_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    stripe_customer_id NVARCHAR(100),
    stripe_payment_method_id NVARCHAR(100),
    payment_method_type VARCHAR(50),
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    is_default BIT DEFAULT 0,
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    INDEX idx_user (user_id),
    INDEX idx_stripe_customer (stripe_customer_id)
);
```

**Updated Table: `subscription_orders`**
```sql
ALTER TABLE dbo.subscription_orders ADD:
- stripe_payment_intent NVARCHAR(100)
- stripe_refund_id NVARCHAR(100)
- refund_reason NVARCHAR(500)
- INDEX idx_stripe_payment_intent
```

---

## 🔐 Configuration

### Environment Variables Required:

```env
# Stripe API Keys
STRIPE_API_KEY=sk_test_xxxxx          # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_xxxxx     # Stripe webhook secret

# Database & Server
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_NAME=coffee_subscription
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
```

### Setup Instructions:

1. **Get Stripe Keys:**
   - Sign up at [stripe.com](https://stripe.com)
   - Go to Developer Dashboard → API Keys
   - Copy Secret Key and Webhook Secret

2. **Setup Webhooks in Stripe:**
   - Navigate to Webhooks → Add endpoint
   - Endpoint URL: `https://yourserver.com/api/payments/webhook`
   - Events: Select payment_intent events

3. **Configure .env file:**
```bash
cp .env.example .env
# Edit .env with your Stripe keys
```

---

## 💳 Payment Flow

### Subscription Charge Flow:
```
1. Scheduled Job (Daily/Nightly)
   ↓
2. Check subscriptions due for billing
   ↓
3. For each subscription:
   - Create subscription_order record
   - Get Stripe customer ID
   - Create payment intent ($X.XX amount)
   ↓
4. Stripe processes payment
   ↓
5. Webhook callback to backend
   ↓
6. Update subscription_order status (PAID/FAILED)
   ↓
7. If success: Update next_billing_date
   If failed: Store error, schedule retry
```

### Payment Retry Flow:
```
1. Payment attempt fails
   ↓
2. Error stored in subscription_orders
   ↓
3. Retry count incremented
   ↓
4. Scheduled job checks for failed payments
   ↓
5. Auto-retry (max 3 times)
   ↓
6. If still fails: Notify user/admin
```

### Manual Refund Flow:
```
1. User/Admin requests refund
   ↓
2. Verify order status is PAID
   ↓
3. Call Stripe refund API
   ↓
4. Update subscription_order:
   - payment_status = 'REFUNDED'
   - stripe_refund_id = refund_id
   ↓
5. Return refund confirmation to user
```

---

## 🧪 Testing Payments with Stripe

### Test Card Numbers:
```
Visa:                4242 4242 4242 4242
Visa (debit):        4000 0566 5566 5556
Mastercard:          5555 5555 5555 4444
Amex:                3782 822463 10005
3D Secure (success): 4000 0025 0000 3155
3D Secure (fail):    4000 0000 0000 0002
```

### Test Expiry Dates:
- Any future date works (e.g., 12/25)
- Use any 3-4 digit CVC

### Testing Webhook Locally:
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
# Get webhook signing secret from output
# Add to .env: STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx
```

---

## 📊 Data Models

### Payment Status Values:
- `PENDING_PAYMENT_METHOD` - No payment method setup
- `PROCESSING` - Payment initializing
- `PAID` - Successfully charged
- `FAILED` - Charge failed
- `REFUNDED` - Refund issued

### Subscription Order Record:
```typescript
{
  subscription_order_id: string;
  subscription_id: string;
  order_id?: string;
  billing_month: Date;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  payment_status: 'UNPAID' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  retry_count: number;
  last_retry_date?: Date;
  charge_date?: Date;
  error_message?: string;
  stripe_payment_intent?: string;
  stripe_refund_id?: string;
  refund_reason?: string;
}
```

---

## 🔄 Scheduled Jobs (Future Enhancement)

```typescript
// Daily billing job (run at 2 AM UTC)
cron.schedule('0 2 * * *', async () => {
  const result = await billingService.processMontlyBilling();
  console.log(`Processed: ${result.processed}, Failed: ${result.failed}`);
});

// Retry failed charges (run 3 times daily)
cron.schedule('0 */8 * * *', async () => {
  // Auto-retry failed payments
});
```

---

## 🛡️ Security Considerations

✅ **Implemented:**
- JWT authentication on all payment endpoints
- Stripe webhook signature verification
- Payment method isolation per user
- Error message sanitization
- Database transaction support

📋 **Additional Recommendations:**
1. Never log sensitive payment data (customer IDs, PII)
2. Use HTTPS only for webhook endpoints
3. Rotate webhook secrets periodically
4. Implement rate limiting on payment endpoints
5. Monitor failed payment attempts
6. Keep Stripe SDK updated

---

## 📝 API Examples

### Setup Payment Method:
```bash
curl -X POST http://localhost:5000/api/payments/setup-payment-method \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodToken": "pm_test_xxxxx"}'

# Response:
{
  "success": true,
  "message": "Payment method added successfully",
  "stripeCustomerId": "cus_xxxxx"
}
```

### Get Payment Methods:
```bash
curl -X GET http://localhost:5000/api/payments/payment-methods \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Response:
{
  "success": true,
  "paymentMethods": [
    {
      "id": "pm_xxxxx",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025
      },
      "created": 1712847600
    }
  ]
}
```

### Request Refund:
```bash
curl -X POST http://localhost:5000/api/payments/refund \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionOrderId": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 29.99,
    "reason": "Customer requested"
  }'

# Response:
{
  "success": true,
  "message": "Refund processed successfully",
  "refundId": "re_xxxxx"
}
```

---

## ⚠️ Error Handling

### Common Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| "No Stripe customer found" | No payment method setup | User must add payment method |
| "Only paid orders can be refunded" | Attempting to refund failed payment | Only PAID orders are refundable |
| "Invalid signature" | Webhook signature mismatch | Verify webhook secret correct |
| "STRIPE_API_KEY not configured" | Missing environment variable | Add to .env file |

---

## 📈 Monitoring & Logging

### Key Metrics to Track:
- Total transactions processed
- Success rate (successful / total)
- Average payment processing time
- Failed payment retry attempts
- Refund requests and amounts
- Revenue by subscription plan

### Log Format:
```
✅ Payment succeeded for subscription order: {id}
❌ Payment failed for subscription order: {id} - {error}
💳 Payment processed: {id} - Status: {status}
🔄 Payment retried for order: {id}
```

---

## 🚀 Next Steps (Phase 3)

1. **Billing Automation:**
   - Implement scheduled billing jobs (node-cron)
   - Auto-retry mechanism for failed payments
   - Billing reminders and notifications

2. **Subscription Management:**
   - Pause/resume functionality
   - Plan upgrade/downgrade
   - Proration calculations

3. **Admin Dashboard:**
   - Payment analytics
   - Failed payment monitoring
   - Customer payment history view
   - Refund management interface

4. **Notifications:**
   - Payment confirmation emails
   - Failed payment alerts
   - Refund notifications

---

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Node.js SDK](https://stripe.com/docs/libraries/nodejs)
- [Payment Intent Guide](https://stripe.com/docs/payments/payment-intents)
- [Webhook Setup](https://stripe.com/docs/webhooks)

---

**Implementation Summary:**
- ✅ Stripe SDK integrated
- ✅ Payment gateway service created
- ✅ Payment routes with authentication
- ✅ Database schema updated
- ✅ Webhook handling implemented
- ✅ Refund functionality added
- ✅ Error handling and logging
- ✅ Full TypeScript type safety

**Status:** Ready for testing and deployment! 🎉
