"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateTag } from "next/cache"
import { z } from "zod"

const interviewSchema = z.object({
  type: z.enum(["PHONE_SCREEN", "TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN", "FINAL", "OTHER"]),
  scheduledAt: z.string().min(1, "Scheduled date is required"),
  notes: z.string().optional(),
  outcome: z.string().optional(),
})

export type InterviewInput = z.infer<typeof interviewSchema>

export async function addInterview(applicationId: string, input: InterviewInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId: session.user.id },
    select: { id: true },
  })
  if (!app) throw new Error("Application not found")

  const data = interviewSchema.parse(input)

  await prisma.interview.create({
    data: {
      applicationId,
      type: data.type,
      scheduledAt: new Date(data.scheduledAt),
      notes: data.notes || null,
      outcome: data.outcome || null,
    },
  })

  updateTag(`application-${applicationId}`)
}

export async function deleteInterview(interviewId: string, applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, application: { userId: session.user.id } },
    select: { id: true },
  })
  if (!interview) throw new Error("Interview not found")

  await prisma.interview.delete({ where: { id: interviewId } })
  updateTag(`application-${applicationId}`)
}

