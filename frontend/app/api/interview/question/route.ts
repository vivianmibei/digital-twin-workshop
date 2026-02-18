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
    const { config, questionNumber, previousAnswers } = await request.json()

    // Get candidate context from vector database
    const profileContext = await index.query({
      data: config.jobDescription,
      topK: 5,
      includeMetadata: true,
    })

    const context = (profileContext as any[])
      .map((r) => r.metadata?.content || "")
      .filter((c) => c.length > 0)
      .join("\n---\n")

    // Build system prompt based on role
    const rolePrompts = {
      recruiter:
        "You are an experienced recruiter conducting a technical interview. Focus on experience, skills alignment, and cultural fit. Ask one clear, concise question.",
      hiring_manager:
        "You are a hiring manager conducting a technical interview. Focus on technical depth, problem-solving approach, and practical experience. Ask one challenging technical question.",
      custom: `You are conducting an interview with this specific behavior: ${config.customRole}. Ask one relevant question.`,
    }

    const systemPrompt = `${rolePrompts[config.role as keyof typeof rolePrompts]}

Candidate Profile Context:
${context}

${config.behaviorNotes ? `Additional Instructions: ${config.behaviorNotes}` : ""}

Also consider during this ${questionNumber === 1 ? "first" : "follow-up"} question what has been discussed:
${previousAnswers.length > 0 ? `Previous answers: ${previousAnswers.map((a: string, i: number) => `${i + 1}. ${a}`).join("\n")}` : "No previous answers yet."}

Generate a single, professional interview question. Response format: Just the question, nothing else.`

    const message = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 200,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Generate question #${questionNumber} for this interview. Job Description: ${config.jobDescription.substring(0, 300)}...`,
        },
      ],
    })

    const question = message.choices[0].message.content?.trim() || "Tell me about your relevant experience."

    return NextResponse.json({
      success: true,
      question,
      questionNumber,
    })
  } catch (error) {
    console.error("[Interview Question Error]", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate question" },
      { status: 500 }
    )
  }
}
