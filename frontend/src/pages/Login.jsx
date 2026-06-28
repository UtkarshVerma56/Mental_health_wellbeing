import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { USER_TYPES, ROUTES } from '../constants/index'
import '../styles/Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userType, setUserType] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!userType || !userId || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(userType, userId, password)
      
      if (response.success) {
        const userData = {
          ...response.user,
          userType
        }
        login(userData, response.token)
        
        // Redirect based on user type
        const dashboardRoutes = {
          [USER_TYPES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
          [USER_TYPES.COUNSELLOR]: ROUTES.COUNSELLOR_DASHBOARD,
          [USER_TYPES.ADMINISTRATOR]: ROUTES.ADMIN_DASHBOARD,
          [USER_TYPES.DEAN]: ROUTES.DEAN_DASHBOARD
        }
        
        navigate(dashboardRoutes[userType], { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🧠 MHC Login</h1>
          <p>Mental Health Center - MNNIT Allahabad</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="userType">Select User Type</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Choose your role --</option>
              <option value={USER_TYPES.STUDENT}>Student</option>
              <option value={USER_TYPES.COUNSELLOR}>Counsellor</option>
              <option value={USER_TYPES.ADMINISTRATOR}>Administrator</option>
              <option value={USER_TYPES.DEAN}>Dean</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID / Email</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

      </div>
    </div>
  )
}

export default Login
