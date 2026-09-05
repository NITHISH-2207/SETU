import { useState } from 'react'
import UniversityAuthLayout from './components/UniversityAuthLayout.jsx'
import { DEMO_ADMIN_PROFILE } from './universityMockData.js'

function UniversityAdminLogin({ onBackToRoles, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('admin.setu@annauniv.edu')
  const [password, setPassword] = useState('••••••••••')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setErrorMsg('Please enter your University Email or Admin ID.')
      return
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your administrator password.')
      return
    }

    setErrorMsg('')
    setIsLoggingIn(true)

    // Simulate login
    setTimeout(() => {
      setIsLoggingIn(false)
      onLoginSuccess?.(DEMO_ADMIN_PROFILE)
    }, 400)
  }

  return (
    <UniversityAuthLayout
      roleType="admin"
      roleBadgeText="University Administration"
      headline="Welcome to University Administration"
      storyText="Coordinate campus-wide societal problem solvers, authorize student projects, and sanction faculty mentorship."
      onBack={onBackToRoles}
      backLabel="Back to University Roles"
    >
      <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs font-outfit">
        {/* Role Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#BFD9D2]/50">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>Admin Authorization Portal</span>
          </div>

          <button
            type="button"
            onClick={onBackToRoles}
            className="text-xs text-[#5C726E] hover:text-[#176B5B] underline underline-offset-2 cursor-pointer transition-colors"
          >
            Change role
          </button>
        </div>

        {/* Heading & Supporting Line */}
        <div className="mb-8">
          <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1F2A28]">
            Administrator Sign In
          </h1>
          <p className="mt-2 text-sm text-[#5C726E] leading-relaxed">
            Authorized university administrators can sign in here to manage student approvals and research governance.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="adminIdentifier"
              className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
            >
              University Email / Admin ID <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              id="adminIdentifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@university.edu or ADMIN-ID"
              className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
            />
          </div>

          <div>
            <label
              htmlFor="adminPassword"
              className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
            >
              Password <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              id="adminPassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-[#E07A4E] font-medium animate-fade-in">
              {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center text-sm sm:text-base font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
            >
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              <span className="ml-2">→</span>
            </button>
          </div>
        </form>

        {/* Institutional Notice: No public signup */}
        <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50 text-center text-xs text-[#5C726E] leading-relaxed">
          <span>University administrator credentials are provisioned by institutional authority invitation only. Self-registration is restricted.</span>
        </div>
      </div>
    </UniversityAuthLayout>
  )
}

export default UniversityAdminLogin
