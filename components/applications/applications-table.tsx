"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/date"
import type { Application, ApplicationStatus, Priority } from "@/types"
import { ApplicationActions } from "./application-actions"
import { getStatusBadgeColor, getPriorityBadgeColor } from "@/lib/badge-colors"

type Props = {
  applications: Application[]
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
}

type SortCol = "date" | "company" | "status"

export function ApplicationsTable({ applications }: Props) {
  const [sortBy, setSortBy] = useState<SortCol>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const handleSort = (col: SortCol) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(col)
      setSortOrder("desc")
    }
  }

  const sorted = [...applications].sort((a, b) => {
    let va: any, vb: any
    if (sortBy === "date") { va = a.createdAt; vb = b.createdAt }
    else if (sortBy === "company") { va = a.companyName.toLowerCase(); vb = b.companyName.toLowerCase() }
    else { va = a.status; vb = b.status }
    if (va < vb) return sortOrder === "asc" ? -1 : 1
    if (va > vb) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
        <p className="text-3xl mb-3">📋</p>
        <p className="text-gray-500 text-sm font-medium">No applications found</p>
        <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-5 py-3 text-left">
              <SortBtn label="Company" active={sortBy === "company"} order={sortOrder} onClick={() => handleSort("company")} />
            </th>
            <th className="px-5 py-3 text-left">
              <SortBtn label="Status" active={sortBy === "status"} order={sortOrder} onClick={() => handleSort("status")} />
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Priority
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
              Location
            </th>
            <th className="px-5 py-3 text-left">
              <SortBtn label="Applied" active={sortBy === "date"} order={sortOrder} onClick={() => handleSort("date")} />
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((app) => (
            <tr
              key={app.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
            >
              {/* Company + Title — links to detail */}
              <td className="px-5 py-4">
                <Link href={`/applications/${app.id}`} className="block">
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {app.companyName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{app.jobTitle}</p>
                </Link>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(app.status as ApplicationStatus)}`}>
                  {STATUS_LABELS[app.status as ApplicationStatus]}
                </span>
              </td>

              {/* Priority */}
              <td className="px-5 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(app.priority as Priority)}`}>
                  {app.priority.charAt(0) + app.priority.slice(1).toLowerCase()}
                </span>
              </td>

              {/* Location */}
              <td className="px-5 py-4 hidden lg:table-cell">
                <span className="text-sm text-gray-500">{app.location || <span className="text-gray-300">—</span>}</span>
              </td>

              {/* Date */}
              <td className="px-5 py-4">
                <span className="text-sm text-gray-500">
                  {app.appliedAt ? formatDate(app.appliedAt) : formatDate(app.createdAt)}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <ApplicationActions application={app} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SortBtn({
  label, active, order, onClick,
}: {
  label: string; active: boolean; order: "asc" | "desc"; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 group/sort">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide group-hover/sort:text-gray-700 transition-colors">
        {label}
      </span>
      <span className={`text-xs transition-opacity ${active ? "opacity-100 text-gray-700" : "opacity-0 group-hover/sort:opacity-50"}`}>
        {order === "asc" ? "↑" : "↓"}
      </span>
    </button>
  )
}
