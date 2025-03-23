import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "complaints"
    const format = searchParams.get("format") || "json"

    // Generate report data
    const data = await generateReportData(type)

    // Return data in requested format
    if (format === "csv") {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${type}_report.csv`,
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

async function generateReportData(type: string) {
  // In a real app, this would fetch data from your database
  // Here we're generating mock data

  switch (type) {
    case "complaints":
      return generateComplaintsReport()
    case "users":
      return generateUsersReport()
    case "authorities":
      return generateAuthoritiesReport()
    case "performance":
      return generatePerformanceReport()
    default:
      return generateComplaintsReport()
  }
}

function generateComplaintsReport() {
  const complaints = []

  for (let i = 1; i <= 20; i++) {
    const statuses = ["pending", "processing", "resolved", "rejected"]
    const priorities = ["low", "medium", "high"]
    const categories = ["water", "electricity", "waste", "sanitation", "road"]

    complaints.push({
      id: `CM${10000 + i}`,
      title: `Mock Complaint ${i}`,
      description: `This is a mock complaint for demonstration purposes.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      userId: `user${Math.floor(Math.random() * 5) + 1}`,
    })
  }

  return complaints
}

function generateUsersReport() {
  const users = []

  for (let i = 1; i <= 10; i++) {
    users.push({
      id: `user${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+123456789${i}`,
      role: i === 1 ? "admin" : i <= 3 ? "authority" : "user",
      registeredOn: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      complaintsSubmitted: Math.floor(Math.random() * 10),
    })
  }

  return users
}

function generateAuthoritiesReport() {
  const authorities = [
    {
      id: "auth1",
      name: "Water Department",
      department: "Water Supply",
      email: "water@example.com",
      phone: "+1234567895",
      assignedComplaints: 15,
      resolvedComplaints: 12,
      averageResolutionTime: 3.5,
    },
    {
      id: "auth2",
      name: "Waste Management",
      department: "Sanitation",
      email: "waste@example.com",
      phone: "+1234567896",
      assignedComplaints: 22,
      resolvedComplaints: 18,
      averageResolutionTime: 2.8,
    },
    {
      id: "auth3",
      name: "Electricity Department",
      department: "Electricity",
      email: "electricity@example.com",
      phone: "+1234567897",
      assignedComplaints: 18,
      resolvedComplaints: 15,
      averageResolutionTime: 4.2,
    },
    {
      id: "auth4",
      name: "Road Maintenance",
      department: "Infrastructure",
      email: "roads@example.com",
      phone: "+1234567898",
      assignedComplaints: 10,
      resolvedComplaints: 7,
      averageResolutionTime: 5.7,
    },
  ]

  return authorities
}

function generatePerformanceReport() {
  return {
    overallStats: {
      totalComplaints: 150,
      resolvedComplaints: 95,
      pendingComplaints: 45,
      rejectedComplaints: 10,
      averageResolutionTime: 4.2,
      satisfactionRate: 85,
    },
    monthlyStats: Array.from({ length: 12 }, (_, i) => {
      const month = new Date()
      month.setMonth(month.getMonth() - 11 + i)

      return {
        month: month.toLocaleString("default", { month: "short", year: "numeric" }),
        complaints: Math.floor(Math.random() * 20) + 5,
        resolved: Math.floor(Math.random() * 15) + 5,
        resolutionTime: Math.random() * 5 + 1,
      }
    }),
    departmentPerformance: [
      { department: "Water Supply", efficiency: 87, complaints: 45, resolved: 39 },
      { department: "Electricity", efficiency: 82, complaints: 38, resolved: 31 },
      { department: "Waste Management", efficiency: 91, complaints: 32, resolved: 29 },
      { department: "Road Maintenance", efficiency: 76, complaints: 25, resolved: 19 },
      { department: "Sanitation", efficiency: 84, complaints: 30, resolved: 25 },
    ],
  }
}

function convertToCSV(data: any[]) {
  if (!data || !data.length) return ""

  const headers = Object.keys(data[0])
  const headerRow = headers.join(",")

  const rows = data.map((obj) => {
    return headers
      .map((header) => {
        const value = obj[header]
        // Handle strings with commas by wrapping in quotes
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value
      })
      .join(",")
  })

  return [headerRow, ...rows].join("\n")
}

