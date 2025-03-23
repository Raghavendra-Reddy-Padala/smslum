import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.username || !data.email || !data.phoneNumber || !data.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await registerUser(data.username, data.email, data.phoneNumber, data.password)

    if (!user) {
      return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

