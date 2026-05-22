/** Returns today as YYYY-MM-DD string in local time */
export function today() {
  const d = new Date()
  return toDateStr(d)
}

/** Converts a Date object to YYYY-MM-DD string */
export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Add/subtract days from a YYYY-MM-DD string */
export function addDays(dateStr, days) {
  // Use T00:00:00 (no Z) so it's treated as local time, avoiding DST/timezone shifts
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

/** Format YYYY-MM-DD for display: "Mon, Jan 15" */
export function formatDateShort(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/** Format YYYY-MM-DD for display: "Monday, January 15" */
export function formatDateLong(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/** Is the given YYYY-MM-DD string today? */
export function isToday(dateStr) {
  return dateStr === today()
}

/** HH:MM:SS → HH:MM */
export function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : ''
}
