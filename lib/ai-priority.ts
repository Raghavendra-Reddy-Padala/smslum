// This is a mock AI priority scoring system for demonstration purposes
// In a real application, you would integrate with an actual AI service

type ComplaintData = {
  title: string
  description: string
  category: string
  location: string
}

type PriorityScore = {
  score: number
  priority: "low" | "medium" | "high"
  reasoning: string
}

export async function scorePriority(complaint: ComplaintData): Promise<PriorityScore> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple keyword-based scoring for demonstration
  const text = `${complaint.title} ${complaint.description}`.toLowerCase()

  // Emergency keywords
  const emergencyKeywords = [
    "fire",
    "flood",
    "collapse",
    "danger",
    "emergency",
    "urgent",
    "leak",
    "broken",
    "unsafe",
    "hazard",
    "injury",
    "accident",
    "immediate",
    "severe",
  ]

  // Medium priority keywords
  const mediumKeywords = [
    "repair",
    "fix",
    "issue",
    "problem",
    "concern",
    "attention",
    "needed",
    "required",
    "maintenance",
    "service",
    "not working",
    "damaged",
  ]

  // Count keyword matches
  const emergencyCount = emergencyKeywords.filter((word) => text.includes(word)).length
  const mediumCount = mediumKeywords.filter((word) => text.includes(word)).length

  // Calculate score (0-100)
  let score = 0
  let priority: "low" | "medium" | "high" = "low"
  let reasoning = ""

  if (emergencyCount > 2 || (emergencyCount > 0 && complaint.category === "water")) {
    score = 80 + Math.min(emergencyCount * 5, 20)
    priority = "high"
    reasoning = "Contains multiple emergency keywords and relates to critical infrastructure."
  } else if (emergencyCount > 0 || mediumCount > 2) {
    score = 50 + Math.min(emergencyCount * 10 + mediumCount * 5, 30)
    priority = "medium"
    reasoning = "Contains some urgent keywords or multiple maintenance issues."
  } else {
    score = 20 + Math.min(mediumCount * 10, 30)
    priority = "low"
    reasoning = "No emergency keywords detected, routine maintenance issue."
  }

  // Category-based adjustments
  if (complaint.category === "water" || complaint.category === "electricity") {
    score += 10
    reasoning += " Essential service affected."
  }

  return {
    score,
    priority: score >= 70 ? "high" : score >= 40 ? "medium" : "low",
    reasoning,
  }
}

