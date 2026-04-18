import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Loader2, Bot } from 'lucide-react';
import { useStore } from '../store';

export default function Landing() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setTopicId = useStore((state) => state.setTopicId);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      await uploadFile(file);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://ai-chatbot-0a38.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setTopicId(data.topicId);
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Something went wrong during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-6 font-sans text-slate-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full"
      >
        <div className="flex items-center justify-center mb-6 text-indigo-500">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Bot size={64} className="text-sky-400" />
          </motion.div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Tutor</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12">
          Upload your course material or textbook as a PDF and let your personalized AI Tutor guide you through the concepts.
        </p>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 transition-colors cursor-pointer bg-[#112240] ${
            isDragging ? 'border-sky-400 bg-sky-900/10' : 'border-slate-700 hover:border-indigo-500 hover:bg-indigo-900/10'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center justify-center pointer-events-none">
            {isLoading ? (
              <Loader2 size={48} className="animate-spin text-sky-400 mb-4" />
            ) : (
              <UploadCloud size={48} className={`mb-4 transition-colors ${isDragging ? 'text-sky-400' : 'text-slate-400'}`} />
            )}
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLoading ? 'Processing PDF...' : 'Drop your PDF here'}
            </h3>
            <p className="text-slate-400">
              {isLoading ? 'Extracting text and generating embeddings' : 'or click to browse from your computer'}
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-500/20"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
