import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ProblemCard from './ProblemCard.jsx'
import ProblemFilters from './ProblemFilters.jsx'

export default function CurrentProblemsPage({ problems, companyProfile, onViewDetails, onFundDirectly }) {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1)
  const PROBLEMS_PER_PAGE = 8

  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    severity: 'All',
    researchStatus: 'All',
    fundingStatus: 'All',
    onlyRelevant: false,
    sortBy: 'votes', // votes | severity | deadline | needed | progress
  })

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      severity: 'All',
      researchStatus: 'All',
      fundingStatus: 'All',
      onlyRelevant: false,
      sortBy: 'votes',
    })
  }

  // Filter & Sort Logic
  const filteredProblems = useMemo(() => {
    return problems
      .filter((prob) => {
        // Only relevant filter
        if (filters.onlyRelevant) {
          const isMatched = companyProfile?.csrCategories?.includes(prob.category)
          if (!isMatched) return false
        }

        // Search query filter
        if (filters.search) {
          const query = filters.search.toLowerCase()
          const matchesTitle = prob.title.toLowerCase().includes(query)
          const matchesLocation = prob.location.toLowerCase().includes(query)
          const matchesCategory = prob.category.toLowerCase().includes(query)
          const matchesId = prob.id.toLowerCase().includes(query)
          if (!matchesTitle && !matchesLocation && !matchesCategory && !matchesId) {
            return false
          }
        }

        // Category filter
        if (filters.category !== 'All Categories' && prob.category !== filters.category) {
          return false
        }

        // Severity filter
        if (filters.severity !== 'All' && prob.severity !== filters.severity) {
          return false
        }

        // Research Status filter
        if (filters.researchStatus !== 'All' && prob.researchStatus !== filters.researchStatus) {
          return false
        }

        // Funding Status filter
        if (filters.fundingStatus !== 'All') {
          const remaining = prob.totalFundingRequired - prob.currentFunding
          const percentage = (prob.currentFunding / prob.totalFundingRequired) * 100
          const isClosed = remaining === 0 || new Date(prob.deadline).getTime() <= new Date().getTime()

          if (filters.fundingStatus === 'Active' && (isClosed || percentage >= 100)) return false
          if (filters.fundingStatus === 'Almost Funded' && (percentage < 75 || isClosed)) return false
          if (filters.fundingStatus === 'Fully Funded' && percentage < 100) return false
          if (filters.fundingStatus === 'Funding Closed' && !isClosed) return false
        }

        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'votes') {
          return b.votes - a.votes
        }
        if (filters.sortBy === 'severity') {
          const order = { Critical: 4, High: 3, Medium: 2, Low: 1 }
          return (order[b.severity] || 0) - (order[a.severity] || 0)
        }
        if (filters.sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        }
        if (filters.sortBy === 'needed') {
          const neededA = a.totalFundingRequired - a.currentFunding
          const neededB = b.totalFundingRequired - b.currentFunding
          return neededB - neededA
        }
        return 0
      })
  }, [problems, filters, companyProfile])

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE
  const endIndex = Math.min(startIndex + PROBLEMS_PER_PAGE, filteredProblems.length)
  const paginatedProblems = filteredProblems.slice(startIndex, endIndex)

  return (
    <div className="space-y-6 font-outfit">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="font-syne text-xl sm:text-2xl font-semibold text-slate-900">
            {t('csr.catalogTitle', 'Current Problems Eligible for CSR & Industry Funding')}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            {t('csr.catalogSub', 'Discover ground-level civic challenges reported by citizens, verified by government bodies, and researched by university engineering teams.')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-600 font-medium">
            {filteredProblems.length > 0
              ? `Showing ${startIndex + 1}–${endIndex} of ${filteredProblems.length} problems`
              : '0 problems found'}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <ProblemFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        resultCount={filteredProblems.length}
      />

      {/* Problem Cards Grid */}
      {paginatedProblems.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProblems.map((prob) => (
              <ProblemCard
                key={prob.id}
                problem={prob}
                companyProfile={companyProfile}
                onViewDetails={onViewDetails}
                onFundDirectly={onFundDirectly}
              />
            ))}
          </div>

          {/* Clean Minimal Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-600">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#176B5B] text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3 max-w-md mx-auto my-10">
          <h3 className="font-syne text-base font-semibold text-slate-800">No Problems Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No active civic problems match your current search query or filter selection.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#176B5B] hover:bg-[#125649] text-white font-medium text-xs rounded-lg transition-colors cursor-pointer inline-block"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}

