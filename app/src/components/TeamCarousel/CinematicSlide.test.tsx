import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CinematicSlide } from './CinematicSlide';

describe('CinematicSlide', () => {
  it('renders with provided image', () => {
    render(
      <CinematicSlide
        imageSrc="/images/team/group-photo.png"
        alt="Ploofyz team members together"
      />
    );

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/team/group-photo.png');
  });

  it('displays alt text on image', () => {
    render(
      <CinematicSlide
        imageSrc="/images/team/group-photo.png"
        alt="Ploofyz team members together in a scenic Minecraft setting"
      />
    );

    const image = screen.getByAltText('Ploofyz team members together in a scenic Minecraft setting');
    expect(image).toBeInTheDocument();
  });

  it('displays fallback on image load error', async () => {
    render(
      <CinematicSlide
        imageSrc="/invalid-image.png"
        alt="Team photo"
      />
    );

    const image = screen.getByRole('img');
    
    // Simulate image load error
    image.dispatchEvent(new Event('error'));

    // Wait for fallback to appear
    await waitFor(() => {
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('Meet the Ploofyz Team')).toBeInTheDocument();
    });
  });

  it('applies correct CSS class to container', () => {
    const { container } = render(
      <CinematicSlide
        imageSrc="/images/team/group-photo.png"
        alt="Team photo"
      />
    );

    expect(container.querySelector('.cinematic-slide')).toBeInTheDocument();
  });

  it('applies correct CSS class to image', () => {
    const { container } = render(
      <CinematicSlide
        imageSrc="/images/team/group-photo.png"
        alt="Team photo"
      />
    );

    expect(container.querySelector('.cinematic-slide__image')).toBeInTheDocument();
  });

  it('shows fallback gradient when image fails to load', async () => {
    const { container } = render(
      <CinematicSlide
        imageSrc="/invalid-image.png"
        alt="Team photo"
      />
    );

    const image = screen.getByRole('img');
    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(container.querySelector('.cinematic-slide__fallback')).toBeInTheDocument();
      expect(container.querySelector('.cinematic-slide__gradient')).toBeInTheDocument();
    });
  });
});
