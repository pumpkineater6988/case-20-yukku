import { useEffect, useRef, useState } from 'react';

/**
 * useAudio — Silently loads background music from /audio/background.mp3
 * If the file doesn't exist, no error is thrown and the hook stays inactive.
 * Once the user places the file, a page refresh will auto-detect it.
 */
export function useAudio() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop   = true;
    audio.volume = 0.4;

    const onReady = () => setIsAvailable(true);
    const onError = () => {
      // File not found or unsupported — fail silently
      setIsAvailable(false);
    };

    audio.addEventListener('canplaythrough', onReady, { once: true });
    audio.addEventListener('error', onError, { once: true });

    // Set src AFTER listeners so we catch load errors
    audio.src = '/audio/background.mp3';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('canplaythrough', onReady);
      audio.removeEventListener('error', onError);
      audio.src = '';
    };
  }, []);

  // Auto-play on first user interaction
  useEffect(() => {
    if (hasInteracted && isAvailable && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [hasInteracted, isAvailable]);

  const toggle = () => {
    if (!audioRef.current || !isAvailable) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const markInteracted = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  return { isPlaying, isAvailable, toggle, markInteracted };
}
