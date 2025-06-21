import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { FileText, CheckCircle, Lock, Play, Download } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  attachments: Attachment[];
  completed: boolean;
}

interface Attachment {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
}

const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          chapters (
            id,
            title,
            description,
            video_url,
            duration,
            attachments (
              id,
              title,
              file_url,
              file_type
            )
          )
        `)
        .eq('course_id', courseId)
        .order('order_position');

      if (modulesError) throw modulesError;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('chapter_id, completed')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (progressError) throw progressError;

      const progressMap = progressData?.reduce((acc, curr) => ({
        ...acc,
        [curr.chapter_id]: curr.completed
      }), {});

      setProgress(progressMap || {});
      setModules(modulesData || []);
      if (modulesData?.[0]?.chapters?.[0]) {
        setSelectedChapter(modulesData[0].chapters[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (chapterId: string) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          chapter_id: chapterId,
          completed: true
        });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        [chapterId]: true
      }));
    } catch (error) {
      console.error('Error marking chapter as complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and Content Section */}
          <div className="lg:col-span-2">
            {selectedChapter && (
              <div>
                <div className="bg-dark-light rounded-xl overflow-hidden">
                  <YouTubeEmbed videoId={selectedChapter.video_url} />
                </div>
                
                <div className="mt-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {selectedChapter.title}
                  </h1>
                  <p className="text-gray-300 mb-6">
                    {selectedChapter.description}
                  </p>

                  {/* Attachments Section */}
                  {selectedChapter.attachments?.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-white mb-4">
                        Chapter Resources
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedChapter.attachments.map(attachment => (
                          <a
                            key={attachment.id}
                            href={attachment.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-dark-lighter rounded-lg hover:bg-dark-light transition-colors"
                          >
                            <FileText className="text-primary mr-3" />
                            <div>
                              <p className="text-white font-medium">
                                {attachment.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {attachment.file_type}
                              </p>
                            </div>
                            <Download className="ml-auto text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => markAsComplete(selectedChapter.id)}
                    className={`mt-6 w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      progress[selectedChapter.id]
                        ? 'bg-green-600 text-white'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {progress[selectedChapter.id] ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Course Navigation */}
          <div className="bg-dark-light rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Course Content</h2>
            <div className="space-y-6">
              {modules.map(module => (
                <div key={module.id}>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {module.title}
                  </h3>
                  <div className="space-y-2">
                    {module.chapters.map(chapter => (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`w-full p-4 rounded-lg transition-all ${
                          selectedChapter?.id === chapter.id
                            ? 'bg-primary bg-opacity-20 border border-primary'
                            : 'bg-dark-lighter hover:bg-dark'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {progress[chapter.id] ? (
                              <CheckCircle className="text-green-500\" size={20} />
                            ) : (
                              <Play className="text-primary" size={20} />
                            )}
                          </div>
                          <div className="text-left">
                            <h4 className="text-white font-medium">
                              {chapter.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {chapter.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;