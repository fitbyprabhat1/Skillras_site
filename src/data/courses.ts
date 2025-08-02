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
  instructorBio?: string; // instructor biography
  instructorImage?: string; // instructor profile image
  skills?: string[]; // array of skills covered in the course
  courseQuote?: string; // inspirational quote or tagline for the course
  modules: CourseModule[];
  category: string; // primary category
  categories?: string[]; // multiple categories for related courses
  comingSoon?: boolean; // Add this line
}

const courses: Record<string, CourseData> = {
  'Dhruv-Rathee': {
    id: 'Dhruv-Rathee',
    name: 'Dhruv Rathee YouTube MasterClass',
    description: "Dhruv Rathee Content Creation Course: Video Editing and Production for Earning This comprehensive course is designed to teach video editing and production techniques inspired by successful Indian YouTuber Dhruv Rathee's content creation methodology, combined with practical monetization strategies for aspiring content creators. Course Overview The creator economy has experienced explosive growth, with market valuation reaching over $250 billion in 2024 and projected to hit $528.39 billion by 2030. YouTube alone contributed $55 billion to the U.S. GDP in 2024, supporting 490,000 full-time equivalent jobs. This course capitalizes on this booming industry by teaching students how to create engaging content while building sustainable income streams. About Dhruv Rathee's Content Style Dhruv Rathee, born on October 8, 1994, in Rohtak, Haryana, is a prominent Indian YouTuber with over 34 million subscribers across his channels and approximately 6 billion total views. With a bachelor's degree in Mechanical Engineering and a master's in Renewable Energy from Karlsruhe Institute of Technology, Germany, Rathee has built his reputation through fact-based analyses of political, social, and environmental issues. His content is characterized by crisp cuts, news-style visuals, engaging storytelling techniques, and the strategic use of green screen technology, B-roll footage, motion graphics, and professional sound design. Rathee's editing style emphasizes clear narrative structure, seamless transitions, and accessible explanations of complex topics, making him one of the most influential content creators in the Indian digital space. Module 1: Foundation of Video Production Content Strategy and Planning Understanding Dhruv Rathee's research methodology and fact-checking processes Content ideation based on trending topics and audience interests Scriptwriting techniques for educational and analytical content Storyboarding and narrative structure development Equipment and Setup Essentials Students learn to create professional-quality videos using budget-friendly equipment, following the principle that technical expertise matters more than expensive gear. The module covers camera selection, lighting fundamentals, audio recording techniques, and green screen setup similar to Rathee's production style. Module 2: Professional Video Editing Techniques Software Mastery The course provides comprehensive training in industry-standard editing software including Adobe Premiere Pro, After Effects, Photoshop, and Audition. Students master timeline editing, multi-camera sequences, advanced trimming techniques, and speed ramping effects. Dhruv Rathee's Signature Editing Style Green screen (chroma key) techniques for background replacement B-roll integration and visual storytelling methods Motion graphics creation using smooth transitions like film burn and ink matte effects Color grading and correction for professional visual consistency Sound design incorporating whoosh effects, risers, and emotional audio cues Advanced Post-Production Skills Multi-track audio mixing and noise reduction Visual effects and compositing techniques Title creation and typography design Export optimization for different platforms and devices Module 3: Content Creation Workflow Production Planning Students learn the complete video production workflow from pre-production planning to final delivery. This includes equipment setup, recording techniques, file organization, and project management strategies used by successful creators. Editing Process Breakdown Timeline organization and media management Cutting techniques and pacing strategies Transition creation and motion graphics implementation Audio synchronization and mixing Color correction and visual enhancement Final review and quality assurance Module 4: Monetization Strategies and Earning Potential Multiple Revenue Streams The course teaches diverse monetization approaches including advertising revenue, brand partnerships, affiliate marketing, merchandise sales, and subscription models. Students learn that approximately 68.8% of creators rely on brand deals as their primary revenue source, while 7.3% focus on ad share revenue. Platform-Specific Monetization YouTube Partner Program optimization and ad revenue maximization Sponsorship negotiation and brand collaboration strategies Patreon and subscription-based content models Merchandise development and sales techniques Affiliate marketing implementation Business Development Skills Students explore advanced monetization techniques including creating premium content, developing online courses, offering consultation services, and building personal brands that command higher rates for partnerships and collaborations. Module 5: Growth and Analytics YouTube Algorithm Mastery Based on Dhruv Rathee's success strategies, students learn content optimization techniques including thumbnail design, title creation, SEO implementation, and audience retention strategies. The course covers how to leverage analytics for continuous improvement and growth. Audience Engagement Techniques Community building and interaction strategies Content calendar planning and consistency maintenance Cross-platform promotion and social media integration Audience feedback incorporation and adaptation methods Module 6: Professional Development Industry Skills and Portfolio Building Students create a comprehensive portfolio showcasing various editing styles and content types. The course emphasizes developing transferable skills applicable to film production, television, advertising, and digital marketing industries. Career Pathways The program explores various career opportunities including freelance video editing, content creation agencies, production companies, and independent creator entrepreneurship. With video editing professionals earning average salaries ranging from Rs. 3-9 LPA in India, the course prepares students for immediate employment or independent business development. Course Delivery and Certification Learning Format The course combines theoretical knowledge with hands-on practical exercises, project-based learning, and real-world applications. Students work with actual footage and create portfolio pieces throughout the program. Duration and Requirements The comprehensive 6-month program requires basic computer literacy and includes access to industry-standard software. Students receive certification upon completion and ongoing support for career placement and business development. Technology Integration The curriculum incorporates emerging technologies including AI-powered editing tools, automated video creation, and transcript-based editing techniques that streamline the production process and enhance creativity. This course represents a unique opportunity to learn from one of India's most successful content creators while mastering the technical and business skills necessary for success in the rapidly growing creator economy. Students graduate with both the creative abilities and entrepreneurial knowledge needed to build sustainable careers in digital content creation and video production.",
    thumbnail: 'https://i.imghippo.com/files/JcGw2401TWg.png',
    author: 'Prabhat Mahto',
    instructorBio: 'Prabhat Mahto is a renowned video editing expert with over 8 years of experience in content creation. He has helped thousands of creators master video editing and grow their YouTube channels.',
    instructorImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['Video Editing', 'YouTube Strategy', 'Content Creation', 'Camera Work', 'Sound Design', 'Motion Graphics', 'SEO Optimization'],
    courseQuote: "Dhruv Rathee, born on October 8, 1994, in Rohtak, Haryana, is a prominent Indian YouTuber with over 34 million subscribers across his channels and approximately 6 billion total views. With a bachelor's degree in Mechanical Engineering and a master's in Renewable Energy from Karlsruhe Institute of Technology, Germany, Rathee has built his reputation through fact-based analyses of political, social, and environmental issues.",
    category: 'Video Editing',
    categories: ['Video Editing', 'Content Creation', 'YouTube Strategy'],
    comingSoon: true,
    modules: [
      {
        id: 'creator-blueprint',
        title: 'Introduction to the Course',
        description: 'Understand Dhruv Rathee’s content style, niche, and branding approach.',
        chapters: [
          {
            id: 'dr-style-overview',
            title: 'Dhruv’s Introduction',
            description: 'How Dhruv structures his videos and positions his content.',
            duration: '6 minutes',
            videoId: 'YdEtZB9M-hQ',
          },
          {
            id: 'dr-content-types',
            title: 'Content Types & Strategy',
            description: 'Explore the formats he uses: documentaries, news, vlogs, explainers.',
            duration: '5 minutes',
            videoId: 'dhr123a2',
          },
          {
            id: 'dr-tone-branding',
            title: 'Tone, Voice & Branding',
            description: 'How he maintains trust, neutrality, and visual consistency.',
            duration: '6 minutes',
            videoId: 'dhr123a3',
          },
          {
            id: 'dr-platform-presence',
            title: 'Cross-Platform Presence',
            description: 'How Dhruv extends his brand across multiple platforms.',
            duration: '4 minutes',
            videoId: 'dhr123a4',
          },
        ],
      },
      {
        id: 'camera-and-setup',
        title: 'Camera & Setup Deconstructed',
        description: 'Break down his camera angles, lighting, and gear.',
        chapters: [
          {
            id: 'dr-camera-gear',
            title: 'Camera Setup & Gear',
            description: 'What camera and lighting setups he uses and budget alternatives.',
            duration: '7 minutes',
            videoId: 'dhr123b1',
          },
          {
            id: 'dr-framing',
            title: 'Framing & Angles',
            description: 'Analyze how he composes shots and uses zooms/pans.',
            duration: '5 minutes',
            videoId: 'dhr123b2',
          },
          {
            id: 'dr-lighting',
            title: 'Lighting Techniques',
            description: 'How he uses lighting to emphasize mood and focus.',
            duration: '5 minutes',
            videoId: 'dhr123b3',
          },
          {
            id: 'dr-on-location',
            title: 'Studio vs On-location',
            description: 'How he adapts setup for vlogs, travel, and interviews.',
            duration: '6 minutes',
            videoId: 'dhr123b4',
          },
        ],
      },
      {
        id: 'editing-style',
        title: 'Editing Like Dhruv (Premiere Pro & After Effects)',
        description: 'Master Dhruv’s edit pacing, animations, maps, and transitions.',
        chapters: [
          {
            id: 'dr-jump-cuts',
            title: 'Jump Cuts & Zooms',
            description: 'How Dhruv keeps attention with fast-paced cuts.',
            duration: '6 minutes',
            videoId: 'dhr123c1',
          },
          {
            id: 'dr-motion-graphics',
            title: 'Motion Graphics & Maps',
            description: 'How he uses After Effects and animated maps.',
            duration: '8 minutes',
            videoId: 'dhr123c2',
          },
          {
            id: 'dr-text-transitions',
            title: 'Text Overlays & Transitions',
            description: 'Use of titles, lower thirds, smooth transitions.',
            duration: '5 minutes',
            videoId: 'dhr123c3',
          },
          {
            id: 'dr-timeline-efficiency',
            title: 'Timeline & Efficiency Tips',
            description: 'How to edit faster like Dhruv with keyboard shortcuts & nesting.',
            duration: '6 minutes',
            videoId: 'dhr123c4',
          },
        ],
      },
      {
        id: 'sound-and-sfx',
        title: 'Sound Design & SFX',
        description: 'Explore his use of background music, sound effects, and voice tone.',
        chapters: [
          {
            id: 'dr-soundtrack',
            title: 'Background Music & Tone',
            description: 'What kind of music he uses and how it sets the tone.',
            duration: '5 minutes',
            videoId: 'dhr123d1',
          },
          {
            id: 'dr-sfx',
            title: 'SFX & Voice Processing',
            description: 'Use of effects for transitions and vocal clarity.',
            duration: '5 minutes',
            videoId: 'dhr123d2',
          },
          {
            id: 'dr-music-sync',
            title: 'Syncing Audio to Edits',
            description: 'Matching beats and cuts to music for better rhythm.',
            duration: '6 minutes',
            videoId: 'dhr123d3',
          },
          {
            id: 'dr-sound-resources',
            title: 'Free & Paid Sound Resources',
            description: 'Where to find music and sound effects like Dhruv’s.',
            duration: '4 minutes',
            videoId: 'dhr123d4',
          },
        ],
      },
      {
        id: 'templates-and-assets',
        title: 'Templates & Design Assets',
        description: 'Get insights on the graphic assets and overlays used in his videos.',
        chapters: [
          {
            id: 'dr-lower-thirds',
            title: 'Text, Titles & Lower Thirds',
            description: 'Fonts, animations, and visual identity breakdown.',
            duration: '6 minutes',
            videoId: 'dhr123e1',
          },
          {
            id: 'dr-asset-resources',
            title: 'Templates & Sources',
            description: 'Where he might get his assets and how to use them.',
            duration: '6 minutes',
            videoId: 'dhr123e2',
          },
          {
            id: 'dr-style-kit',
            title: 'Branding Asset Kit',
            description: 'Recreate his style using provided color codes, fonts, logos.',
            duration: '5 minutes',
            videoId: 'dhr123e3',
          },
          {
            id: 'dr-custom-templates',
            title: 'Creating Your Own Templates',
            description: 'How to design reusable templates for your channel.',
            duration: '7 minutes',
            videoId: 'dhr123e4',
          },
        ],
      },
      {
        id: 'yt-optimization',
        title: 'YouTube Optimization Secrets',
        description: 'Understand the algorithm, upload times, and title/tag strategies.',
        chapters: [
          {
            id: 'dr-upload-schedule',
            title: 'Upload Timing & Frequency',
            description: 'When and how often Dhruv uploads and why it matters.',
            duration: '4 minutes',
            videoId: 'dhr123f1',
          },
          {
            id: 'dr-tags-thumbnails',
            title: 'Tags, Titles & Thumbnails',
            description: 'Breakdown of his metadata, SEO, and thumbnail style.',
            duration: '6 minutes',
            videoId: 'dhr123f2',
          },
          {
            id: 'dr-algorithm-signals',
            title: 'Click-through & Watch Time',
            description: 'How he likely optimizes content for retention and CTR.',
            duration: '6 minutes',
            videoId: 'dhr123f3',
          },
          {
            id: 'dr-analytics-review',
            title: 'Reviewing Video Analytics',
            description: 'How you can study your analytics like Dhruv to improve.',
            duration: '6 minutes',
            videoId: 'dhr123f4',
          },
        ],
      },
      {
        id: 'implementation',
        title: 'Recreate & Practice',
        description: 'Apply what you’ve learned by recreating a sample Dhruv-style video.',
        chapters: [
          {
            id: 'dr-recreation',
            title: 'Your Dhruv-Style Project',
            description: 'Step-by-step guide to make a Dhruv-style video from scratch.',
            duration: '12 minutes',
            videoId: 'dhr123g1',
            downloadableResources: [
              { title: 'Sample Template Pack', url: 'https://drive.google.com/file/d/1example/view', type: 'ZIP' },
              { title: 'Video Planning Sheet', url: 'https://drive.google.com/file/d/2example/view', type: 'PDF' },
            ],
          },
          {
            id: 'dr-upload-checklist',
            title: 'Upload Checklist',
            description: 'Ensure you follow Dhruv’s strategy while uploading.',
            duration: '4 minutes',
            videoId: 'dhr123g2',
          },
          {
            id: 'dr-feedback-loop',
            title: 'Getting Feedback & Iterating',
            description: 'How to improve your video using viewer feedback.',
            duration: '5 minutes',
            videoId: 'dhr123g3',
          },
          {
            id: 'dr-bonus-tools',
            title: 'Bonus Tools & Scripts',
            description: 'Extra tools to automate or enhance your workflow.',
            duration: '5 minutes',
            videoId: 'dhr123g4',
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
    instructorBio: 'Jane Smith is a professional graphic designer with 10+ years of experience in digital design. She specializes in social media graphics, branding, and user interface design.',
    instructorImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['Graphic Design', 'Social Media Design', 'Branding', 'Typography', 'Color Theory', 'Layout Design', 'Digital Marketing'],
    courseQuote: 'Transform your creative vision into stunning visual content that captivates audiences and drives engagement across all digital platforms.',
    category: 'Design',
    categories: ['Design', 'Content Creation', 'Social Media'],
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
    instructorBio: 'Alex Lee is a motion graphics specialist with expertise in After Effects, Cinema 4D, and visual effects. He has worked on projects for major brands and film studios.',
    instructorImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['Motion Graphics', 'Visual Effects', 'Animation', '3D Design', 'Compositing', 'Keyframe Animation', 'After Effects'],
    courseQuote: 'Master the art of motion graphics and bring your creative ideas to life with professional-grade animations and visual effects.',
    category: 'Video Editing',
    categories: ['Video Editing', 'Motion Graphics', 'Visual Effects'],
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
  'video-editing-masterclass': {
    id: 'video-editing-masterclass',
    name: 'Premiere Pro Masterclass',
    description: 'Learn professional video editing techniques to create engaging content for platforms like Instagram and YouTube.',
    thumbnail: 'https://educate.io/images/video-editing-masterclass-placeholder.webp',
    author: 'Prabhat Mahto',
    instructorBio: 'Jane Doe is a seasoned video editor with over 10 years of experience creating content for social media, brands, and independent films.',
    instructorImage: 'https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['Video Editing', 'Audio Editing', 'Color Grading', 'Motion Graphics', 'Transitions', 'Speed Ramping'],
    courseQuote: 'Transform your raw footage into captivating stories with professional video editing skills.',
    category: 'Video Editing',
    categories: ['Video Editing', 'Content Creation', 'Post-Production'],
    modules: [
      {
        id: 've-module1',
        title: 'Welcome to the Masterclass',
        description: 'Introduction to the course and setup for video editing.',
        chapters: [
          {
            id: 've-welcome1',
            title: 'What You’ll Be Able to Do After 30 Days',
            description: 'Overview of skills you’ll gain in this course.',
            duration: '5 minutes',
            videoId: 'Ul45Ze-xgSU'
          },
          {
            id: 've-welcome2',
            title: 'Software + Setup + Download Links',
            description: 'Setting up your video editing software and tools.',
            duration: '6 minutes',
            videoId: 'Ul45Ze-xgSU'
          },
          {
            id: 've-welcome3',
            title: 'How to Get the Most Out of This Course',
            description: 'Tips for maximizing your learning experience.',
            duration: '4 minutes',
            videoId: 'C1bviaervb4'
          }
        ]
      },
      {
        id: 've-module2',
        title: 'Interface + Workspace Setup',
        description: 'Learn the essentials of navigating and customizing your editing workspace.',
        chapters: [
          {
            id: 've-interface1',
            title: 'Interface + Workspace Setup',
            description: 'Understanding the video editing interface and workspace.',
            duration: '8 minutes',
            videoId: 'O0-fVgbijkY'
          },
          {
            id: 've-interface2',
            title: 'Interface + Workspace Setup (Part 2)',
            description: 'Advanced workspace customization techniques.',
            duration: '7 minutes',
            videoId: 'VO4ZLwpXYxU'
          },
          {
            id: 've-interface3',
            title: 'Timeline + Tools Deep Dive',
            description: 'Exploring the timeline and editing tools in depth.',
            duration: '10 minutes',
            videoId: 'njUO84_ygo0'
          },
          {
            id: 've-interface4',
            title: 'First Edit: Trimming, Cutting, Moving Clips',
            description: 'Performing your first edit with basic techniques.',
            duration: '12 minutes',
            videoId: 'T_KQlCOIKss'
          },
          {
            id: 've-interface5',
            title: 'Adding Music & Voiceovers',
            description: 'Incorporating audio elements into your edits.',
            duration: '9 minutes',
            videoId: '6FazlYStgAY'
          },
          {
            id: 've-interface6',
            title: 'Export Settings for Instagram & YouTube',
            description: 'Optimizing export settings for social media platforms.',
            duration: '6 minutes',
            videoId: 'BtIVKxBSFVM'
          }
        ]
      },
      {
        id: 've-module3',
        title: 'Advanced Editing Techniques',
        description: 'Master advanced techniques to enhance your video projects.',
        chapters: [
          {
            id: 've-advanced1',
            title: 'Cleaning Voice Audio',
            description: 'Techniques for improving voice audio quality.',
            duration: '8 minutes',
            videoId: 'jpqETZQZ-mg'
          },
          {
            id: 've-advanced2',
            title: 'Adding Background Music + SFX',
            description: 'Enhancing videos with background music and sound effects.',
            duration: '7 minutes',
            videoId: '4jVtcGVhizg'
          },
          {
            id: 've-advanced3',
            title: 'Essential Graphics (Lower Thirds, Titles)',
            description: 'Creating professional lower thirds and titles.',
            duration: '10 minutes',
            videoId: 'NUgL7l8F3Zc'
          },
          {
            id: 've-advanced4',
            title: 'Transitions & Presets',
            description: 'Using transitions and presets to streamline editing.',
            duration: '9 minutes',
            videoId: 'zvbET6VPOAo'
          },
          {
            id: 've-advanced5',
            title: 'Color Correction + LUTs + Grading',
            description: 'Mastering color correction and grading techniques.',
            duration: '12 minutes',
            videoId: 'cHdLBsXogXU'
          },
          {
            id: 've-advanced6',
            title: 'Speed Ramping + Reverse/Slow-Mo',
            description: 'Creating dynamic speed effects in your videos.',
            duration: '8 minutes',
            videoId: 'EoF1YVB_qRA'
          }
        ]
      }
    ]
  },
  'youtube-growth': {
    id: 'youtube-growth',
    name: 'YouTube Growth Hacking',
    description: 'Grow your YouTube channel with proven strategies.',
    thumbnail: 'https://educate.io/images/666a0437eb956fcfea5f09f6_Pathway-To-Profits-min.webp',
    author: 'Priya Patel',
    instructorBio: 'Priya Patel is a YouTube growth expert who has helped hundreds of creators scale their channels from zero to millions of subscribers.',
    instructorImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['YouTube Growth', 'Content Strategy', 'SEO Optimization', 'Analytics', 'Audience Building', 'Monetization'],
    courseQuote: 'Build a thriving YouTube channel that generates consistent income and creates lasting impact in your niche.',
    category: 'Productivity',
    categories: ['Productivity', 'Content Creation', 'YouTube Strategy', 'Social Media'],
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
    instructorBio: 'Michael Chen is a data analytics expert with 15+ years of experience in business intelligence and Excel automation.',
    instructorImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    skills: ['Excel Mastery', 'Data Analysis', 'Business Intelligence', 'Automation', 'Pivot Tables', 'VBA Programming'],
    courseQuote: 'Transform raw data into actionable insights and automate your workflow to become an Excel power user.',
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
            videoId: 'dVVJPNIAcw',
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
            videoId: 'hlkqwqqVbH4',
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
            videoId: 'nuiR-lLBpGc',
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
  'new-course': {
    id: 'new-course',
    name: 'New Course Title',
    description: 'New course description.',
    thumbnail: 'https://via.placeholder.com/150',
    author: 'New Author',
    instructorBio: 'New instructor bio.',
    instructorImage: 'https://via.placeholder.com/150',
    skills: ['New Skill 1', 'New Skill 2'],
    courseQuote: 'New course quote.',
    modules: [],
    category: 'New Category',
    categories: ['New Category'],
    comingSoon: true, // This course is coming soon
  },
};

export default courses;