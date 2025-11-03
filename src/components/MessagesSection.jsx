import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import './MessagesSection.css';

const MessagesSection = () => {
  const [playingId, setPlayingId] = useState(null);
  const [sounds, setSounds] = useState({});

  // Sample messages - replace with actual audio clips
  const messages = [
    {
      id: 1,
      name: "Family Member 1",
      message: "Happy Birthday! Your love blooms like the most beautiful garden.",
      audioUrl: null, // Add audio file path here
    },
    {
      id: 2,
      name: "Family Member 2",
      message: "Thank you for planting seeds of love in our hearts every day.",
      audioUrl: null,
    },
    {
      id: 3,
      name: "Family Member 3",
      message: "Your kindness grows like flowers in spring - always blooming.",
      audioUrl: null,
    },
  ];

  const playAudio = (message) => {
    if (!message.audioUrl) {
      // If no audio URL, just show visual feedback
      alert(message.message);
      return;
    }

    // Stop current playing sound
    if (playingId !== null && sounds[playingId]) {
      sounds[playingId].stop();
    }

    // Play new sound
    if (!sounds[message.id]) {
      const sound = new Howl({
        src: [message.audioUrl],
        html5: true,
        onend: () => setPlayingId(null),
        onplayerror: () => {
          console.error('Audio playback failed');
          setPlayingId(null);
        }
      });
      setSounds(prev => ({ ...prev, [message.id]: sound }));
      sound.play();
      setPlayingId(message.id);
    } else {
      if (playingId === message.id) {
        sounds[message.id].stop();
        setPlayingId(null);
      } else {
        sounds[message.id].play();
        setPlayingId(message.id);
      }
    }
  };

  return (
    <section className="messages-section">
      <div className="messages-background"></div>
      
      <div className="messages-container">
        <h2 className="messages-title">Family Messages</h2>
        
        <div className="messages-grid">
          {messages.map((message, index) => {
            const MessageCard = ({ message, index }) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true, amount: 0.3 });

              return (
                <motion.div
                  ref={ref}
                  className="message-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <div className="message-bubble">
                    <div className="message-header">
                      <h3 className="message-name">{message.name}</h3>
                    </div>
                    <p className="message-text">{message.message}</p>
                    <button
                      className="play-btn"
                      onClick={() => playAudio(message)}
                      aria-label="Play message"
                    >
                      {playingId === message.id ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="6" width="4" height="12" rx="1"/>
                          <rect x="14" y="6" width="4" height="12" rx="1"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            };

            return <MessageCard key={message.id} message={message} index={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default MessagesSection;

