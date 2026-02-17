"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: string[]
  timestamp: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        const assistantMessage: Message = {
          id: `msg_${Date.now()}_assistant`,
          role: "assistant",
          content: data.data.response,
          sources: data.data.sources || [],
          timestamp: data.data.timestamp || new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get response from AI")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
      <CardHeader className="border-b border-slate-700">
        <CardTitle>Ask about Vivian&apos;s Background</CardTitle>
        <CardDescription>Get answers powered by AI and professional data</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>Start a conversation by asking a question...</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-bl-lg"
                  : "bg-slate-700 text-slate-100 rounded-br-lg"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <p className="text-xs mt-2 opacity-70">Sources: {message.sources.join(", ")}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg rounded-br-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </Button>
      </form>
    </Card>
  )
}
