import { requireUser } from "@/lib/require-user"
import { prisma } from "@/lib/prisma"
import { ApplicationsPageContent } from "@/components/applications/applications-content"
import { cacheTag, cacheLife } from "next/cache"
import { redirect } from "next/navigation"

async function getApplications(userId: string) {
  "use cache"
  cacheTag(`user-${userId}-apps`)
  cacheLife("minutes")
  return prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ApplicationsPage() {
  const user = await requireUser()
  if (!user) redirect("/login")
  const applications = await getApplications(user.id)

  return <ApplicationsPageContent applications={applications} />
}
