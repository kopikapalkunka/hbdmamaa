import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './ClosingSection.css';

const ClosingSection = ({ onMusicEnd }) => {
  const [petalsDrifting, setPetalsDrifting] = useState(true);

  useEffect(() => {
    // Fade out music when component mounts
    if (onMusicEnd) {
      setTimeout(() => {
        onMusicEnd();
      }, 2000);
    }
  }, [onMusicEnd]);

  return (
    <section className="closing-section">
      <div className="closing-background"></div>
      
      {/* Drifting petals with smoother animations */}
      <div className="petals-drifting">
        {[...Array(18)].map((_, i) => {
          const startLeft = (i * 5.5) % 100;
          const startTop = -20 - (i * 3) % 30;
          const driftX = (Math.sin(i) * 80) + (Math.cos(i * 0.5) * 40);
          const driftY = typeof window !== 'undefined' ? window.innerHeight + 200 : 1000;
          const duration = 10 + (i % 5) * 1.5;
          const delay = (i * 0.4) % 3;
          
          return (
            <motion.div
              key={i}
              className="drifting-petal"
              style={{
                left: `${startLeft}%`,
                top: `${startTop}%`,
              }}
              animate={{
                y: [0, driftY],
                x: [0, driftX],
                rotate: [0, 180 + i * 20, 360],
                opacity: [0.8, 0.9, 0.3, 0],
                scale: [1, 1.1, 0.9, 0.8],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1], // Smooth organic fall
                delay: delay,
              }}
            >
              <motion.svg 
                width="18" 
                height="18" 
                viewBox="0 0 18 18" 
                fill="none"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6 + i * 0.3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <path
                  d="M9 2 C7.5 3, 6 4, 7 5.5 C6 4, 4.5 3, 2.5 9 C4.5 10.5, 6 12, 7 10.5 C9 12, 12 10.5, 14.5 9 C12 6, 9 4, 9 2 Z"
                  fill="#B76E79"
                  opacity="0.75"
                  stroke="#800000"
                  strokeWidth="0.4"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="9" r="1.5" fill="#D4AF37" opacity="0.5" />
              </motion.svg>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="closing-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="closing-photo-frame"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="photo-placeholder-large">
            <img 
              src="/photos/m1.jpeg" 
              alt="Family photo"
              onError={(e) => {
                // Fallback to placeholder if image doesn't exist
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '12px',
                display: 'block'
              }}
            />
            <svg 
              width="300" 
              height="350" 
              viewBox="0 0 300 350"
              style={{ display: 'none' }}
            >
              <rect x="10" y="10" width="280" height="330" rx="12" fill="#FAF4EF" stroke="#800000" strokeWidth="3" strokeDasharray="6,6"/>
              <text x="150" y="185" textAnchor="middle" fill="#800000" fontSize="18" fontFamily="var(--font-primary)">
                Family Photo Here
              </text>
            </svg>
          </div>
        </motion.div>

        <motion.h2
          className="closing-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Termia kasih, Mama.
        </motion.h2>

        <motion.p
          className="closing-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          Karena sudah menjadi ibu sekaligus guru bagi anak anak mama.<br />
          I love you to the moon and back
        </motion.p>

        <motion.div
          className="closing-heart"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path
              d="M30 50 C30 50, 10 35, 10 20 C10 12, 16 8, 22 12 C24 8, 28 6, 30 10 C32 6, 36 8, 38 12 C44 8, 50 12, 50 20 C50 35, 30 50, 30 50 Z"
              fill="#B76E79"
              stroke="#800000"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ClosingSection;

