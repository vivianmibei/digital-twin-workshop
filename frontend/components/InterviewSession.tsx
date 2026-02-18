"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader, Send, Volume2 } from "lucide-react"

interface Question {
  id: string
  text: string
  role: string
}

interface Message {
  id: string
  type: "question" | "answer"
  content: string
  timestamp: Date
}

interface InterviewSessionProps {
  config: {
    role: string
    jobDescription: string
    behaviorNotes?: string
  }
  onComplete: (results: InterviewResults) => void
}

export interface InterviewResults {
  questions: Array<{ question: string; answer: string }>
  score: number
  decision: "pass" | "fail"
  recommendations: string[]
  duration: number
}

export default function InterviewSession({ config, onComplete }: InterviewSessionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInterviewActive, setIsInterviewActive] = useState(true)
  const [questionCount, setQuestionCount] = useState(0)
  const [startTime] = useState(Date.now())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Start interview with first question
  useEffect(() => {
    const generateFirstQuestion = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/interview/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config,
            questionNumber: 1,
            previousAnswers: [],
          }),
        })

        const data = await response.json()
        if (data.success) {
          const newMessage: Message = {
            id: `q-1`,
            type: "question",
            content: data.question,
            timestamp: new Date(),
          }
          setMessages([newMessage])
          setQuestionCount(1)
        }
      } catch (error) {
        console.error("Error generating question:", error)
      } finally {
        setIsLoading(false)
      }
    }

    generateFirstQuestion()
  }, [config])

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading) return

    // Add user answer to messages
    const answerMessage: Message = {
      id: `a-${questionCount}`,
      type: "answer",
      content: currentAnswer,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, answerMessage])
    setCurrentAnswer("")
    setIsLoading(true)

    try {
      // Check if interview should end (5 questions)
      if (questionCount >= 5) {
        // Interview complete
        const endTime = Date.now()
        const duration = Math.floor((endTime - startTime) / 1000)

        // Evaluate interview
        const response = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config,
            messages: messages.map((msg) => ({
              type: msg.type,
              content: msg.content,
            })),
            duration,
          }),
        })

        const results = await response.json()
        if (results.success) {
          onComplete({
            questions: results.questions,
            score: results.score,
            decision: results.decision,
            recommendations: results.recommendations,
            duration,
          })
        }
        setIsInterviewActive(false)
      } else {
        // Generate next question
        const response = await fetch("/api/interview/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config,
            questionNumber: questionCount + 1,
            previousAnswers: messages
              .filter((msg) => msg.type === "answer")
              .map((msg) => msg.content),
          }),
        })

        const data = await response.json()
        if (data.success) {
          const newQuestion: Message = {
            id: `q-${questionCount + 1}`,
            type: "question",
            content: data.question,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, newQuestion])
          setQuestionCount(questionCount + 1)
        }
      }
    } catch (error) {
      console.error("Error processing answer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-900">Interview in Progress</h3>
          <p className="text-sm text-slate-500">
            Question {questionCount} of 5 • Role: {config.role}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{questionCount}/5</div>
          <div className="text-xs text-slate-600">Questions</div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "question" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xl rounded-lg p-4 ${
                message.type === "question"
                  ? "bg-blue-100 text-slate-900 border border-blue-200"
                  : "bg-slate-900 text-white border border-slate-700"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.type === "question" && (
                  <button
                    onClick={() => speak(message.content)}
                    className="ml-2 p-1 hover:bg-blue-200 rounded transition-colors flex-shrink-0"
                    title="Speak question"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  </button>
                )}
              </div>
              <div className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-100 text-slate-600 rounded-lg p-4 border border-blue-200 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating next question...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {isInterviewActive && (
        <div className="px-6 py-4 border-t border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex gap-2">
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
              placeholder="Type your answer here..."
              disabled={isLoading || !isInterviewActive}
              className="border-slate-300 flex-1"
            />
            <Button
              onClick={handleSubmitAnswer}
              disabled={isLoading || !currentAnswer.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Press Enter or click Send to submit your answer
          </p>
        </div>
      )}
    </div>
  )
}
