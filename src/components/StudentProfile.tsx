import React, { useState } from 'react';
import { ArrowLeft, User, Award, Calendar, FileText, MessageSquare, BookOpen, TrendingUp, Clock, Edit3, Plus, CheckCircle, Play } from 'lucide-react';

interface StudentProfileProps {
  studentId: string;
  onBackToAdvisor: () => void;
}

// Mock student data - in real app this would come from API
const mockStudentData = {
  id: 'student-1',
  name: 'Jane Doe',
  email: 'jane.doe@university.edu',
  xp: 24450,
  streak: 12,
  riskLevel: 'green',
  lastLogin: '2 hours ago',
  resumeScore: 'A',
  cohort: 'Class of 2025',
  major: 'Business',
  joinDate: 'September 2024',
  courses: [
    {
      id: 1,
      title: 'Resume and LinkedIn',
      progress: 65,
      xpEarned: 1200,
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Interview Mastery',
      progress: 30,
      xpEarned: 450,
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Job Search Strategy',
      progress: 100,
      xpEarned: 800,
      status: 'completed'
    }
  ],
  interviews: [
    { 
      id: 1, 
      date: '2024-01-15', 
      score: 85, 
      type: 'Behavioral', 
      feedback: 'Strong communication skills, needs work on specific examples. Great storytelling ability and confident delivery.' 
    },
    { 
      id: 2, 
      date: '2024-01-10', 
      score: 78, 
      type: 'Technical', 
      feedback: 'Good problem-solving approach, practice more coding challenges. Shows logical thinking but needs speed improvement.' 
    },
    { 
      id: 3, 
      date: '2024-01-05', 
      score: 82, 
      type: 'Behavioral', 
      feedback: 'Excellent storytelling, confident delivery. Could improve on handling stress-related questions.' 
    },
    { 
      id: 4, 
      date: '2023-12-20', 
      score: 76, 
      type: 'Technical', 
      feedback: 'Solid foundation, needs practice with system design questions.' 
    }
  ],
  resumeFeedback: {
    score: 'A',
    lastUpdated: '3 days ago',
    beforeText: 'Previous resume had weak bullet points, poor formatting, and lacked quantified achievements. Generic objective statement and inconsistent styling throughout.',
    afterText: 'Transformed resume with strong action verbs, quantified achievements, and professional formatting. Clear value proposition and ATS-optimized structure.',
    advisorComments: [
      'Excellent improvement in bullet point structure - much more impactful',
      'Great use of metrics and quantified results',
      'Professional formatting that will pass ATS systems',
      'Consider adding one more technical skill to strengthen profile'
    ]
  },
  advisorNotes: [
    { 
      id: 1, 
      text: 'Great progress on LinkedIn optimization, profile views increased by 40%. Continue focusing on networking and content engagement. Student is very motivated and responsive to feedback.', 
      date: '1 day ago', 
      author: 'Dr. Smith',
      type: 'progress'
    },
    { 
      id: 2, 
      text: 'Needs to work on technical interview skills. Recommended additional practice with coding challenges and system design. Scheduled follow-up session for next week.', 
      date: '3 days ago', 
      author: 'Dr. Smith',
      type: 'improvement'
    },
    { 
      id: 3, 
      text: 'Successfully completed Module 2 with excellent quiz scores. Ready to move to advanced resume formatting. Student shows strong attention to detail.', 
      date: '1 week ago', 
      author: 'Dr. Johnson',
      type: 'achievement'
    },
    { 
      id: 4, 
      text: 'Initial assessment shows strong communication skills but needs confidence building for technical discussions. Recommended joining study group.', 
      date: '2 weeks ago', 
      author: 'Dr. Smith',
      type: 'assessment'
    }
  ],
  skillProgression: [
    { skill: 'Resume Writing', week1: 60, week2: 70, week3: 80, week4: 85 },
    { skill: 'Interview Skills', week1: 45, week2: 55, week3: 65, week4: 78 },
    { skill: 'LinkedIn Optimization', week1: 30, week2: 50, week3: 75, week4: 85 },
    { skill: 'Job Search Strategy', week1: 40, week2: 60, week3: 70, week4: 80 },
    { skill: 'Networking', week1: 25, week2: 40, week3: 55, week4: 70 }
  ]
};

