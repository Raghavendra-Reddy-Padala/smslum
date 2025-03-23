import { type NextRequest, NextResponse } from "next/server"
import { submitComplaint, updateComplaintStatus, getComplaintById, getUserComplaints } from "@/lib/complaint-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.category || !data.location || !data.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const complaint = await submitComplaint(data)

    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    console.error("Error submitting complaint:", error)
    return NextResponse.json({ error: "Failed to submit complaint" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.complaintId || !data.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const complaint = await updateComplaintStatus(data.complaintId, data.status, data.notes || "", data.assignedTo)

    return NextResponse.json(complaint)
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const complaintId = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (complaintId) {
      const complaint = await getComplaintById(complaintId)

      if (!complaint) {
        return NextResponse.json({ error: "Complaint not found" }, { status: 404 })
      }

      return NextResponse.json(complaint)
    } else if (userId) {
      const complaints = await getUserComplaints(userId)
      return NextResponse.json(complaints)
    } else {
      return NextResponse.json({ error: "Missing complaint ID or user ID" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching complaint:", error)
    return NextResponse.json({ error: "Failed to fetch complaint" }, { status: 500 })
  }
}

