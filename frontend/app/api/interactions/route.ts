import { NextRequest, NextResponse } from 'next/server';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id, interaction_type, category_id } = body;

    // Validate required fields
    if (!user_id || !product_id || !interaction_type) {
      return NextResponse.json(
        { error: 'user_id, product_id, and interaction_type are required' },
        { status: 400 }
      );
    }

    // Validate interaction type
    const validTypes = ['view', 'purchase', 'review', 'cart', 'click'];
    if (!validTypes.includes(interaction_type)) {
      return NextResponse.json(
        { error: `Invalid interaction_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

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

    // Calculate score multiplier based on interaction type
    const scoreMultiplier = {
      view: 1,
      click: 1.5,
      cart: 2,
      review: 3,
      purchase: 5,
    };

    const score = scoreMultiplier[interaction_type as keyof typeof scoreMultiplier] || 1;

    // Insert or update user preference
    await pool
      .request()
      .input('user_id', mssql.Char(36), user_id)
      .input('product_id', mssql.Char(36), product_id)
      .input('category_id', mssql.Char(36), category_id || null)
      .input('interaction_type', mssql.VarChar(50), interaction_type)
      .input('score', mssql.Decimal(5, 2), score)
      .query(`
        IF EXISTS (SELECT 1 FROM dbo.user_product_preferences WHERE user_id = @user_id AND product_id = @product_id)
        BEGIN
          UPDATE dbo.user_product_preferences
          SET 
            interaction_count = interaction_count + 1,
            score = score + @score,
            last_interaction_date = GETUTCDATE(),
            interaction_type = @interaction_type
          WHERE user_id = @user_id AND product_id = @product_id
        END
        ELSE
        BEGIN
          INSERT INTO dbo.user_product_preferences 
            (user_id, product_id, category_id, interaction_type, score)
          VALUES 
            (@user_id, @product_id, @category_id, @interaction_type, @score)
        END
      `);

    await pool.close();

    return NextResponse.json(
      {
        success: true,
        message: `${interaction_type} interaction recorded successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Interaction tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}
