import { motion } from 'framer-motion';
import { containerVariants } from '../../animations/variants';
import './InvitationContainer.css';

const InvitationContainer = ({ children }) => {
  return (
    <motion.main
      className="invitation-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="invitation-content">
        {children}
      </div>
    </motion.main>
  );
};

export default InvitationContainer;
