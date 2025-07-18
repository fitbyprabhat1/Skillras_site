import React, { useState } from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import Button from '../components/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPackage } from '../hooks/useUserPackage';
import packageCourses from '../data/packageCourses';
import courses from '../data/courses';

const MyCoursePage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? courses[courseId] : undefined;
  const { user } = useAuth();
  const { userPackage } = useUserPackage();
  let hasAccess = false;
  if (user && userPackage && userPackage.package_selected) {
    const allowedIds = new Set(packageCourses[userPackage.package_selected]);
    hasAccess = allowedIds.has(courseId || '');
  }

  const handleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <NavBarWithPackages />
        <h2 className="text-2xl font-bold">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col mt-10">
      <NavBarWithPackages />
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center pt-10 pb-6 bg-gradient-to-b from-[#18181b] to-[#0a0a0a]">
        <img
          src={course.thumbnail}
          alt={course.name + ' Logo'}
          className="w-full max-w-5xl rounded-xl shadow-xl"
        />
        {/* Course Title and Enroll Button */}
        <div className="w-full max-w-5xl flex flex-col items-center mt-4 mb-6">
          <h2 className="text-3xl font-bold text-white mb-3 text-center">{course.name}</h2>
          <Button
            variant="primary"
            className="px-8 py-2 text-lg font-semibold rounded-full shadow-md"
            onClick={() => {
              if (!user) {
                navigate('/login');
              } else if (hasAccess) {
                navigate(`/course/${courseId || ''}`);
              } else {
                navigate(`/enroll?course=${courseId || ''}`);
              }
            }}
          >
            Enroll in this Course
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {/* Summary */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Summary</h4>
          <div className="text-gray-300 space-y-4">
            <p>{course.description}</p>
            <blockquote className="border-l-4 border-primary pl-4 text-primary italic">
              Digital Don, led by Mike Thurston, equips you with strategies for personal growth, elite health, effective networking, and impactful branding to maximize your potential and lead a fulfilling life.
            </blockquote>
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* Skills */}
        {course.skills && (
          <section className="mb-10">
            <h4 className="text-xl font-bold text-white mb-4">Skills</h4>
            <div className="flex flex-wrap gap-3">
              {course.skills.map(skill => (
                <span key={skill} className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
        <div className="border-t border-gray-700 my-8" />
        {/* Curriculum (Accordion) */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Curriculum</h4>
          <div className="space-y-3">
            {course.modules.map((mod, idx) => (
              <div key={mod.title} className="border border-gray-700 rounded-lg overflow-hidden bg-[#18181b]">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none hover:bg-primary/10 transition"
                  onClick={() => handleAccordion(idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-semibold text-white">{mod.title}</span>
                  <svg
                    className={`w-5 h-5 text-primary transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === idx && (
                  <div className="px-5 pb-4 text-gray-300 animate-fade-in">
                    <div className="mb-2 font-semibold">{mod.description}</div>
                    <ul className="list-disc ml-5">
                      {mod.chapters.map((chapter) => (
                        <li key={chapter.id} className="mb-1">
                          <span className="text-white font-medium">{chapter.title}</span>
                          <span className="ml-2 text-xs text-gray-400">({chapter.duration})</span>
                          <div className="text-gray-400 text-sm">{chapter.description}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* Instructor */}
        <section className="mb-10">
          <h4 className="text-xl font-bold text-white mb-4">Instructor</h4>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {course.instructorImage && (
              <img
                src={course.instructorImage}
                alt={course.author}
                className="w-40 h-40 object-cover rounded-xl shadow-lg mb-4 md:mb-0"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{course.author}</h3>
              <p className="text-gray-300 mb-2">{course.instructorBio}</p>
            </div>
          </div>
        </section>
        <div className="border-t border-gray-700 my-8" />
        {/* CTA Section */}
        <section className="mb-10 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-8 shadow-lg">
          <div className="mb-6 md:mb-0">
            <img
              src="https://educate.io/images/DL-FULL-LOGO-min.png"
              alt="Digital Launchpad Logo"
              className="w-40 mb-4"
            />
            <h3 className="text-2xl font-bold text-white mb-2">Ready to start your journey?</h3>
            <Button
              variant="primary"
              className="px-8 py-3 text-lg font-semibold rounded-full shadow-md"
              onClick={() => navigate(`/course/${courseId}`)}
            >
              Go to Course
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <img src="https://educate.io/images/Ad-Architect-Card-min.webp" alt="Ad Architect" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/The-Winning-Store-Card-min_1.webp" alt="The Winning Store" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/Digital-DOn-Card-min_1.webp" alt="Digital Don Card" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/Six-Figure-Sales-Rep-Card-min_1.webp" alt="Six Figure Sales Rep" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/Digital-Launchpad-Card-min_1.webp" alt="Digital Launchpad" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/Detox101-Card-min_1.webp" alt="Detox101" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/Pathway-To-Profits-Card-min_1.webp" alt="Pathway To Profits" className="w-32 rounded-lg shadow-md" />
            <img src="https://educate.io/images/The-Winning-Store-Card-1-min_1.webp" alt="The Winning Store 1" className="w-32 rounded-lg shadow-md" />
          </div>
        </section>
        {/* Dashboard Button */}
        <div className="flex justify-center mt-10">
          <Link to="/dashboard">
            <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold shadow-md bg-white/20 text-white hover:bg-white/40 transition-all">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full bg-[#18181b] py-6 mt-10 border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm px-4">
          <div className="mb-2 md:mb-0">
            <a href="#" className="hover:underline">©2025 Educate</a>
            <span className="mx-2">|</span>
            <span>Legal business name: IAG SERVICES - FZCO</span>
            <span className="mx-2">|</span>
            <span>DSO-IFZA-20424, IFZA Properties, Dubai Silicon Oasis, Dubai, United Arab Emirates</span>
            <span className="mx-2">|</span>
            <span>Business phone: 058 535 0301</span>
            <span className="mx-2">|</span>
            <span>All rights reserved</span>
          </div>
          <div>
            <a href="https://educate-io.typeform.com/to/FsYgXwhD" className="hover:underline mr-4">Contact</a>
            <a href="https://educate.io/terms-conditions" className="hover:underline mr-4">Terms</a>
            <a href="https://educate.io/privacy-policy" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyCoursePage; 