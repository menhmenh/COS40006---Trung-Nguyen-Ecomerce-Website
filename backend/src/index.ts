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

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Scheduler status endpoint
app.get('/api/scheduler/status', (req, res) => {
  const status = billingScheduler.getStatus();
  res.json({
    success: true,
    data: status,
  });
});

// API Routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminSubscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(handleErrors);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Initialize billing scheduler (Phase 3)
    await billingScheduler.initialize();
    console.log('✅ Billing Scheduler initialized');

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  🎉 Subscription Backend Server Started  ║
║  Port: ${PORT}                               
║  Env: ${process.env.NODE_ENV || 'development'}                            
║  Time: ${new Date().toISOString()}
╚════════════════════════════════════════════╝
      `);

      // Log scheduler status
      const schedulerStatus = billingScheduler.getStatus();
      console.log('\n📅 Scheduled Jobs Status:');
      schedulerStatus.jobs.forEach((job) => {
        console.log(`   ${job.name}: ${job.status}`);
        if (job.nextRun) {
          console.log(`     Next run: ${job.nextRun.toISOString()}`);
        }
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
