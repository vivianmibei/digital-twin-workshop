# Digital Twin Workshop - Project Context for GitHub Copilot

## 🎯 Project Overview

**Project Name:** Digital Twin RAG System  
**Owner:** Vivian Mibei  
**GitHub Repository:** https://github.com/vivianmibei/digital-twin-workshop  
**Live Demo:** http://localhost:3000  
**Status:** Active Development  

---

## 📋 Your Specific Project Context

### Your Professional Profile
- **Full Name:** Vivian Mibei
- **Current Role:** Data Analyst at AusBiz Consulting
- **Location:** Sydney, Australia
- **Headline:** Data Analyst / Business Intelligence Developer
- **Primary Skills:** SQL, Power BI, SSIS, Azure SQL, Data Warehouse Design
- **Secondary Skills:** Python, ETL, Data Analysis, Report Development

### Your Project Goals
1. Build an AI-powered digital twin of your professional profile
2. Enable semantic search over professional experience and skills
3. Generate intelligent responses about your background using RAG
4. Create a reusable MCP server for code generation
5. Demonstrate full-stack AI development capabilities

---

## 🔐 Your Environment Variables

**Backend (.env) - Backend Configuration:**
```env
# Upstash Vector Database (Your Instance)
UPSTASH_VECTOR_REST_URL="https://your-upstash-url.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="your-upstash-token"

# Groq API Configuration
GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="mixtral-8x7b-32768"

# Application Settings
DEBUG=False
LOG_LEVEL=INFO
MAX_TOKENS=1024
TEMPERATURE=0.7
```

**Frontend (.env.local) - Next.js Configuration:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
GROQ_API_KEY=your-groq-api-key
UPSTASH_VECTOR_REST_URL=your-upstash-url
UPSTASH_VECTOR_REST_TOKEN=your-upstash-token
NODE_ENV=development
```

---

## 📁 Your Exact Project Structure

```
digital-twin-workshop/
├── .env                              # Backend environment variables
├── .gitignore
├── agents.md                         # THIS FILE - Copilot context
├── digitaltwin.json                  # Your professional profile (JSON)
├── digitaltwin_rag.py                # Main RAG system entry point
├── embed_digitaltwin.py               # Embedding generation script
├── digital_twin_mcp_server.py        # MCP server for code generation
├── server_actions.ts                 # Next.js server actions
├── api_endpoints.ts                  # API route implementations
├── TESTING_GUIDE.md
├── MCP_SETUP_GUIDE.md
├── data/
│   ├── processed/
│   └── conversations/
└── logs/

digital-twin-frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── actions/
│   │   └── chat.ts                   # Server actions for chat
│   └── api/
│       ├── chat/route.ts             # POST /api/chat
│       ├── search/route.ts           # POST /api/search
│       ├── profile/route.ts          # GET /api/profile
│       ├── embed/route.ts            # POST /api/embed
│       └── health/route.ts           # GET /api/health
├── components/
│   ├── ChatInterface.tsx             # Main chat component
│   ├── ProfileViewer.tsx             # Profile display
│   └── SearchResults.tsx
├── lib/
│   ├── api/
│   │   └── client.ts                 # API client class
│   ├── vector.ts                     # Vector DB utilities
│   ├── groq.ts                       # Groq AI utilities
│   └── logger.ts                     # Logging utilities
├── .env.local                        # Frontend environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🛠️ Your Technology Stack

### Backend (Python)
- **Framework:** Native Python (no web framework)
- **Vector DB:** Upstash Vector (REST API)
- **AI Engine:** Groq API (mixtral-8x7b-32768)
- **Libraries:**
  - `upstash-vector` - Vector database SDK
  - `groq` - Groq API client
  - `python-dotenv` - Environment management
  - `json` - Data serialization

### Frontend (Next.js + React)
- **Framework:** Next.js 15+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** axios
- **Components:** React 19+
- **Key Hooks:** useState, useEffect, useRef, useCallback

### Infrastructure
- **Database:** Upstash Vector DB
- **AI/LLM:** Groq API
- **Deployment:** Ready for Vercel (frontend), Railway (backend)
- **Version Control:** GitHub

---

## 📊 Your Data Model

