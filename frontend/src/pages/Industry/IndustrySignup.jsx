import { useState } from 'react'
import RoleStoryPanel from '../Auth/RoleStoryPanel.jsx'
import OtpInput from '../Auth/OtpInput.jsx'
import { STAKEHOLDER_ROLES } from '../Auth/rolesData.jsx'

function IndustrySignup({ onBackToRoles, onNavigate, onLoginSuccess }) {
  const industryRole = STAKEHOLDER_ROLES.find((r) => r.id === 'industry') || {
    id: 'industry',
    title: 'Industry / CSR',
    shortName: 'Industry / CSR',
    headline: 'Support innovation. Create measurable impact.',
    storyText: 'Channel CSR funds, technical infrastructure, and resources toward vetted societal solutions.',
  }

  // Exactly the 7 fields
  const [industryName, setIndustryName] = useState('')
  const [cinGstin, setCinGstin] = useState('')
  const [designation, setDesignation] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Phone OTP Interaction states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false)
  const [phoneOtpValue, setPhoneOtpValue] = useState(['', '', '', '', '', ''])
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [resendNotice, setResendNotice] = useState(false)

  // Validation / Loading states
  const [errorMessage, setErrorMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Phone number checks
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const is10DigitPhone = cleanPhone.length === 10
  const canShowGetOtp = is10DigitPhone && !isPhoneVerified && !phoneOtpSent

  const handleSendOtp = () => {
    if (!is10DigitPhone) {
      setErrorMessage('Please enter a valid 10-digit mobile number to request OTP.')
      return
    }
    setErrorMessage(null)
    setPhoneOtpSent(true)
    setResendNotice(false)
  }

  const handleVerifyOtp = () => {
    const code = phoneOtpValue.join('')
    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit OTP.')
      return
    }
    setErrorMessage(null)
    setIsPhoneVerified(true)
    setPhoneOtpSent(false)
  }

  const handleResendOtp = () => {
    setResendNotice(true)
    setTimeout(() => setResendNotice(false), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!industryName.trim()) {
      setErrorMessage('Please enter the Industry / Corporate Name.')
      return
    }

    if (!cinGstin.trim()) {
      setErrorMessage('Please enter your Corporate CIN or GSTIN.')
      return
    }

    if (!designation.trim()) {
      setErrorMessage('Please enter your Designation / Role.')
      return
    }

    const cleanEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    if (!cleanEmail || !isValidEmail) {
      setErrorMessage('Please enter a valid official email address.')
      return
    }

    if (!is10DigitPhone) {
      setErrorMessage('Please enter a valid 10-digit phone number.')
      return
    }

    if (!isPhoneVerified) {
      setErrorMessage('Please verify your phone number via OTP before creating your account.')
      return
    }

    if (!password) {
      setErrorMessage('Please create a password.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.')
      return
    }

    setIsSubmitting(true)

    // Frontend-only mock registration
    setTimeout(() => {
      setIsSubmitting(false)
      const mockProfile = {
        name: industryName.trim(),
        industryName: industryName.trim(),
        cinGstin: cinGstin.trim(),
        designation: designation.trim(),
        email: cleanEmail,
        phone: cleanPhone,
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
            <RoleStoryPanel role={industryRole} mode="signup" />
          </div>

          {/* Right Column: Focused Auth Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xs">
              {/* Role Header Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#BFD9D2]/50">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                  <span>Industry / CSR Partner Registration</span>
                </div>

                <button
                  type="button"
                  onClick={onBackToRoles}
                  className="text-xs text-[#5C726E] hover:text-[#176B5B] underline underline-offset-2 cursor-pointer font-outfit transition-colors"
                >
                  Change role
                </button>
              </div>

              {/* Form Heading */}
              <div className="mb-6">
                <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2A28]">
                  Partner with SETU
                </h1>
                <p className="mt-1.5 font-outfit text-xs sm:text-sm text-[#5C726E]">
                  Register your organization to direct CSR resources and collaborate on vetted societal problems.
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl text-xs sm:text-sm font-outfit bg-red-50 text-red-700 border border-red-200/80 flex items-start gap-2.5">
                  <span className="font-bold text-red-500 text-sm">⚠</span>
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {/* Industry Signup Form (7 Exact Fields) */}
              <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                {/* 1. Industry Name */}
                <div>
                  <label
                    htmlFor="signupIndustryName"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Industry / Corporate Name
                  </label>
                  <input
                    id="signupIndustryName"
                    type="text"
                    required
                    value={industryName}
                    onChange={(e) => setIndustryName(e.target.value)}
                    placeholder="e.g. Tata Group / Tata Trusts"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                {/* 2. CIN / GSTIN & 3. Designation (2-column layout on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="signupCinGstin"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                    >
                      CIN / GSTIN
                    </label>
                    <input
                      id="signupCinGstin"
                      type="text"
                      required
                      value={cinGstin}
                      onChange={(e) => setCinGstin(e.target.value)}
                      placeholder="e.g. L28920MH1945..."
                      className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signupDesignation"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                    >
                      Designation
                    </label>
                    <input
                      id="signupDesignation"
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Head of CSR"
                      className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                    />
                  </div>
                </div>

                {/* 4. Official Email */}
                <div>
                  <label
                    htmlFor="signupOfficialEmail"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Official Email
                  </label>
                  <input
                    id="signupOfficialEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="csr.lead@tata.com"
                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
                  />
                </div>

                {/* 5. Phone Number & OTP Interaction */}
                <div>
                  <label
                    htmlFor="signupPhoneNumber"
                    className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input
                        id="signupPhoneNumber"
                        type="tel"
                        required
                        disabled={isPhoneVerified}
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setPhoneNumber(val)
                          if (isPhoneVerified) setIsPhoneVerified(false)
                        }}
                        placeholder="10-digit mobile number"
                        className={`w-full px-4 py-2.5 sm:py-3 text-sm bg-white border rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150 ${
                          isPhoneVerified ? 'border-[#176B5B] bg-[#DCEFEA]/20' : 'border-[#BFD9D2]'
                        }`}
                      />
                      {isPhoneVerified && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#176B5B] flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* "Get OTP" appears ONLY once complete 10-digit number is entered */}
                    {canShowGetOtp && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2.5 sm:py-3 bg-[#176B5B] text-white text-xs font-medium rounded-lg hover:bg-[#125649] transition-colors cursor-pointer shrink-0"
                      >
                        Get OTP
                      </button>
                    )}
                  </div>

                  {/* 6-Digit OTP Section when Get OTP is clicked */}
                  {phoneOtpSent && !isPhoneVerified && (
                    <div className="mt-3 p-4 bg-white border border-[#BFD9D2] rounded-xl shadow-2xs space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5C726E]">
                          Enter 6-digit verification code sent to <b className="text-[#1F2A28]">+91 {phoneNumber}</b>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            // Auto-fill dev helper
                            const devCode = ['1', '2', '3', '4', '5', '6']
                            setPhoneOtpValue(devCode)
                          }}
                          className="text-[11px] font-medium text-[#176B5B] hover:underline cursor-pointer"
                        >
                          Auto-fill
                        </button>
                      </div>

                      <OtpInput
                        length={6}
                        value={phoneOtpValue}
                        onChange={setPhoneOtpValue}
                        onComplete={handleVerifyOtp}
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-xs text-[#5C726E] hover:text-[#176B5B] font-medium cursor-pointer"
                        >
                          Resend OTP
                        </button>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-4 py-1.5 bg-[#176B5B] text-white text-xs font-semibold rounded-lg hover:bg-[#125649] transition-colors cursor-pointer"
                        >
                          Verify OTP
                        </button>
                      </div>

                      {resendNotice && (
                        <p className="text-xs text-[#176B5B] font-medium animate-fade-in">
                          ✓ OTP resent successfully.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 6. Password & 7. Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        Register Organization <span className="ml-2">→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-6 pt-5 border-t border-[#BFD9D2]/50 text-center font-outfit text-sm text-[#5C726E]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate?.('login')}
                  className="font-medium text-[#176B5B] hover:text-[#125649] hover:underline transition-colors cursor-pointer ml-1"
                >
                  Sign In
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

export default IndustrySignup
