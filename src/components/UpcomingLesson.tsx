import React from 'react';
import { BookOpen, Play } from 'lucide-react';

export default function UpcomingLesson() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-[#1B3D2F] mb-6">Up next...</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#F6C28B] to-[#1B3D2F] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-[#1B3D2F] mb-2">Lesson 12:</h3>
        <p className="text-lg text-[#6B7280] mb-8">Salary Negotiations</p>
        
        <button className="bg-[#F6C28B] text-[#1B1F23] px-8 py-3 rounded-full font-semibold flex items-center space-x-2 mx-auto transition-all duration-300 hover:scale-105" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Play className="w-5 h-5" />
          <span>Practice</span>
        </button>
      </div>
    </div>
  );
}