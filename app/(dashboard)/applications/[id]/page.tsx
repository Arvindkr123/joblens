import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ApplicationDetail } from "@/components/applications/application-detail"

async function getApplication(id: string, userId: string) {
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
  const session = await auth()
  const application = await getApplication(id, session!.user.id)

  if (!application) notFound()

  return <ApplicationDetail application={application} />
}