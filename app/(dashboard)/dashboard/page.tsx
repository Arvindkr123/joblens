import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { KanbanBoard } from "@/components/kanban/board-dynamic"
import { cacheTag, cacheLife } from "next/cache"
import type { KanbanData, ApplicationStatus, KanbanCard } from "@/types"

const STATUSES: ApplicationStatus[] = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]

async function getKanbanData(userId: string): Promise<KanbanData> {
  "use cache"
  cacheTag(`user-${userId}-apps`)
  cacheLife("minutes")

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

const STAT_CONFIG = [
  {
    key: "WISHLIST" as ApplicationStatus,
    label: "Wishlist",
    bar: "bg-slate-300",
    num: "text-slate-700",
    accent: "border-l-slate-300",
  },
  {
    key: "APPLIED" as ApplicationStatus,
    label: "Applied",
    bar: "bg-blue-400",
    num: "text-blue-700",
    accent: "border-l-blue-400",
  },
  {
    key: "INTERVIEW" as ApplicationStatus,
    label: "Interviews",
    bar: "bg-amber-400",
    num: "text-amber-700",
    accent: "border-l-amber-400",
  },
  {
    key: "OFFER" as ApplicationStatus,
    label: "Offers",
    bar: "bg-emerald-400",
    num: "text-emerald-700",
    accent: "border-l-emerald-400",
  },
  {
    key: "REJECTED" as ApplicationStatus,
    label: "Rejected",
    bar: "bg-red-400",
    num: "text-red-600",
    accent: "border-l-red-400",
  },
]

export default async function DashboardPage() {
  const session = await auth()
  const kanbanData = await getKanbanData(session!.user.id)

  const firstName = session?.user?.name?.split(" ")[0] ?? "there"
  const total = STATUSES.reduce((sum, s) => sum + kanbanData[s].length, 0)

  const applied = kanbanData.APPLIED.length
  const interviews = kanbanData.INTERVIEW.length
  const offers = kanbanData.OFFER.length
  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : null
  const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {total === 0
            ? "Add your first application using the + button in any column below."
            : `Tracking ${total} application${total !== 1 ? "s" : ""} across your pipeline.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STAT_CONFIG.map(({ key, label, bar, num, accent }) => {
          const count = kanbanData[key].length
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div
              key={key}
              className={`bg-white rounded-xl border border-gray-100 border-l-4 ${accent}`}
            >
              <div className="p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                  {label}
                </p>
                <p className={`text-3xl font-bold tracking-tight ${num}`}>{count}</p>
                {total > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-1">
                      <div
                        className={`${bar} h-1 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{pct}% of total</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pipeline conversion */}
      {(interviewRate !== null || offerRate !== null) && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Pipeline Conversion
          </p>
          <div className="flex items-center gap-8 flex-wrap">
            {interviewRate !== null && (
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Applied → Interview</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-gray-900">{interviewRate}%</span>
                  <span className="text-xs text-gray-400">
                    {interviews} of {applied}
                  </span>
                </div>
              </div>
            )}
            {offerRate !== null && (
              <>
                <div className="h-10 w-px bg-gray-100 hidden sm:block" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Interview → Offer</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-gray-900">{offerRate}%</span>
                    <span className="text-xs text-gray-400">
                      {offers} of {interviews}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Board */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Board</p>
          <p className="text-xs text-gray-400">Drag cards to update status</p>
        </div>
        <KanbanBoard initialData={kanbanData} />
      </div>

    </div>
  )
}
