// Notification service for sending emails and SMS

type NotificationOptions = {
  to: string
  subject?: string
  body: string
  type: "email" | "sms"
}

export async function sendNotification(options: NotificationOptions): Promise<boolean> {
  // This is a mock implementation
  // In a real application, you would integrate with email and SMS services

  console.log(`Sending ${options.type} notification to ${options.to}`)
  console.log(`Subject: ${options.subject || "No subject"}`)
  console.log(`Body: ${options.body}`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return true
}

export async function sendComplaintStatusUpdate(
  userEmail: string,
  userName: string,
  complaintId: string,
  status: string,
  notes?: string,
): Promise<boolean> {
  const subject = `Complaint Status Update - ${complaintId}`
  const body = `
    Dear ${userName},
    
    Your complaint (ID: ${complaintId}) has been updated to status: ${status.toUpperCase()}.
    
    ${notes ? `Additional notes: ${notes}` : ""}
    
    You can track the status of your complaint in the SMS portal.
    
    Thank you,
    Slum Management System
  `

  return sendNotification({
    to: userEmail,
    subject,
    body,
    type: "email",
  })
}

export async function sendNewComplaintNotification(
  authorityEmail: string,
  authorityName: string,
  complaintId: string,
  complaintTitle: string,
  priority: string,
): Promise<boolean> {
  const subject = `New Complaint Assigned - ${complaintId}`
  const body = `
    Dear ${authorityName},
    
    A new complaint has been assigned to your department:
    
    ID: ${complaintId}
    Title: ${complaintTitle}
    Priority: ${priority.toUpperCase()}
    
    Please login to the SMS portal to view the details and take appropriate action.
    
    Thank you,
    Slum Management System
  `

  return sendNotification({
    to: authorityEmail,
    subject,
    body,
    type: "email",
  })
}

export async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  const body = `Your SMS verification code is: ${otp}. This code will expire in 10 minutes.`

  return sendNotification({
    to: phoneNumber,
    body,
    type: "sms",
  })
}

