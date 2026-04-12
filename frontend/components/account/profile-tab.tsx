import { Button } from "@/components/ui/button"
import { User, Award } from "lucide-react"
import { getNextTierTarget, LOYALTY_GOLD_THRESHOLD, LOYALTY_PLATINUM_THRESHOLD } from "@/lib/loyalty"

export default function ProfileTab({ user }: any) {
  // Hàm chọn màu sắc huy hiệu tùy theo hạng
  const getTierBadgeStyle = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
      case 'gold':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
      default: // Silver
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const currentTier = user.tier || 'Silver'
  const currentPoints = user.points || 0
  const nextTier = getNextTierTarget(currentPoints)

  // Logic kiểm tra tài khoản Admin
  const isAdmin = user?.role === 'admin' || user?.email === 'admin.demo@trungnguyen.com'

  return (
    <div className="max-w-2xl rounded-2xl bg-muted p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          
          {/* CHỈ HIỆN HUY HIỆU NẾU KHÔNG PHẢI LÀ ADMIN */}
          {!isAdmin && (
            <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold shadow-sm ${getTierBadgeStyle(currentTier)}`}>
              <Award size={16} />
              {currentTier} Member • {currentPoints.toLocaleString()} pts
            </div>
          )}
        </div>
      </div>

      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <User size={18} />
        Account Information
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{user.name}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>

        {/* CHỈ HIỆN THÔNG TIN ĐIỂM NẾU KHÔNG PHẢI LÀ ADMIN */}
        {!isAdmin && (
          <>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Loyalty Tier</span>
              <span className="font-medium">{currentTier}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Reward Points</span>
              <span className="font-medium">{currentPoints.toLocaleString()}</span>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
              <p>Silver: 0-{LOYALTY_GOLD_THRESHOLD - 1} points</p>
              <p>Gold: {LOYALTY_GOLD_THRESHOLD}-{LOYALTY_PLATINUM_THRESHOLD - 1} points</p>
              <p>Platinum: {LOYALTY_PLATINUM_THRESHOLD}+ points</p>
              {nextTier ? (
                <p className="mt-2 font-medium text-foreground">
                  Need {nextTier.pointsNeeded.toLocaleString()} more points to reach {nextTier.nextTier}.
                </p>
              ) : (
                <p className="mt-2 font-medium text-foreground">
                  You are already at the highest tier.
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between border-b pb-2">
          <span className="text-muted-foreground">User ID</span>
          <span className="text-sm font-mono text-muted-foreground">{user.id}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline">Edit Profile</Button>
      </div>
    </div>
  )
}
