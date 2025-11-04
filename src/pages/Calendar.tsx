import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useCalendarState, CalendarEvent } from '../hooks/useCalendarState';
import WeekGrid from '../components/calendar/WeekGrid';
import EventModal from '../components/calendar/EventModal';

export default function CalendarPage() {
  const {
    weekStart,
    weekEnd,
    weekDays,
    events,
    timezone,
    availableTimezones,
    setTimezone,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
  } = useCalendarState();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<Date | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDefaultStartTime(null);
    setModalOpen(true);
  };

  const handleSlotClick = (date: Date, hour: number, minutes: number) => {
    const newStart = new Date(date);
    newStart.setHours(hour, minutes);
    const newEnd = new Date(newStart);
    newEnd.setHours(newStart.getHours() + 1);

    setSelectedEvent(null);
    setDefaultStartTime(newStart);
    setModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, event);
    } else {
      addEvent(event);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            {format(weekStart, 'MMMM d')} – {format(weekEnd, 'd, yyyy')}
          </h1>

          {/* Timezone */}
          <div className="flex items-center gap-2">
            <label htmlFor="timezone" className="text-sm font-medium text-gray-600">
              Timezone:
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
            >
              {availableTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <WeekGrid
        weekDays={weekDays}
        events={events}
        onEventClick={handleEventClick}
        onSlotClick={handleSlotClick}
        getEventsForDay={getEventsForDay}
      />

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
          setDefaultStartTime(null);
        }}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent || undefined}
        defaultStartTime={defaultStartTime || undefined}
      />
    </div>
  );
}
