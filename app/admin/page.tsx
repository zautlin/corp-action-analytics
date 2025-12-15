"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { AdminBreadcrumb } from "@/components/admin-breadcrumb"
import { AdminContent } from "@/components/admin-content"
import { getCurrentUser, canAccessAdminPortal, isAuthenticated } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      window.location.href = "/login"
    }
  }, [])

  if (!mounted) return null

  const user = getCurrentUser()

  if (!user) return null

  if (!canAccessAdminPortal(user)) {
    return (
      <div className="min-h-screen bg-muted/30">
        <CatalogHeader />
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <Shield className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                  You don't have permission to access the Admin Portal. This page is restricted to administrators only.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button asChild>
                  <a href="/">Return to Library</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CatalogHeader />
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <AdminBreadcrumb />
        <AdminContent />
      </div>
    </div>
  )
}
