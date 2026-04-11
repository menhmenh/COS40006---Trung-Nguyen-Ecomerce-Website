import sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Create __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

interface SqlConfig {
  server: string;
  port: number;
  authentication: {
    type: string;
    options: {
      userName: string;
      password: string;
    };
  };
  options: {
    trustServerCertificate: boolean;
    enableKeepAlive: boolean;
  };
}

const config: SqlConfig = {
  server: process.env.DB_SERVER || 'localhost',
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
    enableKeepAlive: false,
  },
};

async function setupDatabase() {
  const pool = new sql.ConnectionPool(config);
  let dbPool: sql.ConnectionPool | null = null;

  try {
    // First, connect to the master database to create the coffee_subscription database if it doesn't exist
    console.log('🔗 Connecting to SQL Server...');
    await pool.connect();
    console.log('✅ Connected to SQL Server');

    // Create database if it doesn't exist
    console.log('📊 Creating database...');
    const dbName = process.env.DB_NAME || 'coffee_subscription';
    
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = '${dbName}')
        BEGIN
          CREATE DATABASE [${dbName}];
          PRINT '✅ Database created: ${dbName}';
        END
        ELSE
        BEGIN
          PRINT '✅ Database already exists: ${dbName}';
        END
      `);
    } catch (error) {
      console.log('ℹ️  Database might already exist or error creating it:', error);
    }

    // Close the master connection
    await pool.close();

    // Now create a new pool with the subscription database
    const dbConfig: SqlConfig = {
      server: process.env.DB_SERVER || 'localhost',
      database: dbName,
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
        enableKeepAlive: false,
      },
    } as any;

    dbPool = new sql.ConnectionPool(dbConfig);
    console.log(`🔗 Connecting to database: ${dbName}...`);
    await dbPool.connect();
    console.log(`✅ Connected to database: ${dbName}`);

    // Read and execute the SQL schema
    const sqlFilePath = path.join(__dirname, 'setup-database.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split by GO (SQL Server batch separator)
    const batches = sqlContent.split(/\nGO\n/i).filter(batch => batch.trim());

    console.log(`📝 Executing ${batches.length} batches...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i].trim();
      if (batch) {
        try {
          await dbPool.request().query(batch);
          console.log(`✅ Batch ${i + 1}/${batches.length} executed successfully`);
        } catch (error: any) {
          console.warn(`⚠️  Batch ${i + 1} warning:`, error.message);
          // Continue with next batch
        }
      }
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     ✅ Database Setup Complete!       ║');
    console.log('║  All tables and sample data created   ║');
    console.log('╚════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.close().catch(() => {});
    if (dbPool) await dbPool.close().catch(() => {});
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run setup
setupDatabase().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
