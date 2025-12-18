import React, { useState, useRef, useEffect } from 'react';
import { queryGeminiAboutUser } from '../services/geminiService';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "SYSTEM: boywithdv_assistant online. I am ready to answer questions regarding Flutter mobile development, state management, and project architecture. How can I assist you?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await queryGeminiAboutUser(input);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "ERROR: Failed to retrieve data from Gemini API. Please verify connectivity." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px] font-mono">
      {/* Header / Title Bar */}
      <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-widest">boywithdv_terminal — v1.0.0</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold ${msg.role === 'user' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {msg.role === 'user' ? '➜ guest@boywithdv' : '➜ assistant@boywithdv'}
              </span>
            </div>
            <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-500/5 text-slate-200' : 'text-slate-300'}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#30363d] flex flex-wrap gap-2">
                  {msg.sources.map((s: any, sIdx) => (
                    s.web && (
                      <a 
                        key={sIdx} 
                        href={s.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 rounded transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-link text-[8px]"></i> {s.web.title || "Reference"}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400">
            <span className="animate-pulse">_</span>
            <span className="text-xs uppercase tracking-widest">Processing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-[#161b22] border-t border-[#30363d] flex gap-2">
        <span className="text-indigo-400 flex items-center">$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your command/query..."
          className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder:text-slate-600"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase"
        >
          [ENTER]
        </button>
      </form>
    </div>
  );
};

export default Chatbot;