import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ContributionReport from './ContributionReport.jsx'
import ProblemCard from './ProblemCard.jsx'

export default function CSRProfileView({ companyProfile, problems = [], historicalContributions = [], onViewDetails, onFundDirectly }) {
  const { t } = useTranslation()
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  const formatRupee = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const relevantProblems = problems
    .filter((p) => companyProfile?.csrCategories?.includes(p.category))
    .slice(0, 3)

  const kpiCards = [
    { label: 'Supported Problems', value: companyProfile.stats.supportedProblems, sub: 'Projects Funded' },
    { label: 'Active Grants', value: companyProfile.stats.activeContributions, sub: 'Under Implementation' },
    { label: 'Completed Grants', value: companyProfile.stats.completedContributions, sub: 'Delivered Impact' },
    { label: 'Lives Impacted', value: `${companyProfile.stats.livesImpacted.toLocaleString('en-IN')}+`, sub: `${companyProfile.stats.districtsCovered} Districts Covered` },
  ]

  return (
    <div className="space-y-8 font-outfit max-w-6xl mx-auto pb-12">

      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-syne text-2xl font-semibold text-slate-900">
                {companyProfile.companyName}
              </h1>
              <span className="text-[11px] font-medium text-[#176B5B] bg-slate-100 px-2.5 py-0.5 rounded">
                {t('csr.verifiedPartner', 'Verified CSR Partner')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{companyProfile.tagline}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span>{companyProfile.location}</span>
              <span>•</span>
              <span>Reg: {companyProfile.registrationNo}</span>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs text-slate-500 block">Total Lifetime CSR Grants</span>
            <span className="font-syne text-2xl font-semibold text-slate-900 font-mono mt-0.5 block">
              {formatRupee(companyProfile.stats.totalContributions)}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              100% Tax Compliant (Sec 80G)
            </span>
          </div>
        </div>

        {/* CSR Focus Areas */}
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
            {t('csr.csrFocusAreas', 'CSR Focus Areas')}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-slate-700">
            {(companyProfile.csrCategories || companyProfile.csrFocusAreas).map((area) => (
              <span
                key={area}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Typography KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">{label}</span>
            <div className="font-syne text-2xl font-semibold text-slate-900">{value}</div>
            <span className="text-xs text-slate-500 block">{sub}</span>
          </div>
        ))}
      </div>

      {/* Relevant Problems */}
      {relevantProblems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="font-syne text-lg font-semibold text-slate-900">
              {t('csr.relevantProblemsSection', 'Relevant Problems Matched to Your Focus')}
            </h2>
            <span className="text-xs text-[#176B5B] font-medium">Focus-matched</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relevantProblems.map((prob) => (
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
      )}

      {/* Contribution Report */}
      <ContributionReport
        companyProfile={companyProfile}
        historicalContributions={historicalContributions}
      />

      {/* Past Funding Ledger */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-syne text-lg font-semibold text-slate-900">
              {t('csr.pastFundingTitle', 'Past Funding & Supported Problems Ledger')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('csr.pastFundingSub', 'Historical ledger of corporate grants provided to verified civic problems.')}
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            {historicalContributions.length} Records
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {historicalContributions.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/60 border border-slate-200/80 rounded-lg p-4 space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <span>•</span>
                  <span className="font-mono">{item.problemId}</span>
                  <span>•</span>
                  <span>{item.fundingDate}</span>
                </div>
                <span className="font-medium text-emerald-700">{item.finalStatus}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h3 className="font-syne font-semibold text-slate-900 text-sm">{item.problemTitle}</h3>
                  <p className="text-slate-500 mt-0.5">{item.location}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Grant Amount</span>
                    <span className="font-mono font-semibold text-slate-900 text-sm">
                      {formatRupee(item.companyContribution)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedHistoryItem(item)}
                    className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors cursor-pointer text-xs"
                  >
                    View Record →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Detail Modal */}
      {selectedHistoryItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-outfit"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedHistoryItem(null) }}
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase">{selectedHistoryItem.category}</span>
                <h2 className="font-syne text-base font-semibold text-slate-900 mt-1">{selectedHistoryItem.problemTitle}</h2>
                <span className="text-xs text-slate-500 block mt-0.5">
                  ID: {selectedHistoryItem.problemId} • {selectedHistoryItem.location}
                </span>
              </div>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2 text-xs">
              {[
                { label: 'Grant Date', value: selectedHistoryItem.fundingDate },
                { label: 'Company Contribution', value: formatRupee(selectedHistoryItem.companyContribution) },
                { label: 'Total Project Funding', value: formatRupee(selectedHistoryItem.totalFunding) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}:</span>
                  <span className="font-semibold text-slate-900 font-mono">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Impact Summary</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{selectedHistoryItem.impactSummary}"
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="py-1.5 px-4 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

