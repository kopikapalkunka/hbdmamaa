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

  // Handle user interaction to start music (required for autoplay policies)
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (backgroundMusicRef.current) {
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
        
        if (!sound.playing()) {
          try {
            const soundId = sound.play();
            if (soundId) {
              setMusicInitialized(true);
              setMusicPlaying(true);
              console.log('🎵 Music started on user interaction!');
              // Remove listeners after successful start
              document.removeEventListener('click', handleUserInteraction);
              document.removeEventListener('touchstart', handleUserInteraction);
            }
          } catch (error) {
            console.log('⚠️ Could not start music:', error);
            // Retry after a short delay
            setTimeout(async () => {
              try {
                // Try to resume audio context again
                if (sound._sounds && sound._sounds[0] && sound._sounds[0]._node) {
                  const audioContext = sound._sounds[0]._node.context;
                  if (audioContext && audioContext.state === 'suspended') {
                    await audioContext.resume();
                  }
                }
                const retryId = sound.play();
                if (retryId) {
                  setMusicInitialized(true);
                  setMusicPlaying(true);
                  console.log('🎵 Music started on retry!');
                }
              } catch (retryError) {
                console.log('⚠️ Retry failed:', retryError);
              }
            }, 100);
          }
        } else {
          // Already playing
          setMusicInitialized(true);
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        }
      }
    };

    // Only add listeners if music hasn't started playing yet
    if (!musicPlaying && backgroundMusicRef.current) {
      // Use capture phase to catch interactions early
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
        console.log('✅ Background music started playing successfully!');
      },
      onpause: () => {
        setMusicPlaying(false);
        console.log('⏸️ Music paused');
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
