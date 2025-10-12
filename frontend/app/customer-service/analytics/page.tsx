"use client"

import { mockConversations } from "@/lib/mock-data"
import { MessageSquare, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default function CSAnalytics() {
  const totalConversations = mockConversations.length
  const resolvedConversations = mockConversations.filter((c) => c.status === "resolved").length
  const avgResponseTime = "12 min"
  const satisfactionRate = "94%"

  const stats = [
    {
      label: "Total Conversations",
      value: totalConversations,
      icon: MessageSquare,
      change: "+15% from last week",
    },
    {
      label: "Resolved",
      value: resolvedConversations,
      icon: CheckCircle,
      change: "+8% from last week",
    },
    {
      label: "Avg Response Time",
      value: avgResponseTime,
      icon: Clock,
      change: "-2 min from last week",
    },
    {
      label: "Satisfaction Rate",
      value: satisfactionRate,
      icon: TrendingUp,
      change: "+2% from last week",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your customer service performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  )
}
