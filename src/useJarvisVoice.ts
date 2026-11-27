import { useEffect, useState, useCallback, useRef } from 'react';

interface JarvisVoiceReturn {
  listening: boolean;
  speaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  startSpeaking: (text: string) => void;
  stopSpeaking: () => void;
}

export const useJarvisVoice = (): JarvisVoiceReturn => {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition if available
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        // Process speech recognition results
        console.log('Speech recognized:', event.results[event.results.length - 1][0].transcript);
      };

      recognitionRef.current.onend = () => {
        if (listening) {
          // Auto-restart if still supposed to be listening
          try {
            recognitionRef.current?.start();
          } catch {
            console.error('Error restarting speech recognition');
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [listening]);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = new SpeechSynthesisUtterance();
      synthesisRef.current.rate = 0.9;
      synthesisRef.current.pitch = 0.8;
      synthesisRef.current.volume = 0.8;

      synthesisRef.current.onend = () => {
        setSpeaking(false);
      };

      synthesisRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    setListening(false);
  }, []);

  const startSpeaking = useCallback((text: string) => {
    if (synthesisRef.current && 'speechSynthesis' in window) {
      try {
        synthesisRef.current.text = text;
        window.speechSynthesis.speak(synthesisRef.current);
        setSpeaking(true);
      } catch (error) {
        console.error('Error starting speech synthesis:', error);
      }
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  // Auto-stop speaking when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [stopSpeaking]);

  return {
    listening,
    speaking,
    startListening,
    stopListening,
    startSpeaking,
    stopSpeaking,
  };
};