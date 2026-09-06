import { useTranslation } from 'react-i18next'
import CountdownTimer from './CountdownTimer.jsx'
import FundingProgressBar from './FundingProgressBar.jsx'

export default function ProblemCard({ problem, companyProfile, onViewDetails }) {
  const { t } = useTranslation()

  // Severity config - ONLY small dot is colored, text is normal theme neutral
  const severityDots = {
    Critical: 'bg-red-500',
    High: 'bg-amber-500',
    Medium: 'bg-emerald-500',
    Low: 'bg-blue-500',
  }

  const severityLabels = {
    Critical: t('csr.severityCritical', 'Critical'),
    High: t('csr.severityHigh', 'High'),
    Medium: t('csr.severityMedium', 'Medium'),
    Low: t('csr.severityLow', 'Low'),
  }

  const isUrgent = problem.severity === 'Critical' || problem.severity === 'High'
  const isRelevant = companyProfile?.csrCategories?.includes(problem.category)

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group font-outfit">
      <div className="space-y-3">
        {/* Severity Dot and Label */}
        <div className="flex items-center text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <span className={`w-2 h-2 rounded-full ${severityDots[problem.severity] || 'bg-slate-400'} ${isUrgent ? 'animate-pulse' : ''}`} />
            {severityLabels[problem.severity] || problem.severity}
            <span className="text-slate-300">•</span>
            <span className="truncate">{problem.category}</span>
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(problem)}
          className="font-syne text-base font-semibold text-slate-900 group-hover:text-[#176B5B] transition-colors leading-snug line-clamp-2 cursor-pointer"
        >
          {problem.title}
        </h3>

        {/* Focus Area Relevance subtle indicator */}
        {isRelevant && (
          <div className="text-[11px] text-[#176B5B] font-medium flex items-center gap-1">
            <span className="text-[10px]">✦</span>
            <span>{t('csr.relevantBadge', 'Relevant')}</span>
          </div>
        )}
      </div>

      {/* Footer: Funding & Primary Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
        {/* Funding Progress Bar */}
        <FundingProgressBar
          currentFunding={problem.currentFunding}
          totalFundingRequired={problem.totalFundingRequired}
          showDetails={true}
        />

        {/* Deadline & Primary Action (Teal primary button, NO black button!) */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Deadline:</span>
            <CountdownTimer deadline={problem.deadline} compact />
          </div>

          <button
            onClick={() => onViewDetails(problem)}
            className="py-1.5 px-3.5 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer text-center shrink-0"
          >
            {t('csr.viewProblem', 'View Problem')} →
          </button>
        </div>
      </div>
    </div>
  )
}
