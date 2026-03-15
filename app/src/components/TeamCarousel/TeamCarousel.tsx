import React, { useState, useEffect, useRef } from 'react';
import { CinematicSlide } from './CinematicSlide';
import { ProfileSlide } from './ProfileSlide';
import { ThumbnailIndicator } from './ThumbnailIndicator';
import { TEAM_SLIDES } from './constants';
import type { CarouselSlide } from './types';
import './TeamCarousel.css';

export const TeamCarousel: React.FC = () => {
  // State management
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Auto-rotation timer ref
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideCount = TEAM_SLIDES.length;

  /**
   * Navigate to the next slide with wrap-around logic
   */
  const scrollNext = () => {
    setSelectedIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= slideCount ? 0 : nextIndex;
    });
  };

  /**
   * Navigate to the previous slide with wrap-around logic
   */
  const scrollPrev = () => {
    setSelectedIndex((prevIndex) => {
      const prevIndexCalc = prevIndex - 1;
      return prevIndexCalc < 0 ? slideCount - 1 : prevIndexCalc;
    });
  };

  /**
   * Navigate to a specific slide index
   */
  const scrollTo = (index: number) => {
    if (index < 0 || index >= slideCount) return;
    if (index === selectedIndex) return;
    
    setSelectedIndex(index);
  };

  /**
   * Reset the auto-rotation timer
   */
  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    autoplayTimerRef.current = setInterval(() => {
      scrollNext();
    }, 4000);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scrollPrev();
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      scrollNext();
      resetAutoplay();
    }
  };

  // Set up auto-rotation timer
  useEffect(() => {
    resetAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [selectedIndex]);

  // Set up keyboard navigation
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /**
   * Handle thumbnail clicks
   */
  const handleThumbnailClick = (index: number) => {
    scrollTo(index);
    resetAutoplay();
  };

  /**
   * Get initials from a full name (up to 2 characters)
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Get thumbnail alt text for a slide
   */
  const getThumbnailAlt = (slide: CarouselSlide): string => {
    if (slide.type === 'cinematic') {
      return 'Team photo';
    }
    return slide.member.name;
  };

  return (
    <div className="team-carousel">
      {/* Carousel viewport with fade transition */}
      <div className="carousel-viewport">
        <div className="carousel-container">
          {TEAM_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${
                index === selectedIndex ? 'carousel-slide--active' : ''
              }`}
              aria-hidden={index !== selectedIndex}
            >
              {slide.type === 'cinematic' ? (
                <CinematicSlide
                  imageSrc={slide.imageSrc}
                  alt={slide.alt}
                />
              ) : (
                <ProfileSlide
                  name={slide.member.name}
                  role={slide.member.role}
                  description={slide.member.description}
                  avatarSrc={slide.member.avatarSrc}
                  fullBodySrc={slide.member.fullBodySrc}
                  roleColor={slide.member.roleColor}
                  isActive={index === selectedIndex}
                />
              )}
            </div>
          ))}
        </div>


      </div>

      {/* Thumbnail indicators */}
      <div className="carousel-thumbnails">
        {TEAM_SLIDES.map((slide, index) => (
          <ThumbnailIndicator
            key={index}
            avatarSrc={slide.type === 'cinematic' ? '/images/team/ploofyz.png' : slide.member.avatarSrc}
            initials={slide.type === 'cinematic' ? '' : getInitials(slide.member.name)}
            roleColor={slide.type === 'cinematic' ? '#888888' : slide.member.roleColor}
            alt={getThumbnailAlt(slide)}
            isActive={index === selectedIndex}
            onClick={() => handleThumbnailClick(index)}
            index={index}
          />
        ))}
      </div>

      {/* ARIA live region for screen reader announcements */}
      <div
        className="carousel-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedIndex === 0
          ? 'Showing team photo'
          : `Showing ${TEAM_SLIDES[selectedIndex].type === 'profile' 
              ? TEAM_SLIDES[selectedIndex].member.name 
              : 'slide'}, slide ${selectedIndex + 1} of ${slideCount}`}
      </div>
    </div>
  );
};

