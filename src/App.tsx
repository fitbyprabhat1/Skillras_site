import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLandingPage from './pages/MainLandingPage';
import LandingPage from './pages/LandingPage';
import TrialPage from './pages/TrialPage';
import CoursePage from './pages/CoursePage';
import DownloadPage from './pages/DownloadPage';
import AllCoursesPage from './pages/AllCoursesPage';
import PackagesPage from './pages/PackagesPage';
import PaymentPage from './pages/PaymentPage';
import EnrollmentPage from './pages/EnrollmentPage';
import LoginPage from './pages/LoginPage';
import GymCoursePage from './pages/gymCoursepage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/premiere-pro" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/trial" 
            element={
              <ProtectedRoute>
                <TrialPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gymCoursepage" 
            element={
              <ProtectedRoute>
                <GymCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/courses" element={<AllCoursesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;