"use client"

import { useState } from "react"
import InterviewSetup from "./InterviewSetup"
import InterviewSession from "./InterviewSession"
import InterviewScorecard from "./InterviewScorecard"

interface InterviewConfig {
  role: "recruiter" | "hiring_manager" | "custom"
  jobDescription: string
  behaviorNotes?: string
  customRole?: string
}

interface InterviewResults {
  score: number
  decision: "pass" | "fail"
  recommendations: string[]
  questions: Array<{
    question: string
    answer: string
  }>
  duration: number
}

export default function InterviewPage() {
  const [stage, setStage] = useState<"setup" | "session" | "complete">("setup")
  const [config, setConfig] = useState<InterviewConfig | null>(null)
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSetupComplete = (setupConfig: InterviewConfig) => {
    setConfig(setupConfig)
    setStage("session")
  }

  const handleSessionComplete = (sessionResults: InterviewResults) => {
    setResults(sessionResults)
    setStage("complete")
  }

  const handleReset = () => {
    setStage("setup")
    setConfig(null)
    setResults(null)
    setIsLoading(false)
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-lg p-6 md:p-8 border border-slate-700">
      {/* Progress Indicator */}
      <div className="flex justify-center items-center gap-3 mb-8">
        <div
          className={`w-3 h-3 rounded-full transition-all ${
            stage === "setup" ||
            stage === "session" ||
            stage === "complete"
              ? "bg-blue-500"
              : "bg-slate-600"
          }`}
        />
        <div
          className={`w-16 h-1 transition-all ${
            stage === "session" || stage === "complete"
              ? "bg-blue-500"
              : "bg-slate-600"
          }`}
        />
        <div
          className={`w-3 h-3 rounded-full transition-all ${
            stage === "session" || stage === "complete"
              ? "bg-blue-500"
              : "bg-slate-600"
          }`}
        />
        <div
          className={`w-16 h-1 transition-all ${
            stage === "complete" ? "bg-blue-500" : "bg-slate-600"
          }`}
        />
        <div
          className={`w-3 h-3 rounded-full transition-all ${
            stage === "complete" ? "bg-blue-500" : "bg-slate-600"
          }`}
        />
      </div>

      {/* Stage Content */}
      {stage === "setup" && config === null && (
        <InterviewSetup
          onStart={handleSetupComplete}
          isLoading={isLoading}
        />
      )}

      {stage === "session" && config !== null && (
        <InterviewSession
          config={config}
          onComplete={handleSessionComplete}
        />
      )}

      {stage === "complete" && results !== null && (
        <InterviewScorecard
          score={results.score}
          decision={results.decision}
          recommendations={results.recommendations}
          duration={results.duration}
          questions={results.questions}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
