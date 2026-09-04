import { useState } from 'react'
import SplashScreen from './pages/Splash/SplashScreen.jsx'
import LandingPage from './pages/Landing/LandingPage.jsx'
import RoleSelection from './pages/Auth/RoleSelection.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import { STAKEHOLDER_ROLES } from './pages/Auth/rolesData.jsx'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(STAKEHOLDER_ROLES[0])

  const handleNavigate = (target, options = {}) => {
    if (target === 'login') {
      setAuthMode('login')
      setCurrentScreen('role-selection')
    } else if (target === 'signup') {
      setAuthMode('signup')
      setCurrentScreen('role-selection')
    } else {
      setCurrentScreen(target)
    }

    if (options.role) {
      setSelectedRole(options.role)
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleRoleSelected = (role) => {
    setSelectedRole(role)
    setCurrentScreen(authMode === 'login' ? 'auth-login' : 'auth-signup')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleSwitchAuthMode = (newMode) => {
    setAuthMode(newMode)
    setCurrentScreen(newMode === 'login' ? 'auth-login' : 'auth-signup')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="w-full min-h-screen bg-white text-[#1F2A28]">
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => handleNavigate('landing')} />
      )}

      {currentScreen === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentScreen === 'role-selection' && (
        <RoleSelection
          mode={authMode}
          onSelectRole={handleRoleSelected}
          onBack={() => handleNavigate('landing')}
        />
      )}

      {currentScreen === 'auth-login' && (
        <Login
          selectedRole={selectedRole}
          onBackToRoles={() => setCurrentScreen('role-selection')}
          onNavigate={(target) => {
            if (target === 'signup') {
              handleSwitchAuthMode('signup')
            } else {
              handleNavigate(target)
            }
          }}
        />
      )}

      {currentScreen === 'auth-signup' && (
        <Signup
          selectedRole={selectedRole}
          onBackToRoles={() => setCurrentScreen('role-selection')}
          onNavigate={(target) => {
            if (target === 'login') {
              handleSwitchAuthMode('login')
            } else {
              handleNavigate(target)
            }
          }}
        />
      )}
    </div>
  )
}

export default App
