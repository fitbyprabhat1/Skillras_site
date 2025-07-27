// Maps package names to the list of course ids available for that package
// Example: { starter: ['premiere-pro', ...], professional: [...], enterprise: [...] }

const packageCourses: Record<string, string[]> = {
  starter: [
    'Dhruv-Rathee',
    'video-editing-masterclass',
  ],
  professional: [
    'video-editing-masterclass',
    'Dhruv-Rathee',
    'mythpat',
    'think-school',
    'magnates-media',
    'ashutosh',
    'vox',
    'nitesh',
    'techno-gamer',
    'johnny-harris',
    'iman',
    'fern',
    'ali',
    'alex-hormozi',
  ],
  enterprise: [
    'Dhruv-Rathee',
    'mythpat',
    'think-school',
    'magnates-media',
    'ashutosh',
    'vox',
    'nitesh',
    'techno-gamer',
    'johnny-harris',
    'iman',
    'fern',
    'ali',
    'alex-hormozi',
  ],
};

export default packageCourses;