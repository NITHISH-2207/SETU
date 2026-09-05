import { useState } from 'react'
import UniversityAuthLayout from './components/UniversityAuthLayout.jsx'
import UniversityVerification from './components/UniversityVerification.jsx'
import UniversitySelect from './components/UniversitySelect.jsx'
import TagInput from './components/TagInput.jsx'
import PendingApproval from './components/PendingApproval.jsx'
import { SUGGESTED_DOMAINS, SUGGESTED_SKILLS } from './universityMockData.js'

function MentorSignup({ onBackToRoles, onNavigateToLogin }) {
  const [step, setStep] = useState(1) // 1 | 2 | 'pending'

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Step 2: Professional Details
  const [university, setUniversity] = useState('Indian Institute of Technology Madras (IIT Madras)')
  const [designation, setDesignation] = useState('Associate Professor')
  const [department, setDepartment] = useState('Civil & Environmental Engineering')
  const [experience, setExperience] = useState('10+ Years')
  const [domains, setDomains] = useState(['Water Sanitation & Supply', 'Urban Drainage & Flood Mitigation'])
  const [skills, setSkills] = useState(['Environmental Testing', 'Civil & Structural Engineering', 'GIS & Spatial Mapping'])

  const handleStep1Continue = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all personal details.')
      return
    }
    if (!isVerified) {
      setErrorMsg('Please verify your official email address to proceed.')
      return
    }
    setErrorMsg('')
    setStep(2)
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    if (!university || !designation.trim() || !department.trim()) {
      setErrorMsg('Please complete your institutional affiliation details.')
      return
    }
    if (domains.length === 0) {
      setErrorMsg('Please add at least one domain of expertise.')
      return
    }
    setErrorMsg('')
    setStep('pending')
  }

  if (step === 'pending') {
    return (
      <UniversityAuthLayout
        roleType="mentor"
        roleBadgeText="Mentor Portal"
        headline="Guide meaningful research and real-world solutions."
        storyText="Supervise multidisciplinary student teams, validate technical feasibility, and steward high-impact research."
        onBack={onNavigateToLogin}
        backLabel="Back to Mentor Login"
      >
        <PendingApproval
          role="mentor"
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
      roleType="mentor"
      roleBadgeText="Mentor Portal"
      headline="Guide meaningful research and real-world solutions."
      storyText="Supervise multidisciplinary student teams, validate technical feasibility, and steward high-impact research."
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
              2. Professional Details
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
            {step === 1 ? 'Mentor Registration' : 'Professional & Advisory Profile'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C726E]">
            {step === 1
              ? 'Enter your institutional contact information and complete verification.'
              : 'Specify your academic rank, department, and research expertise domains.'}
          </p>
        </div>

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Continue} className="space-y-4 sm:space-y-5">
            {/* Two-Column: Full Name + Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="mentorFullName"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Full Name (with Title) <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="mentorFullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Prof. K. Narayanan"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="mentorMobile"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Mobile Number <span className="text-[#E07A4E]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-[#5C726E] font-mono select-none">
                    +91
                  </span>
                  <input
                    id="mentorMobile"
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

            {/* Two-Column: Institutional Email + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="mentorEmail"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Institutional / Official Email <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="mentorEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (isVerified) setIsVerified(false)
                  }}
                  placeholder="narayanan@iitm.ac.in"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="mentorPassword"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Create Password <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="mentorPassword"
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
                <span>Continue to Professional Info</span>
                <span className="ml-2">→</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Professional Details */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4 sm:space-y-5">
            {/* Searchable University Selector */}
            <UniversitySelect
              value={university}
              onChange={setUniversity}
              required
              label="Affiliated University / Research Institution"
            />

            {/* Two-Column: Designation + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="mentorDesignation"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Designation / Academic Rank <span className="text-[#E07A4E]">*</span>
                </label>
                <select
                  id="mentorDesignation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs cursor-pointer"
                >
                  <option value="Professor">Professor / Department Head</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Principal Investigator">Principal Investigator / Scientist</option>
                  <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                  <option value="Adjunct Domain Expert">Adjunct Domain Expert</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mentorDepartment"
                  className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
                >
                  Department / School <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="mentorDepartment"
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Environmental Engineering"
                  className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Experience Selection */}
            <div>
              <label
                htmlFor="mentorExp"
                className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase mb-2"
              >
                Research &amp; Teaching Experience
              </label>
              <select
                id="mentorExp"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs cursor-pointer"
              >
                <option value="1-3 Years">1 - 3 Years</option>
                <option value="3-5 Years">3 - 5 Years</option>
                <option value="5-10 Years">5 - 10 Years</option>
                <option value="10+ Years">10+ Years (Senior Faculty)</option>
                <option value="15+ Years">15+ Years (Distinguished Fellow)</option>
              </select>
            </div>

            {/* Multi-Value Domains Tag Input */}
            <TagInput
              label="Domains of Research &amp; Advisory Expertise"
              placeholder="Add expertise area (e.g. Water Treatment, Solar Cells)..."
              tags={domains}
              onChange={setDomains}
              suggestions={SUGGESTED_DOMAINS}
              required
            />

            {/* Multi-Value Skills Tag Input */}
            <TagInput
              label="Technical Methodologies &amp; Capabilities"
              placeholder="Add skills / methodologies..."
              tags={skills}
              onChange={setSkills}
              suggestions={SUGGESTED_SKILLS}
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

export default MentorSignup
