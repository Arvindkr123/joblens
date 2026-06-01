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

  const hasActive = filters.search || filters.status.length > 0 || filters.priority.length > 0

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Search */}
      <div className="relative sm:w-64 shrink-0">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <Input
          placeholder="Search company or title…"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 h-9"
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block h-5 w-px bg-gray-200 shrink-0" />

      {/* Status chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUSES.map((s) => {
          const active = filters.status.includes(s.value)
          return (
            <button
              key={s.value}
              onClick={() => toggleStatus(s.value)}
              className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="hidden sm:block h-5 w-px bg-gray-200 shrink-0" />

      {/* Priority chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRIORITIES.map((p) => {
          const active = filters.priority.includes(p.value)
          return (
            <button
              key={p.value}
              onClick={() => togglePriority(p.value)}
              className={`h-7 px-2.5 rounded-full text-xs font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Clear */}
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-gray-500 shrink-0"
          onClick={() => onFiltersChange({ search: "", status: [], priority: [] })}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
