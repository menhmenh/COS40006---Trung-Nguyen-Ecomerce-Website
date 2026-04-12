# Manual Azure, GitHub, and Database Steps

## GitHub Secrets

Add these repository secrets:

- `AZURE_WEBAPP_PUBLISH_PROFILE`
  Used by existing frontend deploy workflow.
- `AZURE_BACKEND_WEBAPP_PUBLISH_PROFILE`
  Used by `.github/workflows/backend-deploy.yml`.
- `BACKEND_BASE_URL`
  For manual backend integration workflow.
- `JWT_SECRET`
  Shared frontend/backend signing secret.
- `INTEGRATION_PLAN_ID`
  Optional override for backend integration workflow.
- `INTEGRATION_USER_ID`
  Optional override for backend integration workflow.
- `INTEGRATION_USER_EMAIL`
  Optional override for backend integration workflow.

## Azure App Service: Frontend

In Azure Portal for the existing frontend app:

1. Open App Service `tn-ecommerce-staging`.
2. Go to `Settings -> Environment variables`.
3. Add:
   - `AZURE_SQL_SERVER`
   - `AZURE_SQL_DATABASE`
   - `AZURE_SQL_USER`
   - `AZURE_SQL_PASSWORD`
   - `AZURE_SQL_PORT`
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BACKEND_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `RESEND_API_KEY` if forgot-password mail is needed
4. Save and restart the app.

## Azure App Service: Backend

Create a second App Service for the backend:

1. Azure Portal -> Create `App Service`
2. Runtime: `Node 20 LTS`
3. App name suggestion: `tn-ecommerce-backend-staging`
4. After creation, go to `Settings -> Environment variables`
5. Add:
   - `PORT=8080` or leave empty if Azure manages it
   - `NODE_ENV=production`
   - `DB_SERVER`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `JWT_EXPIRY=7d`
   - `FRONTEND_URL=https://your-frontend-host`
   - `STRIPE_API_KEY`
   - `STRIPE_WEBHOOK_SECRET`
6. In `Configuration -> General settings`, ensure startup command uses `npm start` if Azure does not infer it automatically.
7. Download the publish profile and save it as GitHub secret `AZURE_BACKEND_WEBAPP_PUBLISH_PROFILE`.

## Azure SQL

You need to decide whether the backend subscription module uses:

- the same Azure SQL database as frontend, or
- a separate subscription database

Recommended:
- separate dev/staging database for backend migration safety

Required checks:

1. Allow Azure App Service outbound access to Azure SQL firewall.
2. Allow your local IP for development.
3. Run backend migration only on the chosen dev/staging database:

```powershell
cd backend
npm run migrate
```

Do not point this migration at production until you replace the destructive setup script with proper migrations.

## Stripe

If you want payment method endpoints to work:

1. Create Stripe test keys
2. Put `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` in backend environment variables
3. Configure webhook endpoint:
   - `https://<backend-app>/api/payments/webhook`
4. Subscribe to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`

## GitHub Actions

Recommended workflow usage:

- `Frontend CI`
  Runs automatically on push/PR and checks build + smoke.
- `Backend CI`
  Runs automatically on push/PR and checks build + smoke without DB.
- `Deploy to Azure App Service`
  Existing frontend deploy.
- `Deploy Backend to Azure App Service`
  New backend deploy.
- `Backend Integration`
  Manual run only after secrets and staging backend are configured.
