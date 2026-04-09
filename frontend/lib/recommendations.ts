/**
 * Utility functions for tracking user interactions for recommendations
 */

export interface InteractionPayload {
  user_id: string;
  product_id: string;
  interaction_type: 'view' | 'click' | 'cart' | 'review' | 'purchase';
  category_id?: string;
}

/**
 * Track a user interaction with a product
 */
export async function trackProductInteraction(payload: InteractionPayload): Promise<void> {
  try {
    const response = await fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to track interaction:', error);
    }
  } catch (error) {
    console.error('Error tracking product interaction:', error);
    // Don't throw - this is non-critical tracking
  }
}

/**
 * Track product view
 */
export function trackProductView(
  userId: string,
  productId: string,
  categoryId?: string
): void {
  trackProductInteraction({
    user_id: userId,
    product_id: productId,
    interaction_type: 'view',
    category_id: categoryId,
  });
}

/**
 * Track product click
 */
export function trackProductClick(
  userId: string,
  productId: string,
  categoryId?: string
): void {
  trackProductInteraction({
    user_id: userId,
    product_id: productId,
    interaction_type: 'click',
    category_id: categoryId,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(
  userId: string,
  productId: string,
  categoryId?: string
): void {
  trackProductInteraction({
    user_id: userId,
    product_id: productId,
    interaction_type: 'cart',
    category_id: categoryId,
  });
}

/**
 * Track product review/rating
 */
export function trackProductReview(
  userId: string,
  productId: string,
  categoryId?: string
): void {
  trackProductInteraction({
    user_id: userId,
    product_id: productId,
    interaction_type: 'review',
    category_id: categoryId,
  });
}

/**
 * Track purchase (should be called from order confirmation)
 */
export function trackPurchase(
  userId: string,
  productId: string,
  categoryId?: string
): void {
  trackProductInteraction({
    user_id: userId,
    product_id: productId,
    interaction_type: 'purchase',
    category_id: categoryId,
  });
}

/**
 * Batch track multiple purchases from an order
 */
export async function trackMultiplePurchases(
  userId: string,
  items: Array<{ productId: string; categoryId?: string }>
): Promise<void> {
  const promises = items.map((item) =>
    trackPurchase(userId, item.productId, item.categoryId)
  );
  await Promise.all(promises);
}
