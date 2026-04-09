'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Category } from '@/lib/store'

interface CategorySidebarProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (slug: string) => void
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['coffee', 'trung-nguyen-g7'])
  )

  const toggleExpanded = (slug: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug)
    } else {
      newExpanded.add(slug)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className={`justify-start w-full text-left h-auto py-2 px-3 rounded-none font-medium ${
                selectedCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
              onClick={() => {
                onSelectCategory(category.slug)
                if (category.children && category.children.length > 0) {
                  toggleExpanded(category.slug)
                }
              }}
            >
              {category.name}
              {category.children && category.children.length > 0 && (
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    expandedCategories.has(category.slug) ? 'rotate-180' : ''
                  }`}
                />
              )}
            </Button>
          </div>

          {/* Subcategories */}
          {category.children &&
            expandedCategories.has(category.slug) &&
            category.children.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="ghost"
                className={`justify-start w-full text-left h-auto py-2 px-6 rounded-none text-sm ${
                  selectedCategory === subcategory.slug
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
                onClick={() => onSelectCategory(subcategory.slug)}
              >
                {subcategory.name}
              </Button>
            ))}
        </div>
      ))}
    </div>
  )
}