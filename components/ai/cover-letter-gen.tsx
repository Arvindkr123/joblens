"use client"

import { useState } from "react"
import { useAiContext } from "@/contexts/ai-context"
import { useAiGeneration } from "@/hooks/use-ai-generation"

function Skeleton() {
  return (
    <div className="space-y-3 mt-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-100 rounded animate-pulse"
          style={{ width: `${85 + (i % 3) * 5}%` }}
        />
      ))}
    </div>
  )
}

export function CoverLetterGen() {
  const { jobTitle, companyName, jobDescription } = useAiContext()
  const { result, loading, error, generate } = useAiGeneration("cover-letter")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900">Cover Letter</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Tailored letter for {jobTitle} at {companyName}
          </p>
        </div>
        <button
          onClick={() => generate({ jobTitle, companyName, jobDescription })}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>{result ? "Regenerate" : "Generate"}</>
          )}
        </button>
      </div>

      {loading && <Skeleton />}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {!loading && result && (
        <div className="mt-2">
          <div className="relative bg-gray-50 rounded-lg p-5">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-md transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pr-16">
              {result}
            </p>
          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-3xl mb-3">✉️</p>
          <p className="text-sm text-gray-500">
            Click Generate to write a tailored cover letter
          </p>
        </div>
      )}
    </div>
  )
}
