import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, BarChart3, Activity } from "lucide-react"

const metrics = [
  {
    title: "Current Price",
    value: "$156.82",
    change: "+2.34%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Volume",
    value: "42.3M",
    change: "+12.5%",
    isPositive: true,
    icon: BarChart3,
  },
  {
    title: "Turnover",
    value: "$6.63B",
    change: "+8.2%",
    isPositive: true,
    icon: Activity,
  },
  {
    title: "Market Cap",
    value: "$2.45T",
    change: "-0.5%",
    isPositive: false,
    icon: TrendingUp,
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <metric.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${metric.isPositive ? "text-accent" : "text-destructive"}`}
              >
                {metric.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">{metric.title}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
