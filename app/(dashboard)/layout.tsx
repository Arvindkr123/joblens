import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

async function AuthShell({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <>
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>
    </>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Suspense>
        <AuthShell>{children}</AuthShell>
      </Suspense>
    </div>
  )
}

