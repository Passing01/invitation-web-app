export function generateICS(event: { title: string; date: string; location: string; description?: string }) {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration as default

    const formatDateICS = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Invitation Web App//NONSGML v1.0//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateICS(startDate)}`,
        `DTEND:${formatDateICS(endDate)}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${event.description || ''}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
