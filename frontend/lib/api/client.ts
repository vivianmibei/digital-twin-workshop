import axios, { AxiosInstance } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    })
  }

  /**
   * Send a chat message and get a response
   */
  async chat(message: string, conversationId?: string) {
    const response = await this.client.post("/api/chat", {
      message,
      conversationId,
    })
    return response.data
  }

  /**
   * Search the vector database
   */
  async search(query: string, topK: number = 5) {
    const response = await this.client.post("/api/search", {
      query,
      topK,
    })
    return response.data
  }

  /**
   * Get the user's profile
   */
  async getProfile() {
    const response = await this.client.get("/api/profile")
    return response.data
  }

  /**
   * Generate embeddings for text
   */
  async embed(text: string) {
    const response = await this.client.post("/api/embed", {
      text,
    })
    return response.data
  }

  /**
   * Check health status
   */
  async health() {
    const response = await this.client.get("/api/health")
    return response.data
  }
}

export const apiClient = new ApiClient()
