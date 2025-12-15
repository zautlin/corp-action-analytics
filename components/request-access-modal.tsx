"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

interface RequestAccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  datasetName: string
}

export function RequestAccessModal({ open, onOpenChange, datasetName }: RequestAccessModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [useCase, setUseCase] = useState("")
  const [justification, setJustification] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setStep("success")
    }, 500)
  }

  const handleClose = () => {
    setStep("form")
    setUseCase("")
    setJustification("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Request Dataset Access</DialogTitle>
              <DialogDescription>
                Submit a request to access <span className="font-semibold text-foreground">{datasetName}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="use-case">Use Case *</Label>
                <Select value={useCase} onValueChange={setUseCase} required>
                  <SelectTrigger id="use-case">
                    <SelectValue placeholder="Select your use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Quantitative Research</SelectItem>
                    <SelectItem value="portfolio">Portfolio Management</SelectItem>
                    <SelectItem value="risk">Risk Analytics</SelectItem>
                    <SelectItem value="trading">Algorithmic Trading</SelectItem>
                    <SelectItem value="valuation">Valuation & Pricing</SelectItem>
                    <SelectItem value="reporting">Reporting & Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Business Justification *</Label>
                <Textarea
                  id="justification"
                  placeholder="Please describe how you plan to use this dataset and why access is needed..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">Minimum 50 characters required</p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="text-sm font-semibold mb-2">Access Request Process</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">1.</span>
                    <span>Your request will be reviewed by the Data Governance team</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">2.</span>
                    <span>Typical review time is 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">3.</span>
                    <span>You'll receive an email notification once approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">4.</span>
                    <span>Access will be granted automatically upon approval</span>
                  </li>
                </ul>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!useCase || justification.length < 50}>
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-center">Request Submitted Successfully</DialogTitle>
              <DialogDescription className="text-center">
                Your access request for <span className="font-semibold text-foreground">{datasetName}</span> has been
                submitted for review.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="text-sm font-semibold mb-3">What happens next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>You'll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Track your request status in the Requests page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Expect a decision within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Access will be automatically provisioned upon approval</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Request ID:{" "}
                <span className="font-mono font-semibold text-foreground">
                  REQ-2025-{Math.floor(Math.random() * 10000)}
                </span>
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
