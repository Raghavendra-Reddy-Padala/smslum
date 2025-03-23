"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  title: string
  description: string
  date: string
  read: boolean
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Mock notifications - in a real app, this would fetch from your API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Complaint Status Updated",
        description: "Your complaint #CM12345 has been processed and is now being reviewed.",
        date: "2 hours ago",
        read: false,
      },
      {
        id: "2",
        title: "New Announcement",
        description: "Community meeting scheduled for next Sunday at 10 AM.",
        date: "1 day ago",
        read: false,
      },
      {
        id: "3",
        title: "Maintenance Notice",
        description: "Water supply will be interrupted on Friday from 10 AM to 2 PM for maintenance.",
        date: "2 days ago",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.date}</span>
                </div>
                <p className="text-sm mt-1">{notification.description}</p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <Button variant="ghost" className="w-full" size="sm">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

