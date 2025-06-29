import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { Lock, Play, CheckCircle, FileText, Download, User } from 'lucide-react';

interface TrialChapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  video_id: string | null;
  is_locked: boolean;
  order_position: number;
}

const TrialPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [trialChapters, setTrialChapters] = useState<TrialChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<TrialChapter | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialChapters();
  }, []);

  const fetchTrialChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('trial_chapters')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) throw error;

      setTrialChapters(data || []);
      
      // Set first unlocked chapter as selected
      const firstUnlocked = data?.find(chapter => !chapter.is_locked);
      if (firstUnlocked) {
        setSelectedChapter(firstUnlocked);
      }
    } catch (error) {
      console.error('Error fetching trial chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = (chapter: TrialChapter) => {
    if (!chapter.is_locked) {
      setSelectedChapter(chapter);
    }
  };

  const handleChapterComplete = () => {
    const unlockedChapters = trialChapters.filter(chapter => !chapter.is_locked);
    const progressIncrement = 100 / unlockedChapters.length;
    const newProgress = Math.min(progress + progressIncrement, 100);
    setProgress(newProgress);
  };

  const unlockedChapters = trialChapters.filter(c => !c.is_locked);
  const lockedChapters = trialChapters.filter(c => c.is_locked);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            {user ? (
              <Link to="/dashboard" className="flex items-center text-white hover:text-primary transition-colors">
                <User size={20} className="mr-2" />
                {profile?.full_name || 'Dashboard'}
              </Link>
            ) : (
              <Link to="/signup">
                <Button variant="primary" size="sm" glowing>Sign Up Free</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-dark-light rounded-xl overflow-hidden shadow-lg">
              {selectedChapter?.video_id ? (
                <YouTubeEmbed videoId={selectedChapter.video_id} />
              ) : (
                <div className="aspect-video bg-dark-lighter flex flex-col items-center justify-center">
                  <Lock size={48} className="text-gray-500 mb-4" />
                  <p className="text-gray-400 text-center px-4">
                    {selectedChapter ? 'This content is available in the full course' : 'Select a chapter to start watching'}
                  </p>
                </div>
              )}
            </div>
            
            {selectedChapter && (
              <div className="mt-6">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedChapter.title}</h1>
                <p className="text-gray-300 mb-4">{selectedChapter.description}</p>
                
                {!selectedChapter.is_locked ? (
                  <Button onClick={handleChapterComplete} className="w-full">
                    Mark as Complete
                  </Button>
                ) : (
                  <div className="bg-dark-light rounded-lg p-4 text-center">
                    <Lock className="mx-auto mb-2 text-primary" size={24} />
                    <p className="text-white font-medium mb-2">Unlock Full Course</p>
                    <p className="text-gray-400 text-sm mb-4">
                      Get access to all chapters, advanced techniques, and career guidance
                    </p>
                    <Link to="/signup">
                      <Button variant="primary" glowing>
                        Get Full Access
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Course Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Free Trial Chapters</h2>
              <span className="text-sm text-gray-400">
                {unlockedChapters.length} free chapters
              </span>
            </div>
            
            {/* Free Chapters */}
            <div className="bg-dark-light rounded-lg overflow-hidden">
              <div className="p-4 bg-green-500/10 border-b border-green-500/20">
                <h3 className="text-green-500 font-medium flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Free Access
                </h3>
              </div>
              <div>
                {unlockedChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`p-4 transition-all cursor-pointer border-b border-dark-lighter last:border-b-0 ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-primary bg-opacity-10 border-l-4 border-l-primary'
                        : 'hover:bg-dark-lighter'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Play size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm leading-tight">
                          {chapter.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {chapter.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Chapters Preview */}
            {lockedChapters.length > 0 && (
              <div className="bg-dark-light rounded-lg overflow-hidden">
                <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/20">
                  <h3 className="text-yellow-500 font-medium flex items-center">
                    <Lock size={16} className="mr-2" />
                    Premium Content ({lockedChapters.length} chapters)
                  </h3>
                </div>
                <div>
                  {lockedChapters.slice(0, 3).map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-4 opacity-75 border-b border-dark-lighter last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <Lock size={18} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm leading-tight">
                            {chapter.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {chapter.duration}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">
                            Premium
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {lockedChapters.length > 3 && (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      +{lockedChapters.length - 3} more premium chapters
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Upgrade CTA */}
            <div className="mt-8 bg-gradient-to-r from-primary to-red-600 rounded-lg p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Master Premiere Pro?</h3>
              <p className="text-white text-sm mb-4 opacity-90">
                Unlock all {lockedChapters.length} premium chapters, get lifetime access, and start your video editing career today!
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center text-white text-sm">
                  <CheckCircle size={14} className="mr-2" />
                  26 Total Lessons
                </div>
                <div className="flex items-center justify-center text-white text-sm">
                  <CheckCircle size={14} className="mr-2" />
                  5 Weeks of Content
                </div>
                <div className="flex items-center justify-center text-white text-sm">
                  <CheckCircle size={14} className="mr-2" />
                  Lifetime Access
                </div>
              </div>
              <Link to="/signup">
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                  Get Full Course Access - ₹9,999
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPage;