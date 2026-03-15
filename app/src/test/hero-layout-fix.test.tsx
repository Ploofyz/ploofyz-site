import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import Home from '../pages/Home';
import Navigation from '../components/Navigation';

/**
 * Bug Condition Exploration Test for Hero Layout Fix
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * GOAL: Surface counterexamples that demonstrate the bugs exist
 */

describe('Property 1: Fault Condition - Hero Logo Display and Navigation Layout', () => {
  it('should display Ploofyz logo in hero section at 200px width on desktop', () => {
    // Render the home page
    const mockNavigate = () => {};
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    // Query for logo element in hero section
    const heroSection = container.querySelector('.hero-section');
    expect(heroSection).toBeTruthy();
    
    // Look for logo element within hero section (not just navigation)
    const heroLogo = heroSection?.querySelector('img[alt*="Ploofyz"], img[alt*="logo"], .hero-logo, .hero-logo-centered');
    
    // EXPECTED TO FAIL: Logo element should exist in hero section
    expect(heroLogo).toBeTruthy();
    
    if (heroLogo) {
      // Check logo width on desktop (default viewport)
      const computedStyle = window.getComputedStyle(heroLogo as Element);
      const width = parseInt(computedStyle.width);
      
      // EXPECTED TO FAIL: Logo should be approximately 200px on desktop
      expect(width).toBeGreaterThanOrEqual(180);
      expect(width).toBeLessThanOrEqual(220);
    }
  });

  it('should display social icons horizontally with 0.75rem gap in navigation', () => {
    // Render navigation
    const mockNavigate = () => {};
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    // Query for social icons container
    const socialContainer = container.querySelector('.nav-socials');
    expect(socialContainer).toBeTruthy();
    
    if (socialContainer) {
      const computedStyle = window.getComputedStyle(socialContainer);
      
      // EXPECTED TO FAIL: flex-direction should be 'row' for horizontal layout
      expect(computedStyle.flexDirection).toBe('row');
      
      // Check gap is 0.75rem (12px)
      const gap = computedStyle.gap;
      // EXPECTED TO FAIL: gap should be 0.75rem (12px)
      expect(gap).toBe('12px');
    }
  });

  it('should not use absolute positioning for navigation logo', () => {
    // Render navigation
    const mockNavigate = () => {};
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    // Query for navigation logo
    const navLogo = container.querySelector('.nav-logo');
    expect(navLogo).toBeTruthy();
    
    if (navLogo) {
      const computedStyle = window.getComputedStyle(navLogo);
      
      // EXPECTED TO FAIL: position should NOT be 'absolute'
      expect(computedStyle.position).not.toBe('absolute');
    }
  });

  it('should have drop-shadow filter on hero logo', () => {
    // Render the home page
    const mockNavigate = () => {};
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    // Query for logo element in hero section
    const heroSection = container.querySelector('.hero-section');
    const heroLogo = heroSection?.querySelector('img[alt*="Ploofyz"], img[alt*="logo"], .hero-logo, .hero-logo-centered');
    
    // EXPECTED TO FAIL: Logo should exist
    expect(heroLogo).toBeTruthy();
    
    if (heroLogo) {
      const computedStyle = window.getComputedStyle(heroLogo as Element);
      
      // EXPECTED TO FAIL: Logo should have drop-shadow filter
      expect(computedStyle.filter).toContain('drop-shadow');
    }
  });

  it('should display hero logo at 130px width on mobile viewport', () => {
    // Set mobile viewport (480px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Render the home page
    const mockNavigate = () => {};
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    // Query for logo element in hero section
    const heroSection = container.querySelector('.hero-section');
    const heroLogo = heroSection?.querySelector('img[alt*="Ploofyz"], img[alt*="logo"], .hero-logo, .hero-logo-centered');
    
    // EXPECTED TO FAIL: Logo should exist
    expect(heroLogo).toBeTruthy();
    
    if (heroLogo) {
      const computedStyle = window.getComputedStyle(heroLogo as Element);
      const width = parseInt(computedStyle.width);
      
      // EXPECTED TO FAIL: Logo should be approximately 130px on mobile
      expect(width).toBeGreaterThanOrEqual(120);
      expect(width).toBeLessThanOrEqual(150);
    }
    
    // Reset viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('property-based: hero logo should exist and be properly sized across viewport widths', () => {
    fc.assert(
      fc.property(
        // Generate viewport widths from mobile to desktop
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth: number) => {
          // Set viewport
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          
          // Render the home page
          const mockNavigate = () => {};
          const { container } = render(<Home onNavigate={mockNavigate} />);
          
          // Query for logo element in hero section
          const heroSection = container.querySelector('.hero-section');
          const heroLogo = heroSection?.querySelector('img[alt*="Ploofyz"], img[alt*="logo"], .hero-logo, .hero-logo-centered');
          
          // EXPECTED TO FAIL: Logo should exist at all viewport sizes
          expect(heroLogo).toBeTruthy();
          
          if (heroLogo) {
            const computedStyle = window.getComputedStyle(heroLogo as Element);
            const width = parseInt(computedStyle.width);
            
            // Logo should have reasonable size (not 0, not too large)
            expect(width).toBeGreaterThan(0);
            expect(width).toBeLessThan(500);
          }
        }
      ),
      { numRuns: 10 } // Run 10 test cases with different viewport widths
    );
  });
});

