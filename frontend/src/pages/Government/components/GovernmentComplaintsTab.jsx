import { useState, useMemo } from 'react'
import {
  calculateTimeStatus,
  deriveComplaintPriority,
  deriveComplaintUrgency,
  deriveComplaintSeverity,
  PRIORITY_OPTIONS,
  URGENCY_OPTIONS,
  SEVERITY_OPTIONS,
} from '../governmentConfig.js'

function GovernmentComplaintsTab({
  departmentName,
  complaints = [],
  onSelectComplaint,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [timeStatusFilter, setTimeStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('NEWEST')

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = c.title?.toLowerCase().includes(query)
        const matchDesc = c.description?.toLowerCase().includes(query)
        const matchId = c.id?.toLowerCase().includes(query)
        const matchLoc = (c.location || c.ward || '').toLowerCase().includes(query)
        if (!matchTitle && !matchDesc && !matchId && !matchLoc) {
          return false
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        const rawStatus = c.status || 'submitted'
        if (statusFilter === 'Received' && !(rawStatus === 'submitted' || rawStatus === 'received')) return false
        if (statusFilter === 'Under Review' && rawStatus !== 'under_review') return false
        if (statusFilter === 'In Progress' && !(rawStatus === 'in_progress' || rawStatus === 'assigned' || rawStatus === 'action_taken')) return false
        if (statusFilter === 'Resolved' && rawStatus !== 'resolved') return false
      }

      // 3. Priority Filter
      if (priorityFilter !== 'ALL') {
        const p = deriveComplaintPriority(c)
        if (p !== priorityFilter) return false
      }

      // 4. Urgency Filter
      if (urgencyFilter !== 'ALL') {
        const u = deriveComplaintUrgency(c)
        if (u !== urgencyFilter) return false
      }

      // 5. Severity Filter
      if (severityFilter !== 'ALL') {
        const s = deriveComplaintSeverity(c)
        if (s !== severityFilter) return false
      }

      // 6. Time Status Filter
      if (timeStatusFilter !== 'ALL') {
        const ts = calculateTimeStatus(c)
        if (ts !== timeStatusFilter) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.date || 0) - new Date(a.date || 0)
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.date || 0) - new Date(b.date || 0)
      }
      if (sortBy === 'UPVOTES') {
        return (b.upvotes || 0) - (a.upvotes || 0)
      }
      return 0
    })
  }, [
    complaints,
    searchQuery,
    statusFilter,
    priorityFilter,
    urgencyFilter,
    severityFilter,
    timeStatusFilter,
    sortBy,
  ])

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setPriorityFilter('ALL')
    setUrgencyFilter('ALL')
    setSeverityFilter('ALL')
    setTimeStatusFilter('ALL')
    setSortBy('NEWEST')
  }

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    urgencyFilter !== 'ALL' ||
    severityFilter !== 'ALL' ||
    timeStatusFilter !== 'ALL' ||
    sortBy !== 'NEWEST'

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
    <div className="space-y-6 animate-fadeIn font-outfit">
      {/* Header & Filter Card */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#BFD9D2]/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
                Official Grievance Registry
              </span>
              <span className="text-xs text-[#BFD9D2]">•</span>
              <span className="text-xs font-semibold text-[#176B5B]">
                {filteredComplaints.length} of {complaints.length} Issues
              </span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
              Department Complaints
            </h1>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, keyword or area..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all"
            />
            <svg
              className="w-4 h-4 text-[#5C726E] absolute left-3.5 top-1/2 -translate-y-1/2"
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
          </div>
        </div>

        {/* Minimal Dropdown Filters Area (No buttons wall) */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
              Filter & Sort Parameters
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#E07A4E] hover:underline font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Status Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Received">Received</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Urgency
              </label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer"
              >
                <option value="ALL">All Urgencies</option>
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Severity
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Status Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Time Status
              </label>
              <select
                value={timeStatusFilter}
                onChange={(e) => setTimeStatusFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer"
              >
                <option value="ALL">All Schedules</option>
                <option value="On Track">On Track</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Overdue">Overdue</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Sort Order Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-[#5C726E]">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] cursor-pointer font-medium"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="UPVOTES">Highest Upvotes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl overflow-hidden shadow-2xs">
        {filteredComplaints.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-[#F7FAF9] border border-[#BFD9D2] text-[#5C726E] mx-auto flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6"
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
            </div>
            <p className="font-syne font-bold text-[#1F2A28] text-base">
              No Matching Grievances Found
            </p>
            <p className="text-xs sm:text-sm text-[#5C726E] mt-1 max-w-sm mx-auto">
              No complaints match the current filter criteria for {departmentName}.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-[#176B5B] text-white text-xs font-semibold hover:bg-[#125649] transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#BFD9D2]/60">
            {filteredComplaints.map((complaint) => {
              const timeStatus = calculateTimeStatus(complaint)
              const priority = deriveComplaintPriority(complaint)
              const urgency = deriveComplaintUrgency(complaint)
              const severity = deriveComplaintSeverity(complaint)

              return (
                <div
                  key={complaint.id}
                  onClick={() => onSelectComplaint(complaint)}
                  className="p-5 sm:p-6 hover:bg-[#F7FAF9]/70 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Column info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded-md">
                          {complaint.id}
                        </span>
                        <span className="font-semibold text-[#1F2A28]">
                          {complaint.category}
                        </span>
                        <span className="text-[#BFD9D2]">•</span>
                        <span className="text-[#5C726E]">{complaint.date}</span>

                        {/* Status Badge */}
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-[#BFD9D2] text-[#1F2A28] capitalize">
                          {complaint.status?.replace('_', ' ') || 'Submitted'}
                        </span>

                        {/* Time Status */}
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getTimeStatusBadge(
                            timeStatus
                          )}`}
                        >
                          {timeStatus}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[11px] ${getPriorityBadge(
                            priority
                          )}`}
                        >
                          {priority}
                        </span>
                      </div>

                      <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug group-hover:text-[#176B5B] transition-colors">
                        {complaint.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#5C726E] line-clamp-2 leading-relaxed">
                        {complaint.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C726E] pt-1">
                        <span className="inline-flex items-center gap-1.5">
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
                          <span>{complaint.location || complaint.ward || 'Tiruppur Ward'}</span>
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
                          <span>{complaint.upvotes || 0} Supports</span>
                        </span>

                        <span className="text-[11px] text-[#5C726E]">
                          Urgency: <strong className="text-[#1F2A28] font-semibold">{urgency}</strong> • Severity: <strong className="text-[#1F2A28] font-semibold">{severity}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectComplaint(complaint)
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2] group-hover:border-[#176B5B] text-[#176B5B] group-hover:bg-[#176B5B] group-hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <span>Manage Issue</span>
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
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default GovernmentComplaintsTab
