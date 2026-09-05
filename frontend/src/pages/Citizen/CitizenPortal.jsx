import { useState } from 'react'
import CitizenNavbar from './components/CitizenNavbar.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import OverviewMetrics from './components/OverviewMetrics.jsx'
import RaiseIssueBanner from './components/RaiseIssueBanner.jsx'
import RaiseIssueForm from './components/RaiseIssueForm.jsx'
import RecentIssuesList from './components/RecentIssuesList.jsx'
import TrackingHub from './components/TrackingHub.jsx'
import SavedDraftsModal from './components/SavedDraftsModal.jsx'
import SubmissionSuccessModal from './components/SubmissionSuccessModal.jsx'
import MyComplaintsPage from './components/MyComplaintsPage.jsx'
import CitizenProfilePage from './components/CitizenProfilePage.jsx'
import { getSavedDrafts } from './citizenDraftsService.js'
import ChatbotPlaceholder from './components/ChatbotPlaceholder.jsx'
import { CITIZEN_USER_PROFILE } from './citizenMockData.js'
import {
  getStoredComplaints,
  addStoredComplaint,
  deleteStoredComplaint,
  toggleStoredComplaintUpvote,
} from './citizenComplaintStore.js'

function CitizenPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('setu_citizen_active_tab') || 'dashboard'
    } catch {
      return 'dashboard'
    }
  })
  const [issues, setIssues] = useState(() => getStoredComplaints())
  const [selectedIssueId, setSelectedIssueId] = useState(() => {
    try {
      const savedId = localStorage.getItem('setu_selected_issue_id')
      if (savedId) return savedId
    } catch (err) {
      console.warn('Failed to read saved issue id:', err)
    }
    const initial = getStoredComplaints()
    return initial.length > 0 ? initial[0].id : null
  })
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false)
  const [submittedComplaint, setSubmittedComplaint] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Derive live drafts count during render
  const draftsCount = getSavedDrafts().length

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleTabChange = (newTab) => {
    setSelectedDraft(null)
    setActiveTab(newTab)
    try {
      localStorage.setItem('setu_citizen_active_tab', newTab)
    } catch (err) {
      console.warn('Failed to persist active tab:', err)
    }
  }

  const handleSelectIssue = (id) => {
    setSelectedIssueId(id)
    setSelectedDraft(null)
    handleTabChange('track')
    try {
      localStorage.setItem('setu_selected_issue_id', id)
    } catch (err) {
      console.warn('Failed to persist selected issue id:', err)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResumeDraft = (draft) => {
    setSelectedDraft(draft)
    handleTabChange('raise')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleUpvote = (id) => {
    const updated = toggleStoredComplaintUpvote(id)
    setIssues(updated)
  }

  const handleComplaintSubmitSuccess = (newComplaint) => {
    const updated = addStoredComplaint(newComplaint)
    setIssues(updated)
    setSelectedIssueId(newComplaint.id)
    setSubmittedComplaint(newComplaint)
    setIsSuccessModalOpen(true)
    try {
      localStorage.setItem('setu_selected_issue_id', newComplaint.id)
    } catch (err) {
      console.warn('Failed to persist new complaint id:', err)
    }
  }

  const handleDeleteComplaint = (id) => {
    const updated = deleteStoredComplaint(id)
    setIssues(updated)
    if (selectedIssueId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null
      setSelectedIssueId(nextId)
      if (nextId) {
        localStorage.setItem('setu_selected_issue_id', nextId)
      } else {
        localStorage.removeItem('setu_selected_issue_id')
      }
    }
    showToast('Complaint deleted successfully.')
    // Return to My Complaints or Dashboard
    handleTabChange('my_complaints')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Sticky Citizen Navigation Bar */}
      <CitizenNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          handleTabChange(tab)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        onLogout={onLogout}
        notificationsCount={2}
        onOpenDrafts={() => setIsDraftsModalOpen(true)}
        draftsCount={draftsCount}
      />

      {/* Floating Global Inline Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-fadeIn">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#176B5B] text-white rounded-xl shadow-lg border border-[#176B5B]/30 font-outfit text-sm font-semibold">
            <svg className="w-5 h-5 text-[#DCEFEA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: DASHBOARD */}
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
                handleTabChange('raise')
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

        {/* TAB 2: MY COMPLAINTS */}
        {activeTab === 'my_complaints' && (
          <div className="animate-fade-in">
            <MyComplaintsPage
              complaints={issues}
              onSelectComplaint={handleSelectIssue}
              onRaiseNewIssue={() => {
                setSelectedDraft(null)
                handleTabChange('raise')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        )}

        {/* TAB 3: RAISE AN ISSUE */}
        {activeTab === 'raise' && (
          <div className="animate-fade-in">
            <RaiseIssueForm
              key={selectedDraft?.id || 'new-raise-form'}
              initialDraft={selectedDraft}
              onCancel={() => {
                setSelectedDraft(null)
                handleTabChange('dashboard')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onSubmitSuccess={handleComplaintSubmitSuccess}
              onTrackIssue={handleSelectIssue}
            />
          </div>
        )}

        {/* TAB 4: CHECK STATUS & COMPLAINT TRACKING HUB */}
        {activeTab === 'track' && (
          <div className="animate-fade-in">
            <TrackingHub
              issues={issues}
              selectedIssueId={selectedIssueId}
              onBack={() => {
                handleTabChange('dashboard')
                window.scrollTo({ top: 0, behavior: 'instant' })
              }}
              onSelectIssue={(id) => handleSelectIssue(id)}
              onToggleUpvote={handleToggleUpvote}
              onDeleteComplaint={handleDeleteComplaint}
            />
          </div>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <CitizenProfilePage
              complaints={issues}
              onNavigateToMyComplaints={() => {
                handleTabChange('my_complaints')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onRaiseNewIssue={() => {
                setSelectedDraft(null)
                handleTabChange('raise')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onBackToDashboard={() => {
                handleTabChange('dashboard')
                window.scrollTo({ top: 0, behavior: 'instant' })
              }}
            />
          </div>
        )}
      </main>

      {/* Submission Success Modal (Centered Modal with Dim Backdrop) */}
      <SubmissionSuccessModal
        isOpen={isSuccessModalOpen}
        complaintId={submittedComplaint?.id || 'SETU-CIT-2026-0000'}
        onClose={() => setIsSuccessModalOpen(false)}
        onGoToDashboard={() => {
          setIsSuccessModalOpen(false)
          handleTabChange('dashboard')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onViewComplaint={() => {
          setIsSuccessModalOpen(false)
          if (submittedComplaint) {
            handleSelectIssue(submittedComplaint.id)
          } else {
            handleTabChange('track')
          }
        }}
      />

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
