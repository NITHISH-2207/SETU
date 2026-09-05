import { useState } from 'react'

const UNIVERSITY_SUB_ROLES = [
  {
    id: 'admin',
    title: 'University Admin',
    subtitle: 'Institutional Governance',
    description: 'Manage university participation and approvals.',
    badge: 'Institutional Level',
    renderIcon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V10" />
        <path d="M19 21V10" />
        <path d="M9 21V10" />
        <path d="M15 21V10" />
        <path d="m2 10 10-6 10 6" />
      </svg>
    ),
  },
  {
    id: 'mentor',
    title: 'Mentor',
    subtitle: 'Faculty & Domain Experts',
    description: 'Guide research and contribute expertise.',
    badge: 'Faculty & Research',
    renderIcon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Undergrad & Postgrad Innovators',
    description: 'Explore relevant problems and contribute solutions.',
    badge: 'Innovators & Teams',
    renderIcon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
]

function UniversityRoleSelection({ onSelectSubRole, onBack, selectedInstitution = null }) {
  const [selectedRoleId, setSelectedRoleId] = useState('student')
  const [hoveredRoleId, setHoveredRoleId] = useState(null)

  const activeRole = UNIVERSITY_SUB_ROLES.find(
    (r) => r.id === (hoveredRoleId || selectedRoleId)
  ) || UNIVERSITY_SUB_ROLES[0]

  const selectedRoleObj = UNIVERSITY_SUB_ROLES.find(
    (r) => r.id === selectedRoleId
  ) || UNIVERSITY_SUB_ROLES[0]

  const handleContinue = () => {
    onSelectSubRole(selectedRoleId)
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B] font-outfit">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> Back to Institutions
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • University Portal Gateway
          </span>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="max-w-5xl w-full mx-auto my-auto py-6">
        {/* Header Heading */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 font-outfit">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[#176B5B] bg-[#DCEFEA]/60 border border-[#BFD9D2]/60 mb-3">
            Academic &amp; Research Ecosystem
          </span>
          <h1 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28]">
            Select University Role
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#5C726E]">
            {selectedInstitution ? (
              <span>Affiliated with <strong className="text-[#176B5B]">{selectedInstitution.name}</strong></span>
            ) : (
              'Choose your academic profile to access your tailored innovation workspace.'
            )}
          </p>
        </div>

        {/* 3-Card Deck */}
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-4 sm:p-6 shadow-2xs font-outfit">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {UNIVERSITY_SUB_ROLES.map((role) => {
              const isSelected = selectedRoleId === role.id
              const isHovered = hoveredRoleId === role.id

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  onMouseEnter={() => setHoveredRoleId(role.id)}
                  onMouseLeave={() => setHoveredRoleId(null)}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-white border-[#176B5B] shadow-sm ring-2 ring-[#176B5B]/15'
                      : isHovered
                      ? 'bg-white/90 border-[#176B5B]/40 shadow-2xs -translate-y-0.5'
                      : 'bg-white/70 border-[#BFD9D2]/70 hover:border-[#176B5B]/30'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Radio Indicator */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#176B5B] text-white shadow-2xs'
                            : 'bg-[#DCEFEA] text-[#176B5B]'
                        }`}
                      >
                        {role.renderIcon()}
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#176B5B] bg-[#176B5B]' : 'border-[#BFD9D2] bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    <h2 className="font-syne text-lg sm:text-xl font-bold text-[#1F2A28]">
                      {role.title}
                    </h2>
                    <p className="text-xs text-[#176B5B] font-semibold mt-0.5">
                      {role.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-[#5C726E] mt-3 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Card Bottom: Badge & Selection Indicator */}
                  <div className="mt-6 pt-3.5 border-t border-[#BFD9D2]/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#5C726E]">
                      {role.badge}
                    </span>
                    {isSelected ? (
                      <span className="text-xs font-bold text-[#176B5B] flex items-center gap-1">
                        <span>Selected</span>
                        <span>✓</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#5C726E] group-hover:text-[#176B5B] transition-colors">
                        Click to select
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-[#BFD9D2]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5C726E] text-center sm:text-left">
              Selected: <span className="font-bold text-[#176B5B]">{activeRole.title}</span> — {activeRole.description}
            </div>

            <button
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-8 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] shrink-0 font-outfit"
            >
              Continue as {selectedRoleObj.title} <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default UniversityRoleSelection
