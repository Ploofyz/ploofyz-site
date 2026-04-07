import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const scrollNext = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= slideCount ? 0 : nextIndex;
    });
  }, [slideCount]);

  /**
   * Navigate to the previous slide with wrap-around logic
   */
  const scrollPrev = useCallback(() => {
    setSelectedIndex((prevIndex) => {
      const prevIndexCalc = prevIndex - 1;
      return prevIndexCalc < 0 ? slideCount - 1 : prevIndexCalc;
    });
  }, [slideCount]);

  /**
   * Navigate to a specific slide index
   */
  const scrollTo = (index: number) => {
    if (index < 0 || index >= slideCount) return;
    setSelectedIndex(index);
  };

  /**
   * Reset the auto-rotation timer
   */
  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    autoplayTimerRef.current = setInterval(() => {
      scrollNext();
    }, 4000);
  }, [scrollNext]);

  // Set up auto-rotation timer (only on mount, not on every slide change)
  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [resetAutoplay]);

  // Set up keyboard navigation with stable references
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollPrev();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        scrollNext();
        resetAutoplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollNext, scrollPrev, resetAutoplay]);

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
          : (() => {
              const slide = TEAM_SLIDES[selectedIndex];
              const name = slide.type === 'profile' ? slide.member.name : 'slide';
              return `Showing ${name}, slide ${selectedIndex + 1} of ${slideCount}`;
            })()}
      </div>
    </div>
  );
};

