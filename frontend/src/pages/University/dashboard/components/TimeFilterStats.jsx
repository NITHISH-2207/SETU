import { useState } from 'react'
import { TIME_BASED_STATISTICS } from '../universityDashboardData.js'

function TimeFilterStats({ role = 'mentor' }) {
  const [selectedRange, setSelectedRange] = useState('7d')

  const RANGES = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '1m', label: 'Last 1 Month' },
    { key: '3m', label: 'Last 3 Months' },
    { key: '6m', label: 'Last 6 Months' },
    { key: '1y', label: 'Last 1 Year' },
  ]

  const data = TIME_BASED_STATISTICS[selectedRange] || TIME_BASED_STATISTICS['7d']
  const maxActivity = Math.max(...data.weeklyActivity.map((d) => d.count), 1)

  return (
    <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-6 font-outfit">
      {/* Top Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
            Temporal Engagement Metrics
          </span>
          <h3 className="font-syne text-lg font-bold text-[#1F2A28] mt-0.5">
            Research Problem Inflow &amp; Participation Trends
          </h3>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl overflow-x-auto">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelectedRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRange === r.key
                  ? 'bg-[#176B5B] text-white shadow-2xs'
                  : 'text-[#5C726E] hover:text-[#1F2A28] hover:bg-white/80'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards for Selected Time Range */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#5C726E] uppercase">Government Problems</span>
          <p className="font-syne text-2xl font-bold text-[#176B5B]">{data.totalProblemsReceived}</p>
          <span className="text-[10px] text-emerald-700 font-medium">+{data.newProblems} newly flagged</span>
        </div>

        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#5C726E] uppercase">Domain Matches</span>
          <p className="font-syne text-2xl font-bold text-[#E07A4E]">{data.matchingOpportunities}</p>
          <span className="text-[10px] text-[#5C726E]">Matched to profile</span>
        </div>

        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#5C726E] uppercase">Problems Accepted</span>
          <p className="font-syne text-2xl font-bold text-[#1F2A28]">{data.problemsAccepted}</p>
          <span className="text-[10px] text-purple-700 font-medium">Active Research</span>
        </div>

        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-[#5C726E] uppercase">
            {role === 'mentor' ? 'Active Mentees' : 'Peer Collaborators'}
          </span>
          <p className="font-syne text-2xl font-bold text-[#176B5B]">{data.activeMentees}</p>
          <span className="text-[10px] text-emerald-700 font-medium">{data.contributionsSubmitted} outputs submitted</span>
        </div>
      </div>

      {/* Visual Activity Bar Chart */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#1F2A28]">Activity Inflow Velocity ({data.label}):</span>
          <span className="text-[#5C726E] text-[11px]">Normalized Civic Inquiries &amp; Contributions</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 bg-[#F7FAF9]/60 border border-[#BFD9D2]/50 rounded-xl">
          {data.weeklyActivity.map((bar, idx) => {
            const heightPercent = Math.max(15, Math.round((bar.count / maxActivity) * 100))
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#176B5B] opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div
                  className="w-full max-w-[36px] bg-linear-to-t from-[#176B5B] to-[#DCEFEA] group-hover:to-[#E07A4E] rounded-t-md transition-all duration-300 shadow-2xs"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-medium text-[#5C726E] truncate w-full text-center">
                  {bar.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TimeFilterStats
