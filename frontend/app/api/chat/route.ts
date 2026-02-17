import { NextRequest, NextResponse } from "next/server"
import { Index } from "@upstash/vector"
import Groq from "groq-sdk"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationId } = body

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Validate environment variables
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Vector database not configured" },
        { status: 500 }
      )
    }

    console.log("[Debug] Environment variables:", {
      hasUpstashUrl: !!process.env.UPSTASH_VECTOR_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_VECTOR_REST_TOKEN,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
    })

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Groq API not configured" },
        { status: 500 }
      )
    }

    // Step 1: Search vector database for relevant context
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })

    const searchResults = await index.query({
      data: message,
      topK: 5,
      includeMetadata: true,
    })

    // Extract context from search results
    const context = (searchResults as any[])
      .filter((result) => result.score > 0.3)
      .map((result) => result.metadata?.content || "")
      .filter((content) => content.length > 0)

    // Step 2: Call Groq API with context
    console.log("[Debug] Creating Groq client...")
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
    console.log("[Debug] Groq client created:", !!groq)

    const systemPrompt = `You are a helpful AI assistant representing Vivian Mibei, a Data Analyst at AusBiz Consulting in Sydney, Australia. 
Your expertise includes SQL, Power BI, SSIS, Azure SQL, Data Warehouse Design, Python, ETL, Data Analysis, and Report Development.
Answer questions about Vivian's professional background, skills, and experience based on the provided context.
Be concise, professional, and friendly in your responses. If you don't know something based on the context, say so.`

    const contextStr = context.length > 0 ? `\n\nContext from Professional Profile:\n${context.join("\n---\n")}` : ""

    console.log("[Debug] Calling Groq chat.completions.create...")
    const chatMessage = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `${message}${contextStr}`,
        },
      ],
    })
    console.log("[Debug] Groq response received:", !!chatMessage)

    // Extract response text
    const responseText =
      chatMessage.choices[0].message.content || "Unable to generate response"

    // Step 3: Format and return response
    const response = {
      success: true,
      data: {
        message,
        response: responseText,
        conversationId: conversationId || `conv_${Date.now()}`,
        sources: context.slice(0, 3).map((c, i) => `Source ${i + 1}: ${c.substring(0, 50)}...`),
        rayUsage: {
          inputTokens: chatMessage.usage?.prompt_tokens || 0,
          outputTokens: chatMessage.usage?.completion_tokens || 0,
        },
        timestamp: new Date().toISOString(),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Chat API Error]", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
