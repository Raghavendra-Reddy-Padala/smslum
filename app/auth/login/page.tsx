"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import EnhancedChatbot from "@/components/enhanced-chatbot"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { AccessibilityMenu } from "@/components/accessibility-menu"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithPhone, sendOTP, resetPassword, user } = useAuth()
  const [activeTab, setActiveTab] = useState("username")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showChatbot, setShowChatbot] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  // Capture current form state for the chatbot to be aware of
  const getCurrentFormState = () => {
    if (showForgotPassword) {
      return {
        view: "forgotPassword",
        email: forgotPasswordEmail,
        resetSent
      };
    } else {
      return {
        view: "login",
        activeTab,
        username,
        password,
        phoneNumber,
        otp,
        otpSent
      };
    }
  }

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "authority") {
        router.push("/authority")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, router])

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await sendOTP(phoneNumber)
      if (success) {
        setOtpSent(true)
      } else {
        setError("Failed to send OTP. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (activeTab === "username" && (!username || !password)) {
      setError("Username and password are required")
      return
    }

    if (activeTab === "phone" && (!phoneNumber || !otp)) {
      setError("Phone number and OTP are required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      let success = false

      if (activeTab === "username") {
        success = await login(username, password)
      } else {
        success = await loginWithPhone(phoneNumber, otp)
      }

      if (success) {
        // Get the updated user from auth context
        const userRole =
          activeTab === "username"
            ? username.includes("admin")
              ? "admin"
              : username.includes("authority") || username.includes("water") || username.includes("electricity")
                ? "authority"
                : "user"
            : "user"

        // Redirect based on role
        if (userRole === "admin") {
          router.push("/admin")
        } else if (userRole === "authority") {
          router.push("/authority")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!forgotPasswordEmail) {
      setError("Email is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await resetPassword(forgotPasswordEmail)
      if (success) {
        setResetSent(true)
      } else {
        setError("Failed to send reset link. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handler to allow chatbot to fill the form
  const handleChatbotAction = (action: string, data: any) => {
    switch (action) {
      case 'fillLoginForm':
        if (data.username) setUsername(data.username);
        if (data.password) setPassword(data.password);
        if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
        if (data.otp) setOtp(data.otp);
        if (data.tab && (data.tab === 'username' || data.tab === 'phone')) {
          setActiveTab(data.tab);
        }
        break;
      case 'fillForgotPasswordForm':
        if (data.email) setForgotPasswordEmail(data.email);
        setShowForgotPassword(true);
        break;
      case 'switchTab':
        if (data.tab && (data.tab === 'username' || data.tab === 'phone')) {
          setActiveTab(data.tab);
        }
        break;
      case 'navigate':
        // Handle navigation requests
        if (data.path) {
          router.push(data.path);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageSelector />
        <AccessibilityMenu />
      </div>
      
      {/* Chat helper button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {showChatbot && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 right-4 w-80 lg:w-96 shadow-xl rounded-lg overflow-hidden z-50"
        >
          <EnhancedChatbot 
            onClose={() => setShowChatbot(false)} 
            onAction={handleChatbotAction}
            currentFormState={getCurrentFormState()}
          />
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!showForgotPassword ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="username">Username</TabsTrigger>
                  <TabsTrigger value="phone">Phone Number</TabsTrigger>
                </TabsList>
                <TabsContent value="username">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username or Email</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username or email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="phone">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading || otpSent}
                      />
                    </div>
                    {!otpSent ? (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleSendOTP}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="otp">One-Time Password</Label>
                          <Input
                            id="otp"
                            placeholder="Enter the OTP sent to your phone"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-1/2"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                            }}
                            disabled={isLoading}
                          >
                            Change Number
                          </Button>
                          <Button type="submit" className="w-1/2" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                {resetSent ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTitle>Reset Link Sent</AlertTitle>
                      <AlertDescription>
                        A password reset link has been sent to your email. Please check your inbox.
                      </AlertDescription>
                    </Alert>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetSent(false);
                        setForgotPasswordEmail("");
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-1/2"
                        onClick={() => setShowForgotPassword(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-1/2" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </div>
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
