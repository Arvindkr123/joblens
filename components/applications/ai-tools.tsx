"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AiContext } from "@/contexts/ai-context"

const InterviewPrep = dynamic(() =>
  import("@/components/ai/interview-prep").then((m) => m.InterviewPrep)
)
const CoverLetterGen = dynamic(() =>
  import("@/components/ai/cover-letter-gen").then((m) => m.CoverLetterGen)
)
const ResumeTips = dynamic(() =>
  import("@/components/ai/resume-tips").then((m) => m.ResumeTips)
)

type AiTab = "interview" | "cover-letter" | "resume"

const TABS: { id: AiTab; label: string; icon: string }[] = [
  { id: "interview",    label: "Interview Prep", icon: "🎯" },
  { id: "cover-letter", label: "Cover Letter",   icon: "✉️" },
  { id: "resume",       label: "Resume Tips",    icon: "📄" },
]

type Props = {
  jobTitle: string
  companyName: string
  jobDescription: string
}

export function AiTools({ jobTitle, companyName, jobDescription }: Props) {
  const [activeTab, setActiveTab] = useState<AiTab>("interview")

  return (
    <AiContext.Provider value={{ jobTitle, companyName, jobDescription }}>
      <div className="space-y-4">
        {/* Tab selector */}
        <div className="grid grid-cols-3 gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeTab === tab.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-100 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">{tab.icon}</div>
              <div className="text-sm font-medium">{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Active panel — each component is loaded on demand */}
        {activeTab === "interview"    && <InterviewPrep />}
        {activeTab === "cover-letter" && <CoverLetterGen />}
        {activeTab === "resume"       && <ResumeTips />}
      </div>
    </AiContext.Provider>
  )
}
