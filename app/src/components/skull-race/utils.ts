/**
 * @author Raja Haikal
 * @description Shared utility for Skull Race components
 */

export const fmt = (date: string, short = false) =>
  new Date(date).toLocaleDateString('en-MY', {
    day: 'numeric',
    month: short ? 'short' : 'long',
    year: 'numeric',
  });
