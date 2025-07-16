// Maps package names to the list of course ids available for that package
// Example: { starter: ['premiere-pro', ...], professional: [...], enterprise: [...] }

const packageCourses: Record<string, string[]> = {
  starter: [
    'premiere-pro',
    'canva-design',
  ],
  professional: [
    'premiere-pro',
    'canva-design',
    'after-effects',
    'youtube-growth',
    'excel',
  ],
  enterprise: [
    'premiere-pro',
    'canva-design',
    'after-effects',
    'youtube-growth',
    'excel',
  ],
};

export default packageCourses; 