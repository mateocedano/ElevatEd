import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CalendarEvent } from '../../hooks/useCalendarState';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  initialEvent?: CalendarEvent;
  defaultStartTime?: Date;
}

const COLORS: CalendarEvent['color'][] = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'];

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  defaultStartTime,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setTitle(initialEvent.title);
        setDescription(initialEvent.description || '');
        setLocation(initialEvent.location || '');
        setColor(initialEvent.color);
        setStartTime(initialEvent.startTime);
        setEndTime(initialEvent.endTime);
        setIsAllDay(initialEvent.isAllDay || false);
      } else if (defaultStartTime) {
        setTitle('');
        setDescription('');
        setLocation('');
        setColor('blue');
        setStartTime(defaultStartTime);
        const end = new Date(defaultStartTime);
        end.setHours(end.getHours() + 1);
        setEndTime(end);
        setIsAllDay(false);
      }
    }
  }, [isOpen, initialEvent, defaultStartTime]);

  const handleSave = () => {
    if (!title.trim()) return;

    const event: CalendarEvent = {
      id: initialEvent?.id || `event-${Date.now()}`,
      title,
      description: description || undefined,
      location: location || undefined,
      startTime,
      endTime,
      color,
      isAllDay,
    };

    onSave(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {initialEvent ? 'Edit Event' : 'Create Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
              All day
            </label>
          </div>

          {/* Start Time */}
          {!isAllDay && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={format(startTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setStartTime(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={format(endTime, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setEndTime(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                />
              </div>
            </>
          )}

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                  } ${
                    c === 'blue'
                      ? 'bg-blue-500'
                      : c === 'red'
                        ? 'bg-red-500'
                        : c === 'green'
                          ? 'bg-green-500'
                          : c === 'yellow'
                            ? 'bg-yellow-500'
                            : c === 'purple'
                              ? 'bg-purple-500'
                              : 'bg-orange-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2 bg-[#1B3D2F] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Event
          </button>
        </div>

        <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-scale-in {
            animation: scale-in 0.2s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}
