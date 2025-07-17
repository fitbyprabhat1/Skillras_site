// Detailed data for all courses, including modules, chapters, resources, and YouTube links

export interface CourseResource {
  title: string;
  url: string;
  type: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoId: string | null;
  downloadableResources?: CourseResource[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  chapters: CourseChapter[];
}

export interface CourseData {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // image url or local asset
  author: string; // new property for author name
  modules: CourseModule[];
}

const courses: Record<string, CourseData> = {
  'premiere-pro': {
    id: 'premiere-pro',
    name: 'Dhruv Rathee Youtube MasterClass',
    description: 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects.',
    thumbnail: 'https://i.imghippo.com/files/JcGw2401TWg.png', // update this URL as needed
    author: 'Prabhat Mahto',
    modules: [
      {
        id: 'welcome',
        title: 'Welcome & Roadmap',
        description: 'Get started and set yourself up for success.',
        chapters: [
          {
            id: 'pp-welcome',
            title: 'Welcome to Premiere Pro',
            description: 'Introduction to the course and what you will learn.',
            duration: '3 minutes',
            videoId: '8i34DE0Efec',
            downloadableResources: [
              { title: 'Course Guide', url: 'https://drive.google.com/file/d/1example/view', type: 'PDF' },
            ],
          },
        ],
      },
      {
        id: 'editing',
        title: 'Core Editing Skills',
        description: 'Learn the essential editing techniques.',
        chapters: [
          {
            id: 'pp-timeline',
            title: 'Timeline Basics',
            description: 'Master the timeline interface.',
            duration: '8 minutes',
            videoId: 'O0-fVgbijkY',
          },
        ],
      },
    ],
  },
  'canva-design': {
    id: 'canva-design',
    name: 'Canva Design Essentials',
    description: 'Create stunning graphics and social media posts with Canva.',
    thumbnail: 'https://www.imghippo.com/i/JcGw2401TWg.png',
    author: 'Jane Smith',
    modules: [
      {
        id: 'intro',
        title: 'Getting Started',
        description: 'Introduction to Canva and its interface.',
        chapters: [
          {
            id: 'canva-intro',
            title: 'Welcome to Canva',
            description: 'Overview of Canva features.',
            duration: '5 minutes',
            videoId: 'dQw4w9WgXcQ',
          },
          {
            id: 'casnva-intro',
            title: 'Welcome not to Canva',
            description: 'Overview of Canva features.',
            duration: '5 minutes',
            videoId: 'dQw4w9WgXcQ',
          },
        ],
      },
      {
        id: 'design',
        title: 'Design Basics',
        description: 'Learn to create your first design.',
        chapters: [
          {
            id: 'canva-design1',
            title: 'Your First Design',
            description: 'Step-by-step design creation.',
            duration: '10 minutes',
            videoId: 'Ul45Ze-xgSU',
            downloadableResources: [
              { title: 'Sample Templates', url: 'https://drive.google.com/file/d/2example/view', type: 'ZIP' },
            ],
          },
        ],
      },
    ],
  },
  'after-effects': {
    id: 'after-effects',
    name: 'After Effects Mastery',
    description: 'Create stunning motion graphics and visual effects.',
    thumbnail: 'https://educate.io/images/666a0437eb956fcfea5f09f6_Pathway-To-Profits-min.webp',
    author: 'Alex Lee',
    modules: [
      {
        id: 'ae-intro',
        title: 'Introduction',
        description: 'Welcome to After Effects.',
        chapters: [
          {
            id: 'ae-welcome',
            title: 'Welcome to After Effects',
            description: 'Course overview and setup.',
            duration: '4 minutes',
            videoId: 'Ul45Ze-xgSU',
          },
        ],
      },
      {
        id: 'ae-basics',
        title: 'Animation Basics',
        description: 'Learn the basics of animation.',
        chapters: [
          {
            id: 'ae-anim1',
            title: 'Keyframes & Motion',
            description: 'Understanding keyframes.',
            duration: '12 minutes',
            videoId: 'O0-fVgbijkY',
          },
        ],
      },
    ],
  },
  'youtube-growth': {
    id: 'youtube-growth',
    name: 'YouTube Growth Hacking',
    description: 'Grow your YouTube channel with proven strategies.',
    thumbnail: 'https://educate.io/images/666a0437eb956fcfea5f09f6_Pathway-To-Profits-min.webp',
    author: 'Priya Patel',
    modules: [
      {
        id: 'yt-intro',
        title: 'Getting Started',
        description: 'Introduction to YouTube growth.',
        chapters: [
          {
            id: 'yt-welcome',
            title: 'Welcome to YouTube Growth',
            description: 'Course overview and goals.',
            duration: '6 minutes',
            videoId: 'VO4ZLwpXYxU',
          },
        ],
      },
      {
        id: 'yt-content',
        title: 'Content Strategy',
        description: 'How to plan and create content.',
        chapters: [
          {
            id: 'yt-content1',
            title: 'Content Planning',
            description: 'Planning your content calendar.',
            duration: '9 minutes',
            videoId: 'njUO84_ygo0',
          },
        ],
      },
    ],
  },
  'excel': {
    id: 'excel',
    name: 'MS Excel Mastery',
    description: 'Master Microsoft Excel for data analysis and business intelligence.',
    thumbnail: 'https://educate.io/images/666a0437eb956fcfea5f09f6_Pathway-To-Profits-min.webp',
    author: 'Michael Chen',
    modules: [
      {
        id: 'excel-intro',
        title: 'Excel Basics',
        description: 'Introduction to Excel.',
        chapters: [
          {
            id: 'excel-welcome',
            title: 'Welcome to Excel',
            description: 'Course overview and setup.',
            duration: '5 minutes',
            videoId: 'BtIVKxBSFVM',
          },
        ],
      },
      {
        id: 'excel-formulas',
        title: 'Formulas & Functions',
        description: 'Learn essential formulas.',
        chapters: [
          {
            id: 'excel-formula1',
            title: 'SUM & AVERAGE',
            description: 'How to use SUM and AVERAGE.',
            duration: '8 minutes',
            videoId: '6FazlYStgAY',
            downloadableResources: [
              { title: 'Formula Sheet', url: 'https://drive.google.com/file/d/3example/view', type: 'PDF' },
            ],
          },
        ],
      },
    ],
  },
};

export default courses; 