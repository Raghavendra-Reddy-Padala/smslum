"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Image } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: "user" | "admin" | "authority"
  }
  timestamp: Date
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

type RealTimeChatProps = {
  complaintId: string
  currentUser: {
    id: string
    name: string
    avatar?: string
    role: "user" | "admin" | "authority"
  }
}

export function RealTimeChat({ complaintId, currentUser }: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Set up real-time connection (WebSocket or similar)
    const connection = setupRealTimeConnection()

    return () => {
      // Clean up connection
      cleanupRealTimeConnection(connection)
    }
  }, [complaintId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockMessages: Message[] = [
        {
          id: "1",
          content: "Hello, I'm experiencing a water leakage issue in my area.",
          sender: {
            id: "user1",
            name: "John Doe",
            role: "user",
          },
          timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
        },
        {
          id: "2",
          content: "Thank you for reporting this issue. Could you please provide more details about the location?",
          sender: {
            id: "auth1",
            name: "Water Department",
            role: "authority",
          },
          timestamp: new Date(Date.now() - 3600000 * 23), // 23 hours ago
        },
        {
          id: "3",
          content: "It's near Block C, Main Road. The water is leaking from the main pipeline.",
          sender: {
            id: "user1",
            name: "John Doe",
            role: "user",
          },
          timestamp: new Date(Date.now() - 3600000 * 22), // 22 hours ago
          attachments: [
            {
              type: "image",
              url: "/placeholder.svg?height=200&width=300",
              name: "leak_photo.jpg",
            },
          ],
        },
        {
          id: "4",
          content:
            "We've assigned a technician to inspect the issue. They will visit tomorrow between 10 AM and 12 PM.",
          sender: {
            id: "auth1",
            name: "Water Department",
            role: "authority",
          },
          timestamp: new Date(Date.now() - 3600000 * 20), // 20 hours ago
        },
      ]

      setMessages(mockMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealTimeConnection = () => {
    // In a real app, this would set up WebSocket or similar
    console.log("Setting up real-time connection for complaint:", complaintId)

    // Mock connection object
    return {
      id: Math.random().toString(36).substring(2, 9),
    }
  }

  const cleanupRealTimeConnection = (connection: any) => {
    // In a real app, this would clean up WebSocket or similar
    console.log("Cleaning up real-time connection:", connection?.id)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (input.trim() === "" && attachments.length === 0) return

    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: currentUser,
      timestamp: new Date(),
      attachments:
        attachments.length > 0
          ? attachments.map((file) => ({
              type: file.type.startsWith("image/") ? "image" : "file",
              url: URL.createObjectURL(file),
              name: file.name,
            }))
          : undefined,
    }

    // Add to local state
    setMessages([...messages, newMessage])

    // Clear input and attachments
    setInput("")
    setAttachments([])

    // In a real app, this would send the message to the server
    sendMessageToServer(newMessage)

    // Simulate response from authority if user is sending
    if (currentUser.role === "user") {
      simulateAuthorityResponse()
    }
  }

  const sendMessageToServer = (message: Message) => {
    // In a real app, this would send the message to the server
    console.log("Sending message to server:", message)
  }

  const simulateAuthorityResponse = () => {
    // Simulate typing indicator and response after a delay
    setTimeout(() => {
      const authorityResponse: Message = {
        id: Date.now().toString(),
        content: "Thank you for the update. We'll keep you informed about the progress.",
        sender: {
          id: "auth1",
          name: "Water Department",
          role: "authority",
        },
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, authorityResponse])
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...files])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = []

    messages.forEach((message) => {
      const dateStr = formatDate(message.timestamp)
      const lastGroup = groups[groups.length - 1]

      if (lastGroup && lastGroup.date === dateStr) {
        lastGroup.messages.push(message)
      } else {
        groups.push({ date: dateStr, messages: [message] })
      }
    })

    return groups
  }

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4">
          {groupMessagesByDate().map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">{group.date}</div>
              </div>

              {group.messages.map((message, messageIndex) => {
                const isCurrentUser = message.sender.id === currentUser.id
                const showAvatar =
                  messageIndex === 0 || group.messages[messageIndex - 1].sender.id !== message.sender.id

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                      {showAvatar ? (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.sender.avatar || "/placeholder.svg?height=32&width=32"} />
                          <AvatarFallback
                            className={
                              message.sender.role === "authority"
                                ? "bg-blue-500"
                                : message.sender.role === "admin"
                                  ? "bg-red-500"
                                  : "bg-primary"
                            }
                          >
                            {message.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}

                      <div className="space-y-1">
                        {showAvatar && (
                          <div className={`text-xs font-medium ${isCurrentUser ? "text-right" : ""}`}>
                            {message.sender.name}
                          </div>
                        )}

                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : message.sender.role === "authority"
                                ? "bg-blue-100 dark:bg-blue-900/20"
                                : "bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index}>
                                  {attachment.type === "image" ? (
                                    <img
                                      src={attachment.url || "/placeholder.svg"}
                                      alt={attachment.name}
                                      className="max-h-40 rounded-md object-contain"
                                    />
                                  ) : (
                                    <div className="flex items-center gap-2 bg-background/50 p-2 rounded">
                                      <Paperclip className="h-4 w-4" />
                                      <span className="text-sm">{attachment.name}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="text-xs opacity-70 mt-1 text-right">{formatTime(message.timestamp)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      )}

      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-1 bg-muted rounded-full pl-2 pr-1 py-1 text-xs">
              {file.type.startsWith("image/") ? <Image className="h-3 w-3" /> : <Paperclip className="h-3 w-3" />}
              <span className="max-w-[100px] truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <span className="sr-only">Remove</span>
                <span aria-hidden="true">×</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 border-t flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="flex-shrink-0">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
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
          disabled={input.trim() === "" && attachments.length === 0}
          className="flex-shrink-0"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}

