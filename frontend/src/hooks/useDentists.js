import { useQuery } from '@tanstack/react-query'
import client from '../api/client'

export function useDentists() {
  return useQuery({
    queryKey: ['dentists'],
    queryFn: () => client.get('/auth/dentists/').then(r => r.data),
    staleTime: Infinity,  // dentist list never changes mid-session
  })
}

// Assign a consistent color to each dentist by their position in the list
const DENTIST_COLORS = ['#2563eb', '#059669', '#7c3aed']

export function getDentistColor(dentistId, dentists = []) {
  const index = dentists.findIndex(d => d.id === dentistId)
  return DENTIST_COLORS[index % DENTIST_COLORS.length] || DENTIST_COLORS[0]
}
