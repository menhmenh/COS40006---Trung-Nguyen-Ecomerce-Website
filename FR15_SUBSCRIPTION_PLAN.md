# FR15: Subscription "Coffee Monthly Box" - Implementation Plan

**Date Created:** April 11, 2026  
**Status:** Planning Phase  
**Priority:** High

---

## 📋 Overview

Implement a monthly subscription service allowing customers to receive curated coffee boxes on a recurring monthly basis. This feature includes:
- Subscription product management
- Recurring billing system
- Subscription lifecycle management (active, paused, cancelled)
- Admin dashboard for subscription monitoring
- Customer portal for managing subscriptions

---

## 🎯 Key Features

### 1. **Subscription Products**
- Create subscription-specific products (monthly tier variations)
- Define pricing tiers (e.g., Basic, Premium, Deluxe)
- Manage coffee selection per month
- Track subscription product variations

### 2. **Subscription Management**
- Create/start subscriptions
- Pause subscriptions (temporary hold)
- Resume subscriptions
- Cancel subscriptions
- Skip specific months
- Update subscription details (tier, delivery address)

### 3. **Billing System**
- Automatic recurring charges on the subscription date
- Payment method management
- Billing history tracking
- Retry failed payments
- Generate invoices

### 4. **Delivery & Fulfillment**
- Track monthly shipments
- Manage fulfillment status
- Handle delivery tracking

### 5. **Customer Portal**
- View active subscription details
- Manage subscription settings
- View upcoming shipments
- Access billing history
- Cancel/pause functionality

### 6. **Admin Dashboard**
- Monitor all subscriptions
- View subscription analytics
- Manage subscription content (monthly selections)
- Handle failed payments
- Generate subscription reports

---

## 🗄️ Database Schema Design

### New Tables Required

#### 1. `subscription_plans`
```sql
CREATE TABLE dbo.subscription_plans (
    plan_id CHAR(36) PRIMARY KEY,
    plan_name NVARCHAR(100) NOT NULL,           -- 'Basic Monthly', 'Premium Monthly', etc.
    description NVARCHAR(MAX),
    price DECIMAL(10,2) NOT NULL,
    billing_cycle INT DEFAULT 30,               -- Days between billing
    frequency VARCHAR(20) DEFAULT 'MONTHLY',    -- 'MONTHLY', 'QUARTERLY', etc.
    max_skip_per_year INT DEFAULT 3,            -- Max months customer can skip
    status VARCHAR(20) DEFAULT 'ACTIVE',        -- 'ACTIVE', 'INACTIVE', 'ARCHIVED'
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    created_by CHAR(36),
    FOREIGN KEY (created_by) REFERENCES dbo.users(user_id)
);
```

#### 2. `subscriptions`
```sql
CREATE TABLE dbo.subscriptions (
    subscription_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    plan_id CHAR(36) NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'PAUSED', 'CANCELLED', 'PENDING'
    start_date DATE NOT NULL,
    next_billing_date DATE NOT NULL,
    last_billing_date DATE,
    cancelled_date DATE,
    cancellation_reason NVARCHAR(500),
    payment_method_id CHAR(36),                -- Link to stored payment method
    delivery_address_id CHAR(36),              -- Link to address
    skipped_months INT DEFAULT 0,
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
    FOREIGN KEY (plan_id) REFERENCES dbo.subscription_plans(plan_id),
    FOREIGN KEY (delivery_address_id) REFERENCES dbo.addresses(address_id),
    INDEX idx_user_subscription (user_id),
    INDEX idx_next_billing (next_billing_date)
);
```

#### 3. `subscription_items`
```sql
CREATE TABLE dbo.subscription_items (
    subscription_item_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    month_number INT NOT NULL,                 -- 1 for first box, 2 for second, etc.
    product_id CHAR(36),
    quantity INT DEFAULT 1,
    included_items NVARCHAR(MAX),              -- JSON array of items in this month's box
    customization NVARCHAR(MAX),               -- JSON: customer preferences, blend selection
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    FOREIGN KEY (product_id) REFERENCES dbo.products(product_id),
    INDEX idx_subscription (subscription_id)
);
```

#### 4. `subscription_orders`
```sql
CREATE TABLE dbo.subscription_orders (
    subscription_order_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    order_id CHAR(36),                         -- Link to actual order when created
    billing_month DATE NOT NULL,               -- First day of the billing month
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',      -- 'PENDING', 'CHARGED', 'FAILED', 'REFUNDED'
    payment_status VARCHAR(50) DEFAULT 'UNPAID', -- 'UNPAID', 'PAID', 'FAILED'
    retry_count INT DEFAULT 0,
    last_retry_date DATETIME2,
    charge_date DATETIME2,
    error_message NVARCHAR(MAX),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    FOREIGN KEY (order_id) REFERENCES dbo.orders(order_id),
    INDEX idx_subscription (subscription_id),
    INDEX idx_charge_date (charge_date)
);
```

