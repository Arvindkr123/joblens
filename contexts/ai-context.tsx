"use client"

import { createContext, useContext } from "react"

type AiContextValue = {
  jobTitle: string
  companyName: string
  jobDescription: string
}

export const AiContext = createContext<AiContextValue | null>(null)

export function useAiContext() {
  const ctx = useContext(AiContext)
  if (!ctx) throw new Error("useAiContext must be used inside AiTools")
  return ctx
}
