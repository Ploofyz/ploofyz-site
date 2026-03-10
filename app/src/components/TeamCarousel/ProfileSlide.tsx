import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AVATAR_SLIDE_VARIANTS } from './constants';
import './ProfileSlide.css';

export interface ProfileSlideProps {
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  roleColor: string;
}

export const ProfileSlide: React.FC<ProfileSlideProps> = ({
  name,
  role,
  description,
  avatarSrc,
  roleColor,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from name for fallback
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

        {/* Right side: Avatar with slide-in animation */}
        <div className="profile-slide__avatar-container">
          {imageError ? (
            <motion.div
              className="profile-slide__avatar-fallback"
              style={{ backgroundColor: roleColor }}
              variants={AVATAR_SLIDE_VARIANTS}
              initial="hidden"
              animate="visible"
            >
              <span className="profile-slide__initials">{getInitials(name)}</span>
            </motion.div>
          ) : (
            <motion.img
              src={avatarSrc}
              alt={`${name}'s Minecraft avatar`}
              className="profile-slide__avatar"
              onError={handleImageError}
              variants={AVATAR_SLIDE_VARIANTS}
              initial="hidden"
              animate="visible"
            />
          )}
        </div>
      </div>
    </div>
  );
};
