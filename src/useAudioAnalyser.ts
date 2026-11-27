import { useEffect, useRef, useState } from 'react';

interface AudioAnalyserReturn {
  analyser: AnalyserNode | null;
  audioElement: HTMLAudioElement | null;
}

export const useAudioAnalyser = (
  audioSource: HTMLAudioElement | MediaStream | undefined
): AudioAnalyserReturn => {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Clean up previous context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (!audioSource) {
      queueMicrotask(() => {
        setAnalyser(null);
        setAudioElement(null);
      });
      return;
    }

    // Create new audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    let mediaElementSource: MediaElementAudioSourceNode | null = null;
    let mediaStreamSource: MediaStreamAudioSourceNode | null = null;

    try {
      if (audioSource instanceof HTMLAudioElement) {
        // Handle HTMLAudioElement
        queueMicrotask(() => setAudioElement(audioSource));
        mediaElementSource = audioContext.createMediaElementSource(audioSource);
        mediaElementSource.connect(audioContext.destination);
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        mediaElementSource.connect(analyserNode);
        queueMicrotask(() => setAnalyser(analyserNode));
      } else if (audioSource instanceof MediaStream) {
        // Handle MediaStream (from microphone)
        mediaStreamSource = audioContext.createMediaStreamSource(audioSource);
        mediaStreamSource.connect(audioContext.destination);
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        mediaStreamSource.connect(analyserNode);
        queueMicrotask(() => setAnalyser(analyserNode));
      }
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
      queueMicrotask(() => {
        setAnalyser(null);
        setAudioElement(null);
      });
    }

    // Cleanup function
    return () => {
      if (mediaElementSource) {
        mediaElementSource.disconnect();
      }
      if (mediaStreamSource) {
        mediaStreamSource.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioSource]);

  return { analyser, audioElement };
};