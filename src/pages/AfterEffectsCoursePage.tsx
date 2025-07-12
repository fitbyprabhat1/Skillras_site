import React from 'react';
import { Lock, Play, CheckCircle, FileText, Download, Crown } from 'lucide-react';
//import { Link } from 'react-router-dom';
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
  downloadableResource?: {
    title: string;
    url: string;
    type: string;
  };
}

const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Introduction to After Effects",
    description: "Get started with After Effects and understand the interface",
    chapters: [
      {
        id: 1,
        title: "Welcome to After Effects Mastery",
        description: "Introduction to the course and what you'll learn about motion graphics and visual effects.",
        duration: "5 minutes",
        videoId: "8i34DE0Efec",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "After Effects Setup Guide",
          url: "https://drive.google.com/file/d/1example/view",
          type: "PDF"
        }
      },
      {
        id: 2,
        title: "Interface and Workspace Setup",
        description: "Learn the After Effects interface and how to customize your workspace for efficiency.",
        duration: "8 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "Workspace Configuration",
          url: "https://drive.google.com/file/d/1example2/view",
          type: "PDF"
        }
      },
      {
        id: 3,
        title: "Project Settings and Composition",
        description: "Understanding project settings and creating your first composition.",
        duration: "10 minutes",
        videoId: "O0-fVgbijkY",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "Project Settings Guide",
          url: "https://drive.google.com/file/d/1example3/view",
          type: "PDF"
        }
      }
    ]
  },
  {
    id: 2,
    title: "Basic Animation Techniques",
    description: "Learn fundamental animation principles and keyframe techniques",
    chapters: [
      {
        id: 4,
        title: "Keyframe Animation Basics",
        description: "Master the basics of keyframe animation and easing.",
        duration: "12 minutes",
        videoId: "njUO84_ygo0",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 5,
        title: "Transform Properties",
        description: "Learn to animate position, scale, rotation, and opacity.",
        duration: "15 minutes",
        videoId: "jpqETZQZ-mg",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 6,
        title: "Graph Editor and Easing",
        description: "Master the graph editor for smooth and professional animations.",
        duration: "18 minutes",
        videoId: "dQw4w9WgXcQ",
        isLocked: false,
        isCompleted: false
      }
    ]
  },
  {
    id: 3,
    title: "Advanced Motion Graphics",
    description: "Create complex motion graphics and visual effects",
    chapters: [
      {
        id: 7,
        title: "Shape Layers and Paths",
        description: "Create and animate custom shapes and paths.",
        duration: "20 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 8,
        title: "Text Animation",
        description: "Animate text with advanced techniques and presets.",
        duration: "25 minutes",
        videoId: "8i34DE0Efec",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 9,
        title: "3D Layers and Cameras",
        description: "Work with 3D layers and camera movements.",
        duration: "30 minutes",
        videoId: "O0-fVgbijkY",
        isLocked: false,
        isCompleted: false
      }
    ]
  },
  {
    id: 4,
    title: "Effects and Compositing",
    description: "Apply effects and master compositing techniques",
    chapters: [
      {
        id: 10,
        title: "Built-in Effects",
        description: "Explore and apply After Effects built-in effects.",
        duration: "22 minutes",
        videoId: "njUO84_ygo0",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 11,
        title: "Masking and Rotoscoping",
        description: "Learn masking techniques and basic rotoscoping.",
        duration: "28 minutes",
        videoId: "jpqETZQZ-mg",
        isLocked: false,
        isCompleted: false
      },
      {
        id: 12,
        title: "Color Correction and Grading",
        description: "Apply color correction and grading in After Effects.",
        duration: "25 minutes",
        videoId: "dQw4w9WgXcQ",
        isLocked: false,
        isCompleted: false
      }
    ]
  }
];

const AfterEffectsCoursePage: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = React.useState<CourseChapter>(courseModules[0].chapters[0]);
  const [progress, setProgress] = React.useState(0);
  const [expandedModule, setExpandedModule] = React.useState<number>(1);
  const { userPackage, hasAccessToPackage } = useUserPackage();

  const handleChapterSelect = (chapter: CourseChapter) => {
    if (!chapter.isLocked) {
      setSelectedChapter(chapter);
    }
  };

  const handleChapterComplete = () => {
    const totalChapters = courseModules.reduce((acc, module) => acc + module.chapters.length, 0);
    const unlockedChapters = courseModules.reduce((acc, module) => 
      acc + module.chapters.filter(chapter => !chapter.isLocked).length, 0
    );
    const progressIncrement = 100 / unlockedChapters;
    const newProgress = Math.min(progress + progressIncrement, 100);
    setProgress(newProgress);
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? 0 : moduleId);
  };

  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank');
  };

  // Check if user has access to this course
  if (!hasAccessToPackage('professional')) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Professional Package Required</h2>
          <p className="text-gray-300 mb-4">
            This After Effects course requires the <span className="text-primary font-semibold">Professional</span> or <span className="text-primary font-semibold">Enterprise</span> package.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Upgrade your package to access this advanced motion graphics course.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/packages'}>
              View Packages
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/enroll'}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-dark-light border-b border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">After Effects Mastery</h1>
                <p className="text-gray-300">Create stunning motion graphics and visual effects</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
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
                {selectedChapter.downloadableResource && (
                  <div className="bg-dark-light rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="text-primary" size={20} />
                        <div>
                          <h4 className="text-white font-medium">{selectedChapter.downloadableResource.title}</h4>
                          <p className="text-gray-400 text-sm">{selectedChapter.downloadableResource.type}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleDownload(selectedChapter.downloadableResource!.url, selectedChapter.downloadableResource!.title)}
                        variant="outline"
                        size="sm"
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
                
                {!selectedChapter.isLocked && (
                  <Button onClick={handleChapterComplete} className="w-full">
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>

            {/* Course Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-dark-light rounded-xl p-6 sticky top-8">
                <h3 className="text-white font-bold text-lg mb-4">Course Content</h3>
                
                <div className="space-y-4">
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
                          {module.chapters.map((chapter) => (
                            <div
                              key={chapter.id}
                              onClick={() => handleChapterSelect(chapter)}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedChapter.id === chapter.id
                                  ? 'bg-primary/20 border border-primary/30'
                                  : 'hover:bg-dark-lighter'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {chapter.isCompleted ? (
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
                                {chapter.downloadableResource && (
                                  <div className="flex items-center mt-2">
                                    <FileText size={14} className="text-primary mr-1" />
                                    <span className="text-xs text-primary">
                                      {chapter.downloadableResource.type} Resource
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
                          ))}
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
    </div>
  );
};

export default AfterEffectsCoursePage; 