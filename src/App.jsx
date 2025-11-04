import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import GallerySection from './components/GallerySection';
import MessagesSection from './components/MessagesSection';
import InteractiveGarden from './components/InteractiveGarden';
import ClosingSection from './components/ClosingSection';
import './App.css';

// Global flag to prevent multiple Howl instances across remounts
let globalMusicInitialized = false;

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const backgroundMusicRef = useRef(null);
  const musicLoadAttempted = useRef(false);
  const userInteractionHandled = useRef(false); // Track if user interaction already started music
  const musicLoadFailed = useRef(false); // Track if music file failed to load/decode
  const wasActuallyPlaying = useRef(false); // Track if music was actually playing at some point

  // Keep music playing continuously - monitor and restart if it stops unexpectedly
  // This ensures background music keeps playing no matter what
  useEffect(() => {
    // Don't monitor if music failed to load or hasn't been initialized
    if (!backgroundMusicRef.current || !musicInitialized || musicLoadFailed.current) return;

    let consecutiveRestartFailures = 0;
    const maxConsecutiveFailures = 3; // Stop trying after 3 consecutive failures
    let lastPlayingCheck = false;

    const checkMusicPlaying = setInterval(() => {
      const sound = backgroundMusicRef.current;
      if (!sound) return;
      
      // Check if audio is actually loaded and ready
      const soundState = sound.state();
      const isLoaded = soundState === 'loaded';
      const isCurrentlyPlaying = sound.playing();
      
      // Only restart if music was actually playing before and stopped
      // Don't restart if it was never playing or is still loading
      if (musicPlaying && wasActuallyPlaying.current && !isCurrentlyPlaying && isLoaded) {
        // Only log if we're actually restarting (not just checking)
        if (!lastPlayingCheck) {
          // Don't log - just restart silently
        }
        lastPlayingCheck = true;
        
        try {
          // Resume audio context if needed
          if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
            const audioContext = sound._sounds[0]._node.context;
            if (audioContext && audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                const soundId = sound.play();
                // Wait a bit before checking if it's actually playing
                setTimeout(() => {
                  if (sound.playing()) {
                    consecutiveRestartFailures = 0; // Reset on success
                    lastPlayingCheck = false;
                  } else {
                    consecutiveRestartFailures++;
                    if (consecutiveRestartFailures >= maxConsecutiveFailures) {
                      console.log('⚠️ Music restart failed multiple times, stopping attempts');
                      clearInterval(checkMusicPlaying);
                    }
                  }
                }, 100);
              }).catch(() => {
                // If resume fails, try playing anyway
                const soundId = sound.play();
                setTimeout(() => {
                  if (sound.playing()) {
                    consecutiveRestartFailures = 0;
                    lastPlayingCheck = false;
                  } else {
                    consecutiveRestartFailures++;
                  }
                }, 100);
              });
            } else {
              const soundId = sound.play();
              setTimeout(() => {
                if (sound.playing()) {
                  consecutiveRestartFailures = 0;
                  lastPlayingCheck = false;
                } else {
                  consecutiveRestartFailures++;
                }
              }, 100);
            }
          } else {
            const soundId = sound.play();
            setTimeout(() => {
              if (sound.playing()) {
                consecutiveRestartFailures = 0;
                lastPlayingCheck = false;
              } else {
                consecutiveRestartFailures++;
              }
            }, 100);
          }
        } catch (error) {
          consecutiveRestartFailures++;
          if (consecutiveRestartFailures >= maxConsecutiveFailures) {
            console.log('⚠️ Music restart failed multiple times, stopping attempts');
            clearInterval(checkMusicPlaying);
          }
        }
      } else if (isCurrentlyPlaying) {
        // Music is playing, reset failure counter and mark as actually playing
        wasActuallyPlaying.current = true;
        consecutiveRestartFailures = 0;
        lastPlayingCheck = false;
      } else {
        lastPlayingCheck = false;
      }
    }, 3000); // Check every 3 seconds to reduce console spam and be less aggressive

    return () => clearInterval(checkMusicPlaying);
  }, [musicPlaying, musicInitialized]);

  // Auto-resume audio context on any user interaction to keep music playing
  useEffect(() => {
    if (!backgroundMusicRef.current || !musicInitialized) return;

    const handleAnyInteraction = async () => {
      const sound = backgroundMusicRef.current;
      if (!sound) return;

      // Resume audio context if suspended
      if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
        const audioContext = sound._sounds[0]._node.context;
        if (audioContext && audioContext.state === 'suspended') {
          try {
            await audioContext.resume();
            // If music should be playing but isn't, start it
            if (musicPlaying && !sound.playing()) {
              const soundId = sound.play();
              if (soundId) {
                console.log('✅ Background music resumed after user interaction');
              }
            }
          } catch (error) {
            // Silently handle - AudioContext resume errors are common
          }
        }
      }
    };

    // Listen to all user interactions to keep audio context active
    document.addEventListener('click', handleAnyInteraction, { passive: true });
    document.addEventListener('touchstart', handleAnyInteraction, { passive: true });
    document.addEventListener('scroll', handleAnyInteraction, { passive: true });

    return () => {
      document.removeEventListener('click', handleAnyInteraction);
      document.removeEventListener('touchstart', handleAnyInteraction);
      document.removeEventListener('scroll', handleAnyInteraction);
    };
  }, [musicInitialized, musicPlaying]);

  // Handle user interaction to start music (required for autoplay policies)
  // This will start music on ANY user interaction if autoplay was blocked
  useEffect(() => {
    if (!backgroundMusicRef.current || musicPlaying) return;

    const handleUserInteraction = async () => {
      if (musicPlaying || !backgroundMusicRef.current) return;
      
      const sound = backgroundMusicRef.current;
      
      // Resume audio context if suspended (required for user interaction)
      if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
        const audioContext = sound._sounds[0]._node.context;
        if (audioContext && audioContext.state === 'suspended') {
          try {
            await audioContext.resume();
            console.log('✅ AudioContext resumed on user interaction');
          } catch (error) {
            // Silently handle - this is normal
          }
        }
      }
      
      // Start music if it's not already playing
      if (!sound.playing()) {
        try {
          const soundId = sound.play();
          if (soundId) {
            setMusicInitialized(true);
            setMusicPlaying(true);
            console.log('🎵 Background music started on user interaction!');
            // Remove listeners after successful start
            document.removeEventListener('click', handleUserInteraction, { capture: true });
            document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
            document.removeEventListener('scroll', handleUserInteraction, { capture: true });
          }
        } catch (error) {
          // Silently handle - will retry on next interaction
        }
      } else {
        // Already playing - remove listeners
        setMusicInitialized(true);
        document.removeEventListener('click', handleUserInteraction, { capture: true });
        document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
        document.removeEventListener('scroll', handleUserInteraction, { capture: true });
      }
    };

    // Add listeners to catch ANY user interaction to start music
    document.addEventListener('click', handleUserInteraction, { capture: true, once: true });
    document.addEventListener('touchstart', handleUserInteraction, { capture: true, once: true });
    document.addEventListener('scroll', handleUserInteraction, { capture: true, once: true, passive: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction, { capture: true });
      document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
      document.removeEventListener('scroll', handleUserInteraction, { capture: true });
    };
  }, [musicPlaying]);

  const handleMusicStart = useCallback(() => {
    // Prevent multiple initializations - check both refs and global flag
    if (globalMusicInitialized || musicLoadAttempted.current) {
      console.log('⏭️ Music initialization already attempted, skipping...');
      return;
    }
    
    if (backgroundMusicRef.current) {
      console.log('⏭️ Music already initialized (sound exists), skipping...');
      // Check if existing sound is valid
      const existingSound = backgroundMusicRef.current;
      try {
        const state = existingSound.state();
        if (state === 'loaded' || state === 'loading') {
          return; // Sound is valid, don't recreate
        }
      } catch (e) {
        // Sound is invalid, clean up
      }
      try {
        existingSound.unload();
      } catch (e) {
        // Ignore cleanup errors
      }
      backgroundMusicRef.current = null;
    }
    
    // Set flags immediately to prevent race conditions
    globalMusicInitialized = true;
    musicLoadAttempted.current = true;
    console.log('🎵 Starting music initialization (first time)...');
    
    // Clean up any existing sound instance before creating a new one
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.unload();
      } catch (e) {
        // Ignore cleanup errors
      }
      backgroundMusicRef.current = null;
    }
    
    // Initialize background music with backsound.mp3
    // Use public path so it works in both development and production
    const basePath = import.meta.env.BASE_URL || '/';
    const musicPath = `${basePath}music/backsound.mp3`.replace('//', '/');
    
    console.log('🎵 Initializing background music...');
    console.log('📁 Music path:', musicPath);
    console.log('🌐 Base URL:', basePath);
    console.log('🔗 Full URL:', window.location.origin + musicPath);
    
    const sound = new Howl({
      src: [musicPath],
      html5: true, // Use HTML5 audio as fallback - better compatibility for MP3 files
      volume: 0.5,
      loop: true,
      preload: true,
      autoplay: true, // Try to auto-play
      pool: 1, // Limit audio pool to prevent exhaustion
      poolSize: 1, // Explicitly set pool size to 1
      onplay: () => {
        setMusicPlaying(true);
        setMusicInitialized(true);
        wasActuallyPlaying.current = true; // Mark that music was actually playing
        userInteractionHandled.current = true; // Mark as handled when music starts
        console.log('✅ Background music started playing successfully!');
      },
      onend: () => {
        // Music ended - restart it immediately (shouldn't happen with loop, but safety)
        if (backgroundMusicRef.current && backgroundMusicRef.current.loop()) {
          console.log('🔄 Music ended unexpectedly, restarting...');
          setTimeout(() => {
            if (backgroundMusicRef.current && !backgroundMusicRef.current.playing()) {
              backgroundMusicRef.current.play();
            }
          }, 100);
        }
      },
      onpause: () => {
        // Don't update state - keep musicPlaying true so monitoring can restart it
        // This ensures background music continues even if browser pauses it
        console.log('⏸️ Music paused (will auto-resume)');
      },
      onstop: () => {
        // If music stops, don't update state - monitoring will restart it
        // Only log if it was actually playing before
        if (wasActuallyPlaying.current) {
          // Don't log - will be restarted silently
        }
      },
      onload: () => {
        console.log('✅ Music file loaded successfully');
        musicLoadFailed.current = false; // Mark as successfully loaded
      },
      onloaderror: (id, error) => {
        console.error('❌ Background music file failed to load/decode:', error);
        console.error('Tried to load from:', musicPath);
        console.error('Full URL would be:', window.location.origin + musicPath);
        console.error('⚠️ Please check if backsound.mp3 exists and is a valid MP3 audio file');
        console.error('💡 The file might be corrupted or in an unsupported format');
        console.error('💡 Try re-encoding the file as MP3 or check the file in an audio player');
        setMusicPlaying(false);
        setMusicInitialized(false);
        musicLoadFailed.current = true; // Mark as failed to prevent restart loop
        musicLoadAttempted.current = false; // Allow retry
      },
      onplayerror: (id, error) => {
        // Don't log autoplay restrictions as errors - this is normal browser behavior
        // Autoplay is blocked, music will play on user interaction
        const errorMsg = error?.message || error?.toString() || String(error) || '';
        const isAutoplayRestriction = 
          errorMsg.includes('user interaction') ||
          errorMsg.includes('Playback was unable to start') ||
          errorMsg.includes('autoplay') ||
          errorMsg.includes('not allowed') ||
          errorMsg.includes('AudioContext');
        
        // Silently ignore autoplay restrictions - they're expected
        if (!isAutoplayRestriction && errorMsg) {
          console.log('⚠️ Playback issue:', errorMsg);
        }
        // Otherwise, don't log anything - it's normal
      }
    });
    
    // Store the sound reference
    backgroundMusicRef.current = sound;
    
    // Try to play the music (will likely fail due to autoplay restrictions)
    // Howler.js play() returns a sound ID (number), not a Promise
    try {
      const soundId = sound.play();
      if (soundId) {
        // Sound started playing (autoplay worked!)
        console.log('🎉 Music autoplay successful, sound ID:', soundId);
      } else {
        // Play failed (likely autoplay restriction - this is normal)
        console.log('📢 Music autoplay was prevented (normal in browsers)');
        console.log('👆 Music will play on first user click/touch');
      }
    } catch (error) {
      console.log('📢 Music autoplay prevented:', error.message);
      console.log('👆 Music will play on first user click/touch');
    }
  }, []); // Empty deps - this function should never change

  const handleMusicEnd = () => {
    if (backgroundMusicRef.current) {
      const sound = backgroundMusicRef.current;
      const interval = 50;
      const duration = 2000;
      const steps = duration / interval;
      const volumeStep = sound.volume() / steps;

      const fadeInterval = setInterval(() => {
        const currentVolume = sound.volume();
        if (currentVolume > 0) {
          sound.volume(Math.max(0, currentVolume - volumeStep));
        } else {
          clearInterval(fadeInterval);
          sound.stop();
          sound.unload();
          setMusicPlaying(false);
        }
      }, interval);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop();
        backgroundMusicRef.current.unload();
      }
    };
  }, []);

  return (
    <div className="app">
      <HeroSection onMusicStart={handleMusicStart} />
      <IntroSection />
      <GallerySection />
      <MessagesSection />
      <InteractiveGarden />
      <ClosingSection onMusicEnd={handleMusicEnd} />
      </div>
  );
}

export default App;
