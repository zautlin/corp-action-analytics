"use client"

import { User, Settings, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { getCurrentUser, logout, canAccessAnalytics, canAccessAdminPortal, isSteward } from "@/lib/auth"
import { useEffect, useState } from "react"

export function CatalogHeader() {
  const [user, setUser] = useState(getCurrentUser())

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }, [user])

  if (!user) return null

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <span className="text-sm font-bold text-primary-foreground">DH</span>
              </div>
              <span className="text-lg font-semibold text-foreground">DataHex</span>
            </div>

            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Library
              </a>
              <a
                href="/instruments"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Instruments
              </a>
              <a
                href="/corp-actions"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Corporate Actions
              </a>
              <a
                href="/my-datasets"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Datasets
              </a>
              <a
                href="/requests"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Requests
              </a>
              {user && isSteward(user) && (
                <a
                  href="/manage"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage
                </a>
              )}
              {canAccessAnalytics(user) && (
                <a
                  href="/analytics"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </a>
              )}
              {canAccessAdminPortal(user) && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin
                </a>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-primary mt-1">{user.roleLabel}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {canAccessAdminPortal(user) && (
                  <DropdownMenuItem asChild>
                    <a href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Portal</span>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
