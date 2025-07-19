import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PackageProtectedRoute from './components/PackageProtectedRoute';
import MainLandingPage from './pages/MainLandingPage';
import LandingPage from './pages/LandingPage';
import CoursePage from './pages/CoursePage';
import DownloadPage from './pages/DownloadPage';
import AllCoursesPage from './pages/AllCoursesPage';
import PackagesPage from './pages/PackagesPage';
import PaymentPage from './pages/PaymentPage';
import EnrollmentPage from './pages/EnrollmentPage';
import LoginPage from './pages/LoginPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import DashboardPage from './pages/DashboardPage';
import EarningsPage from './pages/EarningsPage';
import MyCoursePage from './pages/MyCoursePage';
import Broucherpage from './pages/Broucherpage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Block common dev tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/premiere-pro" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-courses" 
            element={
              <ProtectedRoute>
                <MyCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/earnings" 
            element={
              <ProtectedRoute>
                <EarningsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:courseId" 
            element={
              <PackageProtectedRoute requiredPackage="starter">
                <CoursePage />
              </PackageProtectedRoute>
            } 
          />
          <Route path="/course-info/:courseId" element={<Broucherpage />} />
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