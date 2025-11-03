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
  const backgroundMusicRef = useRef(null);

  const handleMusicStart = () => {
    // Initialize background music (placeholder - replace with actual music file)
    // Since we don't have an actual audio file, we'll create a silent placeholder
    // In production, replace this with your actual music file path
    const musicUrl = '/src/assets/music/background.mp3'; // Update this path
    
    // For now, we'll just set the state
    // In production, uncomment the following:
    /*
    const sound = new Howl({
      src: [musicUrl],
      html5: true,
      volume: 0.4,
      loop: true,
      onplay: () => setMusicPlaying(true),
      onloaderror: () => {
        console.warn('Background music file not found. Please add your music file to /src/assets/music/background.mp3');
        setMusicPlaying(false);
      }
    });
    
    sound.play();
    backgroundMusicRef.current = sound;
    setMusicPlaying(true);
    */
    
    // Placeholder for now
    setMusicPlaying(true);
    console.log('Music would start here. Add your background music file to /src/assets/music/background.mp3');
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
