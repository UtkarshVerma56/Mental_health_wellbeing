import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../constants/index'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils/index'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = getLocalStorage(STORAGE_KEYS.TOKEN)
    const storedUser = getLocalStorage(STORAGE_KEYS.USER)

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    try {
      setUser(userData)
      setToken(authToken)
      setError(null)

      // Store in localStorage
      setLocalStorage(STORAGE_KEYS.USER, userData)
      setLocalStorage(STORAGE_KEYS.TOKEN, authToken)

      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)

    // Remove from localStorage
    removeLocalStorage(STORAGE_KEYS.USER)
    removeLocalStorage(STORAGE_KEYS.TOKEN)
    removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN)
  }

  const updateUser = (userData) => {
    setUser(userData)
    setLocalStorage(STORAGE_KEYS.USER, userData)
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
