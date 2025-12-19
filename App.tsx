import React, { useState, useEffect, useRef } from 'react';
import { queryGeminiAboutUser } from './services/geminiService';
import { Message, Project } from './types';

// --- Sub-Components (Consolidated for Stability) ---

const Navbar: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => (
  <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800/50 shadow-lg' : 'bg-transparent py-6'
  }`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
      <a href="#" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
          B
        </div>
        <span className="text-xl font-bold tracking-tight hidden sm:inline-block">boywithdv</span>
      </a>
      <div className="flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#projects" className="hover:text-indigo-400 transition-colors hidden md:block">Projects</a>
        <a href="#ai-assistant" className="hover:text-indigo-400 transition-colors hidden md:block">AI Assistant</a>
        <a href="https://github.com/boywithdv" target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full border border-slate-700 hover:border-indigo-500 hover:text-white transition-all bg-slate-900/50">
          GitHub <i className="fab fa-github ml-2"></i>
        </a>
      </div>
    </div>
  </nav>
);

const Hero: React.FC = () => (
  <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
    <div className="max-w-4xl mx-auto w-full">
      <p className="text-indigo-400 font-mono mb-6 tracking-[0.2em] text-xs uppercase opacity-80">
        Senior Flutter & Dart Engineer
      </p>
      <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tight leading-[1.1]">
        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">boywithdv</span>.
      </h1>
      <h2 className="text-3xl md:text-6xl font-bold text-slate-500 mb-8 leading-tight">
        Building the future of <span className="text-white italic">mobile</span> apps.
      </h2>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
        Expert in high-performance, cross-platform architecture. Specializing in Flutter, Clean Architecture, and seamless user experiences.
      </p>
      <div className="flex flex-wrap gap-4">
        <a href="#projects" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20">
          Explore Work
        </a>
        <a href="#ai-assistant" className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-all">
          Talk to Assistant
        </a>
      </div>
    </div>
  </section>
);

const ProjectsList: React.FC = () => {
  const PROJECTS: Project[] = [
    { title: "Flutter Mobile Suite", description: "High-performance apps built with Clean Architecture & BLoC.", tags: ["Flutter", "Dart", "BLoC"], link: "https://github.com/boywithdv" },
    { title: "Cross-Platform UI Kit", description: "Custom UI library focused on accessibility and fluid motion.", tags: ["Dart", "UI/UX", "Open Source"], link: "https://github.com/boywithdv" },
    { title: "DevTool Suite", description: "Productivity tools including CLI and custom VS Code extensions.", tags: ["Rust", "Node.js", "TS"], link: "#" }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECTS.map((project, idx) => (
        <div key={idx} className="group p-8 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
             <i className="fas fa-code text-xl"></i>
          </div>
          <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-2">{project.tags.map((tag, tIdx) => (
            <span key={tIdx} className="px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-[10px] font-mono text-slate-400">{tag}</span>
          ))}</div>
        </div>
      ))}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: "➜ boywithdv_assistant online. Accessing Flutter expertise... How can I help you today?" }]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await queryGeminiAboutUser(input);
      setMessages(p => [...p, response]);
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', text: "ERROR: Failed to reach the intelligence engine." }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[550px] font-mono">
      <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
        <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">terminal — boywithdv-ai-v1</span>
      </div>
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <span className={`text-[10px] font-bold mb-1 ${msg.role === 'user' ? 'text-indigo-400' : 'text-cyan-400'}`}>
              {msg.role === 'user' ? '➜ guest@visitor' : '➜ assistant@boywithdv'}
            </span>
            <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-200'}`}>{msg.text}</div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.sources.map((s: any, si) => s.web && (
                  <a key={si} href={s.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] px-2 py-1 bg-[#161b22] border border-[#30363d] rounded hover:border-indigo-500 text-slate-500">
                    {s.web.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="text-indigo-400 text-xs animate-pulse">_ PROCESSING...</div>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-[#161b22] border-t border-[#30363d] flex gap-2">
        <span className="text-indigo-400">$</span>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Query system..." className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-slate-200" />
      </form>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Navbar isScrolled={scrolled} />
      <main className="flex-grow">
        <Hero />
        <section id="projects" className="py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-[0.3em]">01. Portfolio</h2>
              <h3 className="text-4xl font-bold tracking-tight">Featured Projects</h3>
            </div>
            <ProjectsList />
          </div>
        </section>
        <section id="ai-assistant" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-950/50">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
               <h2 className="text-xs font-mono text-indigo-400 mb-2 uppercase tracking-[0.3em]">02. Intelligence</h2>
               <h3 className="text-4xl font-bold tracking-tight">Deep Knowledge AI</h3>
             </div>
             <Chatbot />
          </div>
        </section>
      </main>
      <footer className="py-12 px-6 border-t border-[#161b22] bg-[#02040a] text-center">
        <div className="flex justify-center gap-6 mb-4 text-slate-500">
          <a href="https://github.com/boywithdv" className="hover:text-white"><i className="fab fa-github"></i></a>
          <a href="#" className="hover:text-white"><i className="fab fa-linkedin"></i></a>
          <a href="mailto:hello@boywithdv.me" className="hover:text-white"><i className="fas fa-envelope"></i></a>
        </div>
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">© 2024 boywithdv — Engineered with Gemini</p>
      </footer>
    </div>
  );
};

export default App;