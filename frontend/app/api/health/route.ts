import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      services: {
        groq: !!process.env.GROQ_API_KEY,
        upstash: !!process.env.UPSTASH_VECTOR_REST_TOKEN,
        database: true,
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
