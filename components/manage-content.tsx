"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Edit, Save, Search, TrendingUp } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

interface Dataset {
  id: string
  name: string
  description: string
  provider: string
  assetClass: string
  geography: string
  updateFrequency: string
  licensing: string
  qualityScore: number
  status: "active" | "inactive"
  sampleData: string
  documentation: string
  pythonCode: string
  keyFeatures?: string
  useCases?: string
}

export function ManageContent() {
  const [user, setUser] = useState(getCurrentUser())
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const ownedDatasets: Dataset[] = [
    {
      id: "bloomberg-equity",
      name: "Bloomberg Real-Time Equity Prices",
      description:
        "Real-time equity pricing data covering global markets with millisecond latency. Includes bid/ask spreads, volume, and market depth.",
      provider: "Bloomberg L.P.",
      assetClass: "Equities",
      geography: "Global",
      updateFrequency: "Real-time",
      licensing: "Commercial",
      qualityScore: 9.2,
      status: "active",
      sampleData: "CUSIP,Ticker,Price,Volume,Timestamp\n037833100,AAPL,178.52,45234567,2025-01-07T15:30:00Z",
      documentation: `# Bloomberg Real-Time Equity Prices\n\n## Overview\nReal-time equity pricing data with global coverage.\n\n## Data Fields\n- CUSIP: Security identifier\n- Ticker: Stock symbol\n- Price: Current price\n- Volume: Trading volume\n- Timestamp: Data timestamp\n\n## Update Frequency\nReal-time with millisecond latency\n\n## Coverage\n50M+ securities across global markets`,
      pythonCode: `import clickhouse_connect\n\n# Connect to ClickHouse\nclient = clickhouse_connect.get_client(\n    host='your-host.clickhouse.cloud',\n    user='default',\n    password='your-password'\n)\n\n# Query Bloomberg equity data\nquery = """\nSELECT \n    cusip,\n    ticker,\n    price,\n    volume,\n    timestamp\nFROM bloomberg_equity_prices\nWHERE timestamp >= now() - INTERVAL 1 HOUR\nORDER BY timestamp DESC\nLIMIT 1000\n"""\n\nresult = client.query(query)\ndf = result.result_as_dataframe()\nprint(df.head())`,
      keyFeatures: "Real-time updates, Global coverage, High quality score",
      useCases: "Trading, Analytics, Risk",
    },
    {
      id: "bloomberg-fx",
      name: "Bloomberg FX Rates",
      description: "Foreign exchange rates for major currency pairs with real-time updates.",
      provider: "Bloomberg L.P.",
      assetClass: "FX",
      geography: "Global",
      updateFrequency: "Real-time",
      licensing: "Commercial",
      qualityScore: 9.4,
      status: "active",
      sampleData: "Pair,Bid,Ask,Timestamp\nEUR/USD,1.0952,1.0953,2025-01-07T15:30:00Z",
      documentation: "# Bloomberg FX Rates\n\nReal-time foreign exchange rates...",
      pythonCode: "# Python code for FX data...",
      keyFeatures: "Real-time updates, Major currency pairs",
      useCases: "Trading, Analytics",
    },
  ]

  const filteredDatasets = ownedDatasets.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDatasetSelect = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setEditMode(false)
  }

  const handleSave = () => {
    console.log("[v0] Saving dataset:", selectedDataset)
    setEditMode(false)
  }

  const handleFieldChange = (field: keyof Dataset, value: string | number) => {
    if (selectedDataset) {
      setSelectedDataset({ ...selectedDataset, [field]: value })
    }
  }

  const handleToggleStatus = () => {
    if (selectedDataset) {
      setSelectedDataset({
        ...selectedDataset,
        status: selectedDataset.status === "active" ? "inactive" : "active",
      })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">Manage Datasets</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Update metadata, documentation, and code generators for your datasets
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your Datasets</p>
                <p className="text-2xl font-semibold">{ownedDatasets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Quality</p>
                <p className="text-2xl font-semibold">
                  {(ownedDatasets.reduce((acc, d) => acc + d.qualityScore, 0) / ownedDatasets.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Datasets</CardTitle>
          <CardDescription>Select a dataset to view and edit its configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatasets.map((dataset) => (
                  <TableRow key={dataset.id} className={selectedDataset?.id === dataset.id ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">{dataset.name}</TableCell>
                    <TableCell>{dataset.provider}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{dataset.assetClass}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">{dataset.qualityScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={dataset.status === "active" ? "default" : "secondary"}>
                        {dataset.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDatasetSelect(dataset)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedDataset && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedDataset.name}</CardTitle>
                <CardDescription>Update dataset information and configuration</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metadata" className="space-y-4">
              <TabsList>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="sample">Sample Data</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
                <TabsTrigger value="code">Python Code</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="space-y-4">
                <div className="space-y-2">
                  <Label>Dataset Name</Label>
                  <Input
                    value={selectedDataset.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={selectedDataset.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    disabled={!editMode}
                    rows={6}
                    placeholder="Detailed description of the dataset..."
                  />
                  <p className="text-xs text-muted-foreground">
                    This description will be displayed on the dataset detail page Overview tab
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Key Features</Label>
                  <Textarea
                    value={selectedDataset.keyFeatures || ""}
                    onChange={(e) => handleFieldChange("keyFeatures", e.target.value)}
                    disabled={!editMode}
                    rows={5}
                    placeholder="Enter key features, one per line..."
                  />
                  <p className="text-xs text-muted-foreground">
                    List the main features and capabilities of this dataset
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Use Cases</Label>
                  <Input
                    value={selectedDataset.useCases || ""}
                    onChange={(e) => handleFieldChange("useCases", e.target.value)}
                    disabled={!editMode}
                    placeholder="Comma-separated use cases (e.g., Trading, Analytics, Risk)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Common use cases for this dataset, displayed as badges
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Input
                      value={selectedDataset.provider}
                      onChange={(e) => handleFieldChange("provider", e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Class</Label>
                    <Select
                      value={selectedDataset.assetClass}
                      onValueChange={(value) => handleFieldChange("assetClass", value)}
                      disabled={!editMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equities">Equities</SelectItem>
                        <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                        <SelectItem value="FX">FX</SelectItem>
                        <SelectItem value="Commodities">Commodities</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Geography</Label>
                    <Input
                      value={selectedDataset.geography}
                      onChange={(e) => handleFieldChange("geography", e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Update Frequency</Label>
                    <Input
                      value={selectedDataset.updateFrequency}
                      onChange={(e) => handleFieldChange("updateFrequency", e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Licensing</Label>
                    <Select
                      value={selectedDataset.licensing}
                      onValueChange={(value) => handleFieldChange("licensing", value)}
                      disabled={!editMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Internal Use">Internal Use</SelectItem>
                        <SelectItem value="Open Source">Open Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Score</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={selectedDataset.qualityScore}
                      onChange={(e) => handleFieldChange("qualityScore", Number.parseFloat(e.target.value))}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={selectedDataset.status === "active"}
                    onCheckedChange={handleToggleStatus}
                    disabled={!editMode}
                  />
                  <Label>Dataset Active</Label>
                </div>
              </TabsContent>

              <TabsContent value="sample" className="space-y-4">
                <div className="space-y-2">
                  <Label>Sample Data (CSV Format)</Label>
                  <Textarea
                    value={selectedDataset.sampleData}
                    onChange={(e) => handleFieldChange("sampleData", e.target.value)}
                    disabled={!editMode}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This sample data will be shown to users and included in CSV exports
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="docs" className="space-y-4">
                <div className="space-y-2">
                  <Label>Documentation (Markdown)</Label>
                  <Textarea
                    value={selectedDataset.documentation}
                    onChange={(e) => handleFieldChange("documentation", e.target.value)}
                    disabled={!editMode}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This documentation will be included in the downloadable documentation file
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div className="space-y-2">
                  <Label>Python Code Template</Label>
                  <Textarea
                    value={selectedDataset.pythonCode}
                    onChange={(e) => handleFieldChange("pythonCode", e.target.value)}
                    disabled={!editMode}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    This Python code will be included in the generated Jupyter notebook
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
