import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CIVIC_CATEGORIES } from '../csrMockData.js'

// Clean custom select component
function ToolbarSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedLabel = options.find((o) => o.value === value)?.label || value

  return (
    <div className="relative flex-1 min-w-[130px]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-9 flex items-center justify-between px-3 bg-slate-50 border rounded-lg text-xs font-medium text-slate-700 focus:outline-none transition-colors cursor-pointer ${
          open ? 'border-[#176B5B] bg-white' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="truncate">
          <span className="text-slate-400 font-normal mr-1">{label}:</span>
          <span className="text-slate-900 font-medium">{selectedLabel}</span>
        </span>
        <span className="text-[10px] text-slate-400 ml-1 shrink-0">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-md z-50 max-h-56 overflow-y-auto py-1 text-xs">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 transition-colors cursor-pointer truncate ${
                value === opt.value
                  ? 'bg-slate-50 text-[#176B5B] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProblemFilters({ filters, onFilterChange, onResetFilters }) {
  const { t } = useTranslation()

  const categoryOptions = CIVIC_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat === 'All Categories' ? 'All' : cat,
  }))

  const severityOptions = [
    { value: 'All', label: 'All' },
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ]

  const researchOptions = [
    { value: 'All', label: 'All' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Not Required', label: 'Direct Need' },
  ]

  const fundingOptions = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Open' },
    { value: 'Almost Funded', label: 'Almost Funded' },
    { value: 'Fully Funded', label: 'Fully Funded' },
    { value: 'Funding Closed', label: 'Closed' },
  ]

  const sortOptions = [
    { value: 'votes', label: 'Votes' },
    { value: 'severity', label: 'Severity' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'needed', label: 'Funding Need' },
  ]

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All Categories' ||
    filters.severity !== 'All' ||
    filters.researchStatus !== 'All' ||
    filters.fundingStatus !== 'All' ||
    filters.onlyRelevant

  return (
    <div className="space-y-4 font-outfit mb-6">
      {/* Search — full-width, standalone, adaptive */}
      <div className="relative w-full">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.6 3.4a7.5 7.5 0 010 10.6z"
          />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder={t('csr.searchPlaceholder', 'Search problems...')}
          className="w-full h-11 pl-11 pr-10 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]/20 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange('search', '')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters row — dropdowns + toggles, all same height */}
      <div className="flex flex-wrap items-center gap-2.5">
        <ToolbarSelect
          label="Category"
          value={filters.category}
          onChange={(v) => onFilterChange('category', v)}
          options={categoryOptions}
        />
        <ToolbarSelect
          label="Severity"
          value={filters.severity}
          onChange={(v) => onFilterChange('severity', v)}
          options={severityOptions}
        />
        <ToolbarSelect
          label="Research"
          value={filters.researchStatus}
          onChange={(v) => onFilterChange('researchStatus', v)}
          options={researchOptions}
        />
        <ToolbarSelect
          label="Funding"
          value={filters.fundingStatus}
          onChange={(v) => onFilterChange('fundingStatus', v)}
          options={fundingOptions}
        />
        <ToolbarSelect
          label="Sort by"
          value={filters.sortBy}
          onChange={(v) => onFilterChange('sortBy', v)}
          options={sortOptions}
        />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Toggle: Relevant Focus */}
        <button
          onClick={() => onFilterChange('onlyRelevant', !filters.onlyRelevant)}
          className={`h-9 px-3.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border shrink-0 ${
            filters.onlyRelevant
              ? 'bg-[#176B5B] text-white border-[#176B5B] shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
          }`}
        >
          {t('csr.relevantFocusTab', 'Relevant Focus')}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="h-9 px-3 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
