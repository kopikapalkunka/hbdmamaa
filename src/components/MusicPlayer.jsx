import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './MusicPlayer.css';

const MusicPlayer = ({ soundRef, onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (soundRef?.current) {
      // Check playing state immediately
      const checkPlaying = () => {
        if (soundRef.current?.playing()) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      };
      
      // Check immediately
      checkPlaying();
      
      // Then check periodically
      const interval = setInterval(checkPlaying, 500);

      return () => clearInterval(interval);
    }
  }, [soundRef]);

  const handleToggle = async () => {
    if (!soundRef?.current) {
      // If sound isn't loaded yet, show a message
      console.log('Music is loading... Please wait a moment.');
      return;
    }

    const sound = soundRef.current;
    
    // Resume audio context if suspended (required for user interaction)
    if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
      const audioContext = sound._sounds[0]._node.context;
      if (audioContext && audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
          console.log('✅ AudioContext resumed in music player');
        } catch (error) {
          console.log('Could not resume audio context:', error);
        }
      }
    }
    
    if (sound.playing()) {
      // User wants to pause - but only pause if they explicitly click pause
      sound.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      // User wants to play - ensure it stays playing
      try {
        const soundId = sound.play();
        if (soundId) {
          setIsPlaying(true);
          if (onPlay) onPlay();
          console.log('🎵 Music playing - will continue as background music');
        } else {
          console.log('Could not play music. Please try again.');
        }
      } catch (error) {
        console.log('Error playing music:', error);
        // Try to resume audio context if needed
        if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
          const audioContext = sound._sounds[0]._node.context;
          if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
              const retryId = sound.play();
              if (retryId) {
                setIsPlaying(true);
                if (onPlay) onPlay();
                console.log('🎵 Music playing after retry - will continue as background music');
              }
            });
          }
        }
      }
    }
  };

  return (
    <motion.div
      className="music-player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="music-play-btn"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="4" height="12" rx="1"/>
            <rect x="14" y="6" width="4" height="12" rx="1"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      <span className="music-label">
        {!soundRef?.current ? 'Loading...' : isPlaying ? 'Music Playing' : 'Tap to Play'}
      </span>
    </motion.div>
  );
};

export default MusicPlayer;

