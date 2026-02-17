# MCP Server Setup & Usage Guide

## Overview

The **Digital Twin MCP Server** implements the Model Context Protocol (MCP) to enable AI assistants like GitHub Copilot to generate code specific to the Digital Twin architecture.

**MCP** is a protocol that allows AI systems to use tools and access data. By implementing tools in this server, GitHub Copilot and other AI assistants can:
- Generate TypeScript/React code following your project patterns
- Create API endpoints with proper error handling
- Build components with hooks and best practices
- Validate code before implementation
- Auto-generate documentation

---

## 🚀 Quick Start (2 minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. List Available Tools
```bash
python digital_twin_mcp_server.py list
```

### 3. Test a Tool
```bash
python digital_twin_mcp_server.py generate_server_action submitForm "Submit form data"
```

Expected output: TypeScript server action code

---

## 📚 The 8 MCP Tools

### 1. **generate_server_action**
Generate TypeScript Next.js server actions with proper error handling.

```bash
python digital_twin_mcp_server.py generate_server_action \
  action_name=submitChat \
  functionality="Submit chat message and get AI response"
```

**Output:** 
- File: `app/actions/submitChat.ts`
- Code: Server action with validation and error handling
- Features: Try-catch, input validation, cache revalidation

### 2. **create_api_endpoint**
Generate Next.js API routes for any HTTP method.

```bash
python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=messages \
  method=post \
  description="Handle incoming chat messages"
```

**Output:**
- File: `app/api/messages/route.ts`
- Code: Fully typed API route
- Features: Request validation, error handling, proper logging

### 3. **setup_vector_integration**
Generate complete Upstash Vector integration utilities.

```bash
python digital_twin_mcp_server.py setup_vector_integration
```

**Output:**
- File: `lib/vector-utils.ts`
- Functions:
  - `getVectorIndex()` - Initialize index
  - `searchVectorDB(query, topK)` - Semantic search
  - `upsertVectors(vectors)` - Insert vectors
  - `deleteVectors(ids)` - Remove vectors
  - `getVectorIndexInfo()` - Index stats

### 4. **generate_chat_component**
Generate React components with hooks and state management.

```bash
python digital_twin_mcp_server.py generate_chat_component \
  component_name=MessageList
```

**Output:**
- File: `components/MessageList.tsx`
- Features:
  - `useState` for state
  - `useEffect` for lifecycle
  - `useCallback` for handlers
  - `useRef` for DOM access
  - Loading/error states
  - TypeScript interfaces
  - ShadCN UI integration

### 5. **create_api_client**
Generate an Axios-based HTTP client with interceptors.

```bash
python digital_twin_mcp_server.py create_api_client
```

**Output:**
- File: `lib/api-client.ts`
- Methods:
  - `sendMessage(message, conversationId)`
  - `search(query, topK)`
  - `getProfile()`
  - `health()`
  - `post<T>(url, data, config)`
  - `get<T>(url, config)`
- Features:
  - Request/response logging
  - Error handling
  - Auth redirect on 401
  - TypeScript generics

### 6. **validate_code**
Validate TypeScript code for quality and patterns.

```bash
python digital_twin_mcp_server.py validate_code \
  code="const x: any = 42" \
  language=typescript
```

**Output:**
- Issues found (if any)
- Recommendations
- Code metrics (lines, length)

### 7. **test_integration**
Generate test files with Jest and React Testing Library.

```bash
python digital_twin_mcp_server.py test_integration \
  component_type=chat_system
```

**Output:**
- File: `__tests__/chat_system.test.tsx`
- Test cases:
  - Component renders
  - User interactions
  - API calls
  - Error states
  - Loading states

### 8. **generate_documentation**
Auto-generate Markdown documentation.

```bash
python digital_twin_mcp_server.py generate_documentation \
  component_name=ChatInterface \
  code="your typescript code here"
```

**Output:**
- File: `docs/ChatInterface.md`
- Sections:
  - Overview
  - Features
  - Installation
  - Usage
  - Props
  - API Integration
  - Error Handling
  - Browser Support

