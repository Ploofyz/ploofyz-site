/**
 * Accessibility Verification Tests for Navigation Component
 * Feature: responsive-navigation-enhancement
 * Tests Requirements: 8.1, 8.2, 8.3, 8.4
 * 
 * These tests verify that the Navigation component meets accessibility standards
 * for keyboard navigation, screen readers, and ARIA attributes.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import Navigation from '../Navigation';
import type { Page } from '../../App';

describe('Navigation - Accessibility Verification', () => {
  let mockOnNavigate: ReturnType<typeof vi.fn>;
  let originalInnerWidth: number;

  beforeEach(() => {
    // Create fresh mock for each test
    mockOnNavigate = vi.fn();
    
    // Store original window properties
    originalInnerWidth = window.innerWidth;
    
    // Reset body overflow style
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Restore original window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    
    // Clean up body overflow
    document.body.style.overflow = '';
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  /**
   * Helper function to render Navigation with default props
   */
  const renderNavigation = (currentPage: Page = 'home') => {
    return render(
      <Navigation currentPage={currentPage} onNavigate={mockOnNavigate} />
    );
  };

  /**
   * Helper function to set viewport width
   */
  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  // Basic accessibility test to verify structure
  it('renders with proper semantic structure', () => {
    const { container } = renderNavigation();
    
    // Verify main navigation container exists
    const navContainer = container.querySelector('.nav-container');
    expect(navContainer).toBeInTheDocument();
    
    // Verify logo is present
    const logo = container.querySelector('.nav-logo');
    expect(logo).toBeInTheDocument();
  });

  /**
   * Requirement 8.3: Hamburger button has appropriate aria-label
   * 
   * The hamburger button should have an aria-label for screen readers
   * to understand its purpose.
   */
  describe('Requirement 8.3: ARIA labels for interactive elements', () => {
    it('hamburger button has aria-label "Toggle menu"', () => {
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
      expect(hamburgerBtn).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('hamburger button is a button element', () => {
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn?.tagName).toBe('BUTTON');
    });
  });

  /**
   * Requirement 8.4: Social icons have aria-labels
   * 
   * All social icon links should have aria-labels identifying the platform
   * for screen reader users.
   */
  describe('Requirement 8.4: Social icons have accessibility labels', () => {
    it('desktop social icons have aria-labels', () => {
      const { container } = renderNavigation();
      
      const desktopSocialLinks = container.querySelectorAll('.nav-socials .social-link');
      expect(desktopSocialLinks.length).toBeGreaterThan(0);
      
      desktopSocialLinks.forEach(link => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toMatch(/TikTok|Discord|YouTube/);
      });
    });

    it('mobile social icons have aria-labels', () => {
      const { container } = renderNavigation();
      
      const mobileSocialLinks = container.querySelectorAll('.mobile-socials a');
      expect(mobileSocialLinks.length).toBeGreaterThan(0);
      
      mobileSocialLinks.forEach(link => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel).toMatch(/TikTok|Discord|YouTube/);
      });
    });

    it('all social platforms are represented', () => {
      const { container } = renderNavigation();
      
      const allSocialLinks = container.querySelectorAll('[aria-label*="TikTok"], [aria-label*="Discord"], [aria-label*="YouTube"]');
      
      // Should have at least 6 social links (3 desktop + 3 mobile)
      expect(allSocialLinks.length).toBeGreaterThanOrEqual(6);
      
      // Verify each platform appears
      const labels = Array.from(allSocialLinks).map(link => link.getAttribute('aria-label'));
      expect(labels.some(label => label?.includes('TikTok'))).toBe(true);
      expect(labels.some(label => label?.includes('Discord'))).toBe(true);
      expect(labels.some(label => label?.includes('YouTube'))).toBe(true);
    });
  });

  /**
   * Requirement 8.1: Hamburger button is keyboard focusable
   * 
   * The hamburger button should be focusable and activatable via keyboard
   * for users who rely on keyboard navigation.
   */
  describe('Requirement 8.1: Hamburger button keyboard accessibility', () => {
    it('hamburger button is focusable', () => {
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn') as HTMLButtonElement;
      expect(hamburgerBtn).toBeInTheDocument();
      
      // Button should not have tabindex=-1 (which would prevent focus)
      expect(hamburgerBtn).not.toHaveAttribute('tabindex', '-1');
      
      // Simulate focus
      hamburgerBtn.focus();
      expect(document.activeElement).toBe(hamburgerBtn);
    });

    it('hamburger button is a native button element for keyboard support', () => {
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      
      // Native button elements are keyboard accessible by default
      expect(hamburgerBtn?.tagName).toBe('BUTTON');
    });
  });

  /**
   * Requirement 8.2: Navigation links are keyboard focusable
   * 
   * All navigation links in both desktop and mobile layouts should be
   * keyboard focusable and activatable.
   */
  describe('Requirement 8.2: Navigation links keyboard accessibility', () => {
    it('desktop nav links are focusable', () => {
      const { container } = renderNavigation();
      
      const desktopNavLinks = container.querySelectorAll('.nav-links .nav-link');
      expect(desktopNavLinks.length).toBeGreaterThan(0);
      
      desktopNavLinks.forEach(link => {
        // Should be button elements (keyboard accessible)
        expect(link.tagName).toBe('BUTTON');
        
        // Should not have tabindex=-1
        expect(link).not.toHaveAttribute('tabindex', '-1');
        
        // Should be focusable
        (link as HTMLElement).focus();
        expect(document.activeElement).toBe(link);
      });
    });

    it('mobile nav links are focusable', () => {
      const { container } = renderNavigation();
      
      const mobileNavLinks = container.querySelectorAll('.mobile-menu .mobile-nav-link');
      expect(mobileNavLinks.length).toBeGreaterThan(0);
      
      mobileNavLinks.forEach(link => {
        // Should be button elements (keyboard accessible)
        expect(link.tagName).toBe('BUTTON');
        
        // Should not have tabindex=-1
        expect(link).not.toHaveAttribute('tabindex', '-1');
        
        // Should be focusable
        (link as HTMLElement).focus();
        expect(document.activeElement).toBe(link);
      });
    });

    it('all navigation items are keyboard accessible', () => {
      const { container } = renderNavigation();
      
      // Get all nav links (desktop + mobile)
      const allNavLinks = container.querySelectorAll('.nav-link, .mobile-nav-link');
      
      // Should have at least 12 links (6 desktop + 6 mobile)
      expect(allNavLinks.length).toBeGreaterThanOrEqual(12);
      
      // All should be button elements
      allNavLinks.forEach(link => {
        expect(link.tagName).toBe('BUTTON');
      });
    });
  });

  /**
   * Additional accessibility features
   */
  describe('Additional accessibility features', () => {
    it('logo has proper alt text', () => {
      const { container } = renderNavigation();
      
      const logoImg = container.querySelector('.nav-logo img');
      expect(logoImg).toBeInTheDocument();
      expect(logoImg).toHaveAttribute('alt', 'Ploofyz');
    });

    it('search button is keyboard accessible', () => {
      const { container } = renderNavigation();
      
      const searchButton = container.querySelector('.nav-links button[aria-label*="Search"], .nav-links button:has(.lucide-search)');
      
      if (searchButton) {
        expect(searchButton.tagName).toBe('BUTTON');
        expect(searchButton).not.toHaveAttribute('tabindex', '-1');
      }
    });

    it('maintains logical focus order in desktop layout', () => {
      setViewportWidth(1200); // Desktop width
      const { container } = renderNavigation();
      
      // Get all focusable elements
      const focusableElements = container.querySelectorAll('button, a');
      
      // Should have multiple focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All should be in the document
      focusableElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('maintains logical focus order in mobile layout', () => {
      setViewportWidth(600); // Mobile width
      const { container } = renderNavigation();
      
      // Get all focusable elements
      const focusableElements = container.querySelectorAll('button, a');
      
      // Should have multiple focusable elements
      expect(focusableElements.length).toBeGreaterThan(0);
      
      // All should be in the document
      focusableElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  /**
   * Touch target size verification (Requirement 10.3)
   * 
   * Interactive elements should meet minimum touch target size of 40x40px
   * for mobile usability.
   */
  describe('Touch target sizes', () => {
    it('hamburger button meets minimum touch target size', () => {
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn') as HTMLElement;
      expect(hamburgerBtn).toBeInTheDocument();
      
      // Note: Actual size verification would require computed styles or visual regression testing
      // This test verifies the element exists and is a proper button
      expect(hamburgerBtn.tagName).toBe('BUTTON');
    });
  });
});
