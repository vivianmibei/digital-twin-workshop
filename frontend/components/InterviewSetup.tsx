"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase, Settings, Play, Bookmark } from "lucide-react"

interface JobDescription {
  id: string
  title: string
  description: string
}

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void
  isLoading?: boolean
}

export interface InterviewConfig {
  role: "recruiter" | "hiring_manager" | "custom"
  jobDescription: string
  behaviorNotes: string
  customRole?: string
}

export default function InterviewSetup({ onStart, isLoading = false }: InterviewSetupProps) {
  const [role, setRole] = useState<"recruiter" | "hiring_manager" | "custom">("recruiter")
  const [jobDescription, setJobDescription] = useState("")
  const [behaviorNotes, setBehaviorNotes] = useState("")
  const [customRole, setCustomRole] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [savedJobs, setSavedJobs] = useState<JobDescription[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>("")

  // Load saved job descriptions from profile
  useEffect(() => {
    const loadJobDescriptions = async () => {
      try {
        const response = await fetch("/api/profile")
        const data = await response.json()
        if (data.success && data.data.jobDescriptions) {
          setSavedJobs(data.data.jobDescriptions)
        }
      } catch (error) {
        console.error("Failed to load job descriptions:", error)
      }
    }
    loadJobDescriptions()
  }, [])

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    const selected = savedJobs.find((j) => j.id === jobId)
    if (selected) {
      setJobDescription(selected.description)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!jobDescription.trim()) {
      newErrors.push("Job description is required")
    }
    if (jobDescription.trim().length < 50) {
      newErrors.push("Job description should be at least 50 characters")
    }
    if (role === "custom" && !customRole.trim()) {
      newErrors.push("Custom role is required when selecting 'Custom'")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleStart = () => {
    if (validateForm()) {
      onStart({
        role,
        jobDescription,
        behaviorNotes,
        customRole: role === "custom" ? customRole : undefined,
      })
    }
  }

  const roleDescriptions: Record<"recruiter" | "hiring_manager" | "custom", string> = {
    recruiter: "Focus on experience, skills, and culture fit",
    hiring_manager: "Deep dive into technical skills and problem-solving",
    custom: "Configure your own interview style",
  }

  const availableRoles: Array<"recruiter" | "hiring_manager" | "custom"> = [
    "recruiter",
    "hiring_manager",
    "custom",
  ]

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <Card className="border-slate-200 bg-white/50 backdrop-blur p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Interviewer Role</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableRoles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                role === r
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="font-semibold text-slate-900 capitalize">
                {r === "hiring_manager" ? "Hiring Manager" : r}
              </div>
              <div className="text-sm text-slate-600 mt-1">{roleDescriptions[r]}</div>
            </button>
          ))}
        </div>

        {role === "custom" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Role Description
            </label>
            <Input
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g., Technical Director focused on architecture and leadership"
              className="border-slate-300"
            />
          </div>
        )}
      </Card>

      {/* Job Description Input */}
      <Card className="border-slate-200 bg-white/50 backdrop-blur p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Description</h3>

        {/* Saved Job Descriptions */}
        {savedJobs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <label className="text-sm font-medium text-slate-700">Quick Load</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {savedJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleSelectJob(job.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                    selectedJobId === job.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="font-semibold text-slate-900">{job.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {job.description.substring(0, 60)}...
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-4">
              <label className="text-xs text-slate-500">Or paste custom description:</label>
            </div>
          </div>
        )}

        <textarea
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value)
            setSelectedJobId("") // Clear selection when manually editing
          }}
          placeholder="Paste the job description here. You can copy from Seek, LinkedIn, or any other source..."
          className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-size-sm text-slate-700"
        />
        <div className="text-xs text-slate-500 mt-2">
          {jobDescription.length} characters • Min 50 required
        </div>
      </Card>

      {/* Behavior Configuration */}
      <Card className="border-slate-200 bg-white/50 backdrop-blur p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg font-semibold text-slate-900">Interview Behavior (Optional)</h3>
        </div>
        <textarea
          value={behaviorNotes}
          onChange={(e) => setBehaviorNotes(e.target.value)}
          placeholder="Add custom interviewer behavior notes. E.g., 'Focus on remote work experience' or 'Ask about leadership challenges'"
          className="w-full h-24 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-slate-700"
        />
        <div className="text-xs text-slate-500 mt-2">Optional - helps personalize the interview</div>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="text-red-900 font-medium mb-2">Please fix the following:</div>
          <ul className="space-y-1">
            {errors.map((error, i) => (
              <li key={i} className="text-red-800 text-sm">
                • {error}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Start Button */}
      <Button
        onClick={handleStart}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-lg rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <Play className="w-5 h-5" />
        {isLoading ? "Starting Interview..." : "Start Interview"}
      </Button>
    </div>
  )
}
