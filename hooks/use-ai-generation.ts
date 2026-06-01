"use client"

import { useState, useCallback } from "react"

type State = {
  result: string | null
  loading: boolean
  error: string | null
}

export function useAiGeneration(endpoint: string) {
  const [state, setState] = useState<State>({
    result: null,
    loading: false,
    error: null,
  })

  const generate = useCallback(
    async (payload: Record<string, string>) => {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const res = await fetch(`/api/ai/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        const json = await res.json()
        setState({ result: json.result, loading: false, error: null })
      } catch {
        setState((s) => ({
          ...s,
          loading: false,
          error: "Generation failed. Please try again.",
        }))
      }
    },
    [endpoint]
  )

  return { ...state, generate }
}
