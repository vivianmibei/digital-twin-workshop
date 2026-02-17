"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Profile {
  fullName: string
  headline: string
  location: string
  summary: string
  skills: {
    technical: string[]
    softSkills: string[]
    total: number
  }
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    responsibilities?: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    startDate: string
    endDate?: string
  }>
  projects: Array<{
    name: string
    description: string
  }>
}

export default function ProfileViewer() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        const data = await response.json()

        if (data.success) {
          setProfile(data.data)
        } else {
          setError("Failed to load profile")
        }
      } catch (err) {
        console.error("Profile fetch error:", err)
        setError("Error loading profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-red-400">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
          <CardDescription>{profile.headline}</CardDescription>
          <p className="text-sm text-slate-400 mt-2">📍 {profile.location}</p>
        </CardHeader>
      </Card>

      {/* Skills Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Technical Skills ({profile.skills.technical.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.technical.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Soft Skills ({profile.skills.softSkills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.softSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-900 text-green-100 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experience.map((job, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 pb-4">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-slate-400">{job.company}</p>
                <p className="text-sm text-slate-500">
                  {job.startDate} - {job.endDate} • {job.location}
                </p>
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <ul className="text-sm text-slate-400 mt-2 ml-4">
                    {job.responsibilities.slice(0, 3).map((resp, ridx) => (
                      <li key={ridx} className="list-disc">
                        {resp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4 pb-4">
                <h3 className="font-semibold text-lg">{edu.degree}</h3>
                <p className="text-slate-400">{edu.institution}</p>
                <p className="text-sm text-slate-500">
                  {edu.startDate} - {edu.endDate || "Present"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.projects.map((project, idx) => (
              <div key={idx} className="border-l-4 border-green-500 pl-4 pb-4">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-slate-400 text-sm">{project.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
