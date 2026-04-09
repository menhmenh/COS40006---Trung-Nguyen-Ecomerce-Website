import { NextResponse } from 'next/server';

const DB_HOST = process.env.DB_HOST || 'tncoffee-sql-01.database.windows.net';
const DB_USER = process.env.DB_USER || 'trungnguyen@tncoffee-sql-01';
const DB_PASSWORD = process.env.DB_PASSWORD || 'tnswe40006@';
const DB_NAME = process.env.DB_NAME || 'tncoffee-db';

export async function GET() {
  try {
    const mssql = require('mssql');
    const pool = new mssql.ConnectionPool({
      server: DB_HOST,
      authentication: {
        type: 'default',
        options: {
          userName: DB_USER,
          password: DB_PASSWORD,
        },
      },
      options: {
        database: DB_NAME,
        encrypt: true,
        trustServerCertificate: false,
      },
    });

    await pool.connect();
    const result = await pool.request().query('SELECT TOP 20 * FROM dbo.categories ORDER BY name');
    await pool.close();

    return NextResponse.json(
      {
        success: true,
        categories: result.recordset || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        categories: []
      },
      { status: 500 }
    );
  }
}
