"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, ChevronRight } from "lucide-react"
import { Fragment } from "react"

interface BreadcrumbSegment {
  label: string
  href?: string
}

export function InstrumentBreadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb segments from pathname
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const segments: BreadcrumbSegment[] = [{ label: "Home", href: "/" }]

    const paths = pathname.split("/").filter(Boolean)

    if (paths[0] === "instruments") {
      segments.push({ label: "Instruments", href: "/instruments" })

      if (paths[1]) {
        // We're on a specific instrument page
        const valoren = paths[1]
        segments.push({ label: `Valoren ${valoren}` })
      }
    }

    return segments
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="container mx-auto px-4 py-4 border-b bg-muted/30">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((segment, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {segment.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href!} className="flex items-center gap-2">
                        {index === 0 && <Home className="h-4 w-4" />}
                        {segment.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                )}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
