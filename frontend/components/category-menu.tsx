'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Coffee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Category {
  category_id: string;
  name: string;
}

export function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
          <span className="font-medium">Categories</span>
          <ChevronDown size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {loading ? (
          <DropdownMenuItem disabled>
            <span className="text-sm text-gray-500">Loading...</span>
          </DropdownMenuItem>
        ) : categories.length > 0 ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/products" className="cursor-pointer">
                All Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/subscriptions/plans" className="cursor-pointer flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Monthly Box
              </Link>
            </DropdownMenuItem>
            <div className="border-t my-1" />
            {categories.map((category) => (
              <DropdownMenuItem key={category.category_id} asChild>
                <Link
                  href={`/products?category=${category.category_id}`}
                  className="cursor-pointer"
                >
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-sm text-gray-500">No categories</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
