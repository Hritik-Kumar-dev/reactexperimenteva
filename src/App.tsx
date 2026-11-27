import './App.css';

function App() {
  return (
    <div className="eva-landing min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] blur-3xl opacity-25 bg-emerald-400 rounded-full animate-pulse" />
      <div className="z-10 text-center animate-fade-in flex flex-col items-center">
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
        <h1 className="font-extrabold tracking-widest text-4xl md:text-6xl bg-gradient-to-r from-emerald-300 to-teal-100 text-transparent bg-clip-text drop-shadow-lg">
          Eva Agent
        </h1>
        <h2 className="mt-6 text-lg md:text-2xl text-slate-200 font-semibold drop-shadow-sm">
          Your private, local coding AI<br className="hidden md:block" />— powered by you
        </h2>
        <div className="mt-10 flex flex-col items-center">
          <div className="animate-pulse h-2 w-24 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-200 to-emerald-400 opacity-60 mb-5" />
          <p className="text-slate-400 italic text-center max-w-md font-medium">
            Secure. Lightning fast. Always at your fingertips.
          </p>
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

export default App;

          </button>
          <button
            onClick={() => setState('listening')}
            className={state === 'listening' ? 'active' : ''}
          >
            Listening
          </button>
          <button
            onClick={() => setState('thinking')}
            className={state === 'thinking' ? 'active' : ''}
          >
            Thinking
          </button>
          <button
            onClick={() => setState('speaking')}
            className={state === 'speaking' ? 'active' : ''}
          >
            Speaking
          </button>
        </div>

        <div className="audio-controls">
          <div>
            <h3>Audio Source</h3>
            <button
              onClick={handleMicToggle}
              className={isListening ? 'active' : ''}
            >
              {isListening ? '🎤 Microphone On' : '🎤 Microphone Off'}
            </button>
            <input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
            />
            <label htmlFor="audio-file">🎵 Upload Audio File</label>
          </div>
        </div>
      </div>

      <div className="hologram-container">
        <JarvisHologram
          state={state}
          audioSource={audioSource}
          size="100%"
          intensity={0.8}
          colorTheme={{
            primary: '#FFB000',
            secondary: '#FFD24A',
            spark: '#FFF3C4'
          }}
          onClick={() => {
            console.log('Hologram clicked!');
            // Optional: change state on click
            setState(prev => prev === 'speaking' ? 'idle' : 'speaking');
          }}
          onHoverChange={(hovering) => {
            console.log('Hover:', hovering);
            // Optional: change state on hover
            if (hovering && state === 'idle') {
              setState('listening');
            } else if (!hovering && state === 'listening') {
              setState('idle');
            }
          }}
        />
      </div>

      <footer>
        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Use the state buttons to change JARVIS's behavior</li>
            <li>Toggle microphone for live audio input</li>
            <li>Upload audio files to drive the hologram with sound</li>
            <li>Click on the hologram to interact</li>
            <li>Hover over the hologram for additional effects</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;