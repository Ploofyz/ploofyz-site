import React, { useState, useEffect, useRef } from 'react';
import { CinematicSlide } from './CinematicSlide';
import { ProfileSlide } from './ProfileSlide';
import { NavigationArrow } from './NavigationArrow';
import { ThumbnailIndicator } from './ThumbnailIndicator';
import { TEAM_SLIDES } from './constants';
import type { CarouselSlide } from './types';
import './TeamCarousel.css';

export const TeamCarousel: React.FC = () => {
  // State management
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Auto-rotation timer ref
  const autoplayTimerRef = useRef<number | null>(null);

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
   * Handle navigation arrow clicks
   */
  const handlePrevClick = () => {
    scrollPrev();
    resetAutoplay();
  };

  const handleNextClick = () => {
    scrollNext();
    resetAutoplay();
  };

  /**
   * Handle thumbnail clicks
   */
  const handleThumbnailClick = (index: number) => {
    scrollTo(index);
    resetAutoplay();
  };

  /**
   * Get thumbnail image source for a slide
   */
  const getThumbnailSrc = (slide: CarouselSlide): string => {
    if (slide.type === 'cinematic') {
      return slide.imageSrc;
    }
    return slide.member.thumbnailSrc; // Use thumbnailSrc for head-only images
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
    <section 
      className="team-carousel"
      role="region"
      aria-labelledby="team-carousel-title"
      aria-roledescription="carousel"
    >
      {/* Header Section */}
      <div className="team-carousel__header">
        <h2 id="team-carousel-title" className="team-carousel__title">Meet the Team</h2>
        <p className="team-carousel__subtitle">Appreciation to the people who made Ploofyz a reality.</p>
      </div>

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
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slideCount}`}
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
                  roleColor={slide.member.roleColor}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <NavigationArrow
          direction="prev"
          onClick={handlePrevClick}
          disabled={false}
          ariaLabel="Previous slide"
        />
        <NavigationArrow
          direction="next"
          onClick={handleNextClick}
          disabled={false}
          ariaLabel="Next slide"
        />
      </div>

      {/* Thumbnail indicators */}
      <div 
        className="carousel-thumbnails"
        role="tablist"
        aria-label="Slide navigation"
      >
        {TEAM_SLIDES.map((slide, index) => (
          <ThumbnailIndicator
            key={index}
            imageSrc={getThumbnailSrc(slide)}
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
    </section>
  );
};

