import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './HeroSection.css';

const HeroSection = ({ onMusicStart }) => {
  const heroRef = useRef(null);
  const musicStartedRef = useRef(false);

  useEffect(() => {
    // Start background music when component mounts (only once)
    if (onMusicStart && !musicStartedRef.current) {
      musicStartedRef.current = true;
      onMusicStart();
    }

    // Parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const background = heroRef.current.querySelector('.hero-background');
        const foreground = heroRef.current.querySelector('.hero-foreground');
        
        if (background) {
          background.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        if (foreground) {
          foreground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onMusicStart]);

  // Enhanced petal animation with smoother, more organic movement
  const createPetalAnimation = (index) => ({
    y: [0, -40 + Math.random() * 20, -20, 0],
    x: [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, 0],
    rotate: [0, 15 + Math.random() * 10, -15 - Math.random() * 10, 5, 0],
    scale: [1, 1.1, 0.95, 1],
    opacity: [0.5, 0.8, 0.7, 0.5],
    transition: {
      duration: 5 + Math.random() * 3,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1], // Custom cubic-bezier for smooth organic movement
      delay: index * 0.3,
    }
  });

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-background"></div>
      
      {/* Floating petals with enhanced animations */}
      <div className="petals-container">
        {[...Array(15)].map((_, i) => {
          const startLeft = Math.random() * 100;
          const startTop = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="petal"
              style={{
                left: `${startLeft}%`,
                top: `${startTop}%`,
              }}
              animate={createPetalAnimation(i)}
            >
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <path
                  d="M12 3 C10 5, 8 7, 10 9 C8 7, 6 5, 4 12 C6 14, 8 16, 10 14 C12 16, 14 14, 16 12 C14 10, 12 8, 12 3 Z"
                  fill="#B76E79"
                  opacity="0.7"
                  stroke="#800000"
                  strokeWidth="0.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2" fill="#D4AF37" opacity="0.6" />
              </motion.svg>
            </motion.div>
          );
        })}
      </div>

      <div className="hero-foreground">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            Happy Birthday, Mama 🌷
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            The world blooms beautifully because you're in it.
          </motion.p>
        </motion.div>

        {/* Photo frame */}
        <motion.div
          className="hero-photo-frame"
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="photo-placeholder">
            <img 
              src="/photos/m.jpeg" 
              alt="Beautiful memories"
              onError={(e) => {
                // Fallback to placeholder if image doesn't exist
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '8px',
                display: 'block'
              }}
            />
            <svg 
              width="200" 
              height="250" 
              viewBox="0 0 200 250"
              style={{ display: 'none' }}
            >
              <rect x="10" y="10" width="180" height="230" rx="8" fill="#FAF4EF" stroke="#800000" strokeWidth="2" strokeDasharray="5,5"/>
              <text x="100" y="130" textAnchor="middle" fill="#800000" fontSize="16" fontFamily="var(--font-primary)">
                Photo Here
              </text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

