import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generateContributionPdf } from '../utils/generateContributionPdf.js'

export default function ContributionReport({ companyProfile, historicalContributions }) {
  const { t } = useTranslation()

  // Default date interval: 2026 calendar year
  const [fromDate, setFromDate] = useState('2026-01-01')
  const [toDate, setToDate] = useState('2026-12-31')
  const [isGenerating, setIsGenerating] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState(null)

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Filter contributions by date interval
  const filteredContributions = useMemo(() => {
    const fromTime = new Date(fromDate).getTime()
    const toTime = new Date(toDate).getTime() + 24 * 3600 * 1000 // include full end day

    return historicalContributions.filter((item) => {
      const itemTime = new Date(item.fundingDate).getTime()
      if (isNaN(itemTime)) return true // fallback if date format is text
      return itemTime >= fromTime && itemTime <= toTime
    })
  }, [historicalContributions, fromDate, toDate])

  const totalPeriodAmount = useMemo(() => {
    return filteredContributions.reduce((sum, item) => sum + (item.companyContribution || 0), 0)
  }, [filteredContributions])

  const handleDownloadReport = () => {
    setIsGenerating(true)
    setFeedbackMsg(null)

    setTimeout(() => {
      generateContributionPdf({
        companyProfile,
        contributions: filteredContributions,
        fromDate,
        toDate,
      })
      setIsGenerating(false)
      setFeedbackMsg('Contribution statement generated and ready for print/download.')
      setTimeout(() => setFeedbackMsg(null), 5000)
    }, 600)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 font-outfit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-syne text-lg font-semibold text-slate-900">
            {t('csr.proofSectionTitle', 'Contribution Records & Proof')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('csr.proofSectionSub', 'Generate and download official CSR contribution statements for custom date intervals.')}
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={isGenerating}
          className="py-2 px-4 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isGenerating ? 'Generating Statement...' : t('csr.downloadProof', 'Download Contribution Proof')}
        </button>
      </div>

      {/* Date Interval Selector Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80 items-end text-xs">
        <div>
          <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
            {t('csr.fromDate', 'From Date')}
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800 focus:outline-none focus:border-[#176B5B]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium uppercase text-slate-500 mb-1">
            {t('csr.toDate', 'To Date')}
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-800 focus:outline-none focus:border-[#176B5B]"
          />
        </div>

        <div>
          <button
            onClick={() => {
              setFromDate('2026-01-01')
              setToDate('2026-12-31')
            }}
            className="w-full py-2 px-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            Reset to Full Year 2026
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium">
          {feedbackMsg}
        </div>
      )}

      {/* Filtered Period Preview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 text-[11px] uppercase block mb-1">Selected Period</span>
          <span className="font-mono text-xs font-semibold text-slate-900 block">
            {fromDate} → {toDate}
          </span>
        </div>

        <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 text-[11px] uppercase block mb-1">Period Grants Total</span>
          <span className="font-syne text-lg font-semibold text-slate-900 block font-mono">
            {formatRupee(totalPeriodAmount)}
          </span>
        </div>

        <div className="bg-slate-50/60 p-4 rounded-lg border border-slate-200/80">
          <span className="text-slate-500 text-[11px] uppercase block mb-1">Projects in Interval</span>
          <span className="font-syne text-lg font-semibold text-slate-900 block">
            {filteredContributions.length} Records
          </span>
        </div>
      </div>

      {/* Contribution Table */}
      {filteredContributions.length > 0 ? (
        <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200/80 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Problem ID</th>
                <th className="py-2.5 px-4">Project Title</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredContributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-500">{c.problemId}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 max-w-xs truncate">{c.problemTitle}</td>
                  <td className="py-2.5 px-4 text-slate-500">{c.category}</td>
                  <td className="py-2.5 px-4 text-slate-500">{c.fundingDate}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-900">
                    {formatRupee(c.companyContribution)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-500">
          No contributions found for the selected date interval ({fromDate} to {toDate}).
        </div>
      )}
    </div>
  )
}

