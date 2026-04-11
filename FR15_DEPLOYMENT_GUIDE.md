/**
 * FR15 Subscription Feature - Deployment Guide
 * Step-by-step guide for production deployment
 */

# FR15 Deployment Guide

## 📋 Pre-Deployment Checklist

### Backend Setup
```bash
# 1. Install dependencies
cd backend
npm install

# 2. Build TypeScript
npm run build

# 3. Verify database migration runs
npm run migrate
# Output should show: ✅ Database Setup Complete!

# 4. Check for build errors
npm run build
# Should complete with NO errors
```

### Frontend Setup
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Build Next.js
npm run build

# 3. Verify no TypeScript errors
# Should complete successfully
```

---

## 🔧 Environment Configuration

### Backend (.env)

```env
# Database - Azure SQL Server
DB_SERVER=your-server.database.windows.net
DB_PORT=1433
DB_USER=your-username
DB_PASSWORD=your-secure-password
DB_NAME=your-database-name

# Application
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d

# Stripe
STRIPE_API_KEY=sk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_live_your_webhook_secret

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Email (Optional - for Phase 3)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_your_publishable_key
```

---

## 🚀 Deployment Steps

### Step 1: Database Preparation

```bash
# 1. Backup existing database (if any)
# Use Azure SQL portal or SSMS

# 2. Run migrations on production database
cd backend
npm run migrate

# 3. Verify tables created
SELECT * FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo')
```

### Step 2: Backend Deployment

**Option A: Azure App Service**

```bash
# 1. Create Azure App Service (Node.js 20)
# From Azure Portal:
# - Create resource → App Service
# - Runtime stack: Node.js 20 LTS
# - OS: Windows or Linux

# 2. Configure connection string
# App Service → Configuration → Add new app setting
# Name: DB_SERVER, Value: your-server.database.windows.net
# (Add all env vars)

# 3. Deploy code
az webapp deployment source config-zip \
  --resource-group your-group \
  --name your-app-name \
  --src backend.zip

# 4. Start the app
az webapp start --resource-group your-group --name your-app-name

# 5. Test health endpoint
curl https://your-backend-url.azurewebsites.net/health
```

**Option B: Docker Container**

```dockerfile
# Dockerfile for backend
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

```bash
# Build & push to registry
docker build -t subscription-backend:1.0 .
docker push your-registry.azurecr.io/subscription-backend:1.0

# Deploy to Azure Container Instances
az container create \
  --resource-group your-group \
  --name subscription-backend \
  --image your-registry.azurecr.io/subscription-backend:1.0 \
  --cpu 2 \
  --memory 2 \
  --environment-variables \
    DB_SERVER=your-server.database.windows.net \
    DB_USER=your-user \
    DB_PASSWORD=your-password
```

### Step 3: Frontend Deployment

**Option A: Azure Static Web Apps**

```bash
# 1. Build Next.js (generates .next folder)
npm run build

# 2. Deploy via GitHub Actions (automatic)
# Azure will auto-deploy on git push

# 3. Configure environment variables
# Static Web Apps → Configuration → Environment variables
# Add: NEXT_PUBLIC_API_URL
```

**Option B: Vercel**

```bash
# 1. Connect GitHub repo
# vercel.com → Import Project

# 2. Configure environment variables
# Settings → Environment Variables
# NEXT_PUBLIC_API_URL=https://your-backend-url

# 3. Deploy
# Automatic on git push to main
```

### Step 4: Stripe Setup

```bash
# 1. Register webhook endpoints
# Stripe Dashboard → Developers → Webhooks

# Add endpoint:
URL: https://your-backend-url/api/payments/webhooks
Events:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - customer.subscription.updated
  - customer.subscription.deleted
```

### Step 5: Database Backup & Monitoring

```bash
# 1. Enable automatic backups
# Azure SQL → Backups
# Set retention: 30 days (or your preference)

# 2. Monitor performance
# Azure SQL → Query Performance Insight
# Check slow queries

# 3. Setup alerts
# Monitor → Alerts
# CPU > 80%, Connection failures, etc.
```

---

## ✅ Post-Deployment Validation

### 1. Health Checks

