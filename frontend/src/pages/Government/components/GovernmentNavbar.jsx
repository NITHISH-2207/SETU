import { useState } from 'react'

function GovernmentNavbar({
  activeTab,
  onTabChange,
  departmentName,
  onLogout,
  needsAttentionCount = 0,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'complaints', label: 'Complaints' },
    { id: 'insights', label: 'Insights' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#BFD9D2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Department Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="font-syne text-2xl font-bold tracking-tight text-[#176B5B]">
                SETU
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E07A4E]" />
            </div>

            <div className="hidden sm:block h-6 w-px bg-[#BFD9D2]" />

            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5C726E] font-outfit">
                Government Portal
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1F2A28] font-syne truncate max-w-[200px] md:max-w-[320px]">
                {departmentName}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2 font-outfit">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F7FAF9] text-[#176B5B] font-semibold border border-[#BFD9D2]/70 shadow-2xs'
                      : 'text-[#1F2A28]/80 hover:text-[#176B5B] hover:bg-[#F7FAF9]/60 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'dashboard' && needsAttentionCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#E07A4E] text-white">
                      {needsAttentionCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Action / Logout */}
          <div className="hidden md:flex items-center gap-3 font-outfit">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#BFD9D2] text-xs font-semibold text-[#5C726E] hover:text-[#1F2A28] hover:border-[#1F2A28]/40 hover:bg-[#F7FAF9] transition-all cursor-pointer shadow-2xs"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-[#BFD9D2] text-[#1F2A28] hover:bg-[#F7FAF9] focus:outline-hidden"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#BFD9D2] bg-white px-4 py-3 space-y-1 font-outfit shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-left ${
                  isActive
                    ? 'bg-[#DCEFEA] text-[#176B5B]'
                    : 'text-[#5C726E] hover:bg-[#F7FAF9]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'dashboard' && needsAttentionCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#E07A4E] text-white">
                    {needsAttentionCount}
                  </span>
                )}
              </button>
            )
          })}
          <div className="pt-2 border-t border-[#BFD9D2]">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onLogout()
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#E07A4E] hover:bg-[#F7FAF9]"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout ({departmentName})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default GovernmentNavbar
