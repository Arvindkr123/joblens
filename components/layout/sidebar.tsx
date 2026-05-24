"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">J</span>
        </div>
        <span className="font-semibold text-gray-900">JobLens</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          {user?.image ? (
            <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200" />
          )}
          <span className="text-sm text-gray-700 truncate">{user?.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-gray-900"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </Button>
      </div>
    </aside>
  )
}