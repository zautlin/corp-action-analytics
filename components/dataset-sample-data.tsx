"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function DatasetSampleData() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchColumn, setSearchColumn] = useState<string | null>(null)

  const sampleData = [
    {
      rank: "1",
      ticker: "TSLA",
      name: "Tesla Inc.",
      sector: "Transportation",
      weight: "5.24%",
      price: "$245.69",
      market_cap: "$777.2B",
      ytd_return: "+24.8%",
      thematic_score: 9.8,
      thematic_exposure: "EV Manufacturing",
    },
    {
      rank: "2",
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      sector: "Technology",
      weight: "4.82%",
      price: "$132.15",
      market_cap: "$3.24T",
      ytd_return: "+18.3%",
      thematic_score: 8.2,
      thematic_exposure: "AI for Energy Optimization",
    },
    {
      rank: "3",
      ticker: "ENPH",
      name: "Enphase Energy",
      sector: "Clean Energy",
      weight: "3.91%",
      price: "$89.42",
      market_cap: "$31.5B",
      ytd_return: "+32.1%",
      thematic_score: 9.9,
      thematic_exposure: "Solar Microinverters",
    },
    {
      rank: "4",
      ticker: "RUN",
      name: "Sunrun Inc.",
      sector: "Clean Energy",
      weight: "3.55%",
      price: "$52.78",
      market_cap: "$12.8B",
      ytd_return: "+28.7%",
      thematic_score: 9.7,
      thematic_exposure: "Residential Solar",
    },
    {
      rank: "5",
      ticker: "ADBE",
      name: "Adobe Inc.",
      sector: "Software",
      weight: "3.24%",
      price: "$567.43",
      market_cap: "$264.2B",
      ytd_return: "+15.2%",
      thematic_score: 6.1,
      thematic_exposure: "Green Tech Software",
    },
    {
      rank: "6",
      ticker: "SEDG",
      name: "SolarEdge Technologies",
      sector: "Clean Energy",
      weight: "2.98%",
      price: "$68.91",
      market_cap: "$8.9B",
      ytd_return: "+22.5%",
      thematic_score: 9.8,
      thematic_exposure: "Power Conversion",
    },
    {
      rank: "7",
      ticker: "GOOG",
      name: "Alphabet Inc.",
      sector: "Technology",
      weight: "2.87%",
      price: "$142.19",
      market_cap: "$1.82T",
      ytd_return: "+19.4%",
      thematic_score: 7.5,
      thematic_exposure: "Renewable Energy Projects",
    },
    {
      rank: "8",
      ticker: "NFLX",
      name: "Netflix Inc.",
      sector: "Media & Entertainment",
      weight: "2.65%",
      price: "$298.76",
      market_cap: "$135.4B",
      ytd_return: "+12.8%",
      thematic_score: 5.2,
      thematic_exposure: "Sustainability Content",
    },
  ]

  const getThematicColor = (score: number) => {
    if (score >= 9) return "bg-green-100 text-green-800 border border-green-300"
    if (score >= 8) return "bg-emerald-100 text-emerald-800 border border-emerald-300"
    if (score >= 7) return "bg-cyan-100 text-cyan-800 border border-cyan-300"
    if (score >= 6) return "bg-blue-100 text-blue-800 border border-blue-300"
    return "bg-slate-100 text-slate-700 border border-slate-300"
  }

  const filteredData = sampleData.filter((row) => {
    if (!searchTerm) return true
    if (searchColumn) {
      const value = row[searchColumn as keyof typeof row]?.toLowerCase() || ""
      return value.includes(searchTerm.toLowerCase())
    }
    // Search across all columns if no specific column selected
    return Object.values(row).some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const searchableColumns = [
    { key: "ticker", label: "Ticker" },
    { key: "name", label: "Company Name" },
    { key: "sector", label: "Sector" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Index Constituents</CardTitle>
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search constituents by ticker, company, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={searchColumn || "all"}
            onChange={(e) => setSearchColumn(e.target.value === "all" ? null : e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">All Columns</option>
            {searchableColumns.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead className="w-20">Ticker</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
                <TableHead className="text-right">YTD Return</TableHead>
                <TableHead className="text-center">Thematic Score</TableHead>
                <TableHead>Theme Exposure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No results found for "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm font-semibold">{row.rank}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold text-primary">{row.ticker}</TableCell>
                    <TableCell className="text-sm">{row.name}</TableCell>
                    <TableCell className="text-sm">
                      <span className="inline-flex px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        {row.sector}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold">{row.weight}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{row.price}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{row.market_cap}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-green-600">{row.ytd_return}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getThematicColor(row.thematic_score)}`}>
                        {row.thematic_score.toFixed(1)}/10
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.thematic_exposure}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {filteredData.length} of {sampleData.length} top constituents shown. Full index universe contains 85-100 holdings. 
          <span className="block mt-2">
            <strong>Thematic Score:</strong> Measures alignment with clean energy theme (0-10). Scores 9+ indicate primary clean energy exposure.
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
