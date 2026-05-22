import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SchedulePage from './pages/SchedulePage'
import AppointmentFormPage from './pages/AppointmentFormPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // don't refetch on every tab switch
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute adminOnly>
                  <AppointmentFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointments/:id/edit"
              element={
                <ProtectedRoute adminOnly>
                  <AppointmentFormPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
