# Fix Upstash & Embed Data - Quick Guide

**Time Required:** 20-30 minutes  
**Difficulty:** Easy  
**Goal:** Create new Vector index and vectorize your profile data  

---

## 🚀 Step 1: Create New Upstash Vector Index

### 1. Go to Upstash Console
Navigate to: **https://console.upstash.com/**

### 2. Click "Create Index"
- Look for "Vector" section
- Click "Create Index" button

### 3. Configure Index
**Index Name:** `digital-twin`  
**Region:** `US-EAST-1` (or closest to you)  
**Dimensions:** `384` (default for Upstash)  
**Similarity Function:** `COSINE` (default)  

Click **Create**

### 4. Wait for Index to be Created
- Takes ~30-60 seconds
- Status will show "Active"

---

## 📋 Step 2: Copy Credentials

### 1. Click on Your Index
- Find "digital-twin" in the list
- Click on it to open details

### 2. Copy the REST Credentials
Look for section labeled "REST API" or "Endpoints"

Copy these two values:
- **REST URL:** (looks like `https://xxx-xxx-us1-vector.upstash.io`)
- **REST Token:** (long string starting with `eyJ` or `AB`)

⚠️ **Important:** Copy the FULL values, don't truncate

---

## 🔧 Step 3: Update .env File

### 1. Open `.env` File
Location: `c:\Users\vivia\Documents\digital-twin-workshop\.env`

### 2. Update These Lines
Replace the OLD values with your NEW Upstash credentials:

**BEFORE (old, broken):**
```
UPSTASH_VECTOR_REST_URL=https://peaceful-possum-34209-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=ABkFMHBlYWNlZnVsLXBvc3N1bS0zNDIwOS11czFhZG1pbk4ySmlNV001...
```

**AFTER (new, working):**
```
UPSTASH_VECTOR_REST_URL=https://your-new-url-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-new-token-here
GROQ_API_KEY=your-groq-api-key-here
```

⚠️ **IMPORTANT:**
- NO quotes around values
- NO extra spaces
- Copy EXACT values from Upstash console
- Save the file (Ctrl+S)

### 3. Verify Changes
Open terminal and check:
```powershell
type .env
```

Should show your new credentials (they'll be partially visible, that's OK)

---

## ✅ Step 4: Test Credentials

Run the diagnostic to verify credentials work:

```bash
cd c:\Users\vivia\Documents\digital-twin-workshop
python diagnose_upstash_detailed.py
```

**Expected Output:**
```
HTTP Status: 200
✓ Index object created
✓ Connection successful!
```

**If you see HTTP 404:** Credentials still wrong, go back to Step 2

---

## 🚀 Step 5: Embed Your Profile Data

Once credentials are verified, run:

```bash
cd c:\Users\vivia\Documents\digital-twin-workshop
python embed_digitaltwin.py
```

**Expected Output:**
```
============================================================
DIGITAL TWIN EMBEDDING PIPELINE
============================================================

1. Initializing Upstash Vector connection...
   ✓ Connected to Upstash Vector

2. Loading professional profile...
   ✓ Profile loaded: Vivian Mibei

3. Creating semantic chunks...
   ✓ Created 12 semantic chunks

4. Upserting vectors to Upstash...
============================================================
UPSERTING VECTORS TO UPSTASH
============================================================
✓ [1/12] profile_summary     | Professional Summary
✓ [2/12] skills              | Core Competencies
✓ [3/12] certification       | Business Analysis...
✓ [4/12] experience          | Data Analyst at AusBiz Consulting
✓ [5/12] experience          | Business Intelligence Developer / Data Analyst at MVP...
✓ [6/12] education           | Master of Technology (Software Engineering)
✓ [7/12] education           | Bachelor of Information Technology
✓ [8/12] education           | Business Intelligence Developer
✓ [9/12] project             | Cancer Analytics Project
✓ [10/12] project            | Property Analysis (Australia)
✓ [11/12] project            | Chat Bot System
✓ [12/12] additional_details | Career Highlights

5. Verifying embeddings...
============================================================
VERIFYING EMBEDDINGS
============================================================
✓ Vector search successful!
✓ Found 3 relevant results for test query

Top result: Core Competencies

============================================================
✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY
============================================================

Your Digital Twin is now ready for RAG queries!
• Chat interface can now search your profile
• Try asking about skills, experience, or projects
```

