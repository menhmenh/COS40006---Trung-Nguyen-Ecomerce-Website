# Local Full-Stack Setup

## 1. Frontend env

Copy `frontend/.env.local.example` to `frontend/.env.local` and fill:

- `AZURE_SQL_*` for the main e-commerce database used by the Next.js app
- `DB_*` only if you still want separate names for recommendation stored procedures
- `JWT_SECRET` shared with backend
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## 2. Backend env

Copy `backend/.env.example` to `backend/.env` and fill:

- `DB_*` for the subscription backend database
- `JWT_SECRET` must match the frontend value
- `FRONTEND_URL=http://localhost:3000`
- `STRIPE_API_KEY` only if you want payment-method and Stripe routes to work

## 3. Install dependencies

```powershell
cd frontend
npm install

cd ..\backend
npm install
```

## 4. Prepare subscription database

Warning:
`backend/src/scripts/setup-database.sql` recreates subscription tables. Run this only on a development/test database.

```powershell
cd backend
npm run migrate
```

## 5. Start backend

```powershell
cd backend
npm run dev
```

Expected health check:

```powershell
curl http://localhost:5000/health
```

## 6. Start frontend

```powershell
cd frontend
npm run dev
```

Open:

- `http://localhost:3000/login`
- `http://localhost:3000/products`
- `http://localhost:3000/subscriptions/plans`

## 7. Smoke tests

Backend smoke:

```powershell
cd backend
$env:SKIP_DB_INIT='true'
$env:SKIP_SCHEDULER_INIT='true'
$env:PORT='5050'
npm start
```

In another terminal:

```powershell
cd backend
$env:BACKEND_SMOKE_URL='http://127.0.0.1:5050'
npm run smoke
```

Frontend smoke:

```powershell
cd frontend
npm run build
npm run start -- --port 3100
```

In another terminal:

```powershell
cd frontend
$env:FRONTEND_SMOKE_URL='http://127.0.0.1:3100'
npm run smoke
```

## 8. Subscription integration test

Run this only when backend is connected to a real dev DB that already has the subscription schema and seed data:

```powershell
cd backend
$env:BACKEND_BASE_URL='http://127.0.0.1:5000'
$env:JWT_SECRET='same-secret-as-frontend'
npm run test:integration
```
