import { ChevronLeft, ChevronRight } from 'lucide-react';
import './NavigationArrow.css';

export interface NavigationArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}

export function NavigationArrow({ 
  direction, 
  onClick, 
  disabled, 
  ariaLabel 
}: NavigationArrowProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      className={`navigation-arrow navigation-arrow--${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type="button"
    >
      <Icon className="navigation-arrow__icon" />
    </button>
  );
}
