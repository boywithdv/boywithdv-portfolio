
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 md:px-12 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-lg">B</div>
            <span className="font-bold">boywithdv</span>
          </div>
          <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
            Crafting the future of software with clean code and innovative design.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-6 text-xl text-slate-400">
            <a href="https://github.com/boywithdv" className="hover:text-white transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="mailto:hello@boywithdv.me" className="hover:text-white transition-colors"><i className="fas fa-envelope"></i></a>
          </div>
          <p className="text-slate-600 text-xs font-mono">
            © {new Date().getFullYear()} boywithdv. Built with Gemini & React.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
