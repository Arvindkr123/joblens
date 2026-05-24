"use client"

import { Draggable } from "@hello-pangea/dnd"
import { useRouter } from "next/navigation"
import { StatusBadge } from "@/components/applications/status-badge"
import type { KanbanCard as KanbanCardType } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

const priorityDot: Record<string, string> = {
  HIGH:   "bg-red-400",
  MEDIUM: "bg-yellow-400",
  LOW:    "bg-gray-300",
}

type Props = {
  card: KanbanCardType
  index: number
}

export function KanbanCard({ card, index }: Props) {
  const router = useRouter()

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => router.push(`/applications/${card.id}`)}
          className={cn(
            "bg-white rounded-lg border border-gray-100 p-3 cursor-pointer",
            "hover:border-gray-300 hover:shadow-sm transition-all",
            snapshot.isDragging && "shadow-lg rotate-1 border-gray-300"
          )}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {card.companyName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {card.jobTitle}
              </p>
            </div>
            <span
              className={cn("w-2 h-2 rounded-full mt-1 shrink-0", priorityDot[card.priority])}
              title={card.priority}
            />
          </div>

          {card.location && (
            <p className="text-xs text-gray-400 mb-2 truncate">
              📍 {card.location}
            </p>
          )}

          {card.salary && (
            <p className="text-xs text-gray-400 mb-2 truncate">
              💰 {card.salary}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <StatusBadge status={card.status} />
            {card.appliedAt && (
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(card.appliedAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}