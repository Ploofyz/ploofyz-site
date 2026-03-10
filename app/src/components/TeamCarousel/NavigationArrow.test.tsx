import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationArrow } from './NavigationArrow';

describe('NavigationArrow', () => {
  it('renders with correct aria-label', () => {
    render(
      <NavigationArrow
        direction="prev"
        onClick={() => {}}
        disabled={false}
        ariaLabel="Previous slide"
      />
    );

    const button = screen.getByRole('button', { name: 'Previous slide' });
    expect(button).toBeInTheDocument();
  });

  it('renders left chevron for prev direction', () => {
    const { container } = render(
      <NavigationArrow
        direction="prev"
        onClick={() => {}}
        disabled={false}
        ariaLabel="Previous slide"
      />
    );

    expect(container.querySelector('.navigation-arrow--prev')).toBeInTheDocument();
  });

  it('renders right chevron for next direction', () => {
    const { container } = render(
      <NavigationArrow
        direction="next"
        onClick={() => {}}
        disabled={false}
        ariaLabel="Next slide"
      />
    );

    expect(container.querySelector('.navigation-arrow--next')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <NavigationArrow
        direction="next"
        onClick={handleClick}
        disabled={false}
        ariaLabel="Next slide"
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <NavigationArrow
        direction="next"
        onClick={handleClick}
        disabled={true}
        ariaLabel="Next slide"
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has disabled attribute when disabled prop is true', () => {
    render(
      <NavigationArrow
        direction="next"
        onClick={() => {}}
        disabled={true}
        ariaLabel="Next slide"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles hover state without errors', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <NavigationArrow
        direction="next"
        onClick={handleClick}
        disabled={false}
        ariaLabel="Next slide"
      />
    );

    const button = screen.getByRole('button');
    
    // Hover over the button
    await user.hover(button);
    
    // Button should still be in the document and functional
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    
    // Click should still work after hover
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles unhover state without errors', async () => {
    const user = userEvent.setup();

    render(
      <NavigationArrow
        direction="prev"
        onClick={() => {}}
        disabled={false}
        ariaLabel="Previous slide"
      />
    );

    const button = screen.getByRole('button');
    
    // Hover and unhover
    await user.hover(button);
    await user.unhover(button);
    
    // Button should still be functional
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
