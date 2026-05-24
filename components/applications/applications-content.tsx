"use client"

import { useState, useMemo } from "react"
import { ApplicationsFilters } from "@/components/applications/applications-filters"
import { ApplicationsTable } from "@/components/applications/applications-table"
import type { Application, ApplicationStatus, Priority } from "@/types"

type Props = {
  applications: Application[]
}

type Filters = {
  search: string
  status: ApplicationStatus[]
  priority: Priority[]
}

export function ApplicationsPageContent({ applications }: Props) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: [],
    priority: [],
  })

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          app.companyName.toLowerCase().includes(searchLower) ||
          app.jobTitle.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(app.status as ApplicationStatus)) return false
      }

      // Priority filter
      if (filters.priority.length > 0) {
        if (!filters.priority.includes(app.priority as Priority)) return false
      }

      return true
    })
  }, [applications, filters])

  return (
    <div className="p-6 h-full flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {filtered.length} of {applications.length} applications
        </p>
      </div>

      {/* Layout: Filters on left, table on right */}
      <div className="flex gap-6 flex-1">
        {/* Filters Sidebar */}
        <div className="w-64 shrink-0">
          <ApplicationsFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <ApplicationsTable applications={filtered} />
        </div>
      </div>
    </div>
  )
}
