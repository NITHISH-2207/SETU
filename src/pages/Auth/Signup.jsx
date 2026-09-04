import { useState } from 'react'
import RoleStoryPanel from './RoleStoryPanel.jsx'
import { STAKEHOLDER_ROLES } from './rolesData.jsx'

function Signup({ selectedRole, onBackToRoles, onNavigate }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const activeRole = selectedRole || STAKEHOLDER_ROLES[0]
  const roleName = activeRole.shortName

  const handleSubmit = (e) => {
    e.preventDefault()
    // Frontend-only phase: No backend/database logic
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
            • {roleName} Gateway
          </span>
        </div>
      </header>

      {/* Main 2-Column Auth Experience */}
      <main className="max-w-7xl w-full mx-auto my-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Role Identity & Story Panel */}
          <div className="lg:col-span-6 flex">
            <RoleStoryPanel role={activeRole} mode="signup" />
          </div>

          {/* Right Column: Focused Auth Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs">
              {/* Subtle Role Indicator Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#BFD9D2]/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#E07A4E]" />
                  <span>{roleName} Registration</span>
                </div>

                <button
                  onClick={onBackToRoles}
                  className="text-xs text-[#5C726E] hover:text-[#176B5B] font-outfit underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Change role
                </button>
              </div>

              {/* Form Heading */}
              <div className="mb-8">
                <h1 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28]">
                  Join SETU as a
                  <span className="block text-[#176B5B]">{roleName}</span>
                </h1>
                <p className="mt-2 font-outfit text-sm sm:text-base text-[#5C726E]">
                  Become part of a connected ecosystem working toward societal action.
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                <div>
                  <label
                    htmlFor="signupFullName"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="signupFullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signupEmail"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signupPassword"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signupConfirmPassword"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="signupConfirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                  >
                    Create Account as {roleName} <span className="ml-2">→</span>
                  </button>
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50 text-center font-outfit text-sm text-[#5C726E]">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="font-medium text-[#176B5B] hover:text-[#125649] hover:underline transition-colors cursor-pointer ml-1"
                >
                  Login
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

export default Signup
