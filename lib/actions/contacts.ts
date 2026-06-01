"use server"

import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import { updateTag } from "next/cache"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  linkedin: z.string().optional(),
  notes: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export async function addContact(applicationId: string, input: ContactInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId: session.user.id },
    select: { id: true },
  })
  if (!app) throw new Error("Application not found")

  const data = contactSchema.parse(input)

  await prisma.contact.create({
    data: {
      applicationId,
      name: data.name,
      role: data.role || null,
      email: data.email || null,
      linkedin: data.linkedin || null,
      notes: data.notes || null,
    },
  })

  updateTag(`application-${applicationId}`)
}

export async function deleteContact(contactId: string, applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const contact = await prisma.contact.findFirst({
    where: { id: contactId, application: { userId: session.user.id } },
    select: { id: true },
  })
  if (!contact) throw new Error("Contact not found")

  await prisma.contact.delete({ where: { id: contactId } })
  updateTag(`application-${applicationId}`)
}