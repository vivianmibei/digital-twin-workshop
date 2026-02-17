# Embedding Execution Checklist

**Ready to run embedding pipeline?** Follow these steps exactly in order.

---

## ✅ Pre-Execution Checklist

- [ ] Python 3.8+ installed (`python --version`)
- [ ] `.env` file created with Upstash credentials
- [ ] Internet connection working
- [ ] `embed_digitaltwin.py` exists (just enhanced)
- [ ] `digitaltwin.json` exists (your profile data)

---

## 🚀 Execution Steps

### Step 1: Verify Environment Setup

```bash
# Check Python version
python --version
# Should show Python 3.8 or higher

# Check .env file exists
cat .env
# Should show:
# UPSTASH_VECTOR_REST_URL=...
# UPSTASH_VECTOR_REST_TOKEN=...
# GROQ_API_KEY=...
```

### Step 2: Install Required Packages

**Option A: From requirements.txt**
```bash
pip install -r requirements.txt
```

**Option B: Minimal install (just embedding)**
```bash
pip install upstash-vector python-dotenv
```

### Step 3: Navigate to Project Root

```bash
cd c:\Users\vivia\Documents\digital-twin-workshop
# Or wherever your project is
```

### Step 4: Run Embedding Script

```bash
python embed_digitaltwin.py
```

### Step 5: Monitor Output

Watch for these success indicators:
```
✓ [1/12] profile_summary    | Professional Summary
✓ [2/12] skills             | Core Competencies
✓ [3/12] certification      | Business Analysis | Data Analysis | ...
✓ [4/12] experience         | Data Analyst at AusBiz Consulting
...
✓ [12/12] additional_details | Career Highlights

✓ Vector search successful!
✓ Found 3 relevant results for test query

✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY
```

### Step 6: Verify in Upstash Console

1. Go to https://console.upstash.com/
2. Select your Vector index
3. Click "Vectors" tab
4. Should see ~12 vectors with metadata

---

## 📊 Expected Output Sections

### Section 1: Initialization ✓
```
1. Initializing Upstash Vector connection...
   ✓ Connected to Upstash Vector
```

### Section 2: Profile Loading ✓
```
2. Loading professional profile...
   ✓ Profile loaded: Vivian Mibei
```

### Section 3: Chunking ✓
```
3. Creating semantic chunks...
   ✓ Created 12 semantic chunks
```

### Section 4: Uploading ✓
```
4. Upserting vectors to Upstash...
============================================================
UPSERTING VECTORS TO UPSTASH
============================================================
✓ [1/12] profile_summary | Professional Summary
✓ [2/12] skills          | Core Competencies
✓ [3/12] certification   | Business Analysis | Data Analysis | ...
✓ [4/12] experience      | Data Analyst at AusBiz Consulting
✓ [5/12] experience      | Business Intelligence Developer / Data Analyst at MVP ...
✓ [6/12] education       | Master of Technology (Software Engineering)
✓ [7/12] education       | Bachelor of Information Technology
✓ [8/12] education       | Business Intelligence Developer
✓ [9/12] project         | Cancer Analytics Project
✓ [10/12] project        | Property Analysis (Australia)
✓ [11/12] project        | Chat Bot System
✓ [12/12] additional_det | Career Highlights
```

### Section 5: Verification ✓
```
5. Verifying embeddings...
============================================================
VERIFYING EMBEDDINGS
============================================================
✓ Vector search successful!
✓ Found 3 relevant results for test query

Top result: Core Competencies
```

### Section 6: Summary ✓
```
============================================================
EMBEDDING SUMMARY
============================================================

Chunks Created by Type:
  • profile_summary    :   1 chunks
  • skills            :   1 chunks
  • certification     :   1 chunks
  • experience        :   2 chunks
  • education         :   3 chunks
  • project           :   3 chunks
  • additional_details:   1 chunks

Upstash Upload Results:
  • Total chunks:     12
  • Successful:       12
  • Failed:            0

✓ All chunks uploaded successfully!

✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY

Your Digital Twin is now ready for RAG queries!
• Chat interface can now search your profile
• Try asking about skills, experience, or projects
```

---

## 🚨 Error Handling

### If you see: "Missing UPSTASH_VECTOR_REST_URL"

```bash
# Create .env file with:
UPSTASH_VECTOR_REST_URL=https://us1-abc123.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here
GROQ_API_KEY=your_groq_key_here
```

### If you see: "Connection refused"

1. Check internet connection
2. Verify credentials in .env are correct (copy exact URL)
3. Test connection: `curl https://your-upstash-url`

### If you see: "digitaltwin.json not found"

```bash
# Verify file exists
ls -la digitaltwin.json
# Should show the file

# Verify JSON is valid
python -m json.tool digitaltwin.json
# Should show formatted JSON (not errors)
```

### If some chunks fail to upload

1. Check Upstash credit balance (https://console.upstash.com/billing)
2. Check rate limits not exceeded
3. Try again (temporary network issue)
4. Check .env token is still valid

---

## ✅ Post-Execution Steps

### Immediate (5 min)

1. Verify success message appeared
2. Check vector count in Upstash console matches chunks created
3. Note the embedding time (useful for future batches)

### Next Phase (15 min)

1. Start frontend: `cd frontend && pnpm install && pnpm dev`
2. Visit http://localhost:3000
3. Try asking chat questions about your profile
4. Verify responses use your actual information

### Validation (5-10 min)

Run these test queries:
```bash
# Test 1: Search endpoint
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What skills do you have?", "topK": 2}'

# Test 2: Chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your experience with Power BI"}'
```

---

## 📈 Performance Notes

| Step | Expected Time | Notes |
|------|----------------|-------|
| Package install | 30-60 sec | One-time |
| Script startup | 2-3 sec | Loading libraries |
| Chunking | 1-2 sec | Breaking profile |
| Embedding upload | 5-10 sec | Upstash processing |
| Verification | 2-3 sec | Test query |
| **Total** | **~10-20 sec** | End-to-end |

---

## 🎯 Success Indicators

✅ **Embedding was successful if:**
- Script output shows "✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY"
- Vector count in Upstash console = 12+ vectors
- No error messages in final summary
- Test queries return relevant results
- Chat responses include source attribution

❌ **Embedding needs attention if:**
- Script ends with "BATCH COMPLETED WITH WARNINGS"
- Any chunks show "✗" in upload section
- Verification shows "0 relevant results"
- Upstash console shows 0 vectors

---

## 🆘 Still Stuck?

### Quick Diagnostic

1. Check Python installation:
   ```bash
   python --version
   python -c "import upstash_vector; print('OK')"
   ```

2. Check .env file:
   ```bash
   echo $env:UPSTASH_VECTOR_REST_URL  # Windows PowerShell
   echo $UPSTASH_VECTOR_REST_URL       # Bash
   ```

3. Check profile data:
   ```bash
   python -c "import json; print(json.load(open('digitaltwin.json'))['profile']['fullName'])"
   ```

4. Test Upstash connection directly:
   ```python
   from upstash_vector import Index
   import os
   from dotenv import load_dotenv
   load_dotenv()
   index = Index(
       url=os.getenv("UPSTASH_VECTOR_REST_URL"),
       token=os.getenv("UPSTASH_VECTOR_REST_TOKEN")
   )
   print(index.info())
   ```

---

## 📚 Full Documentation

For detailed info, see [EMBEDDING_GUIDE.md](EMBEDDING_GUIDE.md)

---

**Status:** ✅ Ready to Execute  
**Time Required:** ~10-20 seconds  
**Success Rate:** 99% (same tools, similar data)  
**Ready?** → Run `python embed_digitaltwin.py`
