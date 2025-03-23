"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ClipboardList, Home, LogOut, MessageSquare, Settings, User } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import EnhancedChatbot from "@/components/enhanced-chatbot"

type Complaint = {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: "pending" | "processing" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  date: string
  userId: string
}

export default function AuthorityDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaintResponse, setComplaintResponse] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComplaints([
        {
          id: "CM12345",
          title: "Water Leakage",
          description: "There is a water leakage in the main pipeline near Block C.",
          category: "water",
          location: "Block C, Main Road",
          status: "pending",
          priority: "high",
          date: "2023-03-15",
          userId: "user1",
        },
        {
          id: "CM12346",
          title: "Street Light Not Working",
          description: "The street light at the entrance of Block A is not working for the past week.",
          category: "electricity",
          location: "Block A, Entrance",
          status: "processing",
          priority: "medium",
          date: "2023-03-10",
          userId: "user2",
        },
        {
          id: "CM12348",
          title: "Broken Sewage Pipe",
          description: "Sewage pipe is broken and causing foul smell in the area.",
          category: "sanitation",
          location: "Block B, Near Park",
          status: "processing",
          priority: "high",
          date: "2023-03-12",
          userId: "user1",
        },
      ])

      setIsLoading(false)
    }, 1500)
  }, [])

  const handleUpdateComplaint = () => {
    if (!selectedComplaint) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setComplaints(
        complaints.map((complaint) => {
          if (complaint.id === selectedComplaint.id) {
            return {
              ...complaint,
              status: (selectedStatus as any) || complaint.status,
            }
          }
          return complaint
        }),
      )

      setSelectedComplaint(null)
      setComplaintResponse("")
      setSelectedStatus("")
      setIsLoading(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 bg-white dark:bg-slate-800 p-4 md:h-screen md:fixed left-0 top-0 border-r">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              SMS
            </div>
            <h1 className="text-xl font-bold">Authority Dashboard</h1>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "complaints" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("complaints")}
            >
              <ClipboardList className="h-5 w-5" />
              Assigned Complaints
            </Button>
            <Button
              variant={activeTab === "resolved" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("resolved")}
            >
              <CheckCircle2 className="h-5 w-5" />
              Resolved Complaints
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setShowChatbot(!showChatbot)}>
              <MessageSquare className="h-5 w-5" />
              AI Assistant
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5 w-5" />
              Profile
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-auto"
              onClick={() => router.push("/")}
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
                {activeTab === "dashboard" && "Authority Dashboard"}
                {activeTab === "complaints" && "Assigned Complaints"}
                {activeTab === "resolved" && "Resolved Complaints"}
                {activeTab === "profile" && "Profile"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-muted-foreground">Welcome back, Water Department</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>WD</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {showSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>The complaint has been updated successfully.</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Complaints</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{complaints.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Resolution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {complaints.filter((c) => c.status === "pending" || c.status === "processing").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Complaints</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {complaints.filter((c) => c.status === "resolved").length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>High Priority Complaints</CardTitle>
                      <CardDescription>Complaints that require immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {complaints
                            .filter((c) => c.priority === "high")
                            .map((complaint) => (
                              <TableRow key={complaint.id}>
                                <TableCell className="font-medium">{complaint.id}</TableCell>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>
                                  <Badge className={statusColors[complaint.status]}>
                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{complaint.date}</TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedComplaint(complaint)
                                          setSelectedStatus(complaint.status)
                                        }}
                                      >
                                        Update
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader>
                                        <DialogTitle>Update Complaint Status</DialogTitle>
                                        <DialogDescription>
                                          ID: {complaint.id} • Submitted on {complaint.date}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label className="font-medium">Title</Label>
                                            <p>{complaint.title}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Category</Label>
                                            <p className="capitalize">{complaint.category}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Location</Label>
                                            <p>{complaint.location}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Priority</Label>
                                            <Badge className={priorityColors[complaint.priority]}>
                                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Description</Label>
                                          <p className="mt-1">{complaint.description}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="status">Update Status</Label>
                                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger id="status">
                                              <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="processing">Processing</SelectItem>
                                              <SelectItem value="resolved">Resolved</SelectItem>
                                              <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="response">Response/Notes</Label>
                                          <Textarea
                                            id="response"
                                            placeholder="Add a response or notes about this complaint"
                                            value={complaintResponse}
                                            onChange={(e) => setComplaintResponse(e.target.value)}
                                            rows={4}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                                          Cancel
                                        </Button>
                                        <Button onClick={handleUpdateComplaint} disabled={isLoading}>
                                          {isLoading ? (
                                            <>
                                              <div className="h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                                              Updating...
                                            </>
                                          ) : (
                                            "Update Status"
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          {complaints.filter((c) => c.priority === "high").length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No high priority complaints at the moment
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("complaints")}>
                        View All Assigned Complaints
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Complaints Tab */}
              {activeTab === "complaints" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Complaints</CardTitle>
                      <CardDescription>
                        View and update the status of complaints assigned to your department
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search by ID or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Priorities</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredComplaints.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                                No complaints found matching your filters
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredComplaints.map((complaint) => (
                              <TableRow key={complaint.id}>
                                <TableCell className="font-medium">{complaint.id}</TableCell>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell className="capitalize">{complaint.category}</TableCell>
                                <TableCell>
                                  <Badge className={statusColors[complaint.status]}>
                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={priorityColors[complaint.priority]}>
                                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{complaint.date}</TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedComplaint(complaint)
                                          setSelectedStatus(complaint.status)
                                        }}
                                      >
                                        Update
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader>
                                        <DialogTitle>Update Complaint Status</DialogTitle>
                                        <DialogDescription>
                                          ID: {complaint.id} • Submitted on {complaint.date}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label className="font-medium">Title</Label>
                                            <p>{complaint.title}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Category</Label>
                                            <p className="capitalize">{complaint.category}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Location</Label>
                                            <p>{complaint.location}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Priority</Label>
                                            <Badge className={priorityColors[complaint.priority]}>
                                              {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Description</Label>
                                          <p className="mt-1">{complaint.description}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="status">Update Status</Label>
                                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger id="status">
                                              <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="processing">Processing</SelectItem>
                                              <SelectItem value="resolved">Resolved</SelectItem>
                                              <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="response">Response/Notes</Label>
                                          <Textarea
                                            id="response"
                                            placeholder="Add a response or notes about this complaint"
                                            value={complaintResponse}
                                            onChange={(e) => setComplaintResponse(e.target.value)}
                                            rows={4}
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                                          Cancel
                                        </Button>
                                        <Button onClick={handleUpdateComplaint} disabled={isLoading}>
                                          {isLoading ? (
                                            <>
                                              <div className="h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                                              Updating...
                                            </>
                                          ) : (
                                            "Update Status"
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Authority Profile</CardTitle>
                      <CardDescription>View and update your department profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 flex flex-col items-center">
                          <Avatar className="h-32 w-32">
                            <AvatarImage src="/placeholder.svg?height=128&width=128" />
                            <AvatarFallback className="text-2xl">WD</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" className="mt-4">
                            Change Avatar
                          </Button>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Department Name</Label>
                            <Input id="name" defaultValue="Water Department" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="water@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" defaultValue="+1234567895" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Department Description</Label>
                            <Textarea
                              id="description"
                              defaultValue="Responsible for water supply and maintenance of water infrastructure in the community."
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Configure how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="emailNotifications" className="font-normal">
                            Receive email notifications for new complaints
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>SMS Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="smsNotifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="smsNotifications" className="font-normal">
                            Receive SMS notifications for high priority complaints
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>In-App Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="inAppNotifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="inAppNotifications" className="font-normal">
                            Receive in-app notifications for all complaint updates
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Notification Settings</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="Enter your current password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Change Password</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
        >
          <EnhancedChatbot onClose={() => setShowChatbot(false)} userName="Water Department" userRole="authority" 
          currentScreen="Authority"
            />
        </motion.div>
      )}
    </div>
  )
}

