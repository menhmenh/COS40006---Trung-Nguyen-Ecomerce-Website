'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { products } from '@/lib/store';

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
  const [isTopRated, setIsTopRated] = useState(false);
  const [isApiFallback, setIsApiFallback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const getTopRatedProducts = () =>
    products
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map((product) => ({
        product_id: product.id,
        name: product.name,
        price: product.price,
        category_name: product.category,
        description: product.description,
        purchase_count: product.reviews,
        avg_rating: product.rating,
      }));

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsApiFallback(false);

        if (!userId) {
          setError('User ID not provided');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/recommendations?user_id=${encodeURIComponent(userId)}&limit=${limit}`
        );

        if (!response.ok) {
          // Gracefully degrade to local top-rated products when API is unavailable.
          setRecommendations(getTopRatedProducts());
          setIsTopRated(true);
          setIsApiFallback(true);
          setCurrentIndex(0);
          return;
        }

        const data = await response.json();
        
        // If no personalized recommendations, show top-rated products
        if (!data.recommendations || data.recommendations.length === 0) {
          setRecommendations(getTopRatedProducts());
          setIsTopRated(true);
          setIsApiFallback(Boolean(data.fallback));
        } else {
          setRecommendations(data.recommendations);
          setIsTopRated(false);
          setIsApiFallback(false);
        }
        setCurrentIndex(0);
      } catch (err) {
        // Final safety net: still show top-rated products for a better UX.
        setRecommendations(getTopRatedProducts());
        setIsTopRated(true);
        setIsApiFallback(true);
        setError(null);
        setCurrentIndex(0);
        console.error('Error fetching recommendations. Showing fallback products:', err);
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

  const handleNext = () => {
    if (currentIndex + itemsPerView < recommendations.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const maxIndex = Math.max(0, recommendations.length - itemsPerView);
  const visibleProducts = recommendations.slice(currentIndex, currentIndex + itemsPerView);
  const showNavigation = recommendations.length > itemsPerView;

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
          {isTopRated 
            ? 'Popular products with high ratings' 
            : 'Based on your shopping history and preferences'}
        </p>
        {isApiFallback && (
          <p className="mt-2 text-sm text-amber-700">
            Personalized recommendations are temporarily unavailable. Showing popular picks for now.
          </p>
        )}
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
              No recommendations available. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(recommendations.length / itemsPerView) * 90}%`,
              }}
            >
              {recommendations.map((product, index) => (
                <div
                  key={product.product_id}
                  className="shrink-0"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Card
                    className="hover:shadow-lg transition-shadow overflow-hidden h-full animate-fade-in"
                    onClick={() => trackInteraction(product.product_id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <Link href={`/products/${product.product_id}`}>
                            <CardTitle className="text-lg hover:text-[#C5A059] cursor-pointer line-clamp-2">
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
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          {showNavigation && recommendations.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.max(1, recommendations.length - itemsPerView + 1) }).map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === Math.min(currentIndex, Math.floor(maxIndex / 1))
                        ? 'bg-[#C5A059] w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
