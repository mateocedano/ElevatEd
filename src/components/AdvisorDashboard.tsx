import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Users,
  FileText,
  ChevronDown,
  ArrowLeft,
  Search,
  Plus,
  Download,
  Bell,
  X,
  User,
  BookOpen,
  MessageSquare,
  Award,
  Eye,
  Edit3
} from 'lucide-react';

// Mock Data
const mockStudents = [
  {
    id: 'student-1',
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    xp: 24450,
    riskLevel: 'green',
    lastLogin: '2 hours ago',
    resumeScore: 'A',
    cohort: 'Class of 2025',
    major: 'Business',
    interviews: [
      { date: '2024-01-15', score: 85, type: 'Behavioral' },
      { date: '2024-01-10', score: 78, type: 'Technical' }
    ],
    notes: [
      { id: 1, text: 'Great progress on LinkedIn optimization, profile views increased by 40%...', date: '1 day ago' },
      { id: 2, text: 'Needs to work on technical interview skills', date: '3 days ago' }
    ],
    nextMeeting: { topic: 'Resume Help', time: '2:00 PM', date: 'Today' }
  },
  {
    id: 'student-2',
    name: 'John Smith',
    email: 'john.smith@university.edu',
    xp: 18200,
    riskLevel: 'yellow',
    lastLogin: '3 days ago',
    resumeScore: 'B',
    cohort: 'Class of 2025',
    major: 'Tech',
    interviews: [
      { date: '2024-01-12', score: 72, type: 'Technical' }
    ],
    notes: [
      { id: 1, text: 'Struggling with technical interviews, needs more practice...', date: '2 hours ago' }
    ],
    nextMeeting: { topic: 'Interview Prep', time: '3:30 PM', date: 'Today' }
  },
  {
    id: 'student-3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@university.edu',
    xp: 8500,
    riskLevel: 'red',
    lastLogin: '10 days ago',
    resumeScore: 'C',
    cohort: 'Class of 2026',
    major: 'Business',
    interviews: [],
    notes: [
      { id: 1, text: 'Missed last two meetings, sent follow-up email to check in...', date: '2 days ago' }
    ],
    nextMeeting: { topic: 'Career Planning', time: '4:00 PM', date: 'Today' }
  },
  {
    id: 'student-4',
    name: 'Mike Johnson',
    email: 'mike.johnson@university.edu',
    xp: 31200,
    riskLevel: 'green',
    lastLogin: '1 hour ago',
    resumeScore: 'A',
    cohort: 'Class of 2025',
    major: 'Tech',
    interviews: [
      { date: '2024-01-14', score: 92, type: 'Behavioral' },
      { date: '2024-01-08', score: 88, type: 'Technical' }
    ],
    notes: [
      { id: 1, text: 'Successfully landed first interview! Preparing for behavioral questions...', date: '3 days ago' }
    ],
    nextMeeting: { topic: 'Job Search Strategy', time: '10:00 AM', date: 'Tomorrow' }
  },
  {
    id: 'student-5',
    name: 'Emma Davis',
    email: 'emma.davis@university.edu',
    xp: 15600,
    riskLevel: 'yellow',
    lastLogin: '1 day ago',
    resumeScore: 'B',
    cohort: 'Class of 2026',
    major: 'Business',
    interviews: [
      { date: '2024-01-11', score: 75, type: 'Behavioral' }
    ],
    notes: [
      { id: 1, text: 'Making good progress on resume formatting', date: '1 day ago' }
    ],
    nextMeeting: null
  },
  {
    id: 'student-6',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    xp: 22800,
    riskLevel: 'green',
    lastLogin: '4 hours ago',
    resumeScore: 'A',
    cohort: 'Class of 2025',
    major: 'Tech',
    interviews: [
      { date: '2024-01-13', score: 89, type: 'Technical' }
    ],
    notes: [],
    nextMeeting: null
  },
  {
    id: 'student-7',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@university.edu',
    xp: 12400,
    riskLevel: 'yellow',
    lastLogin: '2 days ago',
    resumeScore: 'B',
    cohort: 'Class of 2026',
    major: 'Business',
    interviews: [],
    notes: [
      { id: 1, text: 'Working on networking skills', date: '1 week ago' }
    ],
    nextMeeting: { topic: 'Networking Workshop', time: '1:00 PM', date: 'Tomorrow' }
  },
  {
    id: 'student-8',
    name: 'David Park',
    email: 'david.park@university.edu',
    xp: 6200,
    riskLevel: 'red',
    lastLogin: '1 week ago',
    resumeScore: 'D',
    cohort: 'Class of 2026',
    major: 'Tech',
    interviews: [],
    notes: [
      { id: 1, text: 'Needs immediate intervention - very low engagement', date: '3 days ago' }
    ],
    nextMeeting: { topic: 'Check-in Meeting', time: '9:00 AM', date: 'Today' }
  },
  {
    id: 'student-9',
    name: 'Rachel Green',
    email: 'rachel.green@university.edu',
    xp: 19800,
    riskLevel: 'green',
    lastLogin: '6 hours ago',
    resumeScore: 'A',
    cohort: 'Class of 2025',
    major: 'Business',
    interviews: [
      { date: '2024-01-09', score: 83, type: 'Behavioral' }
    ],
    notes: [],
    nextMeeting: null
  },
  {
    id: 'student-10',
    name: 'Tom Wilson',
    email: 'tom.wilson@university.edu',
    xp: 14200,
    riskLevel: 'yellow',
    lastLogin: '5 days ago',
    resumeScore: 'C',
    cohort: 'Class of 2025',
    major: 'Tech',
    interviews: [
      { date: '2024-01-07', score: 68, type: 'Technical' }
    ],
    notes: [
      { id: 1, text: 'Improving but needs consistent practice', date: '4 days ago' }
    ],
    nextMeeting: { topic: 'Progress Review', time: '2:30 PM', date: 'Tomorrow' }
  }
];