#### 5. `subscription_skip_requests`
```sql
CREATE TABLE dbo.subscription_skip_requests (
    skip_request_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    skip_billing_date DATE NOT NULL,           -- Next billing date to skip
    status VARCHAR(20) DEFAULT 'APPROVED',     -- 'APPROVED', 'REJECTED'
    reason NVARCHAR(500),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    requested_by CHAR(36) NOT NULL,
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    FOREIGN KEY (requested_by) REFERENCES dbo.users(user_id)
);
```

#### 6. `subscription_changes`
```sql
CREATE TABLE dbo.subscription_changes (
    change_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    change_type VARCHAR(50),                   -- 'PLAN_UPGRADE', 'PLAN_DOWNGRADE', 'ADDRESS_UPDATE', 'PAUSE', 'RESUME', 'CANCEL'
    old_value NVARCHAR(MAX),                   -- JSON
    new_value NVARCHAR(MAX),                   -- JSON
    effective_date DATETIME2,
    reason NVARCHAR(500),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    created_by CHAR(36),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    FOREIGN KEY (created_by) REFERENCES dbo.users(user_id)
);
```

---

## 🔧 Backend Implementation Structure

### API Endpoints

#### Subscription Management
```
POST   /api/subscriptions              - Create new subscription
GET    /api/subscriptions              - Get user's subscriptions
GET    /api/subscriptions/:id          - Get subscription details
PUT    /api/subscriptions/:id          - Update subscription
PUT    /api/subscriptions/:id/pause    - Pause subscription
PUT    /api/subscriptions/:id/resume   - Resume subscription
DELETE /api/subscriptions/:id          - Cancel subscription
GET    /api/subscriptions/:id/items    - Get monthly items
```

#### Subscription Plans
```
GET    /api/subscription-plans         - List all plans
GET    /api/subscription-plans/:id     - Get plan details
```

#### Admin Endpoints
```
GET    /api/admin/subscriptions        - List all subscriptions
GET    /api/admin/subscriptions/analytics - Subscription analytics
POST   /api/admin/subscription-plans   - Create plan
PUT    /api/admin/subscription-plans/:id - Update plan
POST   /api/admin/subscriptions/:id/items - Set monthly items
GET    /api/admin/subscriptions/billing-report - Billing report
```

#### Billing & Payments
```
POST   /api/subscriptions/:id/payment-method - Update payment method
GET    /api/subscriptions/:id/billing-history - Get billing history
POST   /api/admin/subscriptions/process-billing - Process monthly billing
GET    /api/admin/subscriptions/billing-failed - Failed charges
POST   /api/admin/subscriptions/retry-charge - Retry failed charge
```

### Backend File Structure
```
backend/
├── models/
│   ├── subscription.model.ts
│   ├── subscription-plan.model.ts
│   ├── subscription-order.model.ts
│   └── subscription-change.model.ts
├── services/
│   ├── subscription.service.ts
│   ├── billing.service.ts
│   ├── recurring-charge.service.ts
│   └── subscription-analytics.service.ts
├── controllers/
│   ├── subscription.controller.ts
│   ├── subscription-plan.controller.ts
│   ├── billing.controller.ts
│   └── admin-subscription.controller.ts
├── routes/
│   ├── subscription.routes.ts
│   ├── subscription-plan.routes.ts
│   ├── billing.routes.ts
│   └── admin-subscription.routes.ts
├── jobs/
│   ├── process-recurring-billing.job.ts
│   ├── retry-failed-charges.job.ts
│   └── notify-upcoming-shipment.job.ts
├── validators/
│   └── subscription.validator.ts
├── utils/
│   └── subscription.utils.ts
└── config/
    └── subscription.config.ts
```

---

## 🎨 Frontend Implementation Structure

