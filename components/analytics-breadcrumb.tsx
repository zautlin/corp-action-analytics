import { ChevronRight } from "lucide-react"

export function AnalyticsBreadcrumb() {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
      <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        Home
      </a>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-foreground">Analytics</span>
    </nav>
  )
}
