"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, MessageSquare, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import EnhancedChatbot from "@/components/enhanced-chatbot"
import { useRouter, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import { RealTimeChat } from "@/components/real-time-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { ExportButton } from "@/components/export-button"

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
  updates: {
    date: string
    status: string
    description: string
  }[]
}

export default function ComplaintDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    if (!params.id) return

    const fetchComplaint = async () => {
      setIsLoading(true)
      setError("")

      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockComplaint: Complaint = {
          id: params.id as string,
          title: "Water Leakage",
          description: "There is a water leakage in the main pipeline near Block C.",
          category: "water",
          location: "Block C, Main Road",
          status: "processing",
          priority: "high",
          date: "2023-03-15",
          userId: "user1",
          assignedTo: "auth1",
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
        }

        setComplaint(mockComplaint)
      } catch (error) {
        console.error("Error fetching complaint:", error)
        setError("Failed to fetch complaint details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaint()
  }, [params.id])

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

  const handleAddAdditionalFiles = async () => {
    if (additionalFiles.length === 0) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to upload files
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      alert("Files uploaded successfully")

      // Clear files
      setAdditionalFiles([])
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Failed to upload files. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard/track-status")}>
              <ArrowLeft className="h-4 w-4" />
              Back to All Complaints
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground">Loading complaint details...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : complaint ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-lg mb-6">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{complaint.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowChatbot(!showChatbot)}
                          className="text-primary"
                        >
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </div>
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

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="px-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="chat">Communication</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-1">Description</h3>
                          <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-1">Category</h3>
                          <p className="text-sm text-muted-foreground capitalize">{complaint.category}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-1">Location</h3>
                          <p className="text-sm text-muted-foreground">{complaint.location}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-1">Current Status</h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(complaint.status)}
                            <Badge className={statusColors[complaint.status]}>
                              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-1">Assigned To</h3>
                          <p className="text-sm text-muted-foreground">
                            {complaint.assignedTo ? "Water Department" : "Not assigned yet"}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-1">Expected Resolution</h3>
                          <p className="text-sm text-muted-foreground">
                            {complaint.status === "resolved"
                              ? "Resolved on " + new Date().toLocaleDateString()
                              : complaint.status === "rejected"
                                ? "Complaint rejected"
                                : "Within 3-5 working days"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <ExportButton data={[complaint]} filename={`complaint_${complaint.id}`} />
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="p-6 pt-4">
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
                  </TabsContent>

                  <TabsContent value="chat" className="p-0">
                    <div className="h-[500px]">
                      <RealTimeChat
                        complaintId={complaint.id}
                        currentUser={{
                          id: user?.id || "user1",
                          name: user?.name || "User",
                          role: "user",
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="p-6 pt-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Attached Files</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4 flex items-center gap-3">
                            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                              <img
                                src="/placeholder.svg?height=48&width=48"
                                alt="Document preview"
                                className="h-8 w-8"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">leak_photo.jpg</p>
                              <p className="text-xs text-muted-foreground">
                                Image • 2.4 MB • Uploaded on {complaint.date}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Add Additional Files</h3>
                        <FileUpload
                          onFilesSelected={setAdditionalFiles}
                          selectedFiles={additionalFiles}
                          maxFiles={3}
                          maxSizeMB={5}
                          acceptedFileTypes="image/*,application/pdf"
                        />

                        {additionalFiles.length > 0 && (
                          <Button className="mt-4" onClick={handleAddAdditionalFiles} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              "Upload Files"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          ) : null}
        </div>

        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
          >
            <EnhancedChatbot onClose={() => setShowChatbot(false)} userName={user?.name || "User"} />
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  )
}

