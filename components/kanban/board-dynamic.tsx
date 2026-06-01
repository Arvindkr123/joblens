"use client"

import dynamic from "next/dynamic"
import type { KanbanData } from "@/types"

const BoardInner = dynamic(
  () => import("./board").then((m) => m.KanbanBoard),
  { ssr: false }
)

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  return <BoardInner initialData={initialData} />
}
