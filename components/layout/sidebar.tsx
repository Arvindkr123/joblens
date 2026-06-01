"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { DefaultSession } from "next-auth"

type User = DefaultSession["user"]

// ── SVG icons ──────────────────────────────────────────────────────────────
function IconBoard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <rect x="13" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="16" width="8" height="5" rx="1.5" />
    </svg>
  )
}

function IconApps({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function IconAnalytics({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 4-6" />
    </svg>
  )
}

function IconAI({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  )
}

function IconProfile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconSignOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

// ── Nav items ──────────────────────────────────────────────────────────────
const navItems = [
  { href: "/dashboard",    label: "Board",      Icon: IconBoard    },
  { href: "/applications", label: "Apps",       Icon: IconApps     },
  { href: "/analytics",    label: "Analytics",  Icon: IconAnalytics },
  { href: "/ai",           label: "AI Tools",   Icon: IconAI       },
  { href: "/profile",      label: "Profile",    Icon: IconProfile  },
]

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo + collapse */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-gray-100 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-gray-900">JobLens</span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">J</span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden md:flex absolute left-10 top-4 z-10 p-1 rounded-md text-gray-400 hover:text-gray-600 bg-white border border-gray-100 shadow-sm transition-colors"
              aria-label="Expand sidebar"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link key={href} href={href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors",
                    collapsed ? "justify-center px-2" : "",
                    active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="p-2 border-t border-gray-100 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
              {user?.image ? (
                <img src={user.image} alt="" className="w-6 h-6 rounded-full shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium">{user?.name?.[0]}</span>
                </div>
              )}
              <span className="text-sm text-gray-700 truncate">{user?.name}</span>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors",
              collapsed ? "justify-center" : ""
            )}
            title={collapsed ? "Sign out" : undefined}
          >
            <IconSignOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center h-16 px-2 pb-safe">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            const isProfile = href === "/profile"

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center gap-1 py-1"
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-150",
                    active ? "bg-gray-900" : ""
                  )}
                >
                  {isProfile && user?.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className={cn(
                        "w-5 h-5 rounded-full transition-all",
                        active ? "ring-2 ring-white" : ""
                      )}
                    />
                  ) : (
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        active ? "text-white" : "text-gray-400"
                      )}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-none font-medium transition-colors",
                    active ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind the nav */}
      <div className="md:hidden h-16 shrink-0" />
    </>
  )
}
