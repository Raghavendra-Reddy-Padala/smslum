"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, MessageSquare, Search, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import Chatbot from "@/components/chatbot"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Complaint = {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: "pending" | "processing" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  date: string
  updates: {
    date: string
    status: string
    description: string
  }[]
}

export default function TrackStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [complaintId, setComplaintId] = useState(searchParams.get("id") || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([])

  // Mock data for demonstration
  const mockComplaints: Complaint[] = [
    {
      id: "CM12345",
      title: "Water Leakage",
      description: "There is a water leakage in the main pipeline near Block C.",
      category: "water",
      location: "Block C, Main Road",
      status: "processing",
      priority: "high",
      date: "2023-03-15",
      updates: [
        {
          date: "2023-03-15",
          status: "pending",
          description: "Complaint registered",
        },
        {
          date: "2023-03-16",
          status: "processing",
          description: "Assigned to Water Department",
        },
        {
          date: "2023-03-17",
          status: "processing",
          description: "Technician scheduled to visit on 2023-03-18",
        },
      ],
    },
    {
      id: "CM12346",
      title: "Street Light Not Working",
      description: "The street light at the entrance of Block A is not working for the past week.",
      category: "electricity",
      location: "Block A, Entrance",
      status: "pending",
      priority: "medium",
      date: "2023-03-10",
      updates: [
        {
          date: "2023-03-10",
          status: "pending",
          description: "Complaint registered",
        },
      ],
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
      updates: [
        {
          date: "2023-03-05",
          status: "pending",
          description: "Complaint registered",
        },
        {
          date: "2023-03-06",
          status: "processing",
          description: "Assigned to Waste Management Department",
        },
        {
          date: "2023-03-07",
          status: "processing",
          description: "Cleanup scheduled for 2023-03-08",
        },
        {
          date: "2023-03-08",
          status: "resolved",
          description: "Garbage collected and area cleaned",
        },
      ],
    },
  ]

  useEffect(() => {
    setAllComplaints(mockComplaints)

    // If complaint ID is provided in URL, search for it
    if (searchParams.get("id")) {
      setComplaintId(searchParams.get("id") || "")
      handleSearch()
    }
  }, [searchParams])

  const handleSearch = () => {
    if (!complaintId.trim()) {
      setError("Please enter a complaint ID")
      return
    }

    setIsLoading(true)
    setError("")
    setComplaint(null)

    // Simulate API call
    setTimeout(() => {
      const found = mockComplaints.find((c) => c.id === complaintId)

      if (found) {
        setComplaint(found)
      } else {
        setError("No complaint found with the provided ID")
      }

      setIsLoading(false)
    }, 1500)
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <Loader2 className="h-5 w-5" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg mb-6">
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Track Complaint Status</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="text-primary"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription>Enter your complaint ID to track its current status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="complaintId" className="sr-only">
                    Complaint ID
                  </Label>
                  <Input
                    id="complaintId"
                    placeholder="Enter Complaint ID (e.g., CM12345)"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Track
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {complaint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{complaint.title}</CardTitle>
                      <CardDescription>
                        ID: {complaint.id} • Submitted on {complaint.date}
                      </CardDescription>
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
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">Description</h3>
                      <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold mb-1">Category</h3>
                        <p className="text-sm text-muted-foreground capitalize">{complaint.category}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-sm text-muted-foreground">{complaint.location}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Status Timeline</h3>
                    <div className="relative border-l-2 border-muted pl-6 space-y-6">
                      {complaint.updates.map((update, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-muted">
                            {getStatusIcon(update.status)}
                          </div>
                          <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                              <h4 className="font-medium capitalize">{update.status}</h4>
                              <span className="text-sm text-muted-foreground">{update.date}</span>
                            </div>
                            <p className="text-sm mt-1">{update.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!complaint && !error && (
            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Complaints</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ComplaintsList
                  complaints={allComplaints}
                  statusColors={statusColors}
                  priorityColors={priorityColors}
                  onSelect={(id) => {
                    setComplaintId(id)
                    handleSearch()
                  }}
                />
              </TabsContent>

              <TabsContent value="pending">
                <ComplaintsList
                  complaints={allComplaints.filter((c) => c.status === "pending")}
                  statusColors={statusColors}
                  priorityColors={priorityColors}
                  onSelect={(id) => {
                    setComplaintId(id)
                    handleSearch()
                  }}
                />
              </TabsContent>

              <TabsContent value="processing">
                <ComplaintsList
                  complaints={allComplaints.filter((c) => c.status === "processing")}
                  statusColors={statusColors}
                  priorityColors={priorityColors}
                  onSelect={(id) => {
                    setComplaintId(id)
                    handleSearch()
                  }}
                />
              </TabsContent>

              <TabsContent value="resolved">
                <ComplaintsList
                  complaints={allComplaints.filter((c) => c.status === "resolved")}
                  statusColors={statusColors}
                  priorityColors={priorityColors}
                  onSelect={(id) => {
                    setComplaintId(id)
                    handleSearch()
                  }}
                />
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>

      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
        >
          <Chatbot onClose={() => setShowChatbot(false)} />
        </motion.div>
      )}
    </div>
  )
}

type ComplaintsListProps = {
  complaints: Complaint[]
  statusColors: Record<string, string>
  priorityColors: Record<string, string>
  onSelect: (id: string) => void
}

function ComplaintsList({ complaints, statusColors, priorityColors, onSelect }: ComplaintsListProps) {
  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No complaints found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card
          key={complaint.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelect(complaint.id)}
        >
          <CardContent className="p-4">
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
              <Button variant="link" size="sm" className="h-auto p-0">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

