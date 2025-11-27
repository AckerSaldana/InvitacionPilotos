import { Compass } from 'lucide-react';
import './GoldDivider.css';

const GoldDivider = ({ icon = true }) => {
  return (
    <div className="gold-divider" aria-hidden="true">
      <span className="gold-divider-line" />
      {icon && (
        <span className="gold-divider-icon">
          <Compass size={20} strokeWidth={1.5} />
        </span>
      )}
      <span className="gold-divider-line" />
    </div>
  );
};

export default GoldDivider;
