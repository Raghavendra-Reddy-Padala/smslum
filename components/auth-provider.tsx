"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin" | "authority"
  department?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>
  register: (username: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  sendOTP: (phone: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem("sms_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Mock login - in a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate different user roles based on email
      let role: "user" | "admin" | "authority" = "user"
      let department: string | undefined = undefined

      if (email.includes("admin")) {
        role = "admin"
      } else if (email.includes("authority") || email.includes("water") || email.includes("electricity")) {
        role = "authority"
        department = email.includes("water")
          ? "Water Supply"
          : email.includes("electricity")
            ? "Electricity"
            : "General"
      }

      const userData: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: email.split("@")[0],
        email,
        phone: "+1234567890",
        role,
        department,
      }

      setUser(userData)
      localStorage.setItem("sms_user", JSON.stringify(userData))

      redirectBasedOnRole(userData.role)

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Mock phone login - in a real app, this would verify OTP with your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: `User_${phone.substr(-4)}`,
        email: `user${phone.substr(-4)}@example.com`,
        phone,
        role: "user",
      }

      setUser(userData)
      localStorage.setItem("sms_user", JSON.stringify(userData))

      redirectBasedOnRole(userData.role)

      return true
    } catch (error) {
      console.error("Phone login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, phone: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Mock registration - in a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: username,
        email,
        phone,
        role: "user",
      }

      setUser(userData)
      localStorage.setItem("sms_user", JSON.stringify(userData))

      redirectBasedOnRole(userData.role)

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const redirectBasedOnRole = (role: string) => {
    if (role === "admin") {
      router.push("/admin")
    } else if (role === "authority") {
      router.push("/authority")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sms_user")
    router.push("/")
  }

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Mock OTP sending - in a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 800))
      return true
    } catch (error) {
      console.error("OTP sending error:", error)
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Mock password reset - in a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("Password reset error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithPhone,
        register,
        logout,
        sendOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

