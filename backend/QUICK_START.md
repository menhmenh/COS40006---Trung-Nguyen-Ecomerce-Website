# 🚀 Quick Start Guide - Backend Server

Get the subscription backend running in 5 minutes!

---

## Step 1: Navigate to Backend
```bash
cd backend
```

---

## Step 2: Install Dependencies
```bash
npm install
```

**Expected output:**
```
added XXX packages in Xs
```

---

## Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_SERVER=localhost          # Your SQL Server address
DB_PORT=1433                 # SQL Server port
DB_USER=sa                   # SQL Server user
DB_PASSWORD=YourPassword123! # Your SQL password
DB_NAME=coffee_subscription  # Database name
```

---

## Step 4: Setup Database

```bash
npm run migrate
```

This will:
- Connect to your SQL Server
- Create all 6 tables
- Insert 3 sample subscription plans

**Expected output:**
```
✅ Database connection established
✅ Database schema created successfully
✅ Subscription plans inserted
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║  🎉 Subscription Backend Server Started   ║
║  Port: 5000
║  Env: development
║  Time: 2024-04-11T12:00:00Z
╚════════════════════════════════════════════╝
```

---

## ✅ Verify It's Working

### Health Check
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2024-04-11T12:00:00Z"
}
```

### Get Subscription Plans
```bash
curl http://localhost:5000/api/subscription-plans
```

**Expected response:**
```json
{
  "success": true,
  "data": [
    {
      "plan_id": "550e8400-e29b-41d4-a716-446655440001",
      "plan_name": "Basic Monthly",
      "price": 29.99,
      "status": "ACTIVE"
    },
    ...
  ],
  "count": 3
}
```

---

## 🔧 Available Commands

```bash
npm run dev         # Start development server (with auto-reload)
npm run build       # Build TypeScript to JavaScript
npm start           # Run production build
npm run migrate     # Setup database schema
npm run seed        # Seed sample data (coming soon)
```

---

## 📝 Testing Endpoints

### Using Thunder Client Extension (Recommended)
1. Install Thunder Client in VS Code
2. Create new request
3. Set method: `GET`
4. Set URL: `http://localhost:5000/api/subscription-plans`
5. Click "Send"

### Using cURL
```bash
# Get plans
curl http://localhost:5000/api/subscription-plans

# Get admin analytics (requires token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/admin/subscriptions/analytics
```

### Using Postman
1. Open Postman
2. Import requests from `API_DOCUMENTATION.md`
3. Set base URL to `http://localhost:5000`
4. Test endpoints

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check SQL Server is running
- Verify credentials in `.env`
- Ensure database name exists

### "Port 5000 already in use"
- Change PORT in `.env` to different number
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### "Dependencies missing"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript errors"
```bash
npm run build
```

---

## 🎯 Next Steps

1. ✅ Server is running
2. ✅ Database is configured
3. ⏳ Start testing API endpoints
4. ⏳ Implement Phase 2 (Billing System)

---

## 📖 Documentation

- Detailed setup: See `README.md`
- API endpoints: See `API_DOCUMENTATION.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 You're Ready!

The backend is now live and ready to serve the subscription feature!

**API Base URL:** `http://localhost:5000`  
**API Endpoints:** 16 (10 customer + 6 admin)  
**Database:** Coffee Subscription with 6 tables  

Happy coding! ☕
