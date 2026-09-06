import { useState, useMemo } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'

export function StatusBadge({ status }) {
  const { t } = useAppTranslation()

  switch (status) {
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F7FAF9] text-[#176B5B] border border-[#BFD9D2]">
          <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
          {t('status.submitted')}
        </span>
      )
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]">
          <span className="w-2 h-2 rounded-full bg-[#E07A4E]" />
          {t('status.underReview')}
        </span>
      )
    case 'assigned':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]">
          <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
          {t('status.assigned')}
        </span>
      )
    case 'in_progress':
    case 'action_taken':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#176B5B] text-white">
          <span className="w-2 h-2 rounded-full bg-[#E07A4E] animate-pulse" />
          {t('status.actionTaken')}
        </span>
      )
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#176B5B] text-white">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t('status.resolved')}
        </span>
      )
    default:
      return null
  }
}

function RecentIssuesList({ issues = [], onSelectIssue, onToggleUpvote }) {
  const { t } = useAppTranslation()
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Filter tab
      if (filter === 'active' && issue.status === 'resolved') return false
      if (filter === 'resolved' && issue.status !== 'resolved') return false

      // Search query - searches across title, reference ID, and location
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim().replace('#', '')
        const matchesTitle = issue.title.toLowerCase().includes(query)
        const matchesId = issue.id.toLowerCase().includes(query)
        const matchesLocation = issue.location.toLowerCase().includes(query)
        const matchesCategory = issue.category ? issue.category.toLowerCase().includes(query) : false

        if (!matchesTitle && !matchesId && !matchesLocation && !matchesCategory) {
          return false
        }
      }

      return true
    })
  }, [issues, filter, searchQuery])

  return (
    <div className="space-y-4 font-outfit">
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#BFD9D2]/50">
        <div>
          <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
            {t('dashboard.recentIssues')}
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7FAF9] border border-[#BFD9D2]/60 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#176B5B] font-bold shadow-2xs border border-[#BFD9D2]/70'
                : 'text-[#5C726E] hover:text-[#1F2A28]'
            }`}
          >
            {t('dashboard.filterAll')}
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-[#176B5B] font-bold shadow-2xs border border-[#BFD9D2]/70'
                : 'text-[#5C726E] hover:text-[#1F2A28]'
            }`}
          >
            {t('dashboard.filterActive')}
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'resolved'
                ? 'bg-white text-[#176B5B] font-bold shadow-2xs border border-[#BFD9D2]/70'
                : 'text-[#5C726E] hover:text-[#1F2A28]'
            }`}
          >
            {t('dashboard.filterResolved')}
          </button>
        </div>
      </div>

      {/* Live Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('dashboard.searchPlaceholder')}
          className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/70 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
        />
        <svg
          className="w-4.5 h-4.5 text-[#5C726E] absolute left-3.5 top-1/2 -translate-y-1/2"
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
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C726E] hover:text-[#1F2A28] p-1 cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Issues Grid / List */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white border border-[#BFD9D2]/70 hover:border-[#176B5B]/60 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top: ID, Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#176B5B] bg-[#DCEFEA]/70 px-2.5 py-1 rounded-md border border-[#BFD9D2]/60">
                      #{issue.id}
                    </span>
                    <span className="text-xs font-semibold text-[#5C726E]">
                      {issue.category}
                    </span>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                {/* Title */}
                <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
                  {issue.title}
                </h3>

                {/* Location & Date */}
                <div className="mt-2.5 flex items-center gap-3 text-xs sm:text-sm text-[#5C726E]">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <svg className="w-3.5 h-3.5 text-[#176B5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{issue.location}</span>
                  </span>
                  <span className="shrink-0">• {issue.date}</span>
                </div>

                {/* Short Description */}
                <p className="mt-2.5 text-sm text-[#1F2A28]/85 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Card Bottom: Upvote & Track Actions */}
              <div className="mt-5 pt-4 border-t border-[#BFD9D2]/40 flex items-center justify-between">
                {/* Community Upvote Button */}
                <button
                  onClick={() => onToggleUpvote(issue.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    issue.isUpvoted
                      ? 'bg-[#176B5B] text-white shadow-2xs'
                      : 'bg-[#F7FAF9] text-[#1F2A28] border border-[#BFD9D2] hover:bg-[#DCEFEA]/40'
                  }`}
                  aria-label="Support this issue"
                >
                  <svg className={`w-4 h-4 ${issue.isUpvoted ? 'text-white' : 'text-[#176B5B]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span>{issue.upvotes}</span>
                  <span className="hidden sm:inline">
                    {issue.isUpvoted ? t('dashboard.upvoted') : t('dashboard.upvote')}
                  </span>
                </button>

                {/* Track Details CTA */}
                <button
                  onClick={() => onSelectIssue(issue.id)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
                >
                  <span>{t('dashboard.viewDetails')}</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Clean SETU Empty State */
        <div className="bg-[#F7FAF9] border border-dashed border-[#BFD9D2] rounded-2xl p-10 sm:p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#BFD9D2] text-[#176B5B] flex items-center justify-center mx-auto shadow-2xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
            {t('dashboard.noIssuesTitle')}
          </h3>
          <p className="text-sm text-[#5C726E] max-w-sm mx-auto leading-relaxed">
            {t('dashboard.noIssuesDesc')}
          </p>
        </div>
      )}
    </div>
  )
}

export default RecentIssuesList
