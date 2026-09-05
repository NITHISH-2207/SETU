import { useState } from 'react'
import UniversityAuthLayout from './components/UniversityAuthLayout.jsx'
import UniversityVerification from './components/UniversityVerification.jsx'
import UniversitySelect from './components/UniversitySelect.jsx'
import TagInput from './components/TagInput.jsx'
import PendingApproval from './components/PendingApproval.jsx'
import { SUGGESTED_DOMAINS, SUGGESTED_SKILLS } from './universityMockData.js'

function StudentSignup({ onBackToRoles, onNavigateToLogin }) {
  const [step, setStep] = useState(1) // 1 | 2 | 'pending'

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Step 2: Academic Details
  const [university, setUniversity] = useState('Anna University, Chennai')
  const [department, setDepartment] = useState('Computer Science & Engineering')
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year (Junior)')
  const [skills, setSkills] = useState(['Full Stack Web Development', 'Data Science & Analytics'])
  const [domains, setDomains] = useState(['Water Sanitation & Supply', 'Smart Mobility'])

  const handleStep1Continue = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all personal details.')
      return
    }
    if (!isVerified) {
      setErrorMsg('Please verify your email address to proceed.')
      return
    }
    setErrorMsg('')
    setStep(2)
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    if (!university || !department.trim() || !yearOfStudy) {
      setErrorMsg('Please complete your academic affiliation details.')
      return
    }
    if (skills.length === 0) {
      setErrorMsg('Please add at least one technical or domain skill.')
      return
    }
    setErrorMsg('')
    setStep('pending')
  }

  if (step === 'pending') {
    return (
      <UniversityAuthLayout
        roleType="student"
        roleBadgeText="Student Portal"
        headline="Turn learning into meaningful impact."
        storyText="Connect student initiatives and academic research directly to verified societal issues."
        onBack={onNavigateToLogin}
        backLabel="Back to Student Login"
      >
        <PendingApproval
          role="student"
          userName={fullName}
          email={email}
          university={university}
          onBackToLogin={onNavigateToLogin}
        />
      </UniversityAuthLayout>
    )
  }

  return (
    <UniversityAuthLayout
      roleType="student"
      roleBadgeText="Student Portal"
      headline="Turn learning into meaningful impact."
      storyText="Connect student initiatives and academic research directly to verified societal issues."
      onBack={onBackToRoles}
      backLabel="Back to University Roles"
    >
      <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xs font-outfit">
        {/* Step Progress Indicator Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#BFD9D2]/50">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === 1
                  ? 'bg-[#176B5B] text-white shadow-2xs'
                  : 'bg-[#DCEFEA] text-[#176B5B]'
              }`}
            >
              1. Personal Details
            </span>
            <span className="text-[#BFD9D2] font-mono">──</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === 2
                  ? 'bg-[#176B5B] text-white shadow-2xs'
                  : 'bg-white text-[#5C726E] border border-[#BFD9D2]'
              }`}
            >
              2. Academic Details
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs text-[#5C726E] hover:text-[#176B5B] underline underline-offset-2 cursor-pointer transition-colors"
          >
            Already registered? Sign in
          </button>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2A28]">
            {step === 1 ? 'Student Registration' : 'Academic & Research Profile'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C726E]">
            {step === 1
              ? 'Enter your personal information and complete instant verification.'
              : 'Specify your department, skillsets, and societal research areas of interest.'}
          </p>
        </div>

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Continue} className="space-y-4 sm:space-y-5">
            {/* Two-Column: Full Name + Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="studFullName"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Full Name <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="studFullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kavitha Ramasamy"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="studMobile"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Mobile Number <span className="text-[#E07A4E]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-[#5C726E] font-mono select-none">
                    +91
                  </span>
                  <input
                    id="studMobile"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Two-Column: Email Address + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="studEmail"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  University / Student Email <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="studEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (isVerified) setIsVerified(false)
                  }}
                  placeholder="kavitha@annauniv.edu"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="studPassword"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Create Password <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="studPassword"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* In-Line Verification Box UI */}
            <div className="pt-1">
              <UniversityVerification
                targetValue={email || mobile}
                targetType={email ? 'Email' : 'Mobile'}
                isVerified={isVerified}
                onVerified={(status) => {
                  setIsVerified(status)
                  setErrorMsg('')
                }}
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-[#E07A4E] font-medium animate-fade-in">
                {errorMsg}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs text-[#5C726E] hover:text-[#176B5B] cursor-pointer"
              >
                ← Back to Login
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-7 py-3 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Continue to Academic Info</span>
                <span className="ml-2">→</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Academic Details */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4 sm:space-y-5">
            {/* Searchable University Selector */}
            <UniversitySelect
              value={university}
              onChange={setUniversity}
              required
              label="Affiliated University / Institution"
            />

            {/* Two-Column: Department + Year of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="studDept"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Department / Branch <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="studDept"
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="studYear"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Year of Study <span className="text-[#E07A4E]">*</span>
                </label>
                <select
                  id="studYear"
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                  <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                  <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                  <option value="4th Year (Senior)">4th Year (Senior)</option>
                  <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                  <option value="Ph.D. / Research Scholar">Ph.D. / Research Scholar</option>
                </select>
              </div>
            </div>

            {/* Multi-Value Skills Tag Input */}
            <TagInput
              label="Technical & Problem Solving Skills"
              placeholder="Type a skill and press Enter (e.g. IoT, CAD, GIS)..."
              tags={skills}
              onChange={setSkills}
              suggestions={SUGGESTED_SKILLS}
              required
            />

            {/* Multi-Value Domains Tag Input */}
            <TagInput
              label="Societal Impact Domains / Areas of Interest"
              placeholder="Type an area of interest and press Enter..."
              tags={domains}
              onChange={setDomains}
              suggestions={SUGGESTED_DOMAINS}
              required
            />

            {errorMsg && (
              <p className="text-xs text-[#E07A4E] font-medium animate-fade-in">
                {errorMsg}
              </p>
            )}

            <div className="pt-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C726E] hover:text-[#176B5B] cursor-pointer"
              >
                <span>←</span> Back to Personal Info
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center text-sm sm:text-base font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-8 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Submit Registration</span>
                <span className="ml-2">✓</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </UniversityAuthLayout>
  )
}

export default StudentSignup
