"""
Detailed Upstash diagnostic with HTTP response details
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("UPSTASH_VECTOR_REST_URL")
token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

print("="*60)
print("DETAILED UPSTASH DIAGNOSTIC")
print("="*60)

print("\n1. Testing HTTP Connection Directly...")

if not url or not token:
    print("✗ Missing URL or token in .env")
    exit(1)

try:
    # Make direct HTTP request to /info endpoint
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Remove trailing slash if present
    base_url = url.rstrip('/')
    info_url = f"{base_url}/info"
    
    print(f"   URL: {info_url}")
    print(f"   Token: {token[:30]}...{token[-10:]}")
    
    response = requests.get(info_url, headers=headers, timeout=10)
    
    print(f"\n   HTTP Status: {response.status_code}")
    print(f"   Response Headers: {dict(response.headers)}")
    print(f"   Response Body: {response.text[:500]}")
    
    if response.status_code == 200:
        print("\n✓ Connection successful!")
        print(f"Response: {response.json()}")
    elif response.status_code == 401:
        print("\n✗ Authentication failed (401)")
        print("   - Token is invalid or expired")
        print("   - Verify token in Upstash console matches .env")
    elif response.status_code == 404:
        print("\n✗ Index not found (404)")
        print("   - Index might be deleted")
        print("   - Verify URL points to correct index")
    else:
        print(f"\n✗ Server error ({response.status_code})")
        print(f"   - {response.text}")
        
except Exception as e:
    print(f"\n✗ Connection failed: {e}")
    print("   - Check internet connection")
    print("   - Verify URL is accessible")
    print(f"   - Try: curl -H 'Authorization: Bearer {token[:20]}...' {url}/info")

print("\n" + "="*60)
print("ACTION ITEMS:")
print("="*60)
print("""
1. Go to https://console.upstash.com/
2. Click on your Vector index
3. Copy the REST URL and Token from the console
4. Update .env file (without quotes):
   UPSTASH_VECTOR_REST_URL=https://...
   UPSTASH_VECTOR_REST_TOKEN=ABC...
5. Run this diagnostic again

If still failing:
- Check index status (should be "Active")
- Try creating a new index if old one is deleted
- Verify Upstash account billing is active
""")
