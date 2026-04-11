/**
 * FR15 Subscription Feature - Testing Checklist
 * Quick Integration Testing Guide
 */

# FR15 Testing Checklist

## ✅ Backend API Testing

### Database Layer
- [ ] Database tables created successfully
- [ ] Subscription data persisted correctly
- [ ] Invoice records auto-generated
- [ ] Billing job logs recorded

### Billing Automation
- [ ] Billing scheduler starts on app boot
- [ ] Daily billing job executes at scheduled time (2 AM UTC)
- [ ] Retry job runs for failed charges (3 AM UTC)
- [ ] Billing reports generated (4 AM UTC)

### Payment Processing
- [ ] Create subscription → Stripe customer created
- [ ] Monthly charge processed → Payment intent succeeds
- [ ] Failed charge → Retry logic kicks in
- [ ] Successful payment → Invoice generated
- [ ] Webhook handling → Status updates correctly

### Invoice Generation
- [ ] Invoice auto-created after successful charge
- [ ] Invoice number generated uniquely
- [ ] Invoice status transitions: DRAFT → SENT → PAID
- [ ] Invoice retrieval by ID works
- [ ] Invoice list filtered by subscription/user

---

## ✅ Frontend Dashboard Testing

### Account Page - Subscriptions Tab
- [ ] Load subscriptions list
- [ ] Display plan details correctly
- [ ] Show next billing date
- [ ] Display skip allowance (e.g., 1/3)
- [ ] Skip Month button works
- [ ] Pause subscription button works
- [ ] Cancel subscription dialog shows
- [ ] View Invoices link navigates correctly

### Subscription Details Page (`/subscriptions/[id]`)
- [ ] Page loads with subscription data
- [ ] Displays plan name & description
- [ ] Shows subscription metrics (price, start date, next billing, skipped)
- [ ] Invoice history displays
- [ ] Can download PDFs

### Invoices Tab
- [ ] Load user's invoices
- [ ] Display invoice number, date, amount, status
- [ ] View invoice button opens link
- [ ] Download PDF button works
- [ ] Status badges show correct color
- [ ] Filter by subscription works

### Payment Methods Tab
- [ ] Load payment methods
- [ ] Display card brand & last 4 digits
- [ ] Show default badge on primary method
- [ ] Set as default button works
- [ ] Delete payment method works
- [ ] Add payment method link works

---

## ✅ Integration Tests

### User Flow: Create Subscription
1. User browses subscription plans
2. User selects plan & clicks "Subscribe"
3. Redirected to payment page
4. User enters payment details
5. Stripe processes payment
6. Subscription created in database
7. Invoice auto-generated
8. User can see subscription in /account

### User Flow: Skip Month
1. User views subscriptions
2. Click "Skip This Month" button
3. Month skipped count incremented
4. Next billing date extended
5. Billing job respects skip

### User Flow: Manage Payment Method
1. User adds credit card
2. Card stored in Stripe
3. Payment method appears in account
4. User can set as default
5. Future charges use default method

---

## 🧪 Manual Testing Steps

### 1. Test Database Connection
```bash
cd backend
npm run migrate
# Should output: ✅ Database Setup Complete!
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
# Should see:
# ✅ Database initialized
# ✅ Billing Scheduler initialized
# 📅 Scheduled Jobs Status:
#    Daily Billing: running
#    Retry Failed Charges: running
```

### 3. Check Scheduler Status
```bash
curl http://localhost:3001/api/scheduler/status
# Should return: { initialized: true, jobs: [...] }
```

### 4. Test Subscription Endpoints
```bash
# Get user subscriptions
curl -H "x-user-id: user-123" http://localhost:3001/api/subscriptions

# Get subscription by ID
curl http://localhost:3001/api/subscriptions/sub-001

# Get invoices
curl -H "x-user-id: user-123" http://localhost:3001/api/invoices
```

### 5. Start Frontend
```bash
cd frontend
npm run dev
# Navigate to /account
# Check Subscriptions tab loads
```

---

## 📊 Test Data

For testing, use these mock subscriptions:

```json
{
  "subscription_id": "sub-test-001",
  "user_id": "user-test-001",
  "plan_id": "plan-premium",
  "subscription_status": "ACTIVE",
  "start_date": "2026-01-15",
  "next_billing_date": "2026-04-15",
  "skipped_months": 1,
  "plan": {
    "plan_id": "plan-premium",
    "plan_name": "Premium Monthly",
    "price": 49.99,
    "billing_cycle": 30,
    "max_skip_per_year": 3
  }
}
```

---

## ✅ Success Criteria

All tests pass when:
1. ✅ Backend builds without errors
2. ✅ Database initializes successfully
3. ✅ Billing scheduler starts automatically
4. ✅ All API endpoints respond correctly
5. ✅ Frontend dashboard loads & displays data
6. ✅ User can perform actions (skip, pause, cancel)
7. ✅ Invoice auto-generation works
8. ✅ No console errors in frontend/backend

---

## 🚀 Deployment Readiness

After testing passes:
- [ ] All environment variables configured
- [ ] Database backups created
- [ ] Stripe webhook endpoints registered
- [ ] Logging configured
- [ ] Error tracking setup (e.g., Sentry)
- [ ] CORS configured for prod domain
- [ ] SSL/HTTPS enabled
- [ ] Database connection pooling optimized
