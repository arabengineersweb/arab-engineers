import React, { useState, useEffect } from 'react'
import AdminAuth from '../components/AdminAuth'
import AdminPanel from '../components/AdminPanel'
import { adminUtils } from '../utils/adminUtils'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = adminUtils.isAuthenticated()
    setIsAuthenticated(authenticated)
    setIsLoading(false)

    // Apply any saved styles
    const savedStyles = adminUtils.loadStyles()
    if (savedStyles) {
      adminUtils.applyStyles(savedStyles)
    }
    
    // Add initial login to history
    if (authenticated) {
      adminUtils.addEditToHistory({
        type: 'login',
        section: 'admin',
        field: 'access',
        action: 'Admin logged in',
        oldValue: 'Not logged in',
        newValue: 'Logged in'
      })
    }
  }, [])

  const handleLogin = (success) => {
    setIsAuthenticated(success)
  }

  const handleLogout = () => {
    adminUtils.logout()
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onLogin={handleLogin} />
  }

  return (
    <div>
      <AdminPanel onLogout={handleLogout} />
    </div>
  )
}
