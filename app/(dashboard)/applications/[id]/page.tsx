import { requireUser } from "@/lib/require-user"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ApplicationDetail } from "@/components/applications/application-detail"
import { cacheTag, cacheLife } from "next/cache"

async function getApplication(id: string, userId: string) {
  "use cache"
  cacheTag(`application-${id}`)
  cacheLife("minutes")
  return prisma.application.findFirst({
    where: { id, userId },
    include: {
      interviews: { orderBy: { scheduledAt: "asc" } },
      contacts: { orderBy: { createdAt: "asc" } },
    },
  })
}

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) redirect("/login")
  const application = await getApplication(id, user.id)

  if (!application) notFound()

  return <ApplicationDetail application={application} />
}
