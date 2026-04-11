# 🔌 Subscription API Documentation

**Base URL:** `http://localhost:5000/api`

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

**Token Format:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "user" | "admin"
}
```

---

## 📚 Customer Endpoints

### 1️⃣ Get Available Subscription Plans

**Request:**
```http
GET /subscription-plans
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "plan_id": "550e8400-e29b-41d4-a716-446655440001",
      "plan_name": "Basic Monthly",
      "description": "Perfect for coffee lovers starting their subscription journey...",
      "price": 29.99,
      "billing_cycle": 30,
      "frequency": "MONTHLY",
      "max_skip_per_year": 3,
      "status": "ACTIVE",
      "created_date": "2024-04-11T10:00:00Z"
    },
    {
      "plan_id": "550e8400-e29b-41d4-a716-446655440002",
      "plan_name": "Premium Monthly",
      "price": 49.99
    },
    {
      "plan_id": "550e8400-e29b-41d4-a716-446655440003",
      "plan_name": "Deluxe Monthly",
      "price": 79.99
    }
  ],
  "count": 3
}
```

---

### 2️⃣ Get Single Plan Details

**Request:**
```http
GET /subscription-plans/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plan_id": "550e8400-e29b-41d4-a716-446655440001",
    "plan_name": "Basic Monthly",
    "description": "250g premium coffee monthly",
    "price": 29.99,
    "billing_cycle": 30,
    "frequency": "MONTHLY",
    "max_skip_per_year": 3,
    "status": "ACTIVE"
  }
}
```

---

### 3️⃣ Create New Subscription

**Request:**
```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": "550e8400-e29b-41d4-a716-446655440001",
  "delivery_address_id": "addr-uuid-12345",
  "payment_method_id": "pm-uuid-12345"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "user_id": "user-uuid-12345",
    "plan_id": "550e8400-e29b-41d4-a716-446655440001",
    "subscription_status": "ACTIVE",
    "start_date": "2024-04-11",
    "next_billing_date": "2024-05-11",
    "delivery_address_id": "addr-uuid-12345",
    "payment_method_id": "pm-uuid-12345",
    "skipped_months": 0,
    "created_date": "2024-04-11T10:15:30Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Missing required fields: plan_id, delivery_address_id, payment_method_id"
}
```

---

### 4️⃣ Get User's Subscriptions

**Request:**
```http
GET /subscriptions
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "subscription_id": "sub-uuid-98765",
      "user_id": "user-uuid-12345",
      "plan_id": "550e8400-e29b-41d4-a716-446655440001",
      "subscription_status": "ACTIVE",
      "start_date": "2024-04-11",
      "next_billing_date": "2024-05-11",
      "created_date": "2024-04-11T10:15:30Z"
    }
  ],
  "count": 1
}
```

---

### 5️⃣ Get Subscription Details

**Request:**
```http
GET /subscriptions/:id
Authorization: Bearer <token>
```

**Parameter:**
- `id` - Subscription UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "subscription_id": "sub-uuid-98765",
    "user_id": "user-uuid-12345",
    "plan_id": "550e8400-e29b-41d4-a716-446655440001",
    "subscription_status": "ACTIVE",
    "start_date": "2024-04-11",
    "next_billing_date": "2024-05-11",
    "last_billing_date": null,
    "cancelled_date": null,
    "payment_method_id": "pm-uuid-12345",
    "delivery_address_id": "addr-uuid-12345",
    "skipped_months": 0,
    "created_date": "2024-04-11T10:15:30Z",
    "updated_date": "2024-04-11T10:15:30Z"
  }
}
```

---

### 6️⃣ Update Subscription

**Request:**
```http
PUT /subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "delivery_address_id": "new-addr-uuid",
  "payment_method_id": "new-pm-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "delivery_address_id": "new-addr-uuid",
    "payment_method_id": "new-pm-uuid",
    "updated_date": "2024-04-11T11:20:00Z"
  }
}
```

---

### 7️⃣ Pause Subscription

**Request:**
```http
PUT /subscriptions/:id/pause
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Subscription paused successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "subscription_status": "PAUSED",
    "updated_date": "2024-04-11T11:25:00Z"
  }
}
```

---

### 8️⃣ Resume Subscription

**Request:**
```http
PUT /subscriptions/:id/resume
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Subscription resumed successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "subscription_status": "ACTIVE",
    "updated_date": "2024-04-11T11:30:00Z"
  }
}
```

