# FR13: "Recommended for You" - Implementation Guide

## Overview
FR13 implements a **rule-based personalized product recommendation system** based on user purchase history and product categories/tags.

---

## 📊 Database Schema

### New Table: `user_product_preferences`
Tracks user interactions for generating recommendations.

```sql
CREATE TABLE dbo.user_product_preferences (
    preference_id INT PRIMARY KEY IDENTITY(1,1),
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    category_id CHAR(36),
    interaction_type VARCHAR(50),        -- 'view', 'purchase', 'review', 'cart', 'click'
    interaction_count INT DEFAULT 1,
    last_interaction_date DATETIME2 DEFAULT GETUTCDATE(),
    score DECIMAL(5,2) DEFAULT 1.0,      -- Weighted score for ranking
    created_date DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (user_id) REFERENCES dbo.users(user_id),
    FOREIGN KEY (product_id) REFERENCES dbo.products(product_id),
    UNIQUE(user_id, product_id)
);
```

### Recommendation Algorithm
The system:
1. **Finds categories** the user has purchased from
2. **Excludes products** already purchased by the user
3. **Ranks results** by:
   - Popularity (purchase count)
   - Customer ratings (avg_rating)
   - Relevance to user's preferences

---

## 🗄️ Stored Procedure

**Name:** `sp_GetRecommendedProducts`

**Parameters:**
- `@user_id` (CHAR 36) - User identifier
- `@limit` (INT) - Number of recommendations (default: 10)

**Returns:**
- `product_id` - Product identifier
- `name` - Product name
- `price` - Product price
- `category_id` - Category identifier
- `category_name` - Category name
- `description` - Product description
- `purchase_count` - Times product was purchased
- `avg_rating` - Average customer rating

**Query Logic:**
```sql
EXEC sp_GetRecommendedProducts @user_id = 'user-uuid', @limit = 10
```

---

## 🔌 Backend API Routes

### 1. GET `/api/recommendations`
**Purpose:** Fetch personalized recommendations for a user

**Query Parameters:**
```
GET /api/recommendations?user_id=<uuid>&limit=10
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "product_id": "prod-123",
      "name": "Arabica Coffee",
      "price": 15.99,
      "category_id": "cat-1",
      "category_name": "Premium Coffee",
      "description": "Single origin arabica...",
      "purchase_count": 245,
      "avg_rating": 4.8
    }
  ],
  "count": 8
}
```

**Usage in Frontend:**
```typescript
const response = await fetch(
  `/api/recommendations?user_id=${userId}&limit=10`
);
const data = await response.json();
```

---

### 2. POST `/api/interactions`
**Purpose:** Track user interactions for preference building

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "product_id": "prod-123",
  "interaction_type": "view",      // view | click | cart | review | purchase
  "category_id": "cat-1"             // Optional
}
```

**Interaction Type Scoring:**
| Type | Score |
|------|-------|
| view | 1.0 |
| click | 1.5 |
| cart | 2.0 |
| review | 3.0 |
| purchase | 5.0 |

**Response:**
```json
{
  "success": true,
  "message": "view interaction recorded successfully"
}
```

---

## 🎨 Frontend Components

### 1. `RecommendedProducts` Component
**Location:** `/components/recommended-products.tsx`

**Props:**
```typescript
interface RecommendationsProps {
  userId?: string;    // User ID for personalization
  limit?: number;     // Max recommendations to show (default: 10)
}
```

**Features:**
- Displays recommended products in a 4-column grid
- Shows star ratings and purchase count
- Tracks view interaction on load
- Loading skeleton during fetch
- Error state handling
- Sign-in prompt for non-authenticated users

**Usage:**
```tsx
import { RecommendedProducts } from '@/components/recommended-products';

export default function HomePage() {
  return (
    <RecommendedProducts userId={user.user_id} limit={8} />
  );
}
```

---

### 2. `RecommendationsSection` Component
**Location:** `/components/sections/recommendations-section.tsx`

**Features:**
- Checks user authentication
- Shows recommendations if logged in
- Shows login prompt if not authenticated
- Suitable for homepage placement

**Usage:**
```tsx
import RecommendationsSection from '@/components/sections/recommendations-section';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <RecommendationsSection />
      <Footer />
    </main>
  );
}
```

---

### 3. `useRecommendations` Hook
**Location:** `/hooks/use-recommendations.ts`

**Returns:**
```typescript
{
  recommendations: RecommendedProduct[],
  loading: boolean,
  error: Error | null,
  refetch: () => Promise<void>
}
```

**Usage:**
```typescript
const { recommendations, loading, error, refetch } = 
  useRecommendations(userId, { limit: 10 });

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return recommendations.map(product => (
  <ProductCard key={product.product_id} product={product} />
));
```

---

## 📡 Utility Functions

**Location:** `/lib/recommendations.ts`

### Available Functions:

```typescript
// Track a generic interaction
trackProductInteraction(payload: InteractionPayload)

