"use client"

import { useState } from "react"
import InterviewSetup, { type InterviewConfig } from "@/components/InterviewSetup"
import InterviewSession, { type InterviewResults } from "@/components/InterviewSession"
import InterviewScorecard from "@/components/InterviewScorecard"

type InterviewState = "setup" | "session" | "complete"

export default function InterviewPage() {
  const [state, setState] = useState<InterviewState>("setup")
  const [config, setConfig] = useState<InterviewConfig | null>(null)
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSetupStart = (interviewConfig: InterviewConfig) => {
    setIsLoading(true)
    setConfig(interviewConfig)
    // Simulate delay for realism
    setTimeout(() => {
      setState("session")
      setIsLoading(false)
    }, 800)
  }

  const handleSessionComplete = (interviewResults: InterviewResults) => {
    setResults(interviewResults)
    setState("complete")
  }

  const handleReset = () => {
    setState("setup")
    setConfig(null)
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Interview Simulator</h1>
          <p className="text-blue-200">
            Practice interviewing with Vivian's Digital Twin - Get real-time feedback and hiring recommendations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-3 mb-8">
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              state === "setup" || state === "session" || state === "complete"
                ? "bg-blue-400 w-8"
                : "bg-slate-600"
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              state === "session" || state === "complete" ? "bg-blue-400 w-8" : "bg-slate-600"
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              state === "complete" ? "bg-blue-400 w-8" : "bg-slate-600"
            }`}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {state === "setup" && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Interview Setup</h2>
              <InterviewSetup onStart={handleSetupStart} isLoading={isLoading} />
            </>
          )}

          {state === "session" && config && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Interview Session</h2>
              <InterviewSession config={config} onComplete={handleSessionComplete} />
            </>
          )}

          {state === "complete" && results && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Results & Feedback</h2>
              <InterviewScorecard
                score={results.score}
                decision={results.decision}
                recommendations={results.recommendations}
                duration={results.duration}
                questions={results.questions}
                onReset={handleReset}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-300 text-sm">
          <p>© 2026 Vivian's Digital Twin • AI-Powered Interview Experience</p>
        </div>
      </div>
    </div>
  )
}
