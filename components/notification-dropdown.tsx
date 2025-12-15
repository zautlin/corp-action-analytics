"use client"

import { useState } from "react"
import { Bell, Check, X, Clock, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: "approval" | "request" | "rejection"
  title: string
  message: string
  timestamp: string
  read: boolean
  datasetName?: string
  requestId?: string
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "approval",
      title: "Access Approved",
      message: "Your access request for US Equity Market Data has been approved",
      timestamp: "2 hours ago",
      read: false,
      datasetName: "US Equity Market Data",
      requestId: "REQ-2024-001",
    },
    {
      id: "2",
      type: "request",
      title: "New Access Request",
      message: "John Smith requested access to Fixed Income Corporate Bonds",
      timestamp: "5 hours ago",
      read: false,
      datasetName: "Fixed Income Corporate Bonds",
      requestId: "REQ-2024-002",
    },
    {
      id: "3",
      type: "approval",
      title: "Access Approved",
      message: "Your access request for Crypto Market Data has been approved",
      timestamp: "1 day ago",
      read: true,
      datasetName: "Crypto Market Data",
      requestId: "REQ-2024-003",
    },
    {
      id: "4",
      type: "rejection",
      title: "Access Denied",
      message: "Your access request for Alternative Data - Social Sentiment was denied",
      timestamp: "2 days ago",
      read: true,
      datasetName: "Alternative Data - Social Sentiment",
      requestId: "REQ-2024-004",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "approval":
        return <Check className="h-4 w-4 text-green-600" />
      case "rejection":
        return <X className="h-4 w-4 text-destructive" />
      case "request":
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      {notification.datasetName && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <FileCheck className="h-3 w-3 mr-1" />
                            {notification.datasetName}
                          </Badge>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
