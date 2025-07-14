import React from 'react';
import { Lock, Play, CheckCircle, FileText, Download, Crown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { useUserPackage } from '../hooks/useUserPackage';
import NavBarWithPackages from '../components/NavBarWithPackages';

interface CourseModule {
  id: number;
  title: string;
  description: string;
  chapters: CourseChapter[];
}

interface CourseChapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoId: string | null;
  isLocked: boolean;
  isCompleted: boolean;
  downloadableResources?: {
    title: string;
    url: string;
    type: string;
  }[];
}

const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Welcome & Roadmap",
    description: "Master the fundamentals and set yourself up for success",
    chapters: [
      {
        id: 1,
        title: "Welcome to Premiere Pro Mastery",
        description: "By the end of this video, you'll know exactly why this Premiere Pro Masterclass is your ticket to creating jaw-dropping videos that stand out.",
        duration: "3 minutes",
        videoId: "8i34DE0Efec",
        isLocked: false,
        isCompleted: false,
        downloadableResources: [
          {
            title: "Course Welcome Guide",
            url: "https://drive.google.com/file/d/1example/view",
            type: "PDF"
          },
          {
            title: "Sample Project Files",
            url: "https://drive.google.com/file/d/1example4/view",
            type: "ZIP"
          }
        ]
      },
      {
        id: 2,
        title: "What You'll Be Able to Do After 30 Days",
        description: "By the end of this video, you'll know exactly what badass video editing skills you'll have in just 30 days.",
        duration: "3 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResources: [
          {
            title: "30-Day Skills Guide",
            url: "https://drive.google.com/file/d/1example2/view",
            type: "PDF"
          }
        ],
      },
      {
        id: 3,
        title: "Software + Setup + Download Links",
        description: "By the end of this video, you'll know exactly how to set up Premiere Pro like a pro and hit the ground running.",
        duration: "5 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResources: [
          {
            title: "Setup & Download Guide",
            url: "https://drive.google.com/file/d/1example3/view",
            type: "PDF"
          }
        ]
      },
      {
        id: 4,
        title: "Software + Setup + Download Links",
        description: "By the end of this video, you'll know exactly how to set up Premiere Pro like a pro and hit the ground running.",
        duration: "5 minutes",
        videoId: "C1bviaervb4",
        isLocked: false,
        isCompleted: false,
        downloadableResources: [
          {
            title: "Setup & Download Guide",
            url: "https://drive.google.com/file/d/1example3/view",
            type: "PDF"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Core Editing Skills",
    description: "Learn the essential editing techniques that professionals use",
    chapters: [
      {
        id: 5,
        title: "Timeline Basics and Navigation",
        description: "Master the timeline interface and learn efficient navigation techniques.",
        duration: "8 minutes",
        videoId: "O0-fVgbijkY",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 5,
        title: "Importing and Organizing Footage",
        description: "Learn professional workflows for importing and organizing your media.",
        duration: "10 minutes",
        videoId: "VO4ZLwpXYxU",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 6,
        title: "Basic Cutting and Trimming",
        description: "Master the fundamental cutting and trimming techniques.",
        duration: "12 minutes",
        videoId: "njUO84_ygo0",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 7,
        title: "Basic Cutting and Trimming",
        description: "Master the fundamental cutting and trimming techniques.",
        duration: "12 minutes",
        videoId: "T_KQlCOIKss",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 8,
        title: "Basic Cutting and Trimming",
        description: "Master the fundamental cutting and trimming techniques.",
        duration: "12 minutes",
        videoId: "6FazlYStgAY",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 9,
        title: "Basic Cutting and Trimming",
        description: "Master the fundamental cutting and trimming techniques.",
        duration: "12 minutes",
        videoId: "BtIVKxBSFVM",
        isLocked: false,
        isCompleted: false
      }
    ]
  },
  {
    id: 3,
    title: "Advanced Techniques",
    description: "Take your editing to the next level with advanced techniques",
    chapters: [
      {
        id: 7,
        title: "Color Grading Fundamentals",
        description: "Learn the basics of color correction and grading.",
        duration: "15 minutes",
        videoId: "dQw4w9WgXcQ",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 8,
        title: "Audio Enhancement",
        description: "Clean and enhance your audio for professional results.",
        duration: "12 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 9,
        title: "Transitions and Effects",
        description: "Create smooth transitions and apply professional effects.",
        duration: "18 minutes",
        videoId: "8i34DE0Efec",
        isLocked: false,
        isCompleted: false
      }
    ]
  },
  {
    id: 4,
    title: "Professional Workflows",
    description: "Learn industry-standard workflows and best practices",
    chapters: [
      {
        id: 10,
        title: "Project Organization",
        description: "Organize your projects like a professional editor.",
        duration: "10 minutes",
        videoId: "O0-fVgbijkY",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 11,
        title: "Export Settings for Different Platforms",
        description: "Optimize your exports for various platforms and use cases.",
        duration: "15 minutes",
        videoId: "njUO84_ygo0",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 12,
        title: "Collaboration and Sharing",
        description: "Learn how to collaborate with team members and share projects.",
        duration: "12 minutes",
        videoId: "jpqETZQZ-mg",
        isLocked: false,
        isCompleted: false
      }
    ]
  }
];

const PremiereProCoursePage: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = React.useState<CourseChapter>(courseModules[0].chapters[0]);
  const [expandedModule, setExpandedModule] = React.useState<number>(1);
  const { userPackage } = useUserPackage();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Device cache for completed chapters
  const [completedChapters, setCompletedChapters] = React.useState<number[]>(() => {
    const stored = localStorage.getItem('premierepro_completed_chapters');
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('premierepro_completed_chapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  const handleChapterSelect = (chapter: CourseChapter) => {
    if (!chapter.isLocked) {
      setSelectedChapter(chapter);
    }
  };

  const handleMarkAsComplete = () => {
    if (!completedChapters.includes(selectedChapter.id)) {
      setCompletedChapters([...completedChapters, selectedChapter.id]);
    }
  };

  // Add handler to mark chapter as incomplete
  const handleMarkIncomplete = () => {
    setCompletedChapters(completedChapters.filter(id => id !== selectedChapter.id));
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? 0 : moduleId);
  };

  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank');
  };

  // Check if all chapters are completed
  const allChapterIds = courseModules.flatMap(module => module.chapters.map(ch => ch.id));
  const allCompleted = allChapterIds.every(id => completedChapters.includes(id));

  // Find flat list of all chapters
  const allChapters = courseModules.flatMap(module => module.chapters);
  const unlockedChapters = allChapters.filter(ch => !ch.isLocked);
  const currentIndex = unlockedChapters.findIndex(ch => ch.id === selectedChapter.id);
  const prevChapter = currentIndex > 0 ? unlockedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < unlockedChapters.length - 1 ? unlockedChapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      <div className="pt-20">
        {/* Mobile: Course Content Button */}
        <div className="sm:hidden flex justify-between items-center mb-4 px-4">
          <Button onClick={() => setSidebarOpen(true)} variant="outline" size="sm" className="flex items-center gap-2">
            <Menu size={20} />
            <span>Course Content</span>
          </Button>
          {/* Removed chapter title from here */}
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-2">
              <div className="bg-dark-light rounded-xl overflow-hidden shadow-lg">
                {selectedChapter.videoId ? (
                  <YouTubeEmbed videoId={selectedChapter.videoId} />
                ) : (
                  <div className="aspect-video bg-dark-lighter flex flex-col items-center justify-center">
                    <Lock size={48} className="text-gray-500 mb-4" />
                    <p className="text-gray-400 text-center px-4">
                      This content is available in the full course
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedChapter.title}</h1>
                <p className="text-gray-300 mb-4">{selectedChapter.description}</p>
                
                {/* Downloadable Resource */}
                {selectedChapter.downloadableResources && selectedChapter.downloadableResources.length > 0 && (
                  <div className="bg-dark-light rounded-lg p-4 mb-4 space-y-2">
                    {selectedChapter.downloadableResources.map((resource, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="text-primary" size={20} />
                          <div>
                            <h4 className="text-white font-medium">{resource.title}</h4>
                            <p className="text-gray-400 text-sm">{resource.type}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleDownload(resource.url, resource.title)}
                          variant="outline"
                          size="sm"
                        >
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Mark as Complete Button */}
                {!selectedChapter.isLocked && !completedChapters.includes(selectedChapter.id) && (
                  <Button onClick={handleMarkAsComplete} className="w-full">
                    Mark as Complete
                  </Button>
                )}
                {/* Completed message */}
                {!selectedChapter.isLocked && completedChapters.includes(selectedChapter.id) && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-green-500 text-center font-semibold py-2">
                    <span>Chapter Completed!</span>
                    <Button onClick={handleMarkIncomplete} variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-100">
                      Mark Incomplete
                    </Button>
                  </div>
                )}
                {/* Next/Previous Chapter Buttons - now below mark as complete area */}
                <div className="flex flex-row gap-2 mt-4 justify-between">
                  <Button
                    onClick={() => prevChapter && handleChapterSelect(prevChapter)}
                    disabled={!prevChapter}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => nextChapter && handleChapterSelect(nextChapter)}
                    disabled={!nextChapter}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
                {/* Get Certificate Button */}
                {allCompleted && (
                  <Link to="/getcertificate">
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold">
                      Get Certificate
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Course Navigation Sidebar */}
            {/* Desktop: static sidebar, Mobile: drawer */}
            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black bg-opacity-40 sm:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
            <div
              className={
                `lg:col-span-1 ` +
                `sm:static sm:translate-x-0 sm:relative ` +
                `sm:block ` +
                `fixed top-0 left-0 h-full z-50 w-4/5 max-w-xs bg-dark-light rounded-r-xl p-6 transition-transform duration-300 ` +
                `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ` +
                `sm:rounded-xl sm:p-6 sm:sticky sm:top-8 sm:h-auto sm:w-auto sm:max-w-none ` +
                `sm:shadow-none shadow-lg` +
                ` flex flex-col h-full`
              }
              style={{ boxShadow: sidebarOpen ? '0 0 0 100vmax rgba(0,0,0,0.4)' : undefined }}
            >
              {/* Close button for mobile */}
              <div className="sm:hidden flex justify-end mb-4">
                <Button onClick={() => setSidebarOpen(false)} variant="outline" size="sm">
                  <X size={24} />
                </Button>
              </div>
              <h3 className="text-white font-bold text-lg mb-4">Course Content</h3>
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 sm:max-h-none sm:overflow-y-visible">
                {courseModules.map((module) => (
                  <div key={module.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 text-left bg-dark-lighter hover:bg-dark-lightest transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{module.title}</h4>
                          <p className="text-gray-400 text-sm">{module.description}</p>
                        </div>
                        <div className="text-gray-400">
                          {expandedModule === module.id ? '−' : '+'}
                        </div>
                      </div>
                    </button>
                    {expandedModule === module.id && (
                      <div className="p-4 bg-dark-light">
                        {module.chapters.map((chapter) => {
                          const isCompleted = completedChapters.includes(chapter.id);
                          return (
                            <div
                              key={chapter.id}
                              onClick={() => {
                                handleChapterSelect(chapter);
                                setSidebarOpen(false); // close sidebar on mobile when chapter selected
                              }}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                isCompleted
                                  ? 'bg-green-900/40 border border-green-500/30'
                                  : selectedChapter.id === chapter.id
                                  ? 'bg-primary/20 border border-primary/30'
                                  : 'hover:bg-dark-lighter'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-500" />
                                ) : chapter.isLocked ? (
                                  <Lock size={16} className="text-gray-500" />
                                ) : (
                                  <Play size={16} className="text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm leading-tight">
                                  {chapter.title}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1">
                                  {chapter.duration}
                                </p>
                                {chapter.downloadableResources && chapter.downloadableResources.length > 0 && (
                                  <div className="flex items-center mt-2">
                                    <FileText size={14} className="text-primary mr-1" />
                                    <span className="text-xs text-primary">
                                      {chapter.downloadableResources.length} Resources
                                    </span>
                                  </div>
                                )}
                              </div>
                              {chapter.isLocked && (
                                <div className="flex-shrink-0">
                                  <span className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">
                                    Premium
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiereProCoursePage; 