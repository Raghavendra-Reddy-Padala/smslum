import { type NextRequest, NextResponse } from "next/server"
import { sendOTP, verifyOTP } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate phone number
    if (!data.phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Send OTP
    const success = await sendOTP(data.phoneNumber)

    if (!success) {
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.phoneNumber || !data.otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 })
    }

    // Verify OTP
    const success = await verifyOTP(data.phoneNumber, data.otp)

    if (!success) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}

