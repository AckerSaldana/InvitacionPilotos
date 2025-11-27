import { motion } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import { buttonHoverVariants } from '../../animations/variants';
import { generateGoogleCalendarUrl, downloadICSFile } from '../../utils/calendarUtils';
import { EVENT_DATA } from '../../utils/eventData';
import './CalendarButtons.css';

const CalendarButtons = () => {
  const { ui } = EVENT_DATA;

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank');
  };

  return (
    <div className="calendar-buttons" role="group" aria-label="Agregar al calendario">
      <motion.button
        className="calendar-button google"
        onClick={handleGoogleCalendar}
        variants={buttonHoverVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Agregar a Google Calendar"
      >
        <Calendar size={18} />
        <span>{ui.buttons.calendar.google}</span>
      </motion.button>

      <motion.button
        className="calendar-button ics"
        onClick={downloadICSFile}
        variants={buttonHoverVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Descargar archivo ICS"
      >
        <Download size={18} />
        <span>{ui.buttons.calendar.ics}</span>
      </motion.button>
    </div>
  );
};

export default CalendarButtons;
