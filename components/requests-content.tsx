"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  User,
  MessageSquare,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { getCurrentUser, canApproveRequest } from "@/lib/auth"
import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

export function RequestsContent() {
  const [user, setUser] = useState(getCurrentUser())
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const requests = [
    {
      id: "REQ-2025-8472",
      datasetId: "bloomberg-equity",
      dataset: "Bloomberg Real-Time Equity Prices",
      provider: "Bloomberg L.P.",
      status: "approved",
      requestDate: "2025-01-05",
      reviewDate: "2025-01-06",
      reviewer: "Sarah Chen",
      useCase: "Algorithmic Trading",
      justification:
        "Need real-time equity data for our high-frequency trading algorithms. Will be used to generate trading signals and execute automated trades across global markets.",
    },
    {
      id: "REQ-2025-7891",
      datasetId: "refinitiv-fixed-income",
      dataset: "Refinitiv Fixed Income Reference Data",
      provider: "Refinitiv",
      status: "approved",
      requestDate: "2024-12-15",
      reviewDate: "2024-12-16",
      reviewer: "Michael Torres",
      useCase: "Portfolio Management",
      justification:
        "Required for fixed income portfolio valuation and risk management. Will support daily NAV calculations and regulatory reporting.",
    },
    {
      id: "REQ-2025-9234",
      datasetId: "factset-satellite",
      dataset: "FactSet Alternative Data - Satellite Imagery",
      provider: "FactSet",
      status: "pending",
      requestDate: "2025-01-07",
      reviewDate: null,
      reviewer: null,
      useCase: "Quantitative Research",
      justification:
        "Exploring satellite imagery data for retail traffic analysis and supply chain monitoring. Part of our alternative data research initiative.",
    },
    {
      id: "REQ-2025-6543",
      datasetId: "morningstar-esg",
      dataset: "Morningstar ESG Risk Ratings",
      provider: "Morningstar",
      status: "rejected",
      requestDate: "2024-11-20",
      reviewDate: "2024-11-22",
      reviewer: "David Kim",
      useCase: "Risk Analytics",
      justification: "ESG risk assessment for portfolio holdings.",
      rejectionReason:
        "Insufficient business justification. Please provide more details on specific use case and expected ROI.",
    },
  ]

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const handleApprove = (request: any) => {
    setSelectedRequest(request)
    setApproveDialogOpen(true)
  }

  const handleReject = (request: any) => {
    setSelectedRequest(request)
    setRejectDialogOpen(true)
  }

  const confirmApprove = () => {
    console.log("[v0] Approving request:", selectedRequest?.id)
    // In a real app, this would call an API
    setApproveDialogOpen(false)
    setSelectedRequest(null)
  }

  const confirmReject = () => {
    console.log("[v0] Rejecting request:", selectedRequest?.id, "Reason:", rejectionReason)
    // In a real app, this would call an API
    setRejectDialogOpen(false)
    setSelectedRequest(null)
    setRejectionReason("")
  }

  const RequestCard = ({ request }: { request: (typeof requests)[0] }) => {
    const canApprove = user && canApproveRequest(user, request.datasetId)
    const showApprovalButtons = canApprove && request.status === "pending"

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-foreground">{request.dataset}</h3>
                {getStatusBadge(request.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{request.provider}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground mb-1">Request ID</p>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono font-medium">{request.id}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Use Case</p>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{request.useCase}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Requested On</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{request.requestDate}</span>
                  </div>
                </div>
                {request.reviewDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Reviewed On</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{request.reviewDate}</span>
                    </div>
                  </div>
                )}
                {request.reviewer && (
                  <div>
                    <p className="text-muted-foreground mb-1">Reviewer</p>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{request.reviewer}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Business Justification</p>
                <p className="text-sm text-foreground">{request.justification}</p>
              </div>

              {request.status === "rejected" && request.rejectionReason && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-700">{request.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {showApprovalButtons && (
                <>
                  <Button size="sm" onClick={() => handleApprove(request)} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(request)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              {request.status === "approved" && (
                <Button size="sm" asChild>
                  <a href={`/dataset/${request.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Dataset
                  </a>
                </Button>
              )}
              {request.status === "rejected" && (
                <Button size="sm" variant="outline">
                  Resubmit Request
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground">Access Requests</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">Track and manage your dataset access requests</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Approved</p>
                <p className="text-3xl font-bold">{approvedRequests.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <p className="text-3xl font-bold">{rejectedRequests.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => <RequestCard key={request.id} request={request} />)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((request) => <RequestCard key={request.id} request={request} />)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No rejected requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval confirmation dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Access Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve access to <strong>{selectedRequest?.dataset}</strong> for this user? They
              will be granted immediate access to the dataset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
              Approve Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection confirmation dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Access Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this access request. This will be shared with the requester.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
