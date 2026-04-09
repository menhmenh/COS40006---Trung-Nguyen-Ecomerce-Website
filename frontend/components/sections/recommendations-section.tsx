'use client';

import { useEffect, useState } from 'react';
import { RecommendedProducts } from '@/components/recommended-products';
import { useAuth } from '@/lib/auth-context'; // Assuming you have auth context

/**
 * Homepage section displaying personalized recommendations
 */
export default function RecommendationsSection() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {user?.user_id ? (
          <RecommendedProducts userId={user.user_id} limit={8} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Discover Products For You</h2>
            <p className="text-gray-600 mb-8">
              Create an account to get personalized product recommendations
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
