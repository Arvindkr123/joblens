"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ApplicationStatus, Priority } from "@/types"

type Filters = {
  search: string
  status: ApplicationStatus[]
  priority: Priority[]
}

type Props = {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
]

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
]

export function ApplicationsFilters({ filters, onFiltersChange }: Props) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const toggleStatus = (status: ApplicationStatus) => {
    onFiltersChange({
      ...filters,
      status: filters.status.includes(status)
        ? filters.status.filter((s) => s !== status)
        : [...filters.status, status],
    })
  }

  const togglePriority = (priority: Priority) => {
    onFiltersChange({
      ...filters,
      priority: filters.priority.includes(priority)
        ? filters.priority.filter((p) => p !== priority)
        : [...filters.priority, priority],
    })
  }

  const clearFilters = () => {
    onFiltersChange({ search: "", status: [], priority: [] })
  }

  const hasActiveFilters = filters.search || filters.status.length > 0 || filters.priority.length > 0

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">Search</label>
        <Input
          placeholder="Company name or job title..."
          value={filters.search}
          onChange={handleSearchChange}
          className="h-9"
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              onClick={() => toggleStatus(status.value)}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                filters.status.includes(status.value)
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600">Priority</label>
        <div className="flex flex-wrap gap-2">
          {PRIORITIES.map((priority) => (
            <button
              key={priority.value}
              onClick={() => togglePriority(priority.value)}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                filters.priority.includes(priority.value)
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {priority.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
