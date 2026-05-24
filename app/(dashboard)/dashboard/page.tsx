import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { KanbanBoard } from "@/components/kanban/board"
import type { KanbanData, ApplicationStatus, KanbanCard } from "@/types"

const STATUSES: ApplicationStatus[] = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]

async function getKanbanData(userId: string): Promise<KanbanData> {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      status: true,
      priority: true,
      appliedAt: true,
      location: true,
      salary: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const empty = STATUSES.reduce((acc, s) => {
    acc[s] = []
    return acc
  }, {} as KanbanData)

  return applications.reduce((acc, app) => {
    const card: KanbanCard = {
      id: app.id,
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      status: app.status as ApplicationStatus,
      priority: app.priority as "LOW" | "MEDIUM" | "HIGH",
      appliedAt: app.appliedAt,
      location: app.location,
      salary: app.salary,
    }
    acc[card.status].push(card)
    return acc
  }, empty)
}

export default async function DashboardPage() {
  const session = await auth()
  const kanbanData = await getKanbanData(session!.user.id)

  const totalApps = Object.values(kanbanData).flat().length
  const offers = kanbanData.OFFER.length
  const interviews = kanbanData.INTERVIEW.length
  const applied = kanbanData.APPLIED.length

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Drag cards to update status
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: totalApps, color: "text-gray-900" },
          { label: "Applied", value: applied, color: "text-blue-600" },
          { label: "Interviews", value: interviews, color: "text-yellow-600" },
          { label: "Offers", value: offers, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialData={kanbanData} />
      </div>
    </div>
  )
}