### Pages
```
frontend/
├── app/
│   ├── subscriptions/
│   │   ├── page.tsx                 - Subscription listing
│   │   ├── [id]/
│   │   │   ├── page.tsx             - Subscription details
│   │   │   ├── edit/
│   │   │   │   └── page.tsx         - Edit subscription
│   │   │   └── manage/
│   │   │       └── page.tsx         - Manage/pause/resume
│   │   ├── plans/
│   │   │   └── page.tsx             - Browse subscription plans
│   │   ├── checkout/
│   │   │   └── page.tsx             - Subscription checkout
│   │   └── success/
│   │       └── page.tsx             - Subscription confirmation
│   └── admin/
│       └── subscriptions/
│           ├── page.tsx             - Admin subscription list
│           ├── [id]/
│           │   ├── page.tsx         - View subscription
│           │   └── manage-items/
│           │       └── page.tsx     - Manage monthly items
│           ├── plans/
│           │   ├── page.tsx         - Manage plans
│           │   └── [id]/
│           │       └── page.tsx     - Edit plan
│           ├── billing/
│           │   ├── page.tsx         - Billing dashboard
│           │   └── failed/
│           │       └── page.tsx     - Failed charges
│           └── analytics/
│               └── page.tsx         - Subscription analytics
```

### Components
```
frontend/
├── components/
│   ├── subscriptions/
│   │   ├── subscription-card.tsx           - Display subscription
│   │   ├── subscription-plans-grid.tsx    - Show available plans
│   │   ├── subscription-checkout.tsx      - Checkout flow
│   │   ├── subscription-details.tsx       - Detailed view
│   │   ├── subscription-editor.tsx        - Edit form
│   │   ├── subscription-pause-modal.tsx   - Pause dialog
│   │   ├── subscription-cancel-modal.tsx  - Cancel dialog
│   │   ├── subscription-skip-modal.tsx    - Skip month dialog
│   │   ├── monthly-box-contents.tsx       - Show monthly items
│   │   └── billing-history-table.tsx      - Billing records
│   └── admin/
│       ├── subscription-list-table.tsx    - Admin view all
│       ├── subscription-analytics.tsx     - Analytics charts
│       ├── billing-dashboard.tsx          - Billing overview
│       ├── failed-charges-table.tsx       - Failed payments
│       ├── plan-editor.tsx                - Create/edit plans
│       └── monthly-items-editor.tsx       - Manage box items
```

### Hooks
```
frontend/
├── hooks/
│   ├── use-subscriptions.ts         - Get user subscriptions
│   ├── use-subscription-plans.ts    - Get available plans
│   ├── use-subscription-form.ts     - Form handling
│   ├── use-billing-history.ts       - Fetch billing records
│   └── use-subscription-analytics.ts - Analytics data
```

### Utilities & Context
```
frontend/
├── lib/
│   ├── subscription-context.tsx     - Subscription state
│   └── subscription-utils.ts        - Helper functions
```

---

## 📅 Implementation Timeline

### Phase 1: Database & Backend Setup (Week 1-2)
- [ ] Create database tables
- [ ] Create stored procedures for common operations
- [ ] Implement subscription models
- [ ] Implement subscription service layer
- [ ] Create API endpoints (basic CRUD)
- [ ] Implement validation & error handling

### Phase 2: Billing System (Week 2-3)
- [ ] Implement billing service
- [ ] Create recurring billing job
- [ ] Implement payment retry logic
- [ ] Create billing history tracking
- [ ] Implement invoice generation

### Phase 3: Frontend - Customer Features (Week 3-4)
- [ ] Create subscription plans display
- [ ] Implement subscription checkout flow
- [ ] Create customer subscription management page
- [ ] Implement pause/resume/cancel UI
- [ ] Create billing history view
- [ ] Add subscription context & hooks

### Phase 4: Frontend - Admin Dashboard (Week 4-5)
- [ ] Create admin subscription list
- [ ] Implement subscription analytics
- [ ] Create plan management UI
- [ ] Implement monthly items editor
- [ ] Create billing dashboard
- [ ] Add failed charges management

### Phase 5: Testing & Optimization (Week 5-6)
- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] E2E tests for user workflows
- [ ] Performance optimization
- [ ] Payment processor testing (Stripe/Square)
- [ ] Billing cycle testing

---

## 💳 Payment Integration

### Supported Providers
- **Stripe** (Primary)
  - Subscriptions API
  - Recurring charges
  - Webhooks for payment events
  - Invoice generation

- **PayPal** (Optional)
  - Billing Plans
  - Subscriptions

### Implementation Details
```
- Store payment method tokens
- Handle failed payment retries
- Automatic reconciliation
- Webhook handling for payment confirmations
- PCI compliance
```

---

## 🔒 Security Considerations

1. **Payment Security**
   - Never store full credit card details
   - Use payment processor tokens
   - Implement PCI compliance
   - Validate payment methods

2. **Authorization**
   - Users can only manage their own subscriptions
   - Admin endpoints require admin role
   - API rate limiting for billing operations

