# Phase 4: Frontend Development Setup

**Status:** Ready to Execute  
**Time:** 5-10 minutes  
**Prerequisites:** Node.js 18+, pnpm installed  

---

## 🎯 What's Happening

1. Install all frontend dependencies (React, Next.js, Tailwind, etc.)
2. Start development server
3. Test the UI interface
4. Verify all components render correctly

---

## 🚀 Quick Start (3 Commands)

### Step 1: Navigate to Frontend

```bash
cd c:\Users\vivia\Documents\digital-twin-workshop\frontend
```

### Step 2: Install Dependencies

```bash
pnpm install
```

**What this does:**
- Downloads React 19, Next.js 15, Tailwind, ShadCN UI, etc.
- Creates `node_modules` folder
- Time: 2-3 minutes

**If you see warnings:** That's OK, they're usually optional peer dependencies

### Step 3: Start Development Server

```bash
pnpm dev
```

**Expected output:**
```
▲ Next.js 15.5.3
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

---

## 🌐 Access the Interface

Once you see "Ready in X seconds":

1. **Open Browser:** http://localhost:3000
2. **You should see:**
   - Page title: "Digital Twin"
   - Two tabs: "Chat" and "Profile"
   - Clean, dark interface

---

## 📋 What to Test

### Test 1: Navigation
- [ ] Page loads without errors
- [ ] Can see "Chat" and "Profile" tabs
- [ ] Tabs can be clicked
- [ ] Interface is responsive

### Test 2: Chat Tab
- [ ] Text input field appears
- [ ] "Send" button visible
- [ ] Type a message: "Hello"
- [ ] Click Send
- [ ] You see the message history (might show loading/no response without embeddings)

### Test 3: Profile Tab
- [ ] Profile data loads
- [ ] See your name: "Vivian Mibei"
- [ ] See skills, experience, education
- [ ] Data displays correctly

### Test 4: UI Components
- [ ] Input field works
- [ ] Buttons respond to clicks
- [ ] Text is readable (good contrast)
- [ ] Dark mode looks good

---

## 🛠️ Development Server Tips

### Restart Server
- Stop: `Ctrl + C` in terminal
- Start: `pnpm dev` again

### Hot Reload
- Changes to `.tsx` files reload automatically
- Changes to styles reload automatically
- No need to restart (usually)

### Check Errors
- Check **terminal** for server-side errors
- Open **browser DevTools** (F12) for client-side errors
- Check **Network tab** for API call failures

---

## 📊 Expected Response Flow (without embeddings)

### When you send a chat message:

1. ✅ **Message appears** in chat window
2. ✅ **API call made** to `/api/chat`
3. ⏳ **Loading state** shows (spinner)
4. ⚠️ **Response might be generic** (no profile context yet - that's OK!)
5. ✅ **Response displays** with timestamp

The response won't be smart yet without embeddings, but the UI should work perfectly.

---

## 🔧 Troubleshooting Frontend

### Issue: `pnpm: command not found`

```bash
# Install pnpm
npm install -g pnpm

# Check it's installed
pnpm --version

# Then try again
pnpm install
```

### Issue: `node_modules` errors

```bash
# Clean install
rm -r node_modules
pnpm install
```

### Issue: Port 3000 already in use

```bash
# Use different port
pnpm dev -- -p 3001

# Then visit http://localhost:3001
```

### Issue: Module not found errors

```bash
# This usually fixes it
pnpm install

# If still broken, try
pnpm install --force
```

### Issue: TypeScript errors

The `.tsx` files might show type errors. These usually:
- Resolve after `pnpm install` completes
- Don't prevent the app from running
- Can be ignored for now

---

## 📈 Next Phase After Frontend Works

Once you can access http://localhost:3000:

**Phase 4A: Verify API Endpoints** (10 min)
```bash
# In a NEW terminal (keep dev server running):
curl http://localhost:3000/api/health
curl http://localhost:3000/api/profile

# Both should return success responses
```

**Phase 4B: Fix Upstash & Add Embeddings** (when ready)
1. Create new Upstash Vector index
2. Update credentials in `.env`
3. Run `python embed_digitaltwin.py`
4. Chat will now have smart responses

**Phase 4C: Additional Components**
- Use MCP server to generate more UI components
- Add SearchResults interface
- Add Conversation history viewer
- Customize styling

---

## ✅ Success Checklist

- [ ] `pnpm install` completed without fatal errors
- [ ] `pnpm dev` shows "Ready in X seconds"
- [ ] Browser loads http://localhost:3000
- [ ] Page title shows "Digital Twin"
- [ ] Tabs visible (Chat, Profile)
- [ ] Chat input field works
- [ ] Profile tab shows data
- [ ] No critical errors in browser console

---

## 📚 File Structure Reference

```
frontend/
├── app/
│   ├── page.tsx          ← Main page with tabs
│   ├── layout.tsx        ← Root layout
│   ├── globals.css       ← Styles
│   └── api/
│       ├── chat/         ← Chat endpoint
│       ├── search/       ← Search endpoint
│       ├── profile/      ← Profile endpoint
│       └── health/       ← Health check
├── components/
│   ├── ChatInterface.tsx ← Chat comp
│   ├── ProfileViewer.tsx ← Profile comp
│   └── ui/               ← ShadCN UI
├── lib/
│   ├── vector.ts         ← Upstash utils
│   ├── groq.ts           ← LLM utils
│   └── logger.ts         ← Logging
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🎯 What Success Looks Like

### ✓ Working Frontend
- Clean interface with two tabs
- Chat tab with message history
- Profile tab with your data
- Smooth interactions
- Proper styling

### ✓ API Integration (ready, just needs embeddings)
- Chat endpoint works
- Search endpoint ready
- Profile endpoint provides data
- Health check passes

### ⏸️ Chat Context (waiting for embeddings)
- Chat interface works perfectly
- Responses are generic (no profile context)
- Embeddings can be added later

---

## 📞 Quick Commands Reference

```bash
# Navigate
cd frontend

# Install
pnpm install

# Start dev server
pnpm dev

# Stop server
Ctrl + C

# Clean reinstall
rm -r node_modules
pnpm install

# Use different port
pnpm dev -- -p 3001

# Build for production
pnpm build

# Start production server
pnpm start
```

---

**Ready?** → Run in terminal:
```bash
cd c:\Users\vivia\Documents\digital-twin-workshop\frontend
pnpm install
pnpm dev
```

Then visit: http://localhost:3000

---

**Status:** ✅ Ready to Execute  
**Time:** ~5-10 minutes  
**Next Phase:** Verify API endpoints & fix Upstash credentials
