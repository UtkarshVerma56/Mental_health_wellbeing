import { useState } from 'react'
import { authAPI } from '../services/api'
import '../styles/Auth.css'
import './ChangePasswordModal.css'

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState({ current: false, next: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from the current password')
      return
    }

    setLoading(true)

    // --- DEV BYPASS (no backend) -------------------------------------
    // Fakes a successful password change when VITE_DEV_LOGIN=true.
    // REMOVE FOR PRODUCTION.
    if (import.meta.env.VITE_DEV_LOGIN === 'true') {
      setTimeout(() => {
        setSuccess('Password changed successfully! (dev mode)')
        setLoading(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }, 600)
      return
    }
    // -----------------------------------------------------------------

    try {
      const response = await authAPI.changePassword(currentPassword, newPassword)
      if (response.success) {
        setSuccess('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(response.message || 'Failed to change password')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal change-password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔒 Change Password</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Previous Password</label>
              <div className="password-input-group">
                <input
                  type={show.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggle('current')}
                  aria-label="Toggle password visibility"
                >
                  {show.current ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-group">
                <input
                  type={show.next ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggle('next')}
                  aria-label="Toggle password visibility"
                >
                  {show.next ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input-group">
                <input
                  type={show.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggle('confirm')}
                  aria-label="Toggle password visibility"
                >
                  {show.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
