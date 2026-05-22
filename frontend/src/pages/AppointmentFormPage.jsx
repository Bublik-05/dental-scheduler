import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useDentists } from '../hooks/useDentists'
import {
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
} from '../hooks/useAppointments'
import { today } from '../utils/dates'

const EMPTY_FORM = {
  patient_name: '',
  patient_phone: '',
  dentist: '',
  date: today(),
  start_time: '',
  notes: '',
}

export default function AppointmentFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    date: searchParams.get('date') || today(),   // pre-fill from schedule page
  })
  const [error, setError] = useState(null)

  const { data: dentists = [] } = useDentists()
  const { data: existing } = useAppointment(id)
  const createMutation = useCreateAppointment()
  const updateMutation = useUpdateAppointment()

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setForm({
        patient_name: existing.patient_name,
        patient_phone: existing.patient_phone,
        dentist: existing.dentist,
        date: existing.date,
        start_time: existing.start_time.slice(0, 5),  // HH:MM:SS → HH:MM
        notes: existing.notes || '',
      })
    }
  }, [existing])

  function set(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const payload = { ...form }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, ...payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate(-1)
    } catch (err) {
      const data = err?.response?.data
      if (data) {
        // Show first validation error
        const msg = typeof data === 'string'
          ? data
          : Object.values(data).flat().join(' ')
        setError(msg)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="page form-page">
      <header className="form-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ‹ Back
        </button>
        <h1>{isEditing ? 'Edit Appointment' : 'New Appointment'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="appt-form">
        {error && <div className="error-banner">{error}</div>}

        <div className="field">
          <label htmlFor="patient_name">Patient Name *</label>
          <input
            id="patient_name"
            type="text"
            value={form.patient_name}
            onChange={set('patient_name')}
            placeholder="Full name"
            autoFocus
            required
          />
        </div>

        <div className="field">
          <label htmlFor="patient_phone">Phone *</label>
          <input
            id="patient_phone"
            type="tel"
            value={form.patient_phone}
            onChange={set('patient_phone')}
            placeholder="+7 (___) ___-__-__"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="dentist">Dentist *</label>
          <select
            id="dentist"
            value={form.dentist}
            onChange={set('dentist')}
            required
          >
            <option value="">Select dentist…</option>
            {dentists.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Date * (месяц: день: год)</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={set('date')}
              required
            />
          </div>

          <div className="field">
            <label>Time * (час : минута)</label>

            <div className="time-selects">
              <select
                value={form.start_hour}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    start_hour: e.target.value,
                    start_time: `${e.target.value}:${f.start_minute || '00'}`,
                  }))
                }
                required
              >
                <option value="">HH</option>

                {Array.from({ length: 13 }, (_, i) => i + 9).map((h) => {
                  const value = String(h).padStart(2, '0')

                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                })}
              </select>

              <span>:</span>

              <select
                value={form.start_minute}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    start_minute: e.target.value,
                    start_time: `${f.start_hour || '09'}:${e.target.value}`,
                  }))
                }
                required
              >
                {['00', '15', '30', '45'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Notes * (опционально)</label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={set('notes')}
            placeholder="Treatment type, allergies, special requests…"
            rows={3}
          />
        </div>

        <button type="submit" className="btn-primary btn-submit" disabled={isPending}>
          {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Appointment'}
        </button>
      </form>
    </div>
  )
}
