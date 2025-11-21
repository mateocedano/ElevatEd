interface TimeSlot {
  time: string;
  available: boolean;
}

interface DayAvailability {
  date: Date;
  dateString: string;
  dayOfWeek: string;
  slots: TimeSlot[];
}

export function useAvailability() {
  const generateAvailability = (): DayAvailability[] => {
    const availability: DayAvailability[] = [];
    const today = new Date();

    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (isWeekend) continue;

      const dateString = date.toISOString().split('T')[0];
      const slots: TimeSlot[] = [];

      if (!isWeekend) {
        const hours = [9, 10, 11, 12, 13, 14, 15, 16];
        const minutes = [0, 30];

        for (const hour of hours) {
          for (const minute of minutes) {
            if (hour === 16 && minute === 30) continue;

            const slotDate = new Date(date);
            slotDate.setHours(hour, minute);

            const randomAvailable = Math.random() > 0.3;
            const isInPast = slotDate < new Date();

            slots.push({
              time: slotDate.toLocaleString('default', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              available: !isInPast && randomAvailable,
            });
          }
        }
      }

      availability.push({
        date,
        dateString,
        dayOfWeek,
        slots,
      });
    }

    return availability;
  };

  return {
    generateAvailability,
    timeZones: [
      'Eastern Time (ET)',
      'Central Time (CT)',
      'Mountain Time (MT)',
      'Pacific Time (PT)',
      'UTC',
    ],
  };
}
