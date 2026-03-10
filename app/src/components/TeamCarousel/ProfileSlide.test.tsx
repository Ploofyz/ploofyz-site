import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProfileSlide } from './ProfileSlide';

describe('ProfileSlide', () => {
  const defaultProps = {
    name: 'Yuki',
    role: 'Web Developer',
    description: 'Crafts beautiful web experiences with modern technologies.',
    avatarSrc: '/images/team/yuki-avatar.png',
    roleColor: '#ec4899',
  };

  describe('Profile fields rendering', () => {
    it('renders team member name', () => {
      render(<ProfileSlide {...defaultProps} />);
      
      expect(screen.getByText('Yuki')).toBeInTheDocument();
    });

    it('renders role badge with uppercase text', () => {
      render(<ProfileSlide {...defaultProps} />);
      
      expect(screen.getByText('WEB DEVELOPER')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<ProfileSlide {...defaultProps} />);
      
      expect(screen.getByText('Crafts beautiful web experiences with modern technologies.')).toBeInTheDocument();
    });

    it('renders avatar image with correct src', () => {
      render(<ProfileSlide {...defaultProps} />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', '/images/team/yuki-avatar.png');
    });

    it('applies role color to badge background', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const badge = container.querySelector('.profile-slide__badge');
      expect(badge).toHaveStyle({ backgroundColor: '#ec4899' });
    });

    it('renders all required fields together', () => {
      render(<ProfileSlide {...defaultProps} />);
      
      expect(screen.getByText('Yuki')).toBeInTheDocument();
      expect(screen.getByText('WEB DEVELOPER')).toBeInTheDocument();
      expect(screen.getByText('Crafts beautiful web experiences with modern technologies.')).toBeInTheDocument();
      expect(screen.getByAltText("Yuki's Minecraft avatar")).toBeInTheDocument();
    });
  });

  describe('Avatar animation', () => {
    it('renders avatar with motion component', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar.tagName).toBe('IMG');
    });

    it('applies correct CSS class to avatar', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const avatar = container.querySelector('.profile-slide__avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('avatar is contained in animation container', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const avatarContainer = container.querySelector('.profile-slide__avatar-container');
      expect(avatarContainer).toBeInTheDocument();
      
      const avatar = avatarContainer?.querySelector('.profile-slide__avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Fallback avatar with initials', () => {
    it('displays fallback with initials when image fails to load', async () => {
      render(<ProfileSlide {...defaultProps} />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      
      // Simulate image load error
      avatar.dispatchEvent(new Event('error'));
      
      // Wait for fallback to appear
      await waitFor(() => {
        expect(screen.queryByAltText("Yuki's Minecraft avatar")).not.toBeInTheDocument();
        expect(screen.getByText('YU')).toBeInTheDocument();
      });
    });

    it('generates correct initials from single name', async () => {
      render(<ProfileSlide {...defaultProps} name="Yuki" />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      avatar.dispatchEvent(new Event('error'));
      
      await waitFor(() => {
        expect(screen.getByText('YU')).toBeInTheDocument();
      });
    });

    it('generates correct initials from full name', async () => {
      render(<ProfileSlide {...defaultProps} name="Alex Morgan" />);
      
      const avatar = screen.getByAltText("Alex Morgan's Minecraft avatar");
      avatar.dispatchEvent(new Event('error'));
      
      await waitFor(() => {
        expect(screen.getByText('AM')).toBeInTheDocument();
      });
    });

    it('limits initials to two characters', async () => {
      render(<ProfileSlide {...defaultProps} name="John Paul Smith" />);
      
      const avatar = screen.getByAltText("John Paul Smith's Minecraft avatar");
      avatar.dispatchEvent(new Event('error'));
      
      await waitFor(() => {
        const initials = screen.getByText(/^[A-Z]{2}$/);
        expect(initials.textContent?.length).toBe(2);
      });
    });

    it('applies role color to fallback avatar background', async () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      avatar.dispatchEvent(new Event('error'));
      
      await waitFor(() => {
        const fallback = container.querySelector('.profile-slide__avatar-fallback');
        expect(fallback).toHaveStyle({ backgroundColor: '#ec4899' });
      });
    });

    it('fallback avatar has correct CSS class', async () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const avatar = screen.getByAltText("Yuki's Minecraft avatar");
      avatar.dispatchEvent(new Event('error'));
      
      await waitFor(() => {
        expect(container.querySelector('.profile-slide__avatar-fallback')).toBeInTheDocument();
      });
    });
  });

  describe('Component structure', () => {
    it('renders with correct container class', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      expect(container.querySelector('.profile-slide')).toBeInTheDocument();
    });

    it('renders card container', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      expect(container.querySelector('.profile-slide__card')).toBeInTheDocument();
    });

    it('renders content section', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      expect(container.querySelector('.profile-slide__content')).toBeInTheDocument();
    });

    it('renders name with correct class', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const name = container.querySelector('.profile-slide__name');
      expect(name).toBeInTheDocument();
      expect(name?.textContent).toBe('Yuki');
    });

    it('renders description with correct class', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      
      const description = container.querySelector('.profile-slide__description');
      expect(description).toBeInTheDocument();
      expect(description?.textContent).toBe('Crafts beautiful web experiences with modern technologies.');
    });
  });
});
