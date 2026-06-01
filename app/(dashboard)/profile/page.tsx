import { requireUser } from "@/lib/require-user"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/components/profile/sign-out-button"

const STATUS_LABELS: Record<string, string> = {
  WISHLIST:  "Wishlist",
  APPLIED:   "Applied",
  INTERVIEW: "Interview",
  OFFER:     "Offer",
  REJECTED:  "Rejected",
}

const STATUS_COLORS: Record<string, string> = {
  WISHLIST:  "text-slate-600  bg-slate-50  border-slate-200",
  APPLIED:   "text-blue-600   bg-blue-50   border-blue-200",
  INTERVIEW: "text-amber-600  bg-amber-50  border-amber-200",
  OFFER:     "text-emerald-600 bg-emerald-50 border-emerald-200",
  REJECTED:  "text-red-600    bg-red-50    border-red-200",
}

export default async function ProfilePage() {
  const authUser = await requireUser()
  if (!authUser) redirect("/login")

  const [statusGroups, dbUser] = await Promise.all([
    prisma.application.groupBy({
      by: ["status"],
      where: { userId: authUser.id },
      _count: { _all: true },
    }),
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: { createdAt: true, email: true, name: true, image: true },
    }),
  ])

  const user = { ...dbUser, id: authUser.id }

  const total = statusGroups.reduce((sum, g) => sum + g._count._all, 0)
  const joinedAt = dbUser?.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(dbUser.createdAt)
    : null

  return (
    <div className="p-4 md:p-6 max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your account details</p>
      </div>

      {/* User card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? ""}
              className="w-16 h-16 rounded-full ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-2xl font-semibold text-gray-500">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{dbUser?.email ?? user.email}</p>
            {joinedAt && (
              <p className="text-xs text-gray-400 mt-1">Member since {joinedAt}</p>
            )}
          </div>
        </div>
      </div>

      {/* Application stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          Application Stats
        </p>
        {total === 0 ? (
          <p className="text-sm text-gray-400">No applications yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {statusGroups.map((g) => (
                <div
                  key={g.status}
                  className={`rounded-lg border px-4 py-3 ${STATUS_COLORS[g.status] ?? "bg-gray-50 border-gray-200 text-gray-600"}`}
                >
                  <p className="text-xs font-medium opacity-70">
                    {STATUS_LABELS[g.status] ?? g.status}
                  </p>
                  <p className="text-2xl font-bold mt-0.5">{g._count._all}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">{total} total application{total !== 1 ? "s" : ""} tracked</p>
          </>
        )}
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          Account
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Sign out of your JobLens account on this device.
        </p>
        <SignOutButton />
      </div>

    </div>
  )
}
