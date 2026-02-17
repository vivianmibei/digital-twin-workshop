#!/usr/bin/env python3
"""
Digital Twin MCP Server - Model Context Protocol Implementation

Provides AI-powered code generation tools for the Digital Twin project.
This server implements the Model Context Protocol to enable GitHub Copilot
and other AI assistants to generate code specific to the Digital Twin architecture.

Tools provided:
1. generate_server_action - TypeScript Next.js server actions
2. create_api_endpoint - Next.js API routes
3. setup_vector_integration - Upstash Vector utilities
4. generate_chat_component - React components with hooks
5. create_api_client - Axios-based API client
6. validate_code - Code validation and suggestions
7. test_integration - Test generation for components
8. generate_documentation - Auto-generate documentation
"""

import json
import sys
from typing import Any
import re


class DigitalTwinMCPServer:
    """MCP Server for Digital Twin code generation"""

    def __init__(self):
        self.tools = {
            "generate_server_action": self.generate_server_action,
            "create_api_endpoint": self.create_api_endpoint,
            "setup_vector_integration": self.setup_vector_integration,
            "generate_chat_component": self.generate_chat_component,
            "create_api_client": self.create_api_client,
            "validate_code": self.validate_code,
            "test_integration": self.test_integration,
            "generate_documentation": self.generate_documentation,
        }

    def generate_server_action(self, action_name: str, functionality: str) -> dict:
        """Generate a TypeScript Next.js server action"""
        code = f'''\"use server\"

import {{ revalidatePath }} from \"next/cache\"
import {{ redirect }} from \"next/navigation\"

/**
 * {functionality}
 * Server Action: {action_name}
 */
export async function {action_name}(formData: FormData | any) {{
  try {{
    // Validate input
    if (!formData) {{
      return {{ success: false, error: \"No data provided\" }}
    }}

    // TODO: Implement your logic here
    // Example:
    // const result = await someAsyncOperation(formData)
    
    // Revalidate cache if needed
    revalidatePath(\"/\")

    return {{
      success: true,
      data: formData,
      message: \"{functionality} completed successfully\",
    }}
  }} catch (error) {{
    console.error(\"[{action_name} Error]\", error)
    return {{
      success: false,
      error: error instanceof Error ? error.message : \"Unknown error\",
    }}
  }}
}}
'''
        return {
            "success": True,
            "tool": "generate_server_action",
            "action_name": action_name,
            "code": code,
            "file_path": f"app/actions/{action_name}.ts",
            "needs_adjustment": ["TODO implementation logic", "Validation logic", "Error handling"],
        }

    def create_api_endpoint(
        self, endpoint_name: str, method: str = "post", description: str = ""
    ) -> dict:
        """Generate a Next.js API endpoint"""
        method_upper = method.upper()
        
        if method.lower() == "get":
            code = f'''import {{ NextRequest, NextResponse }} from \"next/server\"

/**
 * GET {endpoint_name}
 * {description}
 */
export async function GET(request: NextRequest) {{
  try {{
    // TODO: Implement your GET logic here
    
    return NextResponse.json({{
      success: true,
      data: {{}},
      timestamp: new Date().toISOString(),
    }})
  }} catch (error) {{
    console.error(\"[GET {endpoint_name} Error]\", error)
    return NextResponse.json(
      {{ success: false, error: \"Internal server error\" }},
      {{ status: 500 }}
    )
  }}
}}
'''
        elif method.lower() == "post":
            code = f'''import {{ NextRequest, NextResponse }} from \"next/server\"

/**
 * POST {endpoint_name}
 * {description}
 */
export async function POST(request: NextRequest) {{
  try {{
    const body = await request.json()
    
    // Validate input
    if (!body) {{
      return NextResponse.json(
        {{ success: false, error: \"Request body is required\" }},
        {{ status: 400 }}
      )
    }}

    // TODO: Implement your logic here
    
    return NextResponse.json({{
      success: true,
      data: body,
      timestamp: new Date().toISOString(),
    }})
  }} catch (error) {{
    console.error(\"[POST {endpoint_name} Error]\", error)
    return NextResponse.json(
      {{ success: false, error: \"Internal server error\" }},
      {{ status: 500 }}
    )
  }}
}}
'''
        else:
            code = f'''import {{ NextRequest, NextResponse }} from \"next/server\"

/**
 * {method_upper} {endpoint_name}
 * {description}
 */
export async function {method_upper}(request: NextRequest) {{
  try {{
    // TODO: Implement your {method.upper()} logic here
    
    return NextResponse.json({{
      success: true,
      message: \"{method_upper} endpoint\",
    }})
  }} catch (error) {{
    console.error(\"[{method_upper} {endpoint_name} Error]\", error)
    return NextResponse.json(
      {{ success: false, error: \"Internal server error\" }},
      {{ status: 500 }}
    )
  }}
}}
'''

        return {
            "success": True,
            "tool": "create_api_endpoint",
            "endpoint_name": endpoint_name,
            "method": method.upper(),
            "code": code,
            "file_path": f"app/api/{endpoint_name}/route.ts",
            "description": description,
        }

    def setup_vector_integration(self) -> dict:
        """Generate Upstash Vector integration utilities"""
        code = '''import { Index } from "@upstash/vector"

/**
 * Initialize and manage Upstash Vector index
 */

// Initialize vector index
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
 * Search the vector database
 * @param query - Search query
 * @param topK - Number of results (default: 5, max: 10)
 * @returns Array of search results with metadata
 */
export async function searchVectorDB(query: string, topK: number = 5) {
  try {
    if (topK > 10) throw new Error("topK cannot exceed 10")
    
    const index = getVectorIndex()
    const results = await index.query({
      data: query,
      topK: Math.min(topK, 10),
      includeMetadata: true,
    })

    return {
      success: true,
      query,
      topK,
      results: (results as any[]).map((r) => ({
        id: r.id,
        score: r.score,
        content: r.metadata?.content,
        type: r.metadata?.type,
        source: r.metadata?.source,
      })),
      count: results.length,
    }
  } catch (error) {
    console.error("[Vector Search Error]", error)
    throw error
  }
}

/**
 * Insert vectors into the database
 * @param vectors - Array of vectors with metadata
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
    console.error("[Vector Upsert Error]", error)
    throw error
  }
}

/**
 * Delete vectors from the database
 * @param ids - Array of vector IDs to delete
 */
export async function deleteVectors(ids: string[]) {
  try {
    const index = getVectorIndex()
    await index.delete(ids)
    return { success: true, count: ids.length, deletedIds: ids }
  } catch (error) {
    console.error("[Vector Delete Error]", error)
    throw error
  }
}

/**
 * Get index information and statistics
 */
export async function getVectorIndexInfo() {
  try {
    const index = getVectorIndex()
    const info = await index.info()
    return { success: true, info }
  } catch (error) {
    console.error("[Vector Info Error]", error)
    throw error
  }
}
'''
        return {
            "success": True,
            "tool": "setup_vector_integration",
            "code": code,
            "file_path": "lib/vector-utils.ts",
            "exports": [
                "getVectorIndex()",
                "searchVectorDB(query, topK)",
                "upsertVectors(vectors)",
                "deleteVectors(ids)",
                "getVectorIndexInfo()",
            ],
            "description": "Complete vector database integration utilities",
        }

    def generate_chat_component(self, component_name: str) -> dict:
        """Generate a React component with hooks"""
        code = f'''\"use client\"

import {{ useState, useRef, useEffect, useCallback }} from \"react\"
import {{ Card, CardContent, CardDescription, CardHeader, CardTitle }} from \"@/components/ui/card\"
import {{ Button }} from \"@/components/ui/button\"
import {{ Input }} from \"@/components/ui/input\"
import {{ Loader2 }} from \"lucide-react\"

/**
 * {component_name} Component
 * React component with hooks for interactive functionality
 */

interface Props {{
  // Define your props here
  initialData?: any
}}

export default function {component_name}({{ initialData }}: Props) {{
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState(initialData || null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Effect hooks
  useEffect(() => {{
    // Initialize component or fetch data
    const loadData = async () => {{
      try {{
        setIsLoading(true)
        // TODO: Fetch data or setup
        setError(null)
      }} catch (err) {{
        setError(err instanceof Error ? err.message : \"Error loading data\")
      }} finally {{
        setIsLoading(false)
      }}
    }}

    loadData()
  }}, [])

  // Event handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {{
    e.preventDefault()
    try {{
      setIsLoading(true)
      // TODO: Handle form submission
      setError(null)
    }} catch (err) {{
      setError(err instanceof Error ? err.message : \"Error\")
    }} finally {{
      setIsLoading(false)
    }}
  }}, [])

  // Render loading state
  if (isLoading && !data) {{
    return (
      <Card>
        <CardContent className=\"flex items-center justify-center h-64\">
          <Loader2 className=\"h-8 w-8 animate-spin\" />
        </CardContent>
      </Card>
    )
  }}

  // Render error state
  if (error) {{
    return (
      <Card className=\"border-red-500 bg-red-50\">
        <CardContent className=\"pt-6\">
          <p className=\"text-red-600\">Error: {{error}}</p>
        </CardContent>
      </Card>
    )
  }}

  // Render main component
  return (
    <div ref={{containerRef}}>
      <Card>
        <CardHeader>
          <CardTitle>{component_name}</CardTitle>
          <CardDescription>Your component description</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={{handleSubmit}} className=\"space-y-4\">
            {{/* TODO: Add your form fields here */}}
            <Button type=\"submit\" disabled={{isLoading}}>
              {{isLoading ? (
                <>
                  <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />
                  Loading...
                </>
              ) : (
                \"Submit\"
              )}}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}}
'''
        return {
            "success": True,
            "tool": "generate_chat_component",
            "component_name": component_name,
            "code": code,
            "file_path": f"components/{component_name}.tsx",
            "features": [
                "TypeScript with Props interface",
                "useState for state management",
                "useEffect for initialization",
                "useCallback for handlers",
                "useRef for DOM references",
                "Loading and error states",
                "ShadCN UI integration",
            ],
        }

    def create_api_client(self) -> dict:
        """Generate an Axios-based API client"""
        code = '''import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

/**
 * API Client for Digital Twin system
 * Handles all API communication with error handling and request/response interceptors
 */

class DigitalTwinAPIClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error("[API Request Error]", error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error("[API Response Error]", error)
        if (error.response?.status === 401) {
          // Handle auth error
          window.location.href = "/login"
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Send a chat message and get AI response
   */
  async sendMessage(message: string, conversationId?: string) {
    try {
      const response = await this.client.post("/api/chat", {
        message,
        conversationId,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Search the vector database
   */
  async search(query: string, topK: number = 5) {
    try {
      const response = await this.client.post("/api/search", {
        query,
        topK,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const response = await this.client.get("/api/profile")
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Health check
   */
  async health() {
    try {
      const response = await this.client.get("/api/health")
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Error handler
   */
  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message
      console.error(`API Error: ${message}`)
      return new Error(message)
    }
    return error
  }
}

// Export singleton instance
export const apiClient = new DigitalTwinAPIClient()
export default DigitalTwinAPIClient
'''
        return {
            "success": True,
            "tool": "create_api_client",
            "code": code,
            "file_path": "lib/api-client.ts",
            "methods": [
                "sendMessage(message, conversationId)",
                "search(query, topK)",
                "getProfile()",
                "health()",
                "post<T>(url, data, config)",
                "get<T>(url, config)",
            ],
            "features": [
                "Axios instance with interceptors",
                "Request/response logging",
                "Error handling",
                "Auth redirect on 401",
                "TypeScript generics",
                "Singleton pattern",
            ],
        }

    def validate_code(self, code: str, language: str = "typescript") -> dict:
        """Validate generated code"""
        issues = []
        recommendations = []

        # TypeScript validation
        if language == "typescript":
            if "any" in code and code.count("any") > 2:
                issues.append("Excessive use of 'any' type - consider proper typing")
            if "console.log" in code:
                recommendations.append("Consider using a logger instead of console.log")
            if "TODO:" in code:
                recommendations.append(f"Found {code.count('TODO:')} TODO comments")
            if "try" not in code and "catch" not in code:
                recommendations.append("Consider adding error handling")

        # General validation
        if len(code) < 50:
            issues.append("Code seems too short")
        if "{" in code and code.count("{") != code.count("}"):
            issues.append("Bracket mismatch detected")
        if '"use client"' in code and "useState" in code:
            recommendations.append("Client component with hooks - ensure hooks are used correctly")

        return {
            "success": True,
            "tool": "validate_code",
            "language": language,
            "status": "valid" if not issues else "issues_found",
            "issues": issues,
            "recommendations": recommendations,
            "code_length": len(code),
            "line_count": code.count("\n") + 1,
        }

    def test_integration(self, component_type: str) -> dict:
        """Generate test file for component"""
        if component_type == "chat_system":
            code = '''import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ChatInterface from "@/components/ChatInterface"

describe("ChatInterface Component", () => {
  it("should render chat interface", () => {
    render(<ChatInterface />)
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument()
  })

  it("should send message on form submit", async () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText(/ask a question/i)
    const submitButton = screen.getByRole("button", { name: /send/i })

    fireEvent.change(input, { target: { value: "Test message" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/test message/i)).toBeInTheDocument()
    })
  })

  it("should display loading state", async () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText(/ask a question/i)
    fireEvent.change(input, { target: { value: "Test" } })
    fireEvent.submit(input)

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled()
  })

  it("should display error message on API failure", async () => {
    render(<ChatInterface />)
    // Mock failed API response
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("API Error"))
    )

    const input = screen.getByPlaceholderText(/ask a question/i)
    fireEvent.change(input, { target: { value: "Test" } })
    fireEvent.submit(input)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
'''
        else:
            code = f'''import {{ render, screen }} from "@testing-library/react"
import Component from "@/components/{component_type}"

describe("{component_type}", () => {{
  it("should render", () => {{
    render(<Component />)
    expect(screen.getByRole("heading")).toBeInTheDocument()
  }})

  it("should handle user interactions", async () => {{
    // TODO: Add test implementation
  }})
}})
'''

        return {
            "success": True,
            "tool": "test_integration",
            "component_type": component_type,
            "code": code,
            "file_path": f"__tests__/{component_type}.test.tsx",
            "framework": "Jest + React Testing Library",
            "test_cases": [
                "Component renders correctly",
                "User interactions work",
                "API calls are made",
                "Error states display",
                "Loading states display",
            ],
        }

    def generate_documentation(self, component_name: str, code: str) -> dict:
        """Generate documentation for code"""
        lines = code.split("\n")
        
        # Extract function signatures
        functions = []
        for i, line in enumerate(lines):
            if "export async function" in line or "export function" in line:
                functions.append(line.strip())
        
        # Extract interfaces/types
        types = []
        for i, line in enumerate(lines):
            if "interface" in line or "type" in line:
                types.append(line.strip())

        markdown = f'''# {component_name}

## Overview
Auto-generated component documentation for {component_name}.

## Features
- TypeScript support
- Full type safety
- Error handling
- Responsive design

## Installation
```bash
# Component is already in your project
import {component_name} from "@/components/{component_name}"
```

## Usage
```typescript
import {component_name} from "@/components/{component_name}"

export default function Page() {{
  return (
    <{component_name} />
  )
}}
```

## Props
```typescript
interface Props {{
  // Define props here
}}
```

## Functions
{chr(10).join([f"- `{f}`" for f in functions]) if functions else "No exported functions"}

## Types
{chr(10).join([f"- `{t}`" for t in types]) if types else "No exported types"}

## Examples

### Basic Usage
```typescript
<{component_name} />
```

## API Integration
This component integrates with the following endpoints:
- `POST /api/chat` - Send messages
- `GET /api/profile` - Load profile

## Error Handling
Errors are caught and displayed to the user with appropriate messages.

## Performance
- Lazy loaded
- Optimized re-renders
- Cached responses

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT
'''
        return {
            "success": True,
            "tool": "generate_documentation",
            "component_name": component_name,
            "markdown": markdown,
            "file_path": f"docs/{component_name}.md",
            "sections": [
                "Overview",
                "Features",
                "Installation",
                "Usage",
                "Props",
                "Functions",
                "API Integration",
                "Error Handling",
            ],
        }

    def execute_tool(self, tool_name: str, **kwargs) -> dict:
        """Execute a tool by name with arguments"""
        if tool_name not in self.tools:
            return {
                "success": False,
                "error": f"Tool '{tool_name}' not found",
                "available_tools": list(self.tools.keys()),
            }

        try:
            tool_func = self.tools[tool_name]
            result = tool_func(**kwargs)
            return result
        except Exception as e:
            return {"success": False, "error": str(e), "tool": tool_name}

    def list_tools(self) -> dict:
        """List all available tools"""
        return {
            "success": True,
            "tools": [
                {
                    "name": "generate_server_action",
                    "description": "Generate TypeScript Next.js server actions",
                    "params": {"action_name": "str", "functionality": "str"},
                },
                {
                    "name": "create_api_endpoint",
                    "description": "Generate Next.js API route",
                    "params": {
                        "endpoint_name": "str",
                        "method": "str (get|post|put|delete)",
                        "description": "str",
                    },
                },
                {
                    "name": "setup_vector_integration",
                    "description": "Generate Upstash Vector utilities",
                    "params": {},
                },
                {
                    "name": "generate_chat_component",
                    "description": "Generate React component with hooks",
                    "params": {"component_name": "str"},
                },
                {
                    "name": "create_api_client",
                    "description": "Generate Axios API client",
                    "params": {},
                },
                {
                    "name": "validate_code",
                    "description": "Validate generated code",
                    "params": {"code": "str", "language": "str"},
                },
                {
                    "name": "test_integration",
                    "description": "Generate test file",
                    "params": {"component_type": "str"},
                },
                {
                    "name": "generate_documentation",
                    "description": "Auto-generate documentation",
                    "params": {"component_name": "str", "code": "str"},
                },
            ],
            "total": len(self.tools),
        }


