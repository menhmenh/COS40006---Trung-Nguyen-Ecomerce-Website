import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { handleErrors } from './middleware/auth.middleware';
import subscriptionRoutes from './routes/subscription.routes';
import adminSubscriptionRoutes from './routes/admin-subscription.routes';
import paymentRoutes from './routes/payment.routes';
import invoiceRoutes from './routes/invoice.routes';
import { billingScheduler } from './services/billing-scheduler.service';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const skipDbInit = process.env.SKIP_DB_INIT === 'true';
const skipSchedulerInit = process.env.SKIP_SCHEDULER_INIT === 'true';

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbInitializationSkipped: skipDbInit,
    schedulerInitializationSkipped: skipSchedulerInit,
  });
});

app.get('/api/scheduler/status', (_req, res) => {
  res.json({
    success: true,
    data: billingScheduler.getStatus(),
  });
});

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminSubscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

app.use(handleErrors);

async function startServer() {
  try {
    if (!skipDbInit) {
      await initializeDatabase();
      console.log('Database initialized');
    } else {
      console.log('SKIP_DB_INIT=true, database initialization skipped');
    }

    if (!skipSchedulerInit && !skipDbInit) {
      await billingScheduler.initialize();
      console.log('Billing scheduler initialized');
    } else {
      console.log('Billing scheduler initialization skipped');
    }

    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);

      if (!skipSchedulerInit && !skipDbInit) {
        const schedulerStatus = billingScheduler.getStatus();
        console.log('Scheduled jobs status:');
        schedulerStatus.jobs.forEach((job) => {
          console.log(`- ${job.name}: ${job.status}`);
        });
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
