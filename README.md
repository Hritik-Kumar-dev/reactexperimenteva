# Harvey Component

A React component that recreates the JARVIS AI hologram from Avengers: Age of Ultron using Three.js and React Three Fiber.

## Features

- **Accurate Visual Recreation**: Matches the iconic JARVIS hologram with layered particle effects
- **Interactive**: Responds to hover, click, and drag with physics-based motion
- **Audio Reactive**: Responds to audio input via microphone or audio files
- **State System**: Four distinct states (idle, listening, thinking, speaking)
- **Performance Optimized**: Uses GPU-driven particle animation with LOD adjustment
- **Touch Support**: Multi-touch pinch to scale on supported devices
- **Accessibility**: Respects `prefers-reduced-motion` settings

## Installation

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
```

Make sure you have React 18+ and TypeScript set up in your project.

## Usage

```tsx
import JarvisHologram from './JarvisHologram';

function App() {
  return (
    <JarvisHologram
      state="idle"
      intensity={0.8}
      colorTheme={{
        primary: '#FFB000',
        secondary: '#FFD24A',
        spark: '#FFF3C4'
      }}
      onClick={() => console.log('Clicked!')}
      onHoverChange={(hovering) => console.log('Hovering:', hovering)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `'idle' \| 'listening' \| 'thinking' \| 'speaking'` | `'idle'` | Current state of the hologram |
| `audioSource` | `HTMLAudioElement \| MediaStream` | `null` | Audio source for sound reactivity |
| `size` | `number \| string` | `'100%'` | Size of the hologram container |
| `intensity` | `number` | `1` | Overall intensity (0-1) |
| `colorTheme` | `{ primary: string; secondary: string; spark: string }` | `{ primary: '#FFB000', secondary: '#FFD24A', spark: '#FFF3C4' }` | Color theme for the hologram |
| `onClick` | `() => void` | `undefined` | Callback when hologram is clicked |
| `onHoverChange` | `(hovering: boolean) => void` | `undefined` | Callback when hover state changes |

## States

- **idle**: Slow, dim, calm motion - default state
- **listening**: Contracts slightly, core glows steady, subtle ripple rings
- **thinking**: Arcs spin fast, shell fragments reorganize
- **speaking**: Audio-reactive pulsing, brighter, wider displacement

## Audio Reactivity

The hologram responds to audio in two ways:
1. **External Audio Source**: Pass an `HTMLAudioElement` or `MediaStream` via the `audioSource` prop
2. **Built-in Voice Demo**: The demo includes hooks for microphone input and text-to-speech

When audio is provided, the hologram uses:
- Low frequencies → core pulse
- Mid frequencies → shell displacement amplitude  
- High frequencies → spark rate and arc speed

## Performance

- GPU-driven particle animation (no per-frame JS loops)
- Automatic LOD adjustment based on devicePixelRatio and FPS
- Pauses rendering when tab is hidden
- Respects `prefers-reduced-motion` (slower animation, no glitch effects)
- Targets 60fps on mid-range laptops

## Implementation Details

### Shaders
Custom GLSL shaders handle:
- Particle size attenuation based on distance
- Noise-driven displacement for "breathing" effect
- Flicker and spark effects
- Depth-based alpha for realistic translucency
- Additive blending for bloom effect

### Layers
1. **Outer Layer**: Broken ring/shell of scattered streaks and tick-like fragments
2. **Middle Layer**: Circuit-like geometric slivers  
3. **Inner Core**: Dense bright core with swirling arcs/spiral ribbons

### Interactions
- **Hover**: Expands slightly, brightens, attracts particles to cursor
- **Pointer Move**: Tilts hologram with parallax effect, repels nearby particles
- **Click/Touch**: Emits shockwave ripple + brightness burst
- **Drag**: Rotates hologram with inertia
- **Touch**: Pinch to scale (clamped 0.6x-1.6x)

## Development

This component was built with:
- React 18 + TypeScript
- Vite for development server
- three.js for 3D rendering
- @react-three/fiber and @react-three/drei for React integration
- @react-three/postprocessing for bloom effect
- GSAP-inspired animations in shaders

## Browser Support

Works in modern browsers that support:
- WebGL 2
- Web Audio API
- Pointer Events
- getUserMedia (for microphone access)

## License

MIT

## Acknowledgments

Inspired by the JARVIS AI hologram from Marvel's Avengers: Age of Ultron (2015).