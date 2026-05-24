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
import { MoreHorizontal, Trash2, ExternalLink, ChevronDown } from "lucide-react"

type Props = {
  application: Application
}

export function ApplicationActions({ application }: Props) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const statuses = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const

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

      toast.success("Status updated!")
      router.refresh()
    } catch (error) {
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
        toast.error(data.error || "Failed to delete application")
        return
      }

      toast.success("Application deleted!")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            disabled={isUpdatingStatus}
            className="inline-flex items-center gap-1 px-2 py-1 h-8 rounded-md text-xs font-medium border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {application.status}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showStatusDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                    application.status === status ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Job Link */}
        {application.jobUrl && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0"
            title="View job listing"
          >
            <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application?</DialogTitle>
            <DialogDescription>
              This will permanently delete the application for{" "}
              <span className="font-semibold text-gray-900">{application.companyName}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
