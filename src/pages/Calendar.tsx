import React from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarState } from '../hooks/useCalendarState';
import WeekGrid from '../components/calendar/WeekGrid';

interface CalendarPageProps {
  onBackToDashboard?: () => void;
}

export default function CalendarPage({ onBackToDashboard }: CalendarPageProps) {
  const {
    weekStart,
    weekEnd,
    weekDays,
    timezone,
    availableTimezones,
    setTimezone,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
  } = useCalendarState();

  const formatTimezoneLabel = (tz: string) => {
    if (tz === 'UTC') return 'UTC';
    if (tz.includes('New_York')) return 'ET';
    if (tz.includes('Chicago')) return 'CT';
    if (tz.includes('Denver')) return 'MT';
    if (tz.includes('Los_Angeles')) return 'PT';
    return tz.split('/').pop()?.replace('_', ' ') || tz;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Back Button */}
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>

          {/* Center: Navigation & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Today
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <h1 className="text-xl font-normal text-gray-900 min-w-max">
              {format(weekStart, 'MMMM d')} – {format(weekEnd, 'd, yyyy')}
            </h1>
          </div>

          {/* Right: Timezone */}
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {availableTimezones.map((tz) => (
              <option key={tz} value={tz}>
                {formatTimezoneLabel(tz)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Grid */}
      <WeekGrid weekDays={weekDays} />
    </div>
  );
}
