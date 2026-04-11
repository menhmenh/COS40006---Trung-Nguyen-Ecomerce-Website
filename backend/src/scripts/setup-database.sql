-- Coffee Subscription Database Schema
-- Created: April 11, 2026

-- Drop existing tables and recreate (for fresh setup)
-- Note: In production, use migrations instead

-- 1. Subscription Plans
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscription_plans')
  DROP TABLE dbo.subscription_plans;

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
    created_by CHAR(36),
    INDEX idx_status (status),
    INDEX idx_created_date (created_date)
);

-- 2. Subscriptions
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscriptions')
  DROP TABLE dbo.subscriptions;

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
    FOREIGN KEY (plan_id) REFERENCES dbo.subscription_plans(plan_id),
    INDEX idx_user_subscription (user_id),
    INDEX idx_next_billing (next_billing_date),
    INDEX idx_status (subscription_status)
);

-- 3. Subscription Items (monthly box contents)
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscription_items')
  DROP TABLE dbo.subscription_items;

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
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    INDEX idx_subscription (subscription_id),
    INDEX idx_month (month_number)
);

-- 4. Subscription Orders (billing records)
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscription_orders')
  DROP TABLE dbo.subscription_orders;

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
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    INDEX idx_subscription (subscription_id),
    INDEX idx_charge_date (charge_date),
    INDEX idx_payment_status (payment_status)
);

-- 5. Subscription Skip Requests
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscription_skip_requests')
  DROP TABLE dbo.subscription_skip_requests;

CREATE TABLE dbo.subscription_skip_requests (
    skip_request_id CHAR(36) PRIMARY KEY,
    subscription_id CHAR(36) NOT NULL,
    skip_billing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'APPROVED',
    reason NVARCHAR(500),
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    requested_by CHAR(36),
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    INDEX idx_subscription (subscription_id),
    INDEX idx_skip_date (skip_billing_date)
);

-- 6. Subscription Changes (audit trail)
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'subscription_changes')
  DROP TABLE dbo.subscription_changes;

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
    FOREIGN KEY (subscription_id) REFERENCES dbo.subscriptions(subscription_id),
    INDEX idx_subscription (subscription_id),
    INDEX idx_change_type (change_type),
    INDEX idx_created_date (created_date)
);

-- 7. Payment Methods (Stripe integration)
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'payment_methods')
  DROP TABLE dbo.payment_methods;

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

-- Update subscription_orders to add payment-related columns
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.subscription_orders') AND name = 'stripe_payment_intent')
BEGIN
    ALTER TABLE dbo.subscription_orders ADD stripe_payment_intent NVARCHAR(100);
    ALTER TABLE dbo.subscription_orders ADD stripe_refund_id NVARCHAR(100);
    ALTER TABLE dbo.subscription_orders ADD refund_reason NVARCHAR(500);
    ALTER TABLE dbo.subscription_orders ADD INDEX idx_stripe_payment_intent (stripe_payment_intent);
END;

-- Sample subscription plans
SET IDENTITY_INSERT dbo.subscription_plans OFF;

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
