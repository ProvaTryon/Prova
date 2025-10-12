"use client"

import { Package, Users, TrendingUp, Store } from "lucide-react"
import { mockStores } from "@/lib/mock-data"

export default function AdminDashboard() {
  const totalStores = mockStores.length
  const activeStores = mockStores.filter((s) => s.status === "active").length
  const pendingStores = mockStores.filter((s) => s.status === "pending").length

  const stats = [
    {
      name: "Total Stores",
      value: totalStores.toString(),
      change: `${activeStores} active`,
      icon: Store,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
    {
      name: "Total Products",
      value: "248",
      change: "+12%",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Total Users",
      value: "1,429",
      change: "+8%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Revenue",
      value: "$45,231",
      change: "+18%",
      icon: TrendingUp,
      color: "text-primary-foreground",
      bgColor: "bg-primary/20",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Pròva admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Pending Store Approvals</h2>
          <div className="space-y-4">
            {pendingStores.length > 0 ? (
              pendingStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.ownerEmail}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                    Pending
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
            )}
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">Order #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">2 items • $129.99</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Completed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
