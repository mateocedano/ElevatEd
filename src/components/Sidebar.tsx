import React from 'react';
import {
  Home,
  Bell,
  Calendar,
  BookOpen,
  Users,
  Briefcase,
  Settings,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdvisor?: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isAdvisor = false }: SidebarProps) {
  const studentMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'lessons', icon: BookOpen, label: 'Lessons' },
    { id: 'career-resources', icon: Users, label: 'Career Resources' },
    { id: 'job-matches', icon: Briefcase, label: 'Job Matches' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const advisorMenuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'lessons', icon: BookOpen, label: 'Lessons' },
    { id: 'career-resources', icon: Users, label: 'Career Resources' },
    { id: 'job-matches', icon: Briefcase, label: 'Job Matches' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const menuItems = isAdvisor ? advisorMenuItems : studentMenuItems;

  return (
    <div className="w-64 bg-white rounded-2xl shadow-lg p-6 h-full">
      {/* Navigation Menu */}
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
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