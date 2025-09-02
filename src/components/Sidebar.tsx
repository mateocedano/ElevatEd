import React from 'react';
import { 
  Home, 
  Bell, 
  Calendar, 
  BookOpen, 
  Users, 
  Briefcase, 
  Settings,
  GraduationCap,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'lessons', icon: BookOpen, label: 'Lessons' },
    { id: 'career-resources', icon: Users, label: 'Career Resources' },
    { id: 'job-matches', icon: Briefcase, label: 'Job Matches' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'advisor-view', icon: UserCheck, label: 'Advisor View' },
  ];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg p-6 h-full">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
            alt="Jane Doe"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-[#1B3D2F]">Jane Doe</h3>
          <p className="text-sm text-[#6B7280]">Student</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#1B3D2F] to-[#A7D7C5] text-white shadow-lg' 
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1B3D2F]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}