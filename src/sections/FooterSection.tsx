import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Skillras</h3>
            <p className="text-gray-400 mb-4">
              Empowering your creative journey with top-notch courses and resources.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/skillras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="https://twitter.com/skillras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="https://instagram.com/skillras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="https://linkedin.com/company/skillras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <LinkedinIcon size={20} />
              </a>
              <a href="https://youtube.com/@skillras" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-primary transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <a href="/downloads/seo-checklist.pdf" className="text-gray-400 hover:text-primary transition-colors">Free Guides</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Case Studies</a>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: admin@skillras.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon-Sun, 5.30pm-10pm EST</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Skillras. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;