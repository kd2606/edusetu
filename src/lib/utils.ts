import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelFromXP(xp: number) {
  const levels = [
    { threshold: 0, title: 'Novice' },
    { threshold: 100, title: 'Beginner' },
    { threshold: 300, title: 'Learner' },
    { threshold: 600, title: 'Scholar' },
    { threshold: 1000, title: 'Adept' },
    { threshold: 1500, title: 'Expert' },
    { threshold: 2500, title: 'Master' },
    { threshold: 5000, title: 'Grandmaster' },
  ];

  let currentLevel = 1;
  let title = 'Novice';

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].threshold) {
      currentLevel = i + 1;
      title = levels[i].title;
    } else {
      break;
    }
  }

  return { level: currentLevel, title };
}