### digitaltwin.json Structure
```json
{
  "profile": {
    "fullName": "Vivian Mibei",
    "headline": "Data Analyst / Business Intelligence Developer",
    "location": "Sydney, Australia",
    "summary": "Qualified Business Intelligence Developer and Data Analyst...",
    "skills": {
      "technical": ["SQL", "Power BI", "SSIS", "Azure SQL", ...],
      "dataSkills": ["Data Visualization", "Data Analysis", ...],
      "softSkills": ["Communication", "Leadership", ...]
    }
  },
  "experience": [
    {
      "title": "Data Analyst",
      "company": "AusBiz Consulting",
      "location": "Sydney, Australia",
      "startDate": "September 2022",
      "endDate": "Current",
      "responsibilities": [...]
    }
  ],
  "education": [...],
  "projects": [...]
}
```

### Vector Database Schema (Upstash)
```typescript
interface VectorRecord {
  id: string;                    // Unique identifier
  vector: number[];              // 384-dimension embedding
  metadata: {
    content: string;             // Original text content
    type: string;                // "profile" | "experience" | "skill" | "project"
    source: string;              // Source document ID
    timestamp: string;           // ISO timestamp
  };
}
```

---

## 🔌 Your API Endpoints

### Chat Endpoint
**Route:** `POST /api/chat`  
**Location:** `app/api/chat/route.ts`  
**Purpose:** Process user messages and generate AI responses

**Request:**
```typescript
{
  message: string;           // User message
  conversationId?: string;   // Optional conversation ID
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    message: string;
    response: string;
    conversationId: string;
    sources: string[];
    timestamp: string;
  };
}
```

### Search Endpoint
**Route:** `POST /api/search`  
**Location:** `app/api/search/route.ts`  
**Purpose:** Search vector database for relevant information

**Request:**
```typescript
{
  query: string;    // Search query
  topK?: number;    // Number of results (default: 5)
}
```

**Response:**
```typescript
{
  success: boolean;
  results: Array<{
    id: string;
    score: number;      // Similarity score (0-1)
    content: string;
  }>;
}
```

### Profile Endpoint
**Route:** `GET /api/profile`  
**Location:** `app/api/profile/route.ts`  
**Purpose:** Return your complete professional profile

**Response:**
```typescript
{
  success: boolean;
  data: {
    fullName: string;
    headline: string;
    skills: {...};
    experience: [...];
    education: [...];
    projects: [...];
  };
}
```

### Embedding Endpoint
**Route:** `POST /api/embed`  
**Location:** `app/api/embed/route.ts`  
**Purpose:** Generate embeddings for text

**Request:**
```typescript
{
  text: string;    // Text to embed
}
```

**Response:**
```typescript
{
  success: boolean;
  embedding: number[];   // 384-dimensional vector
  dimension: number;     // Always 384
}
```

### Health Check Endpoint
**Route:** `GET /api/health`  
**Location:** `app/api/health/route.ts`  
**Purpose:** Verify all services are operational

**Response:**
```typescript
{
  status: "healthy" | "unhealthy";
  services: {
    groq: boolean;
    upstash: boolean;
    database: boolean;
  };
  timestamp: string;
}
```

---

## 🚀 Your MCP Server Tools

### Available Tools in `digital_twin_mcp_server.py`

**1. generate_server_action**
```python
server.execute_tool(
    "generate_server_action",
    action_name="actionName",
    functionality="What it does"
)
# Returns: TypeScript server action code
```

**2. create_api_endpoint**
```python
server.execute_tool(
    "create_api_endpoint",
    endpoint_name="endpoint",
    method="get|post|put|delete",
    description="What it does"
)
# Returns: Next.js API route code
```

**3. setup_vector_integration**
```python
server.execute_tool("setup_vector_integration")
# Returns: Vector database utility code (lib/vector.ts)
```

**4. generate_chat_component**
```python
server.execute_tool(
    "generate_chat_component",
    component_name="ComponentName"
)
# Returns: React component with hooks
```

**5. create_api_client**
```python
server.execute_tool("create_api_client")
# Returns: Axios-based API client class
```

**6. validate_code**
```python
server.execute_tool(
    "validate_code",
    code="your code",
    language="typescript"
)
# Returns: Validation results with recommendations
```

**7. test_integration**
```python
server.execute_tool(
    "test_integration",
    component_type="chat_system"
)
# Returns: Test results and metrics
```

**8. generate_documentation**
```python
server.execute_tool(
    "generate_documentation",
    component_name="ComponentName",
    code="generated code"
)
# Returns: Markdown documentation
```

---

## 🧠 Your Business Logic & Constraints

### Data Processing Rules
1. **Profile Data:** Read from `digitaltwin.json` at startup
2. **Embeddings:** 384-dimensional vectors (Upstash standard)
3. **Search:** Return top 5 results by default, max 10
4. **Response Generation:** Use Groq mixtral-8x7b-32768 model
5. **Temperature:** 0.7 for balanced creativity vs. accuracy
6. **Max Tokens:** 1024 per response

