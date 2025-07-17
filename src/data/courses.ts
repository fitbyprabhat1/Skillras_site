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
  category: string;
}

const courses: Record<string, CourseData> = {
  'premiere-pro': {
    id: 'premiere-pro',
    name: 'Dhruv Rathee Youtube MasterClass',
    description: 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects.',
    thumbnail: 'https://i.imghippo.com/files/JcGw2401TWg.png',
    author: 'Prabhat Mahto',
    category: 'Video Editing',
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
    category: 'Design',
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
    category: 'Video Editing',
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
    category: 'Productivity',
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
    category: 'Productivity',
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
  'mythpat': {
    id: 'mythpat',
    name: 'MythPat Gaming Content Creation',
    description: 'Learn gaming content creation and commentary techniques from MythPat style.',
    thumbnail: 'https://i.imghippo.com/files/zhtk3512lc.png',
    author: 'MythPat',
    category: 'Gaming',
    modules: [
      {
        id: 'gaming-intro',
        title: 'Getting Started',
        description: 'Introduction to gaming content creation.',
        chapters: [
          {
            id: 'mythpat-welcome',
            title: 'Welcome to Gaming Content',
            description: 'Course overview and gaming setup.',
            duration: '7 minutes',
            videoId: 'dQw4w9WgXcQ',
          },
        ],
      },
      {
        id: 'gaming-commentary',
        title: 'Commentary Techniques',
        description: 'Master the art of gaming commentary.',
        chapters: [
          {
            id: 'mythpat-commentary',
            title: 'Engaging Commentary',
            description: 'How to keep viewers engaged while gaming.',
            duration: '12 minutes',
            videoId: 'Ul45Ze-xgSU',
          },
        ],
      },
    ],
  },
  'think-school': {
    id: 'think-school',
    name: 'Think School Business Analysis',
    description: 'Learn business case studies and analytical thinking like Think School.',
    thumbnail: 'https://i.imghippo.com/files/whbS2845BU.jpg',
    author: 'Think School',
    category: 'Business',
    modules: [
      {
        id: 'business-intro',
        title: 'Business Fundamentals',
        description: 'Introduction to business analysis.',
        chapters: [
          {
            id: 'think-welcome',
            title: 'Welcome to Business Analysis',
            description: 'Course overview and analytical framework.',
            duration: '8 minutes',
            videoId: 'O0-fVgbijkY',
          },
        ],
      },
      {
        id: 'case-studies',
        title: 'Case Study Analysis',
        description: 'Learn to analyze business cases.',
        chapters: [
          {
            id: 'think-analysis',
            title: 'Case Study Framework',
            description: 'How to break down business cases.',
            duration: '15 minutes',
            videoId: 'VO4ZLwpXYxU',
          },
        ],
      },
    ],
  },
  'magnates-media': {
    id: 'magnates-media',
    name: 'Magnates Media Business Storytelling',
    description: 'Master business storytelling and documentary-style content creation.',
    thumbnail: 'https://i.imghippo.com/files/w6509Lug.jpg',
    author: 'Magnates Media',
    category: 'Business',
    modules: [
      {
        id: 'storytelling-intro',
        title: 'Storytelling Basics',
        description: 'Introduction to business storytelling.',
        chapters: [
          {
            id: 'magnates-welcome',
            title: 'Welcome to Business Storytelling',
            description: 'Course overview and storytelling principles.',
            duration: '6 minutes',
            videoId: 'njUO84_ygo0',
          },
        ],
      },
      {
        id: 'documentary-style',
        title: 'Documentary Production',
        description: 'Create documentary-style business content.',
        chapters: [
          {
            id: 'magnates-production',
            title: 'Production Techniques',
            description: 'How to produce engaging business documentaries.',
            duration: '18 minutes',
            videoId: 'BtIVKxBSFVM',
          },
        ],
      },
    ],
  },
  'ashutosh': {
    id: 'ashutosh',
    name: 'Ashutosh Educational Content',
    description: 'Learn educational content creation and teaching methodologies.',
    thumbnail: 'https://i.imghippo.com/files/THgR4824kw.jpg',
    author: 'Ashutosh',
    category: 'Education',
    modules: [
      {
        id: 'education-intro',
        title: 'Educational Content Basics',
        description: 'Introduction to educational content creation.',
        chapters: [
          {
            id: 'ashutosh-welcome',
            title: 'Welcome to Educational Content',
            description: 'Course overview and teaching principles.',
            duration: '9 minutes',
            videoId: '6FazlYStgAY',
          },
        ],
      },
      {
        id: 'teaching-methods',
        title: 'Teaching Methodologies',
        description: 'Effective teaching techniques for online content.',
        chapters: [
          {
            id: 'ashutosh-methods',
            title: 'Teaching Techniques',
            description: 'How to teach effectively through video content.',
            duration: '14 minutes',
            videoId: '8i34DE0Efec',
          },
        ],
      },
    ],
  },
  'vox': {
    id: 'vox',
    name: 'Vox Explanatory Journalism',
    description: 'Master explanatory journalism and visual storytelling like Vox.',
    thumbnail: 'https://i.imghippo.com/files/vX5139CZA.jpg',
    author: 'Vox',
    category: 'Journalism',
    modules: [
      {
        id: 'journalism-intro',
        title: 'Explanatory Journalism',
        description: 'Introduction to explanatory journalism.',
        chapters: [
          {
            id: 'vox-welcome',
            title: 'Welcome to Explanatory Journalism',
            description: 'Course overview and journalism principles.',
            duration: '7 minutes',
            videoId: 'dQw4w9WgXcQ',
          },
        ],
      },
      {
        id: 'visual-storytelling',
        title: 'Visual Storytelling',
        description: 'Create compelling visual narratives.',
        chapters: [
          {
            id: 'vox-visual',
            title: 'Visual Narrative Techniques',
            description: 'How to tell stories through visuals.',
            duration: '16 minutes',
            videoId: 'Ul45Ze-xgSU',
          },
        ],
      },
    ],
  },
  'nitesh': {
    id: 'nitesh',
    name: 'Nitesh Tech Content Creation',
    description: 'Learn tech content creation and programming tutorials.',
    thumbnail: 'https://i.imghippo.com/files/UII4895gY.jpg',
    author: 'Nitesh',
    category: 'Technology',
    modules: [
      {
        id: 'tech-intro',
        title: 'Tech Content Basics',
        description: 'Introduction to tech content creation.',
        chapters: [
          {
            id: 'nitesh-welcome',
            title: 'Welcome to Tech Content',
            description: 'Course overview and tech content principles.',
            duration: '8 minutes',
            videoId: 'O0-fVgbijkY',
          },
        ],
      },
      {
        id: 'programming-tutorials',
        title: 'Programming Tutorials',
        description: 'Create effective programming tutorials.',
        chapters: [
          {
            id: 'nitesh-programming',
            title: 'Tutorial Creation',
            description: 'How to create engaging programming tutorials.',
            duration: '13 minutes',
            videoId: 'VO4ZLwpXYxU',
          },
        ],
      },
    ],
  },
  'techno-gamer': {
    id: 'techno-gamer',
    name: 'Techno Gamer Gaming Mastery',
    description: 'Master gaming content creation and live streaming techniques.',
    thumbnail: 'https://i.imghippo.com/files/ISpy6457qJ.jpg',
    author: 'Techno Gamer',
    category: 'Gaming',
    modules: [
      {
        id: 'gaming-mastery-intro',
        title: 'Gaming Content Mastery',
        description: 'Introduction to advanced gaming content.',
        chapters: [
          {
            id: 'techno-welcome',
            title: 'Welcome to Gaming Mastery',
            description: 'Course overview and gaming content strategies.',
            duration: '10 minutes',
            videoId: 'njUO84_ygo0',
          },
        ],
      },
      {
        id: 'live-streaming',
        title: 'Live Streaming',
        description: 'Master live streaming techniques.',
        chapters: [
          {
            id: 'techno-streaming',
            title: 'Streaming Essentials',
            description: 'How to create engaging live streams.',
            duration: '17 minutes',
            videoId: 'BtIVKxBSFVM',
          },
        ],
      },
    ],
  },
  'johnny-harris': {
    id: 'johnny-harris',
    name: 'Johnny Harris Investigative Journalism',
    description: 'Learn investigative journalism and immersive storytelling techniques.',
    thumbnail: 'https://i.imghippo.com/files/ND1947yzo.jpg',
    author: 'Johnny Harris',
    category: 'Journalism',
    modules: [
      {
        id: 'investigative-intro',
        title: 'Investigative Journalism',
        description: 'Introduction to investigative journalism.',
        chapters: [
          {
            id: 'johnny-welcome',
            title: 'Welcome to Investigative Journalism',
            description: 'Course overview and investigative principles.',
            duration: '11 minutes',
            videoId: '6FazlYStgAY',
          },
        ],
      },
      {
        id: 'immersive-storytelling',
        title: 'Immersive Storytelling',
        description: 'Create immersive narrative experiences.',
        chapters: [
          {
            id: 'johnny-storytelling',
            title: 'Narrative Techniques',
            description: 'How to create compelling investigative narratives.',
            duration: '19 minutes',
            videoId: '8i34DE0Efec',
          },
        ],
      },
    ],
  },
  'iman': {
    id: 'iman',
    name: 'Iman Business & Motivation',
    description: 'Learn business strategies and motivational content creation.',
    thumbnail: 'https://i.imghippo.com/files/Kolf2917mo.jpg',
    author: 'Iman',
    category: 'Business',
    modules: [
      {
        id: 'business-motivation-intro',
        title: 'Business & Motivation',
        description: 'Introduction to business and motivational content.',
        chapters: [
          {
            id: 'iman-welcome',
            title: 'Welcome to Business Motivation',
            description: 'Course overview and business principles.',
            duration: '8 minutes',
            videoId: 'dQw4w9WgXcQ',
          },
        ],
      },
      {
        id: 'motivational-content',
        title: 'Motivational Content',
        description: 'Create inspiring and motivational content.',
        chapters: [
          {
            id: 'iman-motivation',
            title: 'Motivation Techniques',
            description: 'How to create content that motivates and inspires.',
            duration: '12 minutes',
            videoId: 'Ul45Ze-xgSU',
          },
        ],
      },
    ],
  },
  'fern': {
    id: 'fern',
    name: 'Fern Educational Documentaries',
    description: 'Master educational documentary creation and research techniques.',
    thumbnail: 'https://i.imghippo.com/files/NYdh4830HgU.jpg',
    author: 'Fern',
    category: 'Education',
    modules: [
      {
        id: 'documentary-intro',
        title: 'Educational Documentaries',
        description: 'Introduction to educational documentary creation.',
        chapters: [
          {
            id: 'fern-welcome',
            title: 'Welcome to Educational Documentaries',
            description: 'Course overview and documentary principles.',
            duration: '9 minutes',
            videoId: 'O0-fVgbijkY',
          },
        ],
      },
      {
        id: 'research-techniques',
        title: 'Research & Production',
        description: 'Master research and production techniques.',
        chapters: [
          {
            id: 'fern-research',
            title: 'Research Methods',
            description: 'How to conduct thorough research for documentaries.',
            duration: '15 minutes',
            videoId: 'VO4ZLwpXYxU',
          },
        ],
      },
    ],
  },
  'ali': {
    id: 'ali',
    name: 'Ali Productivity & Self-Development',
    description: 'Learn productivity techniques and self-development strategies.',
    thumbnail: 'https://i.imghippo.com/files/AMla1075tB.jpg',
    author: 'Ali',
    category: 'Productivity',
    modules: [
      {
        id: 'productivity-intro',
        title: 'Productivity Fundamentals',
        description: 'Introduction to productivity and self-development.',
        chapters: [
          {
            id: 'ali-welcome',
            title: 'Welcome to Productivity',
            description: 'Course overview and productivity principles.',
            duration: '7 minutes',
            videoId: 'njUO84_ygo0',
          },
        ],
      },
      {
        id: 'self-development',
        title: 'Self-Development',
        description: 'Master self-development techniques.',
        chapters: [
          {
            id: 'ali-development',
            title: 'Development Strategies',
            description: 'How to create effective self-development content.',
            duration: '13 minutes',
            videoId: 'BtIVKxBSFVM',
          },
        ],
      },
    ],
  },
  'alex-hormozi': {
    id: 'alex-hormozi',
    name: 'Alex Hormozi Business Scaling',
    description: 'Learn business scaling strategies and entrepreneurship from Alex Hormozi.',
    thumbnail: 'https://i.imghippo.com/files/CjYj6868sp.jpg',
    author: 'Alex Hormozi',
    category: 'Business',
    modules: [
      {
        id: 'scaling-intro',
        title: 'Business Scaling',
        description: 'Introduction to business scaling strategies.',
        chapters: [
          {
            id: 'hormozi-welcome',
            title: 'Welcome to Business Scaling',
            description: 'Course overview and scaling principles.',
            duration: '10 minutes',
            videoId: '6FazlYStgAY',
          },
        ],
      },
      {
        id: 'entrepreneurship',
        title: 'Entrepreneurship',
        description: 'Master entrepreneurship fundamentals.',
        chapters: [
          {
            id: 'hormozi-entrepreneur',
            title: 'Entrepreneurship Essentials',
            description: 'How to build and scale successful businesses.',
            duration: '16 minutes',
            videoId: '8i34DE0Efec',
          },
        ],
      },
    ],
  },
};

export default courses;