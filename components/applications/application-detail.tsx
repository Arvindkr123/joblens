"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { formatDate } from "@/lib/date"
import { getStatusBadgeColor, getPriorityBadgeColor } from "@/lib/badge-colors"
import { AiTools } from "./ai-tools"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { addContact, deleteContact } from "@/lib/actions/contacts"
import { addInterview, deleteInterview } from "@/lib/actions/interviews"
import type { ApplicationStatus, Priority } from "@/types"

type Interview = {
  id: string
  type: string
  scheduledAt: Date
  notes: string | null
  outcome: string | null
}

type Contact = {
  id: string
  name: string
  role: string | null
  email: string | null
  linkedin: string | null
  notes: string | null
}

type Application = {
  id: string
  companyName: string
  jobTitle: string
  jobUrl: string | null
  location: string | null
  salary: string | null
  status: string
  priority: string
  notes: string | null
  appliedAt: Date | null
  createdAt: Date
  interviews: Interview[]
  contacts: Contact[]
}

const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System Design",
  FINAL: "Final Round",
  OTHER: "Other",
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    WISHLIST: "Wishlist", APPLIED: "Applied", INTERVIEW: "Interview",
    OFFER: "Offer", REJECTED: "Rejected",
  }
  return map[status] ?? status
}

type Tab = "overview" | "interviews" | "contacts" | "ai"

const INTERVIEW_TYPES = [
  { value: "PHONE_SCREEN", label: "Phone Screen" },
  { value: "TECHNICAL", label: "Technical" },
  { value: "BEHAVIORAL", label: "Behavioral" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
  { value: "FINAL", label: "Final Round" },
  { value: "OTHER", label: "Other" },
]

export function ApplicationDetail({ application }: { application: Application }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const [showContactDialog, setShowContactDialog] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "", role: "", email: "", linkedin: "", notes: "",
  })

  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    type: "PHONE_SCREEN" as const,
    scheduledAt: "",
    notes: "",
    outcome: "",
  })

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "interviews", label: `Interviews (${application.interviews.length})`, icon: "🗓" },
    { id: "contacts", label: `Contacts (${application.contacts.length})`, icon: "👤" },
    { id: "ai", label: "AI Tools", icon: "✨" },
  ]

  function handleAddContact(e: React.SyntheticEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await addContact(application.id, contactForm)
        toast.success("Contact added")
        setShowContactDialog(false)
        setContactForm({ name: "", role: "", email: "", linkedin: "", notes: "" })
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add contact")
      }
    })
  }

  function handleDeleteContact(contactId: string) {
    startTransition(async () => {
      try {
        await deleteContact(contactId, application.id)
        toast.success("Contact removed")
        router.refresh()
      } catch {
        toast.error("Failed to remove contact")
      }
    })
  }

  function handleAddInterview(e: React.SyntheticEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await addInterview(application.id, interviewForm)
        toast.success("Interview added")
        setShowInterviewDialog(false)
        setInterviewForm({ type: "PHONE_SCREEN", scheduledAt: "", notes: "", outcome: "" })
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add interview")
      }
    })
  }

  function handleDeleteInterview(interviewId: string) {
    startTransition(async () => {
      try {
        await deleteInterview(interviewId, application.id)
        toast.success("Interview removed")
        router.refresh()
      } catch {
        toast.error("Failed to remove interview")
      }
    })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        ← Back to applications
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-semibold text-gray-900 truncate">
                {application.companyName}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status as ApplicationStatus)}`}
              >
                {formatStatus(application.status)}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(application.priority as Priority)}`}
              >
                {application.priority}
              </span>
            </div>
            <p className="text-lg text-gray-600">{application.jobTitle}</p>
          </div>
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Job ↗
            </a>
          )}
        </div>

        <div className="flex items-center gap-6 mt-4 flex-wrap">
          {application.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span>📍</span> {application.location}
            </div>
          )}
          {application.salary && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span>💰</span> {application.salary}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>📅</span>{" "}
            {application.appliedAt
              ? `Applied ${formatDate(application.appliedAt)}`
              : `Added ${formatDate(application.createdAt)}`}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Notes</h2>
          {application.notes ? (
            <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
              {application.notes}
            </p>
          ) : (
            <p className="text-gray-400 text-sm italic">No notes added yet.</p>
          )}
        </div>
      )}

      {/* Interviews tab */}
      {activeTab === "interviews" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowInterviewDialog(true)}>
              + Add Interview
            </Button>
          </div>

          {application.interviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <p className="text-4xl mb-3">🗓</p>
              <p className="text-gray-500 text-sm">No interviews scheduled yet.</p>
            </div>
          ) : (
            application.interviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {INTERVIEW_TYPE_LABELS[interview.type] ?? interview.type}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDate(interview.scheduledAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {interview.outcome && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                        {interview.outcome}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      disabled={isPending}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {interview.notes && (
                  <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100 whitespace-pre-wrap">
                    {interview.notes}
                  </p>
                )}
              </div>
            ))
          )}

          {/* Add Interview Dialog */}
          <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add Interview</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddInterview} className="space-y-3">
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select
                    value={interviewForm.type}
                    onValueChange={(v) =>
                      setInterviewForm((f) => ({ ...f, type: v as typeof f.type }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="scheduledAt">Date & Time *</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={interviewForm.scheduledAt}
                    onChange={(e) =>
                      setInterviewForm((f) => ({ ...f, scheduledAt: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="outcome">Outcome</Label>
                  <Input
                    id="outcome"
                    placeholder="e.g. Passed, Next round..."
                    value={interviewForm.outcome}
                    onChange={(e) =>
                      setInterviewForm((f) => ({ ...f, outcome: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="interviewNotes">Notes</Label>
                  <Textarea
                    id="interviewNotes"
                    placeholder="Notes about this interview..."
                    value={interviewForm.notes}
                    onChange={(e) =>
                      setInterviewForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowInterviewDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? "Saving..." : "Add Interview"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowContactDialog(true)}>
              + Add Contact
            </Button>
          </div>

          {application.contacts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <p className="text-4xl mb-3">👤</p>
              <p className="text-gray-500 text-sm">No contacts added yet.</p>
            </div>
          ) : (
            application.contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    {contact.role && (
                      <p className="text-sm text-gray-500 mt-0.5">{contact.role}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    )}
                    {contact.linkedin && (
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      disabled={isPending}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {contact.notes && (
                  <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    {contact.notes}
                  </p>
                )}
              </div>
            ))
          )}

          {/* Add Contact Dialog */}
          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddContact} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="contactName">Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Jane Smith"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="contactRole">Role</Label>
                    <Input
                      id="contactRole"
                      placeholder="Recruiter"
                      value={contactForm.role}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, role: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="jane@company.com"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="contactLinkedin">LinkedIn URL</Label>
                  <Input
                    id="contactLinkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={contactForm.linkedin}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, linkedin: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="contactNotes">Notes</Label>
                  <Textarea
                    id="contactNotes"
                    placeholder="Notes about this contact..."
                    value={contactForm.notes}
                    onChange={(e) =>
                      setContactForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowContactDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? "Saving..." : "Add Contact"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {activeTab === "ai" && (
        <AiTools
          jobTitle={application.jobTitle}
          companyName={application.companyName}
          jobDescription={application.notes ?? ""}
        />
      )}
    </div>
  )
}
