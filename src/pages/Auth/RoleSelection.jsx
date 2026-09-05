import { useState } from 'react'
import { STAKEHOLDER_ROLES } from './rolesData'

function RoleSelection({ mode = 'login', onSelectRole, onBack }) {
  const [selectedRoleId, setSelectedRoleId] = useState('citizen')
  const [hoveredRoleId, setHoveredRoleId] = useState(null)

  const activeRole = STAKEHOLDER_ROLES.find(
    (r) => r.id === (hoveredRoleId || selectedRoleId)
  ) || STAKEHOLDER_ROLES[0]

  const selectedRole = STAKEHOLDER_ROLES.find((r) => r.id === selectedRoleId) || STAKEHOLDER_ROLES[0]

  const isLogin = mode === 'login'

  const handleContinue = () => {
    onSelectRole(selectedRole)
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> Back to SETU
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • Gateway
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-auto py-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B] bg-[#DCEFEA]/60 border border-[#BFD9D2]/60 mb-3">
            {isLogin ? 'Authentication Entry' : 'Network Registration'}
          </span>
          <h1 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28]">
            {isLogin ? 'Welcome back' : 'Join SETU'}
          </h1>
          <p className="mt-2 font-outfit text-sm sm:text-base text-[#5C726E]">
            Choose your role to enter your workspace.
          </p>
        </div>

        {/* Distinctive Expandable Role Deck */}
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-4 sm:p-6 shadow-2xs">
          {/* 4 Expandable Role Panels */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-outfit">
            {STAKEHOLDER_ROLES.map((role) => {
              const isSelected = selectedRoleId === role.id
              const isHovered = hoveredRoleId === role.id

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  onMouseEnter={() => setHoveredRoleId(role.id)}
                  onMouseLeave={() => setHoveredRoleId(null)}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-white border-[#176B5B] shadow-xs ring-2 ring-[#176B5B]/15'
                      : isHovered
                      ? 'bg-white/90 border-[#176B5B]/40 shadow-2xs'
                      : 'bg-white/70 border-[#BFD9D2]/70 hover:border-[#176B5B]/30'
                  }`}
                >
                  <div>
                    {/* Top Role Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#176B5B] text-white'
                            : 'bg-[#DCEFEA] text-[#176B5B]'
                        }`}
                      >
                        {role.iconSvg}
                      </div>

                      {/* Radio Dot */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#176B5B] bg-[#176B5B]'
                            : 'border-[#BFD9D2] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    <h2 className="font-syne text-base font-bold text-[#1F2A28]">
                      {role.title}
                    </h2>
                    <p className="text-xs text-[#176B5B] font-medium mt-0.5">
                      {role.tagline}
                    </p>

                    {/* 1-Line Trimmed Description */}
                    <p className="text-xs text-[#5C726E] mt-2.5 leading-relaxed font-normal">
                      {role.description}
                    </p>
                  </div>

                  {/* Role Badge Indicator */}
                  <div className="mt-4 pt-3 border-t border-[#BFD9D2]/40 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#5C726E]">
                      {role.badge}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E07A4E]" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-5 border-t border-[#BFD9D2]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#5C726E] font-outfit text-center sm:text-left">
              Role: <span className="font-bold text-[#176B5B]">{activeRole.title}</span> — {activeRole.description}
            </div>

            <button
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-7 py-3 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] shrink-0 font-outfit"
            >
              Continue as {selectedRole.shortName} <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default RoleSelection
