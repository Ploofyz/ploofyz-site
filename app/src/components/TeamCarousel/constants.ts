/**
 * Animation configuration constants for the TeamCarousel component
 */

import type { CarouselSlide } from './types';

/**
 * Fade transition configuration for slide changes
 */
export const FADE_TRANSITION = {
  duration: 600, // milliseconds
  timingFunction: 'ease-in-out',
} as const;

/**
 * Framer Motion variants for avatar slide-in animation
 */
export const AVATAR_SLIDE_VARIANTS = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: 'easeOut'
    }
  }
} as const;

/**
 * Team slides data: 1 cinematic slide + 8 profile slides
 */
export const TEAM_SLIDES: CarouselSlide[] = [
  {
    type: 'cinematic',
    imageSrc: '/images/team/group-photo.png',
    alt: 'Ploofyz team members together in a scenic Minecraft setting'
  },
  {
    type: 'profile',
    member: {
      id: 'ploof',
      name: 'Ploofnix',
      role: 'Co-Owner',
      description: 'Cinematic masterpiece enthusiast. As the Co-Owner and the Marketing Lead, I focus on creating the best visual experience for the camera angles and atmosphere for the player to feel like they are in the movie.',
      avatarSrc: '/images/team/ploof-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/ploof-avatar.png', // Head-only image for thumbnail
      roleColor: '#67bcecff' // light blue
    }
  },
  {
    type: 'profile',
    member: {
      id: 'ryzz',
      name: 'ADVRYZ',
      role: 'Co-Owner',
      description: 'If I was an animal, I would become a sloth or a fox? Who know? I\'m the Co-Owner of Ploofyz and I focused more towards the server side. I\'ve got some great teams with me and I hope y\'all would enjoy staying here!',
      avatarSrc: '/images/team/alex-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/ryzz-avatar.png', // Head-only image for thumbnail
      roleColor: '#6a3bd8ff' // purple
    }
  },
  {
    type: 'profile',
    member: {
      id: 'kyoto',
      name: 'TokyotoRe',
      role: 'Animator',
      description: 'I\'m one of the Marketing Team. I mainly focus on the Animation, where all their ideas are brought to life. It is my responsibility to basically bully digital blocks into acting cinematic until my PC stars crying.',
      avatarSrc: '/images/team/jordan-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/kyoto-avatar.png', // Head-only image for thumbnail
      roleColor: '#1e76c9ff' // blue
    }
  },
  {
    type: 'profile',
    member: {
      id: 'bim',
      name: 'Bibimbapqp',
      role: 'Developer',
      description: 'I\'m Bim, HR and the one handling the server\'s inner workings. Whether it\'s fixing the economy or crafting the lore you see in-game, I\'m making sure the \'Behind the Scenes\' is just as epic as the \'Front Page\'.',
      avatarSrc: '/images/team/sam-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/bim-avatar.png', // Head-only image for thumbnail
      roleColor: '#d1330cff' // red
    }
  },
  {
    type: 'profile',
    member: {
      id: 'naz',
      name: 'NazeAyato',
      role: 'Developer',
      description: 'The definition of Aura. My work focuses on server stability and development to ensure the best playing experience. If I\'m not working, I would be on the server helping the player when needed.',
      avatarSrc: '/images/team/taylor-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/naze-avatar.png', // Head-only image for thumbnail
      roleColor: '#d1330cff' // red
    }
  },
  {
    type: 'profile',
    member: {
      id: 'mochi',
      name: 'Mochii',
      role: 'Builder',
      description: 'Hello! I\'m Mochii. I\'m the one turning blueprints into reality. From the grand scale of Outers to the atmosphere of the lobby, I focus on the details that make our server unique. If you find a hidden detail in a corner somewhere, that was probably me.',
      avatarSrc: '/images/team/morgan-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/mochi-avatar.png', // Head-only image for thumbnail
      roleColor: '#d8a22cff' // yeeloow
    }
  },
  {
    type: 'profile',
    member: {
      id: 'kio',
      name: 'Kio',
      role: 'Builder',
      description: 'I\'m one of the Designer, Some of the arts that y\'all see are brought by me, I mainly focus on the Character Skins, Tools and how the stories atmosphere would be set.',
      avatarSrc: '/images/team/casey-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/kio-avatar.png', // Head-only image for thumbnail
      roleColor: '#df7fe7ff' // pink
    }
  },
  {
    type: 'profile',
    member: {
      id: 'yuko',
      name: 'Yuki',
      role: 'Web Developer',
      description: 'My names is Yuki, a web developer who enjoys turning wild ideas into site that looks good. I also love experimenting with the things I don\'t fully understand yet-like the wise saying goes, "Time to Gamble".',
      avatarSrc: '/images/team/riley-fullbody.png', // Full body image for profile slide
      thumbnailSrc: '/images/team/riley-avatar.png', // Head-only image for thumbnail
      roleColor: '#ee1f6fff' // dark pink
    }
  }
];
