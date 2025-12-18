import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Navbar isScrolled={scrolled} />

      <main className="flex-grow pt-24">
        <Hero />
        
        <section id="projects" className="py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-sm font-mono text-indigo-400 mb-2 uppercase tracking-[0.3em]">01. Portfolio</h2>
              <h3 className="text-4xl font-bold tracking-tight">Featured Projects</h3>
              <div className="h-1 w-20 bg-indigo-600 mt-4 rounded-full"></div>
            </div>
            <Projects />
          </div>
        </section>

        <section id="ai-assistant" className="py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 -z-10"></div>
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-sm font-mono text-indigo-400 mb-2 uppercase tracking-[0.3em]">02. Intelligence</h2>
               <h3 className="text-4xl font-bold tracking-tight">AI Assistant</h3>
               <p className="text-slate-400 mt-4 max-w-lg mx-auto">Ask me about boywithdv's expertise in Flutter, Dart, and high-performance mobile architectures.</p>
             </div>
             <Chatbot />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;