import React from 'react';
import { GraduationCap } from 'lucide-react';

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

export default function MonthlyChallenges() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-[#3E5B45] mb-6">Monthly Challenges</h2>

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
                      ? 'bg-[#3E5B45]'
                      : 'bg-gray-300'
                  }`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#3E5B45]">{challenge.title}</span>
                </div>
                <span className="text-sm font-bold text-[#F6C28B]">
                  {challenge.progress.current}/{challenge.progress.total}
                </span>
              </div>

              <div className="w-full bg-[#E6DCC8] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(to right, #3E5B45, #AEBFAB)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
