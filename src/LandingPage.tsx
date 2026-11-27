import React from "react";
import "./App.css";

function LandingPage() {
  return (
    <div className="eva-landing min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] blur-3xl opacity-25 bg-emerald-400 rounded-full animate-pulse" />
      <div className="z-10 text-center animate-fade-in flex flex-col items-center">
        <div className="w-full mb-8">
          <h1 className="text-[10vw] font-extrabold text-center uppercase tracking-tight text-white whitespace-nowrap leading-none drop-shadow-xl" style={{letterSpacing: '0.05em'}}>
            Hello World
          </h1>
        </div>
        <div className="eva-avatar mx-auto mb-8 shadow-lg">
          <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="52" cy="52" r="44" fill="#10B981" fillOpacity="0.18" />
            <circle cx="52" cy="52" r="32" fill="#10B981" fillOpacity="0.35" />
            <ellipse cx="52" cy="64" rx="29" ry="18" fill="#d1fae5" fillOpacity="0.55" />
            <ellipse cx="52" cy="44" rx="15" ry="18" fill="#16f1b0" fillOpacity="0.48" />
            <ellipse cx="52" cy="44" rx="11" ry="13" fill="#fff" fillOpacity="0.70" />
            <circle cx="52" cy="44" r="6" fill="#10B981" fillOpacity="0.75" />
          </svg>
        </div>
        <h1 className="font-extrabold tracking-widest text-4xl md:text-6xl bg-gradient-to-r from-emerald-300 to-teal-100 text-transparent bg-clip-text drop-shadow-lg mb-2">
          Eva Agent
        </h1>
        <h2 className="mt-2 text-lg md:text-2xl text-slate-200 font-semibold drop-shadow-sm">
          Your private, local coding AI<br className="hidden md:block" />— powered by you
        </h2>
        <div className="mt-10 flex flex-col items-center">
          <div className="animate-pulse h-2 w-24 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-200 to-emerald-400 opacity-60 mb-5" />
          <p className="text-slate-400 italic text-center max-w-md font-medium">
            Secure. Lightning fast. Always at your fingertips.
          </p>
        </div>
        <div className="mt-8">
          <button className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-lg transition-all">
            Get Started
          </button>
        </div>
      </div>
      <footer className="w-full absolute bottom-0 pb-4 flex justify-center opacity-85">
        <div className="text-xs text-slate-500">
          Made with <span className="text-emerald-400">♥</span> locally · Built for efficiency & privacy
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
