import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * useBackLogout
 *
 * Intercepts the browser BACK button while a dashboard is open and
 * silently logs the user out, sending them to their role's login page.
 *
 * How it works:
 *  - On mount we push a dummy history entry on top of the dashboard.
 *    That means the first Back press pops the dummy (a `popstate` event)
 *    instead of actually leaving the page — giving us a chance to react.
 *  - This only affects the Back button. The logout button and in-app
 *    links navigate normally and are unaffected.
 */
const useBackLogout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  // Keep latest user/logout without re-running the effect.
  const ref = useRef({ user, logout })
  ref.current = { user, logout }

  useEffect(() => {
    // Push a sentinel entry so the first Back is absorbed here.
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      const { user: currentUser, logout: doLogout } = ref.current

      // If somehow not logged in, just let it go.
      if (!currentUser) return

      // Silent logout — no confirmation prompt.
      const loginPath = `/login/${currentUser.userType}`
      doLogout()
      navigate(loginPath, { replace: true })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])
}

export default useBackLogout
