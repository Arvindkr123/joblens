import { NextResponse } from "next/server"
import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const applications = await prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        priority: true,
        createdAt: true,
        appliedAt: true,
        companyName: true,
        jobTitle: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Status breakdown
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Priority breakdown
    const priorityCounts = applications.reduce((acc, app) => {
      acc[app.priority] = (acc[app.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Applications over time (by week)
    const weeklyMap = applications.reduce((acc, app) => {
      const date = new Date(app.createdAt)
      const week = `${date.getFullYear()}-W${String(Math.ceil((date.getDate()) / 7)).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}`
      acc[week] = (acc[week] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const weekly = Object.entries(weeklyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count]) => ({ week, count }))

    // Response rate (applied -> interview or offer)
    const totalApplied = applications.filter(
      (a) => ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(a.status)
    ).length

    const totalResponded = applications.filter(
      (a) => ["INTERVIEW", "OFFER"].includes(a.status)
    ).length

    const responseRate = totalApplied > 0
      ? Math.round((totalResponded / totalApplied) * 100)
      : 0

    const offerRate = totalApplied > 0
      ? Math.round((applications.filter((a) => a.status === "OFFER").length / totalApplied) * 100)
      : 0

    // Top companies applied to
    const companyCounts = applications.reduce((acc, app) => {
      acc[app.companyName] = (acc[app.companyName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      total: applications.length,
      statusCounts,
      priorityCounts,
      weekly,
      responseRate,
      offerRate,
      topCompanies,
      totalApplied,
      totalResponded,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}