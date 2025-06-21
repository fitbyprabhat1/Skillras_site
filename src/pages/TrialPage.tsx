import React from 'react';
import { Lock, Play, CheckCircle, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import YouTubeEmbed from '../components/YouTubeEmbed';

interface TrialModule {
  id: number;
  title: string;
  description: string;
  chapters: TrialChapter[];
}

interface TrialChapter {
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

const trialModules: TrialModule[] = [
  {
    id: 1,
    title: "Welcome & Roadmap",
    description: "Master the fundamentals and set yourself up for success",
    chapters: [
      {
        id: 1,
        title: "Welcome to the Masterclass",
        description: "By the end of this video, you'll know exactly why this Premiere Pro Masterclass is your ticket to creating jaw-dropping videos that stand out.",
        duration: "3 minutes",
        videoId: "PvTcmse6DDY",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "Course Welcome Guide",
          url: "https://drive.google.com/file/d/1example/view",
          type: "PDF"
        }
      },
      {
        id: 2,
        title: "What You'll Be Able to Do After 30 Days",
        description: "By the end of this video, you'll know exactly what badass video editing skills you'll have in just 30 days.",
        duration: "3 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "30-Day Skills Guide",
          url: "https://drive.google.com/file/d/1example2/view",
          type: "PDF"
        }
      },
      {
        id: 3,
        title: "Software + Setup + Download Links",
        description: "By the end of this video, you'll know exactly how to set up Premiere Pro like a pro and hit the ground running.",
        duration: "5 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "Setup & Download Guide",
          url: "https://drive.google.com/file/d/1example3/view",
          type: "PDF"
        }
      },
      {
        id: 4,
        title: "How to Get the Most Out of This Course",
        description: "By the end of this video, you'll know exactly how to crush this Masterclass and become a Premiere Pro pro.",
        duration: "4 minutes",
        videoId: "Ul45Ze-xgSU",
        isLocked: false,
        isCompleted: false,
        downloadableResource: {
          title: "Course Success Guide",
          url: "https://drive.google.com/file/d/1example4/view",
          type: "PDF"
        }
      }
    ]
  },
  {
    id: 2,
    title: "Premiere Pro Basics & Editing Workflow",
    description: "Master the interface and fundamental editing techniques",
    chapters: [
      {
        id: 5,
        title: "Interface + Workspace Setup",
        description: "By the end of this video, you'll know exactly how to navigate Premiere Pro's interface and set up your workspace like a pro editor.",
        duration: "8 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Interface Cheat Sheet",
          url: "https://drive.google.com/file/d/1example5/view",
          type: "PDF"
        }
      },
      {
        id: 6,
        title: "Importing Footage + Organizing Files",
        description: "By the end of this video, you'll know exactly how to import footage and organize it so you're never hunting for files mid-edit.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "File Organization Template",
          url: "https://drive.google.com/file/d/1example6/view",
          type: "ZIP"
        }
      },
      {
        id: 7,
        title: "Timeline + Tools Deep Dive",
        description: "By the end of this video, you'll know exactly how to use Premiere Pro's Timeline and tools to start editing like a pro.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Timeline Tools Guide",
          url: "https://drive.google.com/file/d/1example7/view",
          type: "PDF"
        }
      },
      {
        id: 8,
        title: "First Edit: Trimming, Cutting, Moving Clips",
        description: "By the end of this video, you'll know exactly how to trim, cut, and move clips to create your first polished edit.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Practice Clips Pack",
          url: "https://drive.google.com/file/d/1example8/view",
          type: "ZIP"
        }
      },
      {
        id: 9,
        title: "Adding Music & Voiceovers",
        description: "By the end of this video, you'll know exactly how to add music and voiceovers to make your edit feel alive.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Audio Assets Pack",
          url: "https://drive.google.com/file/d/1example9/view",
          type: "ZIP"
        }
      },
      {
        id: 10,
        title: "Export Settings for Instagram/YouTube",
        description: "By the end of this video, you'll know exactly how to export your edit for Instagram and YouTube like a pro.",
        duration: "12 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Export Presets Pack",
          url: "https://drive.google.com/file/d/1example10/view",
          type: "PRPROJ"
        }
      }
    ]
  },
  {
    id: 3,
    title: "Audio, Effects & Color",
    description: "Elevate your videos with professional audio, effects, and color grading",
    chapters: [
      {
        id: 11,
        title: "Cleaning Voice Audio",
        description: "By the end of this video, you'll know exactly how to clean up voice audio so it sounds crisp and professional.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Audio Cleanup Guide",
          url: "https://drive.google.com/file/d/1example11/view",
          type: "PDF"
        }
      },
      {
        id: 12,
        title: "Adding Background Music + SFX",
        description: "By the end of this video, you'll know exactly how to add background music and sound effects to make your video pop.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "SFX Library Pack",
          url: "https://drive.google.com/file/d/1example12/view",
          type: "ZIP"
        }
      },
      {
        id: 13,
        title: "Essential Graphics (Lower Thirds, Titles)",
        description: "By the end of this video, you'll know exactly how to create lower thirds and titles that make your video look pro.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Graphics Templates Pack",
          url: "https://drive.google.com/file/d/1example13/view",
          type: "MOGRT"
        }
      },
      {
        id: 14,
        title: "Transitions & Presets",
        description: "By the end of this video, you'll know exactly how to add smooth transitions and save presets to speed up your workflow.",
        duration: "8 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Transition Presets Pack",
          url: "https://drive.google.com/file/d/1example14/view",
          type: "PRPROJ"
        }
      },
      {
        id: 15,
        title: "Color Correction + LUTs + Grading",
        description: "By the end of this video, you'll know exactly how to color correct and grade your video for that cinematic look.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Cinematic LUTs Pack",
          url: "https://drive.google.com/file/d/1example15/view",
          type: "ZIP"
        }
      },
      {
        id: 16,
        title: "Speed Ramping + Reverse/Slow-Mo",
        description: "By the end of this video, you'll know exactly how to use speed ramping, reverse, and slow-mo for epic, dynamic edits.",
        duration: "12 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Speed Effects Guide",
          url: "https://drive.google.com/file/d/1example16/view",
          type: "PDF"
        }
      }
    ]
  },
  {
    id: 4,
    title: "Real-World Projects",
    description: "Apply your skills to create professional content for social media and clients",
    chapters: [
      {
        id: 17,
        title: "Instagram Reel: Hook + Cut + Music + Text",
        description: "Build a 15-second Reel with a 2-second hook, tight cuts synced to music beats, and animated text overlays.",
        duration: "20 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Reel Project Files",
          url: "https://drive.google.com/file/d/1example17/view",
          type: "ZIP"
        }
      },
      {
        id: 18,
        title: "YouTube Vlog Edit: B-roll, Audio, Color",
        description: "Edit a 1:30 vlog with talking head footage, B-roll clips, cleaned audio, and professional color grading.",
        duration: "25 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Vlog Project Files",
          url: "https://drive.google.com/file/d/1example18/view",
          type: "ZIP"
        }
      },
      {
        id: 19,
        title: "Ad/Promo Video for Client",
        description: "Create a 30-second ad with hook, product shots, call-to-action text, and layered audio for client delivery.",
        duration: "20 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Ad Project Files",
          url: "https://drive.google.com/file/d/1example19/view",
          type: "ZIP"
        }
      },
      {
        id: 20,
        title: "Podcast/Interview Cut + Vertical Repurpose",
        description: "Edit a 1-minute interview with multicam switches and repurpose a 15-second quote as a vertical Reel.",
        duration: "15 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Interview Project Files",
          url: "https://drive.google.com/file/d/1example20/view",
          type: "ZIP"
        }
      },
      {
        id: 21,
        title: "Creating YouTube Thumbnails in Canva",
        description: "Design eye-catching thumbnails in Canva with bold text, arrows, and face cutouts for maximum click-through rates.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Thumbnail Templates",
          url: "https://drive.google.com/file/d/1example21/view",
          type: "ZIP"
        }
      }
    ]
  },
  {
    id: 5,
    title: "Freelancing & Getting Clients",
    description: "Turn your video editing skills into a profitable freelance career",
    chapters: [
      {
        id: 22,
        title: "How to Build a Powerful Portfolio",
        description: "Select your best projects and create a professional portfolio website that attracts high-paying clients.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Portfolio Template Kit",
          url: "https://drive.google.com/file/d/1example22/view",
          type: "ZIP"
        }
      },
      {
        id: 23,
        title: "Pricing Your First Projects",
        description: "Learn to price your video editing services competitively while ensuring profitable rates for different project types.",
        duration: "5 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Pricing Calculator",
          url: "https://drive.google.com/file/d/1example23/view",
          type: "XLSX"
        }
      },
      {
        id: 24,
        title: "Where to Get Clients: IG, Upwork, Referrals",
        description: "Discover the best platforms and strategies to find your first clients and build a steady stream of work.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Client Hunting Guide",
          url: "https://drive.google.com/file/d/1example24/view",
          type: "PDF"
        }
      },
      {
        id: 25,
        title: "Outreach Scripts + Client Pitch Strategy",
        description: "Master proven outreach scripts and pitch strategies that convert prospects into paying clients consistently.",
        duration: "15 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Outreach Templates Pack",
          url: "https://drive.google.com/file/d/1example25/view",
          type: "DOCX"
        }
      },
      {
        id: 26,
        title: "Final Delivery + Revisions Process",
        description: "Learn professional delivery methods, revision handling, invoicing, and client retention strategies.",
        duration: "10 minutes",
        videoId: null,
        isLocked: true,
        isCompleted: false,
        downloadableResource: {
          title: "Client Management Kit",
          url: "https://drive.google.com/file/d/1example26/view",
          type: "ZIP"
        }
      }
    ]
  }
];

