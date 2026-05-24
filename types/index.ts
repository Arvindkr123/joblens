import type { Application, Interview, Contact, User } from "@/app/generated/prisma/client"

export type { Application, Interview, Contact, User }

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"

export type Priority = "LOW" | "MEDIUM" | "HIGH"

export type InterviewType =
  | "PHONE_SCREEN"
  | "TECHNICAL"
  | "BEHAVIORAL"
  | "SYSTEM_DESIGN"
  | "FINAL"
  | "OTHER"

export type ApplicationWithRelations = Application & {
  interviews: Interview[]
  contacts: Contact[]
}

export type KanbanCard = {
  id: string
  companyName: string
  jobTitle: string
  status: ApplicationStatus
  priority: Priority
  appliedAt: Date | null
  location: string | null
  salary: string | null
}

export type KanbanData = Record<ApplicationStatus, KanbanCard[]>