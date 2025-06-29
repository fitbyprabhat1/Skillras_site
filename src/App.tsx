import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLandingPage from './pages/MainLandingPage';
import LandingPage from './pages/LandingPage';
import TrialPage from './pages/TrialPage';
import CoursePage from './pages/CoursePage';
import DownloadPage from './pages/DownloadPage';
import AllCoursesPage from './pages/AllCoursesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        <Route path="/premiere-pro" element={<LandingPage />} />
        <Route path="/trial" element={<TrialPage />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/courses" element={<AllCoursesPage />} />
      </Routes>
    </Router>
  );
}

export default App;