import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDeleteAppointment } from '../hooks/useAppointments'
import { formatTime } from '../utils/dates'

export default function AppointmentCard({ appointment, color }) {
  const [expanded, setExpanded] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const deleteMutation = useDeleteAppointment()

  const isAdmin = user?.role === 'admin'

  function handleDelete() {
    if (!window.confirm(`Delete appointment for ${appointment.patient_name}?`)) return
    deleteMutation.mutate(
      { id: appointment.id, date: appointment.date },
      { onError: () => alert('Failed to delete. Please try again.') }
    )
  }

  function handleEdit(e) {
    e.stopPropagation()
    navigate(`/appointments/${appointment.id}/edit`)
  }

  return (
    <div
      className={`appointment-card ${expanded ? 'expanded' : ''}`}
      style={{ borderLeftColor: color }}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Always visible row */}
      <div className="card-main">
        <span className="appt-time">{formatTime(appointment.start_time)}</span>
        <div className="appt-info">
          <div className="appt-name">{appointment.patient_name}</div>
          <div className="appt-phone">{appointment.patient_phone}</div>
        </div>
        <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="card-detail" onClick={e => e.stopPropagation()}>
          {appointment.notes && (
            <p className="appt-notes">{appointment.notes}</p>
          )}
          {isAdmin && (
            <div className="card-actions">
              <button className="btn-edit" onClick={handleEdit}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
