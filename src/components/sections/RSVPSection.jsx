import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Edit3, X, Check } from 'lucide-react';
import { itemVariants, buttonHoverVariants } from '../../animations/variants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { EVENT_DATA } from '../../utils/eventData';
import './RSVPSection.css';

const initialRsvpState = {
  submitted: false,
  attending: null,
  name: '',
  guests: 0,
  submittedAt: null
};

const RSVPSection = () => {
  const [rsvpData, setRsvpData] = useLocalStorage('posada2025-rsvp', initialRsvpState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: rsvpData.name || '',
    attending: rsvpData.attending,
    guests: rsvpData.guests || 0
  });

  const { ui } = EVENT_DATA;

  const handleSubmit = (e) => {
    e.preventDefault();
    setRsvpData({
      ...formData,
      submitted: true,
      submittedAt: new Date().toISOString()
    });
    setIsModalOpen(false);
  };

  const openModal = () => {
    setFormData({
      name: rsvpData.name || '',
      attending: rsvpData.attending,
      guests: rsvpData.guests || 0
    });
    setIsModalOpen(true);
  };

  return (
    <motion.section className="rsvp-section" variants={itemVariants}>
      <h3 className="section-title">{ui.labels.sections.rsvp}</h3>

      {rsvpData.submitted ? (
        <div className="rsvp-confirmed">
          <div className="rsvp-confirmed-icon">
            <UserCheck size={32} />
          </div>
          <p className="rsvp-confirmed-message">
            {rsvpData.attending
              ? ui.messages.rsvpSuccess
              : ui.messages.rsvpDeclined}
          </p>
          <p className="rsvp-confirmed-name">{rsvpData.name}</p>
          {rsvpData.attending && rsvpData.guests > 0 && (
            <p className="rsvp-confirmed-guests">
              +{rsvpData.guests} acompanante{rsvpData.guests > 1 ? 's' : ''}
            </p>
          )}
          <motion.button
            className="rsvp-modify-button"
            onClick={openModal}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Edit3 size={16} />
            <span>{ui.buttons.rsvpModify}</span>
          </motion.button>
        </div>
      ) : (
        <motion.button
          className="rsvp-button"
          onClick={openModal}
          variants={buttonHoverVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <UserCheck size={20} />
          <span>{ui.buttons.rsvp}</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="rsvp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="rsvp-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rsvp-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>

              <h4 className="rsvp-modal-title">{ui.labels.sections.rsvp}</h4>

              <form onSubmit={handleSubmit} className="rsvp-form">
                <div className="rsvp-form-group">
                  <label htmlFor="rsvp-name">{ui.labels.rsvpForm.name}</label>
                  <input
                    type="text"
                    id="rsvp-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="rsvp-form-group">
                  <label>{ui.labels.rsvpForm.attending}</label>
                  <div className="rsvp-radio-group">
                    <label className="rsvp-radio-option">
                      <input
                        type="radio"
                        name="attending"
                        checked={formData.attending === true}
                        onChange={() =>
                          setFormData({ ...formData, attending: true })
                        }
                        required
                      />
                      <span className="rsvp-radio-label">
                        <Check size={16} />
                        {ui.labels.rsvpForm.yes}
                      </span>
                    </label>
                    <label className="rsvp-radio-option">
                      <input
                        type="radio"
                        name="attending"
                        checked={formData.attending === false}
                        onChange={() =>
                          setFormData({ ...formData, attending: false, guests: 0 })
                        }
                      />
                      <span className="rsvp-radio-label">
                        <X size={16} />
                        {ui.labels.rsvpForm.no}
                      </span>
                    </label>
                  </div>
                </div>

                {formData.attending && (
                  <motion.div
                    className="rsvp-form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label htmlFor="rsvp-guests">{ui.labels.rsvpForm.guests}</label>
                    <input
                      type="number"
                      id="rsvp-guests"
                      min="0"
                      max="10"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guests: parseInt(e.target.value) || 0
                        })
                      }
                    />
                  </motion.div>
                )}

                <div className="rsvp-form-actions">
                  <button
                    type="button"
                    className="rsvp-cancel-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {ui.labels.rsvpForm.cancel}
                  </button>
                  <button
                    type="submit"
                    className="rsvp-submit-button"
                    disabled={!formData.name || formData.attending === null}
                  >
                    {ui.labels.rsvpForm.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default RSVPSection;
