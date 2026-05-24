"use client"

import { useState, useCallback } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { KanbanColumn } from "./column"
import { ApplicationForm } from "@/components/applications/application-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { KanbanData, KanbanCard, ApplicationStatus, Application } from "@/types"

const STATUSES: ApplicationStatus[] = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]

type Props = {
  initialData: KanbanData
}

export function KanbanBoard({ initialData }: Props) {
  const [data, setData] = useState<KanbanData>(initialData)
  const [addingTo, setAddingTo] = useState<ApplicationStatus | null>(null)

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const sourceStatus = source.droppableId as ApplicationStatus
    const destStatus = destination.droppableId as ApplicationStatus

    // Optimistic update
    setData((prev) => {
      const newData = { ...prev }
      const sourceCards = [...prev[sourceStatus]]
      const destCards = sourceStatus === destStatus ? sourceCards : [...prev[destStatus]]

      const [moved] = sourceCards.splice(source.index, 1)
      const updatedCard = { ...moved, status: destStatus }

      if (sourceStatus === destStatus) {
        sourceCards.splice(destination.index, 0, updatedCard)
        newData[sourceStatus] = sourceCards
      } else {
        destCards.splice(destination.index, 0, updatedCard)
        newData[sourceStatus] = sourceCards
        newData[destStatus] = destCards
      }

      return newData
    })

    // Persist to DB
    try {
      const res = await fetch(`/api/applications/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destStatus }),
      })

      if (!res.ok) throw new Error()
    } catch {
      toast.error("Failed to update status")
      setData(initialData)
    }
  }, [initialData])

  function handleAddSuccess(application: Application) {
    const card: KanbanCard = {
      id: application.id,
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      status: application.status as ApplicationStatus,
      priority: application.priority as "LOW" | "MEDIUM" | "HIGH",
      appliedAt: application.appliedAt,
      location: application.location ?? null,
      salary: application.salary ?? null,
    }

    setData((prev) => ({
      ...prev,
      [card.status]: [card, ...prev[card.status]],
    }))

    setAddingTo(null)
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 pb-4 flex-wrap">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              cards={data[status]}
              onAddCard={(s) => setAddingTo(s)}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Add application dialog */}
      <Dialog open={!!addingTo} onOpenChange={() => setAddingTo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add application</DialogTitle>
          </DialogHeader>
          {addingTo && (
            <ApplicationForm
              defaultStatus={addingTo}
              onSuccess={handleAddSuccess}
              onCancel={() => setAddingTo(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}