"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ApplicationsFilters } from "@/components/applications/applications-filters"
import { ApplicationsTable } from "@/components/applications/applications-table"
import { ApplicationForm } from "@/components/applications/application-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
  const router = useRouter()
  const [filters, setFilters] = useState<Filters>({ search: "", status: [], priority: [] })
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !app.companyName.toLowerCase().includes(q) &&
          !app.jobTitle.toLowerCase().includes(q)
        ) return false
      }
      if (filters.status.length > 0 && !filters.status.includes(app.status as ApplicationStatus)) return false
      if (filters.priority.length > 0 && !filters.priority.includes(app.priority as Priority)) return false
      return true
    })
  }, [applications, filters])

  return (
    <div className="p-6 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length === applications.length
              ? `${applications.length} total`
              : `${filtered.length} of ${applications.length}`}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="shrink-0">
          + New Application
        </Button>
      </div>

      {/* Filters */}
      <ApplicationsFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <ApplicationsTable applications={filtered} />

      {/* Add Application Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>New Application</DialogTitle>
          </DialogHeader>
          <ApplicationForm
            onSuccess={() => {
              setShowAddDialog(false)
              router.refresh()
            }}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
