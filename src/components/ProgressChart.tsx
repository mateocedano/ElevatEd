import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';

const weeklyData = [
  { day: 'S', xp: 4725, active: false },
  { day: 'M', xp: 13250, active: true },
  { day: 'T', xp: 24000, active: true },
  { day: 'W', xp: 0, active: true },
  { day: 'T', xp: 0, active: false },
  { day: 'F', xp: 0, active: false },
  { day: 'S', xp: 0, active: false }
];

export default function ProgressChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1B3D2F]">Progress</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[32px] font-semibold">
              <span className="text-[#1A73E8]">24,450</span>
              <span className="text-[#1B3D2F]"> XP</span>
            </span>
            <TrendingUp className="w-5 h-5 text-[#1B3D2F]" />
          </div>
        </div>
        <div className="flex flex-col items-end space-y-4">
          {/* Streak indicator */}
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#F6C28B]" />
            <div className="text-center">
              <span className="text-base font-medium text-[#6B7280] uppercase tracking-[0.5px]">
                12 day streak
              </span>
            </div>
          </div>
          
          {/* Days of the week */}
          <div className="flex items-center space-x-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className={`w-3 h-3 rounded-full mb-1 ${
                day.active ? 'bg-[#1B3D2F]' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm font-medium text-[#6B7280]">{day.day}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
      
      {/* Progress Chart */}
      <div className="relative flex-1 min-h-[160px] flex items-end">
        <svg className="w-full h-full" viewBox="0 0 280 120">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B3D2F" />
              <stop offset="100%" stopColor="#A7D7C5" />
            </linearGradient>
          </defs>
          
          {/* Progress Line */}
          <polyline
            points="30,90 130,70 230,40"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data Points */}
          <circle cx="30" cy="90" r="4" fill="#1B3D2F" />
          <circle cx="130" cy="70" r="4" fill="#1B3D2F" />
          <circle cx="230" cy="40" r="4" fill="#A7D7C5" />
          
          {/* XP Labels */}
          <text x="30" y="110" textAnchor="middle" className="text-xs font-normal fill-[#6B7280]">4,725 XP</text>
          <text x="130" y="110" textAnchor="middle" className="text-xs font-normal fill-[#6B7280]">13,250 XP</text>
          <text x="230" y="110" textAnchor="middle" className="text-xs font-normal fill-[#6B7280]">24,000 XP</text>
        </svg>
      </div>
    </div>
  );
}