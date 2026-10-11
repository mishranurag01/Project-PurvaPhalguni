/**
 * Formatting Utilities
 */

/**
 * Formats a currency value with standard USD or custom currency code
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

/**
 * Formats standard ISO date strings into elegant editorial format (e.g. "October 18, 2026")
 */
export function formatDate(isoDateString?: string): string {
  if (!isoDateString) return '';
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  } catch {
    return isoDateString;
  }
}

/**
 * Formats celestial degrees and minutes (e.g. 13.333 -> "13°20′")
 */
export function formatDegreesMinutes(decimalDegrees: number): string {
  const deg = Math.floor(decimalDegrees);
  const min = Math.round((decimalDegrees - deg) * 60);
  return `${deg}°${min.toString().padStart(2, '0')}′`;
}

/**
 * Truncates text cleanly on word boundaries
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  const sub = text.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(' ');
  return `${lastSpace > 0 ? sub.slice(0, lastSpace) : sub}…`;
}
