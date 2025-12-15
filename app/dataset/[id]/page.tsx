"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { DatasetDetailBreadcrumb } from "@/components/dataset-detail-breadcrumb"
import { DatasetDetailContent } from "@/components/dataset-detail-content"
import { isAuthenticated } from "@/lib/auth"

export default function DatasetDetailPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      window.location.href = "/login"
    }
  }, [])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <DatasetDetailBreadcrumb />
        <DatasetDetailContent />
      </main>
    </div>
  )
}
