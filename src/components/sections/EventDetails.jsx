import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { itemVariants } from '../../animations/variants';
import { EVENT_DATA } from '../../utils/eventData';
import './EventDetails.css';

const EventDetails = () => {
  return (
    <motion.section className="event-details" variants={itemVariants}>
      <div className="event-details-grid">
        <div className="event-detail-item">
          <Calendar className="event-detail-icon" size={28} strokeWidth={1.5} />
          <div className="event-detail-content">
            <span className="event-detail-label">Fecha</span>
            <time
              className="event-detail-value"
              dateTime={EVENT_DATA.dateTime.start}
            >
              {EVENT_DATA.dateTime.displayDate}
            </time>
          </div>
        </div>

        <div className="event-detail-item">
          <Clock className="event-detail-icon" size={28} strokeWidth={1.5} />
          <div className="event-detail-content">
            <span className="event-detail-label">Hora</span>
            <span className="event-detail-value">
              {EVENT_DATA.dateTime.displayTime}
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default EventDetails;
