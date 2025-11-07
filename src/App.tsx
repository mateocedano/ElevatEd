import React, { useState } from 'react';
import { GraduationCap, Bell, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import LoadingSpinner from './components/LoadingSpinner';
import LessonsPage from './components/LessonsPage';
import CourseOverviewPage from './components/CourseOverviewPage';
import AdvisorDashboard from './components/AdvisorDashboard';
import StudentProfile from './components/StudentProfile';
import Sidebar from './components/Sidebar';
import QuickActions from './components/QuickActions';
import CourseProgress from './components/CourseProgress';
import ProgressChart from './components/ProgressChart';
import UpcomingLesson from './components/UpcomingLesson';
import RightSidebar from './components/RightSidebar';
import SearchBar from './components/SearchBar';
import ScheduleMeetingModal from './components/meetings/ScheduleMeetingModal';
import CalendarPage from './pages/Calendar';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLessons, setShowLessons] = useState(false);
  const [showCourseOverview, setShowCourseOverview] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const handleViewStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowStudentProfile(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (showLessons) {
    return <LessonsPage onBackToDashboard={() => setShowLessons(false)} />;
  }

  if (showCourseOverview) {
    return (
      <CourseOverviewPage 
        onBackToDashboard={() => setShowCourseOverview(false)} 
        onStartCourse={() => {
          setShowCourseOverview(false);
          setShowLessons(true);
        }}
      />
    );
  }

  if (showStudentProfile && selectedStudentId) {
    return (
      <StudentProfile
        studentId={selectedStudentId}
        onBackToAdvisor={() => {
          setShowStudentProfile(false);
          setSelectedStudentId(null);
          setActiveTab('advisor-view');
        }}
      />
    );
  }

  if (showCalendar) {
    return <CalendarPage onBackToDashboard={() => setShowCalendar(false)} />;
  }

  // Handle advisor view
  if (activeTab === 'advisor-view') {
    return (
      <AdvisorDashboard 
        onBackToStudent={() => setActiveTab('dashboard')}
        onViewStudentProfile={handleViewStudentProfile}
      />
    );
  }

  // Handle sidebar navigation
  if (activeTab === 'lessons') {
    return (
      <CourseOverviewPage
        onBackToDashboard={() => setActiveTab('dashboard')}
        onStartCourse={() => {
          setActiveTab('dashboard');
          setShowLessons(true);
        }}
      />
    );
  }

  if (activeTab === 'calendar') {
    return <CalendarPage onBackToDashboard={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[#EAF4F1] p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold text-[#1B3D2F]">ElevatEd</span>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-[#6B7280]">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#6B7280] hover:text-[#1B3D2F] underline"
              >
                Sign Out
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-[#6B7280]" />
            </button>
            <button className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6 items-start">
          {/* Left Sidebar */}
          <div className="flex-shrink-0">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <QuickActions
              onStartCourse={() => setShowCourseOverview(true)}
              onBookMeeting={() => setShowMeetingModal(true)}
            />
            
            <CourseProgress 
              onContinue={() => setShowLessons(true)}
              onCourseClick={() => setShowCourseOverview(true)}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart />
              <UpcomingLesson />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>

      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
      />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;