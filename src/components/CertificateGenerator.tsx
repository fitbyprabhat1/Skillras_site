import React, { useState } from 'react';
import coursesData from '../data/courses';
import html2canvas from 'html2canvas';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

// Helper function to check if a course is 100% completed
const isCourseCompleted = (course: any): boolean => {
  const progressKey = `course_progress_${course.id}`;
  const completedChapters = (() => {
    try {
      const stored = localStorage.getItem(progressKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  
  const allChapters = course.modules.flatMap((m: any) => m.chapters);
  return allChapters.length > 0 && allChapters.every((ch: any) => completedChapters.includes(ch.id));
};

const NAME_TOP = '38.0%';
const NAME_LEFT = '24.7%';
const NAME_WIDTH = '50.5%';

const CertificateGenerator: React.FC = () => {
  const { user } = useAuth();
  const [course, setCourse] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const name = user?.user_metadata?.name || '';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && course) {
      setDownloading(true);
      await handleDownload();
      setDownloading(false);
      setSuccess(true);
    }
  };

  const handleDownload = async () => {
    const hiddenCert = document.createElement('div');
    hiddenCert.style.position = 'fixed';
    hiddenCert.style.left = '-9999px';
    hiddenCert.style.top = '0';
    hiddenCert.style.width = '1920px';
    hiddenCert.style.height = '1357px';
    hiddenCert.style.background = 'white';
    hiddenCert.style.zIndex = '-1';
    hiddenCert.style.overflow = 'hidden';
    hiddenCert.style.pointerEvents = 'none';
    hiddenCert.style.boxSizing = 'border-box';
    hiddenCert.innerHTML = `
      <img
        src="/Certificate828129.jpg"
        alt="Certificate Background"
        style="position:absolute; inset:0; width:1920px; height:1357px; object-fit:cover; z-index:1;" />
      <div
        style="
          position:absolute;
          top:${NAME_TOP};
          left:${NAME_LEFT};
          width:${NAME_WIDTH};
          z-index:2;
          font-size:96px;
          font-weight:600;
          color:#222;
          text-align:center;
          font-family: 'Inter', Arial, sans-serif;
          pointer-events:none;">
        ${name || '[ YOUR NAME ]'}
      </div>
      <div
        style="
          position:absolute;
          top:55%;
          left:24.7%;
          width:50.5%;
          z-index:2;
          font-size:38px;
          font-weight:500;
          color:#333;
          font-family:'Times New Roman',serif;
          text-align:center;
          pointer-events:none;">
        ${course ? `  ${course}` : ''}
      </div>
    `;
    document.body.appendChild(hiddenCert);

    const img = hiddenCert.querySelector('img');
    if (img && !img.complete) {
      await new Promise(resolve => { img.onload = resolve; });
    }

    const canvas = await html2canvas(hiddenCert, { scale: 1 });
    const link = document.createElement('a');
    link.download = `certificate-${name}-${course}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.85);
    link.click();

    document.body.removeChild(hiddenCert);
  };

  return (
    <div className="bg-dark-light rounded-xl border border-primary/20 p-6 mb-8 w-full max-w-lg mx-auto shadow-lg">
      <div className="flex items-center mb-4">
        <CheckCircle className="text-primary mr-2" size={24} />
        <h3 className="text-xl font-bold text-white">Download Your Certificate</h3>
      </div>
      {!user ? (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded mb-8">You must be logged in to generate a certificate.</div>
      ) : Object.values(coursesData).filter((c: any) => isCourseCompleted(c)).length === 0 ? (
        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded mb-8">
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <span>Complete a course to generate your certificate!</span>
          </div>
          <p className="text-sm mt-2">You need to finish 100% of a course to download its certificate.</p>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-white">Course Completed</label>
            <select
              className="w-full border border-gray-600 rounded px-3 py-2 bg-dark text-white"
              value={course}
              onChange={e => setCourse(e.target.value)}
              required
            >
              <option value="">Select a completed course</option>
              {Object.values(coursesData)
                .filter((c: any) => isCourseCompleted(c))
                .map((c: any) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition" disabled={downloading}>
            {downloading ? 'Generating...' : 'Generate & Download Certificate'}
          </button>
          {success && (
            <div className="mt-2 text-green-400 bg-green-900/30 px-4 py-2 rounded text-center">Certificate downloaded successfully!</div>
          )}
        </form>
      )}
    </div>
  );
};

export default CertificateGenerator; 