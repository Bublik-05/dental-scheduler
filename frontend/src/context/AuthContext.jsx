import { createContext, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  // Check session on load — if 401, user is not logged in
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => client.get('/auth/me/').then(r => r.data),
    retry: false,           // don't retry 401s
    staleTime: Infinity,    // user doesn't change mid-session
  })

  const loginMutation = useMutation({
    mutationFn: (creds) => client.post('/auth/login/', creds).then(r => r.data),
    onSuccess: (data) => queryClient.setQueryData(['me'], data),
  })

  const logoutMutation = useMutation({
    mutationFn: () => client.post('/auth/logout/'),
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/login'
    },
  })

  return (
    <AuthContext.Provider value={{ user, isLoading, loginMutation, logoutMutation }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