3. **Data Protection**
   - Encrypt sensitive subscription data
   - Audit trail for all changes
   - Secure webhooks (signature verification)

4. **Compliance**
   - Renewal notifications before charging
   - Clear cancellation process
   - Easy pause/resume functionality
   - Refund policies

---

## 📊 Key Metrics & Monitoring

### Metrics to Track
```javascript
{
  "total_subscriptions": number,
  "active_subscriptions": number,
  "paused_subscriptions": number,
  "churn_rate": percentage,
  "monthly_recurring_revenue": amount,
  "failed_charge_rate": percentage,
  "average_subscription_lifetime": days,
  "customer_ltv": amount,
  "plan_distribution": {
    "basic": count,
    "premium": count,
    "deluxe": count
  }
}
```

### Monitoring
- Billing job success/failure rate
- Payment processing lag time
- Failed charge retry success rate
- Customer support tickets related to subscriptions
- Churn analytics by reason

---

## 🎯 User Stories

### Customer Features
1. **Browse Plans** - "As a customer, I want to view subscription plans"
2. **Create Subscription** - "As a customer, I want to subscribe to a coffee box"
3. **Manage Subscription** - "As a customer, I want to pause/resume my subscription"
4. **Skip Month** - "As a customer, I want to skip a billing month"
5. **View Upcoming Box** - "As a customer, I want to see next month's items"
6. **Update Address** - "As a customer, I want to update delivery address"
7. **View Billing** - "As a customer, I want to see my billing history"
8. **Cancel** - "As a customer, I want to cancel anytime"

### Admin Features
1. **View All** - "As admin, I want to see all subscriptions"
2. **Analytics** - "As admin, I want to view subscription metrics"
3. **Manage Plans** - "As admin, I want to create/edit plans"
4. **Set Items** - "As admin, I want to curate monthly box items"
5. **Handle Failures** - "As admin, I want to retry failed charges"
6. **Reports** - "As admin, I want to generate reports"

---

## 🚀 Testing Strategy

### Unit Tests
- Subscription service methods
- Billing calculations
- Validation functions
- Utility functions

### Integration Tests
- API endpoints with database
- Payment processing flow
- Billing job execution
- Error handling

### E2E Tests
- Complete subscription flow
- Billing cycle simulation
- Admin management flow
- Payment retry scenarios

---

## 📝 Documentation Requirements

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema ERD
- [ ] User guide for customers
- [ ] Admin guide for staff
- [ ] Developer setup guide
- [ ] Troubleshooting guide

---

## 🔄 Future Enhancements

1. **Gift Subscriptions** - Allow gifting subscription boxes
2. **Referral Program** - Earn credits for referrals
3. **Customization** - Let customers choose monthly items
4. **Family Plans** - Multiple boxes per subscription
5. **Tiered Rewards** - Exclusive items for long-term subscribers
6. **Pre-orders** - Pre-order items for upcoming boxes
7. **Seasonal Plans** - Limited-time subscription options

---

## ✅ Definition of Done

- [ ] All database tables created and indexed
- [ ] All API endpoints implemented and tested
- [ ] Frontend pages and components complete
- [ ] Payment processing integrated and tested
- [ ] Billing job automated and monitored
- [ ] Admin dashboard functional
- [ ] Customer portal functional
- [ ] Documentation complete
- [ ] Security review completed
- [ ] Performance testing passed
- [ ] UAT completed
- [ ] Deployment guide created

---

## 📞 Dependencies & Blockers

### External Dependencies
- Payment processor API (Stripe/PayPal)
- Email service (SendGrid/Mailgun) for notifications
- SMS service (optional for reminders)

### Internal Dependencies
- User authentication system ✓ (Already implemented)
- Order management ✓ (Already implemented)
- Payment method storage (Partial)
- Notification system (Partial)

---

## 🎥 Success Criteria

1. **Functional Completeness**
   - All user stories implemented
   - All edge cases handled
   - All error scenarios covered

2. **Performance**
   - Subscription API response < 500ms
   - Billing job completes within SLA
   - No database query N+1 problems

3. **Quality**
   - 80%+ code coverage
   - Zero critical bugs in UAT
   - All security tests passed

4. **User Experience**
   - Subscription checkout < 3 steps
   - Clear renewal/cancellation policies
   - Mobile-responsive design

---

**Next Steps:**
1. Approve this plan
2. Review and adjust timeline if needed
3. Setup development environment
4. Begin Phase 1 implementation
5. Schedule weekly status reviews
