import { useState } from 'react'
import CitizenNavbar from './components/CitizenNavbar.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import OverviewMetrics from './components/OverviewMetrics.jsx'
import RaiseIssueBanner from './components/RaiseIssueBanner.jsx'
import RaiseIssueForm from './components/RaiseIssueForm.jsx'
import RecentIssuesList from './components/RecentIssuesList.jsx'
import TrackingHub from './components/TrackingHub.jsx'
import SavedDraftsModal from './components/SavedDraftsModal.jsx'
import { getSavedDrafts } from './citizenDraftsService.js'
import ChatbotPlaceholder from './components/ChatbotPlaceholder.jsx'
import { INITIAL_CITIZEN_ISSUES, CITIZEN_USER_PROFILE } from './citizenMockData.js'

function CitizenPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'track' | 'raise'
  const [issues, setIssues] = useState(INITIAL_CITIZEN_ISSUES)
  const [selectedIssueId, setSelectedIssueId] = useState(INITIAL_CITIZEN_ISSUES[0].id)
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false)

  // Derive live drafts count during render
  const draftsCount = getSavedDrafts().length

  const handleSelectIssue = (id) => {
    setSelectedIssueId(id)
    setSelectedDraft(null)
    setActiveTab('track')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResumeDraft = (draft) => {
    setSelectedDraft(draft)
    setActiveTab('raise')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleUpvote = (id) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const newUpvoted = !issue.isUpvoted
          return {
            ...issue,
            isUpvoted: newUpvoted,
            upvotes: newUpvoted ? issue.upvotes + 1 : issue.upvotes - 1,
          }
        }
        return issue
      })
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Sticky Citizen Navigation Bar */}
      <CitizenNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedDraft(null)
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        onLogout={onLogout}
        notificationsCount={2}
        onOpenDrafts={() => setIsDraftsModalOpen(true)}
        draftsCount={draftsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Welcome Banner */}
            <WelcomeBanner userName={CITIZEN_USER_PROFILE.name} />

            {/* 2. Overview Metric Cards */}
            <OverviewMetrics issues={issues} />

            {/* 3. Raise an Issue Hero Banner - Navigates to dedicated page */}
            <RaiseIssueBanner
              onOpen={() => {
                setSelectedDraft(null)
                setActiveTab('raise')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />

            {/* 4. Recent Issues List with Filters & Live Multi-field Search */}
            <RecentIssuesList
              issues={issues}
              onSelectIssue={handleSelectIssue}
              onToggleUpvote={handleToggleUpvote}
            />
          </div>
        )}

        {activeTab === 'raise' && (
          <div className="animate-fade-in">
            {/* Dedicated Raise an Issue Page */}
            <RaiseIssueForm
              key={selectedDraft?.id || 'new-raise-form'}
              initialDraft={selectedDraft}
              onCancel={() => {
                setSelectedDraft(null)
                setActiveTab('dashboard')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onSubmitSuccess={(newIssue) => {
                setIssues((prev) => [newIssue, ...prev])
              }}
              onTrackIssue={handleSelectIssue}
            />
          </div>
        )}

        {activeTab === 'track' && (
          <div className="animate-fade-in">
            {/* Complaint Tracking & Detail Hub */}
            <TrackingHub
              issues={issues}
              selectedIssueId={selectedIssueId}
              onBack={() => {
                setActiveTab('dashboard')
                window.scrollTo({ top: 0, behavior: 'instant' })
              }}
              onSelectIssue={(id) => setSelectedIssueId(id)}
              onToggleUpvote={handleToggleUpvote}
            />
          </div>
        )}
      </main>

      {/* Saved Drafts Modal */}
      <SavedDraftsModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        onResumeDraft={handleResumeDraft}
      />

      {/* Phase 2 Floating Chatbot Placeholder FAB */}
      <ChatbotPlaceholder />

      {/* Citizen Portal Footer */}
      <footer className="border-t border-[#BFD9D2]/40 py-6 bg-white text-xs sm:text-sm text-[#5C726E] font-outfit mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-[#176B5B]">SETU</span>
            <span>— Citizen Engagement &amp; Resolution Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{CITIZEN_USER_PROFILE.ward}</span>
            <span>•</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CitizenPortal
