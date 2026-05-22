import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppointments, useAppointmentSearch } from '../hooks/useAppointments'
import { useDentists, getDentistColor } from '../hooks/useDentists'
import DayNavigator from '../components/DayNavigator'
import AppointmentCard from '../components/AppointmentCard'
import { today } from '../utils/dates'

export default function SchedulePage() {
  const [date, setDate] = useState(today())
  const [search, setSearch] = useState('')
  const { user, logoutMutation } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'
  const isSearching = search.trim().length >= 2

  // Day view data
  const { data: dayAppointments = [], isLoading: dayLoading } = useAppointments(
    isSearching ? null : date
  )

  // Search results
  const { data: searchResults = [], isLoading: searchLoading } = useAppointmentSearch(
    isSearching ? search : ''
  )

  const { data: dentists = [] } = useDentists()

  const isLoading = isSearching ? searchLoading : dayLoading
  const appointments = isSearching ? searchResults : dayAppointments

  // Group appointments by dentist
  function buildSchedule() {
    if (isAdmin) {
      // Admin: show all dentists, even those with no appointments today
      return dentists.map((dentist, idx) => ({
        dentist,
        color: getDentistColor(dentist.id, dentists),
        appointments: appointments
          .filter(a => a.dentist === dentist.id)
          .sort((a, b) => a.start_time.localeCompare(b.start_time)),
      }))
    } else {
      // Dentist: only their own appointments (API already filters)
      return [{
        dentist: { id: user.id, name: user.name },
        color: '#2563eb',
        appointments: [...appointments].sort((a, b) =>
          a.start_time.localeCompare(b.start_time)
        ),
      }]
    }
  }

  const schedule = buildSchedule()
  const totalCount = appointments.length

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <span className="header-title">🦷 Miracle Clinic Schedule</span>
        <div className="header-right">
          <span className="user-name">{user?.name}</span>
          <button
            className="btn-logout"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Out
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search patient name or phone…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Day navigator — hidden during search */}
      {!isSearching && (
        <DayNavigator date={date} onChange={setDate} />
      )}

      {/* Search header */}
      {isSearching && (
        <div className="search-header">
          {isLoading ? 'Searching…' : `${totalCount} result${totalCount !== 1 ? 's' : ''} for "${search}"`}
        </div>
      )}

      {/* Schedule body */}
      <div className="schedule-body">
        {isLoading ? (
          <div className="loading-state">Loading…</div>
        ) : (
          schedule.map(({ dentist, color, appointments: appts }) => {
            // For search results, skip dentists with no matches
            if (isSearching && appts.length === 0) return null

            return (
              <section key={dentist.id} className="dentist-section">
                <div className="dentist-header" style={{ borderLeftColor: color }}>
                  <span className="dentist-dot" style={{ background: color }} />
                  <span className="dentist-name">{dentist.name}</span>
                  <span className="appt-count">
                    {appts.length > 0 ? `${appts.length} appt${appts.length !== 1 ? 's' : ''}` : 'free'}
                  </span>
                </div>

                {appts.length === 0 ? (
                  <p className="empty-day">No appointments</p>
                ) : (
                  appts.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      color={color}
                    />
                  ))
                )}
              </section>
            )
          })
        )}

        {/* Spacer so FAB doesn't cover last card */}
        <div style={{ height: '80px' }} />
      </div>

      {/* Floating Add button — admin only */}
      {isAdmin && (
        <div className="fab-container">
          <button
            className="fab"
            onClick={() => navigate(`/appointments/new?date=${date}`)}
          >
            + New Appointment
          </button>
        </div>
      )}
    </div>
  )
}
