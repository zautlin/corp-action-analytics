import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { TrendingUp, Lock, CheckCircle2, Clock, BarChart3 } from "lucide-react"

interface Dataset {
  id: string
  name: string
  provider: string
  assetClass: string
  geography: string
  qualityScore: number
  description: string
  licensingType: string
  tags: string[]
  updateFrequency: string
  hasAccess: boolean
}

interface DatasetCardProps {
  dataset: Dataset
}

function QualityBadge({ score }: { score: number }) {
  const color =
    score >= 9
      ? "bg-green-100 text-green-800 border-green-200"
      : score >= 7
        ? "bg-blue-100 text-blue-800 border-blue-200"
        : "bg-amber-100 text-amber-800 border-amber-200"

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}>
      <TrendingUp className="h-3 w-3" />
      {score}/10
    </div>
  )
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card className="group flex flex-col transition-all hover:shadow-lg hover:border-primary/40">
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <QualityBadge score={dataset.qualityScore} />
          </div>
          {dataset.hasAccess ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {dataset.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-normal">
            {dataset.assetClass}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            {dataset.geography}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{dataset.description}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Rebalance: {dataset.updateFrequency}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{dataset.provider}</span>
          </div>
        </div>

        {dataset.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dataset.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        {dataset.hasAccess ? (
          <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
            <a href={`/dataset/${dataset.id}`}>View Index</a>
          </Button>
        ) : (
          <Button className="w-full" size="sm" asChild>
            <a href={`/dataset/${dataset.id}`}>Request Access</a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
