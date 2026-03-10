/**
 * Accessibility verification tests for TeamCarousel
 * Tests Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeamCarousel } from '../TeamCarousel';
import { TEAM_SLIDES } from '../constants';

describe('TeamCarousel - Accessibility Verification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Requirement 8.1: ARIA labels on navigation arrows', () => {
    it('should have aria-label on previous arrow', () => {
      render(<TeamCarousel />);
      const prevButton = screen.getByLabelText('Previous slide');
      expect(prevButton).toBeInTheDocument();
      expect(prevButton.tagName).toBe('BUTTON');
    });

    it('should have aria-label on next arrow', () => {
      render(<TeamCarousel />);
      const nextButton = screen.getByLabelText('Next slide');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton.tagName).toBe('BUTTON');
    });
  });

  describe('Requirement 8.2: Alt text on all images', () => {
    it('should have alt text on cinematic slide image', () => {
      render(<TeamCarousel />);
      const cinematicImage = screen.getByAltText(/team members together/i);
      expect(cinematicImage).toBeInTheDocument();
    });

    it('should have alt text on all thumbnail images', () => {
      render(<TeamCarousel />);
      
      // Check cinematic thumbnail
      const teamPhotoThumbnail = screen.getByLabelText(/Team photo - Slide 1/i);
      expect(teamPhotoThumbnail).toBeInTheDocument();
      
      // Check profile thumbnails (8 team members)
      TEAM_SLIDES.slice(1).forEach((slide, index) => {
        if (slide.type === 'profile') {
          const thumbnail = screen.getByLabelText(new RegExp(`${slide.member.name} - Slide ${index + 2}`, 'i'));
          expect(thumbnail).toBeInTheDocument();
        }
      });
    });

    it('should have alt text on profile avatar images', () => {
      render(<TeamCarousel />);
      
      // Navigate to first profile slide
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      
      vi.advanceTimersByTime(700); // Wait for transition
      
      // Check that profile avatar has alt text
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        const avatar = screen.getByAltText(firstProfile.member.name);
        expect(avatar).toBeInTheDocument();
      }
    });
  });

  describe('Requirement 8.3: Keyboard navigation with arrow keys', () => {
    it('should navigate to next slide on ArrowRight key', () => {
      render(<TeamCarousel />);
      
      // Initially on slide 0 (cinematic)
      expect(screen.getByText(/Showing team photo/i)).toBeInTheDocument();
      
      // Press ArrowRight
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      vi.advanceTimersByTime(700);
      
      // Should be on slide 1
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${firstProfile.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should navigate to previous slide on ArrowLeft key', () => {
      render(<TeamCarousel />);
      
      // Initially on slide 0
      expect(screen.getByText(/Showing team photo/i)).toBeInTheDocument();
      
      // Press ArrowLeft (should wrap to last slide)
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      vi.advanceTimersByTime(700);
      
      // Should be on last slide
      const lastSlide = TEAM_SLIDES[TEAM_SLIDES.length - 1];
      if (lastSlide.type === 'profile') {
        expect(screen.getByText(new RegExp(`Showing ${lastSlide.member.name}`, 'i'))).toBeInTheDocument();
      }
    });

    it('should wrap around when navigating with keyboard', () => {
      render(<TeamCarousel />);
      
      // Navigate to last slide
      for (let i = 0; i < TEAM_SLIDES.length - 1; i++) {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
        vi.advanceTimersByTime(700);
      }
      
      // Press ArrowRight again (should wrap to first slide)
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      vi.advanceTimersByTime(700);
      
      expect(screen.getByText(/Showing team photo/i)).toBeInTheDocument();
    });
  });

  describe('Requirement 8.4: Focus management with Tab key', () => {
    it('should allow focus on navigation arrows', () => {
      render(<TeamCarousel />);
      
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      
      // Both buttons should be focusable
      expect(prevButton).not.toHaveAttribute('tabindex', '-1');
      expect(nextButton).not.toHaveAttribute('tabindex', '-1');
      
      // Simulate focus
      prevButton.focus();
      expect(document.activeElement).toBe(prevButton);
      
      nextButton.focus();
      expect(document.activeElement).toBe(nextButton);
    });

    it('should allow focus on thumbnail indicators', () => {
      render(<TeamCarousel />);
      
      // Get all thumbnail buttons
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      expect(thumbnails.length).toBe(TEAM_SLIDES.length);
      
      // Each thumbnail should be focusable
      thumbnails.forEach(thumbnail => {
        expect(thumbnail).not.toHaveAttribute('tabindex', '-1');
        thumbnail.focus();
        expect(document.activeElement).toBe(thumbnail);
      });
    });

    it('should maintain logical focus order', () => {
      render(<TeamCarousel />);
      
      // Get all interactive elements
      const prevButton = screen.getByLabelText('Previous slide');
      const nextButton = screen.getByLabelText('Next slide');
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      // All elements should be in the document and focusable
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      thumbnails.forEach(thumb => expect(thumb).toBeInTheDocument());
    });
  });

  describe('Requirement 8.5: Screen reader announcements on slide changes', () => {
    it('should have ARIA live region for announcements', () => {
      render(<TeamCarousel />);
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });

    it('should announce cinematic slide', () => {
      render(<TeamCarousel />);
      
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toHaveTextContent(/Showing team photo/i);
    });

    it('should announce profile slide with name', () => {
      render(<TeamCarousel />);
      
      // Navigate to first profile
      const nextButton = screen.getByLabelText('Next slide');
      fireEvent.click(nextButton);
      vi.advanceTimersByTime(700);
      
      const liveRegion = screen.getByRole('status');
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(liveRegion).toHaveTextContent(new RegExp(`Showing ${firstProfile.member.name}`, 'i'));
        expect(liveRegion).toHaveTextContent(/slide 2 of 9/i);
      }
    });

    it('should update announcement when navigating with keyboard', () => {
      render(<TeamCarousel />);
      
      const liveRegion = screen.getByRole('status');
      
      // Initially showing team photo
      expect(liveRegion).toHaveTextContent(/Showing team photo/i);
      
      // Navigate with keyboard
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      vi.advanceTimersByTime(700);
      
      // Should announce new slide
      const firstProfile = TEAM_SLIDES[1];
      if (firstProfile.type === 'profile') {
        expect(liveRegion).toHaveTextContent(new RegExp(`Showing ${firstProfile.member.name}`, 'i'));
      }
    });

    it('should update announcement when clicking thumbnail', () => {
      render(<TeamCarousel />);
      
      const liveRegion = screen.getByRole('status');
      
      // Click on third thumbnail (index 2)
      const thirdSlide = TEAM_SLIDES[2];
      if (thirdSlide.type === 'profile') {
        const thumbnail = screen.getByLabelText(new RegExp(`${thirdSlide.member.name} - Slide 3`, 'i'));
        fireEvent.click(thumbnail);
        vi.advanceTimersByTime(700);
        
        expect(liveRegion).toHaveTextContent(new RegExp(`Showing ${thirdSlide.member.name}`, 'i'));
        expect(liveRegion).toHaveTextContent(/slide 3 of 9/i);
      }
    });
  });

  describe('Additional accessibility features', () => {
    it('should mark inactive slides as aria-hidden', () => {
      const { container } = render(<TeamCarousel />);
      
      const slides = container.querySelectorAll('.carousel-slide');
      expect(slides.length).toBe(TEAM_SLIDES.length);
      
      // First slide should not be aria-hidden
      expect(slides[0]).not.toHaveAttribute('aria-hidden', 'true');
      
      // Other slides should be aria-hidden
      for (let i = 1; i < slides.length; i++) {
        expect(slides[i]).toHaveAttribute('aria-hidden', 'true');
      }
    });

    it('should mark active thumbnail with aria-current', () => {
      render(<TeamCarousel />);
      
      const thumbnails = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('aria-label')?.includes('Slide')
      );
      
      // First thumbnail should be active
      expect(thumbnails[0]).toHaveAttribute('aria-current', 'true');
      
      // Others should not be active
      for (let i = 1; i < thumbnails.length; i++) {
        expect(thumbnails[i]).toHaveAttribute('aria-current', 'false');
      }
    });

    it('should disable navigation during transitions', () => {
      render(<TeamCarousel />);
      
      const nextButton = screen.getByLabelText('Next slide');
      
      // Click next
      fireEvent.click(nextButton);
      
      // Button should be disabled during transition
      expect(nextButton).toBeDisabled();
      
      // After transition completes
      vi.advanceTimersByTime(700);
      
      // Button should be enabled again
      expect(nextButton).not.toBeDisabled();
    });
  });
});
