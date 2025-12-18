
import React from 'react';
import { Project } from '../types';

const PROJECTS: Project[] = [
  {
    title: "Flutter Mobile Suite",
    description: "A series of high-performance mobile applications built with Flutter and Dart, utilizing Clean Architecture and BLoC for state management.",
    tags: ["Flutter", "Dart", "Firebase", "BLoC"],
    link: "https://github.com/boywithdv"
  },
  {
    title: "Cross-Platform UI Kit",
    description: "An open-source library of highly customizable UI components designed for Flutter, focused on accessibility and fluid animations.",
    tags: ["Dart", "UI/UX", "Open Source"],
    link: "https://github.com/boywithdv"
  },
  {
    title: "DevTool Suite",
    description: "A collection of productivity tools for developers including a CLI for automated workflow management and custom VS Code extensions.",
    tags: ["Rust", "Node.js", "VS Code API"],
    link: "#"
  }
];

const Projects: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECTS.map((project, idx) => (
        <div 
          key={idx} 
          className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fas fa-external-link-alt text-slate-500"></i>
          </div>
          
          <div className="mb-6 flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
               <i className="fas fa-mobile-alt text-2xl"></i>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag, tIdx) => (
              <span key={tIdx} className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </div>
      ))}
    </div>
  );
};

export default Projects;
