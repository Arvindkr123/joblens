import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  WISHLIST:  { label: "Wishlist",  className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  APPLIED:   { label: "Applied",   className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  INTERVIEW: { label: "Interview", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
  OFFER:     { label: "Offer",     className: "bg-green-100 text-green-700 hover:bg-green-100" },
  REJECTED:  { label: "Rejected",  className: "bg-red-100 text-red-700 hover:bg-red-100" },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status]
  return (
    <Badge className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}