const mockAlerts = [
  { id: 1, message: "Sarah Wilson hasn't logged in in 10 days", severity: 'high', student: 'Sarah Wilson' },
  { id: 2, message: "David Park missed 2 meetings this week", severity: 'high', student: 'David Park' },
  { id: 3, message: "Tom Wilson resume score dropped to C", severity: 'medium', student: 'Tom Wilson' },
  { id: 4, message: "5 students haven't completed Module 3", severity: 'medium', student: 'Multiple' }
];

// Mock weekly login data for chart
const weeklyLoginData = [
  { week: 'Week 1', logins: 45 },
  { week: 'Week 2', logins: 52 },
  { week: 'Week 3', logins: 38 },
  { week: 'Week 4', logins: 61 },
  { week: 'Week 5', logins: 48 },
  { week: 'Week 6', logins: 55 }
];

// Mock data for different chart types
const allTimeData = {
  'Weekly Logins': {
    'Last 7 Days': [
      { period: 'Day 1', value: 45 },
      { period: 'Day 2', value: 52 },
      { period: 'Day 3', value: 38 },
      { period: 'Day 4', value: 61 },
      { period: 'Day 5', value: 48 },
      { period: 'Day 6', value: 55 },
      { period: 'Day 7', value: 42 }
    ],
    'Last 30 Days': [
      { period: 'Week 1', value: 45 },
      { period: 'Week 2', value: 52 },
      { period: 'Week 3', value: 38 },
      { period: 'Week 4', value: 61 }
    ],
    'Last 90 Days': [
      { period: 'Month 1', value: 180 },
      { period: 'Month 2', value: 220 },
      { period: 'Month 3', value: 195 }
    ]
  },
  'Mock Interview Scores': {
    'Last 7 Days': [
      { period: 'Day 1', value: 78 },
      { period: 'Day 2', value: 82 },
      { period: 'Day 3', value: 75 },
      { period: 'Day 4', value: 88 },
      { period: 'Day 5', value: 85 },
      { period: 'Day 6', value: 91 },
      { period: 'Day 7', value: 87 }
    ],
    'Last 30 Days': [
      { period: 'Week 1', value: 78 },
      { period: 'Week 2', value: 82 },
      { period: 'Week 3', value: 75 },
      { period: 'Week 4', value: 88 }
    ],
    'Last 90 Days': [
      { period: 'Month 1', value: 76 },
      { period: 'Month 2', value: 83 },
      { period: 'Month 3', value: 89 }
    ]
  },
  'XP by Date': {
    'Last 7 Days': [
      { period: 'Day 1', value: 1200 },
      { period: 'Day 2', value: 1450 },
      { period: 'Day 3', value: 980 },
      { period: 'Day 4', value: 1680 },
      { period: 'Day 5', value: 1320 },
      { period: 'Day 6', value: 1540 },
      { period: 'Day 7', value: 1380 }
    ],
    'Last 30 Days': [
      { period: 'Week 1', value: 1200 },
      { period: 'Week 2', value: 1450 },
      { period: 'Week 3', value: 980 },
      { period: 'Week 4', value: 1680 }
    ],
    'Last 90 Days': [
      { period: 'Month 1', value: 4800 },
      { period: 'Month 2', value: 5200 },
      { period: 'Month 3', value: 4650 }
    ]
  }
};
interface AdvisorDashboardProps {
  onBackToStudent: () => void;
  onViewStudentProfile: (studentId: string) => void;
}

