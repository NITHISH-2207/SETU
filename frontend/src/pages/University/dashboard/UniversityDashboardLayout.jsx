import { useState, useRef, useEffect } from 'react'

function UniversityDashboardLayout({
  roleType = 'admin', // 'admin' | 'mentor' | 'student'
  userProfile = {},
  activeTab,
  onTabChange,
  navItems = [],
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onLogout,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadNotifs = notifications.filter((n) => !n.isRead)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getRoleBadge = () => {
    switch (roleType) {
      case 'admin':
        return { label: 'University Administrator', color: 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]' }
      case 'mentor':
        return { label: 'Faculty Mentor Lead', color: 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]' }
      case 'student':
      default:
        return { label: 'Student Innovator', color: 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]' }
    }
  }

  const roleInfo = getRoleBadge()

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F2A28] flex flex-col font-outfit selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-[#BFD9D2]/70 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#5C726E] hover:text-[#1F2A28] hover:bg-[#F7FAF9] border border-[#BFD9D2] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold tracking-tight text-[#176B5B]">
                SETU
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] mr-1.5" />
                {roleInfo.label}
              </span>
            </div>
          </div>

          {/* Affiliation Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#F7FAF9] border border-[#BFD9D2] rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span className="font-semibold text-[#1F2A28] truncate max-w-[280px]">
              {userProfile.university || 'Affiliated Institution'}
            </span>
          </div>

          {/* Top Actions: Notifications & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-[#5C726E] hover:text-[#176B5B] hover:bg-[#F7FAF9] border border-[#BFD9D2] cursor-pointer transition-colors"
                aria-label="View Notifications"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#176B5B] text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#BFD9D2] rounded-2xl shadow-xl z-50 p-4 space-y-3 font-outfit animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#BFD9D2]/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Notifications &amp; Alerts
                    </span>
                    {unreadNotifs.length > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] text-[#176B5B] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkNotificationRead?.(notif.id)}
                          className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                            notif.isRead
                              ? 'bg-white border-[#BFD9D2]/60 text-[#5C726E]'
                              : 'bg-[#DCEFEA]/30 border-[#176B5B]/30 text-[#1F2A28] font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-bold text-[#1F2A28]">{notif.title}</p>
                            <span className="text-[10px] text-[#5C726E] shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-[#5C726E] mt-1 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-[#5C726E]">No notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F7FAF9] border border-[#BFD9D2] cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#176B5B] text-white font-bold text-xs flex items-center justify-center">
                  {(userProfile.name || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs font-bold text-[#1F2A28] truncate max-w-[120px]">{userProfile.name || 'User'}</p>
                  <p className="text-[10px] text-[#5C726E] truncate max-w-[120px]">{userProfile.email || 'user@univ.edu'}</p>
                </div>
              </button>

              {/* Profile Menu Popover */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#BFD9D2] rounded-2xl shadow-xl z-50 p-3 space-y-2 text-xs animate-fade-in font-outfit">
                  <div className="p-2 border-b border-[#BFD9D2]/50">
                    <p className="font-bold text-[#1F2A28]">{userProfile.name}</p>
                    <p className="text-[#5C726E] text-[11px] truncate">{userProfile.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] font-bold text-[10px]">
                      {roleInfo.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onTabChange('profile')
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#1F2A28] hover:bg-[#F7FAF9] hover:text-[#176B5B] font-medium transition-colors cursor-pointer"
                  >
                    View Role Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onLogout?.()
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#E07A4E] hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                  >
                    Sign Out of SETU →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col lg:flex-row gap-8 sm:gap-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-5">
          <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-4 shadow-2xs space-y-1.5 sticky top-24">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C726E] px-3 py-1.5 block">
              Navigation Menu
            </span>

            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#176B5B] text-white shadow-xs'
                      : 'text-[#5C726E] hover:text-[#176B5B] hover:bg-[#F7FAF9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.iconSvg ? (
                      <span className={isActive ? 'text-white' : 'text-[#5C726E]'}>{item.iconSvg}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#DCEFEA] text-[#176B5B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Quick Info Card */}
          <div className="bg-[#F7FAF9] border border-[#BFD9D2]/80 rounded-2xl p-5 text-xs space-y-2">
            <span className="font-bold text-[#176B5B] block text-xs">SETU Research Network</span>
            <p className="text-[11px] text-[#5C726E] leading-relaxed">
              Max 1 Mentor + 5 Students per Research Challenge. Connect academic findings to verified civic outcomes.
            </p>
          </div>
        </aside>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border border-[#BFD9D2] rounded-2xl p-4 shadow-lg space-y-2 font-outfit animate-fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C726E] block px-2">
              Menu Navigation
            </span>
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#176B5B] text-white'
                      : 'text-[#5C726E] hover:text-[#176B5B] hover:bg-[#F7FAF9]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.iconSvg ? (
                      <span className={isActive ? 'text-white' : 'text-[#5C726E]'}>{item.iconSvg}</span>
                    ) : null}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCEFEA] text-[#176B5B] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* University Dashboard Shared Footer */}
      <footer className="border-t border-[#BFD9D2]/50 py-6 bg-white text-xs text-[#5C726E] mt-12 font-outfit">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#176B5B]">SETU</span>
            <span>— University Research &amp; Societal Sanctions Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{userProfile.university || 'Institutional Workspace'}</span>
            <span>•</span>
            <span>Version 2.0 (SIH 2026)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UniversityDashboardLayout
