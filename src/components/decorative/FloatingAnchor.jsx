import { Anchor } from 'lucide-react';
import './FloatingAnchor.css';

const FloatingAnchor = () => {
  return (
    <div className="floating-anchor" aria-hidden="true">
      <Anchor size={60} strokeWidth={1} />
    </div>
  );
};

export default FloatingAnchor;
