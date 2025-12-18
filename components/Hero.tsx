
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <p className="text-indigo-400 font-mono mb-6 tracking-widest text-sm animate-pulse uppercase">
          Specialist in Flutter & Cross-Platform Development
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">boywithdv</span>.
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 leading-tight">
          I build <span className="text-white italic">exceptional</span> mobile experiences using <span className="text-white italic">Flutter</span>.
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Focused on crafting high-performance, beautiful, and natively compiled applications. I turn complex ideas into seamless mobile realities with Dart and modern architectural patterns.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#projects" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            Explore My Work
          </a>
          <a href="#ai-assistant" className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-all">
            Ask AI Assistant
          </a>
        </div>

        <div className="mt-20 flex gap-8 items-center text-slate-500">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Flutter</span>
            <span className="text-xs uppercase tracking-widest font-mono">Main Stack</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Dart</span>
            <span className="text-xs uppercase tracking-widest font-mono">Expertise</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Android/iOS</span>
            <span className="text-xs uppercase tracking-widest font-mono">Native Performance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
