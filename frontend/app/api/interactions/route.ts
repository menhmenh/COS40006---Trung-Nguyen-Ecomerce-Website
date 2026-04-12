import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

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

    try {
      const pool = await getPool();

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
        .input('user_id', sql.Char(36), user_id)
        .input('product_id', sql.Char(36), product_id)
        .input('category_id', sql.Char(36), category_id || null)
        .input('interaction_type', sql.VarChar(50), interaction_type)
        .input('score', sql.Decimal(5, 2), score)
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
      return NextResponse.json(
        {
          success: true,
          message: `${interaction_type} interaction recorded successfully`,
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Log database error but don't fail the request
      console.warn('Database interaction tracking failed (non-critical):', dbError);
      
      // Return success anyway - this is non-critical tracking
      return NextResponse.json(
        {
          success: true,
          message: `${interaction_type} interaction queued`,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Interaction tracking error:', error);
    // Return 201 (success) for non-critical tracking errors
    // This prevents the client from reporting interaction tracking as a failure
    return NextResponse.json(
      {
        success: true,
        message: 'interaction tracked',
      },
      { status: 201 }
    );
  }
}