export default function AdvisorDashboard({ onBackToStudent, onViewStudentProfile }: AdvisorDashboardProps) {
  const [chartType, setChartType] = useState('Weekly Logins');
  const [cohortFilter, setCohortFilter] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [showQuickProfile, setShowQuickProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  // Filter students based on search and cohort
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = cohortFilter === 'All Students' || student.cohort === cohortFilter || student.major === cohortFilter;
    return matchesSearch && matchesCohort;
  });

  // Calculate overview data based on filtered students
  const overviewData = {
    studentsAtRisk: filteredStudents.filter(s => s.riskLevel === 'red').length,
    followUpNeeded: filteredStudents.filter(s => s.lastLogin.includes('days ago') && parseInt(s.lastLogin) > 2).length,
    avgXPPerWeek: Math.round(filteredStudents.reduce((acc, s) => acc + s.xp, 0) / filteredStudents.length / 4)
  };

  const riskAssessment = {
    onTrack: filteredStudents.filter(s => s.riskLevel === 'green').length,
    inconsistent: filteredStudents.filter(s => s.riskLevel === 'yellow').length,
    atRisk: filteredStudents.filter(s => s.riskLevel === 'red').length
  };

  // Top 5 students by XP for leaderboard
  const topStudents = [...filteredStudents]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  const activeAlerts = mockAlerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setShowQuickProfile(true);
    setSearchQuery('');
  };

  const dismissAlert = (alertId: number) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const exportData = (format: string) => {
    console.log(`Exporting data as ${format}...`);
    setShowExportMenu(false);
  };

  const getChartData = () => {
    return allTimeData[chartType]?.[timeRange] || allTimeData['Weekly Logins']['Last 30 Days'];
  };

  const getYAxisLabel = () => {
    switch (chartType) {
      case 'Mock Interview Scores':
        return 'Average Score';
      case 'XP by Date':
        return 'XP Gained';
      default:
        return 'Number of Logins';
    }
  };

  const getDataKey = () => {
    return 'value';
  };

  const formatYValue = (value: number) => {
    if (chartType === 'XP by Date') {
      return `${(value / 1000).toFixed(1)}k XP`;
    }
    return value.toString();
  };
  return (
    <div className="min-h-screen bg-[#EAF4F1] p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToStudent}
              className="flex items-center space-x-2 text-[#6B7280] hover:text-[#1B3D2F] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Student View</span>
            </button>
            <h1 className="text-4xl font-bold text-[#1B3D2F]">Advisor Dashboard</h1>
          </div>
          
          {/* Top Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Student Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] focus:border-transparent bg-white"
                />
              </div>
              
              {/* Search Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredStudents.slice(0, 5).map(student => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1B3D2F]">{student.name}</p>
                        <p className="text-sm text-[#6B7280]">{student.xp.toLocaleString()} XP</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm font-medium text-[#1B3D2F]">Export</span>
                <ChevronDown className="w-4 h-4 text-[#6B7280]" />
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
                  <button
                    onClick={() => exportData('PDF')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportData('CSV')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cohort Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-[#6B7280]">Filter by:</label>
            <div className="relative">
              <select 
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
              >
                <option>All Students</option>
                <option>Class of 2025</option>
                <option>Class of 2026</option>
                <option>Business</option>
                <option>Tech</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#1B3D2F] rounded-full flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B3D2F]">Add Note</h3>
                  <p className="text-sm text-[#6B7280]">Record student observations</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#A7D7C5] rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#1B3D2F]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B3D2F]">Send Message</h3>
                  <p className="text-sm text-[#6B7280]">Contact students directly</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#F6C28B] rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#1B3D2F]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B3D2F]">View Student Profile</h3>
                  <p className="text-sm text-[#6B7280]">Access detailed profiles</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Weekly Logins Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1B3D2F]">Weekly Login Trends</h3>
              
              <div className="flex items-center space-x-4">
                {/* DataCamp-style Toggle */}
                <div className="flex bg-gray-100 rounded-full p-1">
                  {['Weekly Logins', 'Mock Interview Scores', 'XP by Date'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setChartType(option)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        chartType === option
                          ? 'bg-[#1B3D2F] text-white shadow-sm'
                          : 'text-[#6B7280] hover:text-[#1B3D2F]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {/* Time Range Dropdown */}
                <div className="relative">
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] focus:border-transparent"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Enhanced Chart with increased height */}
            <div className="h-80 relative bg-gray-50 rounded-lg p-6">
              <svg className="w-full h-full" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1B3D2F" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1B3D2F" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <line
                    key={i}
                    x1="80"
                    y1={30 + (i * 40)}
                    x2="520"
                    y2={30 + (i * 40)}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}
                
                {/* Y-axis */}
                <line x1="80" y1="30" x2="80" y2="230" stroke="#9CA3AF" strokeWidth="2"/>
                
                {/* X-axis */}
                <line x1="80" y1="230" x2="520" y2="230" stroke="#9CA3AF" strokeWidth="2"/>
                
                {/* Y-axis labels */}
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const maxValue = Math.max(...getChartData().map(d => d.value));
                  const yValue = (maxValue / 5) * (5 - index);
                  return (
                    <text
                      key={index}
                      x="70"
                      y={38 + (index * 40)}
                      textAnchor="end"
                      className="text-xs fill-[#6B7280]"
                    >
                      {chartType === 'XP by Date' ? `${(yValue / 1000).toFixed(1)}k` : Math.round(yValue)}
                    </text>
                  );
                })}
                
                {/* Data visualization */}
                {(() => {
                  const data = getChartData();
                  const maxValue = Math.max(...data.map(d => d.value));
                  const points = data.map((point, index) => {
                    const x = 100 + (index * (400 / (data.length - 1)));
                    const y = 230 - ((point.value / maxValue) * 180);
                    return `${x},${y}`;
                  }).join(' ');
                  
                  return (
                    <>
                      {/* Area under curve */}
                      <polygon
                        points={`${points} ${100 + ((data.length - 1) * (400 / (data.length - 1)))},230 100,230`}
                        fill="url(#chartGradient)"
                      />
                      
                      {/* Data line */}
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#1B3D2F"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points with hover effect */}
                      {data.map((point, index) => {
                        const x = 100 + (index * (400 / (data.length - 1)));
                        const y = 230 - ((point.value / maxValue) * 180);
                        return (
                          <g key={index}>
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill="#1B3D2F"
                              className="cursor-pointer"
                            />
                            {/* Tooltip on hover */}
                            <title>{`${point.period}: ${formatYValue(point.value)}`}</title>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
                
                {/* X-axis labels */}
                {getChartData().map((point, index) => (
                  <text
                    key={index}
                    x={100 + (index * (400 / (getChartData().length - 1)))}
                    y={250}
                    textAnchor="middle"
                    className="text-xs fill-[#6B7280]"
                  >
                    {point.period}
                  </text>
                ))}
                
                {/* Y-axis title */}
                <text
                  x="20"
                  y="130"
                  textAnchor="middle"
                  className="text-xs fill-[#6B7280]"
                  transform="rotate(-90, 25, 175)"
                >
                  {getYAxisLabel()}
                </text>
                
                {/* X-axis title */}
                <text
                  x="300"
                  y="270"
                  textAnchor="middle"
                  className="text-xs fill-[#6B7280]"
                >
                  {timeRange}
                </text>
              </svg>
              
              {/* Chart Legend */}
             <div className="absolute top-2 right-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#1B3D2F] rounded-full"></div>
                 <span
                    className="text-xs text-[#6B7280] font-medium"
                  >
                    {chartType}
                 </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* XP Leaderboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#1B3D2F] mb-6">XP Leaderboard</h3>
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <button
                    key={student.id}
                    onClick={() => onViewStudentProfile(student.id)}
                    className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-[#1B3D2F]">{student.name}</p>
                      <p className="text-sm text-[#6B7280]">{student.xp.toLocaleString()} XP</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Students at Risk Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#1B3D2F] mb-6">Students at Risk</h3>
              
              <div className="space-y-4">
                <div className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#1B3D2F]">Low Risk</span>
                    <span className="text-sm font-bold text-[#1B3D2F]">{riskAssessment.onTrack}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(riskAssessment.onTrack / filteredStudents.length) * 100}%` }}></div>
                  </div>
                </div>

                <div className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#1B3D2F]">Medium Risk</span>
                    <span className="text-sm font-bold text-[#1B3D2F]">{riskAssessment.inconsistent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${(riskAssessment.inconsistent / filteredStudents.length) * 100}%` }}></div>
                  </div>
                </div>

                <div className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#1B3D2F]">High Risk</span>
                    <span className="text-sm font-bold text-[#1B3D2F]">{riskAssessment.atRisk}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${(riskAssessment.atRisk / filteredStudents.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Profile Modal */}
      {showQuickProfile && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1B3D2F]">Quick Profile</h3>
              <button
                onClick={() => setShowQuickProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-[#1B3D2F]">{selectedStudent.name}</h4>
              <p className="text-sm text-[#6B7280]">{selectedStudent.email}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B7280]">XP Total</span>
                <span className="font-bold text-[#1B3D2F]">{selectedStudent.xp.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B7280]">Risk Level</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedStudent.riskLevel === 'green' ? 'bg-green-100 text-green-800' :
                  selectedStudent.riskLevel === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedStudent.riskLevel === 'green' ? 'Low Risk' :
                   selectedStudent.riskLevel === 'yellow' ? 'Medium Risk' : 'High Risk'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6B7280]">Last Login</span>
                <span className="text-sm text-[#1B3D2F]">{selectedStudent.lastLogin}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setShowQuickProfile(false);
                  onViewStudentProfile(selectedStudent.id);
                }}
                className="flex-1 bg-[#1B3D2F] text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                View Full Profile
              </button>
              <button className="flex-1 bg-gray-100 text-[#1B3D2F] py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}