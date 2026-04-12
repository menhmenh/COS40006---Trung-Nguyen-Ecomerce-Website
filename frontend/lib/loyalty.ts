export const LOYALTY_VND_PER_POINT = 1000
export const LOYALTY_GOLD_THRESHOLD = 100
export const LOYALTY_PLATINUM_THRESHOLD = 250

export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum'

export function calculatePointsFromOrderTotal(total: number) {
  return Math.max(0, Math.floor(total / LOYALTY_VND_PER_POINT))
}

export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= LOYALTY_PLATINUM_THRESHOLD) {
    return 'Platinum'
  }

  if (points >= LOYALTY_GOLD_THRESHOLD) {
    return 'Gold'
  }

  return 'Silver'
}

export function getNextTierTarget(points: number) {
  if (points < LOYALTY_GOLD_THRESHOLD) {
    return {
      nextTier: 'Gold' as const,
      targetPoints: LOYALTY_GOLD_THRESHOLD,
      pointsNeeded: LOYALTY_GOLD_THRESHOLD - points,
    }
  }

  if (points < LOYALTY_PLATINUM_THRESHOLD) {
    return {
      nextTier: 'Platinum' as const,
      targetPoints: LOYALTY_PLATINUM_THRESHOLD,
      pointsNeeded: LOYALTY_PLATINUM_THRESHOLD - points,
    }
  }

  return null
}