export default function StudentProfile({ studentId, onBackToAdvisor }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const student = mockStudentData; // In real app, fetch by studentId

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'interviews', label: 'Mock Interviews', icon: MessageSquare },
    { id: 'resume', label: 'Resume Feedback', icon: FileText }
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
      setShowAddNote(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-4">
            {student.courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#1B3D2F]">{course.title}</h4>
                    <p className="text-sm text-[#6B7280]">{course.xpEarned} XP earned</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {course.status === 'completed' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        Completed
                      </span>
                    ) : (
                      <button className="bg-[#F6C28B] text-[#1B1F23] px-4 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-all duration-200">
                        Continue
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#6B7280]">Progress</span>
                    <span className="text-sm font-bold text-[#1B3D2F]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-[#DDE5E1] rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${course.progress}%`,
                        background: 'linear-gradient(to right, #1B3D2F, #A7D7C5)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'interviews':
        return (
          <div className="space-y-6">
            {/* Interview Performance Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-bold text-[#1B3D2F] mb-4">Interview Performance Trend</h4>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-[#1B3D2F] mx-auto mb-2" />
                  <p className="text-[#6B7280]">📈 Interview scores trending upward</p>
                  <p className="text-sm text-[#6B7280]">Average score: 80.25</p>
                </div>
              </div>
            </div>

            {/* Interview History Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-bold text-[#1B3D2F] mb-4">Interview History</h4>
              <div className="space-y-4">
                {student.interviews.map((interview) => (
                  <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-[#1B3D2F]">{interview.type} Interview</h5>
                        <p className="text-sm text-[#6B7280]">{interview.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1B3D2F]">{interview.score}</div>
                        <div className="text-sm text-[#6B7280]">Score</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-[#6B7280]">{interview.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-[#1B3D2F]">Resume Transformation</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#6B7280]">Last updated: {student.resumeFeedback.lastUpdated}</span>
                  <div className="text-3xl font-bold text-[#1B3D2F]">{student.resumeFeedback.score}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="font-bold text-[#1B3D2F] mb-3">Before</h5>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-[#6B7280]">{student.resumeFeedback.beforeText}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-[#1B3D2F] mb-3">After</h5>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-[#6B7280]">{student.resumeFeedback.afterText}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[#1B3D2F] mb-3">Advisor Comments</h5>
                <div className="space-y-2">
                  {student.resumeFeedback.advisorComments.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#6B7280]">{comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF4F1] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBackToAdvisor}
            className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Advisor Dashboard</span>
          </button>
          
          {/* Student Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#1B3D2F] mb-2">{student.name}</h1>
                <div className="flex items-center space-x-6 text-[#6B7280] mb-4">
                  <span>{student.email}</span>
                  <span>{student.cohort}</span>
                  <span>{student.major} Major</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-[#F6C28B] text-[#1B1F23] px-4 py-2 rounded-full font-bold flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>🔥 {student.streak}-day streak</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#1B3D2F]">{student.xp.toLocaleString()}</div>
                <div className="text-sm text-[#6B7280]">Total XP</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-[#1B3D2F] border-b-2 border-[#1B3D2F]'
                          : 'text-[#6B7280] hover:text-[#1B3D2F]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Skill Progression Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-bold text-[#1B3D2F] mb-4">Skill Progression Over Time</h4>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-[#1B3D2F] mx-auto mb-2" />
                  <p className="text-[#6B7280]">📊 Multi-line chart showing skill development</p>
                  <p className="text-sm text-[#6B7280]">Resume Writing, Interview Skills, LinkedIn, Job Search, Networking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Advisor Notes */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-[#1B3D2F]">Advisor Notes</h4>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="flex items-center space-x-1 text-[#1B3D2F] hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </button>
              </div>

              {showAddNote && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this student..."
                    className="w-full h-24 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] resize-none text-sm"
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => setShowAddNote(false)}
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-[#6B7280] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1 bg-[#1B3D2F] text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {student.advisorNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#1B3D2F] rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-[#1B3D2F] text-sm">{note.author}</span>
                      </div>
                      <span className="text-xs text-[#6B7280]">{note.date}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{note.text}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        note.type === 'progress' ? 'bg-green-100 text-green-800' :
                        note.type === 'improvement' ? 'bg-orange-100 text-orange-800' :
                        note.type === 'achievement' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {note.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}