"""
Diagnose Upstash Vector connection issues
"""

import os
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("DIAGNOSTIC: Checking Upstash Vector Setup")
print("="*60)

# Check 1: Environment variables
print("\n1. Checking environment variables...")
url = os.getenv("UPSTASH_VECTOR_REST_URL")
token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

if url:
    print(f"   ✓ UPSTASH_VECTOR_REST_URL found")
    print(f"     URL: {url[:50]}...")
else:
    print("   ✗ UPSTASH_VECTOR_REST_URL not found")

if token:
    print(f"   ✓ UPSTASH_VECTOR_REST_TOKEN found")
    print(f"     Token: {token[:20]}...{token[-10:]}")
else:
    print("   ✗ UPSTASH_VECTOR_REST_TOKEN not found")

if not url or not token:
    print("\n✗ Missing credentials. Add to .env:")
    print("   UPSTASH_VECTOR_REST_URL=https://your-url")
    print("   UPSTASH_VECTOR_REST_TOKEN=your_token")
    exit(1)

# Check 2: Import libraries
print("\n2. Checking Python libraries...")
try:
    from upstash_vector import Index
    print("   ✓ upstash_vector imported")
except ImportError as e:
    print(f"   ✗ Failed to import upstash_vector: {e}")
    print("   Install with: pip install upstash-vector")
    exit(1)

# Check 3: Connect to Upstash
print("\n3. Connecting to Upstash Vector...")
try:
    index = Index(url=url, token=token)
    print("   ✓ Index object created")
except Exception as e:
    print(f"   ✗ Failed to create Index: {e}")
    exit(1)

# Check 4: Get index info
print("\n4. Fetching index information...")
try:
    info = index.info()
    print("   ✓ Index info retrieved successfully")
    print(f"   Vector count: {info.get('vector_count', 'unknown')}")
    print(f"   Index dimensions: {info.get('dimension', 'unknown')}")
    print(f"   Full info: {info}")
except Exception as e:
    print(f"   ✗ Failed to get index info: {e}")
    print("   This might be an authentication issue:")
    print("     - Verify token is correct (copy-paste from console)")
    print("     - Verify URL is correct (no typos)")
    print("     - Check token hasn't expired")
    print("     - Check index exists in Upstash console")
    exit(1)

# Check 5: Test upsert
print("\n5. Testing vector upsert...")
try:
    test_id = "test_diagnostic_vector"
    test_data = "This is a test to verify the connection works"
    test_metadata = {"type": "test", "source": "diagnostic"}
    
    # Use tuple format for upsert
    index.upsert(
        vectors=[
            (test_id, test_data, test_metadata)
        ]
    )
    print("   ✓ Test vector uploaded successfully")
except Exception as e:
    print(f"   ✗ Failed to upsert vector: {e}")
    print("   This could indicate:")
    print("     - Invalid token")
    print("     - Index doesn't exist")
    print("     - Network connectivity issue")
    print("     - Rate limit exceeded")
    exit(1)

# Check 6: Test query
print("\n6. Testing vector search...")
try:
    results = index.query(
        data="test",
        top_k=1,
        include_metadata=True
    )
    print("   ✓ Vector search works")
    if results:
        print(f"   Found {len(results)} result(s)")
        if len(results) > 0:
            print(f"   Top result ID: {results[0].get('id', 'unknown')}")
except Exception as e:
    print(f"   ✗ Failed to query: {e}")
    exit(1)

# Success!
print("\n" + "="*60)
print("✓ ALL CHECKS PASSED")
print("="*60)
print("\nYour Upstash Vector setup is working correctly!")
print("You can now run: python embed_digitaltwin.py")
