/**
 * TypeScript interfaces and types for the TeamCarousel component
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarSrc: string;
  fullBodySrc: string;
  roleColor: string;
}

export interface CinematicSlide {
  type: 'cinematic';
  imageSrc: string;
  alt: string;
}

export interface ProfileSlide {
  type: 'profile';
  member: TeamMember;
}

export type CarouselSlide = CinematicSlide | ProfileSlide;
