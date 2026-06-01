"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Application } from "@/types"
import { Trash2, ExternalLink, ChevronDown } from "lucide-react"

type Props = {
  application: Application
}

const STATUS_OPTIONS = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
] as const

const STATUS_LABELS: Record<string, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
}

export function ApplicationActions({ application }: Props) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setShowStatusDropdown(false)
    setIsUpdatingStatus(true)
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to update status")
        return
      }
      toast.success("Status updated")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to delete")
        return
      }
      toast.success("Application deleted")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown((v) => !v)}
            disabled={isUpdatingStatus}
            className="inline-flex items-center gap-1 px-2.5 py-1 h-7 rounded-md text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {STATUS_LABELS[application.status] ?? application.status}
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {showStatusDropdown && (
            <>
              {/* Backdrop to close */}
              <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${
                      application.status === s.value ? "font-medium text-gray-900 bg-gray-50" : "text-gray-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View job link */}
        {application.jobUrl && (
          <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0" title="View job listing">
            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}

        {/* Delete */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
          onClick={() => setShowDeleteDialog(true)}
          title="Delete application"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete application?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-gray-900">{application.companyName}</span>.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
