"use client"

import { useState } from "react"
import { formatDate } from "@/lib/date"
import type { Application, ApplicationStatus, Priority } from "@/types"
import { ApplicationActions } from "./application-actions"
import { getStatusBadgeColor, getPriorityBadgeColor } from "@/lib/badge-colors"

type Props = {
  applications: Application[]
}

export function ApplicationsTable({ applications }: Props) {
  const [sortBy, setSortBy] = useState<"date" | "company" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (column: "date" | "company" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const sorted = [...applications].sort((a, b) => {
    let compareA: any
    let compareB: any

    if (sortBy === "date") {
      compareA = a.createdAt
      compareB = b.createdAt
    } else if (sortBy === "company") {
      compareA = a.companyName.toLowerCase()
      compareB = b.companyName.toLowerCase()
    } else {
      compareA = a.status
      compareB = b.status
    }

    if (compareA < compareB) return sortOrder === "asc" ? -1 : 1
    if (compareA > compareB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
        <p className="text-gray-500">No applications found. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left">
                <SortHeader
                  label="Company"
                  column="company"
                  active={sortBy === "company"}
                  order={sortOrder}
                  onClick={() => handleSort("company")}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-left">
                <SortHeader
                  label="Status"
                  column="status"
                  active={sortBy === "status"}
                  order={sortOrder}
                  onClick={() => handleSort("status")}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                Priority
              </th>
              <th className="px-6 py-3 text-left">
                <SortHeader
                  label="Applied"
                  column="date"
                  active={sortBy === "date"}
                  order={sortOrder}
                  onClick={() => handleSort("date")}
                />
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((app) => (
              <tr
                key={app.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors  relative"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{app.companyName}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">{app.jobTitle}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{app.location || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(app.status as ApplicationStatus)}`}
                  >
                    {formatStatus(app.status as ApplicationStatus)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(app.priority as Priority)}`}
                  >
                    {app.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    {app.appliedAt ? formatDate(app.appliedAt) : formatDate(app.createdAt)}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <ApplicationActions application={app} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

// ... SortHeader and formatStatus unchanged
function SortHeader({
  label,
  column,
  active,
  order,
  onClick,
}: {
  label: string
  column: string
  active: boolean
  order: "asc" | "desc"
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 hover:text-gray-900">
      <span className="text-xs font-semibold text-gray-600">{label}</span>
      {active && <span className="text-xs">{order === "asc" ? "↑" : "↓"}</span>}
    </button>
  )
}

function formatStatus(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    WISHLIST: "Wishlist",
    APPLIED: "Applied",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
  }
  return map[status]
}
