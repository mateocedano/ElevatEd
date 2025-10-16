import React from 'react';
import { Calendar, Clock, GraduationCap } from 'lucide-react';

const upcomingMeetings = [
  {
    time: '8:00 am',
    title: 'Career Meeting',
    attendees: 'Mateo + John',
    type: 'meeting'
  },
  {
    time: '11:00 am',
    title: 'Resume Discussion',
    attendees: 'Mateo + Karty',
    type: 'discussion'
  },
  {
    time: '3:00 pm',
    title: 'Mock Interview',
    attendees: '',
    type: 'interview'
  }
];

const challenges = [
  {
    title: 'Apply to 3 jobs',
    progress: { current: 1, total: 3 },
    icon: GraduationCap
  },
  {
    title: 'Reach out to 2 employers',
    progress: { current: 1, total: 2 },
    icon: GraduationCap
  },
  {
    title: 'Sign up for 1 career fair',
    progress: { current: 0, total: 1 },
    icon: GraduationCap
  }
];

export default function RightSidebar() {
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDayOfWeek = today.getDay();

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - currentDayOfWeek + i);
    weekDays.push(date.getDate());
  }

  return (
    <div className="w-80 space-y-6 h-full">
      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1B3D2F]">{currentMonth} {currentYear}</h3>
          <Calendar className="w-5 h-5 text-[#6B7280]" />
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-[#6B7280] font-medium py-2">
              {day.slice(0, 3)}
            </div>
          ))}

          {weekDays.map((day, index) => (
            <div key={index} className={`py-2 rounded-lg ${
              day === currentDate ? 'bg-[#1B3D2F] text-white font-semibold' :
              'text-[#1B3D2F] hover:bg-gray-50 cursor-pointer'
            }`}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-[#1B3D2F] mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          {upcomingMeetings.map((meeting, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-[#1B3D2F] rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#6B7280]">{meeting.time}</span>
                </div>
                <p className="font-semibold text-[#1B3D2F]">{meeting.title}</p>
                {meeting.attendees && (
                  <p className="text-sm text-[#6B7280]">{meeting.attendees}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Challenges */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-[#1B3D2F] mb-4">Monthly Challenges</h3>
        <div className="space-y-4">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const progressPercentage = (challenge.progress.current / challenge.progress.total) * 100;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      challenge.progress.current === challenge.progress.total 
                        ? 'bg-[#1B3D2F]' 
                        : 'bg-gray-300'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#1B3D2F]">{challenge.title}</span>
                  </div>
                  <span className="text-sm font-bold text-[#F6C28B]">
                    {challenge.progress.current}/{challenge.progress.total}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[#DDE5E1] rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${progressPercentage}%`,
                      background: 'linear-gradient(to right, #1B3D2F, #A7D7C5)'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}