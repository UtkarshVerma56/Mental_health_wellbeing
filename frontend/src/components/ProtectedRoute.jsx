import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#5b3ba6'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.userType)) {
    return <Navigate to="/" replace />
  }

  return element
}

export default ProtectedRoute
