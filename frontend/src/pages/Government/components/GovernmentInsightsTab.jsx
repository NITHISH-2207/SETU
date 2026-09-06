import { useMemo } from 'react'
import {
  calculateTimeStatus,
  deriveComplaintPriority,
  deriveComplaintUrgency,
  deriveComplaintSeverity,
} from '../governmentConfig.js'

function GovernmentInsightsTab({ departmentName, complaints = [] }) {
  const stats = useMemo(() => {
    const total = complaints.length

    // Status breakdown
    const statusCounts = {
      Received: 0,
      'Under Review': 0,
      'In Progress': 0,
      Resolved: 0,
    }

    // Priority breakdown
    const priorityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    }

    // Time Status breakdown
    const timeStatusCounts = {
      'On Track': 0,
      'Due Soon': 0,
      Overdue: 0,
      Resolved: 0,
    }

    // Category breakdown
    const categoryCounts = {}

    // Total upvotes
    let totalUpvotes = 0

    complaints.forEach((c) => {
      // Status
      const raw = c.status || 'submitted'
      if (raw === 'submitted' || raw === 'received') statusCounts.Received++
      else if (raw === 'under_review') statusCounts['Under Review']++
      else if (raw === 'in_progress' || raw === 'assigned' || raw === 'action_taken') statusCounts['In Progress']++
      else if (raw === 'resolved') statusCounts.Resolved++
      else statusCounts.Received++

      // Priority
      const p = deriveComplaintPriority(c)
      if (priorityCounts[p] !== undefined) priorityCounts[p]++

      // Time Status
      const ts = calculateTimeStatus(c)
      if (timeStatusCounts[ts] !== undefined) timeStatusCounts[ts]++

      // Category
      const cat = c.category || 'General'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1

      // Upvotes
      totalUpvotes += c.upvotes || 0
    })

    const resolutionRate = total > 0 ? Math.round((statusCounts.Resolved / total) * 100) : 0

    return {
      total,
      statusCounts,
      priorityCounts,
      timeStatusCounts,
      categoryCounts,
      totalUpvotes,
      resolutionRate,
    }
  }, [complaints])

  return (
    <div className="space-y-8 animate-fadeIn font-outfit">
      {/* Header */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] mb-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
              <span>Departmental Analytics</span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
              {departmentName} Insights
            </h1>
            <p className="text-sm text-[#5C726E] mt-1">
              Performance metrics, resolution velocity, and grievance triage distribution.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-[#F7FAF9] p-4 rounded-xl border border-[#BFD9D2]">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-[#5C726E] block uppercase tracking-wider">
                Resolution Rate
              </span>
              <span className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">
                {stats.resolutionRate}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#DCEFEA] flex items-center justify-center text-[#176B5B]">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Status Lifecycle Breakdown */}
        <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
            <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
              Status Lifecycle
            </h3>
            <span className="text-xs text-[#5C726E] font-semibold">
              {stats.total} Total
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.statusCounts).map(([status, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#1F2A28]">{status}</span>
                    <span className="text-[#5C726E]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F7FAF9] rounded-full overflow-hidden border border-[#BFD9D2]/40">
                    <div
                      className={`h-full rounded-full ${
                        status === 'Resolved'
                          ? 'bg-[#176B5B]'
                          : status === 'In Progress'
                          ? 'bg-[#E07A4E]'
                          : status === 'Under Review'
                          ? 'bg-amber-400'
                          : 'bg-[#BFD9D2]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Priority Level Distribution */}
        <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
            <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
              Priority Distribution
            </h3>
            <span className="text-xs text-[#5C726E] font-semibold">Triage</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.priorityCounts).map(([priority, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#1F2A28]">{priority}</span>
                    <span className="text-[#5C726E]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F7FAF9] rounded-full overflow-hidden border border-[#BFD9D2]/40">
                    <div
                      className={`h-full rounded-full ${
                        priority === 'Critical'
                          ? 'bg-red-600'
                          : priority === 'High'
                          ? 'bg-[#E07A4E]'
                          : priority === 'Medium'
                          ? 'bg-amber-400'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Time Status / SLA Overview */}
        <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
            <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
              Time Status & SLA
            </h3>
            <span className="text-xs text-[#5C726E] font-semibold">Schedule</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.timeStatusCounts).map(([timeStatus, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={timeStatus} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#1F2A28]">{timeStatus}</span>
                    <span className="text-[#5C726E]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F7FAF9] rounded-full overflow-hidden border border-[#BFD9D2]/40">
                    <div
                      className={`h-full rounded-full ${
                        timeStatus === 'Overdue'
                          ? 'bg-red-600'
                          : timeStatus === 'Due Soon'
                          ? 'bg-amber-500'
                          : timeStatus === 'Resolved'
                          ? 'bg-[#176B5B]'
                          : 'bg-[#176B5B]/60'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Department Summary Banner */}
      <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
              Total Community Endorsements
            </span>
            <p className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28]">
              {stats.totalUpvotes}
            </p>
            <span className="text-[11px] text-[#5C726E]">Citizen votes registered</span>
          </div>

          <div className="space-y-1 sm:border-x sm:border-[#BFD9D2]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
              Overdue Complaints
            </span>
            <p className="font-syne text-2xl sm:text-3xl font-bold text-[#E07A4E]">
              {stats.timeStatusCounts.Overdue}
            </p>
            <span className="text-[11px] text-[#5C726E]">Requiring urgent action</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
              Active Categories Handled
            </span>
            <p className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">
              {Object.keys(stats.categoryCounts).length}
            </p>
            <span className="text-[11px] text-[#5C726E]">
              {Object.keys(stats.categoryCounts).join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GovernmentInsightsTab
