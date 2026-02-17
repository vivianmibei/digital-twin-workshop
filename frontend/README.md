# Digital Twin Frontend

AI-powered digital twin of Vivian Mibei's professional profile built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8.0+
- Environment variables configured

### Installation

```bash
cd frontend
pnpm install
```

### Configuration

Copy `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_API_URL` - API base URL (default: http://localhost:3000)
- `UPSTASH_VECTOR_REST_URL` - Upstash Vector database URL
- `UPSTASH_VECTOR_REST_TOKEN` - Upstash Vector authentication token
- `GROQ_API_KEY` - Groq API key for LLM

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/                    # API Routes
│   │   ├── chat/route.ts       # Chat endpoint
│   │   ├── search/route.ts     # Vector search
│   │   ├── profile/route.ts    # Profile data
│   │   ├── embed/route.ts      # Embedding generation
│   │   └── health/route.ts     # Health check
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── components/
│   ├── ui/                     # ShadCN UI components
│   ├── ChatInterface.tsx       # Chat component
│   ├── ProfileViewer.tsx       # Profile card
│   └── SearchResults.tsx       # Search results
├── lib/
│   ├── api/
│   │   └── client.ts           # API client
│   ├── vector.ts               # Vector DB utilities
│   ├── groq.ts                 # Groq API utilities
│   ├── logger.ts               # Logging
│   └── utils.ts                # Helper functions
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## 🔌 API Endpoints

### POST /api/chat
Chat with the digital twin

**Request:**
```typescript
{ message: string; conversationId?: string }
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

### POST /api/search
Search vector database

**Request:**
```typescript
{ query: string; topK?: number }
```

**Response:**
```typescript
{
  success: boolean;
  results: Array<{ id: string; score: number; content: string }>;
}
```

### GET /api/profile
Get professional profile

**Response:**
```typescript
{
  success: boolean;
  data: {
    fullName: string;
    headline: string;
    skills: {...};
    experience: [...];
   ...
  };
}
```

### GET /api/health
Health check

**Response:**
```typescript
{
  status: "healthy" | "unhealthy";
  services: { groq: boolean; upstash: boolean };
  timestamp: string;
}
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** ShadCN UI
- **HTTP Client:** Axios
- **Vector DB:** Upstash Vector
- **LLM:** Groq (mixtral-8x7b)
- **Package Manager:** pnpm

## 📝 Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

## 🚀 Deployment

### Vercel

```bash
pnpm build
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Groq API](https://console.groq.com/docs)
- [Upstash Vector](https://upstash.com/docs/vector)

## 📄 License

MIT