### Conversation Management
- Store conversation history in memory during session
- Optional: Persist to database for future retrieval
- Include previous messages for context in RAG system
- Clear history on new conversation start

### Error Handling Standards
- Wrap all async operations in try-catch
- Return JSON error responses with HTTP status codes
- Log errors with timestamps and context
- Provide user-friendly error messages
- Never expose API keys or sensitive data

### Performance Requirements
- Chat response: < 1 second
- Vector search: < 500ms
- API latency: < 100ms
- Page load: < 2 seconds
- No memory leaks or resource hogging

---

## 🔄 Your Development Workflow with Copilot

### Copilot-Assisted Coding Steps

1. **Code Generation**
   - Ask Copilot to generate server actions
   - Ask Copilot to create API routes
   - Ask Copilot to build React components
   - Always review generated code before committing

2. **Code Review**
   - Use Copilot to explain complex code
   - Ask for improvement suggestions
   - Request refactoring for better patterns
   - Verify security and best practices

3. **Testing**
   - Ask Copilot to generate unit tests
   - Request integration test templates
   - Ask for edge case handling

4. **Documentation**
   - Have Copilot generate JSDoc comments
   - Create README sections
   - Generate API documentation

---

## 🧪 Your Testing Strategy

### Unit Tests (Files)
- `test/mcp_server.test.ts` - MCP Server functionality
- `test/code_generation.test.ts` - Code generation accuracy
- `test/validation.test.ts` - Code validation logic

### Integration Tests (Files)
- `test/server_actions.integration.test.ts` - Server actions
- `test/api.integration.test.ts` - API endpoints
- `test/vector_integration.test.ts` - Vector DB operations

### E2E Tests (Files)
- `test/e2e/chat_flow.test.ts` - Complete chat workflow
- `test/e2e/search_workflow.test.ts` - Search functionality
- `test/e2e/profile_display.test.ts` - Profile loading

### Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- --testNamePattern="Chat"

# Watch mode
npm test -- --watch
```

---

## 📈 Your Performance Metrics

### Target Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Chat Response Time | < 1000ms | Pending |
| Vector Search | < 500ms | Pending |
| Page Load Time | < 2000ms | Pending |
| Code Generation | < 500ms | Pending |
| Test Coverage | > 80% | Pending |

---

## 🔐 Your Security Practices

### Environment Variables
- **Never commit:** `.env`, `.env.local`, `.env.production`
- **Always use:** Upstash tokens (rotate regularly)
- **Protect:** Groq API keys (regenerate if compromised)
- **Validate:** All user inputs on backend

### API Security
- Validate all incoming requests
- Rate limit endpoints (plan: 100 req/min per IP)
- Sanitize responses (no server internals)
- Use HTTPS in production
- Implement CORS properly

### Data Security
- Vector DB: Only store non-sensitive embeddings
- Conversations: Encrypt if persisting to DB
- Backups: Regular automated backups
- Audit Logs: Log all data access

---

## 🚦 Your Development Branches

### Git Workflow
```
main (production)
├── develop (integration)
│   ├── feature/chat-improvements
│   ├── feature/vector-optimization
│   ├── feature/new-endpoints
│   └── bugfix/performance-issue
```

### Commit Message Format
```
type(scope): description

Examples:
- feat(api): add new search endpoint
- fix(chat): resolve message encoding issue
- docs(setup): update installation guide
- test(e2e): add chat workflow tests
- refactor(components): improve chat UI
```

---

## 📱 Your UI/UX Standards

### Component Guidelines
- **Framework:** React 19+ with TypeScript
- **Styling:** Tailwind CSS utility-first
- **Responsive:** Mobile-first approach
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** Code splitting, lazy loading

### Component Structure
```typescript
// Standard component template
"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"

interface Props {
  // Props definition
}

export default function ComponentName({ }: Props) {
  // State management
  // Effects
  // Handlers
  // Rendering
}
```

---

## 🔌 Your Dependency Management

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0",
    "axios": "^1.7.0",
    "react-markdown": "^9.0.0",
    "@upstash/vector": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@testing-library/react": "^14.0.0",
    "jest": "^29.0.0"
  }
}
```

### Python Dependencies
```bash
upstash-vector>=1.0.0
groq>=0.7.0
python-dotenv>=1.0.0
```

---

## 💡 Common Copilot Prompts for Your Project

