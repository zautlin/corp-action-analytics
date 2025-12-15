"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Globe, BarChart3, Download, Code, FileText, CheckCircle2 } from "lucide-react"
import { DatasetSchema } from "@/components/dataset-schema"
import { DatasetQualityMetrics } from "@/components/dataset-quality-metrics"
import { IndexPerformance } from "@/components/index-performance"
import { IndexPerformanceLightweight } from "@/components/index-performance-lightweight"
import { DatasetSampleData } from "@/components/dataset-sample-data"
import { AISummary } from "@/components/ai-summary"
import { RequestAccessModal } from "@/components/request-access-modal"
import { DatasetChat } from "@/components/dataset-chat"
import { DatasetDiscussion } from "@/components/dataset-discussion"

interface IndexProduct {
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

export function DatasetDetailContent() {
  const [showRequestModal, setShowRequestModal] = useState(false)

  const exportSampleCSV = () => {
    const csvContent = `date,symbol,name,weight,sector,contribution
2025-01-07,TSLA,Tesla Inc.,5.2,Transportation,0.42
2025-01-07,NVDA,NVIDIA Corporation,4.8,Technology,0.38
2025-01-07,ENPH,Enphase Energy,3.9,Clean Energy,0.31
2025-01-07,RUN,Sunrun Inc.,3.5,Clean Energy,0.28
2025-01-07,ADBE,Adobe Inc.,3.2,Software,0.26`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "index_constituents_sample.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadDocumentation = () => {
    const docContent = `# Thematic Index - Documentation

## Overview
This thematic index provides targeted exposure to companies at the forefront of transformative innovation. The index is designed with a systematic selection methodology to capture companies leading specific themes.

## Index Construction

### Selection Criteria
- Market capitalization and liquidity requirements
- Business model alignment with theme
- Revenue exposure to theme (minimum 50%)
- Growth metrics and innovation indicators

### Weighting Methodology
Market-cap weighted with diversification constraints:
- Maximum single constituent weight: 5%
- Minimum constituent weight: 0.1%
- Rebalancing frequency: Daily

## Holdings Information
- Total constituents: 50-100
- Sector diversification: 5-8 sectors
- Geographic distribution: Global
- Liquidity minimum: $100M average daily volume

## Performance Metrics
The index tracks historical performance, volatility, and correlation data with broader market indices for comparative analysis.

## Rebalancing Schedule
- Review frequency: Daily
- Reconstitution: Quarterly
- Effective dates: First trading day of each quarter

## Support
For technical support and questions: indices-support@provider.com`

    const blob = new Blob([docContent], { type: "text/markdown;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "bloomberg_equity_documentation.md")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePythonNotebook = () => {
    const notebookContent = {
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "# Thematic Index Analysis - Data Access\n",
            "\n",
            "This notebook demonstrates how to access and analyze thematic index data.\n",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Setup\n", "\n", "Install required packages and import libraries."],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Install required packages\n",
            "!pip install pandas requests matplotlib seaborn numpy scipy\n",
            "\n",
            "import pandas as pd\n",
            "import requests\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "from datetime import datetime, timedelta",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Connect to Index Data Provider"],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Configure your credentials\n",
            "API_KEY = 'YOUR_API_KEY_HERE'\n",
            "BASE_URL = 'https://api.indices-provider.com/v1'\n",
            "\n",
            "# Create session with authentication\n",
            "session = requests.Session()\n",
            "session.headers.update({'Authorization': f'Bearer {API_KEY}'})\n",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Get Index Constituents"],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Fetch current index constituents\n",
            "response = session.get(f'{BASE_URL}/constituents/current')\n",
            "constituents = response.json()\n",
            "\n",
            "df = pd.DataFrame(constituents)\n",
            "print(f'Index contains {len(df)} constituents')\n",
            "print(f'Total weight: {df[\"weight\"].sum():.2f}')\n",
            "df.head(10)",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Analyze Index Performance"],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Get index performance data\n",
            "response = session.get(f'{BASE_URL}/performance', params={'days': 252})\n",
            "performance = pd.DataFrame(response.json())\n",
            "performance['date'] = pd.to_datetime(performance['date'])\n",
            "\n",
            "# Calculate returns and volatility\n",
            "performance['daily_return'] = performance['value'].pct_change()\n",
            "annual_return = performance['daily_return'].mean() * 252\n",
            "annual_volatility = performance['daily_return'].std() * np.sqrt(252)\n",
            "\n",
            "print(f'1-Year Return: {annual_return:.2%}')\n",
            "print(f'Annual Volatility: {annual_volatility:.2%}')\n",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Visualize Index Composition"],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Plot sector composition\n",
            "plt.figure(figsize=(12, 6))\n",
            "sector_weights = df.groupby('sector')['weight'].sum().sort_values(ascending=False)\n",
            "sector_weights.plot(kind='barh')\n",
            "plt.xlabel('Weight (%)')\n",
            "plt.title('Index Sector Composition')\n",
            "plt.tight_layout()\n",
            "plt.show()",
          ],
        },
        {
          cell_type: "markdown",
          metadata: {},
          source: ["## Export Analysis Results\n", "\n", "Save constituent and performance data."],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Export to CSV\n",
            "df.to_csv('index_constituents.csv', index=False)\n",
            "performance.to_csv('index_performance.csv', index=False)\n",
            "print('Data exported successfully')",
          ],
        },
      ],
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3",
        },
        language_info: {
          codemirror_mode: {
            name: "ipython",
            version: 3,
          },
          file_extension: ".py",
          mimetype: "text/x-python",
          name: "python",
          nbconvert_exporter: "python",
          pygments_lexer: "ipython3",
          version: "3.11.0",
        },
      },
      nbformat: 4,
      nbformat_minor: 4,
    }

    const blob = new Blob([JSON.stringify(notebookContent, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "index_analysis.ipynb")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">
              Clean Energy Revolution Index
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm">
                Thematic Index
              </Badge>
              <Badge variant="outline" className="text-sm">
                Index Analytics Inc.
              </Badge>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <TrendingUp className="h-4 w-4" />
                9.4/10 Quality
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rebalance Frequency</p>
                  <p className="text-sm font-semibold">Daily</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coverage</p>
                  <p className="text-sm font-semibold">Global</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Constituents</p>
                  <p className="text-sm font-semibold">75-100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-semibold">Market-Cap Weighted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <AISummary />

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analyze">Constituents</TabsTrigger>
              <TabsTrigger value="schema">Methodology</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="lineage">Performance</TabsTrigger>
              <TabsTrigger value="lightweight">Lightweight</TabsTrigger>
              <TabsTrigger value="discuss">Discuss</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Index</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    The Clean Energy Revolution Index provides comprehensive exposure to companies at the forefront of the global transition to renewable energy, electric vehicles, and sustainable infrastructure. This thematic index captures innovation and growth opportunities across the clean energy ecosystem.
                  </p>
                  <p>
                    The index is systematically constructed with rigorous selection criteria to include only those companies with significant business model alignment and revenue exposure to clean energy themes. With daily rebalancing and quarterly reconstitution, the index reflects the most current opportunities in this rapidly evolving sector.
                  </p>
                  <p>
                    Designed for investors seeking targeted thematic exposure, this index provides a diversified approach to clean energy investing while maintaining strict quality and liquidity standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                      <span>Renewable Energy Generation (Solar, Wind, Hydro)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                      <span>Electric Vehicle Manufacturers and Suppliers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                      <span>Energy Storage and Battery Technology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                      <span>Smart Grid and Energy Management Systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                      <span>Sustainable Infrastructure and Green Building</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">ESG Investing</Badge>
                    <Badge variant="secondary">Thematic Allocation</Badge>
                    <Badge variant="secondary">Portfolio Hedging</Badge>
                    <Badge variant="secondary">Market Research</Badge>
                    <Badge variant="secondary">Benchmarking</Badge>
                    <Badge variant="secondary">Factor Analysis</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyze" className="mt-6 space-y-6">
              <DatasetSampleData />
              <Card>
                <CardHeader>
                  <CardTitle>Index Constituents</CardTitle>
                  <CardDescription>
                    Get insights about index composition, weighted constituents, and sector breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <DatasetChat />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schema" className="mt-6">
              <DatasetSchema />
            </TabsContent>

            <TabsContent value="quality" className="mt-6">
              <DatasetQualityMetrics />
            </TabsContent>

            <TabsContent value="lineage" className="mt-6">
              <IndexPerformance />
            </TabsContent>

            <TabsContent value="lightweight" className="mt-6">
              <IndexPerformanceLightweight />
            </TabsContent>

            <TabsContent value="discuss" className="mt-6">
              <DatasetDiscussion />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Index Access</CardTitle>
              <CardDescription>Request access to this index</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => setShowRequestModal(true)}>
                Request Access
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Access requests are typically reviewed within 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Download Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportSampleCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export Constituents
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={generatePythonNotebook}
              >
                <Code className="mr-2 h-4 w-4" />
                Analysis Notebook
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={downloadDocumentation}>
                <FileText className="mr-2 h-4 w-4" />
                Methodology Guide
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Index Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Index Provider</p>
                <p className="font-medium">Index Analytics Inc.</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Launch Date</p>
                <p className="font-medium">Jan 15, 2022</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Index Manager</p>
                <p className="font-medium">Strategy & Research Team</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Contact</p>
                <p className="font-medium text-primary">indices@analytics.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RequestAccessModal
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        datasetName="Clean Energy Revolution Index"
      />
    </div>
  )
}
