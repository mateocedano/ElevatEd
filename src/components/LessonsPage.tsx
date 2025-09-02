import React, { useState } from 'react';
import { Play, BookOpen, CheckCircle, ArrowRight, ArrowLeft, Award } from 'lucide-react';

interface Lesson {
  id: string;
  type: 'video' | 'reading' | 'quiz';
  title: string;
  duration: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

const courseData: Module[] = [
  {
    id: 'module1',
    title: 'Resume Mastery',
    completed: false,
    lessons: [
      {
        id: 'video1',
        type: 'video',
        title: 'What Makes a Resume Stand Out in 2025',
        duration: '3 min',
        completed: true
      },
      {
        id: 'reading1',
        type: 'reading',
        title: 'Resume Myths Busted',
        duration: '2 min',
        completed: true
      },
      {
        id: 'video2',
        type: 'video',
        title: 'Formatting Like a Pro',
        duration: '5 min',
        completed: true
      },
      {
        id: 'reading2',
        type: 'reading',
        title: 'Crafting Achievement-Based Bullets',
        duration: '4 min',
        completed: false
      },
      {
        id: 'quiz1',
        type: 'quiz',
        title: 'Resume Review Practice',
        duration: '10 min',
        completed: false
      }
    ]
  },
  {
    id: 'module2',
    title: 'LinkedIn Optimization',
    completed: false,
    lessons: [
      {
        id: 'video3',
        type: 'video',
        title: 'Why LinkedIn is More Than a Digital Resume',
        duration: '4 min',
        completed: false
      },
      {
        id: 'reading3',
        type: 'reading',
        title: 'Building a Headline That Pops',
        duration: '3 min',
        completed: false
      },
      {
        id: 'video4',
        type: 'video',
        title: 'How to Attract Recruiters on LinkedIn',
        duration: '6 min',
        completed: false
      },
      {
        id: 'reading4',
        type: 'reading',
        title: 'Do\'s and Don\'ts for Your LinkedIn Summary',
        duration: '5 min',
        completed: false
      },
      {
        id: 'quiz2',
        type: 'quiz',
        title: 'LinkedIn Profile Review',
        duration: '15 min',
        completed: false
      }
    ]
  }
];

interface LessonsPageProps {
  onBackToDashboard: () => void;
}

export default function LessonsPage({ onBackToDashboard }: LessonsPageProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(courseData[0].lessons[3]);
  const [showCompletion, setShowCompletion] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const totalLessons = courseData.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = courseData.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.completed).length, 0
  );
  const progressPercentage = (completedLessons / totalLessons) * 100;

  const renderMainContent = () => {
    if (showCompletion) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1B3D2F] to-[#A7D7C5] rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B3D2F] mb-4">
              🎉 You completed Module 1: Resume Mastery
            </h2>
            <div className="bg-[#EAF4F1] rounded-lg p-4 mb-6">
              <p className="text-lg font-semibold text-[#1B3D2F]">XP Earned: +500 XP</p>
            </div>
            <button 
              onClick={() => setShowCompletion(false)}
              className="bg-[#F6C28B] text-[#1B1F23] px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-200"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            >
              Start Module 2
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6B7280]">Course Progress</span>
            <span className="text-sm font-bold text-[#1B3D2F]">
              {completedLessons} of {totalLessons} completed
            </span>
          </div>
          <div className="w-full bg-[#DDE5E1] rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${progressPercentage}%`,
                background: 'linear-gradient(to right, #1B3D2F, #A7D7C5)'
              }}
            ></div>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">{Math.round(progressPercentage)}% complete</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <div className="w-20 h-20 bg-[#EAF4F1] rounded-full flex items-center justify-center mx-auto mb-6">
              {getIcon(selectedLesson.type)}
            </div>
            
            <h1 className="text-3xl font-bold text-[#1B3D2F] mb-4">
              {selectedLesson.title}
            </h1>
            
            <div className="bg-[#EAF4F1] rounded-lg p-6 mb-8">
              {selectedLesson.type === 'video' && (
                <p className="text-lg text-[#6B7280]">
                  📺 This is where the video player will appear for "{selectedLesson.title}"
                </p>
              )}
              {selectedLesson.type === 'reading' && (
                <div className="text-left space-y-4">
                  <p className="text-[#6B7280]">
                    📖 Reading content for "{selectedLesson.title}" would appear here.
                  </p>
                  <p className="text-[#6B7280]">
                    This section would contain comprehensive written material, examples, 
                    and actionable insights to help students master the topic.
                  </p>
                  <p className="text-[#6B7280]">
                    Interactive elements, downloadable resources, and practical exercises 
                    would be embedded throughout the content.
                  </p>
                </div>
              )}
              {selectedLesson.type === 'quiz' && (
                <p className="text-lg text-[#6B7280]">
                  ❓ Quiz goes here for "{selectedLesson.title}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <button 
                onClick={() => selectedLesson.id === 'quiz1' ? setShowCompletion(true) : null}
                className="bg-[#F6C28B] text-[#1B1F23] px-6 py-3 rounded-full font-bold flex items-center space-x-2 hover:shadow-lg transition-all duration-200"
                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EAF4F1] flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#1B3D2F]">Resume and LinkedIn</h1>
        </div>

        {/* Course Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {courseData.map((module) => (
            <div key={module.id} className="mb-8">
              <h2 className="text-lg font-bold text-[#1B3D2F] mb-4">
                Module {module.id === 'module1' ? '1' : '2'}: {module.title}
              </h2>
              
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedLesson.id === lesson.id
                        ? 'bg-[#EAF4F1] border-l-4 border-[#1B3D2F]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      lesson.completed ? 'text-[#1B3D2F]' : 'text-[#6B7280]'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 fill-current" />
                      ) : (
                        getIcon(lesson.type)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        selectedLesson.id === lesson.id ? 'text-[#1B3D2F]' : 'text-[#1B3D2F]'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-sm text-[#6B7280]">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 p-6">
        {renderMainContent()}
      </div>
    </div>
  );
}