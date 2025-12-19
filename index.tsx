import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: { web: { uri: string; title: string } }[];
}

// --- Shader Source (Raymarching Metaballs) ---
const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uPulse;

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

float sdSphere(vec3 p, float r) { return length(p) - r; }

float map(vec3 p) {
    float d = 1000.0;
    
    // Dynamic metaballs
    for(int i=0; i<6; i++) {
        float t = uTime * 0.4 + float(i) * 1.5;
        vec3 pos = vec3(
            sin(t) * 1.2,
            cos(t * 0.8) * 0.8,
            sin(t * 0.5) * 0.5
        );
        d = smin(d, sdSphere(p - pos, 0.4 + sin(float(i)) * 0.1), 0.6);
    }
    
    // Mouse interaction ball
    vec3 mousePos = vec3((uMouse - 0.5) * vec2(4.0, 2.5), 0.0);
    d = smin(d, sdSphere(p - mousePos, 0.2 + uPulse * 0.5), 0.8);
    
    return d;
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
    vec3 ro = vec3(0.0, 0.0, 3.5);
    vec3 rd = normalize(vec3(uv, -1.5));
    
    float t = 0.0;
    for(int i=0; i<40; i++) {
        float d = map(ro + rd * t);
        if(d < 0.001 || t > 10.0) break;
        t += d;
    }
    
    vec3 col = vec3(0.01, 0.01, 0.02); // Deep dark background
    
    if(t < 10.0) {
        vec3 p = ro + rd * t;
        vec2 e = vec2(0.01, 0.0);
        vec3 n = normalize(vec3(
            map(p+e.xyy) - map(p-e.xyy),
            map(p+e.yxy) - map(p-e.yxy),
            map(p+e.yyx) - map(p-e.yyx)
        ));
        
        float diff = max(dot(n, normalize(vec3(1, 2, 3))), 0.0);
        float spec = pow(max(dot(reflect(normalize(vec3(1, 2, 3)), n), rd), 0.0), 32.0);
        float fresnel = pow(1.0 + dot(rd, n), 3.0);
        
        // Indigo theme
        vec3 baseCol = vec3(0.05, 0.06, 0.15);
        col = baseCol + diff * vec3(0.1, 0.12, 0.3) + spec * 0.4 + fresnel * vec3(0.2, 0.25, 0.5) * (1.0 + uPulse * 2.0);
    }
    
    // Vignette
    col *= 1.0 - length(uv) * 0.3;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

// --- Components ---

const FluidBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPulse: { value: 0 }
      },
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e: MouseEvent) => {
      material.uniforms.uMouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    const handleClick = () => {
      pulseRef.current = 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('touchstart', handleClick);

    const animate = () => {
      material.uniforms.uTime.value += 0.02;
      pulseRef.current *= 0.92;
      material.uniforms.uPulse.value = pulseRef.current;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

const AITerminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "➜ boywithdv_os terminal initialized. System ready for technical queries. How can I assist your architecture today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Query regarding boywithdv: ${input}`,
        config: {
          systemInstruction: "You are the technical AI agent for 'boywithdv', a Senior Flutter/Dart Engineer. Tone: Technical, concise, professional. Use Markdown for code. Mention clean architecture and BLoC often.",
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "SYSTEM_ERROR: Neural bridge failed.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setMessages(prev => [...prev, { role: 'assistant', text, sources: sources as any }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "➜ CONNECTION_TIMEOUT: Failed to reach the core. Check network." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px] font-mono border border-indigo-500/20">
      <div className="bg-slate-900/80 px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/20" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">terminal.boywithdv.me</span>
      </div>
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 text-sm scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] mb-1 font-bold ${m.role === 'user' ? 'text-indigo-400' : 'text-cyan-400'}`}>
              {m.role === 'user' ? 'GUEST@VISITOR' : 'CORE@SYSTEM'}
            </span>
            <div className={`p-3 rounded-lg max-w-[90%] ${m.role === 'user' ? 'bg-indigo-500/10 text-indigo-100' : 'text-slate-200'}`}>
              {m.text}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                  {m.sources.map((s: any, si) => s.web && (
                    <a key={si} href={s.web.uri} target="_blank" className="text-[9px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors flex items-center gap-1">
                      <i className="fas fa-link text-[8px]" /> {s.web.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-indigo-400 animate-pulse text-xs tracking-widest">➜ PROCESSING...</div>}
      </div>
      <form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
        <span className="text-indigo-500">$</span>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about my expertise..."
          className="bg-transparent border-none focus:ring-0 w-full text-slate-200 placeholder:text-slate-700"
        />
      </form>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const projects = [
    { title: "Clean Arch Suite", desc: "A robust Flutter scaffold for enterprise apps.", icon: "layer-group" },
    { title: "Fluid UI Kit", desc: "High-performance custom painters for Dart.", icon: "paint-brush" },
    { title: "Core Logic CI", desc: "Automated deployment pipelines for mobile.", icon: "microchip" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
      {projects.map((p, i) => (
        <div key={i} className="glass p-8 rounded-3xl hover:scale-[1.02] transition-all duration-500 group cursor-default">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <i className={`fas fa-${p.icon} text-xl`} />
          </div>
          <h3 className="text-xl font-bold mb-3">{p.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 800);
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <FluidBackground />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 p-8 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">B</div>
          <span className="hidden sm:inline">boywithdv</span>
        </div>
        <div className="flex gap-8 text-[10px] font-mono tracking-[0.3em] uppercase opacity-60">
          <a href="#work" className="hover:text-indigo-400 transition-colors">Experience</a>
          <a href="#terminal" className="hover:text-indigo-400 transition-colors">Terminal</a>
          <a href="https://github.com/boywithdv" target="_blank" className="hover:text-indigo-400 transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Hero */}
      <header className="flex-grow flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto w-full pt-32 pb-20">
        <div className="max-w-4xl">
          <p className="text-indigo-400 font-mono text-xs tracking-[0.5em] mb-6 uppercase">Senior Software Architect</p>
          <h1 className="text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter mb-12">
            Flutter<br/>
            <span className="text-gradient">Engineered.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-2xl max-w-2xl leading-relaxed font-light">
            Crafting natively compiled, high-performance mobile experiences with the precision of <span className="text-white font-medium">Clean Architecture</span>.
          </p>
        </div>
      </header>

      {/* Projects */}
      <section id="work" className="py-32 px-6 md:px-20 flex flex-col items-center">
        <div className="w-full max-w-6xl mb-16">
          <h2 className="text-sm font-mono text-indigo-500 uppercase tracking-[0.4em] mb-4">01 // SELECTED WORKS</h2>
          <h3 className="text-5xl font-bold">Featured Projects</h3>
        </div>
        <Portfolio />
      </section>

      {/* AI Assistant */}
      <section id="terminal" className="py-32 px-6 md:px-20 bg-black/40 border-y border-white/5 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-indigo-500 uppercase tracking-[0.4em] mb-4">02 // INTELLIGENCE</h2>
          <h3 className="text-5xl font-bold">AI Support System</h3>
        </div>
        <AITerminal />
      </section>

      <footer className="py-20 px-6 border-t border-white/5 bg-black text-center">
        <div className="flex justify-center gap-12 text-slate-600 mb-10 text-xl">
          <a href="https://github.com/boywithdv" className="hover:text-white transition-all hover:scale-125"><i className="fab fa-github" /></a>
          <a href="#" className="hover:text-white transition-all hover:scale-125"><i className="fab fa-linkedin" /></a>
          <a href="mailto:hello@boywithdv.me" className="hover:text-white transition-all hover:scale-125"><i className="fas fa-envelope" /></a>
        </div>
        <p className="text-slate-700 font-mono text-[10px] tracking-[0.6em] uppercase">© 2024 BOYWITHDV • ALL SYSTEMS NOMINAL</p>
      </footer>
    </div>
  );
};

// --- Mount ---
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}