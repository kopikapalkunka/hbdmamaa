import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AudioPlayer = ({ audioUrl, onStart, onEnd, volume = 0.5, loop = true }) => {
  const soundRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) {
      // If no audio URL provided, we'll create a silent placeholder
      // or skip audio initialization
      return;
    }

    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      volume: volume,
      loop: loop,
      onplay: () => {
        if (onStart) onStart();
      },
      onend: () => {
        if (onEnd) onEnd();
      },
      onloaderror: (id, error) => {
        console.warn('Audio load error:', error);
      },
      onplayerror: (id, error) => {
        console.warn('Audio play error:', error);
      }
    });

    soundRef.current = sound;

    // Start playing when component mounts
    sound.play();

    return () => {
      if (sound) {
        sound.stop();
        sound.unload();
      }
    };
  }, [audioUrl, volume, loop]);

  // Method to fade out and stop
  const fadeOut = (duration = 2000) => {
    if (soundRef.current) {
      const sound = soundRef.current;
      const interval = 50;
      const steps = duration / interval;
      const volumeStep = sound.volume() / steps;

      const fadeInterval = setInterval(() => {
        const currentVolume = sound.volume();
        if (currentVolume > 0) {
          sound.volume(Math.max(0, currentVolume - volumeStep));
        } else {
          clearInterval(fadeInterval);
          sound.stop();
        }
      }, interval);
    }
  };

  // Expose fadeOut method (can be called from parent via ref if needed)
  useEffect(() => {
    if (soundRef.current) {
      // Store fadeOut on the component instance
      soundRef.current._fadeOut = fadeOut;
    }
  }, [soundRef.current]);

  return null; // Audio player is invisible
};

export default AudioPlayer;

