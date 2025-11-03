import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import './IntroSection.css';

const IntroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // SVG path drawing animation
  const drawPath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0 },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <section ref={ref} className="intro-section">
      <div className="watercolor-overlay"></div>
      
      <motion.div
        className="intro-content"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.p
          className="intro-text"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Your life is a garden,<br />
          and love is what you've always grown.
        </motion.p>

        {/* Animated flower SVG */}
        <motion.div
          className="flower-illustration"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        >
          <svg width="200" height="200" viewBox="0 0 200 200" className="flower-svg">
            {/* Stem */}
            <motion.path
              d="M100 180 Q95 140, 100 100 Q105 60, 100 20"
              stroke="#9CAF88"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={drawPath}
            />
            
            {/* Leaves */}
            <motion.path
              d="M100 120 Q80 110, 75 130"
              stroke="#9CAF88"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={drawPath}
            />
            <motion.path
              d="M100 120 Q120 110, 125 130"
              stroke="#9CAF88"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={drawPath}
            />
            
            {/* Flower petals */}
            <motion.circle
              cx="100"
              cy="20"
              r="25"
              fill="none"
              stroke="#B76E79"
              strokeWidth="2"
              strokeDasharray="3,2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 1.5, duration: 1.5 }}
            />
            <motion.circle
              cx="100"
              cy="20"
              r="18"
              fill="none"
              stroke="#800000"
              strokeWidth="2"
              strokeDasharray="2,2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 1.8, duration: 1.5 }}
            />
            <motion.circle
              cx="100"
              cy="20"
              r="12"
              fill="#D4AF37"
              stroke="#800000"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default IntroSection;

