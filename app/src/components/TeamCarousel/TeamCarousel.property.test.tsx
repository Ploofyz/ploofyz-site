/**
 * Property-Based Tests for TeamCarousel Component
 * Feature: meet-the-team-carousel
 * 
 * These tests use fast-check to verify properties hold across randomized inputs.
 * Minimum 100 iterations per property test as specified in design document.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { TeamCarousel } from './TeamCarousel';
import { TEAM_SLIDES } from './constants';

// Test configuration: minimum 100 iterations
const TEST_ITERATIONS = 100;

describe('TeamCarousel - Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /**
   * Property 1: Single Active Profile
   * **Validates: Requirements 2.1**
   * 
   * For any carousel state, exactly one profile slide should be marked 
   * as active at any given time.
   */
  it('Property 1: Single Active Profile - exactly one slide is active at any time', async () => {
    fc.assert(
      fc.asyncProperty(
        // Generate a sequence of navigation actions
        fc.array(
          fc.oneof(
            fc.constant('next'),
            fc.constant('prev'),
            fc.integer({ min: 0, max: TEAM_SLIDES.length - 1 }).map(idx => ({ type: 'thumbnail', index: idx }))
          ),
          { minLength: 1, maxLength: 20 }
        ),
        async (actions) => {
          const user = userEvent.setup({ delay: null });
          const { container, unmount } = render(<TeamCarousel />);

          try {
            // Initial state: exactly one slide should be active
            let activeSlides = container.querySelectorAll('.carousel-slide--active');
            expect(activeSlides.length).toBe(1);

            // Perform each navigation action
            for (const action of actions) {
              if (action === 'next') {
                // Click next arrow
                const nextButton = screen.getByLabelText('Next slide');
                await user.click(nextButton);
              } else if (action === 'prev') {
                // Click previous arrow
                const prevButton = screen.getByLabelText('Previous slide');
                await user.click(prevButton);
              } else if (typeof action === 'object' && action.type === 'thumbnail') {
                // Click thumbnail at specific index
                const thumbnails = container.querySelectorAll('.thumbnail-indicator');
                if (thumbnails[action.index]) {
                  await user.click(thumbnails[action.index] as HTMLElement);
                }
              }

              // After each action, verify exactly one slide is active
              activeSlides = container.querySelectorAll('.carousel-slide--active');
              expect(activeSlides.length).toBe(1);

              // Verify the active slide has proper ARIA attributes
              const activeSlide = activeSlides[0];
              expect(activeSlide).toHaveAttribute('aria-hidden', 'false');

              // Verify all other slides are not active and have aria-hidden="true"
              const allSlides = container.querySelectorAll('.carousel-slide');
              allSlides.forEach((slide) => {
                if (slide !== activeSlide) {
                  expect(slide).not.toHaveClass('carousel-slide--active');
                  expect(slide).toHaveAttribute('aria-hidden', 'true');
                }
              });
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 3: Navigation Direction Consistency
   * **Validates: Requirements 3.3, 3.4**
   * 
   * For any current slide index, clicking the next arrow should advance to 
   * the next sequential slide (with wrapping), and clicking the previous arrow 
   * should move to the previous sequential slide (with wrapping).
   */
  it('Property 3: Navigation Direction Consistency - next/prev arrows navigate sequentially with wrapping', async () => {
    fc.assert(
      fc.asyncProperty(
        // Generate a starting index and a sequence of next/prev actions
        fc.integer({ min: 0, max: TEAM_SLIDES.length - 1 }),
        fc.array(
          fc.oneof(
            fc.constant('next'),
            fc.constant('prev')
          ),
          { minLength: 1, maxLength: 30 }
        ),
        async (startIndex, actions) => {
          const user = userEvent.setup({ delay: null });
          const { container, unmount } = render(<TeamCarousel />);

          try {
            const slideCount = TEAM_SLIDES.length;
            
            // Navigate to starting index using thumbnails
            if (startIndex !== 0) {
              const thumbnails = container.querySelectorAll('.thumbnail-indicator');
              await user.click(thumbnails[startIndex] as HTMLElement);
            }

            // Track expected index based on navigation logic
            let expectedIndex = startIndex;

            // Helper to get current active slide index
            const getActiveIndex = (): number => {
              const slides = container.querySelectorAll('.carousel-slide');
              for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('carousel-slide--active')) {
                  return i;
                }
              }
              return -1;
            };

            // Verify starting position
            expect(getActiveIndex()).toBe(expectedIndex);

            // Perform each navigation action and verify sequential movement
            for (const action of actions) {
              if (action === 'next') {
                // Click next arrow
                const nextButton = screen.getByLabelText('Next slide');
                await user.click(nextButton);
                
                // Calculate expected next index with wrapping
                expectedIndex = (expectedIndex + 1) % slideCount;
              } else if (action === 'prev') {
                // Click previous arrow
                const prevButton = screen.getByLabelText('Previous slide');
                await user.click(prevButton);
                
                // Calculate expected previous index with wrapping
                expectedIndex = (expectedIndex - 1 + slideCount) % slideCount;
              }

              // Verify the carousel moved to the expected sequential index
              const actualIndex = getActiveIndex();
              expect(actualIndex).toBe(expectedIndex);

              // Verify wrapping behavior at boundaries
              if (action === 'next' && expectedIndex === 0) {
                // Wrapped from last to first
                expect(actualIndex).toBe(0);
              } else if (action === 'prev' && expectedIndex === slideCount - 1) {
                // Wrapped from first to last
                expect(actualIndex).toBe(slideCount - 1);
              }
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
