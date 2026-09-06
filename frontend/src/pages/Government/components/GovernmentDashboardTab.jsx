import {
  calculateTimeStatus,
  deriveComplaintPriority,
  deriveComplaintUrgency,
  deriveComplaintSeverity,
  getNeedsAttentionComplaints,
} from '../governmentConfig.js'

function GovernmentDashboardTab({
  departmentName,
  complaints = [],
  onSelectComplaint,
  onViewAllComplaints,
}) {
  const totalComplaints = complaints.length
  const needsAttentionList = getNeedsAttentionComplaints(complaints)
  const needsAttentionCount = needsAttentionList.length

  const inProgressCount = complaints.filter(
    (c) =>
      c.status === 'in_progress' ||
      c.status === 'assigned' ||
      c.status === 'action_taken' ||
      c.status === 'under_review'
  ).length

  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length

  const overviewCards = [
    {
      title: 'Total Complaints',
      count: totalComplaints,
      description: 'Logged under assigned categories',
      borderColor: 'border-[#BFD9D2]',
      accentColor: 'text-[#1F2A28]',
      badgeBg: 'bg-[#F7FAF9]',
    },
    {
      title: 'Needs Attention',
      count: needsAttentionCount,
      description: 'Overdue, high priority, or critical',
      borderColor: 'border-[#E07A4E]/60',
      accentColor: 'text-[#E07A4E]',
      badgeBg: 'bg-[#E07A4E]/10',
    },
    {
      title: 'In Progress',
      count: inProgressCount,
      description: 'Under active review & field action',
      borderColor: 'border-[#176B5B]/50',
      accentColor: 'text-[#176B5B]',
      badgeBg: 'bg-[#DCEFEA]',
    },
    {
      title: 'Resolved',
      count: resolvedCount,
      description: 'Completed civic resolutions',
      borderColor: 'border-[#BFD9D2]',
      accentColor: 'text-[#5C726E]',
      badgeBg: 'bg-[#F7FAF9]',
    },
  ]

  // Time status helper styling
  const getTimeStatusBadge = (timeStatus) => {
    switch (timeStatus) {
      case 'Overdue':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Due Soon':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'On Track':
      default:
        return 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300 font-bold'
      case 'High':
        return 'bg-[#E07A4E]/15 text-[#E07A4E] border-[#E07A4E]/30 font-semibold'
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-medium'
      case 'Low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-normal'
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn font-outfit">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-[#F7FAF9] via-[#F7FAF9] to-[#DCEFEA]/40 border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
              <span>Department Operational Dashboard</span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
              {departmentName}
            </h1>
            <p className="text-sm text-[#5C726E] mt-1">
              Active municipal grievance pipeline, priority triage, and citizen resolution tracking.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAllComplaints}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-sm font-semibold transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <span>View All Department Complaints</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 4 Minimal Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white border ${card.borderColor} rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-[#5C726E] font-medium leading-tight">
                {card.title}
              </span>
              <span className={`w-3 h-3 rounded-full ${card.badgeBg}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`font-syne text-2xl sm:text-3xl font-bold ${card.accentColor}`}>
                {card.count}
              </span>
              <span className="text-xs text-[#5C726E]">issues</span>
            </div>
            <p className="text-xs text-[#5C726E] mt-3 pt-3 border-t border-[#BFD9D2]/40">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Needs Attention Section */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#BFD9D2]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E07A4E]/10 border border-[#E07A4E]/30 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-[#E07A4E]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
                Needs Immediate Attention
              </h2>
              <p className="text-xs sm:text-sm text-[#5C726E] mt-0.5">
                High severity, overdue, or heavily upvoted issues requiring departmental response.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E07A4E]/10 text-[#E07A4E] border border-[#E07A4E]/30 self-start sm:self-auto">
            <span>{needsAttentionCount} Flagged</span>
          </span>
        </div>

        {needsAttentionList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#DCEFEA] text-[#176B5B] mx-auto flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-syne font-bold text-[#1F2A28] text-base">
              All Department Grievances On Track
            </p>
            <p className="text-xs sm:text-sm text-[#5C726E] mt-1 max-w-md mx-auto">
              No overdue or critical unassigned complaints for {departmentName}.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#BFD9D2]/60 mt-4">
            {needsAttentionList.map((complaint) => {
              const timeStatus = calculateTimeStatus(complaint)
              const priority = deriveComplaintPriority(complaint)
              const urgency = deriveComplaintUrgency(complaint)
              const severity = deriveComplaintSeverity(complaint)

              return (
                <div
                  key={complaint.id}
                  className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7FAF9]/60 px-3 -mx-3 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => onSelectComplaint(complaint)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#176B5B] bg-[#DCEFEA]/60 px-2 py-0.5 rounded-md">
                        {complaint.id}
                      </span>
                      <span className="font-medium text-[#5C726E]">
                        {complaint.category}
                      </span>
                      <span className="text-[#BFD9D2]">•</span>
                      <span className="text-[#5C726E]">{complaint.date}</span>

                      {/* Time status badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getTimeStatusBadge(
                          timeStatus
                        )}`}
                      >
                        {timeStatus}
                      </span>

                      {/* Priority badge */}
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[11px] ${getPriorityBadge(
                          priority
                        )}`}
                      >
                        {priority} Priority
                      </span>
                    </div>

                    <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug group-hover:text-[#176B5B] transition-colors line-clamp-1">
                      {complaint.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C726E] line-clamp-2">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#5C726E] pt-1">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-[#176B5B]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="truncate max-w-[220px] sm:max-w-[340px]">
                          {complaint.location || complaint.ward || 'Tiruppur Ward'}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 font-semibold text-[#1F2A28]">
                        <svg
                          className="w-3.5 h-3.5 text-[#E07A4E]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span>{complaint.upvotes || 0} Citizen Supports</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#BFD9D2]/40">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectComplaint(complaint)
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#176B5B] text-[#176B5B] hover:bg-[#176B5B] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Take Action</span>
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <span className="text-[11px] text-[#5C726E] capitalize">
                      Status: {complaint.status?.replace('_', ' ') || 'Submitted'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Department Activity Stream */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#BFD9D2]/50">
          <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
            Department Grievance Stream
          </h2>
          <button
            type="button"
            onClick={onViewAllComplaints}
            className="text-xs font-semibold text-[#176B5B] hover:underline cursor-pointer"
          >
            View all ({complaints.length}) →
          </button>
        </div>

        {complaints.length === 0 ? (
          <p className="text-xs text-[#5C726E] py-4">No complaints recorded for this department.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c)}
                className="p-4 rounded-xl border border-[#BFD9D2]/70 bg-[#F7FAF9]/40 hover:bg-[#F7FAF9] hover:border-[#176B5B]/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-[#176B5B] font-semibold">{c.id}</span>
                    <span className="capitalize text-[#5C726E] bg-white px-2 py-0.5 rounded border border-[#BFD9D2]">
                      {c.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-syne text-sm font-bold text-[#1F2A28] line-clamp-1 mb-1">
                    {c.title}
                  </h4>
                  <p className="text-xs text-[#5C726E] line-clamp-2">{c.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#BFD9D2]/40 flex items-center justify-between text-[11px] text-[#5C726E]">
                  <span>{c.location || 'Tiruppur'}</span>
                  <span className="font-medium text-[#176B5B]">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GovernmentDashboardTab
