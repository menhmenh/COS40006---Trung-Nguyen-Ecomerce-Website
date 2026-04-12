import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

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
    const pool = await getPool();
    const result = await pool
      .request()
      .input('user_id', sql.Char(36), userId)
      .input('limit', sql.Int, parseInt(limit))
      .execute('sp_GetRecommendedProducts');

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
      {
        success: true,
        recommendations: [],
        count: 0,
        fallback: true,
      },
      { status: 200 }
    );
  }
}