### For Code Generation
```
"Generate a Next.js server action that takes a user message, 
searches the vector database for relevant professional information, 
and uses Groq to generate a response about Vivian's background."

"Create an API route at /api/search that accepts a query parameter, 
searches the Upstash vector database, and returns top 5 results 
with similarity scores."
```

### For React Components
```
"Build a React component that displays a chat interface with message history, 
auto-scrolling, loading states, and displays sources for each response."

"Create a professional profile card component that displays skills, 
experience, and education information fetched from /api/profile."
```

### For Testing
```
"Write Jest unit tests for the submitMessage server action, 
including success cases, error handling, and conversation history."

"Generate integration tests for the /api/chat endpoint that verify 
proper response format, error handling, and API key validation."
```

---

## 🎯 Your Success Criteria

### MVP (Minimum Viable Product)
- ✅ Chat interface working
- ✅ Vector search functional
- ✅ Profile loading correctly
- ✅ API endpoints responding
- ✅ Conversation storage

### Phase 1 Complete
- ✅ All 8 MCP tools operational
- ✅ Code generation accurate
- ✅ Full test coverage
- ✅ GitHub repository set up
- ✅ Documentation complete

### Phase 2 (Enhancement)
- ✅ User authentication
- ✅ Advanced analytics
- ✅ Performance optimization
- ✅ Mobile app version
- ✅ Production deployment

---

## 📚 Your Quick Reference

### Quick Commands
```bash
# Start development
npm run dev                    # Frontend
python digital_twin_rag.py     # Backend

# Test
npm test
npm test -- --coverage

# Build
npm run build

# Deploy
npm run build && vercel deploy

# Git
git add .
git commit -m "feat: description"
git push origin develop
```

### File Locations Quick Reference
- **Profile data:** `digital-twin-workshop/digitaltwin.json`
- **Server actions:** `digital-twin-frontend/app/actions/chat.ts`
- **API routes:** `digital-twin-frontend/app/api/*/route.ts`
- **Components:** `digital-twin-frontend/components/*.tsx`
- **Utilities:** `digital-twin-frontend/lib/*.ts`

---

## 🤝 Working with GitHub Copilot

### Copilot Tips
1. **Be Specific:** Include your tech stack and exact requirements
2. **Include Context:** Reference this file in your prompts
3. **Review Code:** Always review and test Copilot suggestions
4. **Iterative:** Ask follow-up questions to refine code
5. **Document:** Keep this agents.md updated as your project evolves

### Example Copilot Session
```
You: "Based on the agents.md context, generate a server action 
to analyze user skills using Groq and store results."

Copilot: [Generates TypeScript code]

You: "Good, but add error handling and logging."

Copilot: [Updates code with error handling]

You: "Perfect. Now generate tests for this server action."

Copilot: [Generates Jest test file]
```

---

## 🎓 Helpful Resources for Your Project

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq API Reference](https://console.groq.com/docs)
- [Upstash Vector Docs](https://upstash.com/docs/vector)
- [GitHub Copilot Guide](https://github.com/features/copilot)

### Your GitHub Repositories
- **Main Repo:** https://github.com/vivianmibei/digital-twin-workshop
- **Frontend:** `digital-twin-frontend/` (Next.js)
- **Backend:** `digital-twin-workshop/` (Python)

### Community & Support
- **Groq Discord:** https://discord.gg/groq
- **Upstash Community:** https://upstash.com/community
- **Next.js Discussions:** https://github.com/vercel/next.js/discussions

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-02-10 | Initial comprehensive context for GitHub Copilot |
| 1.1.0 | TBD | Add authentication module context |
| 1.2.0 | TBD | Add analytics integration context |

---

## ✅ Customization Checklist

- [x] Updated repository links to your GitHub
- [x] Added your professional profile information
- [x] Specified exact environment variables
- [x] Documented your project structure
- [x] Listed your tech stack
- [x] Defined API endpoint specifications
- [x] Added your business logic rules
- [x] Included performance requirements
- [x] Created Copilot prompt examples
- [x] Added success criteria

---

## 🚀 Next Steps

1. **Share this file with GitHub Copilot** - Reference it in your prompts
2. **Update as you evolve** - Keep this context fresh
3. **Use for code generation** - Let Copilot understand your project better
4. **Iterate with Copilot** - Refine prompts based on results
5. **Document learnings** - Add new patterns to this file

---

**Last Updated:** February 10, 2024  
**Owner:** Vivian Mibei  
**Status:** Ready for GitHub Copilot Integration ✅  
**Next Review:** March 10, 2024
