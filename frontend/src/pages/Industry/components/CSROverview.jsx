import { useTranslation } from 'react-i18next'
import ProblemCard from './ProblemCard.jsx'

const HOW_STEPS = [
  {
    num: '01',
    title: 'csr.p1Title',
    defaultTitle: 'Discover Problems',
    desc: 'csr.p1Desc',
    defaultDesc: 'Browse real-time civic issues across 45 categories in drinking water, schools, healthcare, roads, and sanitation.',
  },
  {
    num: '02',
    title: 'csr.p2Title',
    defaultTitle: 'Understand Impact',
    desc: 'csr.p2Desc',
    defaultDesc: 'Review severity levels, citizen vote counts, government verification, and proposed university research solutions.',
  },
  {
    num: '03',
    title: 'csr.p3Title',
    defaultTitle: 'Support Solutions',
    desc: 'csr.p3Desc',
    defaultDesc: 'Provide targeted financial grants directly to problems aligning with your corporate CSR vision and budget.',
  },
  {
    num: '04',
    title: 'csr.p4Title',
    defaultTitle: 'Track Contributions',
    desc: 'csr.p4Desc',
    defaultDesc: 'Monitor execution progress, financial disbursement audit logs, and post-project societal impact reports.',
  },
]

const KPI_CARDS = [
  { label: 'Active Civic Problems', value: '22', sub: 'Across 45 Categories' },
  { label: 'Total Citizens Impacted', value: '1,45,000+', sub: 'Verified Citizen Votes' },
  { label: 'University Research Teams', value: '14', sub: 'Engineering Partner Inst.' },
  { label: 'Total Corporate Grants', value: '₹24.8 Lakhs', sub: 'Disbursed for Projects' },
]

export default function CSROverview({ problems, companyProfile, onNavigateToProblems, onViewDetails, onFundDirectly, onNavigateToProfile }) {
  const { t } = useTranslation()
  const featuredProblems = problems.slice(0, 3)

  return (
    <div className="space-y-12 font-outfit pb-12">

      {/* Hero Banner */}
      <div className="bg-[#176B5B] rounded-xl p-8 sm:p-10 text-white">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-medium uppercase tracking-wider text-teal-100 block">
            {t('csr.heroSubtitle', 'CSR & Corporate Social Responsibility Portal')}
          </span>

          <h1 className="font-syne text-2xl sm:text-3xl font-semibold leading-tight">
            {t('csr.heroTitle', 'Direct Corporate CSR Funding for Verified Ground-Level Civic Problems')}
          </h1>

          <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed max-w-2xl">
            {t('csr.heroDesc', 'SETU connects industries directly with societal challenges requiring financial and technological assistance. Review ground-level citizen demand, university research findings, and fund verified solutions transparently.')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToProblems}
              className="py-2.5 px-5 bg-white text-[#176B5B] font-medium text-xs rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t('csr.exploreProblems', 'Explore Active Problems')} →
            </button>

            <button
              onClick={onNavigateToProfile}
              className="py-2.5 px-4 bg-transparent text-white font-medium text-xs rounded-lg hover:bg-white/10 transition-colors border border-white/30 cursor-pointer"
            >
              {t('csr.viewProfile', 'Company Profile & Past Grants')}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">{label}</span>
            <div className="font-syne text-2xl font-semibold text-slate-900">{value}</div>
            <span className="text-xs text-slate-500 block">{sub}</span>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <div>
          <h2 className="font-syne text-xl font-semibold text-slate-900">
            {t('csr.pillarsTitle', 'How CSR Participation Works on SETU')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">A transparent, end-to-end journey from problem discovery to funding confirmation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {HOW_STEPS.map(({ num, title, defaultTitle, desc, defaultDesc }) => (
            <div key={num} className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-medium text-slate-400 block">{num}</span>
              <h3 className="font-syne text-sm font-semibold text-slate-900">{t(title, defaultTitle)}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t(desc, defaultDesc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Problems */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="font-syne text-xl font-semibold text-slate-900">
              {t('csr.urgentProblemsTitle', 'High-Priority Urgent Problems Ready for CSR Funding')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('csr.urgentProblemsSub', 'Urgent civic requirements verified by local municipal bodies and backed by citizen votes.')}
            </p>
          </div>

          <button
            onClick={onNavigateToProblems}
            className="hidden sm:block text-xs font-medium text-[#176B5B] hover:underline cursor-pointer shrink-0"
          >
            {t('csr.viewAllProblems', 'View All Problems')} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredProblems.map((prob) => (
            <ProblemCard
              key={prob.id}
              problem={prob}
              companyProfile={companyProfile}
              onViewDetails={onViewDetails}
              onFundDirectly={onFundDirectly}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

