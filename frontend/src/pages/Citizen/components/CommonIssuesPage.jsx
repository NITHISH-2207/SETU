import { useState, useMemo } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'
import { StatusBadge } from './RecentIssuesList'
import { CATEGORIES } from '../citizenMockData'
import {
  getCommunityStoredComplaints,
  toggleCommunityComplaintUpvote,
} from '../citizenComplaintStore'

export default function CommonIssuesPage() {
  const { t } = useAppTranslation()
  const [communityIssues, setCommunityIssues] = useState(() => getCommunityStoredComplaints())
  const [selectedCategory, setSelectedCategory] = useState('All') // 'All' | category string
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIssueIds, setExpandedIssueIds] = useState({})
  const [upvotedSessionIds, setUpvotedSessionIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem('setu_citizen_community_upvoted_ids')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Derive complete category options from existing constants & actual data
  const availableCategories = useMemo(() => {
    const catSet = new Set(CATEGORIES)
    communityIssues.forEach((issue) => {
      if (issue.category) catSet.add(issue.category)
    })
    return Array.from(catSet)
  }, [communityIssues])

  // Filtered issues based strictly on Category and Search Query
  const filteredIssues = useMemo(() => {
    return communityIssues.filter((issue) => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) {
        return false
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim().replace('#', '')
        const matchesTitle = issue.title?.toLowerCase().includes(query)
        const matchesId = issue.id?.toLowerCase().includes(query)
        const matchesLocation = issue.location?.toLowerCase().includes(query)
        const matchesCategory = issue.category?.toLowerCase().includes(query)
        const matchesDesc = issue.description?.toLowerCase().includes(query)
        const matchesSubmitter = !issue.isAnonymous && issue.submitterName?.toLowerCase().includes(query)

        if (!matchesTitle && !matchesId && !matchesLocation && !matchesCategory && !matchesDesc && !matchesSubmitter) {
          return false
        }
      }

      return true
    })
  }, [communityIssues, selectedCategory, searchQuery])

  // Toggle inline expanded view for reading full complaint description & evidence
  const toggleExpand = (issueId) => {
    setExpandedIssueIds((prev) => ({
      ...prev,
      [issueId]: !prev[issueId],
    }))
  }

  // Handle upvoting with per-session tracking
  const handleUpvote = (issueId) => {
    const hasUpvotedInSession = upvotedSessionIds.includes(issueId)

    const updatedList = toggleCommunityComplaintUpvote(issueId)
    setCommunityIssues(updatedList)

    const nextUpvoted = hasUpvotedInSession
      ? upvotedSessionIds.filter((id) => id !== issueId)
      : [...upvotedSessionIds, issueId]

    setUpvotedSessionIds(nextUpvoted)
    try {
      sessionStorage.setItem('setu_citizen_community_upvoted_ids', JSON.stringify(nextUpvoted))
    } catch (err) {
      console.warn('Failed to persist session upvote state:', err)
    }
  }

  return (
    <div className="space-y-6 font-outfit max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* 1. Header & Community Pool Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>Community Voice &amp; Civic Support</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B] uppercase tracking-tight">
            COMMON ISSUES &amp; COMPLAINTS
          </h1>
          <p className="text-sm text-[#5C726E] mt-1 max-w-2xl">
            Browse public civic complaints submitted by fellow citizens across your region. Support urgent issues to fast-track municipal action and CSR funding.
          </p>
        </div>

        {/* Global Stats Summary Pill */}
        <div className="flex items-center gap-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl px-4 py-2.5 self-start sm:self-auto shadow-2xs">
          <div className="text-right">
            <p className="text-[11px] text-[#5C726E] font-medium uppercase tracking-wider">Community Pool</p>
            <p className="text-lg font-syne font-bold text-[#176B5B]">{communityIssues.length} Complaints</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#176B5B] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. One Clean "Select Category" Dropdown */}
      <div className="space-y-1.5 max-w-md">
        <label htmlFor="category-select" className="block text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
          Select Category
        </label>
        <div className="relative">
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs appearance-none cursor-pointer font-medium"
          >
            <option value="All">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-[#5C726E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="relative max-w-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search community issues by ID, title, locality, or keyword..."
          className="w-full pl-11 pr-10 py-2.5 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/70 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
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
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C726E] hover:text-[#1F2A28] p-1 cursor-pointer"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Showing Results Count */}
      <div className="flex items-center justify-between text-xs text-[#5C726E] font-medium pt-0.5">
        <span>
          Showing <strong className="text-[#1F2A28]">{filteredIssues.length}</strong> complaints
          {selectedCategory !== 'All' && <span> in <strong className="text-[#176B5B]">{selectedCategory}</strong></span>}
        </span>
      </div>

      {/* 4. Complaint Cards */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredIssues.map((issue) => {
            const isUpvoted = Boolean(issue.isUpvoted)
            const isExpanded = Boolean(expandedIssueIds[issue.id])
            const hasEvidence = Array.isArray(issue.evidence) && issue.evidence.length > 0

            return (
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
                      <span className="text-xs font-semibold text-[#5C726E] bg-[#F7FAF9] px-2.5 py-1 rounded-md border border-[#BFD9D2]/40">
                        {issue.category}
                      </span>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>

                  {/* Title */}
                  <h2 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
                    {issue.title}
                  </h2>

                  {/* Location, Date & Submitter Anonymity Protection */}
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#5C726E]">
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <svg className="w-3.5 h-3.5 text-[#176B5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{issue.location}</span>
                      </span>
                      <span className="shrink-0">• {issue.date}</span>
                    </div>

                    {/* Submitter Info (Respects Anonymity Rule) */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {issue.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-[#5C726E] bg-[#F7FAF9] px-2 py-0.5 rounded-md border border-[#BFD9D2]/50 font-medium">
                          <svg className="w-3.5 h-3.5 text-[#5C726E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>Reported Anonymously</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#5C726E] font-medium">
                          <svg className="w-3.5 h-3.5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Reported by: <strong className="text-[#1F2A28]">{issue.submitterName || 'Local Citizen'}</strong></span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Read-only Description (Supports Inline Expand for Complete Info) */}
                  <p className={`mt-3 text-sm text-[#1F2A28]/85 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {issue.description}
                  </p>

                  {/* Optional Read-Only Evidence Badges when Expanded */}
                  {isExpanded && hasEvidence && (
                    <div className="mt-3 pt-3 border-t border-[#BFD9D2]/40 space-y-1.5">
                      <p className="text-xs font-semibold text-[#5C726E] flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          <circle cx="9" cy="9" r="2" />
                        </svg>
                        <span>Attached Photo Evidence ({issue.evidence.length})</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {issue.evidence.map((ev, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2]/60 text-xs text-[#1F2A28]"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ev.color || '#176B5B' }} />
                            <span className="font-semibold">{ev.title}:</span>
                            <span className="text-[#5C726E]">{ev.caption}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Card Bottom: Upvote Button & Read-Only "Read More" Action */}
                <div className="mt-5 pt-4 border-t border-[#BFD9D2]/40 flex items-center justify-between">
                  {/* Working Community Upvote Button with Session Guard */}
                  <button
                    type="button"
                    onClick={() => handleUpvote(issue.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isUpvoted
                        ? 'bg-[#176B5B] text-white shadow-2xs hover:bg-[#125649]'
                        : 'bg-[#F7FAF9] text-[#1F2A28] border border-[#BFD9D2] hover:bg-[#DCEFEA]/40'
                    }`}
                    title={isUpvoted ? 'You supported this issue (Click to undo)' : 'Click to support this community issue'}
                    aria-label="Support this issue"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isUpvoted ? 'text-white scale-110' : 'text-[#176B5B]'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    <span>{issue.upvotes || 0}</span>
                    <span className="hidden sm:inline">
                      {isUpvoted ? (t('dashboard.upvoted') || 'Supported') : (t('dashboard.upvote') || 'Support')}
                    </span>
                  </button>

                  {/* Read-Only Details Toggle (Minimal, Inline Read-More) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(issue.id)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#F7FAF9] border border-dashed border-[#BFD9D2] rounded-2xl p-10 sm:p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#BFD9D2] text-[#176B5B] flex items-center justify-center mx-auto shadow-2xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
            No Community Issues Found
          </h2>
          <p className="text-sm text-[#5C726E] max-w-sm mx-auto leading-relaxed">
            There are no complaints matching your selected category &quot;{selectedCategory}&quot; or search criteria.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#176B5B] text-white text-xs font-semibold hover:bg-[#125649] transition-colors cursor-pointer shadow-2xs"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
