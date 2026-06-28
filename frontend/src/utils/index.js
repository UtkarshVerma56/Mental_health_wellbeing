import { VALIDATION_RULES, STATUS_COLORS, APPOINTMENT_STATUS } from '../constants/index'

// Validation Functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH
}

export const validateRegNo = (regNo) => {
  return VALIDATION_RULES.REG_NO_PATTERN.test(regNo)
}

export const validateName = (name) => {
  return (
    name.length >= VALIDATION_RULES.MIN_NAME_LENGTH &&
    name.length <= VALIDATION_RULES.MAX_NAME_LENGTH
  )
}

// Format Functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (time) => {
  return new Date(`1970-01-01 ${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Status Functions
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#95a5a6'
}

export const getStatusLabel = (status) => {
  const labels = {
    [APPOINTMENT_STATUS.PENDING]: 'Pending',
    [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmed',
    [APPOINTMENT_STATUS.COMPLETED]: 'Completed',
    [APPOINTMENT_STATUS.CANCELLED]: 'Cancelled'
  }
  return labels[status] || status
}

// Local Storage Functions
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting local storage:', error)
  }
}

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error getting local storage:', error)
    return null
  }
}

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing local storage:', error)
  }
}

export const clearLocalStorage = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing local storage:', error)
  }
}

// Date Functions
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date)
}

export const isSunday = (date) => {
  return new Date(date).getDay() === 0
}

export const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

export const getMinDate = () => {
  return getTomorrowDate().toISOString().split('T')[0]
}

export const getMaxDate = () => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  return maxDate.toISOString().split('T')[0]
}

// API Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred'
  } else if (error.request) {
    // Request made but no response
    return 'No response from server'
  } else {
    // Error in request setup
    return error.message || 'An error occurred'
  }
}

// Capitalize First Letter
export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Generate Random ID
export const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce Function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
