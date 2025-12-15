import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"

export function DatasetQualityMetrics() {
  const metrics = [
    { name: "Completeness", score: 98, description: "Percentage of non-null values", status: "excellent" },
    { name: "Accuracy", score: 95, description: "Data validation pass rate", status: "excellent" },
    { name: "Timeliness", score: 99, description: "On-time delivery rate", status: "excellent" },
    { name: "Consistency", score: 92, description: "Cross-field validation score", status: "good" },
    { name: "Uniqueness", score: 100, description: "Duplicate detection score", status: "excellent" },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{metric.name}</span>
                  {metric.status === "excellent" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                </div>
                <span className="text-sm font-semibold">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-muted-foreground">
              Quality score improved by <span className="font-semibold text-green-600">+2.3%</span> over the last 30
              days
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
