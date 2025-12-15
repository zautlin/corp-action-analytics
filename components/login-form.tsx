"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setCurrentUser } from "@/lib/auth"
import { User, Shield, Database } from "lucide-react"

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<"consumer" | "steward" | "admin" | null>(null)

  const handleLogin = (role: "consumer" | "steward" | "admin") => {
    setCurrentUser(role)
    window.location.href = "/"
  }

  const roles = [
    {
      type: "consumer" as const,
      icon: User,
      title: "Data Consumer",
      description: "General user access to browse and request datasets",
      color: "bg-blue-500",
    },
    {
      type: "steward" as const,
      icon: Database,
      title: "Data Steward",
      description: "Manage owned datasets, approve requests, view analytics",
      color: "bg-purple-500",
    },
    {
      type: "admin" as const,
      icon: Shield,
      title: "Administrator",
      description: "Full platform access with complete visibility and control",
      color: "bg-red-500",
    },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
            <span className="text-base font-bold text-primary-foreground">DH</span>
          </div>
          <span className="text-xl font-semibold text-foreground">DataHex</span>
        </div>
        <CardTitle className="text-2xl text-center">Welcome to Data Library</CardTitle>
        <CardDescription className="text-center">Select your profile to access the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.type}
                onClick={() => handleLogin(role.type)}
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-border hover:border-primary transition-all hover:shadow-md text-left group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${role.color} shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This is a demo environment. Select any profile to explore the platform.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
