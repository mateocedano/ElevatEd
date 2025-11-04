import React, { useEffect, useRef } from 'react';
import { format, isToday, isSameDay } from 'date-fns';
import { CalendarEvent } from '../../hooks/useCalendarState';

interface WeekGridProps {
  weekDays: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number, minutes: number) => void;
  getEventsForDay: (date: Date) => CalendarEvent[];
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 5);
const COLOR_MAP: Record<CalendarEvent['color'], string> = {
  blue: 'bg-blue-100 border-l-4 border-blue-500 text-blue-900',
  red: 'bg-red-100 border-l-4 border-red-500 text-red-900',
  green: 'bg-green-100 border-l-4 border-green-500 text-green-900',
  yellow: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900',
  purple: 'bg-purple-100 border-l-4 border-purple-500 text-purple-900',
  orange: 'bg-orange-100 border-l-4 border-orange-500 text-orange-900',
};

export default function WeekGrid({
  weekDays,
  events,
  onEventClick,
  onSlotClick,
  getEventsForDay,
}: WeekGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const nowLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const eightAmOffset = 3 * 60 * 2;
      gridRef.current.scrollTop = eightAmOffset;
    }
  }, [weekDays]);

  useEffect(() => {
    const updateNowLine = () => {
      if (nowLineRef.current) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours >= 5 && hours < 23) {
          const hourOffset = (hours - 5) * 120;
          const minuteOffset = (minutes / 60) * 120;
          const topPosition = hourOffset + minuteOffset;

          nowLineRef.current.style.top = `${topPosition + 60}px`;
          nowLineRef.current.style.display = 'block';
        } else {
          nowLineRef.current.style.display = 'none';
        }
      }
    };

    updateNowLine();
    const interval = setInterval(updateNowLine, 60000);

    return () => clearInterval(interval);
  }, []);

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.startTime.getHours();
    const startMinutes = event.startTime.getMinutes();
    const endHour = event.endTime.getHours();
    const endMinutes = event.endTime.getMinutes();

    const startOffset = (startHour - 5) * 120 + (startMinutes / 60) * 120;
    const durationMinutes =
      (endHour - startHour) * 60 + (endMinutes - startMinutes);
    const height = (durationMinutes / 60) * 120;

    return { startOffset, height };
  };

  const getOverlappingEvents = (date: Date, hour: number) => {
    return getEventsForDay(date).filter((event) => {
      const eventStartHour = event.startTime.getHours();
      const eventEndHour = event.endTime.getHours();
      const eventEndMinutes = event.endTime.getMinutes();

      if (eventEndHour === hour && eventEndMinutes === 0) return false;
      if (eventStartHour > hour) return false;

      return true;
    });
  };

  return (
    <div className="flex-1 overflow-x-auto bg-white">
      <div ref={gridRef} className="overflow-y-auto h-[calc(100vh-200px)] relative">
        {/* Day Headers */}
        <div className="sticky top-0 bg-white z-20 flex">
          <div className="w-20 flex-shrink-0 border-r border-gray-200"></div>
          {weekDays.map((day) => (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className="flex-1 border-r border-gray-200 p-4 text-center"
            >
              <div className="text-sm font-semibold text-gray-600">
                {format(day, 'EEE').toUpperCase()}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  isToday(day)
                    ? 'bg-[#1B3D2F] text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto'
                    : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* All-day Events */}
        <div className="flex border-b-2 border-gray-200">
          <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-2 text-xs font-medium text-gray-600">
            All day
          </div>
          {weekDays.map((day) => (
            <div
              key={`all-day-${format(day, 'yyyy-MM-dd')}`}
              className="flex-1 border-r border-gray-200 p-2 min-h-12"
            >
              {getEventsForDay(day)
                .filter((e) => e.isAllDay)
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className={`w-full text-xs font-medium p-1 rounded mb-1 cursor-pointer hover:opacity-80 ${COLOR_MAP[event.color]}`}
                  >
                    {event.title}
                  </button>
                ))}
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative flex">
          {/* Time Labels */}
          <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-30 border-b border-gray-200 text-xs text-gray-500 font-medium p-1 text-right pr-2"
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 relative">
            {weekDays.map((day) => (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className="flex-1 border-r border-gray-200 relative"
              >
                {HOURS.map((hour) => (
                  <div
                    key={`${format(day, 'yyyy-MM-dd')}-${hour}`}
                    onClick={() => onSlotClick(day, hour, 0)}
                    className="h-30 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    {/* 30-min divider */}
                    <div className="absolute h-px bg-gray-100 w-full" style={{ top: '50%' }}></div>
                  </div>
                ))}

                {/* Events */}
                {getEventsForDay(day)
                  .filter((e) => !e.isAllDay)
                  .map((event) => {
                    const { startOffset, height } = getEventPosition(event);
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`absolute left-1 right-1 text-xs font-medium p-1 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${COLOR_MAP[event.color]}`}
                        style={{
                          top: `${startOffset + 60}px`,
                          height: `${Math.max(height, 30)}px`,
                        }}
                        title={event.title}
                      >
                        <div className="truncate">{event.title}</div>
                        {height >= 40 && (
                          <div className="text-xs opacity-80 truncate">
                            {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}

            {/* Now Line */}
            <div
              ref={nowLineRef}
              className="absolute left-0 right-0 h-1 bg-red-500 pointer-events-none z-10"
              style={{ display: 'none' }}
            >
              <div className="absolute left-0 w-3 h-3 bg-red-500 rounded-full -top-1 -left-1.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
