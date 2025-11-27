import { motion } from 'framer-motion';
import { itemVariants } from '../../animations/variants';
import CalendarButtons from '../interactive/CalendarButtons';
import ShareButtons from '../interactive/ShareButtons';
import { EVENT_DATA } from '../../utils/eventData';
import './ShareSection.css';

const ShareSection = () => {
  const { ui } = EVENT_DATA;

  return (
    <motion.section className="share-section" variants={itemVariants}>
      <div className="share-group">
        <h3 className="section-title">{ui.labels.sections.calendar}</h3>
        <CalendarButtons />
      </div>

      <div className="share-group">
        <h3 className="section-title">{ui.labels.sections.share}</h3>
        <ShareButtons />
      </div>
    </motion.section>
  );
};

export default ShareSection;
