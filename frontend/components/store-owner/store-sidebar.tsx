"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, BarChart3, Settings, Home, Store } from "lucide-react"

export function StoreSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/store-owner", label: "Dashboard", icon: Home },
    { href: "/store-owner/products", label: "My Products", icon: Package },
    { href: "/store-owner/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/store-owner/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-primary text-primary-foreground min-h-screen p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif">Store Owner</h2>
        <p className="text-sm opacity-80 mt-1">Manage your store</p>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-6 rounded-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
      >
        <Store className="w-4 h-4" />
        <span className="font-medium">View Store</span>
      </Link>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
