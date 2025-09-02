import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
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

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLessons, setShowLessons] = useState(false);
  const [showCourseOverview, setShowCourseOverview] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const handleViewStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowStudentProfile(true);
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

  return (
    <div className="min-h-screen bg-[#EAF4F1] p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-[#1B3D2F]">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-[#6B7280]">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-[#6B7280] hover:text-[#1B3D2F] underline"
              >
                Sign Out
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-[#1B3D2F]">ElevatEd</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="flex-shrink-0">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <QuickActions onStartCourse={() => setShowCourseOverview(true)} />
            
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