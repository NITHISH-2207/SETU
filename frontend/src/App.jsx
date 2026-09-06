import { useState } from 'react'
import SplashScreen from './pages/Splash/SplashScreen.jsx'
import LandingPage from './pages/Landing/LandingPage.jsx'
import RoleSelection from './pages/Auth/RoleSelection.jsx'
import Login from './pages/Auth/Login.jsx'
import Signup from './pages/Auth/Signup.jsx'
import CitizenPortal from './pages/Citizen/CitizenPortal.jsx'
import InstitutionSelection from './pages/University/InstitutionSelection.jsx'
import UniversityRoleSelection from './pages/University/UniversityRoleSelection.jsx'
import UniversityAdminLogin from './pages/University/UniversityAdminLogin.jsx'
import StudentLogin from './pages/University/StudentLogin.jsx'
import StudentSignup from './pages/University/StudentSignup.jsx'
import MentorLogin from './pages/University/MentorLogin.jsx'
import MentorSignup from './pages/University/MentorSignup.jsx'
import AdminDashboard from './pages/University/dashboard/AdminDashboard.jsx'
import MentorDashboard from './pages/University/dashboard/MentorDashboard.jsx'
import StudentDashboard from './pages/University/dashboard/StudentDashboard.jsx'
import IndustryLogin from './pages/Industry/IndustryLogin.jsx'
import IndustrySignup from './pages/Industry/IndustrySignup.jsx'
import IndustryDashboard from './pages/Industry/IndustryDashboard.jsx'
import { STAKEHOLDER_ROLES } from './pages/Auth/rolesData.jsx'
import {
  getAuthToken,
  getCitizenProfile,
  logoutCitizen,
  getStoredCitizenUser,
} from './services/authService.js'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(STAKEHOLDER_ROLES[0])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [authenticatedUniversityUser, setAuthenticatedUniversityUser] = useState(null)
  const [authenticatedIndustryUser, setAuthenticatedIndustryUser] = useState(null)
  const [authenticatedCitizenUser, setAuthenticatedCitizenUser] = useState(() => getStoredCitizenUser())

  const handleNavigate = (target, options = {}) => {
    let nextScreen = target

    // Screen-state protection for protected citizen portal
    if (nextScreen === 'citizen-portal') {
      const token = getAuthToken()
      if (!token && !authenticatedCitizenUser) {
        // Redirect unauthenticated user to Citizen Login
        setSelectedRole(STAKEHOLDER_ROLES[0])
        setAuthMode('login')
        setCurrentScreen('auth-login')
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }
    }

    if (target === 'login') {
      setAuthMode('login')
      nextScreen = 'role-selection'
    } else if (target === 'signup') {
      setAuthMode('signup')
      nextScreen = 'role-selection'
    }

    setCurrentScreen(nextScreen)

    try {
      if (nextScreen === 'citizen-portal') {
        localStorage.setItem('setu_is_logged_in', 'true')
        localStorage.setItem('setu_active_screen', 'citizen-portal')
      }
    } catch (err) {
      console.warn('Session persistence error:', err)
    }

    if (options.role) {
      setSelectedRole(options.role)
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleCitizenLogout = () => {
    logoutCitizen()
    setAuthenticatedCitizenUser(null)
    handleNavigate('landing')
  }

  const handleRoleSelected = (role) => {
    setSelectedRole(role)
    if (role.id === 'university') {
      setCurrentScreen('university-institution-selection')
    } else if (role.id === 'industry') {
      setCurrentScreen(authMode === 'signup' ? 'industry-signup' : 'industry-login')
    } else {
      setCurrentScreen(authMode === 'signup' ? 'auth-signup' : 'auth-login')
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleSwitchAuthMode = (newMode) => {
    setAuthMode(newMode)
    if (selectedRole?.id === 'industry') {
      setCurrentScreen(newMode === 'login' ? 'industry-login' : 'industry-signup')
    } else {
      setCurrentScreen(newMode === 'login' ? 'auth-login' : 'auth-signup')
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleSplashFinish = async () => {
    const token = getAuthToken()
    const savedScreen = localStorage.getItem('setu_active_screen')

    if (token) {
      try {
        // Verify real token with backend
        const profile = await getCitizenProfile(token)
        if (profile) {
          setAuthenticatedCitizenUser(profile)
          if (savedScreen === 'citizen-portal') {
            setCurrentScreen('citizen-portal')
            return
          }
        }
      } catch (err) {
        console.warn('Token validation failed on refresh:', err)
        logoutCitizen()
        setAuthenticatedCitizenUser(null)
      }
    } else {
      // No token present
      if (savedScreen === 'citizen-portal') {
        // Route protection: redirect to Citizen Login
        setSelectedRole(STAKEHOLDER_ROLES[0])
        setAuthMode('login')
        setCurrentScreen('auth-login')
        return
      }
    }

    handleNavigate('landing')
  }

  return (
    <div className="w-full min-h-screen bg-white text-[#1F2A28]">
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} />
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

      {/* Main Authentication Screens (Citizen, Government) */}
      {currentScreen === 'auth-login' && (
        <Login
          selectedRole={selectedRole}
          onBackToRoles={() => handleNavigate('role-selection')}
          onLoginSuccess={(profile) => {
            setAuthenticatedCitizenUser(profile)
            handleNavigate('citizen-portal')
          }}
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
          onBackToRoles={() => handleNavigate('role-selection')}
          onLoginSuccess={(profile) => {
            setAuthenticatedCitizenUser(profile)
            handleNavigate('citizen-portal')
          }}
          onNavigate={(target) => {
            if (target === 'login') {
              handleSwitchAuthMode('login')
            } else {
              handleNavigate(target)
            }
          }}
        />
      )}

      {/* Industry / CSR Authentication & Dashboard Screens */}
      {currentScreen === 'industry-login' && (
        <IndustryLogin
          onBackToRoles={() => handleNavigate('role-selection')}
          onNavigate={(target) => {
            if (target === 'signup') {
              handleSwitchAuthMode('signup')
            } else {
              handleNavigate(target)
            }
          }}
          onLoginSuccess={(profile) => {
            setAuthenticatedIndustryUser(profile)
            setCurrentScreen('industry-dashboard')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'industry-signup' && (
        <IndustrySignup
          onBackToRoles={() => handleNavigate('role-selection')}
          onNavigate={(target) => {
            if (target === 'login') {
              handleSwitchAuthMode('login')
            } else {
              handleNavigate(target)
            }
          }}
          onLoginSuccess={(profile) => {
            setAuthenticatedIndustryUser(profile)
            setCurrentScreen('industry-dashboard')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'industry-dashboard' && (
        <IndustryDashboard
          userProfile={authenticatedIndustryUser || {}}
          onLogout={() => {
            setAuthenticatedIndustryUser(null)
            handleNavigate('landing')
          }}
          onNavigate={handleNavigate}
        />
      )}

      {/* Citizen Portal */}
      {currentScreen === 'citizen-portal' && (
        <CitizenPortal
          currentUser={authenticatedCitizenUser}
          onLogout={handleCitizenLogout}
          onNavigate={handleNavigate}
        />
      )}

      {/* ====================================================
          University Portal Screens (Additive)
          ==================================================== */}
      {currentScreen === 'university-institution-selection' && (
        <InstitutionSelection
          initialSelected={selectedInstitution}
          onSelectInstitution={(inst) => {
            setSelectedInstitution(inst)
            setCurrentScreen('university-role-selection')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
          onBack={() => handleNavigate('role-selection')}
        />
      )}

      {currentScreen === 'university-role-selection' && (
        <UniversityRoleSelection
          selectedInstitution={selectedInstitution}
          onSelectSubRole={(subRole) => {
            if (subRole === 'admin') {
              setCurrentScreen('university-admin-login')
            } else if (subRole === 'mentor') {
              setCurrentScreen('university-mentor-login')
            } else {
              setCurrentScreen('university-student-login')
            }
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
          onBack={() => {
            setCurrentScreen('university-institution-selection')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'university-admin-login' && (
        <UniversityAdminLogin
          onBackToRoles={() => handleNavigate('university-role-selection')}
          onLoginSuccess={(profile) => {
            setAuthenticatedUniversityUser(profile)
            setCurrentScreen('university-admin-dashboard')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'university-student-login' && (
        <StudentLogin
          onBackToRoles={() => handleNavigate('university-role-selection')}
          onNavigateToSignup={() => {
            setCurrentScreen('university-student-signup')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
          onLoginSuccess={(profile) => {
            setAuthenticatedUniversityUser(profile)
            setCurrentScreen('university-student-dashboard')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'university-student-signup' && (
        <StudentSignup
          onBackToRoles={() => handleNavigate('university-role-selection')}
          onNavigateToLogin={() => {
            setCurrentScreen('university-student-login')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'university-mentor-login' && (
        <MentorLogin
          onBackToRoles={() => handleNavigate('university-role-selection')}
          onNavigateToSignup={() => {
            setCurrentScreen('university-mentor-signup')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
          onLoginSuccess={(profile) => {
            setAuthenticatedUniversityUser(profile)
            setCurrentScreen('university-mentor-dashboard')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {currentScreen === 'university-mentor-signup' && (
        <MentorSignup
          onBackToRoles={() => handleNavigate('university-role-selection')}
          onNavigateToLogin={() => {
            setCurrentScreen('university-mentor-login')
            window.scrollTo({ top: 0, behavior: 'instant' })
          }}
        />
      )}

      {/* Authenticated University Dashboards */}
      {currentScreen === 'university-admin-dashboard' && (
        <AdminDashboard
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}

      {currentScreen === 'university-student-dashboard' && (
        <StudentDashboard
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}

      {currentScreen === 'university-mentor-dashboard' && (
        <MentorDashboard
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}
    </div>
  )
}

export default App
