

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(tz: string): Intl.DateTimeFormat {
  let f = formatterCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', {   // en-CA => YYYY-MM-DD
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    formatterCache.set(tz, f);
  }
  return f;
}


export function toDateStr(value: Date | string | number, tz: string): string {
  if (typeof value === 'string' && ISO_DATE_ONLY.test(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return getFormatter(tz).format(d);
}

/**
 * 'YYYY-MM-DD' -> Date at 00:00:00.000 UTC.
 * For date-only DB fields. Always read back in UTC.
 */
export function dateStrToDate(dateStr: string): Date {
  if (!ISO_DATE_ONLY.test(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return new Date(`${dateStr}T00:00:00.000Z`);
}

/** Date-only DB value -> 'YYYY-MM-DD' (read in UTC). */
export function dateToDateStr(d: Date): string {
  const isoStr = d.toISOString().slice(0, 10);
  const [year, month, day] = isoStr.split('-');
  
  // Rearrange to DD-MM-YYYY
  return `${day}-${month}-${year}`;
}