"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRoles?: ("user" | "admin" | "authority")[]
}

export default function ProtectedRoute({
  children,
  allowedRoles = ["user", "admin", "authority"],
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login
        router.push("/auth/login")
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // If user doesn't have the required role, redirect to appropriate dashboard
        if (user.role === "admin") {
          router.push("/admin")
        } else if (user.role === "authority") {
          router.push("/authority")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [user, loading, router, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

