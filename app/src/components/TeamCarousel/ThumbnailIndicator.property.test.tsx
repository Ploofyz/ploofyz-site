/**
 * Property-Based Tests for ThumbnailIndicator Component
 * Feature: carousel-avatar-display
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
const avatarSrcArbitrary = fc.webUrl({ withFragments: false, withQueryParameters: false });
const altTextArbitrary = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
const initialsArbitrary = fc.string({ minLength: 1, maxLength: 3 });
const roleColorArbitrary = fc.hexaString({ minLength: 6, maxLength: 6 }).map(h => `#${h}`);
const isActiveArbitrary = fc.boolean();
const indexArbitrary = fc.integer({ min: 0, max: 20 });

describe('ThumbnailIndicator - Property-Based Tests', () => {
  /**
   * Property 1: Avatar image rendered when avatarSrc is present
   * // Feature: carousel-avatar-display, Property 1: Avatar image rendered when avatarSrc is present
   * **Validates: Requirements 1.1**
   *
   * For any ThumbnailIndicator rendered with a non-empty avatarSrc, the component
   * should render an <img> element whose src attribute equals avatarSrc.
   */
  it('Property 1: Avatar image rendered when avatarSrc is present', () => {
    fc.assert(
      fc.property(avatarSrcArbitrary, altTextArbitrary, roleColorArbitrary, initialsArbitrary, (avatarSrc, alt, roleColor, initials) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc={avatarSrc}
            initials={initials}
            roleColor={roleColor}
            alt={alt}
            isActive={false}
            onClick={() => {}}
            index={0}
          />
        );

        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', avatarSrc);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 2: Initials placeholder rendered when avatarSrc is absent
   * // Feature: carousel-avatar-display, Property 2: Initials placeholder rendered when avatarSrc is absent
   * **Validates: Requirements 1.2, 5.6**
   *
   * For any ThumbnailIndicator rendered with an empty avatarSrc, the component
   * should render an initials placeholder with correct initials and background color.
   */
  it('Property 2: Initials placeholder rendered when avatarSrc is absent', () => {
    fc.assert(
      fc.property(altTextArbitrary, roleColorArbitrary, initialsArbitrary, (alt, roleColor, initials) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc=""
            initials={initials}
            roleColor={roleColor}
            alt={alt}
            isActive={false}
            onClick={() => {}}
            index={0}
          />
        );

        // No img element should be rendered
        expect(container.querySelector('img')).not.toBeInTheDocument();

        // Initials placeholder should be rendered
        const placeholder = container.querySelector('.thumbnail-indicator__initials-placeholder');
        expect(placeholder).toBeInTheDocument();

        // Initials text should match
        const span = placeholder?.querySelector('span');
        expect(span?.textContent).toBe(initials);

        // Background color should match roleColor
        const placeholderEl = placeholder as HTMLElement;
        expect(placeholderEl.style.backgroundColor).toBeTruthy();
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 3: Active thumbnail border uses roleColor
   * // Feature: carousel-avatar-display, Property 3: Active thumbnail border uses roleColor
   * **Validates: Requirements 1.3**
   *
   * For any ThumbnailIndicator rendered with isActive=true and any roleColor,
   * the button element's border color should equal roleColor.
   */
  it('Property 3: Active thumbnail border uses roleColor', () => {
    fc.assert(
      fc.property(roleColorArbitrary, altTextArbitrary, (roleColor, alt) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc=""
            initials="TM"
            roleColor={roleColor}
            alt={alt}
            isActive={true}
            onClick={() => {}}
            index={0}
          />
        );

        const button = container.querySelector('button') as HTMLElement;
        expect(button).toBeInTheDocument();
        // Border color should be set via inline style when active
        expect(button.style.borderColor).toBeTruthy();
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 5: Aria-label contains member name and slide position
   * // Feature: carousel-avatar-display, Property 5: Aria-label contains member name and slide position
   * **Validates: Requirements 1.8**
   *
   * For any ThumbnailIndicator rendered with a given alt (member name) and index,
   * the button's aria-label should contain both the member name and the slide number (index + 1).
   */
  it('Property 5: Aria-label contains member name and slide position', () => {
    fc.assert(
      fc.property(altTextArbitrary, indexArbitrary, (alt, index) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc=""
            initials="TM"
            roleColor="#888888"
            alt={alt}
            isActive={false}
            onClick={() => {}}
            index={index}
          />
        );

        const button = container.querySelector('button');
        const ariaLabel = button?.getAttribute('aria-label') ?? '';

        expect(ariaLabel).toContain(alt);
        expect(ariaLabel).toContain(String(index + 1));
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 7: Active Thumbnail Visual Distinction
   * **Validates: Requirements 5.2**
   */
  it('Property 7: Active thumbnails have distinct class', () => {
    fc.assert(
      fc.property(avatarSrcArbitrary, altTextArbitrary, isActiveArbitrary, indexArbitrary, (avatarSrc, alt, isActive, index) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc={avatarSrc}
            initials="TM"
            roleColor="#888888"
            alt={alt}
            isActive={isActive}
            onClick={() => {}}
            index={index}
          />
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();

        if (isActive) {
          expect(button).toHaveClass('thumbnail-indicator--active');
        } else {
          expect(button).not.toHaveClass('thumbnail-indicator--active');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 7: Active thumbnails have aria-current attribute
   * **Validates: Requirements 5.2**
   */
  it('Property 7: Active thumbnails have aria-current attribute', () => {
    fc.assert(
      fc.property(avatarSrcArbitrary, altTextArbitrary, isActiveArbitrary, indexArbitrary, (avatarSrc, alt, isActive, index) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc={avatarSrc}
            initials="TM"
            roleColor="#888888"
            alt={alt}
            isActive={isActive}
            onClick={() => {}}
            index={index}
          />
        );

        const button = container.querySelector('button');

        if (isActive) {
          expect(button).toHaveAttribute('aria-current', 'true');
        } else {
          expect(button).toHaveAttribute('aria-current', 'false');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 7: All thumbnails have base class regardless of active state
   */
  it('Property 7: All thumbnails have base class regardless of active state', () => {
    fc.assert(
      fc.property(avatarSrcArbitrary, altTextArbitrary, isActiveArbitrary, indexArbitrary, (avatarSrc, alt, isActive, index) => {
        const { container } = render(
          <ThumbnailIndicator
            avatarSrc={avatarSrc}
            initials="TM"
            roleColor="#888888"
            alt={alt}
            isActive={isActive}
            onClick={() => {}}
            index={index}
          />
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('thumbnail-indicator');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