def main():
    """Main entry point for MCP server"""
    server = DigitalTwinMCPServer()

    # Handle command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "list":
            result = server.list_tools()
            print(json.dumps(result, indent=2))

        elif command == "help":
            print("Digital Twin MCP Server v1.0")
            print("Available commands:")
            print("  list - List all available tools")
            print("  help - Show this help message")
            print("\nExample usage:")
            print('  python digital_twin_mcp_server.py generate_server_action "submitForm" "Submit form data"')

        else:
            # Try to execute as tool with remaining arguments
            tool_name = command
            kwargs = {}

            # Parse additional arguments as key=value pairs
            for i in range(2, len(sys.argv)):
                if "=" in sys.argv[i]:
                    key, value = sys.argv[i].split("=", 1)
                    kwargs[key] = value
                else:
                    # Use positional arguments based on tool
                    if tool_name == "generate_server_action" and not kwargs:
                        if len(sys.argv) > 2:
                            kwargs["action_name"] = sys.argv[2]
                        if len(sys.argv) > 3:
                            kwargs["functionality"] = sys.argv[3]

            result = server.execute_tool(tool_name, **kwargs)
            print(json.dumps(result, indent=2))

    else:
        # Interactive mode
        print("Digital Twin MCP Server - Interactive Mode")
        print("Commands: list, help, exit")
        print()

        while True:
            try:
                user_input = input("mcp> ").strip()

                if user_input == "exit":
                    break
                elif user_input == "list":
                    result = server.list_tools()
                    print(json.dumps(result, indent=2))
                elif user_input == "help":
                    print("Available tools:")
                    for tool_name in server.tools:
                        print(f"  - {tool_name}")
                else:
                    parts = user_input.split()
                    if parts:
                        tool_name = parts[0]
                        kwargs = {}
                        for part in parts[1:]:
                            if "=" in part:
                                key, value = part.split("=", 1)
                                kwargs[key] = value

                        result = server.execute_tool(tool_name, **kwargs)
                        print(json.dumps(result, indent=2))

            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"Error: {e}")


if __name__ == "__main__":
    main()
