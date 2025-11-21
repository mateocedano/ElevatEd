import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  format,
  addMonths,
  isToday,
  isBefore,
  startOfDay,
  isWeekend,
} from 'date-fns';

interface CalendarDatePickerProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  availability: Array<{ dateString: string; dayOfWeek: string; slots: Array<{ time: string; available: boolean }> }>;
}

export default function CalendarDatePicker({
  selectedDate,
  onDateSelect,
  availability,
}: CalendarDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const availableDates = new Set(availability.map((d) => d.dateString));
  const today = startOfDay(new Date());

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return isBefore(date, today) || !availableDates.has(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
        </button>

        <h3 className="text-lg font-semibold text-[#1B3D2F]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="text-xs font-semibold text-[#6B7280] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 p-2 border border-gray-200 rounded-lg bg-white">
        {calendarDays.map((day, index) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = dateStr === selectedDate;
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onDateSelect(dateStr)}
              disabled={isDisabled}
              className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#1B3D2F] text-white'
                  : isTodayDate
                    ? 'border-2 border-[#1B3D2F] text-[#1B3D2F]'
                    : isCurrentMonth
                      ? isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#1B3D2F] hover:bg-gray-100 cursor-pointer'
                      : 'text-gray-300'
              }`}
              title={isDisabled && isCurrentMonth ? 'No availability' : ''}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-sm text-[#6B7280] text-center">
          Selected: <span className="font-semibold text-[#1B3D2F]">
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
      )}
    </div>
  );
}
