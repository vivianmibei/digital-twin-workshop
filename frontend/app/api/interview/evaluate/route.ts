import { NextRequest, NextResponse } from "next/server"
import { Index } from "@upstash/vector"
import Groq from "groq-sdk"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { config, messages, duration } = await request.json()

    // Get candidate context for evaluation
    const profileContext = await index.query({
      data: config.jobDescription,
      topK: 5,
      includeMetadata: true,
    })

    const context = (profileContext as any[])
      .map((r) => r.metadata?.content || "")
      .filter((c) => c.length > 0)
      .join("\n---\n")

    // Format Q&A pairs
    const qaHistory = messages.reduce(
      (acc: any[], msg: any) => {
        if (msg.type === "question") {
          acc.push({ question: msg.content })
        } else if (msg.type === "answer" && acc.length > 0) {
          acc[acc.length - 1].answer = msg.content
        }
        return acc
      },
      []
    )

    // Evaluation prompt
    const evaluationPrompt = `You are an expert hiring manager evaluating an interview. Analyze the candidate's responses based on:
1. Match with job requirements
2. Technical depth and understanding
3. Communication clarity
4. Problem-solving approach
5. Cultural fit indicators

Job Description:
${config.jobDescription}

Candidate Profile:
${context}

Interviewer Role: ${config.role}

Interview Q&A:
${qaHistory
  .map(
    (qa: any, i: number) =>
      `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer || "No answer provided"}`
  )
  .join("\n\n")}

Provide evaluation in this JSON format ONLY (no other text):
{
  "score": <number 0-100>,
  "decision": "<pass or fail - pass if score >= 70>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "recommendations": ["rec1", "rec2", "rec3"]
}`

    const evaluation = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 800,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are an expert hiring manager. Provide a structured JSON evaluation." +
            " Always output valid JSON only.",
        },
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
    })

    let result = {
      score: 75,
      decision: "pass" as const,
      strengths: ["Technical knowledge", "Communication", "Problem-solving"],
      improvements: ["More specific examples", "Leadership examples", "Team collaboration"],
      recommendations: [
        "Demonstrate more leadership experience in your next interview",
        "Prepare specific metrics and results from your projects",
        "Consider explaining your technical decision-making process more thoroughly",
      ],
    }

    try {
      const content = evaluation.choices[0].message.content || ""
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn("Could not parse evaluation JSON, using defaults")
    }

    // Ensure decision matches score
    if (result.score === undefined) result.score = 75
    if (result.score < 0) result.score = 0
    if (result.score > 100) result.score = 100

    const decision: "pass" | "fail" = (result.score as number) >= 70 ? "pass" : "fail"

    // Build recommendations
    const allRecommendations = [
      ...(result.strengths?.map((s: string) => `✓ Strength: ${s}`) || []),
      ...(result.improvements?.map((i: string) => `→ Improve: ${i}`) || []),
      ...(result.recommendations || []).slice(0, 2),
    ]

    return NextResponse.json({
      success: true,
      score: result.score,
      decision,
      recommendations: allRecommendations,
      questions: qaHistory.filter((qa: any) => qa.answer),
      duration,
    })
  } catch (error) {
    console.error("[Interview Evaluate Error]", error)
    return NextResponse.json(
      { success: false, error: "Failed to evaluate interview" },
      { status: 500 }
    )
  }
}
