import * as sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'coffee_subscription',
  port: parseInt(process.env.DB_PORT || '1433'),
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'YourPassword123!',
    },
  },
  options: {
    trustServerCertificate: true,
  },
};

async function seedDatabase() {
  const pool = new sql.ConnectionPool(config);

  try {
    console.log('🔗 Connecting to database...');
    await pool.connect();
    console.log('✅ Connected to database');

    // Check if sample data already exists
    const result = await pool.request().query(
      'SELECT COUNT(*) as count FROM subscription_plans'
    );

    if (result.recordset[0].count > 0) {
      console.log('ℹ️  Sample data already exists, skipping seed');
      return;
    }

    console.log('🌱 Seeding sample subscription data...');

    // Sample subscription plans
    const plans = [
      {
        id: uuidv4(),
        name: 'Basic Monthly',
        description: 'Perfect for coffee lovers starting their subscription journey. Receive 250g of premium coffee monthly.',
        price: 29.99,
        cycle: 30,
        frequency: 'MONTHLY',
        maxSkip: 3,
      },
      {
        id: uuidv4(),
        name: 'Premium Monthly',
        description: 'Step up your coffee game. 500g of specialty-roasted beans with tasting notes and brewing guides.',
        price: 49.99,
        cycle: 30,
        frequency: 'MONTHLY',
        maxSkip: 3,
      },
      {
        id: uuidv4(),
        name: 'Deluxe Monthly',
        description: 'For the ultimate coffee enthusiast. 750g of rare blend, limited edition items, and exclusive perks.',
        price: 79.99,
        cycle: 30,
        frequency: 'MONTHLY',
        maxSkip: 3,
      },
    ];

    for (const plan of plans) {
      await pool
        .request()
        .input('plan_id', sql.Char(36), plan.id)
        .input('plan_name', sql.NVarChar(100), plan.name)
        .input('description', sql.NVarChar, plan.description)
        .input('price', sql.Decimal(10, 2), plan.price)
        .input('billing_cycle', sql.Int, plan.cycle)
        .input('frequency', sql.VarChar(20), plan.frequency)
        .input('max_skip_per_year', sql.Int, plan.maxSkip)
        .query(`
          INSERT INTO subscription_plans 
          (plan_id, plan_name, description, price, billing_cycle, frequency, max_skip_per_year, status)
          VALUES 
          (@plan_id, @plan_name, @description, @price, @billing_cycle, @frequency, @max_skip_per_year, 'ACTIVE')
        `);
      console.log(`✅ Added plan: ${plan.name}`);
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║      ✅ Seed Data Inserted!            ║');
    console.log('║    3 subscription plans created        ║');
    console.log('╚════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run seed
seedDatabase().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
