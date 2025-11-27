import { motion } from 'framer-motion';
import { itemVariants } from '../../animations/variants';
import { EVENT_DATA } from '../../utils/eventData';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <header className="hero-section">
      <motion.div className="hero-logo" variants={itemVariants}>
        <img
          src="/images/pilotos.jpg"
          alt={`Logo de ${EVENT_DATA.organization.name}`}
          className="hero-logo-image"
        />
      </motion.div>

      <motion.h1 className="hero-organization" variants={itemVariants}>
        {EVENT_DATA.organization.name}
      </motion.h1>

      <motion.p className="hero-delegation" variants={itemVariants}>
        {EVENT_DATA.organization.delegation}
      </motion.p>

      <motion.p className="hero-invitation-text" variants={itemVariants}>
        Le invita cordialmente a su
      </motion.p>

      <motion.h2 className="hero-event-title shimmer-text" variants={itemVariants}>
        {EVENT_DATA.event.title}
      </motion.h2>
    </header>
  );
};

export default HeroSection;
