"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ClipboardList, Home, LogOut, PieChart, Settings, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"
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
  assignedTo?: string
}

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin" | "authority"
  department?: string
  registeredOn: string
  complaintsSubmitted: number
}

type Authority = {
  id: string
  name: string
  department: string
  email: string
  phone: string
  assignedComplaints: number
  resolvedComplaints: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [authorities, setAuthorities] = useState<Authority[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaintResponse, setComplaintResponse] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedAuthority, setSelectedAuthority] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

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
          assignedTo: "auth1",
        },
        {
          id: "CM12347",
          title: "Garbage Collection Issue",
          description: "Garbage has not been collected from Block D for the last 3 days.",
          category: "waste",
          location: "Block D",
          status: "resolved",
          priority: "high",
          date: "2023-03-05",
          userId: "user3",
          assignedTo: "auth2",
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
          assignedTo: "auth3",
        },
        {
          id: "CM12349",
          title: "Pothole on Main Road",
          description: "Large pothole on the main road causing accidents.",
          category: "road",
          location: "Main Road, Junction",
          status: "pending",
          priority: "medium",
          date: "2023-03-14",
          userId: "user4",
        },
        {
          id: "CM12350",
          title: "Broken Community Tap",
          description: "The community water tap is broken and water is being wasted.",
          category: "water",
          location: "Community Center",
          status: "rejected",
          priority: "low",
          date: "2023-03-08",
          userId: "user2",
        },
      ])

      setUsers([
        {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          role: "user",
          registeredOn: "2023-01-15",
          complaintsSubmitted: 2,
        },
        {
          id: "user2",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1234567891",
          role: "user",
          registeredOn: "2023-01-20",
          complaintsSubmitted: 2,
        },
        {
          id: "user3",
          name: "Robert Johnson",
          email: "robert@example.com",
          phone: "+1234567892",
          role: "user",
          registeredOn: "2023-02-05",
          complaintsSubmitted: 1,
        },
        {
          id: "user4",
          name: "Emily Davis",
          email: "emily@example.com",
          phone: "+1234567893",
          role: "user",
          registeredOn: "2023-02-10",
          complaintsSubmitted: 1,
        },
        {
          id: "admin1",
          name: "Admin User",
          email: "admin@example.com",
          phone: "+1234567894",
          role: "admin",
          registeredOn: "2023-01-01",
          complaintsSubmitted: 0,
        },
      ])

      setAuthorities([
        {
          id: "auth1",
          name: "Water Department",
          department: "Water Supply",
          email: "water@example.com",
          phone: "+1234567895",
          assignedComplaints: 1,
          resolvedComplaints: 0,
        },
        {
          id: "auth2",
          name: "Waste Management",
          department: "Sanitation",
          email: "waste@example.com",
          phone: "+1234567896",
          assignedComplaints: 1,
          resolvedComplaints: 1,
        },
        {
          id: "auth3",
          name: "Electricity Department",
          department: "Electricity",
          email: "electricity@example.com",
          phone: "+1234567897",
          assignedComplaints: 1,
          resolvedComplaints: 0,
        },
        {
          id: "auth4",
          name: "Road Maintenance",
          department: "Infrastructure",
          email: "roads@example.com",
          phone: "+1234567898",
          assignedComplaints: 0,
          resolvedComplaints: 0,
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
              assignedTo: selectedAuthority || complaint.assignedTo,
            }
          }
          return complaint
        }),
      )

      setSelectedComplaint(null)
      setComplaintResponse("")
      setSelectedStatus("")
      setSelectedAuthority("")
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

  // Analytics data
  const statusData = [
    { name: "Pending", value: complaints.filter((c) => c.status === "pending").length },
    { name: "Processing", value: complaints.filter((c) => c.status === "processing").length },
    { name: "Resolved", value: complaints.filter((c) => c.status === "resolved").length },
    { name: "Rejected", value: complaints.filter((c) => c.status === "rejected").length },
  ]

  const priorityData = [
    { name: "High", value: complaints.filter((c) => c.priority === "high").length },
    { name: "Medium", value: complaints.filter((c) => c.priority === "medium").length },
    { name: "Low", value: complaints.filter((c) => c.priority === "low").length },
  ]

  const categoryData = [
    { name: "Water", value: complaints.filter((c) => c.category === "water").length },
    { name: "Electricity", value: complaints.filter((c) => c.category === "electricity").length },
    { name: "Waste", value: complaints.filter((c) => c.category === "waste").length },
    { name: "Sanitation", value: complaints.filter((c) => c.category === "sanitation").length },
    { name: "Road", value: complaints.filter((c) => c.category === "road").length },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

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
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
              Complaints
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-5 w-5" />
              Users
            </Button>
            <Button
              variant={activeTab === "authorities" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("authorities")}
            >
              <Users className="h-5 w-5" />
              Authorities
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveTab("analytics")}
            >
              <PieChart className="h-5 w-5" />
              Analytics
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
                {activeTab === "dashboard" && "Admin Dashboard"}
                {activeTab === "complaints" && "Complaint Management"}
                {activeTab === "users" && "User Management"}
                {activeTab === "authorities" && "Authority Management"}
                {activeTab === "analytics" && "Analytics & Reports"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>A</AvatarFallback>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        <div className="text-3xl font-bold">
                          {complaints.filter((c) => c.status === "pending").length}
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
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{users.length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Complaint Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Complaints by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              width={500}
                              height={300}
                              data={categoryData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" fill="#8884d8" name="Number of Complaints" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {complaints.slice(0, 5).map((complaint) => (
                            <TableRow key={complaint.id}>
                              <TableCell className="font-medium">{complaint.id}</TableCell>
                              <TableCell>{complaint.title}</TableCell>
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
                                    <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Complaint Details</DialogTitle>
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
                                          <Label className="font-medium">Status</Label>
                                          <Badge className={statusColors[complaint.status]}>
                                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                          </Badge>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Priority</Label>
                                          <Badge className={priorityColors[complaint.priority]}>
                                            {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                                          </Badge>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Assigned To</Label>
                                          <p>
                                            {complaint.assignedTo
                                              ? authorities.find((a) => a.id === complaint.assignedTo)?.name ||
                                                complaint.assignedTo
                                              : "Not Assigned"}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="font-medium">Description</Label>
                                        <p className="mt-1">{complaint.description}</p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("complaints")}>
                        View All Complaints
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
                      <CardTitle>Complaint Management</CardTitle>
                      <CardDescription>View, assign, and update the status of complaints</CardDescription>
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
                                          setSelectedAuthority(complaint.assignedTo || "")
                                        }}
                                      >
                                        Manage
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader>
                                        <DialogTitle>Manage Complaint</DialogTitle>
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
                                            <Label className="font-medium">User</Label>
                                            <p>
                                              {users.find((u) => u.id === complaint.userId)?.name || complaint.userId}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Description</Label>
                                          <p className="mt-1">{complaint.description}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <Label htmlFor="authority">Assign to Authority</Label>
                                            <Select value={selectedAuthority} onValueChange={setSelectedAuthority}>
                                              <SelectTrigger id="authority">
                                                <SelectValue placeholder="Select authority" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="not_assigned">Not Assigned</SelectItem>
                                                {authorities.map((authority) => (
                                                  <SelectItem key={authority.id} value={authority.id}>
                                                    {authority.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
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
                                            "Update Complaint"
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

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage user accounts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline">Add New User</Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Registered On</TableHead>
                            <TableHead>Complaints</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users
                            .filter(
                              (user) =>
                                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchQuery.toLowerCase()),
                            )
                            .map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>{user.registeredOn}</TableCell>
                                <TableCell>{user.complaintsSubmitted}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Authorities Tab */}
              {activeTab === "authorities" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Authority Management</CardTitle>
                      <CardDescription>
                        Manage departments and authorities responsible for resolving complaints
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search by name or department..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline">Add New Authority</Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Assigned</TableHead>
                            <TableHead>Resolved</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {authorities
                            .filter(
                              (authority) =>
                                authority.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                authority.department.toLowerCase().includes(searchQuery.toLowerCase()),
                            )
                            .map((authority) => (
                              <TableRow key={authority.id}>
                                <TableCell className="font-medium">{authority.name}</TableCell>
                                <TableCell>{authority.department}</TableCell>
                                <TableCell>{authority.email}</TableCell>
                                <TableCell>{authority.phone}</TableCell>
                                <TableCell>{authority.assignedComplaints}</TableCell>
                                <TableCell>{authority.resolvedComplaints}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Complaint Status Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Complaint Priority Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={priorityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {priorityData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Complaints by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            width={500}
                            height={300}
                            data={categoryData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Number of Complaints" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resolution Time Analysis</CardTitle>
                      <CardDescription>Average time taken to resolve complaints by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            width={500}
                            height={300}
                            data={[
                              { name: "Water", days: 3.5 },
                              { name: "Electricity", days: 2.8 },
                              { name: "Waste", days: 1.5 },
                              { name: "Sanitation", days: 4.2 },
                              { name: "Road", days: 5.7 },
                            ]}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="days" fill="#82ca9d" name="Average Days to Resolve" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                      <CardDescription>Configure system-wide settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="systemName">System Name</Label>
                        <Input id="systemName" defaultValue="Slum Management System" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminEmail">Admin Email</Label>
                        <Input id="adminEmail" type="email" defaultValue="admin@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notificationEmail">Notification Email</Label>
                        <Input id="notificationEmail" type="email" defaultValue="notifications@example.com" />
                      </div>
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
                            Send email notifications for new complaints
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
                            Send SMS notifications for status updates
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save Settings</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Configuration</CardTitle>
                      <CardDescription>Configure AI-related settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>AI Priority Scoring</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="aiPriorityScoring"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="aiPriorityScoring" className="font-normal">
                            Enable AI-based priority scoring for complaints
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>AI Chatbot</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="aiChatbot"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="aiChatbot" className="font-normal">
                            Enable AI chatbot for user assistance
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Automated Assignment</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="automatedAssignment"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                          <Label htmlFor="automatedAssignment" className="font-normal">
                            Enable automated assignment of complaints to authorities
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save AI Settings</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

