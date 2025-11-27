import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Anchor, MapPin, Calendar, Clock, Share2, Star, Download, Copy, Check, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadICSFile } from './utils/calendarUtils';
import { EVENT_DATA } from './utils/eventData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Minimal particle for performance
const ParticleField = () => {
  const particles = useRef([...Array(12)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
  })));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((p, i) => (
        <div
          key={i}
          className="particle absolute rounded-full bg-yellow-400/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  const countdownRef = useRef(null);

  useEffect(() => {
    const targetDate = new Date('2025-12-13T19:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          min: Math.floor((difference / 1000 / 60) % 60),
          seg: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={countdownRef} className="flex justify-center gap-4 md:gap-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="countdown-item flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-2xl" />
            <div className="relative w-16 h-20 md:w-20 md:h-24 bg-slate-900/80 backdrop-blur-md border border-yellow-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <span className="font-cinzel text-3xl md:text-4xl font-bold text-yellow-400">
                {String(value).padStart(2, '0')}
              </span>
            </div>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-3 text-slate-500 font-body">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const MusicToggle = ({ audioRef, isPlaying, setIsPlaying }) => {
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
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900/90 backdrop-blur-md border border-yellow-500/30 rounded-full text-yellow-400 hover:text-yellow-300 hover:border-yellow-400/50 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
      aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
    >
      {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
    </button>
  );
};

const WelcomeOverlay = ({ onEnter, onTransitionComplete, isExiting = false }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const lineLeftRef = useRef(null);
  const lineRightRef = useRef(null);

  useLayoutEffect(() => {
    // If exiting, run exit animation
    if (isExiting) {
      const tl = gsap.timeline({
        onComplete: onTransitionComplete,
      });

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });

      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 40,
      });
      gsap.set([lineLeftRef.current, lineRightRef.current], {
        scaleX: 0,
        opacity: 0,
      });

      // Animation sequence
      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 1, delay: 0.3 })
        .to([lineLeftRef.current, lineRightRef.current], { scaleX: 1, opacity: 1, duration: 0.8 }, '-=0.5')
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.6')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

      // Floating particles animation
      gsap.to('.welcome-particle', {
        y: 'random(-30, 30)',
        x: 'random(-20, 20)',
        duration: 'random(4, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { amount: 2, from: 'random' },
      });

    }, overlayRef);

    return () => ctx.revert();
  }, [isExiting, onTransitionComplete]);

  const handleClick = () => {
    const tl = gsap.timeline({
      onComplete: onEnter,
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.in',
    });
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] bg-slate-950 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-body { font-family: 'Inter', sans-serif; }
        .text-gold-gradient {
          background: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="welcome-particle absolute rounded-full bg-yellow-500/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">

        {/* Logo */}
        <div ref={logoRef} className="mb-8 md:mb-10">
          <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
            <div className="absolute w-40 h-40 md:w-52 md:h-52 bg-yellow-500/15 blur-[60px] rounded-full" />
            <img
              src="/images/logoPilotos.png"
              alt="Logo SNPP"
              className="relative w-full h-full object-contain mix-blend-lighten"
            />
          </div>
        </div>

        {/* Decorative lines */}
        <div className="flex items-center gap-6 mb-8 md:mb-10">
          <div ref={lineLeftRef} className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-yellow-500/50 origin-right" />
          <Star size={10} className="text-yellow-500/40" fill="currentColor" />
          <div ref={lineRightRef} className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-yellow-500/50 origin-left" />
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="font-script text-6xl md:text-8xl lg:text-9xl text-gold-gradient mb-6 leading-[1.1] pt-4">
          Posada 2025
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="font-cinzel text-[10px] md:text-xs tracking-[0.3em] text-yellow-400/50 uppercase mb-12 md:mb-16">
          Sindicato Nacional de Pilotos de Puerto
        </p>

        {/* CTA Button */}
        <div ref={buttonRef}>
          <button
            onClick={handleClick}
            className="group relative px-10 md:px-14 py-4 md:py-5 overflow-hidden rounded-full transition-all duration-500"
          >
            {/* Button background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 transition-all duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-yellow-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <span className="relative font-cinzel font-semibold text-slate-900 tracking-widest flex items-center gap-3 text-sm md:text-base">
              <Volume2 size={18} />
              Abrir Invitación
            </span>
          </button>

          <p className="font-body text-slate-600 text-[10px] md:text-xs mt-6 tracking-widest uppercase text-center">
            Toca para entrar
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isCopied, setIsCopied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio('/audio/christmas-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // GSAP animations for main content
  useLayoutEffect(() => {
    if (showWelcome && !isTransitioning) return;
    if (hasAnimated.current) return;

    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      // Main container entrance animation
      gsap.fromTo(mainRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
        }
      );

      // Hero entrance animation
      const heroElements = heroRef.current?.querySelectorAll('.hero-animate');
      if (heroElements) {
        gsap.fromTo(heroElements,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.4,
          }
        );
      }

      // Scroll-triggered animations
      gsap.utils.toArray('.scroll-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Floating particles
      gsap.to('.particle', {
        y: 'random(-20, 20)',
        duration: 'random(3, 6)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { amount: 1.5, from: 'random' },
      });

    }, mainRef);

    return () => ctx.revert();
  }, [showWelcome, isTransitioning]);

  const handleEnter = async () => {
    setIsTransitioning(true);
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleTransitionComplete = () => {
    setShowWelcome(false);
    setIsTransitioning(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`¡Te invito a la Posada 2025 del Sindicato Nacional de Pilotos de Puerto! 13 de Diciembre a las 19:00 hrs. ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (showWelcome && !isTransitioning) {
    return <WelcomeOverlay onEnter={handleEnter} />;
  }

  return (
    <>
      {/* Welcome Overlay - shown during transition */}
      {showWelcome && isTransitioning && (
        <WelcomeOverlay onEnter={handleEnter} onTransitionComplete={handleTransitionComplete} isExiting={true} />
      )}

      {/* Main Content */}
      <div ref={mainRef} className={`min-h-screen bg-slate-950 text-slate-100 selection:bg-yellow-500/30 relative overflow-x-hidden ${isTransitioning ? 'main-entering' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-body { font-family: 'Inter', sans-serif; }
        .text-gold-gradient {
          background: linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}} />

      {/* Background layers */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950/50 z-[-2]" />
      <div className="fixed inset-0 opacity-[0.015] z-[-1]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(234,179,8,0.8) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <ParticleField />
      <MusicToggle audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

      {/* Hero Section */}
      <header ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Logo */}
        <div className="hero-animate mb-8 md:mb-10">
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center">
            <div className="absolute w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 bg-yellow-500/10 blur-[80px] rounded-full" />
            <img
              src="/images/logoPilotos.png"
              alt="Logo SNPP"
              className="relative w-full h-full object-contain mix-blend-lighten"
            />
          </div>
        </div>

        {/* Organization Name */}
        <div className="hero-animate">
          <h2 className="font-cinzel text-sm md:text-base lg:text-lg tracking-[0.25em] text-yellow-400/80 uppercase">
            Sindicato Nacional de Pilotos de Puerto
          </h2>
          <p className="font-body text-xs md:text-sm tracking-[0.2em] text-slate-500 mt-2">
            Delegación Tampico
          </p>
        </div>

        {/* Decorative divider */}
        <div className="hero-animate flex items-center gap-6 my-10 md:my-12">
          <div className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-yellow-500/40" />
          <Anchor size={18} className="text-yellow-500/40" />
          <div className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-yellow-500/40" />
        </div>

        {/* Invitation Text */}
        <p className="hero-animate font-body text-xs md:text-sm tracking-[0.4em] text-slate-500 uppercase mb-6">
          Le invita cordialmente a su
        </p>

        {/* Main Title */}
        <h1 className="hero-animate font-script text-7xl md:text-8xl lg:text-[10rem] text-gold-gradient leading-[0.9] mb-8 pt-4">
          Posada 2025
        </h1>

        {/* Decorative Stars */}
        <div className="hero-animate flex items-center gap-3 text-yellow-500/30 mb-16">
          <Star size={12} fill="currentColor" />
          <Star size={16} fill="currentColor" />
          <Star size={12} fill="currentColor" />
        </div>

        {/* Countdown */}
        <div className="hero-animate">
          <Countdown />
        </div>

        {/* Scroll indicator */}
        <div className="hero-animate absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown size={24} className="text-yellow-500/30 animate-bounce" />
        </div>
      </header>

      {/* Event Details Section */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Date & Time */}
          <div className="scroll-reveal text-center mb-16">
            <div className="inline-flex flex-col items-center">
              <span className="font-body text-[10px] tracking-[0.3em] text-yellow-500/60 uppercase mb-4">Fecha del Evento</span>
              <div className="flex items-center gap-4 mb-3">
                <Calendar size={24} className="text-yellow-500/70" />
                <span className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-white font-light">
                  13 de Diciembre
                </span>
              </div>
              <span className="font-cinzel text-xl md:text-2xl text-yellow-400/80">2025</span>
            </div>
          </div>

          {/* Time */}
          <div className="scroll-reveal flex justify-center items-center gap-3 mb-16">
            <Clock size={18} className="text-yellow-500/50" />
            <span className="font-body text-lg md:text-xl text-slate-400 tracking-wider">19:00 hrs</span>
          </div>

          {/* Divider */}
          <div className="scroll-reveal flex items-center justify-center gap-6 mb-16">
            <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-yellow-500/30" />
            <Anchor size={20} className="text-yellow-500/30" />
            <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-yellow-500/30" />
          </div>

          {/* Location */}
          <div className="scroll-reveal text-center mb-10">
            <span className="font-body text-[10px] tracking-[0.3em] text-yellow-500/60 uppercase mb-4 block">Lugar</span>
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin size={24} className="text-yellow-500/70" />
              <span className="font-cinzel text-2xl md:text-3xl text-white">Salón de Eventos Charmed</span>
            </div>
            <p className="font-body text-sm md:text-base text-slate-500 leading-relaxed max-w-md mx-auto">
              Calle Av. Yucatán #100, Col. Unidad Nacional<br/>
              Cd. Madero, Tamaulipas
            </p>
          </div>

          {/* Map Button */}
          <div className="scroll-reveal flex justify-center">
            <a
              href={EVENT_DATA.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900/50 hover:bg-slate-800/50 border border-yellow-500/20 hover:border-yellow-500/40 rounded-full transition-all duration-300"
            >
              <MapPin size={18} className="text-yellow-500/70 group-hover:text-yellow-400 transition-colors" />
              <span className="font-body text-sm tracking-wider text-slate-300 group-hover:text-white transition-colors">Ver en Mapa</span>
            </a>
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="relative py-20 md:py-28 px-6 bg-slate-900/30">
        <div className="max-w-lg mx-auto space-y-6">

          <h3 className="scroll-reveal font-cinzel text-center text-sm tracking-[0.2em] text-yellow-500/60 uppercase mb-10">
            Agregar a Calendario
          </h3>

          {/* Calendar Buttons */}
          <div className="scroll-reveal flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.open(generateGoogleCalendarUrl(), '_blank')}
              className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 hover:border-yellow-500/20 rounded-2xl transition-all duration-300"
            >
              <Calendar size={18} className="text-yellow-500/60 group-hover:text-yellow-400 transition-colors" />
              <span className="font-body text-sm text-slate-400 group-hover:text-white transition-colors">Google Calendar</span>
            </button>
            <button
              onClick={downloadICSFile}
              className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 hover:border-yellow-500/20 rounded-2xl transition-all duration-300"
            >
              <Download size={18} className="text-yellow-500/60 group-hover:text-yellow-400 transition-colors" />
              <span className="font-body text-sm text-slate-400 group-hover:text-white transition-colors">Apple / Outlook</span>
            </button>
          </div>

          <h3 className="scroll-reveal font-cinzel text-center text-sm tracking-[0.2em] text-yellow-500/60 uppercase mt-12 mb-6">
            Compartir
          </h3>

          {/* Share Buttons */}
          <div className="scroll-reveal flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleWhatsApp}
              className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-green-600/80 hover:bg-green-500/80 rounded-2xl transition-all duration-300"
            >
              <Share2 size={18} />
              <span className="font-body text-sm font-medium">WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 group flex items-center justify-center gap-3 px-6 py-4 bg-slate-900/60 hover:bg-slate-800/60 border border-white/5 hover:border-yellow-500/20 rounded-2xl transition-all duration-300"
            >
              {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-yellow-500/60 group-hover:text-yellow-400 transition-colors" />}
              <span className="font-body text-sm text-slate-400 group-hover:text-white transition-colors">
                {isCopied ? '¡Copiado!' : 'Copiar Enlace'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="h-px w-12 bg-yellow-500/20" />
          <Anchor size={14} className="text-yellow-500/30" />
          <div className="h-px w-12 bg-yellow-500/20" />
        </div>
        <p className="font-script text-2xl md:text-3xl text-yellow-500/40 mb-2">
          Los esperamos
        </p>
        <p className="font-body text-slate-600 text-xs tracking-widest uppercase">
          Sindicato Nacional de Pilotos de Puerto
        </p>
      </footer>
    </div>
    </>
  );
}
