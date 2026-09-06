import { GOVERNMENT_DEPARTMENTS, DEMO_PASSWORDS } from '../governmentConfig.js'

function GovernmentProfileTab({
  departmentName,
  userProfile,
  onLogout,
}) {
  const deptConfig =
    GOVERNMENT_DEPARTMENTS.find((d) => d.name === departmentName) ||
    GOVERNMENT_DEPARTMENTS[0]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn font-outfit">
      {/* Profile Card Header */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-10 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#BFD9D2]/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#DCEFEA] border border-[#BFD9D2] flex items-center justify-center text-[#176B5B] font-syne font-bold text-2xl shadow-2xs">
              {departmentName.charAt(0) || 'G'}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
                <span>Verified Authority Profile</span>
              </div>
              <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                {departmentName}
              </h1>
              <p className="text-xs text-[#5C726E]">
                {deptConfig.jurisdiction}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E07A4E]/60 text-[#E07A4E] hover:bg-[#E07A4E] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
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
            <span>Sign Out of Department</span>
          </button>
        </div>

        {/* Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/70 space-y-1">
            <span className="text-[11px] font-bold text-[#5C726E] uppercase tracking-wider block">
              Assigned Categories
            </span>
            <p className="text-sm font-semibold text-[#1F2A28]">
              {deptConfig.categories.join(', ')}
            </p>
            <span className="text-[11px] text-[#5C726E]">
              Strictly filters grievances assigned to this department
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/70 space-y-1">
            <span className="text-[11px] font-bold text-[#5C726E] uppercase tracking-wider block">
              Department Description & Scope
            </span>
            <p className="text-xs font-medium text-[#1F2A28] leading-relaxed">
              {deptConfig.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/70 space-y-1">
            <span className="text-[11px] font-bold text-[#5C726E] uppercase tracking-wider block">
              Demo Access Credentials
            </span>
            <p className="text-xs font-mono text-[#176B5B] font-semibold">
              Password: {DEMO_PASSWORDS[departmentName] || 'demo'}
            </p>
            <span className="text-[11px] text-[#5C726E]">
              Deterministic frontend verification mode
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/70 space-y-1">
            <span className="text-[11px] font-bold text-[#5C726E] uppercase tracking-wider block">
              Administrative Network
            </span>
            <p className="text-xs font-semibold text-[#1F2A28]">
              SETU Civic Governance Ecosystem
            </p>
            <span className="text-[11px] text-[#5C726E]">
              Tiruppur Municipal District Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GovernmentProfileTab
