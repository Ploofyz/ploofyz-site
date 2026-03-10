import { useState } from 'react';
import './ThumbnailIndicator.css';

export interface ThumbnailIndicatorProps {
  imageSrc: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export function ThumbnailIndicator({
  imageSrc,
  alt,
  isActive,
  onClick,
  index
}: ThumbnailIndicatorProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from alt text for fallback
  const getInitials = (text: string): string => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <button
      className={`thumbnail-indicator ${isActive ? 'thumbnail-indicator--active' : ''}`}
      onClick={onClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={`${alt} - Slide ${index + 1}`}
      aria-current={isActive ? 'true' : 'false'}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {imageError ? (
        <div className="thumbnail-indicator__fallback">
          {getInitials(alt)}
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className="thumbnail-indicator__image"
          onError={handleImageError}
        />
      )}
    </button>
  );
}
