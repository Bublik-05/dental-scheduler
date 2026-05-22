import { addDays, formatDateShort, isToday, today } from '../utils/dates'

export default function DayNavigator({ date, onChange }) {
  const handlePrev = () => onChange(addDays(date, -1))
  const handleNext = () => onChange(addDays(date, 1))
  const handleToday = () => onChange(today())

  return (
    <div className="day-navigator">
      <button className="nav-arrow" onClick={handlePrev} aria-label="Previous day">
        ‹
      </button>

      <button
        className={`day-label ${isToday(date) ? 'is-today' : ''}`}
        onClick={handleToday}
        title="Tap to go to today"
      >
        {isToday(date)
          ? `● Today, ${formatDateShort(date)} • ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
          : formatDateShort(date)}
      </button>

      <button className="nav-arrow" onClick={handleNext} aria-label="Next day">
        ›
      </button>
    </div>
  )
}
