import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { itemVariants, buttonHoverVariants } from '../../animations/variants';
import { EVENT_DATA } from '../../utils/eventData';
import './LocationSection.css';

const LocationSection = () => {
  const { location, ui } = EVENT_DATA;

  return (
    <motion.section className="location-section" variants={itemVariants}>
      <h3 className="section-title">{ui.labels.sections.location}</h3>

      <div className="location-card">
        <div className="location-icon-wrapper">
          <MapPin size={32} strokeWidth={1.5} />
        </div>

        <div className="location-info">
          <h4 className="location-venue">{location.venue}</h4>
          <address className="location-address">
            <p>{location.address}</p>
            <p>{location.neighborhood}</p>
            <p>{location.city}</p>
          </address>
        </div>

        <motion.a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="location-map-button"
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Abrir ubicacion en Google Maps"
        >
          <Navigation size={18} />
          <span>{ui.buttons.map}</span>
        </motion.a>
      </div>
    </motion.section>
  );
};

export default LocationSection;
