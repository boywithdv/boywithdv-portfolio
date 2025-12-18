
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <p className="text-indigo-400 font-mono mb-6 tracking-widest text-sm animate-pulse uppercase">
          Mobile App Architect & Flutter Expert
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">boywithdv</span>.
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 leading-tight">
          Crafting high-performance <span className="text-white italic">Flutter</span> apps and <span className="text-white italic">modern</span> digital experiences.
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          I specialize in building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase. My focus is on performance, clean architecture, and exceptional UI/UX.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="#projects" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            View My Apps
          </a>
          <a href="#ai-assistant" className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white font-bold rounded-xl transition-all">
            Chat with AI
          </a>
        </div>

        <div className="mt-20 flex gap-8 items-center text-slate-500">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Flutter</span>
            <span className="text-xs uppercase tracking-widest font-mono">Specialist</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">50+</span>
            <span className="text-xs uppercase tracking-widest font-mono">Repos</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="text-xs uppercase tracking-widest font-mono">Dart Driven</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