/**
 * Preservation Property Tests for Hero Layout Fix
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10**
 * 
 * IMPORTANT: Follow observation-first methodology
 * These tests observe behavior on UNFIXED code for non-buggy inputs
 * EXPECTED OUTCOME: Tests PASS (this confirms baseline behavior to preserve)
 */

describe('Property 2: Preservation - Existing Functionality', () => {
  let mockNavigate: (page: string) => void;

  beforeEach(() => {
    mockNavigate = () => {};
    // Reset scroll position
    window.scrollY = 0;
  });

  it('should display navigation with scrolled state when scrolled', () => {
    // Requirement 3.1: Navigation scrolled state with backdrop blur
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    const navContainer = container.querySelector('.nav-container');
    expect(navContainer).toBeTruthy();
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 100 });
    window.dispatchEvent(new Event('scroll'));
    
    // Wait for state update
    setTimeout(() => {
      expect(navContainer?.classList.contains('scrolled')).toBe(true);
    }, 100);
  });

  it('should render all navigation buttons correctly', () => {
    // Requirement 3.2: All navigation buttons continue to work
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    // Check that all nav buttons exist
    const navButtons = container.querySelectorAll('.nav-link');
    expect(navButtons.length).toBeGreaterThanOrEqual(5); // Home, Vote, Store, Join, Ranks + Search
    
    // Verify button text content
    const buttonTexts = Array.from(navButtons).map(btn => btn.textContent?.trim());
    expect(buttonTexts).toContain('Home');
    expect(buttonTexts).toContain('Vote');
    expect(buttonTexts).toContain('Store');
    expect(buttonTexts).toContain('Join');
    expect(buttonTexts).toContain('Ranks');
  });

  it('should render social media icons with correct links', () => {
    // Requirement 3.3: Social media icon links continue to open correct external URLs
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    const socialLinks = container.querySelectorAll('.social-link');
    expect(socialLinks.length).toBe(3); // Discord, YouTube, TikTok
    
    // Check that links have correct attributes
    socialLinks.forEach(link => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.getAttribute('href')).toBeTruthy();
    });
    
    // Verify specific social links exist
    const hrefs = Array.from(socialLinks).map(link => link.getAttribute('href'));
    expect(hrefs.some(href => href?.includes('discord'))).toBe(true);
    expect(hrefs.some(href => href?.includes('youtube'))).toBe(true);
    expect(hrefs.some(href => href?.includes('tiktok'))).toBe(true);
  });

  it('should render mobile menu button', () => {
    // Requirement 3.4: Mobile menu hamburger button continues to function
    const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
    
    const mobileMenuBtn = container.querySelector('.mobile-menu-btn');
    expect(mobileMenuBtn).toBeTruthy();
    
    const menuIcon = container.querySelector('.menu-icon');
    expect(menuIcon).toBeTruthy();
    expect(menuIcon?.querySelectorAll('span').length).toBe(3); // Three hamburger lines
  });

  it('should render hero section video placeholder', () => {
    // Requirement 3.5: Hero section video placeholder continues to display
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    const videoPlaceholder = container.querySelector('.video-placeholder');
    expect(videoPlaceholder).toBeTruthy();
    
    const playButton = container.querySelector('.video-play-button');
    expect(playButton).toBeTruthy();
    
    const videoText = container.querySelector('.video-text');
    expect(videoText?.textContent).toBe('Video Coming Soon');
  });

  it('should render server IP box correctly', () => {
    // Requirement 3.6: Server IP box continues to render correctly
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    const serverIpBox = container.querySelector('.server-ip-box');
    expect(serverIpBox).toBeTruthy();
    
    const serverIpLabel = container.querySelector('.server-ip-label');
    expect(serverIpLabel?.textContent).toBe('Server IP');
    
    const serverIp = container.querySelector('.server-ip');
    expect(serverIp?.textContent).toBe('play.ploofyz.com');
  });

  it('should render hero section with animations', () => {
    // Requirement 3.7: All page animations and transitions continue to work
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    const heroSection = container.querySelector('.hero-section');
    expect(heroSection).toBeTruthy();
    
    // Check for animated elements
    const heroVideoSection = container.querySelector('.hero-video-section');
    const heroContentSection = container.querySelector('.hero-content-section');
    const heroBadge = container.querySelector('.hero-badge');
    const heroTitle = container.querySelector('.hero-title');
    
    expect(heroVideoSection).toBeTruthy();
    expect(heroContentSection).toBeTruthy();
    expect(heroBadge).toBeTruthy();
    expect(heroTitle).toBeTruthy();
  });

  it('should render interactive elements with proper structure', () => {
    // Requirement 3.8: Hover states on interactive elements continue to function
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    // Check for buttons
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check for hero buttons
    const heroButtons = container.querySelector('.hero-buttons');
    expect(heroButtons).toBeTruthy();
    
    const primaryBtn = container.querySelector('.btn-primary');
    const secondaryBtn = container.querySelector('.btn-secondary');
    expect(primaryBtn).toBeTruthy();
    expect(secondaryBtn).toBeTruthy();
  });

  it('should render other page sections correctly', () => {
    // Requirement 3.9: Other page sections (Team, Ranks, CTA) continue to render correctly
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    // Check for team section
    const teamSection = container.querySelector('.team-section');
    expect(teamSection).toBeTruthy();
    
    // Check for ranks section
    const ranksSection = container.querySelector('.ranks-section');
    expect(ranksSection).toBeTruthy();
    
    const ranksGrid = container.querySelector('.ranks-grid');
    expect(ranksGrid).toBeTruthy();
    
    // Check for CTA section
    const ctaSection = container.querySelector('.cta-section');
    expect(ctaSection).toBeTruthy();
    
    const ctaContent = container.querySelector('.cta-content');
    expect(ctaContent).toBeTruthy();
  });

  it('should render ranks cards with correct data', () => {
    // Requirement 3.9: Ranks section continues to render correctly
    const { container } = render(<Home onNavigate={mockNavigate} />);
    
    const rankCards = container.querySelectorAll('.rank-card');
    expect(rankCards.length).toBe(5); // VIP, Elite, Hero, Nexus, Phantom
    
    // Check for rank names
    const rankNames = container.querySelectorAll('.rank-name');
    expect(rankNames.length).toBe(5);
    
    const rankTexts = Array.from(rankNames).map(name => name.textContent);
    expect(rankTexts).toContain('VIP');
    expect(rankTexts).toContain('Elite');
    expect(rankTexts).toContain('Hero');
    expect(rankTexts).toContain('Nexus');
    expect(rankTexts).toContain('Phantom');
  });

  it('property-based: navigation should render correctly across different pages', () => {
    // Requirement 3.2: Navigation continues to work across all pages
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'vote', 'store', 'join', 'ranks'),
        (currentPage: string) => {
          const { container } = render(
            <Navigation currentPage={currentPage as any} onNavigate={mockNavigate} />
          );
          
          // Navigation should always render
          const navContainer = container.querySelector('.nav-container');
          expect(navContainer).toBeTruthy();
          
          // All nav buttons should exist
          const navButtons = container.querySelectorAll('.nav-link');
          expect(navButtons.length).toBeGreaterThanOrEqual(5);
          
          // Social links should exist
          const socialLinks = container.querySelectorAll('.social-link');
          expect(socialLinks.length).toBe(3);
          
          // Logo should exist
          const navLogo = container.querySelector('.nav-logo');
          expect(navLogo).toBeTruthy();
        }
      ),
      { numRuns: 5 } // Test all 5 pages
    );
  });

  it('property-based: responsive breakpoints should work correctly', () => {
    // Requirement 3.10: Responsive breakpoints at 1024px, 640px, and 480px continue to work
    fc.assert(
      fc.property(
        fc.constantFrom(1920, 1024, 768, 640, 480, 320),
        (viewportWidth: number) => {
          // Set viewport
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          
          // Render navigation
          const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
          
          // Navigation should render at all breakpoints
          const navContainer = container.querySelector('.nav-container');
          expect(navContainer).toBeTruthy();
          
          // Social links should exist at all breakpoints
          const socialLinks = container.querySelectorAll('.social-link');
          expect(socialLinks.length).toBe(3);
          
          // Mobile menu button should exist
          const mobileMenuBtn = container.querySelector('.mobile-menu-btn');
          expect(mobileMenuBtn).toBeTruthy();
        }
      ),
      { numRuns: 6 } // Test all 6 breakpoints
    );
  });

  it('property-based: hero section should render consistently', () => {
    // Requirement 3.7, 3.9: All animations and sections continue to work
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (seed: number) => {
          // Use seed to ensure different render cycles
          const { container } = render(<Home onNavigate={mockNavigate} key={seed} />);
          
          // Hero section should always render
          const heroSection = container.querySelector('.hero-section');
          expect(heroSection).toBeTruthy();
          
          // Video section should exist
          const videoSection = container.querySelector('.hero-video-section');
          expect(videoSection).toBeTruthy();
          
          // Content section should exist
          const contentSection = container.querySelector('.hero-content-section');
          expect(contentSection).toBeTruthy();
          
          // Server IP should exist
          const serverIpBox = container.querySelector('.server-ip-box');
          expect(serverIpBox).toBeTruthy();
          
          // All major sections should exist
          const teamSection = container.querySelector('.team-section');
          const ranksSection = container.querySelector('.ranks-section');
          const ctaSection = container.querySelector('.cta-section');
          
          expect(teamSection).toBeTruthy();
          expect(ranksSection).toBeTruthy();
          expect(ctaSection).toBeTruthy();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('property-based: social media links should be valid URLs', () => {
    // Requirement 3.3: Social media links continue to work
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
          
          const socialLinks = container.querySelectorAll('.social-link');
          
          socialLinks.forEach(link => {
            const href = link.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href).toMatch(/^https?:\/\//); // Should be a valid URL
            expect(link.getAttribute('target')).toBe('_blank');
            expect(link.getAttribute('rel')).toBe('noopener noreferrer');
          });
        }
      ),
      { numRuns: 5 }
    );
  });

  it('property-based: hero stats should render correctly', () => {
    // Requirement 3.9: Hero section elements continue to render
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = render(<Home onNavigate={mockNavigate} />);
          
          const heroStats = container.querySelector('.hero-stats');
          expect(heroStats).toBeTruthy();
          
          const statItems = container.querySelectorAll('.stat-item');
          expect(statItems.length).toBe(2); // 500+ Players, 24/7 Online
          
          // Check stat content
          const statTexts = Array.from(statItems).map(item => item.textContent);
          expect(statTexts.some(text => text?.includes('Players'))).toBe(true);
          expect(statTexts.some(text => text?.includes('Online'))).toBe(true);
        }
      ),
      { numRuns: 5 }
    );
  });

  it('property-based: scroll indicator should render', () => {
    // Requirement 3.7: Animations continue to work
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = render(<Home onNavigate={mockNavigate} />);
          
          const scrollIndicator = container.querySelector('.scroll-indicator');
          expect(scrollIndicator).toBeTruthy();
          
          const indicatorText = scrollIndicator?.textContent;
          expect(indicatorText).toContain('Scroll to explore');
        }
      ),
      { numRuns: 5 }
    );
  });
});
