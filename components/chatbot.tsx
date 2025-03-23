"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type ChatbotProps = {
  onClose: () => void
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your SMS assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (input.trim() === "") return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        hello: "Hi there! How can I assist you with the Slum Management System today?",
        help: "I can help you with submitting complaints, tracking status, or navigating the system. What do you need assistance with?",
        complaint:
          "To submit a complaint, please login and navigate to the dashboard. There you'll find the 'Submit Complaint' option.",
        status: "You can track the status of your complaint in the dashboard under 'Track Status' after logging in.",
        register:
          "To register, click the Register button on the welcome page and fill in your details including phone verification.",
        login: "You can login using your username and password or phone number with OTP verification.",
      }

      let botResponse =
        "I'm not sure how to help with that specific query. Could you try asking about complaints, status tracking, registration, or login?"

      const lowercaseInput = input.toLowerCase()
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (lowercaseInput.includes(keyword)) {
          botResponse = response
          break
        }
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          SMS Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
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
                    <p>{message.content}</p>
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
                      <AvatarFallback className="bg-secondary">You</AvatarFallback>
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
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={input.trim() === ""}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

