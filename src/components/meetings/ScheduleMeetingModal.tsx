import React, { useState, useEffect, useRef } from 'react';
import { X, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { useAvailability } from './useAvailability';

interface BookingDetails {
  name: string;
  email: string;
  notes: string;
  resumeUrl: string;
}

interface SelectedSlot {
  date: string;
  time: string;
}

type Step = 'calendar' | 'details' | 'success';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [step, setStep] = useState<Step>('calendar');
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [timezone, setTimezone] = useState('Eastern Time (ET)');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    name: '',
    email: '',
    notes: '',
    resumeUrl: '',
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { generateAvailability, timeZones } = useAvailability();
  const availability = generateAvailability();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleBackdropClick = (e: MouseEvent) => {
      if (modalRef.current === e.target) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleBackdropClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleBackdropClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSlotSelect = (dateString: string, time: string) => {
    setSelectedSlot({ date: dateString, time });
    setStep('details');
  };

  const handleBookingDetailsChange = (field: keyof BookingDetails, value: string) => {
    setBookingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = () => {
    if (bookingDetails.name && bookingDetails.email && selectedSlot) {
      setStep('success');
    }
  };

  const generateICS = () => {
    if (!selectedSlot) return '';

    const [month, day, year] = selectedSlot.date.split('-');
    const [time, period] = selectedSlot.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const finalHours = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;

    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), finalHours, minutes);
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ElevatEd//Career Meeting//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:meeting-${Date.now()}@elevated.app
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Career Meeting with Appleseed Coaching
DESCRIPTION:${bookingDetails.notes || 'Career coaching session'}
LOCATION:Video Call
ATTENDEE:${bookingDetails.email}
ORGANIZER:CN=Appleseed Coaching:mailto:coaching@elevated.app
END:VEVENT
END:VCALENDAR`;
  };

  const downloadICS = () => {
    const ics = generateICS();
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-meeting.ics';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateGoogleCalendarLink = () => {
    if (!selectedSlot) return '#';

    const [month, day, year] = selectedSlot.date.split('-');
    const [time] = selectedSlot.time.split(' ');
    const [hours, minutes] = time.split(':');

    const startDate = `${year}${month}${day}T${hours}${minutes}00`;
    const endDate = `${year}${month}${day}T${String(parseInt(hours) + 1).padStart(2, '0')}${minutes}00`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Career Meeting with Appleseed Coaching',
      dates: `${startDate}/${endDate}`,
      details: bookingDetails.notes || 'Career coaching session',
      location: 'Video Call',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateOutlookLink = () => {
    if (!selectedSlot) return '#';

    const [month, day, year] = selectedSlot.date.split('-');
    const [time] = selectedSlot.time.split(' ');

    const params = new URLSearchParams({
      subject: 'Career Meeting with Appleseed Coaching',
      startdt: `${year}-${month}-${day}T${time}:00`,
      body: bookingDetails.notes || 'Career coaching session',
      location: 'Video Call',
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              AC
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1B3D2F]">Appleseed Coaching</h2>
              <p className="text-sm text-[#6B7280]">Career Meeting · 30 min · Video Call</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Left Column - Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-[#1B3D2F] mb-2">About this meeting</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    Join Appleseed Coaching for a personalized career consultation. Discuss your goals, explore opportunities, and develop an action plan for your professional growth.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B3D2F] mb-2">Location</h3>
                  <p className="text-sm text-[#6B7280]">Video Call</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-[#6B7280]">Powered by ElevatEd</p>
                </div>
              </div>

              {/* Right Column - Scheduler */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timezone Selector */}
                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-2">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#1B3D2F] focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                  >
                    {timeZones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Grid */}
                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-3">
                    Select a date
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {availability.slice(0, 14).map((day) => (
                      <button
                        key={day.dateString}
                        onClick={() => setSelectedDate(day.dateString)}
                        className={`py-2 text-xs font-medium rounded-lg transition-colors ${
                          selectedDate === day.dateString
                            ? 'bg-[#1B3D2F] text-white'
                            : 'border border-gray-200 text-[#1B3D2F] hover:border-[#1B3D2F]'
                        }`}
                      >
                        <div>{day.dayOfWeek}</div>
                        <div>{new Date(day.date).getDate()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-[#1B3D2F] mb-3">
                      Select a time
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availability
                        .find((d) => d.dateString === selectedDate)
                        ?.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              slot.available && handleSlotSelect(selectedDate, slot.time)
                            }
                            disabled={!slot.available}
                            className={`py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                              slot.available
                                ? 'bg-gray-50 border border-gray-200 text-[#1B3D2F] hover:border-[#1B3D2F] cursor-pointer'
                                : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Left Column - Summary */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#1B3D2F] mb-3">Your selection</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-[#6B7280]">Date</p>
                      <p className="font-medium text-[#1B3D2F]">
                        {new Date(selectedSlot!.date).toLocaleDateString('default', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">Time</p>
                      <p className="font-medium text-[#1B3D2F]">{selectedSlot!.time}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280]">Timezone</p>
                      <p className="font-medium text-[#1B3D2F]">{timezone}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('calendar')}
                  className="w-full py-2 text-sm text-[#1B3D2F] hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  Change time
                </button>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={bookingDetails.name}
                    onChange={(e) => handleBookingDetailsChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#1B3D2F] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                    placeholder="John Appleseed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={bookingDetails.email}
                    onChange={(e) => handleBookingDetailsChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#1B3D2F] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    value={bookingDetails.resumeUrl}
                    onChange={(e) => handleBookingDetailsChange('resumeUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#1B3D2F] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1B3D2F] mb-2">
                    Notes
                  </label>
                  <textarea
                    value={bookingDetails.notes}
                    onChange={(e) => handleBookingDetailsChange('notes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-[#1B3D2F] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3D2F] resize-none"
                    placeholder="Tell us what you'd like to discuss..."
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={!bookingDetails.name || !bookingDetails.email}
                  className="w-full py-3 bg-[#1B3D2F] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Confirm booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-[#A7D7C5] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B3D2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-[#1B3D2F] mb-2">Booking confirmed</h3>
                <p className="text-[#6B7280]">A confirmation email has been sent to {bookingDetails.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 w-full text-left space-y-2">
                <div>
                  <p className="text-xs text-[#6B7280] uppercase tracking-wide">Career Meeting</p>
                  <p className="font-medium text-[#1B3D2F]">
                    {new Date(selectedSlot!.date).toLocaleDateString('default', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {selectedSlot!.time}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280]">Video Call • {timezone}</p>
              </div>

              <div className="w-full space-y-2">
                <p className="text-sm font-medium text-[#1B3D2F]">Add to calendar</p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generateGoogleCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-2 px-3 border border-gray-200 rounded-lg text-sm font-medium text-[#1B3D2F] hover:bg-gray-50 transition-colors"
                  >
                    <span>Google Calendar</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={generateOutlookLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-2 px-3 border border-gray-200 rounded-lg text-sm font-medium text-[#1B3D2F] hover:bg-gray-50 transition-colors"
                  >
                    <span>Outlook</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <button
                  onClick={downloadICS}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-gray-200 rounded-lg text-sm font-medium text-[#1B3D2F] hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ics file</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1B3D2F] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
