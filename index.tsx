import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: any[];
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  icon: string;
}

// --- Services (Gemini API) ---
const queryGemini = async (userPrompt: string): Promise<Message> => {
  // Use process.env.API_KEY directly as per environment requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Context: You are an AI representative for 'boywithdv', a top-tier Flutter/Dart engineer. 
                User query: ${userPrompt}`,
      config: {
        systemInstruction: "Expert, concise, professional. Speak as boywithdv's AI terminal. Focus on Flutter, mobile architecture, and Clean Architecture.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No response generated.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { role: 'assistant', text, sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { role: 'assistant', text: "ERROR: Failed to establish secure connection to AI core." };
  }
};

// --- Components ---

const Navbar = ({ scrolled }: { scrolled: boolean }) => (
  <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
    scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 py-4 shadow-2xl' : 'bg-transparent py-8'
  }`}>
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-indigo-600/30">B</div>
        <span className="font-bold tracking-tighter text-lg hidden sm:block">boywithdv</span>
      </div>
      <div className="flex items-center gap-6 sm:gap-10 text-xs font-semibold uppercase tracking-widest">
        <a href="#projects" className="text-slate-400 hover:text-white transition-colors">Portfolio</a>
        <a href="#terminal" className="text-slate-400 hover:text-white transition-colors">AI Terminal</a>
        <a href="https://github.com/boywithdv" target="_blank" className="px-5 py-2 rounded border border-slate-700 hover:bg-white hover:text-black transition-all">GitHub</a>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
    <div className="max-w-4xl">
      <p className="text-indigo-400 font-mono text-xs mb-8 tracking-[0.4em] uppercase opacity-70">Mobile Architecture Specialist</p>
      <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
        Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">digital</span> excellence.
      </h1>
      <p className="text-slate-400 text-lg md:text-2xl max-w-2xl leading-relaxed font-light mb-12">
        Senior Flutter Engineer focused on building high-performance, accessible, and beautiful cross-platform applications.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="#projects" className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20">
          View Projects <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
        </a>
      </div>
    </div>
  </section>
);

const Projects = () => {
  const list: Project[] = [
    { title: "Clean Flutter Suite", description: "Architecture-first mobile solutions for enterprise scale.", tags: ["Flutter", "Riverpod", "Clean Arch"], link: "https://github.com/boywithdv", icon: "mobile-screen" },
    { title: "UI Engine", description: "Design system and component library for rapid cross-platform prototyping.", tags: ["Dart", "UI/UX", "Canvas"], link: "#", icon: "gem" },
    { title: "Developer Core", description: "Custom CLI tools and automation scripts for CI/CD pipelines.", tags: ["Rust", "Shell", "Docker"], link: "#", icon: "terminal" }
  ];
  return (
    <section id="projects" className="py-32 px-6 md:px-20">
      <div className="mb-20">
        <h2 className="text-xs font-mono text-indigo-400 mb-4 tracking-[0.3em] uppercase">Selected Works</h2>
        <h3 className="text-4xl font-bold tracking-tight">Recent Projects</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((p, i) => (
          <div key={i} className="group p-10 bg-[#0d1117] border border-slate-800/50 rounded-3xl hover:border-indigo-500/30 transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
               <i className={`fas fa-${p.icon} text-4xl text-indigo-500`}></i>
            </div>
            <h4 className="text-xl font-bold mb-4">{p.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t, ti) => <span key={ti} className="text-[10px] font-mono px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 rounded-full">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "SYSTEM: Welcome. Terminal active. Ask about my Flutter expertise or project history." }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const result = await queryGemini(input);
    setMessages(prev => [...prev, result]);
    setLoading(false);
  };

  return (
    <section id="terminal" className="py-32 px-6 md:px-20 bg-slate-950/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-indigo-400 mb-4 tracking-[0.3em] uppercase">Intelligence</h2>
          <h3 className="text-4xl font-bold tracking-tight">AI Representative</h3>
        </div>
        <div className="w-full bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden shadow-3xl flex flex-col h-[600px] font-mono text-sm">
          <div className="px-5 py-3 bg-[#161b22] border-b border-slate-800 flex justify-between items-center">
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/50"></div><div className="w-3 h-3 rounded-full bg-yellow-500/50"></div><div className="w-3 h-3 rounded-full bg-green-500/50"></div></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">boywithdv_os v3.1</span>
          </div>
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className={`text-[10px] font-bold mb-2 ${m.role === 'user' ? 'text-indigo-400' : 'text-cyan-400'}`}>
                  {m.role === 'user' ? '➜ GUEST@LOCAL' : '➜ SYSTEM@CORE'}
                </span>
                <div className={`leading-relaxed ${m.role === 'user' ? 'text-slate-400' : 'text-slate-200'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="text-indigo-500 animate-pulse text-xs tracking-widest">_ BUSY...</div>}
          </div>
          <form onSubmit={onSend} className="p-6 bg-[#161b22] border-t border-slate-800 flex items-center gap-4">
            <span className="text-indigo-500">$</span>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Enter command..."
              className="bg-transparent border-none focus:ring-0 w-full text-slate-200 placeholder:text-slate-700"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <Navbar scrolled={scrolled} />
      <Hero />
      <Projects />
      <Chatbot />
      <footer className="py-20 text-center border-t border-slate-900 bg-black">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em]">© 2024 BOYWITHDV • ALL SYSTEMS NOMINAL</p>
      </footer>
    </div>
  );
};

// --- Mount App ---
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
  const loader = document.getElementById('loading-screen');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
}