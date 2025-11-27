import { EVENT_DATA } from './eventData';

const formatICSDate = (date) => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateICSContent = () => {
  const { event, dateTime, location } = EVENT_DATA;

  const startDate = new Date(dateTime.start);
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5 hour event

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SNPP Tampico//Posada 2025//ES
BEGIN:VEVENT
UID:posada2025-snpp-tampico@invitation
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.fullTitle}
DESCRIPTION:${event.description}
LOCATION:${location.venue}, ${location.fullAddress}
END:VEVENT
END:VCALENDAR`;
};

export const generateGoogleCalendarUrl = () => {
  const { event, dateTime, location } = EVENT_DATA;

  const startDate = new Date(dateTime.start);
  const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);

  const formatGoogleDate = (date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.fullTitle,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description,
    location: `${location.venue}, ${location.fullAddress}`,
    sf: 'true'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadICSFile = () => {
  const content = generateICSContent();
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'posada-2025-snpp.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
