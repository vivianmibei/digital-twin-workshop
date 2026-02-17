import { NextRequest, NextResponse } from "next/server"
import { Index } from "@upstash/vector"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, topK = 5 } = body

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    if (topK > 10) {
      return NextResponse.json(
        { success: false, error: "Max topK is 10" },
        { status: 400 }
      )
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

    // Query the vector database
    const results = await index.query({
      data: query,
      topK: Math.min(topK, 10),
      includeMetadata: true,
    })

    // Format results for client
    const formattedResults = (results as any[]).map((result) => ({
      id: result.id || "",
      score: result.score || 0,
      content: result.metadata?.content || "",
      type: result.metadata?.type || "unknown",
      source: result.metadata?.source || "",
    }))

    return NextResponse.json({
      success: true,
      query,
      topK,
      results: formattedResults,
      resultCount: formattedResults.length,
    })
  } catch (error) {
    console.error("[Search API Error]", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
