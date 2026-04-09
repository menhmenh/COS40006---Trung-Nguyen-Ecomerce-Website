'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendedProduct {
  product_id: string;
  name: string;
  price: number;
  category_name: string;
  description: string;
  purchase_count: number;
  avg_rating: number;
}

interface RecommendationsProps {
  userId?: string;
  limit?: number;
}

export function RecommendedProducts({ userId, limit = 10 }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setError('User ID not provided');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/recommendations?user_id=${userId}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId, limit]);

  const trackInteraction = async (productId: string, categoryId?: string) => {
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          category_id: categoryId,
          interaction_type: 'view',
        }),
      });
    } catch (err) {
      console.error('Error tracking interaction:', err);
    }
  };

  if (!userId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Sign in to see personalized recommendations</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Recommended for You</h2>
        <p className="text-gray-600">
          Based on your shopping history and preferences
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
        </div>
      ) : recommendations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center py-8">
              No recommendations available yet. Start shopping to get personalized suggestions!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <Card
              key={product.product_id}
              className="hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => trackInteraction(product.product_id)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <Link href={`/products/${product.product_id}`}>
                      <CardTitle className="text-lg hover:text-blue-600 cursor-pointer line-clamp-2">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <CardDescription className="text-sm mt-1">
                      {product.category_name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Product Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                {product.avg_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(product.avg_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.avg_rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="text-2xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </div>

                {/* Stats */}
                <div className="text-xs text-gray-500 flex gap-4">
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={14} />
                    {product.purchase_count} sold
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    Popular
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  asChild
                  onClick={() => trackInteraction(product.product_id)}
                >
                  <Link href={`/products/${product.product_id}`}>
                    View Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
