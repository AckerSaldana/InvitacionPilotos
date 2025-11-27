import { motion } from 'framer-motion';
import { MessageCircle, Link2, Share2, Check } from 'lucide-react';
import { buttonHoverVariants } from '../../animations/variants';
import { useShare } from '../../hooks/useShare';
import { EVENT_DATA } from '../../utils/eventData';
import './ShareButtons.css';

const ShareButtons = () => {
  const { shareWhatsApp, copyLink, nativeShare, copied, canNativeShare } = useShare();
  const { ui } = EVENT_DATA;

  return (
    <div className="share-buttons" role="group" aria-label="Compartir invitacion">
      <motion.button
        className="share-button whatsapp"
        onClick={shareWhatsApp}
        variants={buttonHoverVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label="Compartir por WhatsApp"
      >
        <MessageCircle size={18} />
        <span>{ui.buttons.share.whatsapp}</span>
      </motion.button>

      <motion.button
        className="share-button copy"
        onClick={copyLink}
        variants={buttonHoverVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
        <span>{copied ? ui.buttons.share.copied : ui.buttons.share.copy}</span>
      </motion.button>

      {canNativeShare && (
        <motion.button
          className="share-button native"
          onClick={nativeShare}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Compartir"
        >
          <Share2 size={18} />
          <span>{ui.buttons.share.native}</span>
        </motion.button>
      )}
    </div>
  );
};

export default ShareButtons;
