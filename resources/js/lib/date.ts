import { format } from 'date-fns';

// central formats
export const STORAGE_FORMAT = 'yyyy-MM-dd'; // Laravel-friendly (DB / API)
export const DISPLAY_FORMAT = 'EEE dd MMM, yyyy'; // e.g. "Sun 17 Aug, 2025"

// Format helpers
export const formatStorage = (date: Date) => format(date, STORAGE_FORMAT);
export const formatDisplay = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, DISPLAY_FORMAT);
};
