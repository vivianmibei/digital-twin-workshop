"""
Digital Twin Embedding Pipeline
Vectorizes professional profile data into Upstash Vector database for RAG retrieval
"""

import os
import json
import time
from typing import List, Dict, Any
from dotenv import load_dotenv
from upstash_vector import Index
import hashlib

# Load environment variables from .env file
load_dotenv()

# Initialize Upstash Vector Index
def initialize_vector_index() -> Index:
    """Initialize connection to Upstash Vector"""
    url = os.getenv("UPSTASH_VECTOR_REST_URL")
    token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
    
    if not url or not token:
        raise ValueError("Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN environment variables")
    
    return Index(url=url, token=token)

def load_profile_data(filepath: str = 'digitaltwin.json') -> Dict[str, Any]:
    """Load professional profile from JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def chunk_profile_data(profile: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Break profile into semantic chunks for embedding
    Each chunk represents a logical unit of information
    """
    chunks = []
    
    # 1. Profile Summary Chunk
    profile_info = profile.get('profile', {})
    summary_text = f"""
    Name: {profile_info.get('fullName')}
    Headline: {profile_info.get('headline')}
    Location: {profile_info.get('location')}
    Summary: {profile_info.get('summary')}
    """.strip()
    
    chunks.append({
        'content': summary_text,
        'type': 'profile_summary',
        'name': 'Professional Summary',
        'source': 'profile'
    })
    
    # 2. Skills Chunk
    skills = profile_info.get('skills', [])
    if skills:
        skills_text = f"Professional Skills: {', '.join(skills)}"
        chunks.append({
            'content': skills_text,
            'type': 'skills',
            'name': 'Core Competencies',
            'source': 'profile'
        })
    
    # 3. Certifications Chunk
    certifications = profile_info.get('certifications', [])
    for idx, cert in enumerate(certifications, 1):
        cert_text = f"""
        Certification {idx}: {cert.get('title')}
        Date Range: {cert.get('dateRange')}
        """.strip()
        chunks.append({
            'content': cert_text,
            'type': 'certification',
            'name': cert.get('title', f'Certification {idx}'),
            'source': 'profile'
        })
    
    # 4. Experience Chunks (one per job)
    experience = profile.get('experience', [])
    for idx, job in enumerate(experience, 1):
        exp_text = f"""
        Position: {job.get('title')}
        Company: {job.get('company')}
        Location: {job.get('location')}
        
        Responsibilities:
        {chr(10).join([f"- {resp}" for resp in job.get('responsibilities', [])])}
        """.strip()
        
        chunks.append({
            'content': exp_text,
            'type': 'experience',
            'name': f"{job.get('title')} at {job.get('company')}",
            'source': 'experience'
        })
    
    # 5. Education Chunks (one per institution)
    education = profile.get('education', [])
    for idx, edu in enumerate(education, 1):
        edu_text = f"""
        Institution: {edu.get('institution')}
        Degree: {edu.get('degree')}
        Period: {edu.get('startDate')} - {edu.get('endDate', 'Current')}
        """.strip()
        
        chunks.append({
            'content': edu_text,
            'type': 'education',
            'name': edu.get('degree'),
            'source': 'education'
        })
    
    # 6. Projects Chunks (one per project)
    projects = profile.get('projects', [])
    for idx, project in enumerate(projects, 1):
        proj_text = f"""
        Project: {project.get('name')}
        Description: {project.get('description')}
        """.strip()
        
        chunks.append({
            'content': proj_text,
            'type': 'project',
            'name': project.get('name'),
            'source': 'projects'
        })
    
    # 7. Additional Details Chunk
    additional = profile.get('additionalDetails', {})
    if additional:
        details_text = f"""
        Work Ethic: {additional.get('workEthic')}
        Highlights: {', '.join(additional.get('summaryHighlights', []))}
        """.strip()
        
        chunks.append({
            'content': details_text,
            'type': 'additional_details',
            'name': 'Career Highlights',
            'source': 'profile'
        })
    
    return chunks

def generate_chunk_id(chunk: Dict[str, str]) -> str:
    """Generate unique ID for each chunk"""
    content_hash = hashlib.md5(chunk['content'].encode()).hexdigest()[:8]
    chunk_type = chunk['type']
    return f"{chunk_type}_{content_hash}"

