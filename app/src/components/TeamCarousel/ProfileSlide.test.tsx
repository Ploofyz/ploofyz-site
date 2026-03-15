import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProfileSlide } from './ProfileSlide';

describe('ProfileSlide', () => {
  const defaultProps = {
    name: 'Yuki',
    role: 'Web Developer',
    description: 'Crafts beautiful web experiences with modern technologies.',
    avatarSrc: '/images/team/yuki-avatar.png',
    fullBodySrc: '/images/team/yuki-fullbody.png',
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

    it('renders full-body image with correct src when provided', () => {
      render(<ProfileSlide {...defaultProps} />);
      const fullBody = screen.getByAltText("Yuki's full body character");
      expect(fullBody).toBeInTheDocument();
      expect(fullBody).toHaveAttribute('src', '/images/team/yuki-fullbody.png');
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
      expect(screen.getByAltText("Yuki's full body character")).toBeInTheDocument();
    });
  });

  describe('Full-body image rendering', () => {
    it('renders full-body image with motion component', () => {
      render(<ProfileSlide {...defaultProps} />);
      const fullBody = screen.getByAltText("Yuki's full body character");
      expect(fullBody).toBeInTheDocument();
      expect(fullBody.tagName).toBe('IMG');
    });

    it('applies correct CSS class to full-body image', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      const fullBody = container.querySelector('.profile-slide__fullbody');
      expect(fullBody).toBeInTheDocument();
    });

    it('full-body image is contained in image container', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      const imageContainer = container.querySelector('.profile-slide__image-container');
      expect(imageContainer).toBeInTheDocument();
      const fullBody = imageContainer?.querySelector('.profile-slide__fullbody');
      expect(fullBody).toBeInTheDocument();
    });

    it('falls back to avatar when fullBodySrc is empty', () => {
      render(<ProfileSlide {...defaultProps} fullBodySrc="" />);
      const avatar = screen.getByAltText('Yuki');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', '/images/team/yuki-avatar.png');
    });

    it('falls back to avatar when full-body image errors', async () => {
      render(<ProfileSlide {...defaultProps} />);
      const fullBody = screen.getByAltText("Yuki's full body character");
      fireEvent.error(fullBody);
      await waitFor(() => {
        expect(screen.queryByAltText("Yuki's full body character")).not.toBeInTheDocument();
        expect(screen.getByAltText('Yuki')).toBeInTheDocument();
      });
    });
  });

  describe('Fallback avatar with initials', () => {
    it('displays fallback with initials when both images fail', async () => {
      render(<ProfileSlide {...defaultProps} />);

      const fullBody = screen.getByAltText("Yuki's full body character");
      fireEvent.error(fullBody);

      await waitFor(() => {
        expect(screen.getByAltText('Yuki')).toBeInTheDocument();
      });

      const avatar = screen.getByAltText('Yuki');
      fireEvent.error(avatar);

      await waitFor(() => {
        expect(screen.queryByAltText('Yuki')).not.toBeInTheDocument();
        // Single-word name "Yuki" produces initial "Y"
        expect(screen.getByText('Y')).toBeInTheDocument();
      });
    });

    it('generates correct initials from single name', async () => {
      render(<ProfileSlide {...defaultProps} fullBodySrc="" name="Yuki" />);
      const avatar = screen.getByAltText('Yuki');
      fireEvent.error(avatar);
      await waitFor(() => {
        // Single-word name produces one initial
        expect(screen.getByText('Y')).toBeInTheDocument();
      });
    });

    it('generates correct initials from full name', async () => {
      render(<ProfileSlide {...defaultProps} fullBodySrc="" name="Alex Morgan" />);
      const avatar = screen.getByAltText('Alex Morgan');
      fireEvent.error(avatar);
      await waitFor(() => {
        expect(screen.getByText('AM')).toBeInTheDocument();
      });
    });

    it('limits initials to two characters', async () => {
      render(<ProfileSlide {...defaultProps} fullBodySrc="" name="John Paul Smith" />);
      const avatar = screen.getByAltText('John Paul Smith');
      fireEvent.error(avatar);
      await waitFor(() => {
        const initials = screen.getByText(/^[A-Z]{2}$/);
        expect(initials.textContent?.length).toBe(2);
      });
    });

    it('applies role color to fallback avatar background', async () => {
      const { container } = render(<ProfileSlide {...defaultProps} fullBodySrc="" />);
      const avatar = screen.getByAltText('Yuki');
      fireEvent.error(avatar);
      await waitFor(() => {
        const fallback = container.querySelector('.profile-slide__avatar-fallback');
        expect(fallback).toHaveStyle({ backgroundColor: '#ec4899' });
      });
    });

    it('fallback avatar has correct CSS class', async () => {
      const { container } = render(<ProfileSlide {...defaultProps} fullBodySrc="" />);
      const avatar = screen.getByAltText('Yuki');
      fireEvent.error(avatar);
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

    it('renders image container with correct class', () => {
      const { container } = render(<ProfileSlide {...defaultProps} />);
      expect(container.querySelector('.profile-slide__image-container')).toBeInTheDocument();
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
