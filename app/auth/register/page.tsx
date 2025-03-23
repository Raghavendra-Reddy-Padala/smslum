"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { motion } from "framer-motion"
import Chatbot from "@/components/chatbot"
import EnhancedChatbot from "@/components/enhanced-chatbot"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!username || !phoneNumber || !password || !confirmPassword || !otp) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 2000)
  }
  
  // Handle actions from chatbot
  const handleChatbotAction = (action: string, data: any) => {
    if (action === "fillRegisterForm") {
      setUsername(data.username || "")
      setPhoneNumber(data.phoneNumber || "")
      setPassword(data.password || "")
      setConfirmPassword(data.password || "")
      
      if (!otpSent) {
        handleSendOTP()
        // After simulated OTP is sent, fill in OTP
        setTimeout(() => {
          setOtp(data.otp || "")
        }, 1600)
      } else {
        setOtp(data.otp || "")
      }
    } else if (action === "submitForm") {
      // Programmatically submit the form
      const form = document.querySelector("form")
      if (form) {
        const event = new Event("submit", { cancelable: true })
        form.dispatchEvent(event)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowChatbot(!showChatbot)} className="text-primary">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>Enter your details below to create your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your account has been created successfully.{" "}
                  <Link href="/auth/login" className="font-medium underline">
                    Login now
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={otpSent}
                    />
                    <Button
                      type="button"
                      variant={otpSent ? "outline" : "default"}
                      onClick={handleSendOTP}
                      disabled={isLoading || otpSent}
                      className="whitespace-nowrap"
                    >
                      {isLoading && !otpSent ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP Verification</Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <p className="text-sm text-muted-foreground">A 6-digit OTP has been sent to your phone number</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !otpSent}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Register
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96"
        >
          <EnhancedChatbot 
            onClose={() => setShowChatbot(false)} 
            onAction={handleChatbotAction}
            currentScreen="register"
          />
        </motion.div>
      )}
    </div>
  )
}