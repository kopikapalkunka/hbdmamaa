import { useState, useRef, useMemo, useCallback, memo } from 'react';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import './MessagesSection.css';

// MessageCard component moved outside and memoized to prevent recreation on every render
const MessageCard = memo(({ message, index, playingId, onPlayAudio }) => {
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
          onClick={() => onPlayAudio(message)}
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
});

const MessagesSection = () => {
  const [playingId, setPlayingId] = useState(null);
  const [sounds, setSounds] = useState({});

  // Family messages - Audio files should be placed in /public/voices/ directory
  // Memoize messages array to prevent recreation
  const messages = useMemo(() => [
    {
      id: 1,
      name: "Ayah",
      message: "Barakallahu Fii Umrik, Istriku. Ayah bersyukur punya istri yang selalu perhatian, ceria, dan penuh energi. Semoga Allah selalu menjaga kesehatan Mama, melapangkan rezeki, dan selalu menemani ayah seumur hidup.",
      audioUrl: '/voices/ayah.mp3',
    },
    {
      id: 2,
      name: "Ayu",
      message: "Selamat ulang tahun, Mama. Terima kasih sudah jadi Mama paling lucu dan paling peduli. Semoga semua doa Mama dikabulkan, dan semoga kebahagiaan selalu menemani setiap langkah Mama.",
      audioUrl: '/voices/ayu.mp3',
    },
    {
      id: 3,
      name: "Oten",
      message: "Barakallahu Fii Umrik, Mama. Semoga Allah selalu memberi kekuatan, kesehatan, dan dipanjangkan umurnya, bahagia selalu mamahku.",
      audioUrl: '/voices/oten.mp3',
    },
    {
      id: 4,
      name: "Panji",
      message: "Selamat ulang tahun, Mbok. Terima kasih atas perhatian dan nasihat yang selalu Panji ingat. Semoga Allah membalas semua kebaikan Mbok dengan umur panjang dan kebahagiaan yang tidak putus.",
      audioUrl: '/voices/panji.mp3',
    },
    {
      id: 5,
      name: "Nibon",
      message: "Selamat ulang tahun, Mamaa. Semoga Mama selalu diberi kesehatan, semangat yang nggak pernah habis, hati yang selalu tenang, rezeki yang berlimpah, dan semoga Allah mudahkan mama untuk mencapai impian mama, adek sayang mama, i lop yu pull.",
      audioUrl: '/voices/nibon.mp3',
    },
    {
      id: 6,
      name: "Iyan",
      message: "Selamat ulang tahun, Ma. Terima kasih sudah selalu mendukung dan mendoakan kami dalam setiap langkah. Semoga Mama selalu sehat, kuat, dan bahagia.",
      audioUrl: '/voices/iyan.mp3',
    },
    {
      id: 7,
      name: "Ari",
      message: "Selamat ulang tahun ya, Ma. Terima kasih atas perhatian dan kebaikan Mama yang nggak pernah berubah. Semoga Allah membalasnya dengan keberkahan dan kesehatan.",
      audioUrl: '/voices/ari.mp3',
    },
    {
      id: 8,
      name: "Cucu-cucu Yangti",
      message: "Selamat ulang tahun, Yangti! Semoga Yangti selalu sehat, panjang umur, dan tetap lucu seperti biasanya. Kami sayang Yangti!",
      audioUrl: '/voices/cucu.mp3',
    },
  ], []);

  const playAudio = useCallback((message) => {
    // Use base path for public assets
    const basePath = import.meta.env.BASE_URL || '/';
    const audioPath = message.audioUrl ? `${basePath}${message.audioUrl.replace(/^\//, '')}` : null;
    
    if (!audioPath) {
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
        src: [audioPath],
        html5: true,
        onend: () => setPlayingId(null),
        onload: () => {
          console.log('Voice message loaded:', audioPath);
        },
        onloaderror: (id, error) => {
          console.warn('Voice message not found:', audioPath, error);
          alert(message.message); // Fallback to text
          setPlayingId(null);
        },
        onplayerror: (id, error) => {
          console.error('Audio playback failed:', error);
          alert(message.message); // Fallback to text
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
  }, [playingId, sounds]);

  return (
    <section className="messages-section">
      <div className="messages-background"></div>
      
      <div className="messages-container">
        <h2 className="messages-title">Family Messages</h2>
        
        <div className="messages-grid">
          {messages.map((message, index) => (
            <MessageCard 
              key={message.id} 
              message={message} 
              index={index}
              playingId={playingId}
              onPlayAudio={playAudio}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MessagesSection;