---

### 9️⃣ Cancel Subscription

**Request:**
```http
DELETE /subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Too expensive"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "subscription_status": "CANCELLED",
    "cancelled_date": "2024-04-11T11:35:00Z",
    "cancellation_reason": "Too expensive"
  }
}
```

---

### 🔟 Skip Billing Month

**Request:**
```http
POST /subscriptions/:id/skip
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Billing month skipped successfully",
  "data": {
    "subscription_id": "sub-uuid-98765",
    "next_billing_date": "2024-06-10",
    "skipped_months": 1,
    "updated_date": "2024-04-11T11:40:00Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Maximum skip limit reached",
  "maxSkips": 3
}
```

---

## 👨‍💼 Admin Endpoints

### Admin: Get All Subscriptions

**Request:**
```http
GET /admin/subscriptions
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "subscription_id": "sub-uuid-1",
      "user_id": "user-uuid-1",
      "plan_name": "Basic Monthly",
      "price": 29.99,
      "subscription_status": "ACTIVE",
      "total_orders": 3
    }
  ],
  "count": 1
}
```

---

### Admin: Get Subscription Analytics

**Request:**
```http
GET /admin/subscriptions/analytics
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_subscriptions": 45,
    "active_subscriptions": 35,
    "paused_subscriptions": 5,
    "cancelled_subscriptions": 5,
    "total_plans": 3,
    "total_revenue": 12345.67
  }
}
```

---

### Admin: Create Subscription Plan

**Request:**
```http
POST /admin/subscription-plans
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "plan_name": "Premium Plus",
  "description": "Enhanced premium plan with extra perks",
  "price": 59.99,
  "billing_cycle": 30,
  "frequency": "MONTHLY",
  "max_skip_per_year": 4
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Subscription plan created successfully",
  "data": {
    "plan_id": "plan-new-uuid",
    "plan_name": "Premium Plus",
    "price": 59.99,
    "status": "ACTIVE",
    "created_date": "2024-04-11T12:00:00Z"
  }
}
```

---

### Admin: Get Failed Charges

**Request:**
```http
GET /admin/subscriptions/billing-failed
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "subscription_order_id": "order-uuid",
      "subscription_id": "sub-uuid",
      "user_id": "user-uuid",
      "amount": 29.99,
      "payment_status": "FAILED",
      "retry_count": 2,
      "error_message": "Insufficient funds",
      "created_date": "2024-04-10T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Admin: Retry Failed Charge

**Request:**
```http
POST /admin/subscriptions/retry-charge
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subscription_order_id": "order-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Charge retry initiated",
  "data": {
    "subscription_order_id": "order-uuid",
    "retry_count": 3,
    "last_retry_date": "2024-04-11T12:30:00Z"
  }
}
```

---

### Admin: Get Billing Report

**Request:**
```http
GET /admin/subscriptions/billing-report?startDate=2024-04-01&endDate=2024-04-30
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD) - optional
- `endDate` - End date (YYYY-MM-DD) - optional

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "billing_date": "2024-04-11",
      "total_charges": 15,
      "successful_charges": 13,
      "failed_charges": 2,
      "total_revenue": 449.85
    }
  ]
}
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Subscription not found" | "Plan not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch subscriptions"
}
```

---

## 🧪 cURL Examples

### Get Plans
```bash
curl http://localhost:5000/api/subscription-plans
```

### Create Subscription
```bash
curl -X POST http://localhost:5000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "plan_id": "550e8400-e29b-41d4-a716-446655440001",
    "delivery_address_id": "addr-uuid",
    "payment_method_id": "pm-uuid"
  }'
```

### Pause Subscription
```bash
curl -X PUT http://localhost:5000/api/subscriptions/sub-uuid/pause \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Admin Analytics
```bash
curl http://localhost:5000/api/admin/subscriptions/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📈 Next Phase: Billing System

The following features will be implemented in Phase 2:

- ✅ Subscription CRUD operations
- ✅ Subscription lifecycle (pause/resume/cancel)
- ✅ Admin endpoints
- ⏳ **Payment gateway integration (Stripe/PayPal)**
- ⏳ **Recurring billing job**
- ⏳ **Failed payment retry logic**
- ⏳ **Invoice generation**
- ⏳ **Webhook handling**
- ⏳ **Email notifications**
