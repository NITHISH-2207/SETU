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
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-8 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Bar / Navigation */}
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
      <main className="max-w-6xl w-full mx-auto my-auto py-8">
        {/* Header Titles */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B] bg-[#DCEFEA]/60 border border-[#BFD9D2]/60 mb-4">
            {isLogin ? 'Authentication Entry' : 'Network Registration'}
          </span>
          <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F2A28]">
            {isLogin ? 'Welcome back to SETU' : 'Join the SETU network'}
          </h1>
          <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
            {isLogin
              ? 'Choose how you connect with SETU to access your workspace.'
              : 'Choose your role to get started and connect with the ecosystem.'}
          </p>
        </div>

        {/* Interactive Hub & Role Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left / Center: Interactive 4-Stakeholder Node Network */}
          <div className="lg:col-span-7 bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 relative shadow-2xs">
            {/* Top Central SETU Nexus Emblem */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#BFD9D2] shadow-2xs">
                <div className="w-2.5 h-2.5 rounded-full bg-[#176B5B] animate-pulse" />
                <span className="font-syne text-xs font-bold tracking-wider text-[#176B5B]">
                  SETU CENTRAL NEXUS
                </span>
              </div>
            </div>

            {/* 4 Role Node Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10 font-outfit">
              {STAKEHOLDER_ROLES.map((role) => {
                const isSelected = selectedRoleId === role.id
                const isHovered = hoveredRoleId === role.id

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    onMouseEnter={() => setHoveredRoleId(role.id)}
                    onMouseLeave={() => setHoveredRoleId(null)}
                    type="button"
                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#176B5B] shadow-xs ring-2 ring-[#176B5B]/15'
                        : isHovered
                        ? 'bg-white/90 border-[#176B5B]/50 shadow-2xs'
                        : 'bg-white/70 border-[#BFD9D2]/70 hover:border-[#176B5B]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {/* Status Node Dot */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#176B5B] text-white'
                              : 'bg-[#DCEFEA] text-[#176B5B]'
                          }`}
                        >
                          {role.iconSvg}
                        </div>
                        <div>
                          <h2 className="font-syne text-sm font-bold text-[#1F2A28]">
                            {role.title}
                          </h2>
                          <p className="text-xs text-[#5C726E]">
                            {role.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Radio Selection Indicator */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
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
                  </button>
                )
              })}
            </div>

            {/* Subtle Connection Bridge Line Footnote */}
            <div className="mt-6 pt-4 border-t border-[#BFD9D2]/60 flex items-center justify-between text-xs text-[#5C726E] font-outfit">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
                Connected through SETU Protocol
              </span>
              <span className="text-[11px] text-[#5C726E]/80">
                Single sign-on architecture
              </span>
            </div>
          </div>

          {/* Right: Selected Role Context & Action Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs font-outfit min-h-[340px]">
            <div>
              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA]/70 text-[#176B5B] border border-[#BFD9D2] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A4E]" />
                {activeRole.badge}
              </div>

              {/* Role Title */}
              <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                {activeRole.title}
              </h2>
              <p className="text-xs font-medium text-[#176B5B] mt-0.5">
                {activeRole.tagline}
              </p>

              {/* Description */}
              <p className="text-sm text-[#1F2A28]/80 mt-4 leading-relaxed font-normal">
                {activeRole.description}
              </p>
            </div>

            {/* Action Section */}
            <div className="mt-8 pt-6 border-t border-[#BFD9D2]/50">
              <button
                onClick={handleContinue}
                className="w-full inline-flex items-center justify-center text-sm font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
              >
                Continue as {selectedRole.shortName} <span className="ml-2">→</span>
              </button>

              <div className="mt-3 text-center text-xs text-[#5C726E]">
                {isLogin ? (
                  <span>Need an account? Switch to registration during next step.</span>
                ) : (
                  <span>Already registered? Switch to login during next step.</span>
                )}
              </div>
            </div>
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
