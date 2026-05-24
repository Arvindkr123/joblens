"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ApplicationStatus, Priority, Application } from "@/types"

type Props = {
  onSuccess: (application: Application) => void
  onCancel: () => void
  defaultStatus?: ApplicationStatus
}

export function ApplicationForm({ onSuccess, onCancel, defaultStatus = "WISHLIST" }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobUrl: "",
    location: "",
    salary: "",
    status: defaultStatus as ApplicationStatus,
    priority: "MEDIUM" as Priority,
    notes: "",
    appliedAt: "",
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error)
        return
      }

      toast.success("Application added!")
      onSuccess(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0 sm:space-y-3">

      {/* Company + Job title: stack on mobile, side by side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="companyName">Company *</Label>
          <Input
            id="companyName"
            placeholder="Google"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="jobTitle">Job title *</Label>
          <Input
            id="jobTitle"
            placeholder="Software Engineer"
            value={form.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Location + Salary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Remote / New York"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            placeholder="$120k – $150k"
            value={form.salary}
            onChange={(e) => set("salary", e.target.value)}
          />
        </div>
      </div>

      {/* Job URL — full width */}
      <div className="space-y-1">
        <Label htmlFor="jobUrl">Job URL</Label>
        <Input
          id="jobUrl"
          type="url"
          placeholder="https://..."
          value={form.jobUrl}
          onChange={(e) => set("jobUrl", e.target.value)}
        />
      </div>

      {/* Status + Priority + Date: stack on mobile, 3 cols on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WISHLIST">Wishlist</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFER">Offer</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="appliedAt">Applied date</Label>
          <Input
            id="appliedAt"
            type="date"
            value={form.appliedAt}
            onChange={(e) => set("appliedAt", e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this application..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="resize-none max-h-32 overflow-y-auto"
        />
      </div>

      {/* Actions: stacked on mobile, row on sm+ */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="w-full sm:flex-1">
          {isLoading ? "Saving..." : "Add application"}
        </Button>
      </div>

    </form>
  )
}
