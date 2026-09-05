import { useState, useMemo } from 'react'
import { MOCK_UNIVERSITIES } from './universityMockData.js'

function InstitutionSelection({ onSelectInstitution, onBack, initialSelected = null }) {
  const [selectedId, setSelectedId] = useState(initialSelected?.id || 'u1')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_UNIVERSITIES
    const q = searchQuery.toLowerCase().trim()
    return MOCK_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const selectedInstitution = MOCK_UNIVERSITIES.find((u) => u.id === selectedId) || null

  const handleContinue = () => {
    if (selectedInstitution) {
      onSelectInstitution(selectedInstitution)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B] font-outfit">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> Back to role selection
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • University Portal
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6 space-y-6">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[#176B5B] bg-[#DCEFEA]/60 border border-[#BFD9D2]/60 mb-3">
            Institutional Affiliation
          </span>
          <h1 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28]">
            Choose Your Institution
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#5C726E]">
            Select your affiliated university or college to continue to role selection.
          </p>
        </div>

        {/* Institution Directory Card */}
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, code, or state (e.g. Anna, IIT, Tamil Nadu)..."
              className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/70 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
            />
            <svg
              className="w-4.5 h-4.5 text-[#5C726E] absolute left-3.5 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C726E] hover:text-[#1F2A28] p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* List of Institutions */}
          <div className="max-h-72 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((univ) => {
                const isSelected = selectedId === univ.id
                return (
                  <div
                    key={univ.id}
                    onClick={() => setSelectedId(univ.id)}
                    className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#176B5B] shadow-xs ring-2 ring-[#176B5B]/15'
                        : 'bg-white/80 border-[#BFD9D2]/70 hover:bg-white hover:border-[#176B5B]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-[#176B5B] text-white shadow-2xs' : 'bg-[#DCEFEA] text-[#176B5B]'
                        }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V10" />
                          <path d="M19 21V10" />
                          <path d="M9 21V10" />
                          <path d="M15 21V10" />
                          <path d="m2 10 10-6 10 6" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-syne text-sm sm:text-base font-bold text-[#1F2A28] truncate">
                          {univ.name}
                        </h3>
                        <p className="text-xs text-[#5C726E] mt-0.5">
                          {univ.state} • Code: <span className="font-mono font-semibold text-[#176B5B]">{univ.code}</span>
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#176B5B] bg-[#176B5B]' : 'border-[#BFD9D2] bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="bg-white border border-dashed border-[#BFD9D2] rounded-xl p-8 text-center space-y-1">
                <p className="text-sm font-semibold text-[#1F2A28]">No institutions found</p>
                <p className="text-xs text-[#5C726E]">
                  Try searching with a different term or keyword.
                </p>
              </div>
            )}
          </div>

          {/* Currently Selected Institution Summary Box */}
          {selectedInstitution && (
            <div className="p-4 bg-white border border-[#176B5B]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <div>
                  <span className="text-[11px] font-bold text-[#176B5B] uppercase tracking-wider block">
                    Selected Institution
                  </span>
                  <p className="font-syne text-sm font-bold text-[#1F2A28]">
                    {selectedInstitution.name}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 self-start sm:self-auto">
                {selectedInstitution.code}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-[#BFD9D2]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="text-xs sm:text-sm font-semibold text-[#5C726E] hover:text-[#176B5B] cursor-pointer"
            >
              ← Back to Main Roles
            </button>

            <button
              type="button"
              disabled={!selectedInstitution}
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-8 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue to University Roles</span>
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default InstitutionSelection
