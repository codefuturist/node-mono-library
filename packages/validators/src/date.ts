/**
 * Date validation functions
 */

/**
 * Checks if a value is a valid Date object
 */
export function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Checks if a date string is valid
 */
export function isValidDateString(value: string): boolean {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: Date): boolean {
    return date.getTime() < Date.now();
}

/**
 * Checks if a date is in the future
 */
export function isFuture(date: Date): boolean {
    return date.getTime() > Date.now();
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

/**
 * Checks if a date is before another date
 */
export function isBefore(date: Date, compareTo: Date): boolean {
    return date.getTime() < compareTo.getTime();
}

/**
 * Checks if a date is after another date
 */
export function isAfter(date: Date, compareTo: Date): boolean {
    return date.getTime() > compareTo.getTime();
}

/**
 * Checks if a date is between two dates (inclusive)
 */
export function isBetweenDates(date: Date, start: Date, end: Date): boolean {
    const time = date.getTime();
    return time >= start.getTime() && time <= end.getTime();
}

/**
 * Checks if a date is on a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
}

/**
 * Checks if a date is on a weekday (Monday through Friday)
 */
export function isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 5;
}

/**
 * Checks if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Checks if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
