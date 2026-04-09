import { NextRequest, NextResponse } from 'next/server';

const DB_HOST = process.env.DB_HOST || 'tncoffee-sql-01.database.windows.net';
const DB_USER = process.env.DB_USER || 'trungnguyen@tncoffee-sql-01';
const DB_PASSWORD = process.env.DB_PASSWORD || 'tnswe40006@';
const DB_NAME = process.env.DB_NAME || 'tncoffee-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = searchParams.get('limit') || '10';

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Call stored procedure to get recommendations
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
    const result = await pool
      .request()
      .input('user_id', mssql.Char(36), userId)
      .input('limit', mssql.Int, parseInt(limit))
      .execute('sp_GetRecommendedProducts');

    await pool.close();

    return NextResponse.json(
      {
        success: true,
        recommendations: result.recordset,
        count: result.recordset.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
