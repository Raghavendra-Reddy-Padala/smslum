"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare, LogIn, UserPlus, Building2 } from "lucide-react"
import { useState } from "react"
import EnhancedChatbot from "@/components/enhanced-chatbot"
import { useRouter } from "next/navigation" // Import useRouter

export default function WelcomePage() {
  const [showChatbot, setShowChatbot] = useState(false)
  const router = useRouter() // Initialize router

  // Function to handle navigation requests from the chatbot
  const handleNavigation = (page: string) => {
    // Map page names to their routes
    const routes = {
      "login": "/auth/login",
      "register": "/auth/register",
      "dashboard": "/dashboard",
      "profile": "/profile",
      "complaints": "/complaints",
      "track-status": "/track-status",
      "settings": "/settings",
      "admin-panel": "/admin-panel"
    }
    
    // Get the route for the requested page
    const route = routes[page as keyof typeof routes]
    
    if (route) {
      router.push(route)
      return true
    }
    return false
  }

  // Function to handle chatbot actions (for form filling)
  const handleChatbotAction = (action: string, data: any) => {
    console.log(`Chatbot action: ${action}`, data)
    // This would handle form filling actions if implemented on welcome page
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Welcome to SMS</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Slum Management System - Empowering communities through efficient complaint management and resolution
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Community Management
                </CardTitle>
                <CardDescription>Efficient management of community resources and infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our system provides tools for effective management of community resources, infrastructure maintenance,
                  and service delivery tracking.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Complaint Resolution
                </CardTitle>
                <CardDescription>AI-powered complaint prioritization and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Submit complaints that are automatically prioritized using AI and routed to the appropriate
                  authorities for quick resolution.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  AI Assistance
                </CardTitle>
                <CardDescription>24/7 support through our intelligent chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Get instant assistance, submit queries, and receive guidance through our AI-powered chatbot available
                  round the clock.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          <Link href="/auth/login">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <LogIn className="h-5 w-5" />
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <UserPlus className="h-5 w-5" />
              Register
            </Button>
          </Link>
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto gap-2"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <MessageSquare className="h-5 w-5" />
            Chat with AI
          </Button>
        </motion.div>

        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
          >
            <EnhancedChatbot 
              onClose={() => setShowChatbot(false)} 
              currentScreen="welcome"
              isLoggedIn={false} // Pass authentication status
              navigateTo={handleNavigation} // Pass navigation function
              onAction={handleChatbotAction} // Pass action handler
              userName="Guest" // Default name for non-logged-in users
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}