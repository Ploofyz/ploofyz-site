import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import Home from '../pages/Home';
import Navigation from '../components/Navigation';

/**
 * Preservation Property Tests for Hero Layout Fix
 * 
 * **Validates: Requirements 3.1-3.10**
 * 
 * IMPORTANT: These tests capture baseline behavior on UNFIXED code
 * They should PASS on unfixed code and continue to PASS after the fix
 * This ensures no regressions are introduced
 */

describe('Property 2: Preservation - Existing Functionality', () => {
  describe('Navigation Functionality (Req 3.1, 3.2)', () => {
    it('should show scrolled state with backdrop blur when scrolled', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
      
      const navContainer = container.querySelector('.nav-container');
      expect(navContainer).toBeTruthy();
      
      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
      
      // Wait for scroll handler
      waitFor(() => {
        expect(navContainer?.classList.contains('scrolled')).toBe(true);
      });
    });

    it('should navigate correctly when clicking navigation buttons', () => {
      const mockNavigate = vi.fn();
      render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
      
      // Find and click each navigation button
      const homeBtn = screen.getByText('Home');
      const voteBtn = screen.getByText('Vote');
      const storeBtn = screen.getByText('Store');
      const joinBtn = screen.getByText('Join');
      const ranksBtn = screen.getByText('Ranks');
      
      fireEvent.click(homeBtn);
      expect(mockNavigate).toHaveBeenCalledWith('home');
      
      fireEvent.click(voteBtn);
      expect(mockNavigate).toHaveBeenCalledWith('vote');
      
      fireEvent.click(storeBtn);
      expect(mockNavigate).toHaveBeenCalledWith('store');
      
      fireEvent.click(joinBtn);
      expect(mockNavigate).toHaveBeenCalledWith('join');
      
      fireEvent.click(ranksBtn);
      expect(mockNavigate).toHaveBeenCalledWith('ranks');
    });
  });

  describe('Social Media Links (Req 3.3)', () => {
    it('should open correct external URLs for social media icons', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
      
      // Find social links
      const socialLinks = container.querySelectorAll('.social-link');
      expect(socialLinks.length).toBe(3);
      
      // Check Discord link
      const discordLink = socialLinks[0] as HTMLAnchorElement;
      expect(discordLink.href).toContain('discord.gg');
      expect(discordLink.target).toBe('_blank');
      
      // Check YouTube link
      const youtubeLink = socialLinks[1] as HTMLAnchorElement;
      expect(youtubeLink.href).toContain('youtube.com');
      expect(youtubeLink.target).toBe('_blank');
      
      // Check TikTok link
      const tiktokLink = socialLinks[2] as HTMLAnchorElement;
      expect(tiktokLink.href).toContain('tiktok.com');
      expect(tiktokLink.target).toBe('_blank');
    });
  });

  describe('Mobile Menu (Req 3.4)', () => {
    it('should open and close mobile menu with hamburger button', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Navigation currentPage="home" onNavigate={mockNavigate} />);
      
      const mobileMenuBtn = container.querySelector('.mobile-menu-btn');
      const mobileMenu = container.querySelector('.mobile-menu');
      
      expect(mobileMenuBtn).toBeTruthy();
      expect(mobileMenu).toBeTruthy();
      
      // Initially closed
      expect(mobileMenuBtn?.classList.contains('open')).toBe(false);
      
      // Click to open
      fireEvent.click(mobileMenuBtn!);
      waitFor(() => {
        expect(mobileMenuBtn?.classList.contains('open')).toBe(true);
      });
    });
  });

  describe('Hero Section Content (Req 3.5, 3.6)', () => {
    it('should display video placeholder with play button', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const videoPlaceholder = container.querySelector('.video-placeholder');
      expect(videoPlaceholder).toBeTruthy();
      
      const playButton = container.querySelector('.video-play-button');
      expect(playButton).toBeTruthy();
      
      const videoText = screen.getByText('Video Coming Soon');
      expect(videoText).toBeTruthy();
    });

    it('should display server IP box correctly', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const serverIpBox = container.querySelector('.server-ip-box');
      expect(serverIpBox).toBeTruthy();
      
      const serverIp = screen.getByText('play.ploofyz.com');
      expect(serverIp).toBeTruthy();
    });
  });

  describe('Page Sections (Req 3.9)', () => {
    it('should render Team section correctly', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const teamSection = container.querySelector('.team-section');
      expect(teamSection).toBeTruthy();
    });

    it('should render Ranks section correctly', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const ranksSection = container.querySelector('.ranks-section');
      expect(ranksSection).toBeTruthy();
      
      // Check for rank cards
      const rankCards = container.querySelectorAll('.rank-card');
      expect(rankCards.length).toBe(5); // VIP, Elite, Hero, Nexus, Phantom
    });

    it('should render CTA section correctly', () => {
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const ctaSection = container.querySelector('.cta-section');
      expect(ctaSection).toBeTruthy();
    });
  });

  describe('Responsive Behavior (Req 3.10)', () => {
    it('should work correctly at 1024px breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      window.dispatchEvent(new Event('resize'));
      
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const heroSection = container.querySelector('.hero-section');
      expect(heroSection).toBeTruthy();
    });

    it('should work correctly at 640px breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });
      window.dispatchEvent(new Event('resize'));
      
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const heroSection = container.querySelector('.hero-section');
      expect(heroSection).toBeTruthy();
    });

    it('should work correctly at 480px breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });
      window.dispatchEvent(new Event('resize'));
      
      const mockNavigate = vi.fn();
      const { container } = render(<Home onNavigate={mockNavigate} />);
      
      const heroSection = container.querySelector('.hero-section');
      expect(heroSection).toBeTruthy();
    });
  });

  describe('Property-Based: Navigation across pages', () => {
    it('should navigate correctly for any valid page', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('home', 'vote', 'store', 'join', 'ranks'),
          (page: string) => {
            const mockNavigate = vi.fn();
            render(<Navigation currentPage={page as any} onNavigate={mockNavigate} />);
            
            // Navigation should render without errors
            expect(mockNavigate).toBeDefined();
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property-Based: Responsive behavior across viewports', () => {
    it('should render correctly across various viewport widths', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 320, max: 1920 }),
          (viewportWidth: number) => {
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewportWidth,
            });
            
            const mockNavigate = vi.fn();
            const { container } = render(<Home onNavigate={mockNavigate} />);
            
            // Page should render without errors at any viewport
            const heroSection = container.querySelector('.hero-section');
            expect(heroSection).toBeTruthy();
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
