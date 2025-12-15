"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { AnalyticsBreadcrumb } from "@/components/analytics-breadcrumb"
import { AnalyticsContent } from "@/components/analytics-content"
import { getCurrentUser, canAccessAnalytics, isAuthenticated } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
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

  if (!canAccessAnalytics(user)) {
    return (
      <div className="min-h-screen bg-background">
        <CatalogHeader />
        <main className="mx-auto max-w-[1600px] px-6 py-8">
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
                  You don't have permission to access the Analytics dashboard. This page is restricted to Data Stewards
                  and Administrators.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button asChild>
                  <a href="/">Return to Library</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <AnalyticsBreadcrumb />
        <AnalyticsContent />
      </main>
    </div>
  )
}
