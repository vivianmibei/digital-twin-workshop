# Digital Twin Embedding Pipeline Guide

**Status:** ✅ Ready to Execute  
**Purpose:** Vectorize your professional profile into Upstash Vector for RAG retrieval  
**Time Required:** 5-10 minutes  
**Prerequisites:** Python 3.8+, pip packages installed, Upstash credentials

---

## 🎯 What This Does

The embedding pipeline converts your professional profile (`digitaltwin.json`) into semantic chunks and uploads them to Upstash Vector. This enables:

- ✅ Semantic search across your profile
- ✅ RAG-powered chat responses with context
- ✅ Faster retrieval of relevant information
- ✅ Better response quality from Groq LLM

**Before Embedding:**
```
Chat Query → Vector Search → No Results (empty DB) → Generic Response ❌
```

**After Embedding:**
```
Chat Query → Vector Search → Find Relevant Chunks → LLM with Context → Smart Response ✅
```

---

## 📊 What Gets Embedded

Your profile is broken into **semantic chunks** (not just raw text):

### Chunk Types (7 categories)

| Type | Count | Content |
|------|-------|---------|
| **Profile Summary** | 1 | Name, headline, location, summary |
| **Skills** | 1 | All 19 technical & soft skills |
| **Certifications** | N | Each certification as separate chunk |
| **Experience** | N | Each job role with responsibilities |
| **Education** | N | Each degree/program separately |
| **Projects** | N | Each project with description |
| **Additional Details** | 1 | Career highlights & work ethic |

**Total Chunks:** ~11-15 per profile (depending on data)

### Example Chunks Created

```
CHUNK 1: Profile Summary
├─ Name: Vivian Mibei
├─ Headline: Data Analyst / Business Intelligence Developer
├─ Location: Sydney, Australia
└─ Summary: [Full professional summary]

CHUNK 2: Skills
├─ Full list of 19 skills
└─ Technical + Soft skills combined

CHUNK 3-5: Experience (3 jobs)
├─ Position, Company, Location
└─ Detailed responsibilities list

CHUNK 6-8: Education (3 programs)
├─ Institution, Degree, Date Range
└─ Each education separately

CHUNK 9-11: Projects (3 projects)
├─ Project name
└─ Description

CHUNK 12: Additional Details
├─ Work ethic
└─ Career highlights
```

---

## 🚀 Quick Start (2 Commands)

### Step 1: Install Python Dependencies

```bash
pip install python-dotenv upstash-vector
```

Or use the existing requirements:

```bash
pip install -r requirements.txt
```

### Step 2: Set Environment Variables

Create a `.env` file in the project root:

```bash
# Copy this template and fill in your actual credentials
UPSTASH_VECTOR_REST_URL=https://us1-xxx-xxx.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here
GROQ_API_KEY=your_groq_key_here
```

**Get these from:**
- Upstash Vector: https://console.upstash.com/
- Groq API: https://console.groq.com/

### Step 3: Run the Embedding Script

```bash
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

============================================================
VERIFYING EMBEDDINGS
============================================================
✓ Vector search successful!
✓ Found 3 relevant results for test query

Top result: Core Competencies

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

============================================================
✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY
============================================================

Your Digital Twin is now ready for RAG queries!
• Chat interface can now search your profile
• Try asking about skills, experience, or projects
```

---

## 🔍 Under the Hood

### How Embedding Works

1. **Chunking** - Break profile into semantic chunks
   ```python
   # Each chunk is a logical unit with metadata
   {
     "content": "Position: Data Analyst...",
     "type": "experience",
     "name": "Data Analyst at AusBiz Consulting",
     "source": "experience"
   }
   ```

2. **ID Generation** - Create unique identifiers
   ```python
   chunk_id = "experience_a1b2c3d4"  # Type + hash of content
   ```

3. **Metadata Tagging** - Add searchable metadata
   ```python
   metadata = {
     "type": "experience",
     "name": "Data Analyst at AusBiz Consulting",
     "source": "experience",
     "content_preview": "Position: Data Analyst..."
   }
   ```

4. **Upstash Upload** - Upsert to vector database
   ```python
   vector_index.upsert(
     vectors=[{
       "id": chunk_id,
       "data": chunk['content'],  # Auto-embedded by Upstash
       "metadata": metadata
     }]
   )
   ```

5. **Verification** - Test with sample query
   ```python
   results = vector_index.query(
     data="What are your main skills?",
     top_k=3,
     include_metadata=True
   )
   ```

### Vector Dimensions

- **Embedding Model:** Upstash default (384D)
- **Chunk Size:** 300-500 tokens per chunk
- **Similarity Threshold:** 0.3 (in chat endpoint)
- **Top K Results:** 5 (in chat pipeline)

---

## ✅ Verification Checklist

After running the embedding script:

### 1. Check Script Completed
```bash
# Look for this in output:
✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY
```

