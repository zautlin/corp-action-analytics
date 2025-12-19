import { Badge } from "@/components/ui/badge"
import { Building2, DollarSign, TrendingUp, Users } from "lucide-react"

const corporateActions = [
  {
    date: "2024-12-15",
    type: "Dividend",
    description: "Quarterly dividend declared at $0.52 per share",
    icon: DollarSign,
    variant: "default" as const,
  },
  {
    date: "2024-11-28",
    type: "Stock Split",
    description: "2-for-1 stock split executed",
    icon: TrendingUp,
    variant: "secondary" as const,
  },
  {
    date: "2024-11-10",
    type: "Board Meeting",
    description: "Annual shareholders meeting scheduled",
    icon: Users,
    variant: "outline" as const,
  },
  {
    date: "2024-10-20",
    type: "Acquisition",
    description: "Acquired TechStart Inc. for $2.3B",
    icon: Building2,
    variant: "default" as const,
  },
  {
    date: "2024-09-15",
    type: "Dividend",
    description: "Quarterly dividend declared at $0.50 per share",
    icon: DollarSign,
    variant: "default" as const,
  },
  {
    date: "2024-08-10",
    type: "Dividend",
    description: "Special dividend of $1.00 per share",
    icon: DollarSign,
    variant: "default" as const,
  },
]

export function CorporateActions() {
  return (
    <div className="space-y-3">
      {corporateActions.map((action, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <action.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={action.variant} className="text-xs">
                {action.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{action.date}</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{action.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
