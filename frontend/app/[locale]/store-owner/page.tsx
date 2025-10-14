"use client"

import { useAuth } from "@/lib/auth-context"
import { mockStores, mockProducts } from "@/lib/mock-data"
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function StoreOwnerDashboard() {
  const { user } = useAuth()
  const store = mockStores.find((s) => s.id === user?.storeId)
  const storeProducts = mockProducts.filter((p) => p.brand === store?.name)

  const stats = [
    {
      label: "Total Products",
      value: storeProducts.length,
      icon: Package,
      change: "+2 this month",
    },
    {
      label: "Total Sales",
      value: store?.totalSales || 0,
      icon: ShoppingCart,
      change: "+12% from last month",
    },
    {
      label: "Revenue",
      value: `$${(store?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+8% from last month",
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      change: "+0.5% from last month",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with {store?.name} today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-serif mb-4">Recent Products</h2>
          <div className="space-y-4">
            {storeProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">${product.price}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            ))}
          </div>
          <Link href="/store-owner/products" className="text-sm text-primary hover:underline mt-4 inline-block">
            View all products →
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-serif mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/store-owner/products?action=add"
              className="block p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium mb-1">Add New Product</h3>
              <p className="text-sm text-muted-foreground">List a new item in your store</p>
            </Link>
            <Link
              href="/store-owner/analytics"
              className="block p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium mb-1">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Check your sales performance</p>
            </Link>
            <Link
              href="/store-owner/settings"
              className="block p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-medium mb-1">Store Settings</h3>
              <p className="text-sm text-muted-foreground">Update your store information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
