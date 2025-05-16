"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

interface ChatHistory {
  id: string
  title: string
  date: string
}

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token")

        // Try to fetch from backend
        try {
          const response = await fetch("http://localhost:5000/api/chat/history", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setChatHistory(data)
          } else {
            throw new Error("Backend unavailable")
          }
        } catch (error) {
          console.log("Using mock chat history data")
          // Fallback data for demo
          setChatHistory([
            { id: "1", title: "Employee onboarding process", date: "2023-05-15" },
            { id: "2", title: "Marketing strategy discussion", date: "2023-05-20" },
            { id: "3", title: "Project timeline planning", date: "2023-06-02" },
            { id: "4", title: "Budget review for Q3", date: "2023-06-10" },
            { id: "5", title: "New product features", date: "2023-06-15" },
            { id: "6", title: "Team performance review", date: "2023-07-05" },
            { id: "7", title: "Customer feedback analysis", date: "2023-07-20" },
            { id: "8", title: "Hiring process optimization", date: "2023-08-10" },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error)
        // Fallback data for demo
        setChatHistory([
          { id: "1", title: "Employee onboarding process", date: "2023-05-15" },
          { id: "2", title: "Marketing strategy discussion", date: "2023-05-20" },
          { id: "3", title: "Project timeline planning", date: "2023-06-02" },
          { id: "4", title: "Budget review for Q3", date: "2023-06-10" },
          { id: "5", title: "New product features", date: "2023-06-15" },
        ])
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchChatHistory()
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleNewChat = () => {
    setSelectedChat(null)
    // Clear the chat (this would be handled by the useChat hook in a real app)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <PageHeader title="AI Chat" description="Chat with your AI assistant" />

        <div className="flex-1 overflow-hidden p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center">
                  <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">How can I help you today?</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Ask me anything about your employees, company policies, or any other work-related questions.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[80%] ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="prose dark:prose-invert">{message.content}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>

    {/* Chat History Sidebar - Now on the right */}
    <div className="w-64 border-l border-border bg-card hidden md:block">
      <div className="p-4">
        <Button className="w-full" onClick={handleNewChat}>
          New Chat
        </Button>
      </div>
      <div className="px-2">
        <h3 className="text-sm font-medium px-2 py-1">Recent Chats</h3>
        <ScrollArea className="h-[calc(100vh-120px)]">
          {historyLoading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant={selectedChat === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="truncate">
                    <span className="block truncate">{chat.title}</span>
                    <span className="text-xs text-muted-foreground">{new Date(chat.date).toLocaleDateString()}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  </div>
);
}