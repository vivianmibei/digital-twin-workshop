import { Index } from "@upstash/vector"

/**
 * Initialize Upstash Vector index
 */
export function getVectorIndex() {
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    throw new Error("Upstash Vector environment variables not configured")
  }

  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  })
}

/**
 * Search the vector database for relevant content
 */
export async function searchVectorDatabase(query: string, topK: number = 5) {
  try {
    const index = getVectorIndex()

    const results = await index.query({
      data: query,
      topK,
      includeMetadata: true,
    })

    return results.map((result: any) => ({
      id: result.id,
      score: result.score,
      content: result.metadata?.content || "",
      type: result.metadata?.type || "unknown",
      source: result.metadata?.source || "",
    }))
  } catch (error) {
    console.error("Vector search error:", error)
    throw new Error("Failed to search vector database")
  }
}

/**
 * Upsert vectors into the database
 */
export async function upsertVectors(
  vectors: Array<{
    id: string
    vector: number[]
    metadata: Record<string, any>
  }>
) {
  try {
    const index = getVectorIndex()
    await index.upsert(vectors)
    return { success: true, count: vectors.length }
  } catch (error) {
    console.error("Vector upsert error:", error)
    throw new Error("Failed to upsert vectors")
  }
}

/**
 * Delete vectors from the database
 */
export async function deleteVectors(ids: string[]) {
  try {
    const index = getVectorIndex()
    await index.delete(ids)
    return { success: true, count: ids.length }
  } catch (error) {
    console.error("Vector delete error:", error)
    throw new Error("Failed to delete vectors")
  }
}

/**
 * Get vector info
 */
export async function getVectorInfo() {
  try {
    const index = getVectorIndex()
    const info = await index.info()
    return info
  } catch (error) {
    console.error("Vector info error:", error)
    throw new Error("Failed to get vector info")
  }
}