### 2. Verify Upstash Dashboard
1. Go to https://console.upstash.com/
2. Select your Vector index
3. Check "Vectors" tab
4. Should show ~12 vectors

### 3. Test with Search Endpoint

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are your main skills?",
    "topK": 3
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "skills_a1b2c3d4",
      "score": 0.87,
      "content": "Professional Skills: Data Visualization...",
      "metadata": {
        "type": "skills",
        "name": "Core Competencies"
      }
    },
    ...
  ]
}
```

### 4. Test Chat Endpoint

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about your experience with Power BI"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Tell me about your experience with Power BI",
    "response": "Based on your profile, you have extensive experience with Power BI...",
    "sources": ["skills", "experience"],
    "tokenUsage": {
      "inputTokens": 234,
      "outputTokens": 156
    }
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN"

**Solution:**
1. Create `.env` file in project root
2. Add Upstash credentials
3. Verify file is named exactly `.env` (not `.env.local` or `.env.txt`)

### Issue: "Connection refused" or timeout

**Solution:**
1. Check internet connection
2. Verify Upstash credentials are correct
3. Try pinging: `curl https://your-upstash-url/health`
4. Check if index is active in Upstash console

### Issue: "Vector search returned no results"

**Solution:**
1. Wait 10-30 seconds after upload (Upstash indexing)
2. Check vector count in Upstash console
3. Try re-running embedding script
4. Verify all chunks were created (check script output)

### Issue: "digitaltwin.json not found"

**Solution:**
1. Verify file exists: `ls digitaltwin.json`
2. Check working directory: `pwd`
3. Should be in project root (same level as embed_digitaltwin.py)
4. Verify JSON is valid: `python -m json.tool digitaltwin.json`

### Issue: HTTP 401 or 403 from Upstash

**Solution:**
1. Check token hasn't expired
2. Verify full URL and token match Upstash console exactly
3. Regenerate token if needed
4. Check index is in correct region

---

## 📈 Next Steps After Embedding

### 1. Start Frontend Development
```bash
cd frontend
pnpm install
pnpm dev
```

### 2. Test Chat Interface
- Go to http://localhost:3000
- Switch to "Chat" tab
- Ask questions about your profile
- Example: "What technologies are you skilled in?"

### 3. Run Full System Tests
```bash
# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/profile
curl -X POST http://localhost:3000/api/chat -d '{"message":"Hello"}'
```

### 4. Monitor Performance
- Check response times
- Monitor token usage
- Track API errors
- Optimize chunk sizes if needed

---

## 💡 Advanced: Customizing Chunking

To change how profile is chunked, edit these functions in `embed_digitaltwin.py`:

```python
def chunk_profile_data(profile):
    """Customize chunking strategy here"""
    # Break profile into smaller chunks (more granular)
    # Or combine chunks (less granular)
    # Examples:
    
    # Option 1: Chunk by skill category
    technical_skills = [s for s in skills if s in technical_list]
    soft_skills = [s for s in skills if s in soft_list]
    
    # Option 2: Combine all experience into one chunk
    all_experience = " ".join([job['responsibilities'] for job in ...])
    
    # Option 3: Create chunks by company
    for company in get_unique_companies(...):
        company_experience = filter_by_company(...)
```

### Chunk Size Recommendations

- **Smaller chunks** (current): Better semantic search, more queries
- **Larger chunks**: Fewer vectors, lower cost, less precise search
- **Mixed strategy**: Different sizes for different types (1 chunk for skills, many for experience)

---

## 📊 Embedding Statistics

After successful embedding:

| Metric | Value |
|--------|-------|
| Total Chunks | ~12-15 |
| Chunk Types | 7 |
| Embedding Model | Upstash Default (384D) |
| Vector Size | ~384 dimensions |
| Index Size | ~50-100KB |
| Search Time | <500ms |
| Upload Time | ~10-20 seconds |

---

## 🎯 Success Criteria

✅ **Embedding Successful When:**
- Script completes with "✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY"
- All 12+ chunks show ✓ (zero failures)
- Verification query returns results
- Vector count in Upstash console matches chunk count
- Chat endpoint returns responses with sources

---

## 📚 Additional Resources

- [Upstash Vector Docs](https://upstash.com/docs/vector/overall/getstarted)
- [RAG Patterns](https://upstash.com/docs/vector/features/embeddingmodels)
- [Groq API Docs](https://console.groq.com/docs)
- [Vector Search Best Practices](https://upstash.com/docs/vector/features/indexed-search)

---

## ⏰ Time Breakdown

| Step | Time |
|------|------|
| Installation | 2 min |
| Configuration | 1 min |
| Running Script | 3 min |
| Verification | 2 min |
| **Total** | **~8 minutes** |

---

**Last Updated:** February 17, 2026  
**Status:** ✅ Ready to Execute  
**Next Phase:** Frontend Testing
