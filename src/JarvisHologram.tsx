import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useAudioAnalyser } from './useAudioAnalyser';

/* Three.js uniforms are intentionally mutated by the render loop. */
/* eslint-disable react-hooks/immutability */
type HologramState = 'idle' | 'listening' | 'thinking' | 'speaking';
type Levels = [number, number, number];

interface Props {
  state?: HologramState;
  audioSource?: HTMLAudioElement | MediaStream;
  size?: number | string;
  intensity?: number;
  colorTheme?: { primary: string; secondary: string; spark: string };
  onClick?: () => void;
  onHoverChange?: (hovering: boolean) => void;
}

const STATES: Record<HologramState, { energy: number; spin: number; expand: number; bright: number }> = {
  idle: { energy: 0.35, spin: 0.4, expand: 1, bright: 0.85 },
  listening: { energy: 0.55, spin: 0.3, expand: 0.93, bright: 1 },
  thinking: { energy: 0.8, spin: 1.9, expand: 1, bright: 1.1 },
  speaking: { energy: 1, spin: 0.8, expand: 1.05, bright: 1.2 },
};

const DEFAULT_THEME = { primary: '#ffb000', secondary: '#ffd24a', spark: '#fff3c4' };

const vertexShader = `
uniform float uTime, uSpin, uExpand, uEnergy, uHover, uSize;
uniform vec3 uAudio, uPointer;
attribute vec4 aSeed;
varying float vAlpha, vHighlight, vMix;
mat2 rotate(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
void main() {
  vec3 p = position;
  float layer = aSeed.y;
  float spin = uSpin * (layer < 0.5 ? .12 : layer < 1.5 ? -.2 : layer < 2.5 ? .9 : .3);
  p.xz = rotate(uTime * spin) * p.xz;
  p.xy = rotate(uTime * spin * .45 + layer) * p.xy;
  float wave = sin(p.y * 4. + uTime) * sin(p.z * 3. - uTime * .6);
  p += vec3(sin(p.y * 3. + uTime), sin(p.z * 3. + uTime), sin(p.x * 3. + uTime))
    * (.02 + .05 * uEnergy + uAudio.y * .1);
  p *= uExpand * (1. + wave * .03 * uEnergy + uAudio.x * .04);
  vec3 pointerDelta = uPointer - p;
  float attraction = smoothstep(.7, 0., length(pointerDelta)) * uHover;
  p += normalize(pointerDelta + .0001) * attraction * .14;
  vec4 viewPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * viewPosition;
  float depth = smoothstep(4.6, 2.6, -viewPosition.z);
  float flicker = .6 + .4 * sin(uTime * (3. + aSeed.z * 8.) + aSeed.x * 40.);
  vAlpha = (.25 + .75 * depth) * flicker * (.55 + .7 * uEnergy + uAudio.x * .5);
  vHighlight = attraction;
  vMix = aSeed.x * .7 + (layer > 1.5 ? .3 : 0.);
  gl_PointSize = aSeed.w * uSize * (1. + uAudio.z) * (3.6 / -viewPosition.z);
}`;

const fragmentShader = `
uniform vec3 uPrimary, uSecondary, uSpark;
varying float vAlpha, vHighlight, vMix;
void main() {
  float distanceFromCenter = length(gl_PointCoord - .5);
  float alpha = smoothstep(.5, 0., distanceFromCenter);
  vec3 color = mix(mix(uPrimary, uSecondary, vMix), uSpark, clamp(vHighlight, 0., 1.));
  gl_FragColor = vec4(color * (vAlpha + vHighlight) * alpha, alpha * vAlpha);
}`;

function createGeometry(quantity: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const seeds: number[] = [];
  for (let i = 0; i < quantity; i += 1) {
    const radius = i < quantity * 0.65 ? 1 : Math.pow(Math.random(), 2.2) * 0.3;
    const y = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - y * y) * radius;
    positions.push(ring * Math.cos(angle), y * radius, ring * Math.sin(angle));
    seeds.push(Math.random(), i < quantity * 0.65 ? 0 : 3, Math.random(), 2 + Math.random() * 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 4));
  return geometry;
}

