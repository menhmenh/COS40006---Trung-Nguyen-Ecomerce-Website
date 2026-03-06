import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function ProfileTab({ user }: any) {
  return (
    <div className="max-w-2xl rounded-2xl bg-muted p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">Member account</p>
        </div>
      </div>

      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <User size={18} />
        Account Information
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span>Name</span>
          <span>{user.name}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span>Email</span>
          <span>{user.email}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span>User ID</span>
          <span>{user.id}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline">Edit Profile</Button>
      </div>
    </div>
  )
}