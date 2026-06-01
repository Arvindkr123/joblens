"use client"

import { useAiContext } from "@/contexts/ai-context"
import { useAiGeneration } from "@/hooks/use-ai-generation"

type Question = { question: string; tip: string }

function Skeleton() {
  return (
    <div className="space-y-4 mt-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
        </div>
      ))}
    </div>
  )
}

export function InterviewPrep() {
  const { jobTitle, companyName } = useAiContext()
  const { result, loading, error, generate } = useAiGeneration("interview-prep")

  const questions: Question[] | null = result ? JSON.parse(result) : null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-900">Interview Prep</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Likely questions for {jobTitle} at {companyName}
          </p>
        </div>
        <button
          onClick={() => generate({ jobTitle, companyName })}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>{questions ? "Regenerate" : "Generate"}</>
          )}
        </button>
      </div>

      {loading && <Skeleton />}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {!loading && questions && (
        <div className="space-y-4 mt-2">
          {questions.map((item, i) => (
            <div key={i} className="border-l-2 border-gray-200 pl-4">
              <p className="text-sm font-medium text-gray-900 mb-1">
                {i + 1}. {item.question}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">Tip: {item.tip}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !questions && !error && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-3xl mb-3">🎯</p>
          <p className="text-sm text-gray-500">
            Click Generate to create AI-powered interview questions
          </p>
        </div>
      )}
    </div>
  )
}
