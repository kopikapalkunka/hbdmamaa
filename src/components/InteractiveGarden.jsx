import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './InteractiveGarden.css';

const InteractiveGarden = () => {
  const [activeFlower, setActiveFlower] = useState(null);
  const [plantedSeeds, setPlantedSeeds] = useState([]);

  const flowers = [
    { 
      id: 1, 
      x: 160, 
      y: 180, 
      message: "Every smile you gave helped us grow.",
      type: "sunflower",
      size: 1.2
    },
    { 
      id: 2, 
      x: 400, 
      y: 120, 
      message: "Your love is the sunshine that nurtures us.",
      type: "rose",
      size: 1.3
    },
    { 
      id: 3, 
      x: 640, 
      y: 210, 
      message: "Your kindness blooms in our hearts forever.",
      type: "daisy",
      size: 1.2
    },
    { 
      id: 4, 
      x: 120, 
      y: 420, 
      message: "You planted seeds of happiness everywhere.",
      type: "tulip",
      size: 1.5
    },
    { 
      id: 5, 
      x: 560, 
      y: 450, 
      message: "Your wisdom grows like a strong tree.",
      type: "spiderlily",
      size: 1.3
    },
  ];

  const handleFlowerClick = (flower) => {
    setActiveFlower(flower);
    setTimeout(() => setActiveFlower(null), 3500);
  };

  const handlePotSwipe = () => {
    const seedId = Date.now();
    setPlantedSeeds([...plantedSeeds, seedId]);
    setTimeout(() => {
      setPlantedSeeds(plantedSeeds.filter(id => id !== seedId));
    }, 4000);
  };

  const potHandlers = useSwipeable({
    onSwipedUp: handlePotSwipe,
    onSwipedDown: handlePotSwipe,
    trackMouse: true,
  });

  // Sunflower component - Enhanced & Optimized for Mobile
  const Sunflower = ({ x, y, size, delay }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const petalCount = isMobile ? 12 : 16; // Reduce petals on mobile
    const innerPetalCount = isMobile ? 8 : 12;
    
    return (
    <g>
      <defs>
        <radialGradient id={`sunflowerGrad${x}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D4AF37" />
        </radialGradient>
        <radialGradient id={`sunflowerCenter${x}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="70%" stopColor="#654321" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
      </defs>
      
      {/* Shadow layer - static on mobile */}
      {!isMobile && (
        <circle
          cx={x + 2}
          cy={y + 3}
          r={35 * size}
          fill="#000000"
          opacity="0.1"
        />
      )}
      
      {/* Outer petals */}
      {[...Array(petalCount)].map((_, i) => {
        const angle = (i * 360 / petalCount) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 28 * size;
        const petalY = y + Math.sin(angle) * 28 * size;
        
        return (
          <motion.ellipse
            key={`outer-${i}`}
            cx={petalX}
            cy={petalY}
            rx={11 * size}
            ry={20 * size}
            fill={`url(#sunflowerGrad${x})`}
            stroke="#B8860B"
            strokeWidth="1.5"
            transform={`rotate(${i * (360 / petalCount)} ${petalX} ${petalY})`}
            filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + i * 0.03,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Inner petals */}
      {[...Array(innerPetalCount)].map((_, i) => {
        const angle = ((i * 360 / innerPetalCount) + 15) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 18 * size;
        const petalY = y + Math.sin(angle) * 18 * size;
        
        return (
          <motion.ellipse
            key={`inner-${i}`}
            cx={petalX}
            cy={petalY}
            rx={8 * size}
            ry={15 * size}
            fill="#FFE66D"
            stroke="#DAA520"
            strokeWidth="1"
            transform={`rotate(${i * (360 / innerPetalCount) + 15} ${petalX} ${petalY})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + 0.3 + i * 0.03,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Center */}
      <motion.circle
        cx={x}
        cy={y}
        r={16 * size}
        fill={`url(#sunflowerCenter${x})`}
        stroke="#3E2723"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Fibonacci spiral pattern - reduced on mobile */}
      {[...Array(isMobile ? 20 : 40)].map((_, i) => {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = i * goldenAngle;
        const radius = Math.sqrt(i) * 2.5 * size;
        const dotX = x + Math.cos(angle) * radius;
        const dotY = y + Math.sin(angle) * radius;
        
        return (
          <motion.circle
            key={`seed-${i}`}
            cx={dotX}
            cy={dotY}
            r={1.8}
            fill="#2C1810"
            opacity="0.7"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.8 + i * 0.01, duration: 0.3 }}
          />
        );
      })}
    </g>
    );
  };

  // Rose component - Enhanced
  const Rose = ({ x, y, size, delay }) => (
    <g>
      <defs>
        <radialGradient id={`roseGrad${x}`} cx="40%" cy="30%">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="40%" stopColor="#F08A9D" />
          <stop offset="100%" stopColor="#C85A7A" />
        </radialGradient>
      </defs>
      
      {/* Outer large petals */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360 / 8) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 25 * size;
        const petalY = y + Math.sin(angle) * 25 * size;
        const cp1X = x + Math.cos(angle - 0.3) * 15 * size;
        const cp1Y = y + Math.sin(angle - 0.3) * 15 * size;
        const cp2X = x + Math.cos(angle + 0.3) * 15 * size;
        const cp2Y = y + Math.sin(angle + 0.3) * 15 * size;
        
        return (
          <motion.path
            key={`outer-${i}`}
            d={`M ${x} ${y} Q ${cp1X} ${cp1Y} ${petalX} ${petalY} Q ${cp2X} ${cp2Y} ${x} ${y}`}
            fill={`url(#roseGrad${x})`}
            stroke="#8B4558"
            strokeWidth="1.5"
            opacity="0.95"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            transition={{ 
              delay: delay + i * 0.05,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Middle petals */}
      {[...Array(6)].map((_, i) => {
        const angle = ((i * 360 / 6) + 30) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 16 * size;
        const petalY = y + Math.sin(angle) * 16 * size;
        
        return (
          <motion.ellipse
            key={`mid-${i}`}
            cx={petalX}
            cy={petalY}
            rx={9 * size}
            ry={14 * size}
            fill="#F08A9D"
            stroke="#D06A85"
            strokeWidth="1.2"
            transform={`rotate(${i * 60 + 30} ${petalX} ${petalY})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + 0.3 + i * 0.05,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Inner tight petals */}
      {[...Array(5)].map((_, i) => {
        const angle = (i * 360 / 5) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 8 * size;
        const petalY = y + Math.sin(angle) * 8 * size;
        
        return (
          <motion.ellipse
            key={`inner-${i}`}
            cx={petalX}
            cy={petalY}
            rx={5 * size}
            ry={8 * size}
            fill="#FFD1DC"
            stroke="#FFB6C1"
            strokeWidth="0.8"
            transform={`rotate(${i * 72} ${petalX} ${petalY})`}
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              delay: delay + 0.6 + i * 0.05,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Center bud */}
      <motion.circle
        cx={x}
        cy={y}
        r={5 * size}
        fill="#FFE4E9"
        stroke="#FFB6C1"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.9, duration: 0.5 }}
      />
      
      {/* Tiny center */}
      <motion.circle
        cx={x}
        cy={y}
        r={2 * size}
        fill="#D4AF37"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 1, duration: 0.3 }}
      />
    </g>
  );

  // Daisy component - Enhanced
  const Daisy = ({ x, y, size, delay }) => (
    <g>
      <defs>
        <radialGradient id={`daisyPetal${x}`} cx="50%" cy="20%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#FAFAFA" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </radialGradient>
        <radialGradient id={`daisyCenter${x}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
      </defs>
      
      {/* Petals - white and pure */}
      {[...Array(13)].map((_, i) => {
        const angle = (i * 360 / 13) * (Math.PI / 180);
        const petalX = x + Math.cos(angle) * 26 * size;
        const petalY = y + Math.sin(angle) * 26 * size;
        
        return (
          <motion.ellipse
            key={`petal-${i}`}
            cx={petalX}
            cy={petalY}
            rx={8 * size}
            ry={18 * size}
            fill={`url(#daisyPetal${x})`}
            stroke="#E0E0E0"
            strokeWidth="1.5"
            transform={`rotate(${i * 27.7} ${petalX} ${petalY})`}
            filter="drop-shadow(0 2px 3px rgba(0,0,0,0.1))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + i * 0.04,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        );
      })}
      
      {/* Outer ring of center */}
      <motion.circle
        cx={x}
        cy={y}
        r={12 * size}
        fill={`url(#daisyCenter${x})`}
        stroke="#FF8C00"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Inner details ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360 / 12) * (Math.PI / 180);
        const dotX = x + Math.cos(angle) * 7 * size;
        const dotY = y + Math.sin(angle) * 7 * size;
        
        return (
          <motion.circle
            key={`ring-${i}`}
            cx={dotX}
            cy={dotY}
            r={1.8}
            fill="#FF8C00"
            opacity="0.7"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.8 + i * 0.02, duration: 0.3 }}
          />
        );
      })}
      
      {/* Center highlight */}
      <motion.circle
        cx={x - 3 * size}
        cy={y - 3 * size}
        r={4 * size}
        fill="#FFFFFF"
        opacity="0.4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 1, duration: 0.3 }}
      />
    </g>
  );

  // Tulip component
  const Tulip = ({ x, y, size, delay }) => (
    <g>
      {/* Back left petal */}
      <motion.path
        d={`M ${x - 12 * size} ${y + 3 * size} Q ${x - 16 * size} ${y - 18 * size} ${x - 6 * size} ${y - 25 * size} Q ${x - 3 * size} ${y - 12 * size} ${x} ${y - 2 * size}`}
        fill="#D08595"
        stroke="#B76E79"
        strokeWidth="1.5"
        opacity="0.9"
        initial={{ scale: 0, x: -10 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: delay, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      
      {/* Back right petal */}
      <motion.path
        d={`M ${x + 12 * size} ${y + 3 * size} Q ${x + 16 * size} ${y - 18 * size} ${x + 6 * size} ${y - 25 * size} Q ${x + 3 * size} ${y - 12 * size} ${x} ${y - 2 * size}`}
        fill="#D08595"
        stroke="#B76E79"
        strokeWidth="1.5"
        opacity="0.9"
        initial={{ scale: 0, x: 10 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: delay + 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      
      {/* Front left petal */}
      <motion.path
        d={`M ${x - 10 * size} ${y + 2 * size} Q ${x - 14 * size} ${y - 12 * size} ${x - 5 * size} ${y - 22 * size} Q ${x - 2 * size} ${y - 8 * size} ${x} ${y}`}
        fill="#FFB6C1"
        stroke="#E6A4B4"
        strokeWidth="1.5"
        initial={{ scale: 0, x: -8 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      
      {/* Front right petal */}
      <motion.path
        d={`M ${x + 10 * size} ${y + 2 * size} Q ${x + 14 * size} ${y - 12 * size} ${x + 5 * size} ${y - 22 * size} Q ${x + 2 * size} ${y - 8 * size} ${x} ${y}`}
        fill="#FFB6C1"
        stroke="#E6A4B4"
        strokeWidth="1.5"
        initial={{ scale: 0, x: 8 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      
      {/* Center front petal */}
      <motion.path
        d={`M ${x - 6 * size} ${y} Q ${x} ${y - 28 * size} ${x + 6 * size} ${y} Q ${x + 3 * size} ${y + 4 * size} ${x} ${y + 2 * size} Q ${x - 3 * size} ${y + 4 * size} ${x - 6 * size} ${y}`}
        fill="#FFC8D3"
        stroke="#FFB6C1"
        strokeWidth="1"
        initial={{ scale: 0, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: delay + 0.4, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      
      {/* Inner details */}
      <motion.path
        d={`M ${x - 4 * size} ${y - 8 * size} Q ${x} ${y - 18 * size} ${x + 4 * size} ${y - 8 * size}`}
        fill="none"
        stroke="#B76E79"
        strokeWidth="1.2"
        opacity="0.6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.6 }}
      />
      
      {/* Stamen group */}
      {[...Array(3)].map((_, i) => (
        <motion.circle
          key={i}
          cx={x + (i - 1) * 3 * size}
          cy={y - 8 * size}
          r={2.5 * size}
          fill="#2C1810"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.7 + i * 0.05, duration: 0.4 }}
        />
      ))}
    </g>
  );

  // Spider Lily component
  const SpiderLily = ({ x, y, size, delay }) => (
    <g>
      {/* Petals - thin and curled */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const petalEndX = x + Math.cos(angle) * 35 * size;
        const petalEndY = y + Math.sin(angle) * 35 * size;
        const controlX = x + Math.cos(angle) * 18 * size;
        const controlY = y + Math.sin(angle) * 18 * size;
        const curlX = petalEndX + Math.cos(angle) * 8 * size;
        const curlY = petalEndY + Math.sin(angle) * 8 * size;
        
        return (
          <g key={`petal-${i}`}>
            {/* Main petal */}
            <motion.path
              d={`M ${x} ${y} Q ${controlX} ${controlY} ${petalEndX} ${petalEndY} Q ${curlX} ${curlY} ${petalEndX + 2} ${petalEndY + 2}`}
              stroke="#FF6B9D"
              strokeWidth={3 * size}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                delay: delay + i * 0.08,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            />
            
            {/* Inner gradient line */}
            <motion.path
              d={`M ${x} ${y} Q ${controlX} ${controlY} ${petalEndX} ${petalEndY}`}
              stroke="#FFB6C1"
              strokeWidth={1.5 * size}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ 
                delay: delay + 0.2 + i * 0.08,
                duration: 0.8,
                ease: "easeOut"
              }}
            />
          </g>
        );
      })}
      
      {/* Long stamens */}
      {[...Array(6)].map((_, i) => {
        const angle = ((i * 60) + 30) * (Math.PI / 180);
        const stamenEndX = x + Math.cos(angle) * 28 * size;
        const stamenEndY = y + Math.sin(angle) * 28 * size;
        
        return (
          <g key={`stamen-${i}`}>
            <motion.line
              x1={x}
              y1={y}
              x2={stamenEndX}
              y2={stamenEndY}
              stroke="#D4AF37"
              strokeWidth={1.5 * size}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ 
                delay: delay + 0.5 + i * 0.05,
                duration: 0.6
              }}
            />
            <motion.circle
              cx={stamenEndX}
              cy={stamenEndY}
              r={2.5 * size}
              fill="#FFD700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: delay + 0.8 + i * 0.05,
                duration: 0.4
              }}
            />
          </g>
        );
      })}
      
      {/* Center */}
      <motion.circle
        cx={x}
        cy={y}
        r={4 * size}
        fill="#FF1493"
        stroke="#C71585"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 1, duration: 0.5 }}
      />
    </g>
  );

  // Render the appropriate flower type
  const renderFlower = (flower, delay) => {
    const props = { x: flower.x, y: flower.y, size: flower.size, delay };
    
    switch (flower.type) {
      case 'sunflower':
        return <Sunflower {...props} />;
      case 'rose':
        return <Rose {...props} />;
      case 'daisy':
        return <Daisy {...props} />;
      case 'tulip':
        return <Tulip {...props} />;
      case 'spiderlily':
        return <SpiderLily {...props} />;
      default:
        return <Sunflower {...props} />;
    }
  };

  return (
    <section className="interactive-garden-section">
      <div className="garden-background"></div>
      
      <div className="garden-container">
        <h2 className="garden-title">Interactive Garden</h2>
        <p className="garden-subtitle">Tap flowers to discover messages</p>
        
        <div className="garden-canvas">
          {/* SVG Garden Scene */}
          <svg className="garden-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FAF4EF" />
                <stop offset="100%" stopColor="#E8D8C8" />
              </linearGradient>
              
              {/* Watercolor brush texture */}
              <filter id="watercolor">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8"/>
                <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"/>
              </filter>
            </defs>
            
            <rect width="800" height="600" fill="url(#skyGradient)" />
            
            {/* Ground with texture */}
            <rect x="0" y="500" width="800" height="100" fill="#9CAF88" opacity="0.3" />
            <path d="M 0 500 Q 200 490, 400 500 T 800 500" 
                  fill="none" 
                  stroke="#9CAF88" 
                  strokeWidth="2" 
                  opacity="0.5" 
                  strokeDasharray="3,5" />
            
            {/* Interactive Flowers */}
            {flowers.map((flower) => (
              <motion.g
                key={flower.id}
                className="flower-interactive"
                style={{ cursor: 'pointer' }}
                onClick={() => handleFlowerClick(flower)}
                whileHover={{ 
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 1.5, -1.5, 0],
                }}
                transition={{
                  duration: 5 + flower.id * 0.5,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: flower.id * 0.5,
                }}
                style={{
                  willChange: 'transform',
                  transformOrigin: `${flower.x}px ${flower.y}px`,
                }}
              >
                {/* Flower stem with organic curve - connects from pot */}
                <motion.path
                  d={`M ${400} 462 Q ${flower.x - (flower.x - 400) * 0.4} ${flower.y + 50}, ${flower.x} ${flower.y + 10}`}
                  stroke="#9CAF88"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: flower.id * 0.2, ease: "easeOut" }}
                />
                
                {/* Leaves */}
                <motion.ellipse
                  cx={flower.x - 15}
                  cy={flower.y + 35}
                  rx="14"
                  ry="28"
                  fill="#9CAF88"
                  opacity="0.7"
                  stroke="#7A9178"
                  strokeWidth="1"
                  transform={`rotate(-35 ${flower.x - 15} ${flower.y + 35})`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  transition={{ duration: 0.8, delay: 0.8 + flower.id * 0.2, ease: "easeOut" }}
                />
                <motion.ellipse
                  cx={flower.x + 15}
                  cy={flower.y + 35}
                  rx="14"
                  ry="28"
                  fill="#9CAF88"
                  opacity="0.7"
                  stroke="#7A9178"
                  strokeWidth="1"
                  transform={`rotate(35 ${flower.x + 15} ${flower.y + 35})`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  transition={{ duration: 0.8, delay: 1 + flower.id * 0.2, ease: "easeOut" }}
                />
                
                {/* Render the appropriate flower */}
                {renderFlower(flower, 1.2 + flower.id * 0.2)}
              </motion.g>
            ))}
            
            {/* Beautiful decorative pot */}
            <motion.g
              {...potHandlers}
              className="pot-interactive"
              style={{ cursor: 'grab' }}
              whileHover={{ 
                scale: 1.08,
                filter: "drop-shadow(0 8px 16px rgba(128, 0, 0, 0.4))"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Pot base shadow */}
              <ellipse 
                cx="400" 
                cy="505" 
                rx="65" 
                ry="8" 
                fill="#000000" 
                opacity="0.15"
              />
              
              {/* Pot body - clay texture */}
              <defs>
                <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A0522D" />
                  <stop offset="50%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#6B3410" />
                </linearGradient>
                <linearGradient id="potRimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B8774D" />
                  <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
              </defs>
              
              {/* Main pot body */}
              <path
                d="M 340 500 Q 335 490, 340 480 L 340 465 Q 340 460, 345 460 L 455 460 Q 460 460, 460 465 L 460 480 Q 465 490, 460 500 Z"
                fill="url(#potGradient)"
                stroke="#654321"
                strokeWidth="2"
              />
              
              {/* Pot rim/lip */}
              <ellipse 
                cx="400" 
                cy="462" 
                rx="60" 
                ry="12" 
                fill="url(#potRimGradient)"
                stroke="#654321"
                strokeWidth="1.5"
              />
              
              {/* Decorative band */}
              <rect 
                x="345" 
                y="475" 
                width="110" 
                height="8" 
                rx="2"
                fill="#B76E79"
                opacity="0.8"
              />
              
              {/* Decorative pattern on band */}
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={355 + i * 13}
                  cy="479"
                  r="2.5"
                  fill="#D4AF37"
                />
              ))}
              
              {/* Highlight on pot */}
              <ellipse
                cx="370"
                cy="475"
                rx="15"
                ry="20"
                fill="#FFFFFF"
                opacity="0.15"
              />
              
              {/* Pot bottom */}
              <ellipse 
                cx="400" 
                cy="500" 
                rx="60" 
                ry="10" 
                fill="#6B3410"
                stroke="#4A2410"
                strokeWidth="1.5"
              />
              
              {/* Soil */}
              <ellipse 
                cx="400" 
                cy="462" 
                rx="55" 
                ry="10" 
                fill="#5C4033"
                opacity="0.9"
              />
              
              {/* Text */}
              <text 
                x="400" 
                y="480" 
                textAnchor="middle" 
                fill="#FAF4EF" 
                fontSize="13" 
                fontFamily="var(--font-accent)"
                fontWeight="600"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                ✨ Swipe ✨
              </text>
            </motion.g>
          </svg>

          {/* Flower messages popup */}
          <AnimatePresence mode="wait">
            {activeFlower && (
              <motion.div
                className="flower-message"
                initial={{ opacity: 0, scale: 0.6, y: 30, rotateX: -15 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateX: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: -20,
                  rotateX: 15
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
              >
                <div className="message-popup">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Icon based on flower type */}
                    {activeFlower.type === 'sunflower' && (
                      <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '0.5rem' }}>
                        <circle cx="25" cy="25" r="8" fill="#8B4513"/>
                        {[...Array(12)].map((_, i) => {
                          const angle = (i * 30) * (Math.PI / 180);
                          return (
                            <ellipse
                              key={i}
                              cx={25 + Math.cos(angle) * 15}
                              cy={25 + Math.sin(angle) * 15}
                              rx="4"
                              ry="8"
                              fill="#FFD700"
                              transform={`rotate(${i * 30} ${25 + Math.cos(angle) * 15} ${25 + Math.sin(angle) * 15})`}
                            />
                          );
                        })}
                      </svg>
                    )}
                    {activeFlower.type === 'rose' && (
                      <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '0.5rem' }}>
                        <circle cx="25" cy="25" r="12" fill="#B76E79" opacity="0.8"/>
                        <circle cx="25" cy="25" r="6" fill="#D08595" opacity="0.9"/>
                        <circle cx="25" cy="25" r="3" fill="#E6A4B4"/>
                      </svg>
                    )}
                    {activeFlower.type === 'daisy' && (
                      <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '0.5rem' }}>
                        <circle cx="25" cy="25" r="6" fill="#FFD700"/>
                        {[...Array(8)].map((_, i) => {
                          const angle = (i * 45) * (Math.PI / 180);
                          return (
                            <ellipse
                              key={i}
                              cx={25 + Math.cos(angle) * 12}
                              cy={25 + Math.sin(angle) * 12}
                              rx="4"
                              ry="8"
                              fill="#FFFFFF"
                              stroke="#F0F0F0"
                              transform={`rotate(${i * 45} ${25 + Math.cos(angle) * 12} ${25 + Math.sin(angle) * 12})`}
                            />
                          );
                        })}
                      </svg>
                    )}
                    {activeFlower.type === 'tulip' && (
                      <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '0.5rem' }}>
                        <path d="M 25 35 Q 18 20, 20 15 Q 25 10, 25 15 Q 25 10, 30 15 Q 32 20, 25 35" 
                              fill="#FFB6C1" 
                              stroke="#E6A4B4" 
                              strokeWidth="1.5"/>
                      </svg>
                    )}
                    {activeFlower.type === 'spiderlily' && (
                      <svg width="50" height="50" viewBox="0 0 50 50" style={{ marginBottom: '0.5rem' }}>
                        <circle cx="25" cy="25" r="3" fill="#FF1493"/>
                        {[...Array(6)].map((_, i) => {
                          const angle = (i * 60) * (Math.PI / 180);
                          return (
                            <line
                              key={i}
                              x1="25"
                              y1="25"
                              x2={25 + Math.cos(angle) * 18}
                              y2={25 + Math.sin(angle) * 18}
                              stroke="#FF6B9D"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          );
                        })}
                      </svg>
                    )}
                    <p>{activeFlower.message}</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Growing plant animation for pot swipe */}
          <AnimatePresence>
            {plantedSeeds.map((seedId) => (
              <motion.div
                key={seedId}
                className="growing-plant"
                initial={{ scale: 0, y: 470, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  y: 340,
                  opacity: [0, 1, 1, 0.8]
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.5 }
                }}
                transition={{ 
                  duration: 3,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
              >
                <motion.svg 
                  width="60" 
                  height="120" 
                  viewBox="0 0 60 120"
                >
                  {/* Stem */}
                  <motion.path
                    d="M30 120 Q28 80, 30 50 Q32 25, 30 15"
                    stroke="#9CAF88"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                  {/* Leaves */}
                  <motion.ellipse
                    cx="20"
                    cy="60"
                    rx="10"
                    ry="22"
                    fill="#9CAF88"
                    opacity="0.8"
                    transform="rotate(-45 20 60)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                  />
                  <motion.ellipse
                    cx="40"
                    cy="60"
                    rx="10"
                    ry="22"
                    fill="#9CAF88"
                    opacity="0.8"
                    transform="rotate(45 40 60)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  />
                  {/* Sunflower bloom */}
                  {[...Array(10)].map((_, i) => {
                    const angle = (i * 36) * (Math.PI / 180);
                    return (
                      <motion.ellipse
                        key={i}
                        cx={30 + Math.cos(angle) * 12}
                        cy={15 + Math.sin(angle) * 12}
                        rx="4"
                        ry="10"
                        fill="#FFD700"
                        transform={`rotate(${i * 36} ${30 + Math.cos(angle) * 12} ${15 + Math.sin(angle) * 12})`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2 + i * 0.05, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      />
                    );
                  })}
                  <motion.circle
                    cx="30"
                    cy="15"
                    r="8"
                    fill="#8B4513"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                  />
                </motion.svg>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default InteractiveGarden;
