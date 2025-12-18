
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Projects from './components/Projects.tsx';
import Chatbot from './components/Chatbot.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <Navbar isScrolled={scrolled} />

      <main className="flex-grow pt-20">
        <Hero />
        
        <section id="projects" className="py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
              <span className="text-indigo-400 font-mono text-xl">01.</span> Featured Projects
              <div className="h-[1px] bg-slate-800 flex-grow ml-4"></div>
            </h2>
            <Projects />
          </div>
        </section>

        <section id="ai-assistant" className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/30">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">Portfolio AI Explorer</h2>
               <p className="text-slate-400">Ask anything about boywithdv's background, skills, or GitHub activity.</p>
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
