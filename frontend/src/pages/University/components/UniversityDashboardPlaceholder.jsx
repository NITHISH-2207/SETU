function UniversityDashboardPlaceholder({
  userProfile = {},
  roleType = 'student', // 'admin' | 'mentor' | 'student'
  onLogout,
}) {
  const getRoleInfo = () => {
    switch (roleType) {
      case 'admin':
        return {
          badge: 'University Administrator',
          title: 'Institutional Administration Workspace',
          desc: 'Phase 2: Manage student project sanctions, faculty approvals, and inter-university CSR allocations.',
          features: [
            'Student & Mentor Approval Queue',
            'Societal Problem Dispatch & Sanctions',
            'Departmental Performance Analytics',
            'CSR Grant Allocation Tracking',
          ],
        }
      case 'mentor':
        return {
          badge: 'Faculty Mentor',
          title: 'Research & Advisory Hub',
          desc: 'Phase 2: Supervise multidisciplinary student teams, review solution proposals, and publish verified impact studies.',
          features: [
            'Assigned Student Problem Teams',
            'Technical Feasibility Validation',
            'Lab Testing & Resource Requests',
            'Research Publication Gateway',
          ],
        }
      case 'student':
      default:
        return {
          badge: 'Student Researcher',
          title: 'Student Innovation Workspace',
          desc: 'Phase 2: Explore verified community issues, assemble multidisciplinary teams, build prototypes, and submit solutions.',
          features: [
            'Live Community Problem Catalog',
            'Team Formation & Role Matching',
            'Mentor Consultation Booking',
            'Prototype Submission & Pilot Tracking',
          ],
        }
    }
  }

  const info = getRoleInfo()

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 selection:bg-[#DCEFEA] selection:text-[#176B5B] font-outfit">
      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-[#BFD9D2]/50">
        <div className="flex items-center gap-3">
          <span className="font-syne text-2xl font-bold text-[#176B5B]">SETU</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
            {info.badge}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E07A4E] hover:underline cursor-pointer"
        >
          <span>Sign Out</span>
          <span>→</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto my-auto py-10 space-y-6">
        <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/40 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                Authenticated Session
              </span>
              <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] mt-1">
                {info.title}
              </h1>
            </div>
            <div className="p-3 bg-white border border-[#BFD9D2] rounded-xl shadow-2xs text-left sm:text-right text-xs">
              <p className="font-bold text-[#176B5B]">{userProfile.name || 'Demo User'}</p>
              <p className="text-[#5C726E] text-[11px]">{userProfile.university || 'Affiliated Institution'}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] font-bold text-[10px]">
                ACTIVE VERIFIED
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#5C726E] leading-relaxed">
            {info.desc}
          </p>

          <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
              Planned Phase 2 Dashboard Capabilities:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#1F2A28]">
              {info.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#F7FAF9] rounded-lg border border-[#BFD9D2]/50">
                  <span className="w-4 h-4 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onLogout}
              className="px-6 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Back to Main Portal
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default UniversityDashboardPlaceholder
