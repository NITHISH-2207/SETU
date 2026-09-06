import { useState } from 'react'
import RoleStoryPanel from '../Auth/RoleStoryPanel.jsx'
import { STAKEHOLDER_ROLES } from '../Auth/rolesData.jsx'

function IndustryLogin({ onBackToRoles, onNavigate, onLoginSuccess }) {
  const industryRole = STAKEHOLDER_ROLES.find((r) => r.id === 'industry') || {
    id: 'industry',
    title: 'Industry / CSR',
    shortName: 'Industry / CSR',
    headline: 'Support innovation. Create measurable impact.',
    storyText: 'Channel CSR funds, technical infrastructure, and resources toward vetted societal solutions.',
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)

    if (!cleanEmail) {
      setErrorMessage('Please enter your official email address.')
      return
    }

    if (!isValidEmail) {
      setErrorMessage('Please enter a valid official email address.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoggingIn(true)

    // Frontend-only mock authentication
    setTimeout(() => {
      setIsLoggingIn(false)
      const mockProfile = {
        name: 'Tata Group CSR',
        industryName: 'Tata Group',
        email: cleanEmail,
        designation: 'CSR Programme Lead',
        role: 'industry',
      }
      if (onLoginSuccess) {
        onLoginSuccess(mockProfile)
      } else if (onNavigate) {
        onNavigate('industry-dashboard')
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Bar / Navigation */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onBackToRoles}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> Back to role selection
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • Industry / CSR Gateway
          </span>
        </div>
      </header>

      {/* Main 2-Column Auth Experience */}
      <main className="max-w-7xl w-full mx-auto my-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Role Identity & Story Panel */}
          <div className="lg:col-span-6 flex">
            <RoleStoryPanel role={industryRole} mode="login" />
          </div>

          {/* Right Column: Focused Auth Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs">
              {/* Subtle Role Indicator Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#BFD9D2]/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                  <span>Industry / CSR Access</span>
                </div>

                <button
                  type="button"
                  onClick={onBackToRoles}
                  className="text-xs text-[#5C726E] hover:text-[#176B5B] underline underline-offset-2 cursor-pointer font-outfit transition-colors"
                >
                  Change role
                </button>
              </div>

              {/* Form Header */}
              <div className="mb-6">
                <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1F2A28]">
                  Welcome back
                </h1>
                <p className="mt-2 font-outfit text-sm text-[#5C726E]">
                  Enter your official credentials to access the CSR &amp; Industry portal.
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl text-xs sm:text-sm font-outfit bg-red-50 text-red-700 border border-red-200/80 flex items-start gap-2.5">
                  <span className="font-bold text-red-500 text-sm">⚠</span>
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {/* Industry Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5 font-outfit">
                <div>
                  <label
                    htmlFor="industryEmail"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                  >
                    Official Email
                  </label>
                  <input
                    id="industryEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="csr.lead@tata.com"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="industryPassword"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    id="industryPassword"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage(null)
                    }}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <>
                        Sign In <span className="ml-2">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50 text-center font-outfit text-sm text-[#5C726E]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate?.('signup')}
                  className="font-medium text-[#176B5B] hover:text-[#125649] hover:underline transition-colors cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default IndustryLogin
