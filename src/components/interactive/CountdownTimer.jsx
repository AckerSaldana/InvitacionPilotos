import { motion } from 'framer-motion';
import { itemVariants } from '../../animations/variants';
import { useCountdown } from '../../hooks/useCountdown';
import { EVENT_DATA } from '../../utils/eventData';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    EVENT_DATA.dateTime.start
  );

  const labels = EVENT_DATA.ui.labels.countdown;

  if (isExpired) {
    return (
      <motion.div className="countdown-expired" variants={itemVariants}>
        <p>{EVENT_DATA.ui.messages.eventStarted}</p>
      </motion.div>
    );
  }

  const timeUnits = [
    { value: days, label: labels.days },
    { value: hours, label: labels.hours },
    { value: minutes, label: labels.minutes },
    { value: seconds, label: labels.seconds }
  ];

  return (
    <motion.section
      className="countdown-section"
      variants={itemVariants}
      aria-label="Cuenta regresiva para el evento"
    >
      <p className="countdown-label">{EVENT_DATA.ui.labels.sections.countdown}</p>
      <div className="countdown-timer" role="timer" aria-live="polite">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="countdown-unit">
            <span className="countdown-value">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="countdown-unit-label">{unit.label}</span>
            {index < timeUnits.length - 1 && (
              <span className="countdown-separator" aria-hidden="true">:</span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default CountdownTimer;