interface SceneProps {
  state: HologramState;
  intensity: number;
  theme: { primary: string; secondary: string; spark: string };
  levelsRef: MutableRefObject<(() => Levels) | null>;
  pointer: MutableRefObject<THREE.Vector3>;
  hovering: MutableRefObject<boolean>;
}

function HologramScene({ state, intensity, theme, levelsRef, pointer, hovering }: SceneProps) {
  const group = useRef<THREE.Points>(null);
  const geometry = useMemo(() => createGeometry(window.innerWidth < 700 ? 3000 : 5200), []);
  const audio = useMemo(() => new THREE.Vector3(), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uSpin: { value: 0.4 }, uExpand: { value: 1 },
    uEnergy: { value: 0.35 }, uHover: { value: 0 }, uSize: { value: 2.5 },
    uAudio: { value: new THREE.Vector3() }, uPointer: { value: new THREE.Vector3() },
    uPrimary: { value: new THREE.Color() }, uSecondary: { value: new THREE.Color() },
    uSpark: { value: new THREE.Color() },
  }), []);

  useEffect(() => {
    uniforms.uPrimary.value.set(theme.primary);
    uniforms.uSecondary.value.set(theme.secondary);
    uniforms.uSpark.value.set(theme.spark);
    uniforms.uSize.value = 2.5 * intensity;
  }, [intensity, theme, uniforms]);

  useFrame((_, delta) => {
    const target = STATES[state];
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uSpin.value = THREE.MathUtils.damp(uniforms.uSpin.value, target.spin, 5, delta);
    uniforms.uExpand.value = THREE.MathUtils.damp(uniforms.uExpand.value, target.expand, 5, delta);
    uniforms.uEnergy.value = THREE.MathUtils.damp(uniforms.uEnergy.value, target.energy, 5, delta);
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, hovering.current ? 1 : 0, 8, delta);
    uniforms.uAudio.value.lerp(audio, 1 - Math.exp(-delta * 10));
    uniforms.uPointer.value.lerp(pointer.current, 1 - Math.exp(-delta * 8));
    const levels = levelsRef.current?.() ?? [0, 0, 0];
    audio.set(...levels);
    if (group.current) group.current.rotation.y += delta * target.spin * 0.15;
  });

  return (
    <points ref={group} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function JarvisHologram({
  state = 'idle',
  audioSource,
  size = '100%',
  intensity = 1,
  colorTheme,
  onClick,
  onHoverChange,
}: Props) {
  const { analyser } = useAudioAnalyser(audioSource);
  const levelsRef = useRef<(() => Levels) | null>(null);
  const theme = useMemo(() => ({ ...DEFAULT_THEME, ...colorTheme }), [colorTheme]);
  const pointer = useRef(new THREE.Vector3());
  const hovering = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!analyser) {
      levelsRef.current = null;
      return;
    }
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    const average = (start: number, end: number) => {
      let total = 0;
      for (let index = start; index < Math.min(end, buffer.length); index += 1) total += buffer[index];
      return total / Math.max(1, end - start) / 255;
    };
    levelsRef.current = () => {
      analyser.getByteFrequencyData(buffer);
      return [
        Math.min(1, average(1, 4) * 1.6),
        Math.min(1, average(4, 24) * 2.2),
        Math.min(1, average(24, 90) * 4),
      ];
    };
    return () => {
      levelsRef.current = null;
    };
  }, [analyser]);

  useEffect(() => {
    const onVisibilityChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, width: size, height: size, zIndex: 0, touchAction: 'none' }}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current.set(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
          0.7,
        );
      }}
      onPointerEnter={() => { hovering.current = true; onHoverChange?.(true); }}
      onPointerLeave={() => { hovering.current = false; pointer.current.set(0, 0, 0.7); onHoverChange?.(false); }}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 40 }}
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <HologramScene
          state={state}
          intensity={intensity}
          theme={theme}
          levelsRef={levelsRef}
          pointer={pointer}
          hovering={hovering}
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.3} luminanceThreshold={0.08} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
