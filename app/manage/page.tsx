"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { ManageBreadcrumb } from "@/components/manage-breadcrumb"
import { ManageContent } from "@/components/manage-content"
import { getCurrentUser, isSteward, isAdmin } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function ManagePage() {
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (!currentUser) {
      window.location.href = "/login"
    } else if (!isSteward(currentUser) && !isAdmin(currentUser)) {
      // Only stewards and admins can access this page
      window.location.href = "/"
    }
  }, [])

  if (!user || (!isSteward(user) && !isAdmin(user))) {
    return (
      <div className="min-h-screen bg-background">
        <CatalogHeader />
        <main className="mx-auto max-w-[1600px] px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <ManageBreadcrumb />
        <ManageContent />
      </main>
    </div>
  )
}
