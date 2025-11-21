import React, { useEffect, useRef } from 'react';
import { format, isToday } from 'date-fns';

interface WeekGridProps {
  weekDays: Date[];
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 5);

export default function WeekGrid({ weekDays }: WeekGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const nowLineRef = useRef<HTMLDivElement>(null);
  const todayIndex = weekDays.findIndex((d) => isToday(d));

  useEffect(() => {
    if (gridRef.current) {
      const eightAmOffset = (8 - 5) * 56;
      gridRef.current.scrollTop = eightAmOffset;
    }
  }, []);

  useEffect(() => {
    const updateNowLine = () => {
      if (nowLineRef.current && todayIndex !== -1) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours >= 5 && hours < 23) {
          const hourOffset = (hours - 5) * 56;
          const minuteOffset = (minutes / 60) * 56;
          const topPosition = hourOffset + minuteOffset;

          const dayColumnWidth = 100 / 5;
          const leftPosition = dayColumnWidth * todayIndex;
          const lineWidth = dayColumnWidth;

          nowLineRef.current.style.top = `${topPosition}px`;
          nowLineRef.current.style.left = `${leftPosition}%`;
          nowLineRef.current.style.width = `${lineWidth}%`;
          nowLineRef.current.style.display = 'block';
        } else {
          nowLineRef.current.style.display = 'none';
        }
      }
    };

    updateNowLine();
    const interval = setInterval(updateNowLine, 60000);

    return () => clearInterval(interval);
  }, [todayIndex]);

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      {/* Day Headers */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex">
          <div className="w-16 flex-shrink-0"></div>
          {weekDays.map((day) => {
            const today = isToday(day);
            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className="flex-1 py-3 text-center border-l border-gray-200"
              >
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-2xl font-normal mt-1 ${
                    today
                      ? 'bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center mx-auto'
                      : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All-day Row */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex h-9">
          <div className="w-16 flex-shrink-0 text-xs text-gray-500 pr-2 pt-1 text-right">
          </div>
          {weekDays.map((day) => (
            <div
              key={`all-day-${format(day, 'yyyy-MM-dd')}`}
              className="flex-1 border-l border-gray-200"
            ></div>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div ref={gridRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="flex min-h-full">
          {/* Time Gutter */}
          <div className="w-16 flex-shrink-0 relative">
            {HOURS.map((hour, idx) => (
              <div key={hour} className="relative h-14">
                <div className="absolute -top-2.5 right-2 text-xs text-gray-500">
                  {format(new Date().setHours(hour, 0), 'ha')}
                </div>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 relative">
            <div className="flex h-full">
              {weekDays.map((day) => (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className="flex-1 border-l border-gray-200 relative"
                >
                  {HOURS.map((hour) => (
                    <div
                      key={`${format(day, 'yyyy-MM-dd')}-${hour}`}
                      className="h-14 border-t border-gray-200 relative"
                    >
                      <div className="absolute top-1/2 left-0 right-0 border-t border-gray-100"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Now Line */}
            {todayIndex !== -1 && (
              <div
                ref={nowLineRef}
                className="absolute h-0.5 bg-red-500 pointer-events-none z-10"
                style={{ display: 'none' }}
              >
                <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
