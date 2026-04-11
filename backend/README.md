# ☕ Coffee Subscription Backend

Backend service for the Trung Nguyen Coffee Subscription feature (FR15). Built with Node.js, Express, and SQL Server.

## 📋 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # Database connection pool
│   ├── models/
│   │   └── subscription.model.ts    # TypeScript interfaces
│   ├── services/
│   │   └── subscription.service.ts  # Business logic layer
│   ├── controllers/
│   │   ├── subscription.controller.ts
│   │   └── admin-subscription.controller.ts
│   ├── routes/
│   │   ├── subscription.routes.ts
│   │   └── admin-subscription.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts       # Authentication & error handling
│   ├── validators/
│   │   └── subscription.validator.ts # Input validation
│   ├── utils/
│   │   └── subscription.utils.ts    # Helper functions
│   ├── scripts/
│   │   └── setup-database.sql       # Database schema
│   └── index.ts                     # Express server entry point
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- SQL Server 2019+ (local or remote)
- TypeScript knowledge

### Installation

1. **Clone repository** (if not already done)
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Setup database schema**
```bash
npm run migrate
```

5. **Start development server**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📊 Database Schema

### Tables Created

- **subscription_plans** - Available subscription tiers (Basic, Premium, Deluxe)
- **subscriptions** - User subscription records
- **subscription_items** - Monthly box contents per subscription
- **subscription_orders** - Billing records for each subscription cycle
- **subscription_skip_requests** - Skip requests audit trail
- **subscription_changes** - Subscription modification history

## 🔌 API Endpoints

### Customer Endpoints (Protected)

#### Get User Subscriptions
```http
GET /api/subscriptions
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

#### Get Subscription Details
```http
GET /api/subscriptions/:id
Authorization: Bearer <token>
```

#### Create Subscription
```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": "your-plan-id",
  "delivery_address_id": "your-address-id",
  "payment_method_id": "your-payment-method-id"
}
```

#### Update Subscription
```http
PUT /api/subscriptions/:id
Authorization: Bearer <token>

{
  "delivery_address_id": "new-address-id",
  "payment_method_id": "new-payment-method-id"
}
```

#### Pause Subscription
```http
PUT /api/subscriptions/:id/pause
Authorization: Bearer <token>
```

#### Resume Subscription
```http
PUT /api/subscriptions/:id/resume
Authorization: Bearer <token>
```

#### Cancel Subscription
```http
DELETE /api/subscriptions/:id
Authorization: Bearer <token>

{
  "reason": "Too expensive"
}
```

#### Skip Billing Month
```http
POST /api/subscriptions/:id/skip
Authorization: Bearer <token>
```

#### Get Available Plans
```http
GET /api/subscription-plans
```

#### Get Plan Details
```http
GET /api/subscription-plans/:id
```

### Admin Endpoints (Protected)

#### Get All Subscriptions
```http
GET /api/admin/subscriptions
Authorization: Bearer <admin-token>
```

#### Get Subscription Analytics
```http
GET /api/admin/subscriptions/analytics
Authorization: Bearer <admin-token>
```

#### Get Failed Charges
```http
GET /api/admin/subscriptions/billing-failed
Authorization: Bearer <admin-token>
```

#### Retry Failed Charge
```http
POST /api/admin/subscriptions/retry-charge
Authorization: Bearer <admin-token>

{
  "subscription_order_id": "order-id"
}
```

#### Get Billing Report
```http
GET /api/admin/subscriptions/billing-report?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin-token>
```

#### Create Subscription Plan
```http
POST /api/admin/subscription-plans
Authorization: Bearer <admin-token>

{
  "plan_name": "Premium Plus",
  "description": "Enhanced premium plan",
  "price": 59.99,
  "billing_cycle": 30,
  "frequency": "MONTHLY",
  "max_skip_per_year": 3
}
```

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_NAME=coffee_subscription

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Payment (Future integration)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🔐 Authentication

The backend uses JWT (JSON Web Tokens) for authentication.

### How to test with JWT:

1. **Get a token** from your auth service
2. **Include in request header:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Create Subscription (example)
```bash
curl -X POST http://localhost:5000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "plan_id": "550e8400-e29b-41d4-a716-446655440001",
    "delivery_address_id": "address-uuid",
    "payment_method_id": "payment-uuid"
  }'
```

## 🔄 Phase 2: Billing System (Next)

The following will be implemented:

- [ ] Recurring billing job (process monthly charges)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Failed payment retry logic
- [ ] Invoice generation
- [ ] Webhook handling
- [ ] Notification system

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 🛠️ Development

### Code Style
- TypeScript strict mode enabled
- ESLint configured
- Use async/await for async operations

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Thunder Client (for API testing)
- Database Client (for SQL Server)

## 📞 Support

For issues or questions:
1. Check the FR15_SUBSCRIPTION_PLAN.md for requirements
2. Review error logs in terminal
3. Check database indexes are created

## 📄 License

MIT
