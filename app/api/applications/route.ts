import { NextResponse } from "next/server"
import { requireUser } from "@/lib/require-user"
import { prisma } from "@/lib/prisma"
import { revalidateTag } from "next/cache"
import { z } from "zod"

const createSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobUrl: z.string().optional(),
    location: z.string().optional(),
    salary: z.string().optional(),
    status: z.enum(["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).default("WISHLIST"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    notes: z.string().optional(),
    appliedAt: z.string().optional(),
})

export async function GET() {
    try {
        const user = await requireUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const applications = await prisma.application.findMany({
            where: { userId: user.id },
            include: { interviews: true, contacts: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(applications)
    } catch {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const data = createSchema.parse(body)

        const application = await prisma.application.create({
            data: {
                ...data,
                jobUrl: data.jobUrl || null,
                appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
                userId: user.id,
            },
        })

        revalidateTag(`user-${user.id}-apps`, "max")

        return NextResponse.json(application, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
        }

        console.error("[POST /api/applications]", error)
        return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
    }
}
