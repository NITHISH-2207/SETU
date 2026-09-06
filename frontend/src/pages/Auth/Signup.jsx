import { useState } from 'react'
import RoleStoryPanel from './RoleStoryPanel.jsx'
import OtpInput from './OtpInput.jsx'
import { STAKEHOLDER_ROLES } from './rolesData.jsx'
import {
  signupCitizen,
  requestCitizenOtp,
  verifyCitizenOtp,
  getCitizenProfile,
} from '../../services/authService.js'

function Signup({ selectedRole, onBackToRoles, onNavigate, onLoginSuccess }) {
  const activeRole = selectedRole || STAKEHOLDER_ROLES[0]
  const roleName = activeRole.shortName
  const isCitizen = activeRole.id === 'citizen'

  // Non-Citizen form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Citizen specialized form states
  const [citizenName, setCitizenName] = useState('')
  const [citizenEmail, setCitizenEmail] = useState('')
  const [citizenMobile, setCitizenMobile] = useState('')

  // Mobile OTP states
  const [mobileOtpSent, setMobileOtpSent] = useState(false)
  const [mobileOtpValue, setMobileOtpValue] = useState(['', '', '', '', '', ''])
  const [isMobileVerified, setIsMobileVerified] = useState(false)
  const [mobileResendNotice, setMobileResendNotice] = useState(false)

  // Email OTP states (optional)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtpValue, setEmailOtpValue] = useState(['', '', '', '', '', ''])
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [emailResendNotice, setEmailResendNotice] = useState(false)

  // API Interaction States
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [devOtpInfo, setDevOtpInfo] = useState(null)

  // Validation rules
  const cleanMobile = citizenMobile.trim().replace(/\D/g, '')
  const isMobileValid = /^\d{10}$/.test(cleanMobile)
  const isNameFilled = citizenName.trim().length >= 2

  // Mobile Get OTP button is visible only when Full Name is filled AND Mobile has 10 digits
  const canShowMobileGetOtp = isNameFilled && isMobileValid && !mobileOtpSent && !isMobileVerified

  // Email validation (optional field)
  const cleanEmail = citizenEmail.trim()
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  const canShowEmailGetOtp = isEmailValid && !emailOtpSent && !isEmailVerified

  const handleSendMobileOtp = async () => {
    if (!isNameFilled) {
      setErrorMessage('Please enter your full name (at least 2 characters).')
      return
    }
    if (!isMobileValid) {
      setErrorMessage('Please enter a valid 10-digit mobile number.')
      return
    }
    if (cleanEmail && !isEmailValid) {
      setErrorMessage('Please enter a valid email address or leave it blank.')
      return
    }

    setErrorMessage(null)
    setIsRequestingOtp(true)
    setDevOtpInfo(null)

    try {
      const res = await signupCitizen({
        full_name: citizenName,
        mobile_number: cleanMobile,
        email: cleanEmail || null,
      })

      setMobileOtpSent(true)
      setMobileResendNotice(false)
      if (res?.development_otp) {
        setDevOtpInfo(res.development_otp)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsRequestingOtp(false)
    }
  }

  const handleVerifyMobileOtp = async () => {
    const otpCode = mobileOtpValue.join('')
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.')
      return
    }

    setErrorMessage(null)
    setIsVerifyingOtp(true)

    try {
      await verifyCitizenOtp({
        identifier: cleanMobile,
        mobile_number: cleanMobile,
        otp: otpCode,
      })

      setIsMobileVerified(true)
      setMobileOtpSent(false)

      // Fetch fresh profile with real authenticated citizen data
      const profile = await getCitizenProfile()

      if (onLoginSuccess) {
        onLoginSuccess(profile)
      } else {
        onNavigate('citizen-portal')
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleResendMobileOtp = async () => {
    setErrorMessage(null)
    setMobileResendNotice(false)

    try {
      const res = await requestCitizenOtp({ identifier: cleanMobile, mobile_number: cleanMobile })
      setMobileResendNotice(true)
      if (res?.development_otp) {
        setDevOtpInfo(res.development_otp)
      }
      setTimeout(() => setMobileResendNotice(false), 4000)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend OTP. Please try again.')
    }
  }

  const handleSendEmailOtp = () => {
    if (canShowEmailGetOtp) {
      setEmailOtpSent(true)
      setEmailResendNotice(false)
    }
  }

  const handleVerifyEmailOtp = () => {
    if (emailOtpValue.every((d) => d !== '')) {
      setIsEmailVerified(true)
      setEmailOtpSent(false)
    }
  }

  const handleResendEmailOtp = () => {
    setEmailResendNotice(true)
    setTimeout(() => setEmailResendNotice(false), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isCitizen) {
      if (!isMobileVerified) {
        if (mobileOtpSent) {
          handleVerifyMobileOtp()
        } else if (canShowMobileGetOtp) {
          handleSendMobileOtp()
        }
      } else {
        onNavigate('citizen-portal')
      }
    } else {
      if (!email.trim() || !password.trim()) return
      if (onLoginSuccess) {
        onLoginSuccess({ email, fullName, role: activeRole.id, name: fullName || activeRole.title })
      } else if (activeRole.id === 'industry') {
        onNavigate('industry-dashboard')
      }
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
            <RoleStoryPanel role={activeRole} mode="signup" />
          </div>

          {/* Right Column: Focused Auth Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs">
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
                <p className="mt-2 font-outfit text-sm text-[#5C726E]">
                  Create your account to get started.
                </p>
              </div>

              {/* Inline Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-outfit flex items-start gap-2.5 animate-fade-in">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Citizen Registration Form */}
              {isCitizen ? (
                <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
                  {/* 1. Full Name * */}
                  <div>
                    <label
                      htmlFor="citizenFullName"
                      className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-1.5"
                    >
                      Full Name <span className="text-[#E07A4E]">*</span>
                    </label>
                    <input
                      id="citizenFullName"
                      type="text"
                      required
                      disabled={isRequestingOtp || isVerifyingOtp || mobileOtpSent}
                      value={citizenName}
                      onChange={(e) => {
                        setCitizenName(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150 disabled:bg-[#F7FAF9] disabled:text-[#5C726E]"
                    />
                  </div>

                  {/* 2. Email Address (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="citizenEmail"
                        className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase"
                      >
                        Email Address <span className="text-[#5C726E] font-normal normal-case">(Optional)</span>
                      </label>
                      {isEmailVerified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B5B]">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="citizenEmail"
                        type="email"
                        disabled={isEmailVerified || isRequestingOtp || isVerifyingOtp || mobileOtpSent}
                        value={citizenEmail}
                        onChange={(e) => {
                          setCitizenEmail(e.target.value)
                          if (emailOtpSent) setEmailOtpSent(false)
                          if (errorMessage) setErrorMessage(null)
                        }}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150 disabled:bg-[#F7FAF9] disabled:text-[#5C726E] ${
                          canShowEmailGetOtp ? 'pr-24' : ''
                        }`}
                      />
                      {/* Small Get OTP Button for Email - visible only when email is syntactically valid */}
                      {canShowEmailGetOtp && (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          className="absolute right-2 text-xs font-medium text-white bg-[#176B5B] hover:bg-[#125649] px-3 py-1.5 rounded-md transition-colors cursor-pointer animate-fade-in"
                        >
                          Get OTP
                        </button>
                      )}
                    </div>

                    {/* Email OTP Verification Box UI */}
                    {emailOtpSent && !isEmailVerified && (
                      <div className="mt-3 p-3.5 bg-white border border-[#BFD9D2] rounded-xl shadow-2xs space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#176B5B] uppercase tracking-wider">
                            Email OTP Code
                          </span>
                          <span className="text-[11px] text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded-full">
                            Sent to Email
                          </span>
                        </div>
                        <OtpInput
                          length={6}
                          value={emailOtpValue}
                          onChange={setEmailOtpValue}
                          onComplete={() => {}}
                        />
                        <div className="flex items-center justify-between pt-1 text-xs text-[#5C726E]">
                          <button
                            type="button"
                            onClick={handleResendEmailOtp}
                            className="font-medium text-[#176B5B] hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="text-xs font-medium text-white bg-[#176B5B] hover:bg-[#125649] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Verify Email OTP
                          </button>
                        </div>
                        {emailResendNotice && (
                          <p className="text-[11px] text-[#176B5B] font-medium animate-fade-in">
                            ✓ New email verification code sent.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Mobile Number * (fixed +91 prefix) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="citizenMobile"
                        className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase"
                      >
                        Mobile Number <span className="text-[#E07A4E]">*</span>
                      </label>
                      {isMobileVerified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B5B]">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex rounded-lg border border-[#BFD9D2] bg-white overflow-hidden focus-within:border-[#176B5B] focus-within:ring-2 focus-within:ring-[#176B5B]/20 transition-all duration-150">
                      <span className="inline-flex items-center px-3.5 bg-[#F7FAF9] border-r border-[#BFD9D2] text-sm font-semibold text-[#1F2A28] select-none">
                        +91
                      </span>
                      <input
                        id="citizenMobile"
                        type="tel"
                        required
                        disabled={isMobileVerified || isRequestingOtp || isVerifyingOtp || mobileOtpSent}
                        maxLength={10}
                        value={citizenMobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setCitizenMobile(val)
                          if (mobileOtpSent) setMobileOtpSent(false)
                          if (errorMessage) setErrorMessage(null)
                        }}
                        placeholder="10-digit mobile number"
                        className="flex-1 px-4 py-2.5 sm:py-3 text-sm bg-transparent text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden disabled:bg-[#F7FAF9] disabled:text-[#5C726E]"
                      />
                    </div>
                  </div>

                  {/* Mobile Get OTP Button — appears ONLY once Full Name is filled AND Mobile has 10 digits */}
                  {canShowMobileGetOtp && (
                    <div className="animate-fade-in pt-1">
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        disabled={isRequestingOtp}
                        className="w-full inline-flex items-center justify-center text-sm font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-5 py-2.5 sm:py-3 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isRequestingOtp ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending OTP...
                          </span>
                        ) : (
                          <>
                            Get OTP for Mobile <span className="ml-2">→</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* 4. OTP Verification UI (appears only after Get OTP is clicked) */}
                  {mobileOtpSent && !isMobileVerified && (
                    <div className="mt-3 p-4 bg-white border border-[#BFD9D2] rounded-xl shadow-2xs space-y-3.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold tracking-wider text-[#176B5B] uppercase">
                          Enter 6-Digit Mobile OTP
                        </label>
                        <span className="text-[11px] font-medium text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded-full">
                          OTP Sent to +91 {citizenMobile}
                        </span>
                      </div>

                      {devOtpInfo && (
                        <div className="p-2.5 rounded-lg bg-[#DCEFEA]/60 border border-[#176B5B]/20 text-xs text-[#176B5B] flex items-center justify-between">
                          <span>Verification Code: <strong className="font-mono text-sm tracking-widest">{devOtpInfo}</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              const digits = devOtpInfo.split('')
                              setMobileOtpValue(digits)
                            }}
                            className="text-[11px] font-semibold underline underline-offset-2 hover:text-[#125649] cursor-pointer"
                          >
                            Auto-fill
                          </button>
                        </div>
                      )}

                      <OtpInput
                        length={6}
                        value={mobileOtpValue}
                        onChange={setMobileOtpValue}
                        onComplete={() => {}}
                      />

                      <div className="flex items-center justify-between text-xs text-[#5C726E] pt-1">
                        <button
                          type="button"
                          onClick={handleResendMobileOtp}
                          className="font-medium text-[#176B5B] hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyMobileOtp}
                          disabled={isVerifyingOtp}
                          className="text-xs font-medium text-white bg-[#176B5B] hover:bg-[#125649] px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>

                      {mobileResendNotice && (
                        <p className="text-[11px] text-[#176B5B] font-medium animate-fade-in">
                          ✓ New mobile OTP code sent.
                        </p>
                      )}
                    </div>
                  )}

                  {/* 5. Create Account Button — Enabled/Visible once mobile OTP is verified */}
                  {isMobileVerified && (
                    <div className="pt-3 animate-fade-in">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center text-sm sm:text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                      >
                        Create Account as {roleName} <span className="ml-2">→</span>
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                /* Standard Non-Citizen (University, Industry, Government) Signup Form */
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
              )}

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
