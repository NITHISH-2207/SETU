import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CountdownTimer from './CountdownTimer.jsx'
import FundingProgressBar from './FundingProgressBar.jsx'

export default function ProblemDetailsView({ problem, companyProfile, onBack, onOpenFundModal, onOpenDocModal }) {
  const { t } = useTranslation()

  // Progressive Disclosure States
  const [showResearchDetails, setShowResearchDetails] = useState(false)
  const [showTeamDetails, setShowTeamDetails] = useState(false)
  const [showFundingHistory, setShowFundingHistory] = useState(false)

  if (!problem) return null

  const isResearchRequired = problem.researchStatus === 'Completed' && problem.universitySolution
  const remaining = Math.max(0, problem.totalFundingRequired - problem.currentFunding)
  const isClosed = remaining === 0 || new Date(problem.deadline).getTime() <= new Date().getTime()

  // Severity config - ONLY small dot is colored
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

  const isRelevant = companyProfile?.csrCategories?.includes(problem.category)

  const formatRupee = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-8 font-outfit max-w-5xl mx-auto pb-12">

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#176B5B] font-medium transition-colors cursor-pointer"
        >
          ← {t('csr.backToProblems', 'Back to Current Problems')}
        </button>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span>PROJECT RECORD</span>
          <span>•</span>
          <span className="font-semibold text-slate-800">{problem.id}</span>
        </div>
      </div>

      {/* Level 1 Overview Section */}
      <div className="space-y-4">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Severity Dot */}
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <span className={`w-2 h-2 rounded-full ${severityDots[problem.severity] || 'bg-slate-400'}`} />
            {severityLabels[problem.severity] || problem.severity}
          </span>

          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">{problem.category}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">{problem.location}</span>

          {isRelevant && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-[#176B5B] font-medium text-[11px]">
                ✦ {t('csr.relevantBadge', 'Relevant to your focus')}
              </span>
            </>
          )}
        </div>

        {/* Problem Title */}
        <h1 className="font-syne text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
          {problem.title}
        </h1>

        {/* Citizen Votes */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <span>
            Citizen Support: <strong className="text-slate-800 font-semibold">{problem.votes.toLocaleString('en-IN')} votes</strong>
          </span>
          <span>•</span>
          <span>
            Research Status: <strong className="text-slate-800 font-semibold">{problem.researchStatus}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Problem & Research Details, Right = Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4 border-t border-slate-200">

        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section: Problem Description */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Problem Statement & Ground Reality
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {problem.description}
            </p>
          </section>

          {/* Section: University Research & Solution (Progressive Disclosure) */}
          <section className="pt-6 border-t border-slate-200 space-y-4">
            <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Research & Proposed Technical Solution
            </h2>

            {isResearchRequired ? (
              <div className="space-y-4">
                {/* Initial View (Level 2) */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-900 text-sm block">
                        {problem.universitySolution.university}
                      </span>
                      <span className="text-slate-500">
                        {problem.universitySolution.department}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowResearchDetails(!showResearchDetails)}
                      className="text-xs font-medium text-[#176B5B] hover:underline self-start sm:self-center cursor-pointer"
                    >
                      {showResearchDetails ? 'Hide Research Details ↑' : 'View Research Details →'}
                    </button>
                  </div>

                  {/* Mentor & Student count overview */}
                  <div className="pt-2 text-slate-600 flex flex-wrap gap-4 border-t border-slate-200/60">
                    <span>Faculty Mentor: <strong className="text-slate-800">{problem.universitySolution.mentor}</strong></span>
                    <span>Team: <strong className="text-slate-800">{problem.universitySolution.studentTeam}</strong></span>
                  </div>
                </div>

                {/* Expanded Research Details (Level 3) */}
                {showResearchDetails && (
                  <div className="p-5 border border-slate-200 rounded-xl space-y-5 bg-white text-xs">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-xs mb-1">
                        Technical Approach & Solution Summary
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {problem.universitySolution.solutionSummary}
                      </p>
                    </div>

                    {/* Team Details Expansion */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">Student Research Team</span>
                        <button
                          onClick={() => setShowTeamDetails(!showTeamDetails)}
                          className="text-[#176B5B] hover:underline cursor-pointer text-[11px]"
                        >
                          {showTeamDetails ? 'Hide Team Members' : 'View Team Members'}
                        </button>
                      </div>

                      {showTeamDetails ? (
                        <div className="space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {problem.universitySolution.students.map((student, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span>• {student}</span>
                              <span className="text-slate-400 text-[11px]">Student Researcher</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-[11px]">
                          {problem.universitySolution.students.length} student researchers assigned. Click 'View Team Members' for full list.
                        </p>
                      )}
                    </div>

                    {/* Document Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-600 truncate max-w-xs">
                        {problem.universitySolution.documentName} ({problem.universitySolution.documentSize})
                      </span>
                      <button
                        onClick={() => onOpenDocModal(problem.universitySolution)}
                        className="py-1.5 px-3 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        View Solution Document →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Honest Non-Research State */
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1 text-slate-600">
                <span className="font-semibold text-slate-800 block">Research Requirement</span>
                <p>Not required for this problem. This is a direct civic infrastructure need processed directly for implementation support.</p>
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Funding Sidebar */}
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl p-5 space-y-5 bg-white">
            <h2 className="text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
              Funding Requirements
            </h2>

            {/* Countdown */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 block">Funding Deadline</span>
              <CountdownTimer deadline={problem.deadline} />
            </div>

            {/* Funding Numbers */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Total Required:</span>
                <span className="font-semibold text-slate-900 font-mono">{formatRupee(problem.totalFundingRequired)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Current Funding:</span>
                <span className="font-semibold text-[#176B5B] font-mono">{formatRupee(problem.currentFunding)}</span>
              </div>
              <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-100 font-medium">
                <span>Amount Remaining:</span>
                <span className="font-semibold text-slate-900 font-mono">{formatRupee(remaining)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <FundingProgressBar
              currentFunding={problem.currentFunding}
              totalFundingRequired={problem.totalFundingRequired}
              showDetails={true}
            />

            {/* Expandable Funding History (Level 3) */}
            <div className="pt-2">
              <button
                onClick={() => setShowFundingHistory(!showFundingHistory)}
                className="text-xs text-[#176B5B] hover:underline cursor-pointer font-medium"
              >
                {showFundingHistory ? 'Hide Funding History ↑' : 'View Funding History →'}
              </button>

              {showFundingHistory && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Initial Government Allocation:</span>
                    <span className="font-mono">{formatRupee(Math.round(problem.totalFundingRequired * 0.1))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community / CSR Contributions:</span>
                    <span className="font-mono">{formatRupee(problem.currentFunding - Math.round(problem.totalFundingRequired * 0.1))}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {!isClosed ? (
              <button
                onClick={() => onOpenFundModal(problem)}
                className="w-full py-2.5 px-4 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center block"
              >
                Support This Problem →
              </button>
            ) : (
              <div className="w-full py-2 px-4 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg text-center">
                Funding Closed
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

