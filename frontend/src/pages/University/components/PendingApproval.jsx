function PendingApproval({
  role = 'student', // 'student' | 'mentor'
  userName = 'Registered User',
  university = 'Affiliated University',
  email = 'user@univ.edu',
  onBackToLogin,
  onSimulateApprove,
}) {
  const isStudent = role === 'student'
  const roleTitle = isStudent ? 'Student Researcher' : 'Faculty Mentor'
  const loginButtonLabel = isStudent ? 'Back to Student Login' : 'Back to Mentor Login'

  return (
    <div className="bg-linear-to-br from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/30 border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xs font-outfit max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#BFD9D2]/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#E07A4E] animate-pulse" />
          <span>Status: Pending University Approval</span>
        </div>

        <span className="text-xs font-semibold text-[#5C726E] font-syne uppercase tracking-wider">
          {roleTitle} Registration
        </span>
      </div>

      {/* Main Announcement */}
      <div className="space-y-2 text-left">
        <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2A28]">
          Registration Submitted
        </h1>
        <p className="text-sm sm:text-base text-[#5C726E] leading-relaxed">
          Your profile has been submitted to your <strong className="text-[#176B5B]">University Administrator</strong> for institutional review and verification.
        </p>
      </div>

      {/* Connected 3-Step Approval Path Visual */}
      <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-4 shadow-2xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
          Verification Lifecycle
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
          {/* Step 1: Completed */}
          <div className="p-3 bg-[#DCEFEA]/50 border border-[#176B5B]/30 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B5B]">
              <span className="w-4 h-4 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>1. Submitted</span>
            </div>
            <p className="text-[11px] text-[#5C726E]">
              Account credentials &amp; profile details recorded.
            </p>
          </div>

          {/* Step 2: Under Review (Active) */}
          <div className="p-3 bg-[#F7FAF9] border-2 border-[#E07A4E] rounded-xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E07A4E]">
              <span className="w-4 h-4 rounded-full bg-[#E07A4E] text-white flex items-center justify-center text-[10px] animate-pulse">
                ⏳
              </span>
              <span>2. Review</span>
            </div>
            <p className="text-[11px] text-[#1F2A28] font-medium">
              Administrator validating university affiliation.
            </p>
          </div>

          {/* Step 3: Upcoming Activation */}
          <div className="p-3 bg-white/60 border border-[#BFD9D2]/50 rounded-xl space-y-1 opacity-70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C726E]">
              <span className="w-4 h-4 rounded-full border border-[#BFD9D2] bg-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>3. Active</span>
            </div>
            <p className="text-[11px] text-[#5C726E]">
              Access granted to R&amp;D problems &amp; teams.
            </p>
          </div>
        </div>
      </div>

      {/* Submitted Details Review Card */}
      <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl text-xs space-y-2 text-[#1F2A28]">
        <div className="flex justify-between items-center pb-2 border-b border-[#BFD9D2]/40">
          <span className="font-bold text-[#5C726E] uppercase tracking-wider text-[11px]">Submitted Record</span>
          <span className="text-[#176B5B] font-mono font-bold">{email}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#5C726E]">Applicant: </span>
            <span className="font-semibold">{userName}</span>
          </div>
          <div>
            <span className="text-[#5C726E]">Affiliation: </span>
            <span className="font-semibold">{university}</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-semibold text-[#176B5B] bg-white hover:bg-[#DCEFEA]/40 border border-[#BFD9D2] px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
        >
          <span className="mr-1.5">←</span> {loginButtonLabel}
        </button>

        {onSimulateApprove && (
          <button
            type="button"
            onClick={onSimulateApprove}
            className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-semibold text-[#176B5B] bg-[#DCEFEA] hover:bg-[#c6e4dc] px-4 py-2.5 rounded-xl border border-[#176B5B]/30 transition-colors cursor-pointer"
          >
            <span>Demo: Simulate Admin Approval</span>
            <span className="ml-1.5">✓</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default PendingApproval
