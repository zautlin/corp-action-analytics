import { ChevronRight } from "lucide-react"

export function AdminBreadcrumb() {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
      <a href="/" className="hover:text-foreground transition-colors">
        Home
      </a>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">Admin Portal</span>
    </nav>
  )
}
