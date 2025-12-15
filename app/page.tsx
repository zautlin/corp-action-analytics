"use client"

import { useEffect, useState } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { CatalogBreadcrumb } from "@/components/catalog-breadcrumb"
import { CatalogFilters } from "@/components/catalog-filters"
import { CatalogGrid } from "@/components/catalog-grid"
import { CatalogSearch } from "@/components/catalog-search"
import { isAuthenticated } from "@/lib/auth"

export default function DataMarketplacePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      window.location.href = "/login"
    }
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
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
        <CatalogBreadcrumb />

        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">Data Library</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover and access premium financial datasets for quantitative research, portfolio management, and
            investment decisions
          </p>
        </div>

        <div className="mb-6">
          <CatalogSearch />
        </div>

        <div className="flex gap-8">
          <aside className="w-72 shrink-0">
            <CatalogFilters />
          </aside>

          <div className="flex-1 min-w-0">
            <CatalogGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
