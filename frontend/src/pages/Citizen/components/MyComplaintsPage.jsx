import React, { useState, useMemo } from 'react'
import { StatusBadge } from './RecentIssuesList'

export default function MyComplaintsPage({
  complaints = [],
  onSelectComplaint,
  onRaiseNewIssue,
}) {
  const [filter, setFilter] = useState('all') // 'all' | 'under_review' | 'in_progress' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      // Filter tab
      if (filter === 'under_review') {
        if (item.status !== 'under_review' && item.status !== 'submitted') return false
      } else if (filter === 'in_progress') {
        if (item.status !== 'assigned' && item.status !== 'in_progress' && item.status !== 'action_taken') return false
      } else if (filter === 'resolved') {
        if (item.status !== 'resolved') return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim().replace('#', '')
        const matchesTitle = item.title?.toLowerCase().includes(query)
        const matchesId = item.id?.toLowerCase().includes(query)
        const matchesLocation = item.location?.toLowerCase().includes(query)
        const matchesCategory = item.category?.toLowerCase().includes(query)

        if (!matchesTitle && !matchesId && !matchesLocation && !matchesCategory) {
          return false
        }
      }

      return true
    })
  }, [complaints, filter, searchQuery])

  return (
    <div className="space-y-6 font-outfit max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B] uppercase tracking-tight">
            MY COMPLAINTS
          </h1>
          <p className="text-sm text-[#1F2A28]/70 mt-1">
            View and manage the issues you have reported.
          </p>
        </div>

        <button
          type="button"
          onClick={onRaiseNewIssue}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B5B] text-white text-sm font-semibold hover:bg-[#125548] transition-colors shadow-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Raise New Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Tracking ID, Title, Category, Location..."
            className="w-full pl-11 pr-10 py-2.5 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#1F2A28]/50 focus:outline-none focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all"
          />
          <svg
            className="w-4.5 h-4.5 text-[#1F2A28]/50 absolute left-3.5 top-1/2 -translate-y-1/2"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1F2A28]/50 hover:text-[#1F2A28] p-1"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl text-xs font-medium self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-[#176B5B] font-bold shadow-xs border border-[#BFD9D2]'
                : 'text-[#1F2A28]/70 hover:text-[#1F2A28]'
            }`}
          >
            All ({complaints.length})
          </button>
          <button
            onClick={() => setFilter('under_review')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'under_review'
                ? 'bg-white text-[#176B5B] font-bold shadow-xs border border-[#BFD9D2]'
                : 'text-[#1F2A28]/70 hover:text-[#1F2A28]'
            }`}
          >
            Under Review ({complaints.filter((c) => c.status === 'under_review' || c.status === 'submitted').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'in_progress'
                ? 'bg-white text-[#176B5B] font-bold shadow-xs border border-[#BFD9D2]'
                : 'text-[#1F2A28]/70 hover:text-[#1F2A28]'
            }`}
          >
            In Progress ({complaints.filter((c) => c.status === 'assigned' || c.status === 'in_progress' || c.status === 'action_taken').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'resolved'
                ? 'bg-white text-[#176B5B] font-bold shadow-xs border border-[#BFD9D2]'
                : 'text-[#1F2A28]/70 hover:text-[#1F2A28]'
            }`}
          >
            Resolved ({complaints.filter((c) => c.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Complaints List / Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white border border-[#BFD9D2] hover:border-[#176B5B]/60 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top: Tracking ID, Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#176B5B] bg-[#DCEFEA]/70 px-2.5 py-1 rounded-md border border-[#BFD9D2]/70">
                      {complaint.id}
                    </span>
                    {complaint.category && (
                      <span className="text-xs font-semibold text-[#1F2A28]/70 bg-[#F7FAF9] px-2 py-0.5 rounded border border-[#BFD9D2]/50">
                        {complaint.category}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                {/* Title */}
                <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] leading-snug">
                  {complaint.title}
                </h3>

                {/* Location & Submitted Date */}
                <div className="mt-2.5 flex items-center gap-3 text-xs sm:text-sm text-[#1F2A28]/70">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <svg className="w-3.5 h-3.5 text-[#176B5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{complaint.location}</span>
                  </span>
                  <span className="shrink-0">• {complaint.date || 'Recently'}</span>
                </div>

                {/* Short Description */}
                {complaint.description && (
                  <p className="mt-2.5 text-sm text-[#1F2A28]/80 line-clamp-2 leading-relaxed">
                    {complaint.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-[#BFD9D2]/40 flex items-center justify-between">
                <span className="text-xs text-[#1F2A28]/50">
                  {complaint.ward || 'Citizen Portal'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectComplaint(complaint.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#DCEFEA]/60 text-xs sm:text-sm font-bold text-[#176B5B] hover:bg-[#DCEFEA] transition-colors"
                >
                  <span>View Details</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#F7FAF9] border border-dashed border-[#BFD9D2] rounded-2xl p-10 sm:p-14 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#BFD9D2] text-[#176B5B] flex items-center justify-center mx-auto shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-syne text-lg font-bold text-[#1F2A28]">
            No Complaints Found
          </h3>
          <p className="text-sm text-[#1F2A28]/70 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? 'No complaints match your search criteria. Try a different query or clear your filter.'
              : 'You have not reported any complaints in this category yet.'}
          </p>
          <button
            type="button"
            onClick={onRaiseNewIssue}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#176B5B] text-white text-sm font-semibold hover:bg-[#125548] transition-colors shadow-sm mt-2"
          >
            <span>Raise an Issue</span>
          </button>
        </div>
      )}
    </div>
  )
}
