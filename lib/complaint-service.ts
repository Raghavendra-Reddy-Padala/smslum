// Service for handling complaint operations

import { scorePriority } from "./ai-priority"
import { sendComplaintStatusUpdate, sendNewComplaintNotification } from "./notification-service"

type ComplaintData = {
  title: string
  description: string
  category: string
  location: string
  userId: string
  attachments?: File[]
}

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

// Mock database of authorities by department
const authoritiesByDepartment = {
  water: "auth1",
  electricity: "auth3",
  waste: "auth2",
  sanitation: "auth2",
  road: "auth4",
  housing: "auth1",
  other: "auth1",
}

// Mock user data for notifications
const mockUsers = {
  user1: { email: "john@example.com", name: "John Doe" },
  user2: { email: "jane@example.com", name: "Jane Smith" },
  user3: { email: "robert@example.com", name: "Robert Johnson" },
  user4: { email: "emily@example.com", name: "Emily Davis" },
}

// Mock authority data for notifications
const mockAuthorities = {
  auth1: { email: "water@example.com", name: "Water Department" },
  auth2: { email: "waste@example.com", name: "Waste Management" },
  auth3: { email: "electricity@example.com", name: "Electricity Department" },
  auth4: { email: "roads@example.com", name: "Road Maintenance" },
}

export async function submitComplaint(data: ComplaintData): Promise<Complaint> {
  try {
    // Generate a unique ID
    const complaintId = "CM" + Math.floor(10000 + Math.random() * 90000)

    // Use AI to determine priority
    const priorityResult = await scorePriority(data)

    // Determine which authority to assign based on category
    const assignedTo = authoritiesByDepartment[data.category as keyof typeof authoritiesByDepartment] || "auth1"

    // Create the complaint object
    const complaint: Complaint = {
      id: complaintId,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      status: "pending",
      priority: priorityResult.priority,
      date: new Date().toISOString().split("T")[0],
      userId: data.userId,
      assignedTo,
      updates: [
        {
          date: new Date().toISOString().split("T")[0],
          status: "pending",
          description: "Complaint registered",
        },
      ],
    }

    // In a real application, you would save this to Firestore
    console.log("Complaint submitted:", complaint)

    // Send notifications
    const authority = mockAuthorities[assignedTo as keyof typeof mockAuthorities]
    if (authority) {
      await sendNewComplaintNotification(
        authority.email,
        authority.name,
        complaintId,
        data.title,
        priorityResult.priority,
      )
    }

    return complaint
  } catch (error) {
    console.error("Error submitting complaint:", error)
    throw new Error("Failed to submit complaint")
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  newStatus: "pending" | "processing" | "resolved" | "rejected",
  notes: string,
  assignedTo?: string,
): Promise<Complaint> {
  try {
    // In a real application, you would update this in Firestore
    console.log(`Updating complaint ${complaintId} to status ${newStatus}`)

    // Mock updated complaint
    const updatedComplaint: Complaint = {
      id: complaintId,
      title: "Mock Complaint",
      description: "This is a mock complaint for demonstration",
      category: "water",
      location: "Block A",
      status: newStatus,
      priority: "high",
      date: "2023-03-15",
      userId: "user1",
      assignedTo: assignedTo,
      updates: [
        {
          date: "2023-03-15",
          status: "pending",
          description: "Complaint registered",
        },
        {
          date: new Date().toISOString().split("T")[0],
          status: newStatus,
          description: notes || `Status updated to ${newStatus}`,
        },
      ],
    }

    // Send notification to user
    const user = mockUsers["user1"]
    if (user) {
      await sendComplaintStatusUpdate(user.email, user.name, complaintId, newStatus, notes)
    }

    return updatedComplaint
  } catch (error) {
    console.error("Error updating complaint status:", error)
    throw new Error("Failed to update complaint status")
  }
}

export async function getComplaintById(complaintId: string): Promise<Complaint | null> {
  try {
    // In a real application, you would fetch this from Firestore
    console.log(`Fetching complaint ${complaintId}`)

    // Mock complaint data
    const complaint: Complaint = {
      id: complaintId,
      title: "Mock Complaint",
      description: "This is a mock complaint for demonstration",
      category: "water",
      location: "Block A",
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
      ],
    }

    return complaint
  } catch (error) {
    console.error("Error fetching complaint:", error)
    return null
  }
}

export async function getUserComplaints(userId: string): Promise<Complaint[]> {
  try {
    // In a real application, you would fetch this from Firestore
    console.log(`Fetching complaints for user ${userId}`)

    // Mock complaint data
    const complaints: Complaint[] = [
      {
        id: "CM12345",
        title: "Water Leakage",
        description: "There is a water leakage in the main pipeline near Block C.",
        category: "water",
        location: "Block C, Main Road",
        status: "processing",
        priority: "high",
        date: "2023-03-15",
        userId: userId,
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
        userId: userId,
        updates: [
          {
            date: "2023-03-10",
            status: "pending",
            description: "Complaint registered",
          },
        ],
      },
    ]

    return complaints
  } catch (error) {
    console.error("Error fetching user complaints:", error)
    return []
  }
}

export async function getAuthorityComplaints(authorityId: string): Promise<Complaint[]> {
  try {
    // In a real application, you would fetch this from Firestore
    console.log(`Fetching complaints for authority ${authorityId}`)

    // Mock complaint data
    const complaints: Complaint[] = [
      {
        id: "CM12345",
        title: "Water Leakage",
        description: "There is a water leakage in the main pipeline near Block C.",
        category: "water",
        location: "Block C, Main Road",
        status: "processing",
        priority: "high",
        date: "2023-03-15",
        userId: "user1",
        assignedTo: authorityId,
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
        ],
      },
    ]

    return complaints
  } catch (error) {
    console.error("Error fetching authority complaints:", error)
    return []
  }
}

