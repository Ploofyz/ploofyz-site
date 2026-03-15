import './ThumbnailIndicator.css';

export interface ThumbnailIndicatorProps {
  avatarSrc: string;
  initials: string;
  roleColor: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export function ThumbnailIndicator({
  avatarSrc,
  initials,
  roleColor,
  alt,
  isActive,
  onClick,
  index
}: ThumbnailIndicatorProps) {
  return (
    <button
      className={`thumbnail-indicator ${isActive ? 'thumbnail-indicator--active' : ''}`}
      style={isActive ? { borderColor: roleColor } : undefined}
      onClick={onClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={`${alt} - Slide ${index + 1}`}
      aria-current={isActive ? 'true' : 'false'}
      type="button"
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={alt}
          className="thumbnail-indicator__avatar"
        />
      ) : (
        <div
          className="thumbnail-indicator__initials-placeholder"
          style={{ backgroundColor: roleColor }}
        >
          <span>{initials}</span>
        </div>
      )}
    </button>
  );
}
