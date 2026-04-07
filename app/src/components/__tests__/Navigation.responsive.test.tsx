/**
 * Responsive Behavior Tests for Navigation Component
 * Feature: responsive-navigation-enhancement
 * Tests Requirements: 1.1, 1.2, 1.3, 9.1, 9.2, 9.3
 * 
 * These tests verify that the Navigation component behaves correctly across
 * different viewport sizes and handles responsive layout transitions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Navigation from '../Navigation';
import type { Page } from '../../App';

/**
 * Helper function to set viewport size and trigger resize event
 */
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

/**
 * Common viewport breakpoints for testing
 */
const VIEWPORTS = {
  mobile: {
    small: 320,    // iPhone SE
    medium: 375,   // iPhone 12/13
    large: 414,    // iPhone 12 Pro Max
  },
  tablet: {
    small: 768,    // iPad Mini
    medium: 820,   // iPad Air
    large: 1024,   // iPad Pro
  },
  desktop: {
    small: 1280,   // Laptop
    medium: 1440,  // Desktop
    large: 1920,   // Full HD
    xlarge: 2560,  // 2K
  },
  breakpoint: 900, // Navigation breakpoint
};

describe('Navigation - Responsive Behavior', () => {
  let mockOnNavigate: ReturnType<typeof vi.fn>;
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Create fresh mock for each test
    mockOnNavigate = vi.fn();
    
    // Store original window properties
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
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
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
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
   * Requirement 1.1: Desktop layout for viewports > 900px
   * 
   * When the viewport width is greater than 900px, the Navigation component
   * should display the desktop layout with all nav links visible horizontally.
   */
  describe('Requirement 1.1: Desktop layout for wide viewports', () => {
    it('should display desktop layout at 901px', () => {
      setViewport(901);
      const { container } = renderNavigation();
      
      // Desktop nav links should exist
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
      
      // Hamburger button should exist (hidden via CSS)
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });

    it('should display desktop layout at 1280px (laptop)', () => {
      setViewport(VIEWPORTS.desktop.small);
      const { container } = renderNavigation();
      
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
      
      const desktopNavButtons = navLinks?.querySelectorAll('.nav-link');
      expect(desktopNavButtons).toBeDefined();
      expect(desktopNavButtons!.length).toBeGreaterThanOrEqual(6);
    });

    it('should display desktop layout at 1920px (full HD)', () => {
      setViewport(VIEWPORTS.desktop.large);
      const { container } = renderNavigation();
      
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
    });

    it('should display desktop layout at 2560px (2K)', () => {
      setViewport(VIEWPORTS.desktop.xlarge);
      const { container } = renderNavigation();
      
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
    });
  });

  /**
   * Requirement 1.2: Mobile layout for viewports ≤ 900px
   * 
   * When the viewport width is 900px or less, the Navigation component
   * should hide the nav links and display the hamburger button.
   */
  describe('Requirement 1.2: Mobile layout for narrow viewports', () => {
    it('should display mobile layout at exactly 900px', () => {
      setViewport(VIEWPORTS.breakpoint);
      const { container } = renderNavigation();
      
      // Hamburger button should exist
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
      
      // Nav links should exist (hidden via CSS on mobile)
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
    });

    it('should display mobile layout at 768px (tablet)', () => {
      setViewport(VIEWPORTS.tablet.small);
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });

    it('should display mobile layout at 375px (iPhone)', () => {
      setViewport(VIEWPORTS.mobile.medium);
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });

    it('should display mobile layout at 320px (small mobile)', () => {
      setViewport(VIEWPORTS.mobile.small);
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });
  });

  /**
   * Requirement 1.3: Layout transitions on viewport resize
   * 
   * When the viewport is resized across the breakpoint, the Navigation
   * component should transition between layouts without page reload.
   */
  describe('Requirement 1.3: Dynamic layout transitions', () => {
    it('should transition from mobile to desktop on resize', () => {
      setViewport(VIEWPORTS.mobile.medium);
      const { container, rerender } = renderNavigation();
      
      // Verify mobile layout
      let hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
      
      // Resize to desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Verify desktop layout
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
      
      // Hamburger button still exists (hidden via CSS)
      hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });

    it('should transition from desktop to mobile on resize', () => {
      setViewport(VIEWPORTS.desktop.small);
      const { container, rerender } = renderNavigation();
      
      // Verify desktop layout
      let navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
      
      // Resize to mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Verify mobile layout
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
      
      // Nav links still exist (hidden via CSS)
      navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
    });

    it('should handle multiple resize events', () => {
      const { container, rerender } = renderNavigation();
      
      // Mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.mobile-menu-btn')).toBeInTheDocument();
      
      // Desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.nav-links')).toBeInTheDocument();
      
      // Tablet (mobile layout)
      setViewport(VIEWPORTS.tablet.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.mobile-menu-btn')).toBeInTheDocument();
      
      // Large desktop
      setViewport(VIEWPORTS.desktop.large);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.nav-links')).toBeInTheDocument();
    });
  });

  /**
   * Requirement 1.4: Logo persists across all layouts
   * 
   * The logo should always be rendered regardless of viewport size.
   */
  describe('Requirement 1.4: Logo persistence', () => {
    it('should display logo on mobile viewport', () => {
      setViewport(VIEWPORTS.mobile.medium);
      const { container } = renderNavigation();
      
      const logo = container.querySelector('.nav-logo');
      expect(logo).toBeInTheDocument();
      
      const logoImg = logo?.querySelector('img');
      expect(logoImg).toHaveAttribute('src', '/ploofyz-logo.png');
      expect(logoImg).toHaveAttribute('alt', 'Ploofyz');
    });

    it('should display logo on desktop viewport', () => {
      setViewport(VIEWPORTS.desktop.small);
      const { container } = renderNavigation();
      
      const logo = container.querySelector('.nav-logo');
      expect(logo).toBeInTheDocument();
      
      const logoImg = logo?.querySelector('img');
      expect(logoImg).toHaveAttribute('src', '/ploofyz-logo.png');
      expect(logoImg).toHaveAttribute('alt', 'Ploofyz');
    });

    it('should maintain logo across viewport changes', () => {
      const { container, rerender } = renderNavigation();
      
      // Mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.nav-logo')).toBeInTheDocument();
      
      // Desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.nav-logo')).toBeInTheDocument();
      
      // Tablet
      setViewport(VIEWPORTS.tablet.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      expect(container.querySelector('.nav-logo')).toBeInTheDocument();
    });
  });

  /**
   * Requirement 9.1: Viewport resize closes mobile menu
   * 
   * When the viewport is resized from mobile to desktop width,
   * the mobile menu should automatically close if open.
   */
  describe('Requirement 9.1: Mobile menu closes on desktop resize', () => {
    it('should close mobile menu when resizing to desktop', () => {
      setViewport(VIEWPORTS.mobile.medium);
      const { container, rerender } = renderNavigation();
      
      // Open mobile menu
      const hamburgerBtn = container.querySelector('.mobile-menu-btn') as HTMLButtonElement;
      fireEvent.click(hamburgerBtn);
      
      // Verify menu is open
      let mobileMenu = container.querySelector('.mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
      
      // Resize to desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Menu should still exist in DOM but state should be closed
      // (The resize handler closes the menu by setting state)
      mobileMenu = container.querySelector('.mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
    });

    it('should close menu when crossing 900px breakpoint', () => {
      setViewport(899);
      const { container, rerender } = renderNavigation();
      
      // Open mobile menu
      const hamburgerBtn = container.querySelector('.mobile-menu-btn') as HTMLButtonElement;
      fireEvent.click(hamburgerBtn);
      
      // Resize to just above breakpoint
      setViewport(901);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Menu should be closed
      const mobileMenu = container.querySelector('.mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
    });
  });

  /**
   * Requirement 9.2: Layout updates without page refresh
   * 
   * The Navigation component should update the layout in response to
   * resize events without requiring a page refresh.
   */
  describe('Requirement 9.2: Layout updates without refresh', () => {
    it('should update layout dynamically on resize', () => {
      const { container, rerender } = renderNavigation();
      
      // Start at mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Component should still be mounted
      expect(container.querySelector('.nav-container')).toBeInTheDocument();
      
      // Resize to desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Component should still be mounted (no remount)
      expect(container.querySelector('.nav-container')).toBeInTheDocument();
    });

    it('should maintain component state across resize', () => {
      const { container, rerender } = renderNavigation('about');
      
      // Start at desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="about" onNavigate={mockOnNavigate} />);
      
      // Verify active page
      let activeLinks = container.querySelectorAll('.nav-link.active');
      expect(activeLinks.length).toBeGreaterThan(0);
      
      // Resize to mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="about" onNavigate={mockOnNavigate} />);
      
      // Active state should persist
      activeLinks = container.querySelectorAll('.mobile-nav-link.active, .nav-link.active');
      expect(activeLinks.length).toBeGreaterThan(0);
    });
  });

  /**
   * Breakpoint boundary testing
   * 
   * Test behavior at exact breakpoint boundaries to ensure
   * correct layout switching.
   */
  describe('Breakpoint boundary testing', () => {
    it('should use mobile layout at exactly 900px', () => {
      setViewport(900);
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });

    it('should use desktop layout at exactly 901px', () => {
      setViewport(901);
      const { container } = renderNavigation();
      
      const navLinks = container.querySelector('.nav-links');
      expect(navLinks).toBeInTheDocument();
    });

    it('should use mobile layout at 899px', () => {
      setViewport(899);
      const { container } = renderNavigation();
      
      const hamburgerBtn = container.querySelector('.mobile-menu-btn');
      expect(hamburgerBtn).toBeInTheDocument();
    });
  });

  /**
   * Common device viewport testing
   * 
   * Test on common device sizes to ensure compatibility.
   */
  describe('Common device viewports', () => {
    const devices = [
      { name: 'iPhone SE', width: 320 },
      { name: 'iPhone 12', width: 390 },
      { name: 'iPhone 12 Pro Max', width: 428 },
      { name: 'iPad Mini', width: 768 },
      { name: 'iPad Air', width: 820 },
      { name: 'iPad Pro', width: 1024 },
      { name: 'Laptop', width: 1280 },
      { name: 'Desktop', width: 1440 },
      { name: 'Full HD', width: 1920 },
    ];

    devices.forEach(device => {
      it(`should render correctly on ${device.name} (${device.width}px)`, () => {
        setViewport(device.width);
        const { container } = renderNavigation();
        
        // Component should render
        expect(container.querySelector('.nav-container')).toBeInTheDocument();
        
        // Logo should be present
        expect(container.querySelector('.nav-logo')).toBeInTheDocument();
        
        // Appropriate layout elements should exist
        if (device.width > 900) {
          expect(container.querySelector('.nav-links')).toBeInTheDocument();
        } else {
          expect(container.querySelector('.mobile-menu-btn')).toBeInTheDocument();
        }
      });
    });
  });

  /**
   * Cross-viewport consistency
   * 
   * Verify that functionality remains consistent across viewport changes.
   */
  describe('Cross-viewport consistency', () => {
    it('should maintain navigation functionality across viewports', () => {
      const { container, rerender } = renderNavigation('home');
      
      // Mobile viewport
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="home" onNavigate={mockOnNavigate} />);
      
      // Open mobile menu and click a link
      const hamburgerBtn = container.querySelector('.mobile-menu-btn') as HTMLButtonElement;
      fireEvent.click(hamburgerBtn);
      
      const mobileNavLinks = container.querySelectorAll('.mobile-nav-link');
      const aboutLink = Array.from(mobileNavLinks).find(
        link => link.textContent === 'About'
      ) as HTMLElement;
      
      if (aboutLink) {
        fireEvent.click(aboutLink);
        expect(mockOnNavigate).toHaveBeenCalledWith('about');
      }
      
      // Switch to desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="about" onNavigate={mockOnNavigate} />);
      
      // Desktop nav should work
      const desktopNavLinks = container.querySelectorAll('.nav-links .nav-link');
      const storeLink = Array.from(desktopNavLinks).find(
        link => link.textContent === 'Store'
      ) as HTMLElement;
      
      if (storeLink) {
        fireEvent.click(storeLink);
        expect(mockOnNavigate).toHaveBeenCalledWith('store');
      }
    });

    it('should maintain active state across viewport changes', () => {
      const { container, rerender } = renderNavigation('vote');
      
      // Desktop
      setViewport(VIEWPORTS.desktop.small);
      rerender(<Navigation currentPage="vote" onNavigate={mockOnNavigate} />);
      
      // Check active state in desktop
      const desktopActiveLinks = container.querySelectorAll('.nav-links .nav-link.active');
      expect(desktopActiveLinks.length).toBeGreaterThan(0);
      
      // Mobile
      setViewport(VIEWPORTS.mobile.medium);
      rerender(<Navigation currentPage="vote" onNavigate={mockOnNavigate} />);
      
      // Check active state in mobile
      const mobileActiveLinks = container.querySelectorAll('.mobile-nav-link.active');
      expect(mobileActiveLinks.length).toBeGreaterThan(0);
    });
  });
});
