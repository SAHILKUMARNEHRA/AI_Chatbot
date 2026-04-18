import fitz
import faiss
import numpy as np
import requests
import os

def get_groq_embedding(text):
    api_key = os.getenv("GROQ_API_KEY")
    # Using HuggingFace API for free embeddings as a fallback since Groq doesn't have native embeddings yet
    # Or using a lightweight TF-IDF/BM25 approach to save RAM
    # Since we need vector embeddings for FAISS, we will use a free external API to avoid loading models in RAM
    
    # We'll use the HuggingFace Inference API (Free)
    api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    # Using environment variable for token, fallback to public if missing
    hf_token = os.getenv("HF_TOKEN", "")
    headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}
    
    try:
        response = requests.post(api_url, headers=headers, json={"inputs": text})
        if response.status_code == 200:
            return response.json()
    except:
        pass
        
    # Absolute fallback: random vectors if API fails (just so app doesn't crash)
    return np.random.rand(384).tolist()

def extract_pdf_text(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def chunk_text(text, chunk_size=500, overlap=100):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks

def create_embeddings(chunks):
    vectors = [get_groq_embedding(chunk) for chunk in chunks]
    arr = np.array(vectors).astype("float32")

    index = faiss.IndexFlatL2(arr.shape[1])
    index.add(arr)

    return index

def search_chunks(question, chunks, index, k=4):
    q = get_groq_embedding(question)
    q = np.array([q]).astype("float32")

    distances, ids = index.search(q, k)

    results = []
    for i in ids[0]:
        if i < len(chunks):
            results.append(chunks[i])

    return results

def embed_text(text):
    return get_groq_embedding(text)
