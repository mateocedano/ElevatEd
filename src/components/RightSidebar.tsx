import React from 'react';
import { Calendar, Clock } from 'lucide-react';

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
          <h3 className="text-lg font-semibold text-[#3E5B45]">{currentMonth} {currentYear}</h3>
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
              day === currentDate ? 'bg-[#3E5B45] text-white font-semibold' :
              'text-[#3E5B45] hover:bg-gray-50 cursor-pointer'
            }`}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-[#3E5B45] mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          {upcomingMeetings.map((meeting, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-[#3E5B45] rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#6B7280]">{meeting.time}</span>
                </div>
                <p className="font-semibold text-[#3E5B45]">{meeting.title}</p>
                {meeting.attendees && (
                  <p className="text-sm text-[#6B7280]">{meeting.attendees}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}