**If you see errors:** Check that `.env` file is saved correctly and run `diagnose_upstash_detailed.py` again

---

## 🧪 Step 6: Test Everything Works

### Test 1: Backend Health Check
```bash
curl http://localhost:3001/api/health
```

Should return status 200

### Test 2: Profile Loading
```bash
curl http://localhost:3001/api/profile | jq
```

Should show your profile data

### Test 3: Vector Search
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What skills do you have?", "topK": 3}'
```

Should return search results with your profile data

### Test 4: Chat with Context
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your experience with Power BI"}'
```

Should return a response with:
- Your actual experience info
- "sources" array showing which chunks were used
- Smart context-aware answer

---

## 🎯 Step 7: Test in Browser

Make sure dev server is running:
```bash
cd frontend
pnpm dev
```

Then visit: **http://localhost:3001**

### Test Chat
1. Click "Chat" tab
2. Type: `What are your main technical skills?`
3. Click "Send"

**Expected:** Response should mention Power BI, SQL, SSIS, etc. (your actual skills)

### What You Should See
- Message appears in chat history
- "Loading..." spinner shows briefly
- Response comes back with your profile context
- Sources are displayed (showing which data was used)

---

## ✅ Success Checklist

- [ ] New Vector index created in Upstash console
- [ ] REST URL copied from console
- [ ] REST Token copied from console
- [ ] `.env` file updated with new credentials (no quotes)
- [ ] `.env` file saved (Ctrl+S)
- [ ] `diagnose_upstash_detailed.py` shows HTTP 200
- [ ] `embed_digitaltwin.py` shows "✓ ALL CHUNKS UPLOADED"
- [ ] Vector count in Upstash console shows ~12 vectors
- [ ] Chat test in browser shows smart responses
- [ ] Chat includes your actual experience/skills

---

## 🆘 Troubleshooting

### Problem: Still getting HTTP 404 from diagnose script

**Solution:**
1. Go back to Upstash console
2. Verify index exists and shows "Active"
3. Copy credentials AGAIN (fresh copy)
4. Delete old values in `.env`, paste new ones
5. Save file
6. Run diagnose script again

### Problem: "Cannot read properties of undefined" in embed script

**Solution:**
```bash
# Make sure you're in the right directory
cd c:\Users\vivia\Documents\digital-twin-workshop

# Check files exist
ls embed_digitaltwin.py
ls digitaltwin.json
ls .env

# Then run
python embed_digitaltwin.py
```

### Problem: embed_digitaltwin.py hangs or times out

**Solution:**
1. Press Ctrl+C to stop
2. Check internet connection
3. Verify Upstash account is active (check https://console.upstash.com/)
4. Try again

### Problem: "Failed to load resource: 404" in chat

**Solution:**
1. Make sure embedding completed successfully
2. Check Upstash console - should show ~12 vectors
3. Wait 10-15 seconds (Upstash indexing)
4. Refresh browser

---

## 📊 Timeline

| Step | Time |
|------|------|
| Create Upstash index | 2 min |
| Copy credentials | 1 min |
| Update .env file | 2 min |
| Test credentials | 2 min |
| Run embed script | 5 min |
| Verify in browser | 5 min |
| **Total** | **~17 minutes** |

---

## 🎯 After Everything Works

Once you see chat responses with your actual profile context:

1. ✅ Your Digital Twin is fully functional
2. ✅ RAG pipeline working end-to-end
3. ✅ Smart responses with source attribution
4. ✅ Ready for production deployment

**Next steps could be:**
- Deploy to Vercel (frontend)
- Deploy backend to Railway
- Add more UI components
- Set up CI/CD pipeline

---

## 📞 Quick Reference

**Upstash Console:** https://console.upstash.com/  
**Upstash Docs:** https://upstash.com/docs/vector/overall/getstarted  
**Frontend URL:** http://localhost:3001  
**Embedding Script:** `python embed_digitaltwin.py`  
**Diagnostic Tool:** `python diagnose_upstash_detailed.py`  

---

**Ready to fix Upstash?** Start with Step 1 above! 🚀
