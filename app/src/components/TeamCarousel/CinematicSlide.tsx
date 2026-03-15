import React, { useState } from 'react';
import './CinematicSlide.css';

export interface CinematicSlideProps {
  imageSrc: string;
  alt: string;
}

export const CinematicSlide: React.FC<CinematicSlideProps> = ({ imageSrc, alt }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="cinematic-slide">
      {imageError ? (
        <div className="cinematic-slide__fallback">
          <div className="cinematic-slide__gradient" />
          <div className="cinematic-slide__fallback-text">
            <h2>Meet the Ploofyz Team</h2>
          </div>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className="cinematic-slide__image"
          onError={handleImageError}
        />
      )}
    </div>
  );
};
