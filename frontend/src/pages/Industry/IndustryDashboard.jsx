import { useState } from 'react'
import {
  INITIAL_MOCK_PROBLEMS,
  INITIAL_COMPANY_PROFILE,
  HISTORICAL_CONTRIBUTIONS,
} from './csrMockData.js'
import CSRNavbar from './components/CSRNavbar.jsx'
import CSRFooter from './components/CSRFooter.jsx'
import CSROverview from './components/CSROverview.jsx'
import CurrentProblemsPage from './components/CurrentProblemsPage.jsx'
import ProblemDetailsView from './components/ProblemDetailsView.jsx'
import CSRProfileView from './components/CSRProfileView.jsx'
import FundingModal from './components/FundingModal.jsx'
import SolutionDocModal from './components/SolutionDocModal.jsx'

/**
 * Main CSR & Industry Portal Container
 * Refined Minimalist Enterprise Frontend Implementation
 */
export default function IndustryDashboard({ userProfile = {}, onLogout, onNavigate: _onNavigate }) {
  // Portal Navigation State: 'overview' | 'problems' | 'details' | 'profile'
  const [activeTab, setActiveTab] = useState('overview')

  // Live React State for Mock Problems
  const [problems, setProblems] = useState(INITIAL_MOCK_PROBLEMS)
  const [selectedProblemId, setSelectedProblemId] = useState(null)

  // Modals state
  const [fundingModalProblem, setFundingModalProblem] = useState(null)
  const [activeSolutionDoc, setActiveSolutionDoc] = useState(null)

  // Company profile state
  const companyProfile = {
    ...INITIAL_COMPANY_PROFILE,
    companyName: userProfile.industryName || userProfile.name || INITIAL_COMPANY_PROFILE.companyName,
  }

  // Handle Tab Switch
  const handleSelectTab = (tab) => {
    setActiveTab(tab)
    if (tab !== 'details') {
      setSelectedProblemId(null)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // Handle View Problem Details
  const handleViewProblemDetails = (problem) => {
    setSelectedProblemId(problem.id)
    setActiveTab('details')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Open Funding Modal
  const handleOpenFundModal = (problem) => {
    setFundingModalProblem(problem)
  }

  // Handle Open Solution Doc Modal
  const handleOpenDocModal = (solution) => {
    setActiveSolutionDoc(solution)
  }

  // Handle Confirm Funding (Updates local React state for demonstration)
  const handleConfirmFunding = (problemId, amountPledged) => {
    setProblems((prevProblems) =>
      prevProblems.map((prob) => {
        if (prob.id === problemId) {
          const newCurrent = prob.currentFunding + amountPledged
          const isFullyFunded = newCurrent >= prob.totalFundingRequired
          return {
            ...prob,
            currentFunding: newCurrent,
            status: isFullyFunded ? 'Fully Funded' : prob.status,
          }
        }
        return prob
      })
    )
  }

  // Derived selected problem object
  const selectedProblem = problems.find((p) => p.id === selectedProblemId) || problems[0]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-outfit flex flex-col justify-between selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Header Navbar */}
      <CSRNavbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        companyProfile={companyProfile}
        onLogout={onLogout}
      />

      {/* Main View Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === 'overview' && (
          <CSROverview
            problems={problems}
            companyProfile={companyProfile}
            onNavigateToProblems={() => handleSelectTab('problems')}
            onViewDetails={handleViewProblemDetails}
            onFundDirectly={handleOpenFundModal}
            onNavigateToProfile={() => handleSelectTab('profile')}
          />
        )}

        {activeTab === 'problems' && (
          <CurrentProblemsPage
            problems={problems}
            companyProfile={companyProfile}
            onViewDetails={handleViewProblemDetails}
            onFundDirectly={handleOpenFundModal}
          />
        )}

        {activeTab === 'details' && selectedProblem && (
          <ProblemDetailsView
            problem={selectedProblem}
            companyProfile={companyProfile}
            onBack={() => handleSelectTab('problems')}
            onOpenFundModal={handleOpenFundModal}
            onOpenDocModal={handleOpenDocModal}
          />
        )}

        {activeTab === 'profile' && (
          <CSRProfileView
            companyProfile={companyProfile}
            problems={problems}
            historicalContributions={HISTORICAL_CONTRIBUTIONS}
            onViewDetails={handleViewProblemDetails}
            onFundDirectly={handleOpenFundModal}
          />
        )}
      </main>

      {/* Interactive Funding Modal */}
      {fundingModalProblem && (
        <FundingModal
          problem={fundingModalProblem}
          onClose={() => setFundingModalProblem(null)}
          onConfirmFunding={handleConfirmFunding}
        />
      )}

      {/* Proposed Solution Document Modal */}
      {activeSolutionDoc && (
        <SolutionDocModal
          solutionDoc={activeSolutionDoc}
          onClose={() => setActiveSolutionDoc(null)}
        />
      )}

      {/* Footer */}
      <CSRFooter />
    </div>
  )
}
