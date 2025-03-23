import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "month"
    const category = searchParams.get("category")

    // Get analytics data based on parameters
    const data = await getAnalyticsData(period, category)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

async function getAnalyticsData(period: string, category?: string | null) {
  // In a real app, this would fetch data from your database
  // Here we're generating mock data

  // Define date ranges based on period
  const now = new Date()
  let startDate: Date

  switch (period) {
    case "week":
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    case "year":
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
  }

  // Generate mock data
  const statusData = [
    { name: "Pending", value: Math.floor(Math.random() * 50) + 10 },
    { name: "Processing", value: Math.floor(Math.random() * 40) + 20 },
    { name: "Resolved", value: Math.floor(Math.random() * 100) + 50 },
    { name: "Rejected", value: Math.floor(Math.random() * 20) + 5 },
  ]

  const priorityData = [
    { name: "High", value: Math.floor(Math.random() * 40) + 20 },
    { name: "Medium", value: Math.floor(Math.random() * 60) + 40 },
    { name: "Low", value: Math.floor(Math.random() * 30) + 10 },
  ]

  const categoryData = [
    { name: "Water", value: Math.floor(Math.random() * 50) + 30 },\
    { name: "Electricity\", value: Math.floor(Math.random() * 40) + 20   * 50) + 30 },
    { name: "Electricity", value: Math.floor(Math.random() * 40) + 20 },
    { name: "Waste", value: Math.floor(Math.random() * 30) + 15 },
    { name: "Sanitation", value: Math.floor(Math.random() * 35) + 25 },
    { name: "Road", value: Math.floor(Math.random() * 25) + 10 },
  ]

  const timeSeriesData = []
  const days = period === "week" ? 7 : period === "month" ? 30 : 12
  const interval = period === "year" ? "month" : "day"

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    if (interval === "day") {
      date.setDate(startDate.getDate() + i)
    } else {
      date.setMonth(startDate.getMonth() + i)
    }

    timeSeriesData.push({
      date: date.toISOString().split("T")[0],
      complaints: Math.floor(Math.random() * 10) + 1,
      resolved: Math.floor(Math.random() * 8),
    })
  }

  const resolutionTimeData = [
    { name: "Water", days: 3.5 },
    { name: "Electricity", days: 2.8 },
    { name: "Waste", days: 1.5 },
    { name: "Sanitation", days: 4.2 },
    { name: "Road", days: 5.7 },
  ]

  // Filter by category if provided
  if (category) {
    return {
      statusData,
      priorityData,
      timeSeriesData,
      resolutionTimeData: resolutionTimeData.filter((item) => item.name.toLowerCase() === category.toLowerCase()),
    }
  }

  return {
    statusData,
    priorityData,
    categoryData,
    timeSeriesData,
    resolutionTimeData,
  }
}

