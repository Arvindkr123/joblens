"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/date"
import { getStatusBadgeColor, getPriorityBadgeColor } from "@/lib/badge-colors"
import { AiTools } from "./ai-tools"
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

export function ApplicationDetail({ application }: { application: Application }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "interviews", label: `Interviews (${application.interviews.length})`, icon: "🗓" },
    { id: "contacts", label: `Contacts (${application.contacts.length})`, icon: "👤" },
    { id: "ai", label: "AI Tools", icon: "✨" },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
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

        {/* Meta row */}
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
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
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

      {/* Tab content */}
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

      {activeTab === "interviews" && (
        <div className="space-y-3">
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
                  {interview.outcome && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {interview.outcome}
                    </span>
                  )}
                </div>
                {interview.notes && (
                  <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100 whitespace-pre-wrap">
                    {interview.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-3">
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
                  <div className="flex items-center gap-2">
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
