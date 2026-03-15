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
 * Framer Motion variants for full-body image slide-in animation
 */
export const FULLBODY_SLIDE_VARIANTS = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
} as const;

/**
 * Team slides data: 1 cinematic slide + 15 profile slides
 */
export const TEAM_SLIDES: CarouselSlide[] = [
  {
    type: 'cinematic',
    imageSrc: '/images/team/ploofyz-group.png',
    alt: 'Ploofyz team members together in a scenic Minecraft setting'
  },
  {
    type: 'profile',
    member: {
      id: 'ploof',
      name: 'Ploofnix',
      role: 'Co-Owner',
      description: 'Cinematic masterpiece enthusiast. As the Co Owner and the Marketing Lead, I focus on creating the best visual experience for the perfect camera angles and atmosphere for the player to feel like they are in the movie.',
      avatarSrc: '/images/team/ploof-avatar.png',
      fullBodySrc: '/images/team/ploof-fullbody.png',
      roleColor: '#38b0d4ff'
    }
   },
  {
    type: 'profile',
    member: {
      id: 'ryzz',
      name: 'ADVRYZ',
      role: 'Co-Owner',
      description: 'If I was an animal, I would become a sloth or a fox? Who knows? I\'m the Co Owner of Ploofyz and I focused more towards the server side. I\'ve got some great teams with me and I hope y\'all would enjoy staying here!.',
      avatarSrc: '/images/team/ryzz-avatar.png',
      fullBodySrc: '/images/team/ryzz-fullbody.png',
      roleColor: '#8f28e2ff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'koyoto',
      name: 'TokyotoRe',
      role: 'Animator',
      description: 'I\'m one of the the Marketing Team. I mainly focus on the Animation, where all their ideas are brought to life. It is my responsibility to basically bully digital blocks into acting cinematic until my PC crying.',
      avatarSrc: '/images/team/kyoto-avatar.png',
      fullBodySrc: '/images/team/kyoto-fullbody.png',
      roleColor: '#235f88ff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'bim',
      name: 'Bibimbapqp',
      role: 'Developer',
      description: 'I\'m Bim, HR and the one handling the server\'s inner workings. Whether it\'s fixing the economy or crafting the lore you see in-game, I\'m making sire the \'Behind the Scene\' is just as epic as the \'Front Page\'.',
      avatarSrc: '/images/team/bim-avatar.png',
      fullBodySrc: '/images/team/bim-fullbody.png',
      roleColor: '#eb2424ff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'naz',
      name: 'NazeAyato',
      role: 'Developer',
      description: 'The defination of Aura. My work focuses on server stability and development to ensure the best playing experience. If I\'m not working, I would be on the server helping the player when needed.',
      avatarSrc: '/images/team/naze-avatar.png',
      fullBodySrc: '/images/team/naze-fullbody.png',
      roleColor: '#eb2424ff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'mochi',
      name: 'Mochii',
      role: 'Builder',
      description: 'Hello! I\'m Mochii. I\'m the one turning blueprints into reality. From the grand scale of Outers to the atmosphere of the lobby, I focus on the details that make our server unique. If you find a hidden detail in a corner somewhere, that was probably me.',
      avatarSrc: '/images/team/mochi-avatar.png',
      fullBodySrc: '/images/team/mochi-fullbody.png',
      roleColor: '#f3aa2bff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'kio',
      name: 'Kio',
      role: 'Builder',
      description: 'Im on of the Designem, Some of the arts that y\'all see are brought by me, I mainly focus on the Character Skins, Tools and how the stories atmosphere would be set. .',
      avatarSrc: '/images/team/kio-avatar.png',
      fullBodySrc: '/images/team/kio-fullbody.png',
      roleColor: '#e282ebff'
    }
  },
  {
    type: 'profile',
    member: {
      id: 'yuki',
      name: 'Yuki',
      role: 'Web Developer',
      description: 'My name is Yuki, a web developer who enjoys turning wild ideas into a site that looks good. I also love experimenting with the things I don\'t fully understand yet-like the wise saying goes. "Time to Gamble".',
      avatarSrc: '/images/team/yuki-avatar.png',
      fullBodySrc: '/images/team/yuki-fullbody.png',
      roleColor: '#e913deff'
    }
  }
];
