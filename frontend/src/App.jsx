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
import UniversityDashboardPlaceholder from './pages/University/components/UniversityDashboardPlaceholder.jsx'
import { STAKEHOLDER_ROLES } from './pages/Auth/rolesData.jsx'

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(STAKEHOLDER_ROLES[0])
  const [selectedInstitution, setSelectedInstitution] = useState(null)
  const [authenticatedUniversityUser, setAuthenticatedUniversityUser] = useState(null)

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
    if (role.id === 'university') {
      setCurrentScreen('university-institution-selection')
    } else {
      setCurrentScreen('auth-login')
    }
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

      {/* Main Authentication Screens (Citizen, Industry, Government) */}
      {currentScreen === 'auth-login' && (
        <Login
          selectedRole={selectedRole}
          onBackToRoles={() => handleNavigate('role-selection')}
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
          onNavigate={(target) => {
            if (target === 'login') {
              handleSwitchAuthMode('login')
            } else {
              handleNavigate(target)
            }
          }}
        />
      )}

      {/* Citizen Portal */}
      {currentScreen === 'citizen-portal' && (
        <CitizenPortal
          onLogout={() => handleNavigate('landing')}
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

      {/* University Placeholder Dashboards */}
      {currentScreen === 'university-admin-dashboard' && (
        <UniversityDashboardPlaceholder
          roleType="admin"
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}

      {currentScreen === 'university-student-dashboard' && (
        <UniversityDashboardPlaceholder
          roleType="student"
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}

      {currentScreen === 'university-mentor-dashboard' && (
        <UniversityDashboardPlaceholder
          roleType="mentor"
          userProfile={authenticatedUniversityUser || {}}
          onLogout={() => handleNavigate('landing')}
        />
      )}
    </div>
  )
}

export default App
