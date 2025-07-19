import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBarWithPackages from '../components/NavBarWithPackages';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { FileText, CheckCircle, Lock, Play, Download, Menu, X, BookOpen } from 'lucide-react';
import courses, { CourseModule, CourseChapter } from '../data/courses';
import Button from '../components/Button';
// import { useSEO } from '../hooks/useSEO';

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? courses[courseId] : undefined;

  // Progress tracking in localStorage
  const progressKey = `course_progress_${courseId}`;
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    const stored = localStorage.getItem(progressKey);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(completedChapters));
  }, [completedChapters, progressKey]);

  // Flatten all chapters for navigation
  const allChapters: CourseChapter[] = course
    ? course.modules.flatMap((m: CourseModule) => m.chapters)
    : [];
  // Calculate completion percentage
  const completedCount = completedChapters.length;
  const totalCount = allChapters.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const [selectedChapter, setSelectedChapter] = useState<CourseChapter | null>(
    allChapters[0] || null
  );

  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for expanded module in sidebar
  const [expandedModule, setExpandedModule] = useState<string | null>(course?.modules[0]?.id || null);

  // Prevent body scroll when sidebar is open (mobile)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (allChapters.length > 0) {
      setSelectedChapter(allChapters[0]);
    }
  }, [courseId]);

  // SEO for course page - temporarily disabled to fix rendering
  // useEffect(() => {
  //   if (course) {
  //     useSEO({
  //       title: `${course.name} - Online Course | SkillRas`,
  //       description: course.description || `Learn ${course.name} with our comprehensive online course. Master the skills you need to succeed in your career.`,
  //       keywords: `${course.name.toLowerCase()}, online course, skill development, ${course.name.toLowerCase()} tutorial, learn ${course.name.toLowerCase()}`,
  //       canonical: `https://skillras.com/course/${courseId}`
  //     });
  //   }
  // }, [course, courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Course not found.</div>
      </div>
    );
  }

  const handleMarkAsComplete = () => {
    if (selectedChapter && !completedChapters.includes(selectedChapter.id)) {
      setCompletedChapters([...completedChapters, selectedChapter.id]);
    }
  };

  const handleMarkIncomplete = () => {
    if (selectedChapter) {
      setCompletedChapters(completedChapters.filter(id => id !== selectedChapter.id));
    }
  };

  // Navigation
  const unlockedChapters = allChapters;
  const currentIndex = selectedChapter ? unlockedChapters.findIndex(ch => ch.id === selectedChapter.id) : 0;
  const prevChapter = currentIndex > 0 ? unlockedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < unlockedChapters.length - 1 ? unlockedChapters[currentIndex + 1] : null;

  // Handler for selecting a chapter (closes sidebar on mobile)
  const handleChapterSelect = (chapter: CourseChapter) => {
    setSelectedChapter(chapter);
    setSidebarOpen(false);
  };

  // Handler for toggling module expansion
  const handleToggleModule = (moduleId: string) => {
    setExpandedModule(prev => (prev === moduleId ? null : moduleId));
  };

  return (
    <div>
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-red-600/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
  </div>
      
      <NavBarWithPackages />
      {/* Mobile: Course Content Button */}
      <div className="lg:hidden flex justify-between items-center mb-4 px-4 mt-16 relative z-10">
        <Button 
          onClick={() => setSidebarOpen(true)} 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center w-12 h-12 p-0"
          title="Course Content"
        >
          <Menu size={20} />
        </Button>
        <Link to={`/broucher/${courseId}`}>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-12 h-12 p-0 flex items-center justify-center"
            title="About this Course"
          >
            <BookOpen size={20} />
          </Button>
        </Link>
      </div>
      <div className="container mx-auto px-2 sm:px-4 py-8 pt-0 sm:pt-24 relative z-10">
        {/* Progress Bar / Percentage */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-3 bg-primary rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <span className="text-white font-semibold text-sm min-w-[60px] text-right">{percentComplete}% Complete</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Video Player and Content Section */}
          <div className="lg:col-span-2">
            {selectedChapter && (
              <div>
                <div className="bg-dark-light rounded-xl overflow-hidden">
                  {selectedChapter.videoId ? (
                    <YouTubeEmbed videoId={selectedChapter.videoId} />
                  ) : (
                    <div className="aspect-video bg-dark-lighter flex flex-col items-center justify-center">
                      <Lock size={48} className="text-gray-500 mb-4" />
                      <p className="text-gray-400 text-center px-4">
                        No video for this chapter.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {selectedChapter.title}
                  </h1>
                  <p className="text-gray-300 mb-6">
                    {selectedChapter.description}
                  </p>
                  {/* Attachments Section */}
                  {selectedChapter.downloadableResources && selectedChapter.downloadableResources.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-white mb-4">
                        Chapter Resources
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedChapter.downloadableResources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-dark-lighter rounded-lg hover:bg-dark-light transition-colors"
                          >
                            <FileText className="text-primary mr-3" />
                            <div>
                              <p className="text-white font-medium">
                                {resource.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {resource.type}
                              </p>
                            </div>
                            <Download className="ml-auto text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Mark as Complete Button */}
                  {!completedChapters.includes(selectedChapter.id) && (
                    <button
                      onClick={handleMarkAsComplete}
                      className="mt-6 w-full py-3 px-6 rounded-lg font-medium transition-colors bg-primary text-white hover:bg-primary-dark"
                    >
                      Mark as Complete
                    </button>
                  )}
                  {/* Completed message */}
                  {completedChapters.includes(selectedChapter.id) && (
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-green-500 text-center font-semibold py-2">
                      <span>Chapter Completed!</span>
                      <button
                        onClick={handleMarkIncomplete}
                        className="text-red-500 border border-red-500 rounded px-3 py-1 hover:bg-red-100 ml-2"
                      >
                        Mark Incomplete
                      </button>
                    </div>
                  )}
                  {/* Next/Previous Chapter Buttons */}
                  <div className="flex flex-row gap-2 mt-4 justify-between">
                    <button
                      onClick={() => prevChapter && setSelectedChapter(prevChapter)}
                      disabled={!prevChapter}
                      className="flex-1 py-2 px-4 rounded bg-dark-lighter text-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => nextChapter && setSelectedChapter(nextChapter)}
                      disabled={!nextChapter}
                      className="flex-1 py-2 px-4 rounded bg-dark-lighter text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Course Navigation Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1 relative z-10">
            <div className="bg-dark-light rounded-xl p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Course Content</h3>
                <Link to={`/broucher/${courseId}`}> 
                  <Button size="sm" variant="outline" className="ml-2 whitespace-nowrap">About this Course</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {course.modules.map((module) => {
                  // Check if all chapters in this module are completed
                  const moduleChapters = module.chapters;
                  const completedChaptersInModule = moduleChapters.filter(chapter => 
                    completedChapters.includes(chapter.id)
                  );
                  const isModuleCompleted = completedChaptersInModule.length === moduleChapters.length;
                  
                  return (
                    <div key={module.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleToggleModule(module.id)}
                        className={`w-full p-4 text-left transition-colors ${
                          isModuleCompleted 
                            ? 'bg-green-900/40 hover:bg-green-800/50 border-l-4 border-l-green-500' 
                            : 'bg-dark-lighter hover:bg-dark-lightest'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{module.title}</h4>
                            <p className="text-gray-400 text-sm">{module.description}</p>
                            {isModuleCompleted && (
                              <div className="flex items-center mt-1">
                                <CheckCircle size={14} className="text-green-500 mr-1" />
                                <span className="text-xs text-green-400">Module Complete</span>
                              </div>
                            )}
                          </div>
                          <div className={`text-xl ${isModuleCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                            {expandedModule === module.id ? '−' : '+'}
                          </div>
                        </div>
                      </button>
                    {expandedModule === module.id && (
                      <div className="p-4 bg-dark-light space-y-2">
                        {module.chapters.map((chapter) => {
                          const isCompleted = completedChapters.includes(chapter.id);
                          return (
                            <div
                              key={chapter.id}
                              onClick={() => handleChapterSelect(chapter)}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                isCompleted
                                  ? 'bg-green-900/40 border border-green-500/30'
                                  : selectedChapter && selectedChapter.id === chapter.id
                                  ? 'bg-primary/20 border border-primary/30'
                                  : 'hover:bg-dark-lighter'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-500" />
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-dark/60 backdrop-blur border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:hidden"
          style={{ boxShadow: '2px 0 16px 0 rgba(0,0,0,0.25)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white font-bold text-lg">Course Content</h3>
              <Button 
                onClick={() => setSidebarOpen(false)} 
                variant="outline" 
                size="sm"
                className="p-2"
              >
                <X size={20} />
              </Button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {course.modules.map((module) => {
                  // Check if all chapters in this module are completed
                  const moduleChapters = module.chapters;
                  const completedChaptersInModule = moduleChapters.filter(chapter => 
                    completedChapters.includes(chapter.id)
                  );
                  const isModuleCompleted = completedChaptersInModule.length === moduleChapters.length;
                  
                  return (
                    <div key={module.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleToggleModule(module.id)}
                        className={`w-full p-4 text-left transition-colors ${
                          isModuleCompleted 
                            ? 'bg-green-900/40 hover:bg-green-800/50 border-l-4 border-l-green-500' 
                            : 'bg-dark-lighter hover:bg-dark-lightest'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{module.title}</h4>
                            <p className="text-gray-400 text-sm">{module.description}</p>
                            {isModuleCompleted && (
                              <div className="flex items-center mt-1">
                                <CheckCircle size={14} className="text-green-500 mr-1" />
                                <span className="text-xs text-green-400">Module Complete</span>
                              </div>
                            )}
                          </div>
                          <div className={`text-xl ${isModuleCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                            {expandedModule === module.id ? '−' : '+'}
                          </div>
                        </div>
                      </button>
                    {expandedModule === module.id && (
                      <div className="p-4 bg-dark-light space-y-2">
                        {module.chapters.map((chapter) => {
                          const isCompleted = completedChapters.includes(chapter.id);
                          return (
                            <div
                              key={chapter.id}
                              onClick={() => handleChapterSelect(chapter)}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                isCompleted
                                  ? 'bg-green-900/40 border border-green-500/30'
                                  : selectedChapter && selectedChapter.id === chapter.id
                                  ? 'bg-primary/20 border border-primary/30'
                                  : 'hover:bg-dark-lighter'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle size={16} className="text-green-500" />
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;