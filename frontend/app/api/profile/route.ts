import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    // Load profile from digitaltwin.json in project root
    // Frontend is in ./frontend/, so go up one level to project root
    const filePath = join(process.cwd(), "..", "digitaltwin.json")
    
    console.log("[Profile API] Current working directory:", process.cwd())
    console.log("[Profile API] Looking for file at:", filePath)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error("[Profile API] File not found at:", filePath)
      return NextResponse.json(
        { 
          success: false, 
          error: "File not found",
          path: filePath,
          message: "digitaltwin.json not found in project root"
        },
        { status: 404 }
      )
    }
    
    console.log("[Profile API] File found, reading content...")
    
    const fileContent = readFileSync(filePath, "utf-8")
    console.log("[Profile API] File content length:", fileContent.length)
    
    const profileData = JSON.parse(fileContent)
    console.log("[Profile API] JSON parsed successfully")

    // Format the response with organized skills
    const allSkills = profileData.profile.skills || []
    const technicalSkills = allSkills.filter(
      (s: string) => !["Communication", "Problem Solving", "Teamwork", "Leadership", "Critical Thinking"].includes(s)
    )
    const softSkills = allSkills.filter(
      (s: string) => ["Communication", "Problem Solving", "Teamwork", "Leadership", "Critical Thinking"].includes(s)
    )

    const profile = {
      success: true,
      data: {
        fullName: profileData.profile.fullName,
        headline: profileData.profile.headline,
        location: profileData.profile.location,
        summary: profileData.profile.summary,
        skills: {
          technical: technicalSkills,
          softSkills: softSkills,
          total: allSkills.length,
        },
        experience: profileData.experience.map((exp: any) => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate || "Present",
          responsibilities: exp.responsibilities || [],
        })),
        education: (profileData.education || profileData["education background"] || []).map((edu: any) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
        })),
        projects: profileData.projects.map((proj: any) => ({
          name: proj.name,
          description: proj.description,
        })),
        certifications: profileData.profile.certifications || [],
        jobDescriptions: profileData.jobDescriptions || [],
        lastUpdated: new Date().toISOString(),
      },
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[Profile API Error]", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to load profile"
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: "Could not load digitaltwin.json. Ensure the file exists in the project root."
      },
      { status: 500 }
    )
  }
}
