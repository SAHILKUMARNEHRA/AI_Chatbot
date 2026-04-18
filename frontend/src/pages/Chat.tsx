import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Loader2, Image as ImageIcon, BookOpen } from 'lucide-react';
import { useStore } from '../store';

export default function Chat() {
  const { topicId, history, addMessage, clearState } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!topicId) {
      navigate('/');
    }
  }, [topicId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !topicId) return;

    const userMessageId = Date.now().toString();
    addMessage({ id: userMessageId, role: 'user', content: input });
    const currentQuestion = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          question: currentQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        image: data.image,
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while trying to process your question. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clearState();
    navigate('/');
  };

  if (!topicId) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0A192F] font-sans text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#112240] border-b border-slate-800 shadow-md z-10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <Bot size={24} className="text-sky-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">AI <span className="text-indigo-400">Tutor</span></h1>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <Bot size={64} className="mb-4 text-slate-500" />
            <p className="text-lg">Your PDF is ready! Ask me anything about it.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {history.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-indigo-600 ml-3' : 'bg-sky-900 border border-sky-700 mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-sky-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-[#112240] text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>

                  {/* Sources & Image Attachments (AI only) */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 space-y-3 w-full">
                      {/* Image Attachment */}
                      {msg.image && (
                        <div className="bg-[#112240] border border-slate-700 rounded-xl p-3 inline-block w-full">
                          <div className="flex items-center text-sky-400 text-sm font-medium mb-2">
                            <ImageIcon size={16} className="mr-2" />
                            Visual Context
                          </div>
                          <img 
                            src={`http://localhost:8000/assets/${msg.image.filename}`} 
                            alt={msg.image.title || "Context"} 
                            className="rounded-lg max-h-64 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-900 border border-sky-700 mr-3 flex items-center justify-center">
                  <Bot size={20} className="text-sky-400" />
                </div>
                <div className="p-4 rounded-2xl shadow-sm bg-[#112240] text-slate-200 border border-slate-700 rounded-tl-none flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <motion.div className="w-2 h-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-sky-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#112240] border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSend}
            className="relative flex items-center bg-[#0A192F] rounded-full border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask a question about the PDF..."
              className="flex-1 bg-transparent border-none py-4 pl-6 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-colors"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
