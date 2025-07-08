import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseService } from '../lib/courseService';
import type { Course, CourseSection, CourseChapter } from '../types/course';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Upload,
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Loader,
  Lock
} from 'lucide-react';
import Button from '../components/Button';

interface AdminStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
}

// Hardcoded credentials
const ADMIN_EMAIL = 'admin@skillras.com';
const ADMIN_PASSWORD = 'admin123';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
  });

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form state for course creation/editing
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    instructor_name: '',
    price: 0,
    original_price: 0,
    duration: '',
    skill_level: 'beginner',
    category: '',
    thumbnail_image: '',
    featured_status: false,
    is_published: false,
    is_popular: false,
    is_coming_soon: false
  });

  // Handle hardcoded login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  useEffect(() => {
    if (user && isLoggedIn) {
      fetchCourses();
      fetchStats();
    }
  }, [user, isLoggedIn]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // For admin, we want to see all courses, not just published ones
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('creation_date', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('is_published, students_count, price');

      if (coursesData) {
        const totalCourses = coursesData.length;
        const publishedCourses = coursesData.filter(c => c.is_published).length;
        const totalStudents = coursesData.reduce((sum, c) => sum + (c.students_count || 0), 0);
        const totalRevenue = coursesData.reduce((sum, c) => sum + ((c.students_count || 0) * (c.price || 0)), 0);

        setStats({
          totalCourses,
          publishedCourses,
          totalStudents,
          totalRevenue
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const newCourse = await CourseService.createCourse(formData);
      setCourses([newCourse, ...courses]);
      setShowCreateForm(false);
      resetForm();
      fetchStats();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;

    try {
      const updatedCourse = await CourseService.updateCourse(selectedCourse.course_id, formData);
      setCourses(courses.map(c => c.course_id === updatedCourse.course_id ? updatedCourse : c));
      setIsEditing(false);
      setSelectedCourse(null);
      resetForm();
      fetchStats();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await CourseService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.course_id !== courseId));
      fetchStats();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const updatedCourse = await CourseService.updateCourse(course.course_id, {
        is_published: !course.is_published
      });
      setCourses(courses.map(c => c.course_id === updatedCourse.course_id ? updatedCourse : c));
      fetchStats();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor_name: '',
      price: 0,
      original_price: 0,
      duration: '',
      skill_level: 'beginner',
      category: '',
      thumbnail_image: '',
      featured_status: false,
      is_published: false,
      is_popular: false,
      is_coming_soon: false
    });
  };

  const startEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData(course);
    setIsEditing(true);
  };

  // Check if user is admin AND logged in with hardcoded credentials
  const isAdmin = user?.email === ADMIN_EMAIL && isLoggedIn;

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="bg-dark-light rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <Lock className="text-primary mx-auto mb-4" size={48} />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-300">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <Button type="submit" className="w-full" glowing>
              Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-dark rounded-lg">
            <p className="text-gray-400 text-sm text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@skillras.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You don't have permission to access this page.</p>
          <Button onClick={handleLogout} className="mt-4" variant="outline">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your courses and content</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowCreateForm(true)} glowing>
              <Plus size={20} className="mr-2" />
              Create Course
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="text-primary" size={32} />
              <span className="text-2xl font-bold">{stats.totalCourses}</span>
            </div>
            <h3 className="text-lg font-medium">Total Courses</h3>
            <p className="text-gray-400 text-sm">{stats.publishedCourses} published</p>
          </div>

          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-green-500" size={32} />
              <span className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</span>
            </div>
            <h3 className="text-lg font-medium">Total Students</h3>
            <p className="text-gray-400 text-sm">Across all courses</p>
          </div>

          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-yellow-500" size={32} />
              <span className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</span>
            </div>
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-gray-400 text-sm">Estimated earnings</p>
          </div>

          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-blue-500" size={32} />
              <span className="text-2xl font-bold">{((stats.publishedCourses / stats.totalCourses) * 100).toFixed(0)}%</span>
            </div>
            <h3 className="text-lg font-medium">Published Rate</h3>
            <p className="text-gray-400 text-sm">Courses live</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-dark-light rounded-xl overflow-hidden">
          <div className="p-6 border-b border-dark-lighter">
            <h2 className="text-2xl font-bold">Courses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-lighter">
                <tr>
                  <th className="text-left p-4">Course</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Students</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.course_id} className="border-b border-dark-lighter hover:bg-dark-lighter/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {course.thumbnail_image && (
                          <img 
                            src={course.thumbnail_image} 
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-400">{course.instructor_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                        {course.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium">₹{course.price.toLocaleString()}</span>
                        {course.original_price && course.original_price > course.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ₹{course.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{course.students_count.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`p-1 rounded ${course.is_published ? 'text-green-500' : 'text-gray-500'}`}
                        >
                          {course.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.is_published 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(course)}
                          className="p-2 text-blue-500 hover:bg-blue-500/20 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.course_id)}
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Course Modal */}
        {(showCreateForm || isEditing) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-light rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setIsEditing(false);
                    setSelectedCourse(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Course Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="Enter course description"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Instructor Name</label>
                    <input
                      type="text"
                      value={formData.instructor_name}
                      onChange={(e) => setFormData({...formData, instructor_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="e.g., Video Editing"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="4999"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="9999"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="35 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Skill Level</label>
                    <select
                      value={formData.skill_level}
                      onChange={(e) => setFormData({...formData, skill_level: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Thumbnail Image URL</label>
                    <input
                      type="url"
                      value={formData.thumbnail_image}
                      onChange={(e) => setFormData({...formData, thumbnail_image: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured_status}
                          onChange={(e) => setFormData({...formData, featured_status: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-white">Featured</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_published}
                          onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-white">Published</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_popular}
                          onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-white">Popular</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_coming_soon}
                          onChange={(e) => setFormData({...formData, is_coming_soon: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-white">Coming Soon</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setIsEditing(false);
                      setSelectedCourse(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isEditing ? handleUpdateCourse : handleCreateCourse}
                    glowing
                  >
                    <Save size={20} className="mr-2" />
                    {isEditing ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;