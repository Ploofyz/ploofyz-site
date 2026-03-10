/**
 * Property-Based Tests for ThumbnailIndicator Component
 * Feature: meet-the-team-carousel
 * 
 * These tests use fast-check to verify properties hold across randomized inputs.
 * Minimum 100 iterations per property test as specified in design document.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ThumbnailIndicator } from './ThumbnailIndicator';

// Test configuration: minimum 100 iterations
const TEST_ITERATIONS = 100;

/**
 * Arbitrary generators for ThumbnailIndicator props
 */
const imageSrcArbitrary = fc.webUrl({ withFragments: false, withQueryParameters: false });
const altTextArbitrary = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
const isActiveArbitrary = fc.boolean();
const indexArbitrary = fc.integer({ min: 0, max: 20 });

const thumbnailIndicatorPropsArbitrary = fc.record({
  imageSrc: imageSrcArbitrary,
  alt: altTextArbitrary,
  isActive: isActiveArbitrary,
  index: indexArbitrary,
});

describe('ThumbnailIndicator - Property-Based Tests', () => {
  /**
   * Property 7: Active Thumbnail Visual Distinction
   * **Validates: Requirements 5.2**
   * 
   * For any active slide, the corresponding thumbnail indicator should have 
   * a visual distinction (different class, style, or attribute) from inactive thumbnails.
   */
  it('Property 7: Active Thumbnail Visual Distinction - active thumbnails have distinct class', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();

        // Requirement 5.2: Active thumbnail must have visual distinction
        if (props.isActive) {
          // Active thumbnails should have the active class
          expect(button).toHaveClass('thumbnail-indicator--active');
        } else {
          // Inactive thumbnails should NOT have the active class
          expect(button).not.toHaveClass('thumbnail-indicator--active');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 7: Active Thumbnail Visual Distinction - aria-current attribute
   * **Validates: Requirements 5.2**
   * 
   * Verifies that active thumbnails have aria-current="true" for accessibility,
   * providing an additional visual/semantic distinction.
   */
  it('Property 7: Active Thumbnail Visual Distinction - active thumbnails have aria-current attribute', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();

        // Requirement 5.2: Active thumbnail must have aria-current distinction
        if (props.isActive) {
          expect(button).toHaveAttribute('aria-current', 'true');
        } else {
          expect(button).toHaveAttribute('aria-current', 'false');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 7: Active Thumbnail Visual Distinction - base class always present
   * 
   * Verifies that all thumbnails (active and inactive) have the base class,
   * ensuring consistent styling foundation.
   */
  it('Property 7: All thumbnails have base class regardless of active state', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        
        // All thumbnails should have the base class
        expect(button).toHaveClass('thumbnail-indicator');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property: Active state is mutually exclusive
   * 
   * Verifies that the visual distinction is binary - a thumbnail is either
   * active or inactive, never both or neither.
   */
  it('Property: Active state visual distinction is mutually exclusive', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const button = container.querySelector('button');
        const hasActiveClass = button?.classList.contains('thumbnail-indicator--active');
        const ariaCurrent = button?.getAttribute('aria-current');

        // Active state should be consistent across class and aria-current
        if (props.isActive) {
          expect(hasActiveClass).toBe(true);
          expect(ariaCurrent).toBe('true');
        } else {
          expect(hasActiveClass).toBe(false);
          expect(ariaCurrent).toBe('false');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 9: Thumbnail Avatar Presence
   * **Validates: Requirements 5.4**
   * 
   * For any thumbnail indicator, it should display an avatar image with a valid src attribute.
   */
  it('Property 9: Thumbnail Avatar Presence - all thumbnails display avatar image with valid src', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        // Requirement 5.4: Thumbnail must display avatar image
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();

        // Image must have a valid src attribute
        expect(img).toHaveAttribute('src');
        const srcValue = img?.getAttribute('src');
        expect(srcValue).toBeTruthy();
        expect(srcValue).toBe(props.imageSrc);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 9: Thumbnail Avatar Presence - image has proper class
   * **Validates: Requirements 5.4**
   * 
   * Verifies that the avatar image has the expected class for styling.
   */
  it('Property 9: Thumbnail Avatar Presence - avatar image has proper class', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        
        // Image should have the thumbnail-indicator__image class
        expect(img).toHaveClass('thumbnail-indicator__image');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 9: Thumbnail Avatar Presence - image is child of button
   * **Validates: Requirements 5.4**
   * 
   * Verifies that the avatar image is properly nested within the button element.
   */
  it('Property 9: Thumbnail Avatar Presence - avatar image is contained within button', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const button = container.querySelector('button');
        const img = container.querySelector('img');
        
        expect(button).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        
        // Image should be a descendant of the button
        expect(button).toContainElement(img);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 13: Thumbnail Alt Text Presence
   * **Validates: Requirements 8.2**
   * 
   * For any thumbnail indicator, the image element should include alt text 
   * containing the team member's name.
   */
  it('Property 13: Thumbnail Alt Text Presence - all thumbnails have alt text', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        // Requirement 8.2: Thumbnail image must include alt text
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();

        // Image must have an alt attribute
        expect(img).toHaveAttribute('alt');
        const altValue = img?.getAttribute('alt');
        
        // Alt text must be non-empty
        expect(altValue).toBeTruthy();
        expect(altValue?.trim().length).toBeGreaterThan(0);
        
        // Alt text should match the provided alt prop (team member's name)
        expect(altValue).toBe(props.alt);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 13: Thumbnail Alt Text Presence - alt text contains meaningful content
   * **Validates: Requirements 8.2**
   * 
   * Verifies that the alt text is not just present but contains the actual
   * team member name provided via props.
   */
  it('Property 13: Thumbnail Alt Text Presence - alt text matches team member name', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const img = container.querySelector('img');
        const altValue = img?.getAttribute('alt');
        
        // Alt text should exactly match the provided alt prop
        // This ensures the team member's name is properly conveyed
        expect(altValue).toBe(props.alt);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 13: Thumbnail Alt Text Presence - alt text is accessible
   * **Validates: Requirements 8.2**
   * 
   * Verifies that the alt text is properly accessible to assistive technologies
   * by checking it's a direct attribute on the img element.
   */
  it('Property 13: Thumbnail Alt Text Presence - alt attribute is directly on img element', () => {
    fc.assert(
      fc.property(thumbnailIndicatorPropsArbitrary, (props) => {
        const { container } = render(
          <ThumbnailIndicator
            imageSrc={props.imageSrc}
            alt={props.alt}
            isActive={props.isActive}
            onClick={() => {}}
            index={props.index}
          />
        );

        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        
        // The alt attribute should be directly on the img element
        // (not on a parent or via aria-label)
        expect(img?.hasAttribute('alt')).toBe(true);
        
        // The alt value should be the team member's name
        const altValue = img?.getAttribute('alt');
        expect(altValue).toBe(props.alt);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
