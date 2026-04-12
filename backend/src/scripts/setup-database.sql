-- Coffee Subscription Database Schema
-- Created: April 11, 2026

-- Drop existing tables and recreate (for fresh setup)
-- Note: In production, use migrations instead

IF OBJECT_ID('dbo.payment_methods', 'U') IS NOT NULL
  DROP TABLE dbo.payment_methods;

IF OBJECT_ID('dbo.subscription_changes', 'U') IS NOT NULL
  DROP TABLE dbo.subscription_changes;

IF OBJECT_ID('dbo.subscription_skip_requests', 'U') IS NOT NULL
  DROP TABLE dbo.subscription_skip_requests;

IF OBJECT_ID('dbo.subscription_orders', 'U') IS NOT NULL
  DROP TABLE dbo.subscription_orders;

IF OBJECT_ID('dbo.subscription_items', 'U') IS NOT NULL
  DROP TABLE dbo.subscription_items;

IF OBJECT_ID('dbo.subscriptions', 'U') IS NOT NULL
  DROP TABLE dbo.subscriptions;

IF OBJECT_ID('dbo.subscription_plans', 'U') IS NOT NULL
  DROP TABLE dbo.subscription_plans;

-- 1. Subscription Plans
CREATE TABLE dbo.subscription_plans (
    plan_id CHAR(36) PRIMARY KEY,
    plan_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(10,2) NOT NULL,
    billing_cycle INT DEFAULT 30,
    frequency VARCHAR(20) DEFAULT 'MONTHLY',
    max_skip_per_year INT DEFAULT 3,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    created_by CHAR(36)
);

CREATE INDEX idx_subscription_plans_status ON dbo.subscription_plans(status);
CREATE INDEX idx_subscription_plans_created_date ON dbo.subscription_plans(created_date);

-- 2. Subscriptions
CREATE TABLE dbo.subscriptions (
    subscription_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    plan_id CHAR(36) NOT NULL,
    subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    next_billing_date DATE NOT NULL,
    last_billing_date DATE,
    cancelled_date DATE,
    cancellation_reason NVARCHAR(500),
    payment_method_id CHAR(36),
    delivery_address_id CHAR(36),
    skipped_months INT DEFAULT 0,
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (plan_id) REFERENCES dbo.subscription_plans(plan_id)
);

CREATE INDEX idx_subscriptions_user ON dbo.subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_billing_date ON dbo.subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_status ON dbo.subscriptions(subscription_status);

-- 3. Subscription Items (monthly box contents)
CREATE TABLE dbo.subscription_items (
    subscription_item_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    month_number INT NOT NULL,
    product_id CHAR(36),
    quantity INT DEFAULT 1,
    included_items NVARCHAR(MAX),
    customization NVARCHAR(MAX),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id)
);

CREATE INDEX idx_subscription_items_subscription ON dbo.subscription_items(subscription_id);
CREATE INDEX idx_subscription_items_month_number ON dbo.subscription_items(month_number);

-- 4. Subscription Orders (billing records)
CREATE TABLE dbo.subscription_orders (
    subscription_order_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    order_id CHAR(36),
    billing_month DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    retry_count INT DEFAULT 0,
    last_retry_date DATETIME2,
    charge_date DATETIME2,
    error_message NVARCHAR(MAX),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    updated_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id)
);

CREATE INDEX idx_subscription_orders_subscription ON dbo.subscription_orders(subscription_id);
CREATE INDEX idx_subscription_orders_charge_date ON dbo.subscription_orders(charge_date);
CREATE INDEX idx_subscription_orders_payment_status ON dbo.subscription_orders(payment_status);

-- 5. Subscription Skip Requests
CREATE TABLE dbo.subscription_skip_requests (
    skip_request_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    skip_billing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'APPROVED',
    reason NVARCHAR(500),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    requested_by CHAR(36),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id)
);

CREATE INDEX idx_subscription_skip_requests_subscription ON dbo.subscription_skip_requests(subscription_id);
CREATE INDEX idx_subscription_skip_requests_skip_billing_date ON dbo.subscription_skip_requests(skip_billing_date);

-- 6. Subscription Changes (audit trail)
CREATE TABLE dbo.subscription_changes (
    change_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    change_type VARCHAR(50),
    old_value NVARCHAR(MAX),
    new_value NVARCHAR(MAX),
    effective_date DATETIME2,
    reason NVARCHAR(500),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    created_by CHAR(36),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id)
);

CREATE INDEX idx_subscription_changes_subscription ON dbo.subscription_changes(subscription_id);
CREATE INDEX idx_subscription_changes_change_type ON dbo.subscription_changes(change_type);
CREATE INDEX idx_subscription_changes_created_date ON dbo.subscription_changes(created_date);

-- 7. Payment Methods (Stripe integration)
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
    updated_date DATETIME2 DEFAULT GETUTCDATE()
);

CREATE INDEX idx_payment_methods_user ON dbo.payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_customer ON dbo.payment_methods(stripe_customer_id);

-- Update subscription_orders to add payment-related columns
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.subscription_orders') AND name = 'stripe_payment_intent')
BEGIN
    ALTER TABLE dbo.subscription_orders ADD stripe_payment_intent NVARCHAR(100);
    ALTER TABLE dbo.subscription_orders ADD stripe_refund_id NVARCHAR(100);
    ALTER TABLE dbo.subscription_orders ADD refund_reason NVARCHAR(500);
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'idx_subscription_orders_stripe_payment_intent'
      AND object_id = OBJECT_ID('dbo.subscription_orders')
)
BEGIN
    CREATE INDEX idx_subscription_orders_stripe_payment_intent
        ON dbo.subscription_orders(stripe_payment_intent);
END;

INSERT INTO dbo.subscription_plans (
  plan_id, plan_name, description, price, billing_cycle, frequency, max_skip_per_year, status
) 
VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Basic Monthly',
  'Perfect for coffee lovers starting their subscription journey. Receive 250g of premium coffee monthly.',
  29.99,
  30,
  'MONTHLY',
  3,
  'ACTIVE'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Premium Monthly',
  'Step up your coffee game. 500g of specialty-roasted beans with tasting notes and brewing guides.',
  49.99,
  30,
  'MONTHLY',
  3,
  'ACTIVE'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Deluxe Monthly',
  'For the ultimate coffee enthusiast. 750g of rare blend, limited edition items, and exclusive perks.',
  79.99,
  30,
  'MONTHLY',
  3,
  'ACTIVE'
);

PRINT '✅ Database schema created successfully';
PRINT '✅ Subscription plans inserted';
