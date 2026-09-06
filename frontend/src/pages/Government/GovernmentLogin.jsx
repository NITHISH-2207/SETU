import { useState } from 'react'
import RoleStoryPanel from '../Auth/RoleStoryPanel.jsx'
import { STAKEHOLDER_ROLES } from '../Auth/rolesData.jsx'
import { GOVERNMENT_DEPARTMENTS, DEMO_PASSWORDS } from './governmentConfig.js'

function GovernmentLogin({ onBackToRoles, onLoginSuccess }) {
  const governmentRole = STAKEHOLDER_ROLES.find((r) => r.id === 'government') || {
    id: 'government',
    title: 'Government / Authority',
    shortName: 'Government / Authority',
    headline: 'Civic oversight & verified municipal resolution.',
    storyText: 'Review ground realities, prioritize public works, and coordinate inter-departmental action.',
  }

  const [selectedDepartment, setSelectedDepartment] = useState('Department of Water')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedDepartment) {
      setErrorMessage('Please select your department.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your department access password.')
      return
    }

    const expectedPassword = DEMO_PASSWORDS[selectedDepartment]

    if (password.trim().toLowerCase() !== expectedPassword) {
      setErrorMessage(
        `Invalid password for ${selectedDepartment}. (Demo password: "${expectedPassword}")`
      )
      return
    }

    setIsLoggingIn(true)

    // Frontend-only deterministic demo validation
    setTimeout(() => {
      setIsLoggingIn(false)
      const deptConfig = GOVERNMENT_DEPARTMENTS.find((d) => d.name === selectedDepartment)

      const profile = {
        departmentName: selectedDepartment,
        departmentId: deptConfig?.id || 'dept-water',
        jurisdiction: deptConfig?.jurisdiction || 'Tiruppur Municipal Corporation',
        categories: deptConfig?.categories || ['Water Supply'],
        role: 'government',
        loggedInAt: new Date().toISOString(),
      }

      try {
        localStorage.setItem('setu_government_department', selectedDepartment)
        localStorage.setItem('setu_government_profile', JSON.stringify(profile))
      } catch (err) {
        console.warn('Failed to persist government session:', err)
      }

      if (onLoginSuccess) {
        onLoginSuccess(profile)
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Bar / Navigation */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          type="button"
          onClick={onBackToRoles}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> Back to role selection
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • Government Authority Gateway
          </span>
        </div>
      </header>

      {/* Main 2-Column Auth Experience */}
      <main className="max-w-7xl w-full mx-auto my-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Role Identity & Story Panel */}
          <div className="lg:col-span-6 flex">
            <RoleStoryPanel role={governmentRole} mode="login" />
          </div>

          {/* Right Column: Focused Department Login Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs">
              {/* Subtle Role Indicator Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#BFD9D2]/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                  <span>Public Authority Access</span>
                </div>

                <button
                  type="button"
                  onClick={onBackToRoles}
                  className="text-xs font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors font-outfit cursor-pointer"
                >
                  Change Role
                </button>
              </div>

              <div className="mb-6">
                <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                  Department Login
                </h1>
                <p className="font-outfit text-sm text-[#5C726E] mt-1.5 leading-relaxed">
                  Select your assigned municipal or public works department to access verified citizen complaints and resolution workflows.
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-6 p-3.5 bg-white border border-[#E07A4E]/60 rounded-xl text-xs sm:text-sm text-[#1F2A28] font-outfit flex items-start gap-2.5 shadow-2xs animate-fadeIn">
                  <svg
                    className="w-4 h-4 text-[#E07A4E] shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="flex-1">{errorMessage}</span>
                </div>
              )}

              {/* Clean Form */}
              <form onSubmit={handleSubmit} className="space-y-5 font-outfit">
                {/* 1. Department Selection Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="dept-select" className="block text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
                    Department <span className="text-[#E07A4E]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="dept-select"
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value)
                        setErrorMessage(null)
                      }}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs appearance-none cursor-pointer font-medium"
                    >
                      {GOVERNMENT_DEPARTMENTS.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="w-4 h-4 text-[#5C726E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* 2. Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="gov-password" className="block text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
                      Password <span className="text-[#E07A4E]">*</span>
                    </label>
                    <span className="text-[11px] text-[#5C726E]">
                      Demo password: <code className="font-mono text-[#176B5B] font-semibold">{DEMO_PASSWORDS[selectedDepartment]}</code>
                    </span>
                  </div>
                  <input
                    id="gov-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    placeholder={`Enter password (e.g. ${DEMO_PASSWORDS[selectedDepartment]})`}
                    className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white font-semibold text-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] shadow-2xs hover:shadow-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Department...</span>
                    </>
                  ) : (
                    <span>Enter Government Portal</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center pt-4 border-t border-[#BFD9D2]/40">
        <p className="text-xs text-[#5C726E] font-outfit">
          SETU Civic Governance Network • Secure Municipal Official Portal
        </p>
      </footer>
    </div>
  )
}

export default GovernmentLogin
