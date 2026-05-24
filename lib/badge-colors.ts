import type { ApplicationStatus, Priority } from "@/types"

export function getStatusBadgeColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    WISHLIST: "bg-gray-100 text-gray-800",
    APPLIED: "bg-blue-100 text-blue-800",
    INTERVIEW: "bg-yellow-100 text-yellow-800",
    OFFER: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  }
  return colors[status]
}

export function getPriorityBadgeColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-orange-100 text-orange-800",
    HIGH: "bg-red-100 text-red-800",
  }
  return colors[priority]
}
