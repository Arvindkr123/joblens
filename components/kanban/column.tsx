"use client"

import { Droppable } from "@hello-pangea/dnd"
import { KanbanCard } from "./card"
import type { KanbanCard as KanbanCardType, ApplicationStatus } from "@/types"
import { cn } from "@/lib/utils"

const columnConfig: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  WISHLIST: { label: "Wishlist", color: "text-gray-600", bg: "bg-gray-50" },
  APPLIED: { label: "Applied", color: "text-blue-600", bg: "bg-blue-50" },
  INTERVIEW: { label: "Interview", color: "text-yellow-600", bg: "bg-yellow-50" },
  OFFER: { label: "Offer", color: "text-green-600", bg: "bg-green-50" },
  REJECTED: { label: "Rejected", color: "text-red-600", bg: "bg-red-50" },
}

type Props = {
  status: ApplicationStatus
  cards: KanbanCardType[]
  onAddCard: (status: ApplicationStatus) => void
}

export function KanbanColumn({ status, cards, onAddCard }: Props) {
  const config = columnConfig[status]

  return (
    <div className="flex flex-col w-64 shrink-0">
      {/* Column header */}
      <div className={cn("flex items-center justify-between px-3 py-2 rounded-lg mb-2", config.bg)}>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", config.color)}>
            {config.label}
          </span>
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-full",
            config.bg, config.color, "border border-current border-opacity-20"
          )}>
            {cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(status)}
          className={cn("text-lg leading-none hover:opacity-70 transition-opacity", config.color)}
          title={`Add to ${config.label}`}
        >
          +
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-col gap-2 flex-1 min-h-32 p-1 pb-20 md:pb-4 rounded-lg transition-colors",
              snapshot.isDraggingOver && "bg-gray-100"
            )}
          >
            {cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}

            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-xs text-gray-400">Drop here</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}