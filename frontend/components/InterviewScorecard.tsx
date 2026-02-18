"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, TrendingUp, Award, MessageSquare } from "lucide-react"

interface ScorecardProps {
  score: number
  decision: "pass" | "fail"
  recommendations: string[]
  duration: number
  questions: Array<{ question: string; answer: string }>
  onReset: () => void
}

export default function InterviewScorecard({
  score,
  decision,
  recommendations,
  duration,
  questions,
  onReset,
}: ScorecardProps) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Interview Complete</h2>
            <p className="text-slate-600">Duration: {minutes}m {seconds}s</p>
          </div>
          {decision === "pass" ? (
            <CheckCircle className="w-16 h-16 text-green-600" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600" />
          )}
        </div>

        <div className="flex items-end gap-8">
          <div>
            <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
            <div className="text-slate-600 font-medium">Overall Score</div>
          </div>

          <div
            className={`px-6 py-3 rounded-lg font-bold text-white text-lg ${
              decision === "pass"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          >
            {decision === "pass" ? "PASS" : "FAIL"}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
          <div>
            <div className="text-2xl font-bold text-slate-900">{questions.length}</div>
            <div className="text-sm text-slate-600">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{score > 70 ? "Strong" : "Moderate"}</div>
            <div className="text-sm text-slate-600">Performance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {Math.round((score / 10) * 5)}/5
            </div>
            <div className="text-sm text-slate-600">Rating</div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="border-slate-200 bg-white/50 backdrop-blur p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-slate-900">Professional Recommendations</h3>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Q&A Review */}
      <Card className="border-slate-200 bg-white/50 backdrop-blur p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Interview Q&A</h3>
        </div>

        <div className="space-y-4">
          {questions.map((qa, i) => (
            <div key={i} className="border-l-4 border-blue-300 pl-4 py-2">
              <div className="flex items-start gap-2 mb-2">
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Q{i + 1}
                </div>
                <p className="text-slate-900 font-medium text-sm">{qa.question}</p>
              </div>
              <div className="ml-6 text-slate-700 text-sm italic bg-slate-50 p-3 rounded">
                "{qa.answer}"
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onReset}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Start New Interview
        </Button>
        <Button
          variant="outline"
          className="border-slate-300"
          onClick={() => {
            const text = `Interview Results\n\nScore: ${score}%\nDecision: ${decision === "pass" ? "PASS" : "FAIL"}\n\nQ&A:\n${questions.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}`).join("\n\n")}\n\nRecommendations:\n${recommendations.join("\n")}`
            navigator.clipboard.writeText(text)
            alert("Results copied to clipboard!")
          }}
        >
          Copy Results
        </Button>
      </div>
    </div>
  )
}