// Track specific interactions
trackProductView(userId, productId, categoryId?)
trackProductClick(userId, productId, categoryId?)
trackAddToCart(userId, productId, categoryId?)
trackProductReview(userId, productId, categoryId?)
trackPurchase(userId, productId, categoryId?)

// Batch operations
trackMultiplePurchases(userId, items)
```

**Examples:**

```typescript
import { trackProductView, trackAddToCart, trackPurchase } from '@/lib/recommendations';

// On product page load
trackProductView(userId, productId, categoryId);

// On add to cart
trackAddToCart(userId, productId, categoryId);

// On order completion
trackMultiplePurchases(userId, [
  { productId: 'prod-1', categoryId: 'cat-1' },
  { productId: 'prod-2', categoryId: 'cat-1' }
]);
```

---

## 🔄 Integration Checklist

### 1. Product Page
- [ ] Import `trackProductView` in product detail page
- [ ] Call on component mount or route change

```typescript
useEffect(() => {
  if (userId && productId) {
    trackProductView(userId, productId, categoryId);
  }
}, [userId, productId]);
```

### 2. Add to Cart
- [ ] Import `trackAddToCart` in cart functionality
- [ ] Call when user adds product to cart

```typescript
const addToCart = async (productId) => {
  trackAddToCart(userId, productId);
  // ... add to cart logic
};
```

### 3. Order Confirmation
- [ ] Import `trackMultiplePurchases`
- [ ] Call after successful payment

```typescript
const confirmOrder = async (orderItems) => {
  const items = orderItems.map(item => ({
    productId: item.product_id,
    categoryId: item.category_id
  }));
  await trackMultiplePurchases(userId, items);
};
```

### 4. Reviews/Ratings
- [ ] Import `trackProductReview`
- [ ] Call after review submission

```typescript
const submitReview = async (productId, rating, comment) => {
  trackProductReview(userId, productId);
  // ... submit review logic
};
```

### 5. Homepage/Category Pages
- [ ] Add `RecommendedProducts` or `RecommendationsSection` component

```tsx
<main>
  {/* Other sections */}
  <RecommendedProducts userId={user.user_id} limit={8} />
</main>
```

---

## 🌐 Environment Variables

Add to `.env.local`:

```env
# Database Connection (for API routes)
DB_HOST=tncoffee-sql-01.database.windows.net
DB_USER=trungnguyen@tncoffee-sql-01
DB_PASSWORD=your_secure_password
DB_NAME=tncoffee-db
```

---

## 📈 Performance Tips

1. **Caching:** Cache recommendations for 1 hour
   ```typescript
   const cacheKey = `recommendations:${userId}`;
   const cached = await redis.get(cacheKey);
   ```

2. **Batch Queries:** Use `trackMultiplePurchases` instead of individual calls

3. **Lazy Loading:** Use intersection observer to load recommendations only when visible

4. **Pagination:** Add pagination to recommendation results

---

## 🧪 Testing

### Test Stored Procedure
```sql
-- Test for a specific user
EXEC sp_GetRecommendedProducts 
  @user_id = 'user-uuid-here',
  @limit = 10;
```

### Test API Endpoint
```bash
# Check recommendations
curl "http://localhost:3000/api/recommendations?user_id=user-uuid&limit=10"

# Track interaction
curl -X POST http://localhost:3000/api/interactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "product_id": "prod-uuid",
    "interaction_type": "view",
    "category_id": "cat-uuid"
  }'
```

---

## 🎯 Future Enhancements

### FR14: Loyalty Points + Tiers
- Track purchase amount
- Calculate loyalty points
- Implement tier system (Silver/Gold/Platinum)

### FR15: Subscription "Coffee Monthly Box"
- Add subscription products
- Implement recurring billing
- Track subscription interactions separately

### Additional Improvements
- Collaborative filtering (recommend what similar users bought)
- Content-based filtering (product attributes)
- Real-time personalization
- A/B testing for recommendation algorithms
- Analytics dashboard for recommendation effectiveness

---

## 📝 File Structure

```
frontend/
├── app/
│   └── api/
│       ├── recommendations/route.ts
│       └── interactions/route.ts
├── components/
│   ├── recommended-products.tsx
│   └── sections/
│       └── recommendations-section.tsx
├── hooks/
│   └── use-recommendations.ts
└── lib/
    └── recommendations.ts
