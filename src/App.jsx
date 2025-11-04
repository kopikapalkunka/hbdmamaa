import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import GallerySection from './components/GallerySection';
import MessagesSection from './components/MessagesSection';
import InteractiveGarden from './components/InteractiveGarden';
import ClosingSection from './components/ClosingSection';
import './App.css';

function App() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const backgroundMusicRef = useRef(null);

  // Handle user interaction to start music (required for autoplay policies)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!musicInitialized && backgroundMusicRef.current) {
        const sound = backgroundMusicRef.current;
        if (!sound.playing()) {
          sound.play();
        }
        setMusicInitialized(true);
        // Remove listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [musicInitialized]);

  const handleMusicStart = () => {
    // Initialize background music with the actual music file
    // Use public path so it works in both development and production
    const musicPath = '/music/Happy Birthday Song Music Box.mp3';
    
    const sound = new Howl({
      src: [musicPath],
      html5: true,
      volume: 0.5,
      loop: true,
      preload: true,
      onplay: () => {
        setMusicPlaying(true);
        console.log('Background music started playing');
      },
      onload: () => {
        console.log('Music file loaded successfully');
      },
      onloaderror: (id, error) => {
        console.warn('Background music file not found:', error);
        console.warn('Tried to load from:', musicPath);
        setMusicPlaying(false);
      },
      onplayerror: (id, error) => {
        console.warn('Error playing background music:', error);
        setMusicPlaying(false);
      }
    });
    
    // Try to play the music
    try {
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicInitialized(true);
            console.log('Music autoplay successful');
          })
          .catch(error => {
            console.log('Autoplay was prevented (normal in some browsers):', error);
            console.log('Music will play on user interaction');
            // Music will play when user interacts with the page
          });
      }
    } catch (error) {
      console.warn('Error attempting to play music:', error);
    }
    
    backgroundMusicRef.current = sound;
    setMusicInitialized(false); // Will be set to true on first user interaction
  };

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
      
      {/* Music status indicator (optional, can be removed) */}
      {musicPlaying && (
        <div className="music-indicator" style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          background: 'rgba(128, 0, 0, 0.7)', 
          color: 'white', 
          padding: '10px 15px', 
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          🎵 Music Playing
        </div>
      )}
    </div>
  );
}

export default App;
