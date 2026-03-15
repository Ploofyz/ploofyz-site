import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { ThumbnailIndicator } from './ThumbnailIndicator';

describe('ThumbnailIndicator', () => {
  const defaultProps = {
    avatarSrc: '/images/team/test-avatar.png',
    initials: 'TM',
    roleColor: '#ec4899',
    alt: 'Test Member',
    isActive: false,
    onClick: vi.fn(),
    index: 0
  };

  it('renders with correct image and alt text when avatarSrc is provided', () => {
    render(<ThumbnailIndicator {...defaultProps} />);

    const image = screen.getByAltText('Test Member');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/team/test-avatar.png');
  });

  it('renders initials placeholder when avatarSrc is empty', () => {
    const { container } = render(
      <ThumbnailIndicator {...defaultProps} avatarSrc="" />
    );

    const placeholder = container.querySelector('.thumbnail-indicator__initials-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder?.querySelector('span')?.textContent).toBe('TM');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies active styling when isActive is true', () => {
    const { container } = render(
      <ThumbnailIndicator {...defaultProps} isActive={true} />
    );

    const button = container.querySelector('.thumbnail-indicator');
    expect(button).toHaveClass('thumbnail-indicator--active');
  });

  it('does not apply active styling when isActive is false', () => {
    const { container } = render(
      <ThumbnailIndicator {...defaultProps} isActive={false} />
    );

    const button = container.querySelector('.thumbnail-indicator');
    expect(button).not.toHaveClass('thumbnail-indicator--active');
  });

  it('applies roleColor as border color when active', () => {
    const { container } = render(
      <ThumbnailIndicator {...defaultProps} isActive={true} roleColor="#ff0000" />
    );

    const button = container.querySelector('.thumbnail-indicator') as HTMLElement;
    expect(button.style.borderColor).toBe('rgb(255, 0, 0)');
  });

  it('does not apply inline border color when not active', () => {
    const { container } = render(
      <ThumbnailIndicator {...defaultProps} isActive={false} roleColor="#ff0000" />
    );

    const button = container.querySelector('.thumbnail-indicator') as HTMLElement;
    expect(button.style.borderColor).toBe('');
  });

  it('has aria-current="true" when active', () => {
    render(<ThumbnailIndicator {...defaultProps} isActive={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-current', 'true');
  });

  it('has aria-current="false" when not active', () => {
    render(<ThumbnailIndicator {...defaultProps} isActive={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-current', 'false');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ThumbnailIndicator {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when touch event is triggered', () => {
    const handleClick = vi.fn();

    render(<ThumbnailIndicator {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.touchEnd(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents default behavior on touch events', () => {
    const handleClick = vi.fn();

    render(<ThumbnailIndicator {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    const touchEvent = new TouchEvent('touchend', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault');
    
    fireEvent(button, touchEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('includes slide number in aria-label', () => {
    render(<ThumbnailIndicator {...defaultProps} index={3} />);

    const button = screen.getByRole('button', { name: 'Test Member - Slide 4' });
    expect(button).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    render(<ThumbnailIndicator {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('handles multiple clicks correctly', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ThumbnailIndicator {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('handles hover state without errors', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<ThumbnailIndicator {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    
    await user.hover(button);
    
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ThumbnailIndicator {...defaultProps} />);

    const button = container.querySelector('.thumbnail-indicator');
    const image = container.querySelector('.thumbnail-indicator__avatar');

    expect(button).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
});