```

---

## ✅ Completion Status

- [x] Database schema created
- [x] Stored procedure implemented
- [x] Backend API routes built
- [x] Frontend components created
- [x] Utility functions provided
- [x] React hooks implemented
- [x] Documentation complete
- [ ] Tests written (TODO)
- [ ] Performance optimizations (TODO)
- [ ] FR14 & FR15 implementation (TODO)

---

## 📞 Support & Debugging

### Common Issues

**No recommendations showing:**
- Ensure user has purchase history
- Check if products are in stock
- Verify user_id format matches database

**API returns 500 error:**
- Check database connection in `.env.local`
- Verify stored procedure exists
- Check Azure SQL firewall rules

**Interactions not tracked:**
- Verify user_id is provided
- Check if table `user_product_preferences` exists
- Debug browser console for fetch errors

# FR13 Recommendations Feature - Updates Log

## Current Session Updates

### ✅ Completed Implementations

1. **Database Schema**
   - `user_product_preferences` table created for tracking user interactions
   - Tracks: view, purchase, review, cart, click interactions
   - Weighted scoring system implemented (1.0-5.0 based on interaction type)

2. **Stored Procedure**
   - `sp_GetRecommendedProducts` implemented
   - Takes @user_id and @limit parameters
   - Returns product recommendations ranked by popularity and ratings

3. **Backend API Routes**
   - `GET /api/recommendations` - Fetch personalized recommendations
   - `POST /api/interactions` - Track user product interactions
   - Proper error handling and response formatting

4. **Frontend Components**
   - ✅ `RecommendedProducts` component - Grid display with star ratings
   - ✅ `RecommendationsSection` component - Homepage integration with auth check
   - ✅ Carousel navigation with left/right arrow buttons (attempted)
   - ✅ Loading skeleton states
   - ✅ Error state handling

5. **React Hooks**
   - `useRecommendations` hook - State management for recommendations

6. **Utility Functions**
   - `trackProductInteraction()` - Generic tracking
   - `trackProductView()`, `trackProductClick()`, `trackAddToCart()`, `trackProductReview()`, `trackPurchase()`
   - `trackMultiplePurchases()` - Batch tracking for orders

7. **Fallback Logic**
   - If user has no purchase history → show top-rated products
   - Graceful degradation for new users

### 🔴 Current Issues (Build Blocker)

1. **Parse Error in recommended-products.tsx:384**
   - "Unterminated regexp literal"
   - Carousel navigation code causing build failure
   - Prevents dev server from starting

2. **TypeScript Errors**
   - Missing `id` and `category` properties on CartItem type
   - Blocking interaction tracking in cart/checkout pages
   - Lines 92-96 in checkout/page.tsx and cart/page.tsx

3. **Database Connection Error**
   - `/api/categories/route.ts:27` - Missing `config.server` property
   - Returns HTTP 500 error when fetching categories
   - Categories API route broken

4. **Recommendations Not Displaying**
   - UI shows "No recommendations available" message
   - API not returning products (likely due to issues #2-3)
   - Fallback logic code-ready but not functioning

### 📋 Integration Points

- [x] Product page tracking (trackProductView)
- [x] Add to cart tracking function ready
- [x] Order confirmation tracking (trackMultiplePurchases)
- [x] Review/rating tracking ready
- [x] Homepage component added (RecommendationsSection)

### 🎯 Next Priority Actions

1. **URGENT**: Fix parse error in recommended-products.tsx line 384
2. Fix CartItem type definition (add missing properties)
3. Fix database connection config in categories API
4. Test recommendations display once build succeeds
5. Validate carousel navigation functionality
6. Test purchase tracking flow end-to-end

### 📊 File Structure Created
```
frontend/
├── app/api/
│   ├── recommendations/route.ts ✅
│   └── interactions/route.ts ✅
├── components/
│   ├── recommended-products.tsx 🔴 (parse error)
│   └── sections/recommendations-section.tsx ✅
├── hooks/
│   └── use-recommendations.ts ✅
└── lib/
    └── recommendations.ts ✅
```

### 💾 Database Updates
- `user_product_preferences` table schema defined
- `sp_GetRecommendedProducts` stored procedure ready
- Interaction scoring weights: view=1.0, click=1.5, cart=2.0, review=3.0, purchase=5.0

### 🔧 Environment Config
- `.env.local` configuration documented
- Database connection variables needed

