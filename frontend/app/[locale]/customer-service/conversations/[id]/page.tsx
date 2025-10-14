"use client"

import { use, useState, useRef, useEffect } from "react"
import { mockConversations } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Send, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const [conversation, setConversation] = useState(mockConversations.find((c) => c.id === id))
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  if (!conversation) {
    return (
      <div className="p-8">
        <p>Conversation not found</p>
      </div>
    )
  }

  const handleSend = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "cs-1",
      senderName: user?.name || "Customer Service",
      senderRole: "agent" as const,
      content: message,
      timestamp: new Date().toISOString(),
    }

    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    })

    setMessage("")
  }

  const handleStatusChange = (newStatus: "active" | "waiting" | "resolved") => {
    setConversation({
      ...conversation,
      status: newStatus,
    })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6 border-b bg-card">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/customer-service/conversations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-serif mb-1">{conversation.customerName}</h1>
            <p className="text-sm text-muted-foreground">{conversation.customerEmail}</p>
            <p className="text-sm font-medium mt-2">{conversation.subject}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={conversation.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                conversation.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : conversation.priority === "medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {conversation.priority.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderRole === "agent" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                msg.senderRole === "agent" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{msg.senderName}</span>
                <span className="text-xs opacity-70">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
