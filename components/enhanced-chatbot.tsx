"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, Paperclip, ImageIcon, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getChatGPTResponse } from "@/components/chatgpt-servics"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

type EnhancedChatbotProps = {
  onClose: () => void
  userName?: string
  userRole?: "user" | "admin" | "authority"
  currentScreen?: string 
  formData?: any
  currentFormState?: any
  onAction?: (action: string, data: any) => void
  isLoggedIn?: boolean
  navigateTo?: (page: string) => void
}

export default function EnhancedChatbot({ 
  onClose, 
  userName = "User", 
  userRole = "user",
  currentScreen = "login",
  formData = {},
  onAction,
  isLoggedIn = false,
  navigateTo
}: EnhancedChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${userName}! I'm your SMS assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [complaintFormData, setComplaintFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: ""
  })

  // System prompt for ChatGPT to understand context
  const systemPrompt = `
    You are an AI assistant for a Slum Management System (SMS) application that handles user complaints.
    
    Current user: ${userName} (Role: ${userRole})
    Current screen: ${currentScreen}
    Login status: ${isLoggedIn ? "Logged in" : "Not logged in"}
    
    The application allows users to:
    1. Submit complaints about issues like water supply, sanitation, electricity, etc.
    2. Track the status of their complaints
    3. Contact authorities
    
    For authorities, the app allows:
    1. View and manage complaints assigned to them
    2. Update status of complaints
    3. Communicate with users
    
    For admins, the app allows:
    1. Manage all complaints, users, and authorities
    2. View analytics and reports
    3. Configure system settings
    
    If asked about what's on screen, use this context: "${currentScreen}"
    If asked to fill a form with random data, generate realistic sample data for the requested form.
    If user asks to "fill the form", "complete form", "fill it for me", etc., detect if they are on login or register page and fill the appropriate form.
    Answer questions about the application based on this context.
    Be concise but helpful.
  `;

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Function to handle navigation requests
  const handleNavigation = (destination: string): boolean => {
    // Define restricted pages that require login
    const restrictedPages = ["dashboard", "profile", "complaints", "track-status", "settings", "admin-panel"];
    
    // Check if trying to access a restricted page while not logged in
    if (restrictedPages.includes(destination.toLowerCase()) && !isLoggedIn) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        content: `You need to log in first before accessing the ${destination} page. Would you like me to take you to the login page instead?`,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, warningMessage]);
      return false;
    }
    
    // If navigation is allowed, use the navigateTo function
    if (navigateTo && typeof navigateTo === 'function') {
      navigateTo(destination);
      
      const navigationMessage: Message = {
        id: Date.now().toString(),
        content: `Navigating to the ${destination} page...`,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, navigationMessage]);
      return true;
    }
    
    return false;
  }

  const handleSendMessage = async () => {
    if (input.trim() === "" && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      attachments: attachments.map((file) => ({
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsTyping(true)

    try {
      const lowerInput = input.toLowerCase();
      
      // Check for navigation requests
      const navigateKeywords = [
        { keywords: ["go to", "navigate to", "take me to", "open", "show me"], action: "navigate" },
        { keywords: ["login", "log in", "sign in"], page: "login" },
        { keywords: ["register", "sign up", "create account"], page: "register" },
        { keywords: ["dashboard", "home"], page: "dashboard" },
        { keywords: ["profile", "my account"], page: "profile" },
        { keywords: ["complaints", "new complaint", "submit complaint", "file complaint"], page: "complaints" },
        { keywords: ["track", "status", "my complaints"], page: "track-status" },
        { keywords: ["settings", "preferences"], page: "settings" },
      ];
      
      // Check if the message contains navigation intent
      for (const navKeyword of navigateKeywords) {
        if (navKeyword.action === "navigate") {
          for (const keyword of navKeyword.keywords) {
            if (lowerInput.includes(keyword)) {
              // Look for a page reference after the keyword
              for (const pageRef of navigateKeywords.filter(k => k.page)) {
                if (pageRef.page && lowerInput.includes(pageRef.page)) {
                  // Navigation request detected
                  const navigationSuccess = handleNavigation(pageRef.page);
                  
                  if (navigationSuccess) {
                    setIsTyping(false);
                    return;
                  }
                }
              }
            }
          }
        } else if (navKeyword.page) {
          // Direct page reference (e.g., "login" or "dashboard")
          for (const keyword of navKeyword.keywords) {
            if (lowerInput.includes(keyword) && (
              lowerInput.includes("go to") || 
              lowerInput.includes("take me") || 
              lowerInput.includes("navigate") || 
              lowerInput.includes("open") || 
              lowerInput.startsWith(keyword)
            )) {
              // Navigation request detected
              const navigationSuccess = handleNavigation(navKeyword.page);
              
              if (navigationSuccess) {
                setIsTyping(false);
                return;
              }
            }
          }
        }
      }
      
      // Handle form filling for register page
      if ((lowerInput.includes("fill") || lowerInput.includes("complete") || lowerInput.includes("submit")) && 
          (lowerInput.includes("form") || lowerInput.includes("register") || lowerInput.includes("signup"))) {
        
        if (currentScreen === "register") {
          // Generate random register data
          const randomUsernames = ["Deepak", "Rahul", "Priya", "Ananya", "Vikram"];
          const randomData = {
            username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
            password: "Password" + Math.floor(1000 + Math.random() * 9000),
            phoneNumber:  Math.floor(7000000000 + Math.random() * 2999999999),
            otp: Math.floor(100000 + Math.random() * 900000).toString()
          };
          
          // Call the onAction callback to update the parent component
          if (onAction && typeof onAction === 'function') {
            onAction("fillRegisterForm", randomData);
            
            // If the message includes "submit" or "register", also trigger form submission
            if (lowerInput.includes("submit") || lowerInput.includes("register now")) {
              setTimeout(() => {
                onAction("submitForm", {});
              }, 2000);
            }
          }
          
          // Add a message to inform the user
          const botMessage: Message = {
            id: Date.now().toString(),
            content: `I've filled the registration form with sample data:
Username: ${randomData.username}
Password: ${randomData.password}
Phone: ${randomData.phoneNumber}
OTP: ${randomData.otp}

The OTP will be automatically sent and filled in for demonstration purposes.`,
            sender: "bot",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          return;
        } 
        // Handle login form filling
        else if (currentScreen === "login") {
          // Generate random login data
          const randomUsernames = ["Hitesh", "Vishal", "Jithu", "Chintu", "Jonnysins"];
          const randomData = {
            tab: Math.random() > 0.5 ? "username" : "phone",
            username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
            password: "Password" + Math.floor(1000 + Math.random() * 9000),
            phoneNumber: "+91" + Math.floor(7000000000 + Math.random() * 2999999999),
            otp: Math.floor(1000 + Math.random() * 9000).toString()
          };

          // Call the onAction callback to update the parent component
          if (onAction && typeof onAction === 'function') {
            onAction("fillLoginForm", randomData);
            
            // If the message includes "submit" or "login", also trigger form submission
            if (lowerInput.includes("submit") || lowerInput.includes("login now")) {
              setTimeout(() => {
                onAction("submitForm", {});
              }, 2000);
            }
          }
          
          // Add a message to inform the user
          const botMessage: Message = {
            id: Date.now().toString(),
            content: `I've filled the login form with sample data:
Username: ${randomData.username}
Password: ${randomData.password}
Phone: ${randomData.phoneNumber}
OTP: ${randomData.otp}

Note: This is just for demonstration purposes.`,
            sender: "bot",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }
      }
      
      // Check for special commands for complaint form
      if (input.toLowerCase().includes("submit") && 
         (input.toLowerCase().includes("complaint") || input.toLowerCase().includes("file"))) {
        // Handle form filling request
        if (activeTab === "submit-complaint") {
          handleFillComplaintForm();
        } else {
          // Switch to form tab and then fill it
          setActiveTab("submit-complaint");
          setTimeout(() => handleFillComplaintForm(), 500);
        }
        return;
      }

      // Get messages in the format needed for the API
      const chatHistory = messages.map(msg => ({
        content: msg.content,
        sender: msg.sender
      }));
      
      // Add the new user message
      chatHistory.push({
        content: input,
        sender: "user"
      });

      // Get response from ChatGPT
      const botResponse = await getChatGPTResponse(chatHistory, systemPrompt);

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])
    } 
    catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...filesArray])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFillComplaintForm = () => {
    // Generate random data for complaint form
    const categories = ["water", "sanitation", "electricity", "road", "waste", "housing", "other"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const randomData = {
      title: `Issue with ${randomCategory} in Area ${Math.floor(1000 + Math.random() * 9000)}`,
      category: randomCategory,
      location: `Sector ${Math.floor(1 + Math.random() * 50)}, Block ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      description: `There has been a recurring problem with the ${randomCategory} system in our area for the past ${Math.floor(1 + Math.random() * 10)} days. Multiple residents have complained about this issue. We need urgent assistance.`
    };

    setComplaintFormData(randomData);
    
    // Add a message to inform the user
    const botMessage: Message = {
      id: Date.now().toString(),
      content: `I've filled the complaint form with random data for your review. Please check the information and make any necessary changes before submitting.`,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
  }

  const handleSubmitComplaint = async () => {
    setIsTyping(true);

    // Here you would actually submit the complaint to your backend
    // For now, we'll simulate it

    try {
      // Generate a random complaint ID
      const complaintId = "CM" + Math.floor(10000 + Math.random() * 90000);
      
      // Add a success message
      const botResponse: Message = {
        id: Date.now().toString(),
        content: `Your complaint has been successfully submitted! The complaint ID is ${complaintId}. You can track its status in the 'Track Status' section.`,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      
      // Reset form data
      setComplaintFormData({
        title: "",
        category: "",
        location: "",
        description: ""
      });
      
      // Switch back to chat tab
      setActiveTab("chat");
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error submitting your complaint. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          SMS AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="chat" className="flex-1">
            Chat
          </TabsTrigger>
          <TabsTrigger value="submit-complaint" className="flex-1">
            Submit Complaint
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="p-0 m-0">
          <CardContent className="p-0">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-2 max-w-[80%]">
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="rounded bg-background/50 p-2 text-sm">
                                {attachment.type === "image" ? (
                                  <div>
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-h-40 rounded-md object-contain"
                                    />
                                    <p className="mt-1 text-xs opacity-70">{attachment.name}</p>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <span>{attachment.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback className="bg-secondary">{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-75" />
                          <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 pt-2 border-t">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted rounded-full pl-2 pr-1 py-1 text-xs">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <Paperclip className="h-3 w-3" />
                    )}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-5 w-5" />
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isTyping || (input.trim() === "" && attachments.length === 0)}
              >
                {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </CardFooter>
        </TabsContent>

        <TabsContent value="submit-complaint" className="p-0 m-0">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Complaint Title</label>
                <Input 
                  placeholder="Enter a brief title for your complaint" 
                  value={complaintFormData.title}
                  onChange={(e) => setComplaintFormData({...complaintFormData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={complaintFormData.category}
                  onChange={(e) => setComplaintFormData({...complaintFormData, category: e.target.value})}
                >
                  <option value="">Select a category</option>
                  <option value="water">Water Supply</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="road">Road Maintenance</option>
                  <option value="waste">Waste Management</option>
                  <option value="housing">Housing Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input 
                  placeholder="Enter the location of the issue" 
                  value={complaintFormData.location}
                  onChange={(e) => setComplaintFormData({...complaintFormData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="Provide a detailed description of the issue"
                  value={complaintFormData.description}
                  onChange={(e) => setComplaintFormData({...complaintFormData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                    Add Files
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    You can attach images or documents related to your complaint
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("chat")}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitComplaint} 
              disabled={!complaintFormData.title || !complaintFormData.category || !complaintFormData.location || !complaintFormData.description}
            >
              {isTyping ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Submit Complaint
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
function onAction(arg0: string, randomData: { tab: string; username: string; password: string; phoneNumber: string; otp: string }) {
  throw new Error("Function not implemented.")
}
