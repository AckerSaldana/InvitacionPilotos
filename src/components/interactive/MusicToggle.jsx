import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import './MusicToggle.css';

const MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/12/13/audio_4271eaa26d.mp3';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <motion.button
      className={`music-toggle ${isPlaying ? 'playing' : ''}`}
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Pausar musica' : 'Reproducir musica'}
      aria-pressed={isPlaying}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      disabled={!isLoaded}
    >
      {isPlaying ? (
        <Volume2 size={20} />
      ) : (
        <VolumeX size={20} />
      )}
      {isPlaying && (
        <span className="music-waves" aria-hidden="true">
          <span className="wave-bar"></span>
          <span className="wave-bar"></span>
          <span className="wave-bar"></span>
        </span>
      )}
    </motion.button>
  );
};

export default MusicToggle;
