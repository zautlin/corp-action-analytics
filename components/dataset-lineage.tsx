"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Database, GitBranch, HardDrive } from "lucide-react"

interface Node {
  id: string
  label: string
  type: "source" | "transform" | "target"
  columns?: number
  schema?: string
}

interface Edge {
  from: string
  to: string
}

export function DatasetLineage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodes: Node[] = [
    { id: "nyse_feed", label: "nyse_feed", type: "source", columns: 12, schema: "market_data" },
    { id: "nasdaq_feed", label: "nasdaq_feed", type: "source", columns: 12, schema: "market_data" },
    { id: "lse_feed", label: "lse_feed", type: "source", columns: 10, schema: "market_data" },
    { id: "equity_prices", label: "equity_prices", type: "target", columns: 16, schema: "analytics" },
  ]

  const edges: Edge[] = [
    { from: "nyse_feed", to: "equity_prices" },
    { from: "nasdaq_feed", to: "equity_prices" },
    { from: "lse_feed", to: "equity_prices" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Lineage</CardTitle>
        <CardDescription>Visual representation of data flow from source systems to target datasets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-gray-50 p-8 min-h-[500px]" ref={containerRef}>
          <div className="flex items-center justify-between gap-8">
            {/* Source nodes column */}
            <div className="flex flex-col gap-6">
              {nodes
                .filter((n) => n.type === "source")
                .map((node) => (
                  <div
                    key={node.id}
                    className={`relative bg-white rounded-lg border-2 p-4 w-64 shadow-sm transition-all cursor-pointer ${
                      hoveredNode === node.id ? "border-blue-500 shadow-md" : "border-orange-300"
                    }`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <GitBranch className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{node.schema}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{node.label}</h4>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
                          <HardDrive className="h-3 w-3" />
                          <span>{node.columns} columns</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Center connection visualization */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-full h-64">
                <svg className="w-full h-full" style={{ overflow: "visible" }}>
                  {/* Draw curved connection lines */}
                  {edges.map((edge, idx) => {
                    const sourceIndex = nodes.findIndex((n) => n.id === edge.from)
                    const targetIndex = nodes.findIndex((n) => n.id === edge.to)
                    const startY = 80 + sourceIndex * 120
                    const endY = 130
                    const midX = 150

                    return (
                      <g key={idx}>
                        <path
                          d={`M 0 ${startY} Q ${midX} ${startY}, ${midX} ${endY} T 300 ${endY}`}
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                          className="transition-all"
                        />
                      </g>
                    )
                  })}
                </svg>
                {/* Center home node */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-indigo-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Home
                  </div>
                </div>
              </div>
            </div>

            {/* Target nodes column */}
            <div className="flex flex-col gap-6">
              {nodes
                .filter((n) => n.type === "target")
                .map((node) => (
                  <div
                    key={node.id}
                    className={`relative bg-white rounded-lg border-2 p-4 w-64 shadow-sm transition-all cursor-pointer ${
                      hoveredNode === node.id ? "border-blue-500 shadow-md" : "border-orange-300"
                    }`}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 shrink-0">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <GitBranch className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{node.schema}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{node.label}</h4>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
                          <HardDrive className="h-3 w-3" />
                          <span>{node.columns} columns</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
          <strong>API Integration:</strong> This visualization is generated from backend API data with nodes and edges.
          The component expects a response with node objects (id, label, type, columns, schema) and edge objects (from,
          to) to render the lineage graph.
        </div>
      </CardContent>
    </Card>
  )
}
