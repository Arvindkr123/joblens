"use client"

import { useState } from "react"

type AiTab = "interview" | "cover-letter" | "resume"

type InterviewQuestion = { question: string; tip: string }
type ResumeTip = { tip: string; reason: string }

type Props = {
  jobTitle: string
  companyName: string
  jobDescription: string
}

export function AiTools({ jobTitle, companyName, jobDescription }: Props) {
  const [activeTab, setActiveTab] = useState<AiTab>("interview")
  const [loading, setLoading] = useState(false)

  // Results
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[] | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [resumeTips, setResumeTips] = useState<ResumeTip[] | null>(null)

  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      if (activeTab === "interview") {
        const res = await fetch("/api/ai/interview-prep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle, companyName }),
        })
        const data = await res.json()
        const parsed = JSON.parse(data.result)
        setInterviewQuestions(parsed)
      } else if (activeTab === "cover-letter") {
        const res = await fetch("/api/ai/cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle, companyName, jobDescription }),
        })
        const data = await res.json()
        setCoverLetter(data.result)
      } else {
        const res = await fetch("/api/ai/resume-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle, companyName, jobDescription }),
        })
        const data = await res.json()
        const parsed = JSON.parse(data.result)
        setResumeTips(parsed)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs: { id: AiTab; label: string; icon: string; description: string }[] = [
    {
      id: "interview",
      label: "Interview Prep",
      icon: "🎯",
      description: `Generate likely interview questions for ${jobTitle} at ${companyName}`,
    },
    {
      id: "cover-letter",
      label: "Cover Letter",
      icon: "✉️",
      description: `Write a tailored cover letter for ${jobTitle} at ${companyName}`,
    },
    {
      id: "resume",
      label: "Resume Tips",
      icon: "📄",
      description: `Get specific resume tips for the ${jobTitle} role`,
    },
  ]

  const activeConfig = tabs.find((t) => t.id === activeTab)!
  const hasResult =
    (activeTab === "interview" && interviewQuestions) ||
    (activeTab === "cover-letter" && coverLetter) ||
    (activeTab === "resume" && resumeTips)

  return (
    <div className="space-y-4">
      {/* AI tab selector */}
      <div className="grid grid-cols-3 gap-3">
        {tabs.map((tab) => (
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

      {/* Generate card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">{activeConfig.label}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{activeConfig.description}</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>✨ {hasResult ? "Regenerate" : "Generate"}</>
            )}
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Interview questions */}
        {!loading && activeTab === "interview" && interviewQuestions && (
          <div className="space-y-4 mt-2">
            {interviewQuestions.map((item, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {i + 1}. {item.question}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  💡 {item.tip}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Cover letter */}
        {!loading && activeTab === "cover-letter" && coverLetter && (
          <div className="mt-2">
            <div className="relative bg-gray-50 rounded-lg p-5">
              <button
                onClick={() => handleCopy(coverLetter)}
                className="absolute top-3 right-3 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-md transition-colors"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pr-16">
                {coverLetter}
              </p>
            </div>
          </div>
        )}

        {/* Resume tips */}
        {!loading && activeTab === "resume" && resumeTips && (
          <div className="space-y-3 mt-2">
            {resumeTips.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.tip}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasResult && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-4xl mb-3">{activeConfig.icon}</div>
            <p className="text-sm text-gray-500">
              Click Generate to create AI-powered {activeConfig.label.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
