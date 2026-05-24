import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getStatusBadgeColor } from "@/lib/badge-colors"
import type { ApplicationStatus } from "@/types"

async function getApplications(userId: string) {
    return prisma.application.findMany({
        where: { userId },
        select: {
            id: true,
            companyName: true,
            jobTitle: true,
            status: true,
        },
        orderBy: { createdAt: "desc" },
    })
}

function formatStatus(status: string): string {
    const map: Record<string, string> = {
        WISHLIST: "Wishlist", APPLIED: "Applied", INTERVIEW: "Interview",
        OFFER: "Offer", REJECTED: "Rejected",
    }
    return map[status] ?? status
}

export default async function AiToolsPage() {
    const session = await auth()
    const applications = await getApplications(session!.user.id)

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">

            {/* Hero */}
            <div className="text-center py-8 sm:py-10">
                <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                    </svg>
                    Powered by Groq · Llama 3.3 70B
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                    Your AI job search assistant
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                    Pick any application and let AI prepare you for interviews, write your cover letter,
                    and sharpen your resume — in seconds.
                </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 0v4m0 12v-4m8-4h-4M8 12H4" />
                            </svg>
                        </div>
                        <p className="font-medium text-gray-900 mb-1.5">Interview prep</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Get 8 tailored interview questions with expert tips on how to answer each one for your specific role and company.
                        </p>
                    </div>
                    <div>
                        <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full">
                            ⚡ Instant
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <p className="font-medium text-gray-900 mb-1.5">Cover letter</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Generate a polished, tailored cover letter for any application. Copy it in one click and make it your own.
                        </p>
                    </div>
                    <div>
                        <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full">
                            📋 Copy ready
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col justify-between sm:col-span-2 md:col-span-1">
                    <div>
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                        <p className="font-medium text-gray-900 mb-1.5">Resume tips</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Get 6 specific, actionable tips to tailor your resume for the job description and stand out from applicants.
                        </p>
                    </div>
                    <div>
                        <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">
                            ✓ Actionable
                        </span>
                    </div>
                </div>
            </div>

            {/* Application picker */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6 my-3">
                <p className="font-medium text-gray-900 mb-0.5">Choose an application to get started</p>
                <p className="text-sm text-gray-500 mb-4">
                    AI tools use your job title, company, and notes for better results
                </p>

                {applications.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-gray-500 text-sm">No applications yet.</p>
                        <Link
                            href="/applications"
                            className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-600 hover:underline"
                        >
                            Add your first application →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {applications.map((app) => (
                            <Link
                                key={app.id}
                                href={`/applications/${app.id}?tab=ai`}
                                className="flex items-center justify-between p-3 sm:px-4 sm:py-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group min-w-0 gap-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-sm font-medium text-purple-700 shrink-0">
                                        {app.companyName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{app.companyName}</p>
                                        <p className="text-xs text-gray-500 truncate">{app.jobTitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(app.status as ApplicationStatus)}`}
                                    >
                                        {formatStatus(app.status)}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors hidden sm:block"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* How it works */}
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
                    How it works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        {
                            step: "Step 1",
                            title: "Pick an application",
                            desc: "Select any saved application — the AI uses your job title, company, and notes automatically.",
                        },
                        {
                            step: "Step 2",
                            title: "Choose a tool",
                            desc: "Pick interview prep, cover letter, or resume tips depending on where you are in the process.",
                        },
                        {
                            step: "Step 3",
                            title: "Generate and use",
                            desc: "Hit generate, review the output, copy what you need, and regenerate any time for a fresh take.",
                        },
                    ].map((item, index) => (
                        <div 
                            key={item.step} 
                            className={`bg-white rounded-xl border border-gray-100 p-4 ${
                                index === 2 ? 'sm:col-span-2 md:col-span-1' : ''
                            }`}
                        >
                            <p className="text-xs text-gray-400 mb-1">{item.step}</p>
                            <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}