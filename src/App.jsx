import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import GallerySection from './components/GallerySection';
import MessagesSection from './components/MessagesSection';
import InteractiveGarden from './components/InteractiveGarden';
import ClosingSection from './components/ClosingSection';
import './App.css';

// Module-level singleton to ensure only ONE Howl instance exists
// This persists across React remounts and prevents pool exhaustion
let globalMusicInstance = null;
let globalMusicInitialized = false;
let globalMusicCallbacks = null; // Store callbacks to update React state

// Singleton function to get or create music instance
function getMusicInstance() {
  if (globalMusicInstance) {
    return globalMusicInstance;
  }
  return null;
}

function createMusicInstance(onStateChange) {
  if (globalMusicInstance) {
    // If instance exists, just update callbacks
    globalMusicCallbacks = onStateChange;
    return globalMusicInstance;
  }

  const basePath = import.meta.env.BASE_URL || '/';
  const musicPath = `${basePath}music/backsound.mp3`.replace('//', '/');
  
  console.log('🎵 Creating SINGLE music instance...');
  console.log('📁 Music path:', musicPath);
  
  globalMusicCallbacks = onStateChange;
  globalMusicInitialized = true;
  
  globalMusicInstance = new Howl({
    src: [musicPath],
    html5: true,
    volume: 0.5,
    loop: true,
    preload: true,
    autoplay: true,
    pool: 1,
    poolSize: 1,
    onplay: () => {
      if (globalMusicCallbacks) {
        globalMusicCallbacks.setPlaying(true);
        globalMusicCallbacks.setInitialized(true);
      }
      console.log('✅ Background music started playing successfully!');
    },
    onend: () => {
      if (globalMusicInstance && globalMusicInstance.loop()) {
        setTimeout(() => {
          if (globalMusicInstance && !globalMusicInstance.playing()) {
            globalMusicInstance.play();
          }
        }, 100);
      }
    },
    onpause: () => {
      console.log('⏸️ Music paused (will auto-resume)');
    },
    onstop: () => {
      // Will be restarted by monitoring
    },
    onload: () => {
      console.log('✅ Music file loaded successfully');
    },
    onloaderror: (id, error) => {
      console.error('❌ Background music file failed to load/decode:', error);
      console.error('Tried to load from:', musicPath);
      if (globalMusicCallbacks) {
        globalMusicCallbacks.setPlaying(false);
        globalMusicCallbacks.setInitialized(false);
      }
    },
    onplayerror: (id, error) => {
      const errorMsg = error?.message || error?.toString() || String(error) || '';
      const isAutoplayRestriction = 
        errorMsg.includes('user interaction') ||
        errorMsg.includes('Playback was unable to start') ||
        errorMsg.includes('autoplay') ||
        errorMsg.includes('not allowed') ||
        errorMsg.includes('AudioContext');
      
      if (!isAutoplayRestriction && errorMsg) {
        console.log('⚠️ Playback issue:', errorMsg);
      }
    }
  });
  
  return globalMusicInstance;
}

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const musicLoadAttempted = useRef(false);
  const userInteractionHandled = useRef(false);
  const musicLoadFailed = useRef(false);
  const wasActuallyPlaying = useRef(false);
  
  // Use the singleton instance
  const backgroundMusicRef = useRef(null);

  // Initialize singleton instance on mount
  useEffect(() => {
    if (!backgroundMusicRef.current) {
      const instance = getMusicInstance();
      if (instance) {
        backgroundMusicRef.current = instance;
        // Update callbacks to use current state setters
        globalMusicCallbacks = {
          setPlaying: setMusicPlaying,
          setInitialized: setMusicInitialized
        };
      }
    }
  }, []);

  // Keep music playing continuously - monitor and restart if it stops unexpectedly
  // This ensures background music keeps playing no matter what
  useEffect(() => {
    // Don't monitor if music failed to load or hasn't been initialized
    const sound = getMusicInstance();
    if (!sound || !musicInitialized || musicLoadFailed.current) return;

    let consecutiveRestartFailures = 0;
    const maxConsecutiveFailures = 3; // Stop trying after 3 consecutive failures
    let lastPlayingCheck = false;

    const checkMusicPlaying = setInterval(() => {
      const sound = getMusicInstance();
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
    if (!musicInitialized) return;

    const handleAnyInteraction = async () => {
      const sound = getMusicInstance();
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
    const sound = getMusicInstance();
    if (!sound || musicPlaying) return;

    const handleUserInteraction = async () => {
      const sound = getMusicInstance();
      if (!sound) return;
      
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
    // Prevent multiple initializations
    if (musicLoadAttempted.current) {
      console.log('⏭️ Music initialization already attempted, skipping...');
      return;
    }
    
    // Check if singleton instance already exists
    const existingInstance = getMusicInstance();
    if (existingInstance) {
      console.log('⏭️ Music instance already exists, reusing...');
      backgroundMusicRef.current = existingInstance;
      // Update callbacks
      globalMusicCallbacks = {
        setPlaying: setMusicPlaying,
        setInitialized: setMusicInitialized
      };
      musicLoadAttempted.current = true;
      return;
    }
    
    // Set flag immediately to prevent race conditions
    musicLoadAttempted.current = true;
    
    // Create singleton instance
    const sound = createMusicInstance({
      setPlaying: setMusicPlaying,
      setInitialized: setMusicInitialized
    });
    
    backgroundMusicRef.current = sound;
    wasActuallyPlaying.current = false;
    
    try {
      const soundId = sound.play();
      if (soundId) {
        console.log('🎉 Music autoplay successful, sound ID:', soundId);
        wasActuallyPlaying.current = true;
      } else {
        console.log('📢 Music autoplay was prevented (normal in browsers)');
        console.log('👆 Music will play on first user click/touch');
      }
    } catch (error) {
      console.log('📢 Music autoplay prevented:', error.message);
      console.log('👆 Music will play on first user click/touch');
    }
  }, []);

  const handleMusicEnd = () => {
    const sound = getMusicInstance();
    if (sound) {
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
          setMusicPlaying(false);
        }
      }, interval);
    }
  };

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
