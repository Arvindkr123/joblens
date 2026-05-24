import { generateInterviewPrep } from "@/lib/groq"
import { auth } from "@/lib/auth.server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { jobTitle, companyName } = await req.json()
  const result = await generateInterviewPrep(jobTitle, companyName)
  return NextResponse.json({ result })
}
