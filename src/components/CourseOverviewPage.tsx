import React, { useState } from 'react';
import { ArrowLeft, Play, BookOpen, CheckCircle, Award, Clock } from 'lucide-react';

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
    title: 'Resume Fundamentals',
    completed: true,
    lessons: [
      {
        id: 'video1',
        type: 'video',
        title: 'What is a Resume Really For?',
        duration: '3 min',
        completed: true
      },
      {
        id: 'reading1',
        type: 'reading',
        title: 'What Recruiters Actually Look For',
        duration: '2 min',
        completed: true
      },
      {
        id: 'video2',
        type: 'video',
        title: 'Understanding the ATS',
        duration: '4 min',
        completed: true
      }
    ]
  },
  {
    id: 'module2',
    title: 'Bullet Point Writing',
    completed: false,
    lessons: [
      {
        id: 'video3',
        type: 'video',
        title: 'How to Write Impact-Driven Statements',
        duration: '4 min',
        completed: true
      },
      {
        id: 'reading2',
        type: 'reading',
        title: 'The STAR Method Explained',
        duration: '3 min',
        completed: false
      },
      {
        id: 'quiz1',
        type: 'quiz',
        title: 'Quiz: Bullet Point Rewrites',
        duration: '10 min',
        completed: false
      }
    ]
  },
  {
    id: 'module3',
    title: 'Action Verbs & Fluff',
    completed: false,
    lessons: [
      {
        id: 'video4',
        type: 'video',
        title: 'Power Verbs that Pop',
        duration: '2 min',
        completed: false
      },
      {
        id: 'reading3',
        type: 'reading',
        title: 'Words to Cut From Your Resume',
        duration: '2 min',
        completed: false
      }
    ]
  },
  {
    id: 'module4',
    title: 'Formatting Do\'s and Don\'ts',
    completed: false,
    lessons: [
      {
        id: 'video5',
        type: 'video',
        title: 'Resume Formatting 101',
        duration: '5 min',
        completed: false
      },
      {
        id: 'reading4',
        type: 'reading',
        title: 'Design Principles for Impact',
        duration: '3 min',
        completed: false
      }
    ]
  },
  {
    id: 'module5',
    title: 'Tailoring for Job Descriptions',
    completed: false,
    lessons: [
      {
        id: 'video6',
        type: 'video',
        title: 'Matching Keywords Like a Pro',
        duration: '4 min',
        completed: false
      },
      {
        id: 'quiz2',
        type: 'quiz',
        title: 'Practice: Tailor This Resume Challenge',
        duration: '15 min',
        completed: false
      }
    ]
  },
  {
    id: 'module6',
    title: 'Common Resume Mistakes',
    completed: false,
    lessons: [
      {
        id: 'video7',
        type: 'video',
        title: 'Real Mistakes to Avoid',
        duration: '4 min',
        completed: false
      },
      {
        id: 'reading5',
        type: 'reading',
        title: 'Before You Hit Send…',
        duration: '2 min',
        completed: false
      }
    ]
  },
  {
    id: 'module7',
    title: 'LinkedIn Profile Setup',
    completed: false,
    lessons: [
      {
        id: 'video8',
        type: 'video',
        title: 'Building a LinkedIn Profile That Stands Out',
        duration: '5 min',
        completed: false
      },
      {
        id: 'reading6',
        type: 'reading',
        title: 'Optimizing Banner, Headline, About',
        duration: '4 min',
        completed: false
      }
    ]
  },
  {
    id: 'module8',
    title: 'LinkedIn SEO & Keywords',
    completed: false,
    lessons: [
      {
        id: 'video9',
        type: 'video',
        title: 'How Recruiters Use Search',
        duration: '3 min',
        completed: false
      },
      {
        id: 'reading7',
        type: 'reading',
        title: 'LinkedIn Keyword Strategy',
        duration: '3 min',
        completed: false
      }
    ]
  },
  {
    id: 'module9',
    title: 'Growing Your LinkedIn Network',
    completed: false,
    lessons: [
      {
        id: 'video10',
        type: 'video',
        title: 'Personalized Connection Requests',
        duration: '2 min',
        completed: false
      },
      {
        id: 'reading8',
        type: 'reading',
        title: 'Engaging with Content Strategically',
        duration: '3 min',
        completed: false
      }
    ]
  },
  {
    id: 'module10',
    title: 'Asking for Recommendations',
    completed: false,
    lessons: [
      {
        id: 'video11',
        type: 'video',
        title: 'Who to Ask and How',
        duration: '3 min',
        completed: false
      },
      {
        id: 'reading9',
        type: 'reading',
        title: 'What Makes a Strong Recommendation',
        duration: '2 min',
        completed: false
      }
    ]
  }
];

interface CourseOverviewPageProps {
  onBackToDashboard: () => void;
  onStartCourse: () => void;
}

export default function CourseOverviewPage({ onBackToDashboard, onStartCourse }: CourseOverviewPageProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['module1']);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

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

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-[#EAF4F1] p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setSelectedLesson(null)}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Overview</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-[#EAF4F1] rounded-full flex items-center justify-center mx-auto mb-6">
              {getIcon(selectedLesson.type)}
            </div>
            
            <h1 className="text-3xl font-bold text-[#1B3D2F] mb-4">
              {selectedLesson.title}
            </h1>
            
            <div className="bg-[#EAF4F1] rounded-lg p-6 mb-8">
              <p className="text-lg text-[#6B7280]">
                This is where the {selectedLesson.type === 'video' ? 'Video' : selectedLesson.type === 'reading' ? 'Reading' : 'Quiz'} content for "{selectedLesson.title}" will appear.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF4F1] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-[#1B3D2F] mb-3">Resume and LinkedIn</h1>
                <p className="text-xl text-[#6B7280] mb-4">Build a job-ready resume and unlock the power of LinkedIn</p>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-[#F6C28B] text-[#1B1F23] px-4 py-2 rounded-full font-semibold flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Earn up to +2,000 XP</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[#6B7280]">
                    <Clock className="w-4 h-4" />
                    <span>{completedLessons} of {totalLessons} lessons completed</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button 
                  onClick={onStartCourse}
                  className="bg-[#1B3D2F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all duration-200 hover:scale-105"
                  style={{ boxShadow: '0 4px 12px rgba(27, 61, 47, 0.3)' }}
                >
                  {completedLessons > 0 ? 'Resume Course' : 'Start Course'}
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6B7280]">Course Progress</span>
                <span className="text-sm font-bold text-[#1B3D2F]">
                  {Math.round(progressPercentage)}% complete
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
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="space-y-4">
          {courseData.map((module, moduleIndex) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      module.completed ? 'bg-[#1B3D2F]' : 'bg-[#DDE5E1]'
                    }`}>
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-white fill-current" />
                      ) : (
                        <span className="text-sm font-bold text-[#6B7280]">{moduleIndex + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1B3D2F]">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {module.lessons.length} lessons • {module.lessons.reduce((acc, lesson) => acc + parseInt(lesson.duration), 0)} min total
                      </p>
                    </div>
                  </div>
                  
                  <div className={`transform transition-transform duration-200 ${
                    expandedModules.includes(module.id) ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {expandedModules.includes(module.id) && (
                <div className="border-t border-gray-100 bg-gray-50">
                  <div className="p-6 space-y-3">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className="w-full flex items-center space-x-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
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
                        
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[#1B3D2F]">{lesson.title}</p>
                          <p className="text-sm text-[#6B7280]">{lesson.duration}</p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}