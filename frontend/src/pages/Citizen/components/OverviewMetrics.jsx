import { useAppTranslation } from '../../../hooks/useAppTranslation'

function OverviewMetrics({ issues = [] }) {
  const { t } = useAppTranslation()

  const total = issues.length
  const underReview = issues.filter((i) => i.status === 'under_review' || i.status === 'submitted').length
  const inProgress = issues.filter((i) => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'action_taken').length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const totalUpvotes = issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0)

  const cards = [
    {
      label: t('dashboard.metrics.totalReported'),
      value: total,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      ),
    },
    {
      label: t('dashboard.metrics.underReview'),
      value: underReview,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#E07A4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: t('dashboard.metrics.inProgress'),
      value: inProgress,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      label: t('dashboard.metrics.resolved'),
      value: resolved,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: t('dashboard.metrics.communityUpvotes'),
      value: totalUpvotes,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#E07A4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-3 font-outfit select-none">
      <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
        {t('dashboard.overview')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl border border-[#BFD9D2]/70 bg-white shadow-2xs flex flex-col justify-between hover:border-[#176B5B]/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-[#5C726E] font-medium leading-tight">
                {card.label}
              </span>
              <div className="p-1.5 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2]/40">
                {card.renderIcon()}
              </div>
            </div>
            <div className="mt-3">
              <span className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28]">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverviewMetrics
