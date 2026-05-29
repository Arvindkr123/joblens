"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { DefaultSession } from "next-auth"

type User = DefaultSession["user"]

const navItems = [
  { href: "/dashboard", label: "Board", icon: "⬡" },
  { href: "/applications", label: "Applications", icon: "≡" },
  { href: "/analytics", label: "Analytics", icon: "↗" },
  { href: "/ai", label: "AI Tools", icon: "✦" },
]

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* ── Desktop & Tablet sidebar ── */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo + collapse toggle */}
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
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors",
                    collapsed ? "justify-center px-2" : "",
                    active
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  {!collapsed && item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-2 border-t border-gray-100 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
              {user?.image ? (
                <img src={user.image} alt="" className="w-6 h-6 rounded-full shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
              )}
              <span className="text-sm text-gray-700 truncate">{user?.name}</span>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors",
              collapsed ? "justify-center" : ""
            )}
            title={collapsed ? "Sign out" : undefined}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-1 safe-bottom">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-0",
                active ? "text-gray-900" : "text-gray-400"
              )}
            >
              <span className={cn("text-lg leading-none", active ? "text-gray-900" : "text-gray-400")}>
                {item.icon}
              </span>
              <span className={cn("text-xs", active ? "font-medium text-gray-900" : "text-gray-400")}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Avatar / sign out on mobile */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
        >
          {user?.image ? (
            <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          )}
          <span className="text-xs">Sign out</span>
        </button>
      </nav>

      {/* Mobile bottom nav spacer so content isn't hidden behind it */}
      <div className="md:hidden h-16 shrink-0" />
    </>
  )
}