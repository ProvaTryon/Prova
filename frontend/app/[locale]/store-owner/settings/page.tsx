"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockStores } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StoreOwnerSettings() {
  const { user } = useAuth()
  const store = mockStores.find((s) => s.id === user?.storeId)
  const [storeName, setStoreName] = useState(store?.name || "")
  const [description, setDescription] = useState(store?.description || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store information and preferences</p>
      </div>

      <div className="bg-card p-6 rounded-lg border space-y-6">
        <div>
          <Label htmlFor="storeName">Store Name</Label>
          <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full min-h-[100px] px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" value={user?.name || ""} disabled className="mt-2" />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email || ""} disabled className="mt-2" />
        </div>

        <div>
          <Label>Store Status</Label>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                store?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : store?.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {store?.status}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
