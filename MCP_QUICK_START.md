# MCP Server - Quick Start (5 Minutes)

## ⚡ What is the MCP Server?

The MCP (Model Context Protocol) server enables **GitHub Copilot** and other AI assistants to generate code specific to your Digital Twin project architecture.

Instead of generic code snippets, the server generates:
- ✅ TypeScript Next.js components following your patterns
- ✅ API routes with proper error handling
- ✅ Server actions with validation
- ✅ Tests with your testing setup
- ✅ Documentation matching your style

---

## 🚀 Installation

### Step 1: Install Python Requirements
```bash
cd  # Go to project root
pip install -r requirements.txt
```

This installs:
- `groq` - Groq API client
- `upstash-vector` - Upstash Vector SDK
- `python-dotenv` - Environment management

### Step 2: Verify Installation
```bash
python digital_twin_mcp_server.py list
```

If you see the list of 8 tools, you're good to go! ✅

---

## 🎯 The 8 Tools (30-second overview)

| # | Tool | What it does |
|---|------|-------------|
| 1️⃣ | `generate_server_action` | Creates TypeScript server actions |
| 2️⃣ | `create_api_endpoint` | Generates API routes (/api/*) |
| 3️⃣ | `setup_vector_integration` | Vector database utilities |
| 4️⃣ | `generate_chat_component` | React components with hooks |
| 5️⃣ | `create_api_client` | HTTP client with interceptors |
| 6️⃣ | `validate_code` | Check code quality |
| 7️⃣ | `test_integration` | Jest test files |
| 8️⃣ | `generate_documentation` | Auto-generate docs |

---

## 💻 Try It Now (2 minutes)

### Test 1: Generate a Component
```bash
python digital_twin_mcp_server.py generate_chat_component SearchBox
```

**Output:** Complete React component with:
- TypeScript types
- useState, useEffect hooks
- Loading/error states
- ShadCN UI integration

### Test 2: Generate an API Route
```bash
python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=suggestions \
  method=post \
  description="Get AI suggestions"
```

**Output:** Next.js API route with:
- Request validation
- Error handling
- Logging
- Proper types

### Test 3: Generate Tests
```bash
python digital_twin_mcp_server.py test_integration component_type=chat_system
```

**Output:** Jest test suite with:
- Component render tests
- User interaction tests
- Error state tests
- API call mocking

---

## 🤖 Use with GitHub Copilot

### In VS Code with Copilot:

```
You: "I need a new chat component. Use the MCP server to generate it."

Copilot will:
1. Call generate_chat_component
2. Create component with your patterns
3. Include error states and loading
4. Add TypeScript types
5. Integrate with ShadCN UI
```

### In Copilot Chat:
```
@MCP generate_server_action submitMessage "Handle incoming message"
```

Copilot gets TypeScript with:
- Error handling
- Input validation
- Cache revalidation
- Proper logging

---

## 📂 Generated File Locations

When you use the tools, they suggest these locations:

```
frontend/
├── app/
│   ├── api/
│   │   └── [endpoint-name]/route.ts      ← create_api_endpoint
│   └── actions/
│       └── [action-name].ts              ← generate_server_action
├── components/
│   └── [ComponentName].tsx               ← generate_chat_component
├── lib/
│   ├── api-client.ts                     ← create_api_client
│   └── vector-utils.ts                   ← setup_vector_integration
├── __tests__/
│   └── [component].test.tsx              ← test_integration
└── docs/
    └── [Component].md                    ← generate_documentation
```

---

## 🎓 Common Workflows

### Workflow 1: Build a New Feature in 5 Minutes

**Goal:** Create a settings form with validation

```bash
# 1. Create API endpoint for saving settings
python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=settings \
  method=post \
  description="Save user settings"

# 2. Create server action for validation
python digital_twin_mcp_server.py generate_server_action \
  action_name=validateSettings \
  functionality="Validate and save settings"

# 3. Create React component
python digital_twin_mcp_server.py generate_chat_component SettingsForm

# 4. Generate tests
python digital_twin_mcp_server.py test_integration component_type=settings

# 5. Generate documentation
python digital_twin_mcp_server.py generate_documentation \
  component_name=SettingsForm \
  code="<paste generated component>"
```

**Result:** Complete feature with tests and docs in 5 minutes!

### Workflow 2: Generate Vector Integration

```bash
python digital_twin_mcp_server.py setup_vector_integration
```

Get complete `lib/vector-utils.ts` with:
- `searchVectorDB()` - Semantic search
- `upsertVectors()` - Add data
- `deleteVectors()` - Remove data
- `getVectorIndexInfo()` - Get stats

### Workflow 3: Validate Your Code

```bash
# Copy your component code
python digital_twin_mcp_server.py validate_code \
  code="<your typescript component>" \
  language=typescript
```

Get:
- ❌ Issues found (if any)
- 💡 Recommendations
- 📊 Code metrics

---

## 🔄 Interactive Mode

```bash
python digital_twin_mcp_server.py
# Runs in interactive mode

mcp> list
# Shows all tools

mcp> generate_chat_component MessageList
# Generates component

mcp> exit
# Quit
```

---

## 📋 Real-World Examples

### Example 1: "Generate a chat input component"
```bash
python digital_twin_mcp_server.py generate_chat_component ChatInput
```

Returns:
```typescript
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function ChatInput({ initialData }: Props) {
  // Complete implementation with hooks...
}
```

### Example 2: "Generate POST endpoint for messages"
```bash
python digital_twin_mcp_server.py create_api_endpoint \
  endpoint_name=messages \
  method=post \
  description="Handle incoming messages"
```

Returns:
```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body) {
      return NextResponse.json(...) // Validation
    }

    // TODO: Implement logic
    
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    console.error("[POST messages Error]", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
```

### Example 3: "Generate API client with Axios"
```bash
python digital_twin_mcp_server.py create_api_client
```

Returns complete client with:
```typescript
const apiClient = new DigitalTwinAPIClient()

// Use in components:
await apiClient.sendMessage("user query")
await apiClient.search("search term", 5)
await apiClient.getProfile()
```

---

## ✅ Checklist to Get Started

- [ ] Install requirements: `pip install -r requirements.txt`
- [ ] Test MCP: `python digital_twin_mcp_server.py list`
- [ ] Try a tool: `python digital_twin_mcp_server.py generate_chat_component Test`
- [ ] Read MCP_SERVER_GUIDE.md for detailed documentation
- [ ] Open a tool output (JSON) to see what's generated
- [ ] Copy generated code to your project
- [ ] Validate with Copilot before using

---

## 🎯 What to Do Next

### Option A: Use with Copilot (Recommended)
1. Make sure Copilot is installed in VS Code
2. Open Copilot chat
3. Ask: "Generate a chat component using the MCP server"
4. Copilot will generate code following your patterns

### Option B: Use from Command Line
1. Generate what you need: `python digital_twin_mcp_server.py <tool>`
2. Copy the `code` field from JSON output
3. Paste into your project
4. Adjust as needed

### Option C: Build Multiple Features at Once
```bash
# Generate app structure
python digital_twin_mcp_server.py create_api_endpoint endpoint_name=chat method=post
python digital_twin_mcp_server.py generate_chat_component ChatWindow
python digital_twin_mcp_server.py create_api_client
python digital_twin_mcp_server.py setup_vector_integration
```

---

## 🐛 Troubleshooting

### Command not found
```bash
# Make sure you're in project root
cd ~/Documents/digital-twin-workshop
python digital_twin_mcp_server.py list
```

### ModuleNotFoundError
```bash
# Install requirements
pip install -r requirements.txt
```

### Tool returns error
```bash
# Check command syntax
python digital_twin_mcp_server.py help
```

---

## 📞 Need Help?

1. **List all tools:** `python digital_twin_mcp_server.py list`
2. **Get help:** `python digital_twin_mcp_server.py help`
3. **Read guide:** Open `MCP_SERVER_GUIDE.md`
4. **Check examples:** See sections above

---

## 🎉 You're Ready!

The MCP server is installed and ready to generate code. Use it with:

✅ **GitHub Copilot** - For AI-assisted code generation  
✅ **Command line** - For quick code snippets  
✅ **Workflows** - For building complete features  

**Start generating code following your project patterns!**

---

**Next Step:** Use MCP server to generate your first component:
```bash
python digital_twin_mcp_server.py generate_chat_component FirstComponent
```

---

**Status:** ✅ MCP Server Ready  
**Version:** 1.0  
**Tools Available:** 8  
**Time to First Code:** ~30 seconds