---

## 🔌 Integration with GitHub Copilot

### Using MCP with Copilot Chat

In VS Code with GitHub Copilot installed:

```
@MCP Generate a server action that handles form submission
@MCP Create an API endpoint for /api/messages POST
@MCP Setup vector integration for semantic search
```

Copilot will use these tools to generate code specific to your architecture.

### Example Copilot Conversation

```
You: "Generate a chat component with message history using our project patterns"

Copilot uses: generate_chat_component tool
- Creates MessageHistory.tsx with hooks
- Includes state for messages
- Adds loading/error states
- Integrates ShadCN UI

You: "Add validation to this code"

Copilot uses: validate_code tool
- Checks TypeScript types
- Identifies issues
- Suggests improvements

You: "Generate tests for this component"

Copilot uses: test_integration tool
- Creates message-history.test.tsx
- Adds render, interaction, error tests
```

---

## 📖 Usage Examples

### Example 1: Generate Complete Chat Feature

```bash
# Step 1: Create API endpoint
python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=chat \
  method=post \
  description="Chat endpoint with RAG"

# Step 2: Create component
python digital_twin_mcp_server.py generate_chat_component \
  component_name=ChatWindow

# Step 3: Create tests
python digital_twin_mcp_server.py test_integration \
  component_type=chat_system

# Step 4: Validate component code
python digital_twin_mcp_server.py validate_code \
  code="<your generated component code>" \
  language=typescript

# Step 5: Generate docs
python digital_twin_mcp_server.py generate_documentation \
  component_name=ChatWindow \
  code="<your component code>"
```

### Example 2: Build API Client Layer

```bash
# Generate main API client
python digital_twin_mcp_server.py create_api_client

# Now you have lib/api-client.ts with:
# - sendMessage()
# - search()
# - getProfile()
# - health()
# - Plus generic post/get methods
```

### Example 3: Setup Vector Integration

```bash
# Generate vector utilities
python digital_twin_mcp_server.py setup_vector_integration

# Now you have lib/vector-utils.ts with:
# - searchVectorDB() for semantic search
# - upsertVectors() for adding data
# - deleteVectors() for removing data
# - getVectorIndexInfo() for stats
```

---

## 🎯 Workflow: Copilot + MCP Server

### Step 1: Start MCP Server
```bash
python digital_twin_mcp_server.py
# Runs in interactive mode
```

### Step 2: Use in Copilot
Open Copilot chat and reference MCP:
```
@MCP help
# Shows all available tools

@MCP generate_server_action action_name=processPayment functionality="Process payment with Groq verification"
# Generates server action with templates
```

### Step 3: Review Generated Code
The generated code appears in Copilot chat - review and copy to your project.

### Step 4: Validate & Test
```bash
# Validate the code
python digital_twin_mcp_server.py validate_code code="<generated code>" language=typescript

# Generate tests
python digital_twin_mcp_server.py test_integration component_type=custom
```

---

## 🔐 Security Considerations

### API Keys
- All API keys are handled server-side
- Never exposed in generated client code
- Use `.env` for sensitive data

### Generated Code
- Follows security best practices
- Input validation included
- Error messages don't leak sensitive info
- SQL injection protection patterns

### Rate Limiting
- Generated code includes error handling
- Supports backoff strategies
- Handles 429 Too Many Requests

---

## 📊 MCP Tool Reference

| Tool | Input | Output | Use Case |
|------|-------|--------|----------|
| generate_server_action | Name, Description | Server action code | Backend logic |
| create_api_endpoint | Name, Method, Description | API route code | HTTP endpoints |
| setup_vector_integration | None | Vector utilities | Semantic search |
| generate_chat_component | Name | React component | UI components |
| create_api_client | None | API client class | HTTP requests |
| validate_code | Code, Language | Issues + recommendations | Quality checks |
| test_integration | Component type | Jest test file | Testing |
| generate_documentation | Name, Code | Markdown docs | Documentation |

---

## 🛠️ Advanced Usage

### Custom Tool Extension

To add a new tool to the MCP server:

