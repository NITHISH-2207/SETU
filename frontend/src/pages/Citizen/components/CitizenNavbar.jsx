import { useState, useRef, useEffect } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'
import { CITIZEN_USER_PROFILE } from '../citizenMockData'

function CitizenNavbar({ activeTab, onTabChange, onLogout, notificationsCount = 2 }) {
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useAppTranslation()
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)

  const langRef = useRef(null)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-[#BFD9D2]/60 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Portal Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group cursor-pointer"
          >
            <span className="font-syne text-2xl font-bold tracking-tight text-[#176B5B] group-hover:opacity-90">
              {t('nav.brand')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 font-outfit">
              <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
              {t('nav.portalBadge')}
            </span>
          </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-2 font-outfit">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#F7FAF9] text-[#176B5B] font-semibold border border-[#BFD9D2]/70 shadow-2xs'
                : 'text-[#1F2A28]/80 hover:text-[#176B5B] hover:bg-[#F7FAF9]/60'
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => onTabChange('track')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#F7FAF9] text-[#176B5B] font-semibold border border-[#BFD9D2]/70 shadow-2xs'
                : 'text-[#1F2A28]/80 hover:text-[#176B5B] hover:bg-[#F7FAF9]/60'
            }`}
          >
            {t('nav.checkStatus')}
          </button>
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 font-outfit">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#BFD9D2] bg-white hover:bg-[#F7FAF9] text-xs font-semibold text-[#1F2A28] transition-colors focus:outline-hidden cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{supportedLanguages.find((l) => l.code === currentLanguage)?.nativeName || 'English'}</span>
              <svg className="w-3 h-3 text-[#5C726E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#BFD9D2] rounded-xl shadow-lg py-1.5 z-40 animate-fade-in">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code)
                      setLangMenuOpen(false)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer hover:bg-[#F7FAF9] ${
                      currentLanguage === lang.code ? 'font-bold text-[#176B5B] bg-[#DCEFEA]/40' : 'text-[#1F2A28]'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[11px] text-[#5C726E] uppercase font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="p-2.5 rounded-xl border border-[#BFD9D2] bg-white hover:bg-[#F7FAF9] text-[#1F2A28] relative transition-colors focus:outline-hidden cursor-pointer shadow-2xs"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#E07A4E] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {notificationsCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#BFD9D2] rounded-xl shadow-lg p-3.5 z-40 animate-fade-in">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#BFD9D2]/50 text-xs font-bold text-[#176B5B]">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {t('nav.notifications')}
                  </span>
                  <span className="text-[11px] text-[#5C726E] font-normal">{notificationsCount} new</span>
                </div>
                <div className="space-y-2 py-2.5">
                  <div className="p-2.5 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2]/40 text-xs">
                    <p className="font-semibold text-[#1F2A28]">Water Supply #SETU-CIT-1042</p>
                    <p className="text-[11px] text-[#5C726E] mt-0.5">Status updated to: Action Taken (Pipe relining underway).</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2]/40 text-xs">
                    <p className="font-semibold text-[#1F2A28]">Road Resurfacing #SETU-CIT-1038</p>
                    <p className="text-[11px] text-[#5C726E] mt-0.5">Issue verified &amp; resolved by Ward Officer.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile & Session Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#BFD9D2] bg-white hover:bg-[#F7FAF9] transition-colors focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-xs font-bold font-syne shadow-2xs">
                {CITIZEN_USER_PROFILE.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#1F2A28]">
                {CITIZEN_USER_PROFILE.name}
              </span>
              <svg className="w-3 h-3 text-[#5C726E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#BFD9D2] rounded-xl shadow-lg p-3 z-40 animate-fade-in">
                <div className="p-2.5 border-b border-[#BFD9D2]/50 space-y-1">
                  <p className="text-sm font-bold text-[#1F2A28] font-syne">{CITIZEN_USER_PROFILE.name}</p>
                  <p className="text-xs text-[#5C726E]">{CITIZEN_USER_PROFILE.address}</p>
                  <p className="text-xs text-[#176B5B] font-mono font-medium">{CITIZEN_USER_PROFILE.formattedPhone}</p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onLogout()
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#E07A4E] hover:bg-[#F7FAF9] rounded-lg font-semibold cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#BFD9D2]/40 bg-[#F7FAF9] py-2 px-3 font-outfit text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
            activeTab === 'dashboard' ? 'bg-[#176B5B] text-white font-semibold shadow-2xs' : 'text-[#1F2A28]'
          }`}
        >
          {t('nav.home')}
        </button>
        <button
          onClick={() => onTabChange('track')}
          className={`px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
            activeTab === 'track' ? 'bg-[#176B5B] text-white font-semibold shadow-2xs' : 'text-[#1F2A28]'
          }`}
        >
          {t('nav.checkStatus')}
        </button>
      </div>
    </header>
  )
}

export default CitizenNavbar
