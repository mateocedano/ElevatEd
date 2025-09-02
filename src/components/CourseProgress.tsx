import React from 'react';
import { Clock } from 'lucide-react';

interface CourseProgressProps {
  onContinue: () => void;
  onCourseClick: () => void;
}

export default function CourseProgress({ onContinue, onCourseClick }: CourseProgressProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <div className="mb-4">
        <p className="text-base font-medium text-[#1B3D2F] mb-2">Course</p>
        <button 
          onClick={onCourseClick}
          className="text-2xl font-bold text-[#1B3D2F] mb-4 hover:text-opacity-80 transition-colors duration-200 text-left"
        >
          Resume and LinkedIn
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-4">
          {/* Progress Bar */}
          <div className="w-full bg-[#DDE5E1] rounded-full h-3 mb-3">
            <div 
              className="h-3 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: '65%',
                background: 'linear-gradient(to right, #1B3D2F, #A7D7C5)'
              }}
            ></div>
          </div>
          
          {/* Time remaining */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">1 hr 30 min left...</span>
          </div>
        </div>
        
        {/* Continue Button */}
        <button 
          onClick={onContinue}
          className="bg-[#F6C28B] text-[#1B1F23] font-bold text-base px-5 py-2 rounded-full hover:shadow-md transition-all duration-200 hover:scale-105 whitespace-nowrap" 
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}