```python
def my_custom_tool(self, param1: str, param2: str) -> dict:
    """Custom tool description"""
    code = """Your generated code here"""
    
    return {
        "success": True,
        "tool": "my_custom_tool",
        "code": code,
        "file_path": "path/to/file.ts",
    }

# Add to __init__
self.tools["my_custom_tool"] = self.my_custom_tool
```

### Processing Tool Output

The server returns JSON with:
- `success` - Boolean indicating success
- `tool` - Tool name that was executed
- `code` - Generated code
- `file_path` - Recommended file location
- `[metadata]` - Tool-specific info

Example response:
```json
{
  "success": true,
  "tool": "generate_server_action",
  "action_name": "submitForm",
  "code": "\"use server\"\n...",
  "file_path": "app/actions/submitForm.ts",
  "needs_adjustment": ["Error handling logic"]
}
```

---

## 🧪 Testing the MCP Server

### Test All Tools
```bash
# Run in sequence to test each tool
python digital_twin_mcp_server.py list

python digital_twin_mcp_server.py generate_server_action \
  action_name=testAction functionality="Test action"

python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=test method=get description="Test endpoint"

python digital_twin_mcp_server.py setup_vector_integration

python digital_twin_mcp_server.py generate_chat_component \
  component_name=TestComponent

python digital_twin_mcp_server.py create_api_client

python digital_twin_mcp_server.py validate_code \
  code="const x = 1" language=typescript

python digital_twin_mcp_server.py test_integration \
  component_type=example

python digital_twin_mcp_server.py generate_documentation \
  component_name=Test code="const x = 1"
```

---

## 🚨 Troubleshooting

### "Module not found"
```bash
pip install -r requirements.txt
python -m pip install --upgrade pip
```

### "Tool not found"
```bash
python digital_twin_mcp_server.py list
# Shows all available tools
```

### "Invalid parameters"
```bash
python digital_twin_mcp_server.py help
# Shows usage instructions
```

### Generated code has issues
```bash
python digital_twin_mcp_server.py validate_code \
  code="<your code>" language=typescript
# Returns issues and recommendations
```

---

## 📈 Performance

- Tool execution: ~100ms
- Code generation: ~50-200ms depending on tool
- Validation: ~50ms
- Total: ~200-400ms per tool call

---

## 🎓 Learning Path

1. **Start with basics:** `list` command to see all tools
2. **Try simple tools:** `setup_vector_integration` (no params)
3. **Explore components:** `generate_chat_component ComponentName`
4. **Create features:** Chain tools together (endpoint → component → tests)
5. **Validate output:** Use `validate_code` tool
6. **Document:** Generate docs with `generate_documentation`

---

## 📝 Command Reference

```bash
# List all tools
python digital_twin_mcp_server.py list

# Get help
python digital_twin_mcp_server.py help

# Interactive mode
python digital_twin_mcp_server.py
# Type tool names and parameters

# Generate code
python digital_twin_mcp_server.py generate_server_action \
  action_name=myAction \
  functionality="What it does"

# Validate code
python digital_twin_mcp_server.py validate_code \
  code="your code" \
  language=typescript

# Generate documentation
python digital_twin_mcp_server.py generate_documentation \
  component_name=MyComponent \
  code="<component code>"
```

---

## 🔗 Integration Points

These tools work with:
- ✅ GitHub Copilot (via MCP protocol)
- ✅ Claude AI
- ✅ VS Code Extensions
- ✅ Command line (standalone)
- ✅ Web dashboards
- ✅ CI/CD pipelines

---

## 📚 Next Steps

1. **Run MCP server:** `python digital_twin_mcp_server.py list`
2. **Test a tool:** `python digital_twin_mcp_server.py generate_chat_component ChatBox`
3. **Use with Copilot:** Reference tools in Copilot chat
4. **Build features:** Chain tools to build complete features
5. **Deploy:** Integrate into CI/CD pipeline

---

**MCP Server Version:** 1.0  
**Last Updated:** February 15, 2026  
**Status:** ✅ Ready for use
