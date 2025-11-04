import { useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import GallerySection from './components/GallerySection';
import MessagesSection from './components/MessagesSection';
import InteractiveGarden from './components/InteractiveGarden';
import ClosingSection from './components/ClosingSection';
import MusicPlayer from './components/MusicPlayer';
import './App.css';

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const backgroundMusicRef = useRef(null);
  const musicLoadAttempted = useRef(false);
  const userInteractionHandled = useRef(false); // Track if user interaction already started music

  // Keep music playing continuously - monitor and restart if it stops unexpectedly
  useEffect(() => {
    if (!backgroundMusicRef.current || !musicInitialized || !musicPlaying) return;

    let restartAttempts = 0;
    const maxRestartAttempts = 3; // Limit restart attempts

    const checkMusicPlaying = setInterval(() => {
      const sound = backgroundMusicRef.current;
      if (sound && musicPlaying && !sound.playing() && restartAttempts < maxRestartAttempts) {
        // Music should be playing but it stopped - restart it
        restartAttempts++;
        console.log(`🔄 Music stopped unexpectedly, restarting... (attempt ${restartAttempts})`);
        try {
          // Resume audio context if needed
          if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
            const audioContext = sound._sounds[0]._node.context;
            if (audioContext && audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                const soundId = sound.play();
                if (soundId) {
                  console.log('✅ Music restarted successfully');
                  restartAttempts = 0; // Reset on success
                }
              }).catch(() => {
                console.log('⚠️ Could not resume AudioContext');
              });
            } else {
              const soundId = sound.play();
              if (soundId) {
                console.log('✅ Music restarted successfully');
                restartAttempts = 0; // Reset on success
              }
            }
          } else {
            const soundId = sound.play();
            if (soundId) {
              console.log('✅ Music restarted successfully');
              restartAttempts = 0; // Reset on success
            }
          }
        } catch (error) {
          console.log('⚠️ Could not restart music:', error);
        }
      } else if (sound && sound.playing()) {
        // Music is playing, reset attempts
        restartAttempts = 0;
      }
    }, 2000); // Check every 2 seconds (less aggressive)

    return () => clearInterval(checkMusicPlaying);
  }, [musicPlaying, musicInitialized]);

  // Handle user interaction to start music (required for autoplay policies)
  useEffect(() => {
    // Only set up listeners if music hasn't been started by user interaction yet
    if (userInteractionHandled.current || musicPlaying) return;

    const handleUserInteraction = async () => {
      // Only handle once
      if (userInteractionHandled.current || !backgroundMusicRef.current) return;
      
      const sound = backgroundMusicRef.current;
      
      // Resume audio context if suspended (required for user interaction)
      if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
        const audioContext = sound._sounds[0]._node.context;
        if (audioContext && audioContext.state === 'suspended') {
          try {
            await audioContext.resume();
            console.log('✅ AudioContext resumed on user interaction');
          } catch (error) {
            console.log('⚠️ Could not resume AudioContext:', error);
          }
        }
      }
      
      // Only start music if it's not already playing
      if (!sound.playing()) {
        userInteractionHandled.current = true; // Mark as handled before attempting to play
        try {
          const soundId = sound.play();
          if (soundId) {
            setMusicInitialized(true);
            setMusicPlaying(true);
            console.log('🎵 Music started on user interaction!');
            // Remove all listeners - music will keep playing
            document.removeEventListener('click', handleUserInteraction, { capture: true });
            document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
          } else {
            // If play failed, allow retry
            userInteractionHandled.current = false;
          }
        } catch (error) {
          console.log('⚠️ Could not start music:', error);
          userInteractionHandled.current = false; // Allow retry
        }
      } else {
        // Already playing - mark as handled and remove listeners
        userInteractionHandled.current = true;
        setMusicInitialized(true);
        document.removeEventListener('click', handleUserInteraction, { capture: true });
        document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
      }
    };

    // Only add listeners if music hasn't started playing yet
    if (!musicPlaying && backgroundMusicRef.current) {
      // Use 'once' option so each listener only fires once
      document.addEventListener('click', handleUserInteraction, { capture: true, once: true });
      document.addEventListener('touchstart', handleUserInteraction, { capture: true, once: true });
    }

    return () => {
      document.removeEventListener('click', handleUserInteraction, { capture: true });
      document.removeEventListener('touchstart', handleUserInteraction, { capture: true });
    };
  }, [musicPlaying]);

  const handleMusicStart = useCallback(() => {
    // Prevent multiple initializations - check both refs
    if (musicLoadAttempted.current) {
      console.log('⏭️ Music initialization already attempted, skipping...');
      return;
    }
    
    if (backgroundMusicRef.current) {
      console.log('⏭️ Music already initialized (sound exists), skipping...');
      return;
    }
    
    // Set flag immediately to prevent race conditions
    musicLoadAttempted.current = true;
    console.log('🎵 Starting music initialization (first time)...');
    
    // Initialize background music with the actual music file
    // Use public path so it works in both development and production
    const basePath = import.meta.env.BASE_URL || '/';
    const musicPath = `${basePath}music/Happy Birthday Song Music Box.mp3`.replace('//', '/');
    
    console.log('🎵 Initializing background music...');
    console.log('📁 Music path:', musicPath);
    console.log('🌐 Base URL:', basePath);
    console.log('🔗 Full URL:', window.location.origin + musicPath);
    
    const sound = new Howl({
      src: [musicPath],
      html5: false, // Use Web Audio API instead of HTML5 for better control
      volume: 0.5,
      loop: true,
      preload: true,
      pool: 1, // Limit audio pool to prevent exhaustion
      onplay: () => {
        setMusicPlaying(true);
        setMusicInitialized(true);
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
        // Only update state if user explicitly paused, not if it stopped due to error
        console.log('⏸️ Music paused');
        // Don't automatically set musicPlaying to false - let user control it
      },
      onload: () => {
        console.log('✅ Music file loaded successfully');
      },
      onloaderror: (id, error) => {
        console.error('❌ Background music file not found:', error);
        console.error('Tried to load from:', musicPath);
        console.error('Full URL would be:', window.location.origin + musicPath);
        setMusicPlaying(false);
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
      
      {/* Music Player Button - Always visible */}
      <MusicPlayer 
        soundRef={backgroundMusicRef}
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />
      </div>
  );
}

export default App;
