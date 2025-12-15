"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterSection {
  title: string
  items: { label: string; count?: number }[]
}

const filterSections: FilterSection[] = [
  {
    title: "Asset Class",
    items: [
      { label: "Equities", count: 142 },
      { label: "Fixed Income", count: 89 },
      { label: "Foreign Exchange", count: 56 },
      { label: "Commodities", count: 34 },
      { label: "Cryptocurrencies", count: 28 },
      { label: "Derivatives", count: 67 },
    ],
  },
  {
    title: "Data Provider",
    items: [
      { label: "Bloomberg", count: 98 },
      { label: "Refinitiv", count: 76 },
      { label: "ICE Data Services", count: 54 },
      { label: "CME Group", count: 43 },
      { label: "S&P Global", count: 38 },
      { label: "Internal", count: 107 },
    ],
  },
  {
    title: "Licensing Type",
    items: [
      { label: "Enterprise License", count: 156 },
      { label: "Per-User License", count: 89 },
      { label: "Internal/Free", count: 171 },
    ],
  },
  {
    title: "Geography",
    items: [
      { label: "North America", count: 198 },
      { label: "Europe", count: 134 },
      { label: "Asia Pacific", count: 112 },
      { label: "Latin America", count: 45 },
      { label: "Global", count: 87 },
    ],
  },
]

function FilterSection({ title, items }: FilterSection) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="space-y-3 pt-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id={item.label} />
                <Label
                  htmlFor={item.label}
                  className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
                >
                  {item.label}
                </Label>
              </div>
              {item.count && <span className="text-xs text-muted-foreground">{item.count}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function CatalogFilters() {
  const [qualityScore, setQualityScore] = useState([7])

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {filterSections.map((section) => (
          <FilterSection key={section.title} {...section} />
        ))}

        <div className="border-b border-border pb-4">
          <div className="py-3">
            <Label className="text-sm font-medium text-foreground">Minimum Quality Score: {qualityScore[0]}/10</Label>
            <div className="mt-4">
              <Slider
                value={qualityScore}
                onValueChange={setQualityScore}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