const TrialPage: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = React.useState<TrialChapter>(trialModules[0].chapters[0]);
  const [progress, setProgress] = React.useState(0);
  const [expandedModule, setExpandedModule] = React.useState<number>(1);

  const handleChapterSelect = (chapter: TrialChapter) => {
    if (!chapter.isLocked) {
      setSelectedChapter(chapter);
    }
  };

  const handleChapterComplete = () => {
    const totalChapters = trialModules.reduce((acc, module) => acc + module.chapters.length, 0);
    const unlockedChapters = trialModules.reduce((acc, module) => 
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

  return (
    <div className="min-h-screen bg-dark">
      <nav className="bg-dark-light p-4 border-b border-dark-lighter">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">SkillRas</Link>
          <div className="flex items-center gap-4">
            <div className="text-white">
              Progress: {Math.round(progress)}%
              <div className="w-32 h-2 bg-dark rounded-full mt-1">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Link to="/">
              <Button variant="primary" size="sm" glowing>Upgrade Now</Button>
            </Link>
          </div>
        </div>
      </nav>

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
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <FileText className="mr-2 text-primary" size={20} />
                    Chapter Resources
                  </h3>
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                      selectedChapter.isLocked 
                        ? 'bg-dark-lighter opacity-50' 
                        : 'bg-dark-lighter hover:bg-dark'
                    }`}
                    onClick={() => !selectedChapter.isLocked && handleDownload(
                      selectedChapter.downloadableResource!.url, 
                      selectedChapter.downloadableResource!.title
                    )}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {selectedChapter.downloadableResource.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          {selectedChapter.downloadableResource.type} File
                        </p>
                      </div>
                    </div>
                    {selectedChapter.isLocked ? (
                      <Lock className="text-gray-500" size={20} />
                    ) : (
                      <Download className="text-primary hover:text-primary-light transition-colors" size={20} />
                    )}
                  </div>
                </div>
              )}
              
              {!selectedChapter.isLocked && (
                <Button onClick={handleChapterComplete} className="w-full">
                  Mark as Complete
                </Button>
              )}
              
              {selectedChapter.isLocked && (
                <div className="bg-dark-light rounded-lg p-4 text-center">
                  <Lock className="mx-auto mb-2 text-primary" size={24} />
                  <p className="text-white font-medium mb-2">Unlock Full Course</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Get access to all modules, advanced techniques, and career guidance
                  </p>
                  <Link to="/">
                    <Button variant="primary" glowing>
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Course Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Course Modules</h2>
              <span className="text-sm text-gray-400">
                {trialModules.reduce((acc, module) => acc + module.chapters.filter(c => !c.isLocked).length, 0)} free chapters
              </span>
            </div>
            
            {trialModules.map((module) => (
              <div key={module.id} className="bg-dark-light rounded-lg overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-dark-lighter transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{module.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="mr-3">{module.chapters.length} chapters</span>
                        <span>{module.chapters.filter(c => !c.isLocked).length} free</span>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${expandedModule === module.id ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {expandedModule === module.id && (
                  <div className="border-t border-dark-lighter">
                    {module.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        onClick={() => handleChapterSelect(chapter)}
                        className={`p-4 transition-all cursor-pointer border-b border-dark-lighter last:border-b-0 ${
                          selectedChapter.id === chapter.id
                            ? 'bg-primary bg-opacity-10 border-l-4 border-l-primary'
                            : 'hover:bg-dark-lighter'
                        } ${chapter.isLocked ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0">
                            {chapter.isLocked ? (
                              <Lock size={18} className="text-gray-500" />
                            ) : chapter.isCompleted ? (
                              <CheckCircle size={18} className="text-green-500" />
                            ) : (
                              <Play size={18} className="text-primary" />
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-8 bg-gradient-to-r from-primary to-red-600 rounded-lg p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Master Premiere Pro?</h3>
              <p className="text-white text-sm mb-4 opacity-90">
                Unlock all modules, get lifetime access, and start your video editing career today!
              </p>
              <Link to="/">
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                  Get Full Course Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrialPage;