import Groq from "groq-sdk"

/**
 * Initialize Groq client
 */
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable not configured")
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
}

/**
 * Generate a response using Groq with RAG context
 */
export async function generateResponse(userMessage: string, context: string[], model: string = "mixtral-8x7b-32768") {
  try {
    const client = getGroqClient()

    const contextStr = context.length > 0 ? `\n\nContext:\n${context.join("\n")}` : ""

    const systemPrompt = `You are a helpful AI assistant representing Vivian Mibei, a Data Analyst at AusBiz Consulting in Sydney, Australia. 
Your expertise includes SQL, Power BI, SSIS, Azure SQL, Data Warehouse Design, Python, ETL, Data Analysis, and Report Development.
Answer questions about Vivian's professional background, skills, and experience based on the provided context.
Be concise and professional in your responses.`

    const message = await client.messages.create({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${userMessage}${contextStr}`,
        },
      ],
      system: systemPrompt,
    })

    const responseText =
      message.content[0].type === "text"
        ? message.content[0].text
        : "Unable to generate response"

    return {
      response: responseText,
      model,
      tokensUsed: message.usage?.input_tokens || 0,
    }
  } catch (error) {
    console.error("Groq API error:", error)
    throw new Error("Failed to generate response from Groq")
  }
}

/**
 * Generate embeddings for text (using Groq or external API)
 * Note: For production, consider using Upstash's embedding models
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Placeholder: Implement actual embedding generation
    // This would typically use Upstash Vector's embedding models or another service
    // For now, returning a mock 384-dimensional vector
    return Array(384).fill(0.1)
  } catch (error) {
    console.error("Embedding generation error:", error)
    throw new Error("Failed to generate embedding")
  }
}
