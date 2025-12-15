"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { MyDatasetsBreadcrumb } from "@/components/my-datasets-breadcrumb"
import { MyDatasetsContent } from "@/components/my-datasets-content"
import { isAuthenticated } from "@/lib/auth"

export default function MyDatasetsPage() {
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
        <MyDatasetsBreadcrumb />
        <MyDatasetsContent />
      </main>
    </div>
  )
}
