import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

// ── Queries ──────────────────────────────────────────────────────────────────

/** Fetch appointments for a specific date (day view) */
export function useAppointments(date) {
  return useQuery({
    queryKey: ['appointments', { date }],
    queryFn: () =>
      client.get('/appointments/', { params: { date } }).then(r => r.data),
    enabled: !!date && !date.includes('search'),
    staleTime: 1000 * 60, // 1 min cache — fine for small internal team
  })
}

/** Search appointments by patient name or phone */
export function useAppointmentSearch(search) {
  return useQuery({
    queryKey: ['appointments', { search }],
    queryFn: () =>
      client.get('/appointments/', { params: { search } }).then(r => r.data),
    enabled: search.trim().length >= 2,
    staleTime: 1000 * 30,
  })
}

/** Fetch a single appointment (for edit form) */
export function useAppointment(id) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => client.get(`/appointments/${id}/`).then(r => r.data),
    enabled: !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => client.post('/appointments/', data).then(r => r.data),
    onSuccess: (newAppt) => {
      // Invalidate the day's appointment list so it refreshes
      queryClient.invalidateQueries({ queryKey: ['appointments', { date: newAppt.date }] })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      client.patch(`/appointments/${id}/`, data).then(r => r.data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', { date: updated.date }] })
      queryClient.removeQueries({ queryKey: ['appointment', updated.id] })
    },
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => client.delete(`/appointments/${id}/`),
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', { date }] })
    },
  })
}
