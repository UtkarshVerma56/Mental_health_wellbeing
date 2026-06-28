export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const USER_TYPES = {
  STUDENT: 'student',
  COUNSELLOR: 'counsellor',
  ADMINISTRATOR: 'administrator',
  DEAN: 'dean'
}

export const ROLE_CONFIG = {
  student: {
    userType: 'student',
    label: 'Student',
    icon: '👨‍🎓',
    idLabel: 'College Registration Number',
    idPlaceholder: 'e.g. 20BCS001',
    passwordHint: 'Your Date of Birth in DD-MM-YYYY format',
    dashboard: '/student/dashboard'
  },
  counsellor: {
    userType: 'counsellor',
    label: 'Counsellor',
    icon: '👨‍⚕️',
    idLabel: 'Official Email ID',
    idPlaceholder: 'e.g. name@mnnit.ac.in',
    passwordHint: 'Your Date of Birth in DD-MM-YYYY format',
    dashboard: '/counsellor/dashboard'
  },
  administrator: {
    userType: 'administrator',
    label: 'Administrator',
    icon: '⚙️',
    idLabel: 'Official Email ID',
    idPlaceholder: 'e.g. admin@mnnit.ac.in',
    passwordHint: 'Your Date of Birth in DD-MM-YYYY format',
    dashboard: '/administrator/dashboard'
  },
  dean: {
    userType: 'dean',
    label: 'Dean, Student Welfare',
    icon: '👔',
    idLabel: 'Official Email ID',
    idPlaceholder: 'e.g. dean@mnnit.ac.in',
    passwordHint: 'Your Date of Birth in DD-MM-YYYY format',
    dashboard: '/dean/dashboard'
  }
}

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED'
}

export const STATUS_COLORS = {
  PENDING: '#f39c12',
  APPROVED: '#3498db',
  COMPLETED: '#27ae60',
  REJECTED: '#e74c3c'
}

export const TIME_SLOTS = [
  '09:00 AM','10:00 AM','11:00 AM',
  '01:00 PM','02:00 PM','03:00 PM','04:00 PM'
]

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  STUDENT_LOGIN: '/login/student',
  COUNSELLOR_LOGIN: '/login/counsellor',
  ADMIN_LOGIN: '/login/administrator',
  DEAN_LOGIN: '/login/dean',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  STUDENT_DASHBOARD: '/student/dashboard',
  COUNSELLOR_DASHBOARD: '/counsellor/dashboard',
  ADMIN_DASHBOARD: '/administrator/dashboard',
  DEAN_DASHBOARD: '/dean/dashboard',
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  INVALID_CREDENTIALS: 'Invalid credentials. Use your DOB as password (DD-MM-YYYY).',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.'
}

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  APPOINTMENT_BOOKED: 'Appointment booked successfully!',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
}

export const STORAGE_KEYS = {
  TOKEN: 'mhc_token',
  USER: 'mhc_user',
  REFRESH_TOKEN: 'mhc_refresh_token'
}

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 10,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  REG_NO_PATTERN: /^[A-Z0-9]+$/i
}
