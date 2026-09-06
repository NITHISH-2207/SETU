import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function CSRNavbar({ activeTab, onSelectTab, companyProfile, onLogout }) {
  const { t, i18n } = useTranslation()
  const companyName = companyProfile?.companyName || 'ArunTech Industries Pvt. Ltd.'
  const currentLanguage = i18n.language || 'en'
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  const langLabels = { en: 'EN', ta: 'தமிழ்', hi: 'हिंदी' }
  const langFull = { en: 'English', ta: 'தமிழ் (Tamil)', hi: 'हिन्दी (Hindi)' }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
    try { localStorage.setItem('setu_language', lang) } catch {}
    setLangOpen(false)
  }

  const navItems = [
    { id: 'overview', label: t('csr.navOverview', 'Overview') },
    { id: 'problems', label: t('csr.navProblems', 'Current Problems') },
    { id: 'profile', label: t('csr.navProfile', 'Profile & History') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-xs border-b border-slate-200 font-outfit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Left: Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => onSelectTab('overview')}
        >
          <div className="w-7 h-7 rounded-md bg-[#176B5B] text-white font-syne font-bold flex items-center justify-center text-sm">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-syne text-lg font-semibold tracking-tight text-slate-900">SETU</span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400 border-l border-slate-200 pl-2">
              CSR Portal
            </span>
          </div>
        </div>

        {/* Center: Clean Text Navigation (No icons, No button boxes, Subtle underline) */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-medium">
          {navItems.map(({ id, label }) => {
            const isActive = activeTab === id || (activeTab === 'details' && id === 'problems')
            return (
              <button
                key={id}
                onClick={() => onSelectTab(id)}
                className={`py-5 transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-[#176B5B] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#176B5B] rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right side: Language + Company + Logout */}
        <div className="flex items-center gap-4 shrink-0">

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1 flex items-center gap-1"
              aria-label="Language Selector"
            >
              <span>{langLabels[currentLanguage] || 'EN'}</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-md shadow-md z-50 overflow-hidden py-1">
                {Object.entries(langFull).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      currentLanguage === code
                        ? 'bg-slate-50 text-[#176B5B] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="hidden lg:block text-xs text-slate-600">
            <span className="font-medium text-slate-900 block max-w-[160px] truncate">{companyName}</span>
          </div>

          {/* Sign Out */}
          <button
            onClick={onLogout}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1"
          >
            {t('csr.signOut', 'Sign Out')}
          </button>
        </div>
      </div>
    </header>
  )
}


