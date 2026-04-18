# AI Tutor Project

An interactive, educational chatbot interface designed to help users learn from uploaded PDF documents. Built with React (Frontend) and FastAPI (Backend) using Groq's LLM for responses and FAISS for RAG.

## Project Structure
- `frontend/` - React frontend built with Vite, Tailwind CSS, and Framer Motion.
- `backend/` - FastAPI backend for PDF processing, RAG pipeline, and Groq API communication.

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)

### 2. Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *(The backend will now be running on `http://localhost:8000`)*

### 3. Frontend Setup

1. Open a **new** terminal window/tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The frontend will now be running on `http://localhost:5173`)*

### 4. API Keys & Environment Variables
The backend requires a **Groq API Key** to function.
Make sure you have a `.env` file in the **root** folder (the parent directory of `backend/` and `frontend/`) with the following content:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🛠️ Usage
1. Make sure **both** the backend and frontend servers are running.
2. Open your browser and go to `http://localhost:5173`.
3. Drag and drop a PDF file.
4. Start asking your AI Tutor questions about the PDF!