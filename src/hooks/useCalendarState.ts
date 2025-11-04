import { useState, useEffect, useCallback } from 'react';
import { startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isToday, format } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';
  isAllDay?: boolean;
}

interface UseCalendarStateReturn {
  weekStart: Date;
  weekEnd: Date;
  weekDays: Date[];
  events: CalendarEvent[];
  timezone: string;
  availableTimezones: string[];
  setTimezone: (tz: string) => void;
  goToToday: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDay: (date: Date) => CalendarEvent[];
  getEventsForSlot: (date: Date, hour: number) => CalendarEvent[];
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team sync',
    location: 'Conference Room A',
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(9, 30, 0, 0)),
    color: 'blue',
  },
  {
    id: '2',
    title: 'Project Review',
    description: 'Q4 project review',
    location: 'Zoom',
    startTime: new Date(new Date().setHours(10, 30, 0, 0)),
    endTime: new Date(new Date().setHours(11, 30, 0, 0)),
    color: 'purple',
  },
  {
    id: '3',
    title: 'Lunch Break',
    description: 'Break time',
    location: 'Cafe',
    startTime: new Date(new Date().setHours(12, 0, 0, 0)),
    endTime: new Date(new Date().setHours(13, 0, 0, 0)),
    color: 'green',
  },
  {
    id: '4',
    title: 'Client Call',
    description: 'Quarterly check-in',
    location: 'Video Call',
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(15, 0, 0, 0)),
    color: 'orange',
  },
  {
    id: '5',
    title: '1:1 with Manager',
    description: 'Performance review',
    location: 'Office',
    startTime: new Date(addDays(new Date(), 1).setHours(15, 30, 0, 0)),
    endTime: new Date(addDays(new Date(), 1).setHours(16, 0, 0, 0)),
    color: 'blue',
  },
];

export function useCalendarState(): UseCalendarStateReturn {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [timezone, setTimezone] = useState<string>(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  const availableTimezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'UTC',
  ];

  const mondayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const fridayOfWeek = endOfWeek(mondayOfWeek, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(mondayOfWeek, i));

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  }, []);

  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const getEventsForDay = useCallback(
    (date: Date) => {
      return events.filter((event) => {
        const eventDate = format(event.startTime, 'yyyy-MM-dd');
        const checkDate = format(date, 'yyyy-MM-dd');
        return eventDate === checkDate;
      });
    },
    [events]
  );

  const getEventsForSlot = useCallback(
    (date: Date, hour: number) => {
      return getEventsForDay(date).filter((event) => {
        const eventStartHour = event.startTime.getHours();
        return eventStartHour === hour && !event.isAllDay;
      });
    },
    [getEventsForDay]
  );

  return {
    weekStart: mondayOfWeek,
    weekEnd: fridayOfWeek,
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
    getEventsForSlot,
  };
}
