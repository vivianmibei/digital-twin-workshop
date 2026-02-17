import { NextRequest, NextResponse } from "next/server"
import { Index } from "@upstash/vector"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 })
    }

    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Vector database not configured" },
        { status: 500 }
      )
    }

    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })

    // Note: Upstash Vector handles embedding internally
    // When you query with data, it automatically generates and searches embeddings
    // This endpoint demonstrates the capability, but actual embeddings are handled by Upstash

    return NextResponse.json({
      success: true,
      message: "Embedding generation handled by Upstash Vector DB",
      textLength: text.length,
      note: "Use query endpoint for semantic search. Embeddings are auto-generated.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Embed API Error]", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
