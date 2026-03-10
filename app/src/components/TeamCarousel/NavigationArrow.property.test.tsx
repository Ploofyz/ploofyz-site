/**
 * Property-Based Tests for NavigationArrow Component
 * Feature: meet-the-team-carousel
 * 
 * These tests use fast-check to verify properties hold across randomized inputs.
 * Minimum 100 iterations per property test as specified in design document.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { NavigationArrow } from './NavigationArrow';

// Test configuration: minimum 100 iterations
const TEST_ITERATIONS = 100;

/**
 * Arbitrary generators for NavigationArrow props
 */
const directionArbitrary = fc.constantFrom('prev' as const, 'next' as const);
const disabledArbitrary = fc.boolean();
const ariaLabelArbitrary = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

const navigationArrowPropsArbitrary = fc.record({
  direction: directionArbitrary,
  disabled: disabledArbitrary,
  ariaLabel: ariaLabelArbitrary,
});

describe('NavigationArrow - Property-Based Tests', () => {
  /**
   * Property 12: Navigation Arrow ARIA Labels
   * **Validates: Requirements 8.1**
   * 
   * For any navigation arrow element, it should include an aria-label attribute 
   * that describes its function ("Previous slide" or "Next slide").
   */
  it('Property 12: Navigation Arrow ARIA Labels - aria-label is always present', () => {
    fc.assert(
      fc.property(navigationArrowPropsArbitrary, (props) => {
        const { container } = render(
          <NavigationArrow
            direction={props.direction}
            onClick={() => {}}
            disabled={props.disabled}
            ariaLabel={props.ariaLabel}
          />
        );

        // Requirement 8.1: Navigation arrow must have aria-label attribute
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label');
        
        // Verify the aria-label matches the provided value
        const ariaLabel = button?.getAttribute('aria-label');
        expect(ariaLabel).toBe(props.ariaLabel);
        
        // Verify aria-label is not empty
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Verify aria-label describes function for standard labels
   * Tests that when using standard "Previous slide" or "Next slide" labels,
   * they correctly describe the arrow's function
   */
  it('Property: Standard ARIA labels correctly describe arrow function', () => {
    fc.assert(
      fc.property(directionArbitrary, disabledArbitrary, (direction, disabled) => {
        const expectedLabel = direction === 'prev' ? 'Previous slide' : 'Next slide';
        
        const { container } = render(
          <NavigationArrow
            direction={direction}
            onClick={() => {}}
            disabled={disabled}
            ariaLabel={expectedLabel}
          />
        );

        const button = container.querySelector('button');
        expect(button).toHaveAttribute('aria-label', expectedLabel);
        
        // Verify the label describes the direction correctly
        if (direction === 'prev') {
          expect(button?.getAttribute('aria-label')).toContain('Previous');
        } else {
          expect(button?.getAttribute('aria-label')).toContain('Next');
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Button type is always "button"
   * Verifies that the navigation arrow is always a proper button element
   */
  it('Property: Navigation arrow is always a button element with type="button"', () => {
    fc.assert(
      fc.property(navigationArrowPropsArbitrary, (props) => {
        const { container } = render(
          <NavigationArrow
            direction={props.direction}
            onClick={() => {}}
            disabled={props.disabled}
            ariaLabel={props.ariaLabel}
          />
        );

        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'button');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Disabled state is correctly applied
   * Verifies that the disabled prop is always reflected in the button's disabled attribute
   */
  it('Property: Disabled state is always correctly applied', () => {
    fc.assert(
      fc.property(navigationArrowPropsArbitrary, (props) => {
        const { container } = render(
          <NavigationArrow
            direction={props.direction}
            onClick={() => {}}
            disabled={props.disabled}
            ariaLabel={props.ariaLabel}
          />
        );

        const button = container.querySelector('button');
        
        if (props.disabled) {
          expect(button).toBeDisabled();
        } else {
          expect(button).not.toBeDisabled();
        }
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Additional property test: Direction class is always applied
   * Verifies that the navigation arrow always has the correct direction class
   */
  it('Property: Direction class is always correctly applied', () => {
    fc.assert(
      fc.property(navigationArrowPropsArbitrary, (props) => {
        const { container } = render(
          <NavigationArrow
            direction={props.direction}
            onClick={() => {}}
            disabled={props.disabled}
            ariaLabel={props.ariaLabel}
          />
        );

        const button = container.querySelector('button');
        expect(button).toHaveClass('navigation-arrow');
        expect(button).toHaveClass(`navigation-arrow--${props.direction}`);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
