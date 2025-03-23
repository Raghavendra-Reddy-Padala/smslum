"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Home, LogOut, MessageSquare, PlusCircle, Settings, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import EnhancedChatbot from "@/components/enhanced-chatbot"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { LanguageSelector } from "@/components/language-selector"

type Complaint = {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  date: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showChatbot, setShowChatbot] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState("dashboard")

  useEffect(() => {
    // Fetch complaints
    const fetchComplaints = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockComplaints: Complaint[] = [
          {
            id: "CM12345",
            title: "Water Leakage",
            description: "There is a water leakage in the main pipeline near Block C.",
            status: "processing",
            priority: "high",
            date: "2023-03-15",
          },
          {
            id: "CM12346",
            title: "Street Light Not Working",
            description: "The street light at the entrance of Block A is not working for the past week.",
            status: "pending",
            priority: "medium",
            date: "2023-03-10",
          },
          {
            id: "CM12347",
            title: "Garbage Collection Issue",
            description: "Garbage has not been collected from Block D for the last 3 days.",
            status: "resolved",
            priority: "high",
            date: "2023-03-05",
          },
        ]

        setComplaints(mockComplaints)
      } catch (error) {
        console.error("Error fetching complaints:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }

  const priorityColors = {
    low: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  }

  // Function to handle navigation
  const navigateTo = (page: string) => {
    console.log(`Navigating to: ${page}`)
    // Here we would normally use router.push, but for simulation purposes,
    // we'll just update the current page state
    setCurrentPage(page)
    
    // For real navigation
    switch (page.toLowerCase()) {
      case "dashboard":
        router.push("/dashboard")
        break
      case "submit-complaint":
      case "complaints":
      case "new complaint":
        router.push("/submit-complaint")
        break
      case "track-status":
      case "track status":
      case "my complaints":
        router.push("/track-status")
        break
      case "profile":
      case "my account":
        router.push("/profile")
        break
      case "settings":
      case "preferences":
        router.push("/settings")
        break
      case "login":
        router.push("auth/login")
        break
      case "register":
      case "signup":
        router.push("auth/register")
        break
      default:
        console.log(`Unknown page: ${page}`)
    }
  }

  // Handle actions from chatbot
  const handleChatbotAction = (action: string, data: any) => {
    console.log(`Chatbot action: ${action}`, data)
    
    // Handle different actions
    switch (action) {
      case "navigate":
        navigateTo(data.page)
        break
      case "submitComplaint":
        // Handle complaint submission logic
        console.log("Submitting complaint:", data)
        break
      case "logout":
        logout()
        break
      default:
        console.log(`Unknown action: ${action}`)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-white dark:bg-slate-800 p-4 md:h-screen md:fixed left-0 top-0 border-r">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                SMS
              </div>
              <h1 className="text-xl font-bold">Slum Management</h1>
            </div>

            <div className="flex flex-col gap-1">
              <Link href="/dashboard">
                <Button 
                  variant={currentPage === "dashboard" ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentPage("dashboard")}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/submit-complaint">
                <Button 
                  variant={currentPage === "submit-complaint" ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentPage("submit-complaint")}
                >
                  <PlusCircle className="h-5 w-5" />
                  New Complaint
                </Button>
              </Link>
              <Link href="/dashboard/track-status">
                <Button 
                  variant={currentPage === "track-status" ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentPage("track-status")}
                >
                  <FileText className="h-5 w-5" />
                  Track Status
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => setShowChatbot(!showChatbot)}
              >
                <MessageSquare className="h-5 w-5" />
                AI Assistant
              </Button>
              <Link href="/dashboard/profile">
                <Button 
                  variant={currentPage === "profile" ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentPage("profile")}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button 
                  variant={currentPage === "settings" ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                  onClick={() => setCurrentPage("settings")}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="md:ml-64 flex-1 p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {currentPage === "dashboard" && "Dashboard"}
                  {currentPage === "submit-complaint" && "Submit Complaint"}
                  {currentPage === "track-status" && "Track Status"}
                  {currentPage === "profile" && "Profile"}
                  {currentPage === "settings" && "Settings"}
                </h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <AccessibilityMenu />
                <LanguageSelector />
                <ThemeToggle />
                <NotificationsDropdown />
                <Button variant="outline" className="gap-2" onClick={() => setShowChatbot(!showChatbot)}>
                  <MessageSquare className="h-5 w-5" />
                  AI Assistant
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Render different content based on current page */}
            {currentPage === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{complaints.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Pending Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{complaints.filter((c) => c.status === "pending").length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{complaints.filter((c) => c.status === "resolved").length}</div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="complaints">
                  <TabsList className="mb-4">
                    <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="complaints">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Recent Complaints</CardTitle>
                          <Link href="/dashboard/submit-complaint">
                            <Button 
                              size="sm" 
                              className="gap-2"
                              onClick={() => setCurrentPage("submit-complaint")}
                            >
                              <PlusCircle className="h-4 w-4" />
                              New Complaint
                            </Button>
                          </Link>
                        </div>
                        <CardDescription>View and track your recent complaints</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <div className="flex justify-center py-8">
                            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {complaints.map((complaint) => (
                              <div
                                key={complaint.id}
                                className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold">{complaint.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      ID: {complaint.id} • {complaint.date}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge className={priorityColors[complaint.priority]}>
                                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
                                    </Badge>
                                    <Badge className={statusColors[complaint.status]}>
                                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm">{complaint.description}</p>
                                <div className="mt-2 flex justify-end">
                                  <Link href={`/dashboard/track-status?id=${complaint.id}`}>
                                    <Button 
                                      variant="link" 
                                      size="sm" 
                                      className="h-auto p-0"
                                      onClick={() => setCurrentPage("track-status")}
                                    >
                                      Track Status
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Link href="/dashboard/track-status">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setCurrentPage("track-status")}
                          >
                            View All Complaints
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Notifications</CardTitle>
                          <Button variant="outline" size="sm">
                            Mark all as read
                          </Button>
                        </div>
                        <CardDescription>Stay updated with the latest announcements and updates</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">Complaint Status Updated</h3>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                            <p className="text-sm">Your complaint #CM12345 has been processed and is now being reviewed.</p>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">New Announcement</h3>
                              <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                            <p className="text-sm">Community meeting scheduled for next Sunday at 10 AM.</p>
                          </div>

                          <div className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">Maintenance Notice</h3>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                            <p className="text-sm">
                              Water supply will be interrupted on Friday from 10 AM to 2 PM for maintenance.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* Placeholder for Submit Complaint Page */}
            {currentPage === "submit-complaint" && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit a New Complaint</CardTitle>
                  <CardDescription>Please provide details about your issue</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submit Complaint form will be displayed here</p>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for Track Status Page */}
            {currentPage === "track-status" && (
              <Card>
                <CardHeader>
                  <CardTitle>Track Complaint Status</CardTitle>
                  <CardDescription>Monitor the progress of your complaints</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track Status content will be displayed here</p>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for Profile Page */}
            {currentPage === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Profile content will be displayed here</p>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for Settings Page */}
            {currentPage === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Customize your application preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Settings content will be displayed here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
          >
            <EnhancedChatbot 
              onClose={() => setShowChatbot(false)} 
              userName={user?.name || "User"}
              currentScreen={currentPage}
              userRole="user"
              isLoggedIn={true}
              navigateTo={navigateTo}
              onAction={handleChatbotAction}
            />
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  )
}