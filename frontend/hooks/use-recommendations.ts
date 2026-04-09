import { useEffect, useState, useCallback } from 'react';

interface RecommendedProduct {
  product_id: string;
  name: string;
  price: number;
  category_id: string;
  category_name: string;
  description: string;
  purchase_count: number;
  avg_rating: number;
}

interface UseRecommendationsOptions {
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch personalized product recommendations for a user
 */
export function useRecommendations(
  userId: string | undefined,
  options: UseRecommendationsOptions = {}
) {
  const { limit = 10, enabled = true } = options;
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!userId || !enabled) {
      setRecommendations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/recommendations?user_id=${encodeURIComponent(userId)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch recommendations: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, limit, enabled]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
  };
}
