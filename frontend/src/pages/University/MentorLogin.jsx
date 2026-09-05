import { useState } from 'react'
import UniversityAuthLayout from './components/UniversityAuthLayout.jsx'
import PendingApproval from './components/PendingApproval.jsx'
import { DEMO_MENTOR_PROFILE } from './universityMockData.js'

function MentorLogin({ onBackToRoles, onNavigateToSignup, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('narayanan.mentor@iitm.ac.in')
  const [password, setPassword] = useState('••••••••••')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPendingScreen, setIsPendingScreen] = useState(false)
  const [accountStatus, setAccountStatus] = useState('PENDING_APPROVAL') // 'PENDING_APPROVAL' | 'ACTIVE'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setErrorMsg('Please enter your mentor email or mobile number.')
      return
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.')
      return
    }

    setErrorMsg('')

    if (accountStatus === 'PENDING_APPROVAL') {
      setIsPendingScreen(true)
    } else {
      onLoginSuccess?.({
        ...DEMO_MENTOR_PROFILE,
        status: 'ACTIVE',
      })
    }
  }

  if (isPendingScreen) {
    return (
      <UniversityAuthLayout
        roleType="mentor"
        roleBadgeText="Mentor Portal"
        headline="Guide meaningful research and real-world solutions."
        storyText="Supervise multidisciplinary student teams, validate technical feasibility, and steward high-impact research."
        onBack={onBackToRoles}
        backLabel="Back to University Roles"
      >
        <PendingApproval
          role="mentor"
          userName={DEMO_MENTOR_PROFILE.name}
          email={identifier || DEMO_MENTOR_PROFILE.email}
          university={DEMO_MENTOR_PROFILE.university}
          onBackToLogin={() => setIsPendingScreen(false)}
          onSimulateApprove={() => {
            setAccountStatus('ACTIVE')
            setIsPendingScreen(false)
          }}
        />
      </UniversityAuthLayout>
    )
  }

  return (
    <UniversityAuthLayout
      roleType="mentor"
      roleBadgeText="Mentor Portal"
      headline="Guide meaningful research and real-world solutions."
      storyText="Supervise multidisciplinary student teams, validate technical feasibility, and steward high-impact research."
      onBack={onBackToRoles}
      backLabel="Back to University Roles"
    >
      <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs font-outfit">
        {/* Role Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#BFD9D2]/50">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>Faculty &amp; Expert Access</span>
          </div>

          <button
            type="button"
            onClick={onBackToRoles}
            className="text-xs text-[#5C726E] hover:text-[#176B5B] underline underline-offset-2 cursor-pointer transition-colors"
          >
            Change role
          </button>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1F2A28]">
            Mentor Sign In
          </h1>
          <p className="mt-2 text-sm text-[#5C726E]">
            Sign in to oversee active student initiatives and guide solutions for societal challenges.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="mentorIdentifier"
              className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
            >
              Email or Mobile Number <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              id="mentorIdentifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="mentor@university.edu or 10-digit mobile"
              className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
            />
          </div>

          <div>
            <label
              htmlFor="mentorPassword"
              className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
            >
              Password <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              id="mentorPassword"
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

          {/* Demo Account Status Selector */}
          <div className="p-3 bg-white border border-[#BFD9D2]/70 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#5C726E]">Demo Approval State:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAccountStatus('PENDING_APPROVAL')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  accountStatus === 'PENDING_APPROVAL'
                    ? 'bg-[#E07A4E] text-white'
                    : 'bg-[#F7FAF9] text-[#5C726E]'
                }`}
              >
                Pending Review
              </button>
              <button
                type="button"
                onClick={() => setAccountStatus('ACTIVE')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  accountStatus === 'ACTIVE'
                    ? 'bg-[#176B5B] text-white'
                    : 'bg-[#F7FAF9] text-[#5C726E]'
                }`}
              >
                Active
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center text-sm sm:text-base font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Login as Mentor</span>
              <span className="ml-2">→</span>
            </button>
          </div>
        </form>

        {/* Create Account Link */}
        <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50 text-center text-sm text-[#5C726E]">
          New to SETU?{' '}
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer ml-1"
          >
            Create Mentor Account
          </button>
        </div>
      </div>
    </UniversityAuthLayout>
  )
}

export default MentorLogin
