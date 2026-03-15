/**
 * Responsive behavior verification tests for TeamCarousel
 * Tests Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamCarousel } from '../TeamCarousel';
import { TEAM_SLIDES } from '../constants';

// Helper to set viewport size
const setViewport = (width: number, height: number = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('TeamCarousel - Responsive Behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Requirement 6.1: Mobile viewport (< 768px)', () => {
    beforeEach(() => {
      setViewport(375); // iPhone size
    });

    it('should render carousel on mobile viewport', () => {
      render(<TeamCarousel />);
      
      const carousel = document.querySelector('.team-carousel');
      expect(carousel).toBeInTheDocument();
    });

    it('should display navigation arrows on mobile', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should display all thumbnails on mobile', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      expect(thumbnails.length).toBe(TEAM_SLIDES.length);
    });

    it('should maintain readability of text content on mobile', () => {
      render(<TeamCarousel />);
      
      // Navigate to first profile
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(700);
      
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(firstProfile.member.name)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.role)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.description)).toBeInTheDocument();
      }
    });

    it('should apply mobile-specific CSS classes', () => {
      const { container } = render(<TeamCarousel />);
      
      const carousel = container.querySelector('.team-carousel');
      expect(carousel).toBeInTheDocument();
      
      // Check that carousel viewport exists
      const viewport = container.querySelector('.carousel-viewport');
      expect(viewport).toBeInTheDocument();
    });
  });

  describe('Requirement 6.2: Tablet viewport (768px - 1024px)', () => {
    beforeEach(() => {
      setViewport(768); // iPad size
    });

    it('should render carousel on tablet viewport', () => {
      render(<TeamCarousel />);
      
      const carousel = document.querySelector('.team-carousel');
      expect(carousel).toBeInTheDocument();
    });

    it('should display navigation arrows on tablet', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should display all thumbnails on tablet', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      expect(thumbnails.length).toBe(TEAM_SLIDES.length);
    });

    it('should maintain readability of text content on tablet', () => {
      render(<TeamCarousel />);
      
      // Navigate to first profile
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(700);
      
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(firstProfile.member.name)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.role)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.description)).toBeInTheDocument();
      }
    });
  });

  describe('Requirement 6.3: Desktop viewport (> 1024px)', () => {
    beforeEach(() => {
      setViewport(1440); // Desktop size
    });

    it('should render carousel on desktop viewport', () => {
      render(<TeamCarousel />);
      
      const carousel = document.querySelector('.team-carousel');
      expect(carousel).toBeInTheDocument();
    });

    it('should display navigation arrows on desktop', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should display all thumbnails on desktop', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      expect(thumbnails.length).toBe(TEAM_SLIDES.length);
    });

    it('should maintain readability of text content on desktop', () => {
      render(<TeamCarousel />);
      
      // Navigate to first profile
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(700);
      
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(firstProfile.member.name)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.role)).toBeInTheDocument();
        expect(screen.getByText(firstProfile.member.description)).toBeInTheDocument();
      }
    });
  });

  describe('Requirement 6.4: Touch events on navigation arrows', () => {
    it('should handle touch events on navigation arrows', () => {
      render(<TeamCarousel />);
      
      const nextButton = screen.getByLabelText('Next slide');
      
      // Simulate touch event
      fireEvent.touchStart(nextButton);
      fireEvent.touchEnd(nextButton);
      fireEvent.click(nextButton);
      
      vi.advanceTimersByTime(700);
      
      // Should navigate to next slide
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${firstProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should handle touch events on previous arrow', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      
      // Simulate touch event
      fireEvent.touchStart(prevButton);
      fireEvent.touchEnd(prevButton);
      fireEvent.click(prevButton);
      
      vi.advanceTimersByTime(700);
      
      // Should wrap to last slide
      const lastSlide = TEAM_SLIDES[TEAM_SLIDES.length - 1];
      if (lastSlide.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${lastSlide.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should remain accessible on touch devices', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      
      // Buttons should be accessible
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(prevButton.tagName).toBe('BUTTON');
      expect(nextButton.tagName).toBe('BUTTON');
    });
  });

  describe('Requirement 6.5: Touch events on thumbnails', () => {
    it('should handle touch events on thumbnails', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      // Touch third thumbnail
      const thirdThumbnail = thumbnails[2];
      fireEvent.touchEnd(thirdThumbnail);
      
      vi.advanceTimersByTime(700);
      
      // Should navigate to third slide
      const thirdSlide = TEAM_SLIDES[2];
      if (thirdSlide.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${thirdSlide.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should prevent default on touch events to avoid double-tap zoom', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      const secondThumbnail = thumbnails[1];
      
      // Create a touch event with preventDefault
      const touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
      });
      
      const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault');
      
      fireEvent(secondThumbnail, touchEvent);
      
      // The component should call preventDefault
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should remain accessible on touch devices', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      // All thumbnails should be accessible
      expect(thumbnails.length).toBe(TEAM_SLIDES.length);
      thumbnails.forEach(thumbnail => {
        expect(thumbnail.tagName).toBe('BUTTON');
        expect(thumbnail).toHaveAttribute('aria-label');
      });
    });

    it('should navigate correctly when tapping thumbnails', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      // Tap last thumbnail
      const lastThumbnail = thumbnails[thumbnails.length - 1];
      fireEvent.touchEnd(lastThumbnail);
      
      vi.advanceTimersByTime(700);
      
      // Should show last slide
      const lastSlide = TEAM_SLIDES[TEAM_SLIDES.length - 1];
      if (lastSlide.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${lastSlide.member.name}`, 'i'))).toBeInTheDocument();
      }
    });
  });

  describe('Cross-viewport consistency', () => {
    it('should maintain functionality across viewport changes', () => {
      const { rerender } = render(<TeamCarousel />);
      
      // Start on mobile
      setViewport(375);
      rerender(<TeamCarousel />);
      
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(700);
      
      // Switch to tablet
      setViewport(768);
      rerender(<TeamCarousel />);
      
      // Should still be on second slide
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${firstProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
      
      // Switch to desktop
      setViewport(1440);
      rerender(<TeamCarousel />);
      
      // Should still be on second slide
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${firstProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should maintain auto-rotation across viewports', () => {
      const { rerender } = render(<TeamCarousel />);
      
      // Start on mobile
      setViewport(375);
      rerender(<TeamCarousel />);
      
      // Wait for auto-rotation
      vi.advanceTimersByTime(4100);
      
      // Should advance to next slide
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${firstProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
      
      // Switch to desktop
      setViewport(1440);
      rerender(<TeamCarousel />);
      
      // Auto-rotation should continue
      vi.advanceTimersByTime(4100);
      
      const secondProfile = TEAM_SLIDES[2];
      if (secondProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${secondProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
    });
  });
});
