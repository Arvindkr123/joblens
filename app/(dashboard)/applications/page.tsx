import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { ApplicationsPageContent } from "@/components/applications/applications-content"
import { cacheTag, cacheLife } from "next/cache"

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
  const session = await auth()
  const applications = await getApplications(session!.user.id)

  return <ApplicationsPageContent applications={applications} />
}
