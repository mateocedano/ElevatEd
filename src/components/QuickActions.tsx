import React from 'react';
import { Calendar, FileText, MessageSquare } from 'lucide-react';

interface QuickActionsProps {
  onStartCourse: () => void;
}

const actions = [
  {
    id: 'meeting',
    title: 'Book Career Meeting',
    icon: Calendar,
    gradient: 'from-[#223C43] to-[#1B3D2F]',
    description: 'Schedule a 1:1 with your advisor'
  },
  {
    id: 'resume',
    title: 'Resumé Review',
    icon: FileText,
    gradient: 'from-[#1C4033] to-[#1B3D2F]',
    description: 'Get AI-powered feedback on your resume'
  },
  {
    id: 'interview',
    title: 'Mock AI Interview',
    icon: MessageSquare,
    gradient: 'from-[#1B3D2F] to-[#A7D7C5]',
    description: 'Practice with our AI interview bot'
  }
];

export default function QuickActions({ onStartCourse }: QuickActionsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1B3D2F] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.id === 'resume' ? onStartCourse : undefined}
              className={`relative overflow-hidden bg-gradient-to-br ${action.gradient} rounded-[10px] p-6 text-white text-left transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)'
              }}
            >
              <div className="relative z-10">
                <Icon className="w-6 h-6 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-base font-bold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}