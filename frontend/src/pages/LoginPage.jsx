import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user, loginMutation } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    loginMutation.mutate(
      { username: username.trim(), password },
      { onSuccess: () => navigate('/', { replace: true }) }
    )
  }

  const error = loginMutation.error?.response?.data?.error

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="/clinic_logo.jpg" alt="Clinic logo" className="login-logo" />
          <h1>Dental Schedule</h1>
          <p>Staff access only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
