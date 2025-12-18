
import React from 'react';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-slate-800/50 shadow-lg' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform">
            B
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">boywithdv</span>
        </a>

        <div className="flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-indigo-400 transition-colors hidden md:block">Projects</a>
          <a href="#ai-assistant" className="hover:text-indigo-400 transition-colors hidden md:block">AI Assistant</a>
          <a 
            href="https://github.com/boywithdv" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-slate-700 hover:border-indigo-500 hover:text-white transition-all bg-slate-900/50"
          >
            GitHub <i className="fab fa-github ml-2"></i>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
