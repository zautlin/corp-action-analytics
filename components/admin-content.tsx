"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Database, Users, Plus, Edit, Trash2, Search, TrendingUp, Clock, Flag, Filter, UserCog } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface Dataset {
  id: string
  name: string
  provider: string
  assetClass: string
  status: "active" | "inactive"
  records: string
  quality: number
  lastUpdated: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  datasets: number
  lastActive: string
}

export function AdminContent() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "1",
      name: "Bloomberg Real-Time Equity Prices",
      provider: "Bloomberg L.P.",
      assetClass: "Equities",
      status: "active",
      records: "50M+",
      quality: 9.2,
      lastUpdated: "Real-time",
    },
    {
      id: "2",
      name: "Fixed Income Corporate Bonds",
      provider: "Refinitiv",
      assetClass: "Fixed Income",
      status: "active",
      records: "2.5M",
      quality: 8.9,
      lastUpdated: "Daily",
    },
    {
      id: "3",
      name: "Crypto Market Data",
      provider: "CoinGecko",
      assetClass: "Crypto",
      status: "active",
      records: "15K",
      quality: 8.5,
      lastUpdated: "Real-time",
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@hedgefund.com",
      role: "Portfolio Manager",
      status: "active",
      datasets: 12,
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      email: "m.rodriguez@quant.com",
      role: "Quantitative Analyst",
      status: "active",
      datasets: 8,
      lastActive: "5 hours ago",
    },
    {
      id: "3",
      name: "Emily Watson",
      email: "e.watson@datateam.com",
      role: "Data Engineer",
      status: "active",
      datasets: 15,
      lastActive: "1 day ago",
    },
  ])

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  const [featureFlags, setFeatureFlags] = useState([
    {
      id: "1",
      name: "Lineage Visualization",
      description: "Show data lineage diagrams on dataset detail pages",
      enabled: true,
      scope: "global",
      datasets: [],
    },
    {
      id: "2",
      name: "Quality Metrics",
      description: "Display quality score metrics and trends",
      enabled: true,
      scope: "global",
      datasets: [],
    },
    {
      id: "3",
      name: "Schema Explorer",
      description: "Interactive schema exploration with data types",
      enabled: true,
      scope: "specific",
      datasets: ["bloomberg-equity", "refinitiv-fixed-income"],
    },
    {
      id: "4",
      name: "AI Chat Assistant",
      description: "AI-powered chat for dataset questions",
      enabled: true,
      scope: "global",
      datasets: [],
    },
    {
      id: "5",
      name: "Discussion Board",
      description: "User comments and discussions on datasets",
      enabled: false,
      scope: "specific",
      datasets: ["factset-satellite"],
    },
  ])

  const [catalogFilters, setCatalogFilters] = useState([
    {
      id: "1",
      name: "Asset Class",
      enabled: true,
      order: 1,
      options: ["Equities", "Fixed Income", "FX", "Commodities", "Crypto", "Alternative Data"],
    },
    {
      id: "2",
      name: "Provider",
      enabled: true,
      order: 2,
      options: ["Bloomberg L.P.", "Refinitiv", "FactSet", "S&P Global", "Morningstar", "ICE"],
    },
    {
      id: "3",
      name: "Geography",
      enabled: true,
      order: 3,
      options: ["Global", "North America", "Europe", "Asia Pacific", "Latin America", "Middle East"],
    },
    {
      id: "4",
      name: "Licensing",
      enabled: true,
      order: 4,
      options: ["Commercial", "Internal Use", "Open Source"],
    },
    {
      id: "5",
      name: "Update Frequency",
      enabled: false,
      order: 5,
      options: ["Real-time", "Intraday", "Daily", "Weekly", "Monthly"],
    },
  ])

  const [featureFlagDialogOpen, setFeatureFlagDialogOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [selectedFeatureFlag, setSelectedFeatureFlag] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState<any>(null)

  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserRole, setSelectedUserRole] = useState<string>("")

  const [groups, setGroups] = useState([
    { id: "1", name: "Data Consumer", description: "General users with read access", members: 45 },
    { id: "2", name: "Data Steward", description: "Can manage owned datasets and approve requests", members: 12 },
    { id: "3", name: "Administrator", description: "Full platform access and configuration", members: 3 },
  ])

  const handleEditDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setEditDialogOpen(true)
  }

  const handleToggleDatasetStatus = (id: string) => {
    setDatasets(
      datasets.map((d) => (d.id === id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d)),
    )
  }

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)))
  }

  const handleToggleFeatureFlag = (id: string) => {
    setFeatureFlags(featureFlags.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const handleToggleFilter = (id: string) => {
    setCatalogFilters(catalogFilters.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setSelectedUserRole(user.role)
    setUserEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...selectedUser, role: selectedUserRole } : u)))
    }
    setUserEditDialogOpen(false)
    setSelectedUser(null)
  }

  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])

  const handleFeatureFlagDialogOpen = (flag: any) => {
    setSelectedFeatureFlag(flag)
    setSelectedDatasets(flag.datasets || [])
    setFeatureFlagDialogOpen(true)
  }

  const handleToggleDatasetSelection = (datasetId: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId) ? prev.filter((id) => id !== datasetId) : [...prev, datasetId],
    )
  }

  const handleSaveFeatureFlag = () => {
    if (selectedFeatureFlag) {
      setFeatureFlags(
        featureFlags.map((f) => (f.id === selectedFeatureFlag.id ? { ...f, datasets: selectedDatasets } : f)),
      )
    }
    setFeatureFlagDialogOpen(false)
    setSelectedFeatureFlag(null)
    setSelectedDatasets([])
  }

  const handleEditFeatureFlag = (flag: any) => {
    setSelectedFeatureFlag(flag)
    setFeatureFlagDialogOpen(true)
  }

  const handleEditFilter = (filter: any) => {
    setSelectedFilter(filter)
    setFilterDialogOpen(true)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-semibold tracking-tight text-foreground">Admin Portal</h1>
        <p className="text-muted-foreground">Manage datasets, users, and platform configuration</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Datasets</p>
                <p className="text-2xl font-semibold">{datasets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold">{users.filter((u) => u.status === "active").length}</p>
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
                <p className="text-xs text-muted-foreground">Avg Quality Score</p>
                <p className="text-2xl font-semibold">
                  {(datasets.reduce((acc, d) => acc + d.quality, 0) / datasets.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-semibold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="filters">Catalog Filters</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dataset Management</CardTitle>
                  <CardDescription>Manage and configure datasets in the library</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dataset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search datasets..." className="pl-9" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dataset Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasets.map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell className="font-medium">{dataset.name}</TableCell>
                        <TableCell>{dataset.provider}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dataset.assetClass}</Badge>
                        </TableCell>
                        <TableCell>{dataset.records}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">{dataset.quality}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={dataset.status === "active"}
                              onCheckedChange={() => handleToggleDatasetStatus(dataset.id)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {dataset.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDataset(dataset)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Group/Role</TableHead>
                      <TableHead>Datasets</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.datasets}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === "active"}
                              onCheckedChange={() => handleToggleUserStatus(user.id)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {user.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Group Management</CardTitle>
                  <CardDescription>Manage user groups and role-based permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-primary" />
                            {group.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{group.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{group.members} users</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Enable or disable features for all datasets or specific datasets</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Datasets</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureFlags.map((flag) => (
                      <TableRow key={flag.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-primary" />
                            {flag.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{flag.description}</TableCell>
                        <TableCell>
                          <Badge variant={flag.scope === "global" ? "default" : "secondary"}>
                            {flag.scope === "global" ? "Global" : "Specific Datasets"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {flag.scope === "global" ? (
                            <span className="text-muted-foreground">All datasets</span>
                          ) : (
                            <span className="text-muted-foreground">{flag.datasets.length} datasets</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={flag.enabled} onCheckedChange={() => handleToggleFeatureFlag(flag.id)} />
                            <span className="text-sm text-muted-foreground">
                              {flag.enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleFeatureFlagDialogOpen(flag)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Catalog Filters</CardTitle>
                  <CardDescription>Manage hierarchical filters shown on the main catalog page</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filter Name</TableHead>
                      <TableHead>Options</TableHead>
                      <TableHead>Display Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catalogFilters
                      .sort((a, b) => a.order - b.order)
                      .map((filter) => (
                        <TableRow key={filter.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4 text-primary" />
                              {filter.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex flex-wrap gap-1">
                              {filter.options.slice(0, 3).map((option, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {option}
                                </Badge>
                              ))}
                              {filter.options.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{filter.options.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{filter.order}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={filter.enabled} onCheckedChange={() => handleToggleFilter(filter.id)} />
                              <span className="text-sm text-muted-foreground">
                                {filter.enabled ? "Visible" : "Hidden"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditFilter(filter)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure global platform settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-approve requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve access requests from verified users
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for access requests and approvals
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Public discussions</Label>
                    <p className="text-sm text-muted-foreground">Allow users to post comments on dataset pages</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">AI features</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered summaries and chat assistance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Default access duration</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Dataset</DialogTitle>
            <DialogDescription>Update dataset information and configuration</DialogDescription>
          </DialogHeader>
          {selectedDataset && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Dataset Name</Label>
                <Input defaultValue={selectedDataset.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input defaultValue={selectedDataset.provider} />
                </div>
                <div className="space-y-2">
                  <Label>Asset Class</Label>
                  <Select defaultValue={selectedDataset.assetClass.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equities">Equities</SelectItem>
                      <SelectItem value="fixed income">Fixed Income</SelectItem>
                      <SelectItem value="fx">FX</SelectItem>
                      <SelectItem value="commodities">Commodities</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Records</Label>
                  <Input defaultValue={selectedDataset.records} />
                </div>
                <div className="space-y-2">
                  <Label>Quality Score</Label>
                  <Input type="number" step="0.1" defaultValue={selectedDataset.quality} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={userEditDialogOpen} onOpenChange={setUserEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and group assignment</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Group/Role</Label>
                <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data Consumer">Data Consumer</SelectItem>
                    <SelectItem value="Data Steward">Data Steward</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedUserRole === "Data Consumer" && "General users with read access to approved datasets"}
                  {selectedUserRole === "Data Steward" && "Can manage owned datasets and approve access requests"}
                  {selectedUserRole === "Administrator" && "Full platform access and configuration"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={selectedUser.status === "active"}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, status: checked ? "active" : "inactive" })
                  }
                />
                <Label>Active Account</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={featureFlagDialogOpen} onOpenChange={setFeatureFlagDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Feature Flag</DialogTitle>
            <DialogDescription>Configure feature flag settings and dataset scope</DialogDescription>
          </DialogHeader>
          {selectedFeatureFlag && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Feature Name</Label>
                <Input value={selectedFeatureFlag.name} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Feature name cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={selectedFeatureFlag.description} disabled className="bg-muted" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select
                  value={selectedFeatureFlag.scope}
                  onValueChange={(value) => setSelectedFeatureFlag({ ...selectedFeatureFlag, scope: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Datasets)</SelectItem>
                    <SelectItem value="specific">Specific Datasets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedFeatureFlag.scope === "specific" && (
                <div className="space-y-2">
                  <Label>Select Datasets</Label>
                  <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                    {datasets.map((dataset) => (
                      <div key={dataset.id} className="flex items-start gap-3">
                        <Checkbox
                          id={`dataset-${dataset.id}`}
                          checked={selectedDatasets.includes(dataset.id)}
                          onCheckedChange={() => handleToggleDatasetSelection(dataset.id)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`dataset-${dataset.id}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {dataset.name}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {dataset.provider} • {dataset.assetClass}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedDatasets.length} datasets selected</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeatureFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFeatureFlag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Catalog Filter</DialogTitle>
            <DialogDescription>Configure filter options and display order</DialogDescription>
          </DialogHeader>
          {selectedFilter && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Filter Name</Label>
                <Input defaultValue={selectedFilter.name} />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" defaultValue={selectedFilter.order} />
              </div>
              <div className="space-y-2">
                <Label>Filter Options (one per line)</Label>
                <Textarea defaultValue={selectedFilter.options.join("\n")} rows={8} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setFilterDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
