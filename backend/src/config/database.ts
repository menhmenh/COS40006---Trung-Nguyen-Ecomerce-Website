import * as sql from 'mssql';

function getConfig(): sql.config {
  return {
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
}

let pool: sql.ConnectionPool | null = null;

export async function initializeDatabase(): Promise<sql.ConnectionPool> {
  try {
    if (pool) {
      return pool;
    }

    pool = new sql.ConnectionPool(getConfig());
    await pool.connect();
    console.log('✅ Database connection established');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    return initializeDatabase();
  }
  return pool;
}

export async function executeQuery<T>(query: string): Promise<T[]> {
  const pool = await getPool();
  const result = await pool.request().query(query);
  return result.recordset;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('✅ Database connection closed');
  }
}
