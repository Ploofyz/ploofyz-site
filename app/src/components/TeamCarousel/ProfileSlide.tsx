import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FULLBODY_SLIDE_VARIANTS } from './constants';
import './ProfileSlide.css';

export interface ProfileSlideProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  fullBodySrc: string;
  roleColor: string;
  isActive?: boolean;
}

export const ProfileSlide: React.FC<ProfileSlideProps> = ({
  name,
  role,
  description,
  avatarSrc,
  fullBodySrc,
  roleColor,
  isActive,
}) => {
  const [fullBodyError, setFullBodyError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const reducedMotion = useReducedMotion();

  // Reset error states when the active slide changes
  useEffect(() => {
    setFullBodyError(false);
    setAvatarError(false);
  }, [isActive]);

  // Generate initials from name for fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderImage = () => {
    if (!fullBodyError && fullBodySrc) {
      return (
        <motion.img
          src={fullBodySrc}
          className="profile-slide__fullbody"
          alt={`${name}'s full body character`}
          onError={() => setFullBodyError(true)}
          variants={FULLBODY_SLIDE_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={reducedMotion ? { duration: 0 } : undefined}
        />
      );
    } else if (!avatarError && avatarSrc) {
      return (
        <motion.img
          src={avatarSrc}
          className="profile-slide__avatar"
          alt={name}
          onError={() => setAvatarError(true)}
          variants={FULLBODY_SLIDE_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={reducedMotion ? { duration: 0 } : undefined}
        />
      );
    } else {
      return (
        <div
          className="profile-slide__avatar-fallback"
          style={{ backgroundColor: roleColor }}
        >
          <span className="profile-slide__initials">{getInitials(name)}</span>
        </div>
      );
    }
  };

  return (
    <div className="profile-slide">
      <div className="profile-slide__card">
        {/* Left side: Text content */}
        <div className="profile-slide__content">
          <div className="profile-slide__badge" style={{ backgroundColor: roleColor }}>
            {role.toUpperCase()}
          </div>
          <h3 className="profile-slide__name">{name}</h3>
          <p className="profile-slide__description">{description}</p>
        </div>

        {/* Right side: Full-body / avatar image with slide-in animation */}
        <div className="profile-slide__image-container">
          {renderImage()}
        </div>
      </div>
    </div>
  );
};
