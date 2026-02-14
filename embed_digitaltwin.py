# Essential imports for Digital Twin RAG System
import os
import json
from dotenv import load_dotenv
from upstash_vector import Index
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Initialize Upstash Vector Index
vector_index = Index(
    url=os.getenv("UPSTASH_VECTOR_REST_URL"),
    token=os.getenv("UPSTASH_VECTOR_REST_TOKEN")
)

# Initialize Groq client
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Load your professional profile
with open('digitaltwin.json', 'r') as f:
    profile_data = json.load(f)

print("Digital Twin RAG System initialized successfully!")
print(f"Profile loaded: {profile_data['profile']['fullName']}")