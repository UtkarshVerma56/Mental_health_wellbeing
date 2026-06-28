import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUserCircle, FaSignOutAlt, FaKey } from 'react-icons/fa'
import ChangePasswordModal from './ChangePasswordModal'
import './UserMenu.css'

const ROLE_LABELS = {
  student: 'Student',
  counsellor: 'Counsellor',
  administrator: 'Administrator',
  dean: 'Dean, Student Welfare'
}

const UserMenu = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  const roleLabel = ROLE_LABELS[user.userType] || user.userType

  return (
    <>
      <div className="user-menu" ref={menuRef}>
        <button
          className="user-menu-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-label="User menu"
          aria-expanded={open}
        >
          <FaUserCircle />
        </button>

        {open && (
          <div className="user-menu-dropdown">
            <div className="user-menu-info">
              <div className="user-menu-avatar">
                <FaUserCircle />
              </div>
              <div className="user-menu-details">
                <span className="user-menu-name">{user.name}</span>
                <span className="user-menu-role">{roleLabel}</span>
                {user.userId && (
                  <span className="user-menu-id">ID: {user.userId}</span>
                )}
              </div>
            </div>

            <div className="user-menu-divider" />

            <button
              className="user-menu-item"
              onClick={() => {
                setOpen(false)
                setShowChangePassword(true)
              }}
            >
              <FaKey /> Change Password
            </button>

            <button
              className="user-menu-item user-menu-item-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  )
}

export default UserMenu