```bash
# Backend health
curl https://your-backend-url/health
# Expected: { "status": "OK", "timestamp": "..." }

# Scheduler status
curl https://your-backend-url/api/scheduler/status
# Expected: { "initialized": true, "jobs": [...] }
```

### 2. Database Connectivity

```bash
# Test database connection from backend logs
# Should see: ✅ Database initialized

# Check if tables exist
SELECT COUNT(*) FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'dbo'
# Expected: 7+ tables
```

### 3. Frontend Load

```bash
# Visit frontend URL
https://your-domain.com

# Test login
# Navigate to /account
# Check Subscriptions tab loads
```

### 4. API Endpoints

```bash
# Test key endpoints
curl https://your-backend-url/api/subscriptions
curl https://your-backend-url/api/invoices
curl https://your-backend-url/api/payments/methods
```

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS/SSL enabled
- [ ] CORS configured for production domain only
- [ ] Database firewall allows only app servers
- [ ] SQL injection protection (parameterized queries) ✅
- [ ] Rate limiting on public endpoints
- [ ] JWT secret is strong (32+ chars)
- [ ] Stripe keys use live/production keys
- [ ] Error logs don't expose sensitive data
- [ ] Database backups encrypted
- [ ] API authentication required

---

## 📊 Monitoring & Maintenance

### Daily
- [ ] Check error logs
- [ ] Verify billing scheduler ran
- [ ] Monitor database performance

### Weekly
- [ ] Review invoice generation stats
- [ ] Check payment failure rates
- [ ] Verify backup completion

### Monthly
- [ ] Database maintenance plan
- [ ] Performance optimization
- [ ] Security updates

---

## 🚨 Incident Response

### If billing scheduler fails:
```bash
# 1. Check backend logs
# Look for: "Billing Scheduler initialized"

# 2. Verify database connectivity
# Check error messages for "Connection failed"

# 3. Restart application
az webapp restart --resource-group your-group --name your-app

# 4. Manually trigger billing
npm run build && node dist/services/billing-scheduler.service.js
```

### If database connection fails:
```bash
# 1. Check connection string
# Verify: server, user, password, database name

# 2. Check firewall rules
# Azure SQL → Firewall and virtual networks
# Add client IP if needed

# 3. Test connection from management studio
# Server: your-server.database.windows.net
# Authentication: SQL Server Authentication
```

### If payment processing fails:
```bash
# 1. Check Stripe credentials
# Verify STRIPE_API_KEY starts with sk_live_

# 2. Check webhook logs
# Stripe Dashboard → Developers → Webhooks
# Review failed events

# 3. Verify payment intent
# Check subscription_orders table for failed attempts
```

---

## 📈 Performance Optimization

### Database Indexes
```sql
-- Create indexes for common queries
CREATE INDEX idx_user_subscriptions 
ON subscriptions(user_id, subscription_status);

CREATE INDEX idx_billing_date 
ON subscription_orders(billing_month, payment_status);

CREATE INDEX idx_invoice_user 
ON invoices(user_id, billing_date);
```

### Connection Pooling
```javascript
// Already configured in backend for mssql
// pool size: 10
// max retries: 3
// connection timeout: 15000ms
```

### Caching (Optional)
```bash
# Add Redis for session caching
# Environment: REDIS_URL=redis://your-redis-url
```

---

## 🎯 Rollback Plan

If critical issues occur:

```bash
# 1. Revert to previous version
git revert HEAD

# 2. Rebuild and redeploy
npm run build

# 3. Run migrations down (if schema changed)
# Manually restore previous schema

# 4. Notify users
# Prepare status page notification
```

---

## ✨ Go-Live Checklist

Before flipping the switch:
- [ ] All tests pass
- [ ] Database backups verified
- [ ] SSL certificate installed
- [ ] Email notifications working (Phase 3)
- [ ] Monitoring & alerts configured
- [ ] Support team trained
- [ ] User documentation ready
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Backup rollback plan ready

---

## 📞 Support Contacts

- **Database Issues**: Azure SQL Support
- **Payment Issues**: Stripe Support
- **Deployment Issues**: DevOps/IT Team
- **Feature Bugs**: Development Team

---

**Deployment completed successfully! 🎉**
