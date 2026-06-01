"use client"

import { useAiContext } from "@/contexts/ai-context"
import { useAiGeneration } from "@/hooks/use-ai-generation"

type ResumeTip = { tip: string; reason: string }

function Skeleton() {
  return (
    <div className="space-y-3 mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ResumeTips() {
  const { jobTitle, companyName, jobDescription } = useAiContext()
  const { result, loading, error, generate } = useAiGeneration("resume-tips")

  const tips: ResumeTip[] | null = result ? JSON.parse(result) : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900">Resume Tips</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Specific tips to tailor your resume for {jobTitle}
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
            <>{tips ? "Regenerate" : "Generate"}</>
          )}
        </button>
      </div>

      {loading && <Skeleton />}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {!loading && tips && (
        <div className="space-y-3 mt-2">
          {tips.map((item, i) => (
            <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="shrink-0 w-6 h-6 bg-gray-900 text-white text-xs font-semibold rounded-full flex items-center justify-center">
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

      {!loading && !tips && !error && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-3xl mb-3">📄</p>
          <p className="text-sm text-gray-500">
            Click Generate to get specific resume tips for this role
          </p>
        </div>
      )}
    </div>
  )
}
