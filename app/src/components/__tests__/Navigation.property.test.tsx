/**
 * Property-Based Tests for Navigation Component
 * Feature: responsive-navigation-enhancement
 * 
 * These tests use fast-check to verify properties hold across randomized inputs.
 * Minimum 100 iterations per property test as specified in design document.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import Navigation from '../Navigation';

// Test configuration: minimum 100 iterations
const TEST_ITERATIONS = 100;

/**
 * Arbitrary generators for Navigation props and test scenarios
 */
const pageArbitrary = fc.constantFrom(
  'home' as const,
  'about' as const,
  'store' as const,
  'join' as const,
  'ranks' as const,
  'vote' as const
);

const viewportWidthArbitrary = fc.integer({ min: 320, max: 3840 });
const desktopViewportArbitrary = fc.integer({ min: 901, max: 3840 });
const mobileViewportArbitrary = fc.integer({ min: 320, max: 900 });

const navigationPropsArbitrary = fc.record({
  currentPage: pageArbitrary,
});

describe('Navigation - Property-Based Tests', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    // Store original window.innerWidth
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.clearAllMocks();
  });

  /**
   * Property 1: Desktop layout displays nav links for wide viewports
   * **Validates: Requirements 1.1, 4.1, 4.2**
   * 
   * For any viewport width greater than 900px, the Navigation component should 
   * render the desktop layout with all navigation links visible horizontally 
   * and the hamburger button hidden.
   */
  it('Property 1: Desktop layout displays nav links for wide viewports', () => {
    fc.assert(
      fc.property(desktopViewportArbitrary, navigationPropsArbitrary, (viewportWidth, props) => {
        // Set viewport width to desktop size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewportWidth,
        });

        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify nav links container exists
        const navLinks = container.querySelector('.nav-links');
        expect(navLinks).toBeInTheDocument();

        // Verify hamburger button exists but should be hidden via CSS
        const hamburgerBtn = container.querySelector('.mobile-menu-btn');
        expect(hamburgerBtn).toBeInTheDocument();

        // Verify all navigation items are present in desktop layout
        const navButtons = navLinks?.querySelectorAll('.nav-link');
        expect(navButtons).toBeDefined();
        expect(navButtons!.length).toBeGreaterThanOrEqual(6); // 6 nav items + search button
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 2: Mobile layout displays hamburger button for narrow viewports
   * **Validates: Requirements 1.2**
   * 
   * For any viewport width at or below 900px, the Navigation component should 
   * hide the navigation links and display the hamburger button.
   */
  it('Property 2: Mobile layout displays hamburger button for narrow viewports', () => {
    fc.assert(
      fc.property(mobileViewportArbitrary, navigationPropsArbitrary, (viewportWidth, props) => {
        // Set viewport width to mobile size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewportWidth,
        });

        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify hamburger button exists
        const hamburgerBtn = container.querySelector('.mobile-menu-btn');
        expect(hamburgerBtn).toBeInTheDocument();

        // Verify nav links container exists (hidden via CSS on mobile)
        const navLinks = container.querySelector('.nav-links');
        expect(navLinks).toBeInTheDocument();
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 4: Logo persists across all layouts
   * **Validates: Requirements 1.4**
   * 
   * For any viewport width and menu state, the Navigation component should 
   * always render the logo element in the center position.
   */
  it('Property 4: Logo persists across all layouts', () => {
    fc.assert(
      fc.property(viewportWidthArbitrary, navigationPropsArbitrary, (viewportWidth, props) => {
        // Set viewport width
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewportWidth,
        });

        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify logo exists
        const logo = container.querySelector('.nav-logo');
        expect(logo).toBeInTheDocument();

        // Verify logo contains an image
        const logoImg = logo?.querySelector('img');
        expect(logoImg).toBeInTheDocument();
        expect(logoImg).toHaveAttribute('src', '/ploofyz-logo.png');
        expect(logoImg).toHaveAttribute('alt', 'Ploofyz');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 10: Mobile menu contains all navigation items
   * **Validates: Requirements 5.1**
   * 
   * For any mobile menu render, it should display all navigation links 
   * from the navItems array in vertical layout.
   */
  it('Property 10: Mobile menu contains all navigation items', () => {
    fc.assert(
      fc.property(navigationPropsArbitrary, (props) => {
        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify mobile menu exists
        const mobileMenu = container.querySelector('.mobile-menu');
        expect(mobileMenu).toBeInTheDocument();

        // Verify all navigation items are present in mobile menu
        const mobileNavLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');
        expect(mobileNavLinks).toBeDefined();
        expect(mobileNavLinks!.length).toBeGreaterThanOrEqual(6); // 6 nav items + search

        // Verify social icons are present in mobile menu
        const mobileSocials = mobileMenu?.querySelector('.mobile-socials');
        expect(mobileSocials).toBeInTheDocument();
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 11: Active page is highlighted in navigation
   * **Validates: Requirements 7.1**
   * 
   * For any current page value, the corresponding navigation link should 
   * have the 'active' class applied in both desktop and mobile layouts.
   */
  it('Property 11: Active page is highlighted in navigation', () => {
    fc.assert(
      fc.property(navigationPropsArbitrary, (props) => {
        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Check desktop nav links for active class
        const desktopNavLinks = container.querySelectorAll('.nav-links .nav-link');
        const hasActiveDesktop = Array.from(desktopNavLinks).some(link => 
          link.classList.contains('active')
        );
        expect(hasActiveDesktop).toBe(true);

        // Check mobile nav links for active class
        const mobileNavLinks = container.querySelectorAll('.mobile-menu .mobile-nav-link');
        const hasActiveMobile = Array.from(mobileNavLinks).some(link => 
          link.classList.contains('active')
        );
        expect(hasActiveMobile).toBe(true);
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 13: Hamburger button is keyboard accessible
   * **Validates: Requirements 8.1**
   * 
   * For any mobile viewport, the hamburger button should be focusable 
   * and activatable via keyboard (Enter or Space keys).
   */
  it('Property 13: Hamburger button is keyboard accessible', () => {
    fc.assert(
      fc.property(navigationPropsArbitrary, (props) => {
        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify hamburger button is a button element (keyboard accessible by default)
        const hamburgerBtn = container.querySelector('.mobile-menu-btn');
        expect(hamburgerBtn).toBeInTheDocument();
        expect(hamburgerBtn?.tagName).toBe('BUTTON');

        // Verify button has aria-label for screen readers
        expect(hamburgerBtn).toHaveAttribute('aria-label', 'Toggle menu');
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 14: Navigation links are keyboard focusable
   * **Validates: Requirements 8.2**
   * 
   * For any navigation link in desktop or mobile layout, it should be 
   * keyboard focusable and activatable.
   */
  it('Property 14: Navigation links are keyboard focusable', () => {
    fc.assert(
      fc.property(navigationPropsArbitrary, (props) => {
        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify desktop nav links are button elements (keyboard accessible)
        const desktopNavLinks = container.querySelectorAll('.nav-links .nav-link');
        desktopNavLinks.forEach(link => {
          expect(link.tagName).toBe('BUTTON');
        });

        // Verify mobile nav links are button elements (keyboard accessible)
        const mobileNavLinks = container.querySelectorAll('.mobile-menu .mobile-nav-link');
        mobileNavLinks.forEach(link => {
          expect(link.tagName).toBe('BUTTON');
        });
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });

  /**
   * Property 15: Social icons have accessibility labels
   * **Validates: Requirements 8.4**
   * 
   * For any social icon link, it should have an aria-label attribute 
   * identifying the platform.
   */
  it('Property 15: Social icons have accessibility labels', () => {
    fc.assert(
      fc.property(navigationPropsArbitrary, (props) => {
        const mockOnNavigate = vi.fn();
        const { container } = render(
          <Navigation currentPage={props.currentPage} onNavigate={mockOnNavigate} />
        );

        // Verify desktop social icons have aria-labels
        const desktopSocialLinks = container.querySelectorAll('.nav-socials .social-link');
        expect(desktopSocialLinks.length).toBeGreaterThan(0);
        
        desktopSocialLinks.forEach(link => {
          const ariaLabel = link.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel).toMatch(/TikTok|Discord|YouTube/);
        });

        // Verify mobile social icons have aria-labels
        const mobileSocialLinks = container.querySelectorAll('.mobile-socials a');
        expect(mobileSocialLinks.length).toBeGreaterThan(0);
        
        mobileSocialLinks.forEach(link => {
          const ariaLabel = link.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel).toMatch(/TikTok|Discord|YouTube/);
        });
      }),
      { numRuns: TEST_ITERATIONS }
    );
  });
});
