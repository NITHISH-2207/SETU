import { useState } from 'react'
import RoleStoryPanel from './RoleStoryPanel.jsx'
import OtpInput from './OtpInput.jsx'
import { STAKEHOLDER_ROLES } from './rolesData.jsx'

function Login({ selectedRole, onBackToRoles, onNavigate }) {
  // Common states
  const activeRole = selectedRole || STAKEHOLDER_ROLES[0]
  const roleName = activeRole.shortName
  const isCitizen = activeRole.id === 'citizen'

  // Non-Citizen states (Email + Password)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Citizen states (Passwordless OTP)
  const [citizenIdentifier, setCitizenIdentifier] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', ''])
  const [resendNotice, setResendNotice] = useState(false)

  // Validation for Citizen Identifier (valid email or valid 10-digit mobile)
  const cleanIdentifier = citizenIdentifier.trim().replace(/\s+/g, '')
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanIdentifier)
  const is10DigitMobile = /^\d{10}$/.test(cleanIdentifier) || /^\+91\d{10}$/.test(cleanIdentifier)
  const isCitizenIdentifierValid = isValidEmail || is10DigitMobile

  const handleSendCitizenOtp = () => {
    if (isCitizenIdentifierValid) {
      setOtpSent(true)
      setResendNotice(false)
    }
  }

  const handleResendOtp = () => {
    setResendNotice(true)
    setTimeout(() => setResendNotice(false), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isCitizen) {
      onNavigate('citizen-portal')
    }
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
            <RoleStoryPanel role={activeRole} mode="login" />
          </div>

          {/* Right Column: Focused Auth Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs">
              {/* Subtle Role Indicator Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#BFD9D2]/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                  <span>{roleName} Access</span>
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
                  Welcome back,
                  <span className="block text-[#176B5B]">{roleName}</span>
                </h1>
                <p className="mt-2 font-outfit text-sm text-[#5C726E]">
                  {isCitizen
                    ? 'Enter your mobile or email to sign in via OTP.'
                    : 'Enter your credentials to continue.'}
                </p>
              </div>

              {/* Citizen Passwordless Login Form */}
              {isCitizen ? (
                <form onSubmit={handleSubmit} className="space-y-5 font-outfit">
                  <div>
                    <label
                      htmlFor="citizenIdentifier"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                    >
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        id="citizenIdentifier"
                        type="text"
                        required
                        value={citizenIdentifier}
                        onChange={(e) => {
                          setCitizenIdentifier(e.target.value)
                          if (otpSent) setOtpSent(false)
                        }}
                        placeholder="name@example.com or 10-digit mobile"
                        className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                      />
                    </div>
                  </div>

                  {/* Get OTP button appears only when field contains complete valid email or 10-digit phone */}
                  {isCitizenIdentifierValid && !otpSent && (
                    <div className="animate-fade-in pt-1">
                      <button
                        type="button"
                        onClick={handleSendCitizenOtp}
                        className="w-full inline-flex items-center justify-center text-sm font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-5 py-3 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                      >
                        Get OTP <span className="ml-2">→</span>
                      </button>
                    </div>
                  )}

                  {/* 6-Digit OTP Verification Box UI */}
                  {otpSent && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                      <div className="p-4 bg-white border border-[#BFD9D2] rounded-xl shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold tracking-wider text-[#176B5B] uppercase">
                            Enter 6-Digit OTP
                          </label>
                          <span className="text-[11px] font-medium text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded-full">
                            OTP Sent
                          </span>
                        </div>

                        <OtpInput
                          length={6}
                          value={otpValue}
                          onChange={setOtpValue}
                          onComplete={() => {}}
                        />

                        <div className="flex items-center justify-between text-xs text-[#5C726E] pt-1">
                          <span>Didn't receive code?</span>
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="font-medium text-[#176B5B] hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                        </div>

                        {resendNotice && (
                          <p className="text-[11px] text-[#176B5B] font-medium animate-fade-in">
                            ✓ New OTP code has been sent.
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                      >
                        Verify &amp; Login <span className="ml-2">→</span>
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                /* Standard Non-Citizen (University, Industry, Government) Login Form */
                <form onSubmit={handleSubmit} className="space-y-5 font-outfit">
                  <div>
                    <label
                      htmlFor="loginEmail"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="loginEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="loginPassword"
                        className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase"
                      >
                        Password
                      </label>
                    </div>
                    <input
                      id="loginPassword"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                    >
                      Login as {roleName} <span className="ml-2">→</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50 text-center font-outfit text-sm text-[#5C726E]">
                New to SETU?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="font-medium text-[#176B5B] hover:text-[#125649] hover:underline transition-colors cursor-pointer ml-1"
                >
                  Create an account
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

export default Login
