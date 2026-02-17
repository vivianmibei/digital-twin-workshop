# Fix Upstash Credentials

**Issue:** `Expecting value: line 1 column 1` error  
**Cause:** Invalid or expired Upstash credentials

---

## ✅ Quick Fix (5 minutes)

### Step 1: Check Your Upstash Console

1. Go to: https://console.upstash.com/
2. Sign in to your account
3. Look for your **Vector** index in the dashboard

### Step 2: Verify Index Exists

- [ ] You can see a vector index listed
- [ ] Index status shows "Active" (not disabled/deleted)
- [ ] Index is in the correct region (us1, eu1, etc.)

**If index doesn't exist:**
→ Create new index:
1. Click "Create Index"
2. Name it: `digital-twin`
3. Select region: `us1` (or your closest region)
4. Create

### Step 3: Get Fresh Credentials

1. Click on your vector index name
2. Look for "Credentials" or "REST API"
3. Copy these exact values:
   - **REST URL:** `https://xxx-xxx-us1-vector.upstash.io`
   - **REST Token:** `ABxxxx...` (long string)

⚠️ **Important:** Copy the FULL URL and token, including all characters

### Step 4: Update `.env` File

In `c:\Users\vivia\Documents\digital-twin-workshop\.env`:

```bash
UPSTASH_VECTOR_REST_URL=https://peaceful-possum-34209-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=ABkFMHBlYWNlZnVsLXBv...MxTldSbQ==
GROQ_API_KEY=your_groq_key_here
```

**Make sure:**
- ✅ No extra spaces
- ✅ Full URL (including https://)
- ✅ Full token (don't truncate)
- ✅ File saved

### Step 5: Test Connection

```bash
python diagnose_upstash.py
```

**Should see:**
```
✓ ALL CHECKS PASSED
Your Upstash Vector setup is working correctly!
```

### Step 6: Run Embedding

```bash
python embed_digitaltwin.py
```

---

## 🔧 Troubleshooting

### Still getting "Expecting value" error?

1. **Verify token format:**
   - Should be a long string (100+ characters)
   - Should start with `eyJ` or `AB`
   - NOT a key name, just the value

2. **Check for hidden characters:**
   ```bash
   # Display .env file
   cat .env
   # Should show the actual credentials, not encrypted
   ```

3. **Try regenerating credentials:**
   - Go to Upstash console
   - Click your index
   - Delete old token
   - Create new token
   - Copy new credentials

4. **Check URL format:**
   - Should be: `https://xxx-xxx-us1-vector.upstash.io`
   - NOT: `https://xxx-xxx-us1-vector.upstash.io/` (no trailing slash)
   - Check region code (us1, eu1, etc.)

### Index doesn't exist?

1. Go to https://console.upstash.com/
2. Create new Vector index
3. Name: `digital-twin`
4. Copy new credentials to `.env`
5. Re-run embedding

### Token expired?

Vector tokens don't automatically expire, but:
1. Check Upstash account status (active, not suspended)
2. Check billing is current
3. Try creating a new token in console
4. Update `.env` with new token

---

## 📋 Credential Checklist

- [ ] Upstash Vector index exists and is "Active"
- [ ] REST URL copied exactly from console
- [ ] REST Token copied exactly from console
- [ ] `.env` file updated with new credentials
- [ ] No trailing/leading spaces in `.env`
- [ ] `.env` file is saved (Ctrl+S)
- [ ] `diagnose_upstash.py` shows "✓ ALL CHECKS PASSED"

---

## 🆘 Still Stuck?

### Double-check token value

Your current `.env` shows:
```
Token: ABkFMHBlYWNlZnVsLXBv...MxTldSbQ==
```

This might be incorrect. Go to Upstash console and:
1. Go to Manage → Tokens (if available)
2. OR click your index and look for "REST API" section
3. Copy the exact REST API credentials provided
4. Paste into `.env`

### Verify file is readable

```bash
# Check .env exists
ls .env

# Display contents (don't copy output)
type .env
```

---

## ✅ Once Fixed

After credentials are updated:

```bash
# Test
python diagnose_upstash.py

# Should output:
# ✓ ALL CHECKS PASSED
# Your Upstash Vector setup is working correctly!

# Then run embedding
python embed_digitaltwin.py
```

---

**Need help?** Check Upstash docs: https://upstash.com/docs/vector/overall/getstarted
