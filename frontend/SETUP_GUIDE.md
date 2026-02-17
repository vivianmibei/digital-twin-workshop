# Next.js Frontend Setup Guide

## Overview

This directory contains a fully scaffolded Next.js 15 frontend for the Digital Twin RAG system. All dependencies are configured, and the project structure is ready for development.

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

This installs all required packages:
- Next.js 15.5.3
- React 19
- TypeScript
- Tailwind CSS
- ShadCN UI components
- Axios HTTP client
- Upstash Vector SDK
- Groq SDK

### 2. Configure Environment Variables

Create `.env.local` with your credentials:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
UPSTASH_VECTOR_REST_URL=https://your-instance.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here
GROQ_API_KEY=your_api_key_here
NODE_ENV=development
```

### 3. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

### `/app` - App Router (Next.js 15)
- `page.tsx` - Main page with tabs for Chat and Profile
- `layout.tsx` - Root layout
- `globals.css` - Global Tailwind styles
- `/api` - API routes for backend integration

### `/components` - React Components
- `/ui` - ShadCN UI components (Button, Input, Card, Tabs)
- `ChatInterface.tsx` - Main chat component
- `ProfileViewer.tsx` - Profile display
- `SearchResults.tsx` - (Template for search display)

### `/lib` - Utilities
- `utils.ts` - Helper functions (classname merging)
- `vector.ts` - Upstash Vector operations
- `groq.ts` - Groq API integration
- `logger.ts` - Console logging utility
- `/api/client.ts` - Axios API client

## API Routes Overview

All routes are in `/app/api/`:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/chat` | POST | Send message, get AI response |
| `/api/search` | POST | Search vector database |
| `/api/profile` | GET | Retrieve professional profile |
| `/api/embed` | POST | Generate text embeddings |
| `/api/health` | GET | Check service health |

## Development Tasks

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Code Formatting
```bash
pnpm format
```

### Building
```bash
pnpm build
pnpm start
```

## TODO - Next Implementation Steps

### 1. Implement API Routes
- [ ] `/api/chat` - Integrate with Groq + Vector search
- [ ] `/api/search` - Implement Upstash Vector search
- [ ] `/api/profile` - Load profile from digitaltwin.json
- [ ] `/api/embed` - Generate embeddings

### 2. Server Actions (Optional)
- [ ] Create `app/actions/chat.ts` for server-side chat logic
- [ ] Create `app/actions/search.ts` for RAG operations

### 3. Component Development
- [ ] Enhance `ChatInterface` with error states
- [ ] Add conversation history management
- [ ] Implement loading skeletons
- [ ] Add message animations

### 4. Testing
- [ ] Unit tests for utilities
- [ ] Integration tests for API routes
- [ ] E2E tests for chat flow

### 5. Deployment
- [ ] Deploy to Vercel
- [ ] Set up environment variables on Vercel
- [ ] Configure custom domain (optional)

## Tech Stack Details

### Next.js 15
- App Router for file-based routing
- Built-in API routes
- Server components by default
- Image optimization
- Font optimization

### TypeScript
- Strict mode enabled
- Path aliases configured (@/ prefix)
- Full type safety across codebase

### Tailwind CSS
- Dark mode support
- CSS variables for theming
- Utility-first approach
- Responsive design (mobile-first)

### ShadCN UI
- Radix UI primitives
- Tailwind styling
- Copy-paste components (no node_modules)
- Dark mode included

### Upstash Vector
- REST API (no SDK restrictions)
- 384-dimensional embeddings
- Semantic search capability
- Metadata support

### Groq
- Fast LLM inference
- Mixtral 8x7b model
- Temperature/max_tokens configurable
- Low latency responses

## Troubleshooting

### Port 3000 already in use
```bash
pnpm dev -p 3001
```

### Dependencies not installing
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Environment variables not loading
- Check `.env.local` is in project root
- Restart dev server after updating
- Check variable names (must start with `NEXT_PUBLIC_` for client)

### API routes returning 500
- Check console for error messages
- Verify environment variables are set
- Test with curl or Postman

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [TypeScript in Next.js](https://nextjs.org/docs/basic-features/typescript)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Installation](https://ui.shadcn.com/docs/installation/next)
- [Groq API Reference](https://console.groq.com/docs)
- [Upstash Vector Docs](https://upstash.com/docs/vector)

## Support

For issues or questions, check:
1. The project's agents_customized.md for context
2. Individual component README comments
3. API route implementations as examples
4. Official documentation links above