def upsert_vectors_to_upstash(vector_index: Index, chunks: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Upsert all chunks to Upstash Vector database
    Upstash handles embedding generation automatically
    """
    stats = {
        'total': len(chunks),
        'successful': 0,
        'failed': 0,
        'errors': []
    }
    
    print("\n" + "="*60)
    print("UPSERTING VECTORS TO UPSTASH")
    print("="*60)
    
    for idx, chunk in enumerate(chunks, 1):
        try:
            chunk_id = generate_chunk_id(chunk)
            
            # Prepare metadata
            metadata = {
                'type': chunk['type'],
                'name': chunk['name'],
                'source': chunk['source'],
                'content_preview': chunk['content'][:100] + '...'
            }
            
            # Upsert to Upstash Vector
            # Note: Upstash Vector handles embeddings automatically
            vector_index.upsert(
                vectors=[
                    (
                        chunk_id,
                        chunk['content'],
                        metadata
                    )
                ]
            )
            
            stats['successful'] += 1
            print(f"✓ [{idx}/{len(chunks)}] {chunk['type']:20s} | {chunk['name'][:40]:40s}")
            
        except Exception as e:
            stats['failed'] += 1
            error_msg = f"{chunk['name']}: {str(e)}"
            stats['errors'].append(error_msg)
            print(f"✗ [{idx}/{len(chunks)}] {chunk['type']:20s} | ERROR: {str(e)[:50]}")
    
    return stats

def verify_embeddings(vector_index: Index, test_query: str = "What are your main skills?") -> bool:
    """
    Verify embeddings were uploaded successfully by running a test query
    """
    print("\n" + "="*60)
    print("VERIFYING EMBEDDINGS")
    print("="*60)
    
    try:
        results = vector_index.query(
            data=test_query,
            top_k=3,
            include_metadata=True
        )
        
        result_count = len(results) if results else 0
        if result_count > 0:
            print(f"✓ Vector search successful!")
            print(f"✓ Found {result_count} relevant results for test query")
            print(f"\nTop result: {results[0].get('metadata', {}).get('name', 'Unknown')}")
            return True
        else:
            print("⚠ Vector search returned no results")
            return False
            
    except Exception as e:
        print(f"✗ Verification failed: {str(e)}")
        return False

def print_embedding_summary(chunks: List[Dict[str, str]], stats: Dict[str, Any]):
    """Print summary of embedding operation"""
    print("\n" + "="*60)
    print("EMBEDDING SUMMARY")
    print("="*60)
    
    # Count by type
    type_counts = {}
    for chunk in chunks:
        chunk_type = chunk['type']
        type_counts[chunk_type] = type_counts.get(chunk_type, 0) + 1
    
    print(f"\nChunks Created by Type:")
    for chunk_type, count in sorted(type_counts.items()):
        print(f"  • {chunk_type:25s}: {count:3d} chunks")
    
    print(f"\nUpstash Upload Results:")
    print(f"  • Total chunks:     {stats['total']}")
    print(f"  • Successful:       {stats['successful']}")
    print(f"  • Failed:           {stats['failed']}")
    
    if stats['errors']:
        print(f"\nErrors encountered:")
        for error in stats['errors']:
            print(f"  • {error}")
    else:
        print(f"\n✓ All chunks uploaded successfully!")

def main():
    """Main embedding pipeline"""
    print("\n" + "="*60)
    print("DIGITAL TWIN EMBEDDING PIPELINE")
    print("="*60)
    
    try:
        # 1. Initialize
        print("\n1. Initializing Upstash Vector connection...")
        vector_index = initialize_vector_index()
        print("   ✓ Connected to Upstash Vector")
        
        # 2. Load profile
        print("\n2. Loading professional profile...")
        profile = load_profile_data()
        profile_name = profile.get('profile', {}).get('fullName', 'Unknown')
        print(f"   ✓ Profile loaded: {profile_name}")
        
        # 3. Chunk data
        print("\n3. Creating semantic chunks...")
        chunks = chunk_profile_data(profile)
        print(f"   ✓ Created {len(chunks)} semantic chunks")
        
        # 4. Upsert vectors
        print("\n4. Upserting vectors to Upstash...")
        stats = upsert_vectors_to_upstash(vector_index, chunks)
        
        # 5. Verify
        print("\n5. Verifying embeddings...")
        verification_success = verify_embeddings(vector_index)
        
        # 6. Summary
        print_embedding_summary(chunks, stats)
        
        # 7. Status
        print("\n" + "="*60)
        if stats['failed'] == 0 and verification_success:
            print("✓ EMBEDDING PIPELINE COMPLETED SUCCESSFULLY")
            print("\nYour Digital Twin is now ready for RAG queries!")
            print("• Chat interface can now search your profile")
            print("• Try asking about skills, experience, or projects")
            return 0
        else:
            print("⚠ EMBEDDING PIPELINE COMPLETED WITH WARNINGS")
            print(f"• {stats['failed']} chunks failed to upload")
            print("• Verify Upstash credentials in .env file")
            return 1
        
    except Exception as e:
        print(f"\n✗ EMBEDDING PIPELINE FAILED: {str(e)}")
        print("\nTroubleshooting:")
        print("• Check UPSTASH_VECTOR_REST_URL in .env")
        print("• Check UPSTASH_VECTOR_REST_TOKEN in .env")
        print("• Verify internet connection")
        return 1

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)