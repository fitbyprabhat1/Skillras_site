import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLandingPage from './pages/MainLandingPage';
import LandingPage from './pages/LandingPage';
import TrialPage from './pages/TrialPage';
import CoursePage from './pages/CoursePage';
import DownloadPage from './pages/DownloadPage';
import AllCoursesPage from './pages/AllCoursesPage';
import PackagesPage from './pages/PackagesPage';
import PaymentPage from './pages/PaymentPage';
import EnrollmentPage from './pages/EnrollmentPage';

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
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/enroll" element={<EnrollmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;