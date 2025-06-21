import React, { useState } from 'react';
import { curriculum } from '../data/courseData';
import { useInView } from '../hooks/useInView';
import { ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import YouTubeEmbed from '../components/YouTubeEmbed';

const CurriculumSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const showPreview = (videoId: string) => {
    setActivePreview(videoId);
  };

  const closePreview = () => {
    setActivePreview(null);
  };

  return (
    <section id="curriculum" className="py-20 px-4 bg-dark-light text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Course Curriculum</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive, step-by-step curriculum designed to take you from beginner to expert
          </p>
        </div>
        
        <div 
          ref={ref}
          className="space-y-6"
        >
          {curriculum.map((module, index) => (
            <div
              key={module.id}
              className={`bg-dark rounded-lg overflow-hidden transition-all duration-500 transform ${
                inView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div 
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-dark-light transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div>
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <p className="text-gray-300 mt-1">{module.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <span className="mr-4">{module.lessons.length} lessons</span>
                    <span>{module.duration}</span>
                  </div>
                </div>
                <div className="text-primary">
                  {expandedModule === module.id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
              </div>
              
              {expandedModule === module.id && (
                <div className="bg-dark-lighter p-4 animate-fadeIn">
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className="p-3 border-b border-dark-light last:border-b-0 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {lesson.previewAvailable ? (
                              <button 
                                onClick={() => showPreview(lesson.videoId!)}
                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-light transition-colors"
                              >
                                <Play size={16} className="text-white" />
                              </button>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-dark-light flex items-center justify-center">
                                <Lock size={16} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <span className="text-sm text-gray-400">{lesson.duration}</span>
                          </div>
                        </div>
                        {lesson.previewAvailable && (
                          <button 
                            onClick={() => showPreview(lesson.videoId!)} 
                            className="text-sm text-primary hover:text-primary-light transition-colors"
                          >
                            Preview
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Video Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closePreview}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
            >
              Close Preview
            </button>
            <YouTubeEmbed videoId={activePreview} className="rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
};

export default CurriculumSection;