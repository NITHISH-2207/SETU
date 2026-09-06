import { useState, useEffect } from 'react'
import UniversityDashboardLayout from './UniversityDashboardLayout.jsx'
import StatCard from './components/StatCard.jsx'
import ProblemCard from './components/ProblemCard.jsx'
import TeamCard from './components/TeamCard.jsx'
import ContributionModal from './components/ContributionModal.jsx'
import TimeFilterStats from './components/TimeFilterStats.jsx'
import StatusBadge, { PriorityBadge } from './components/StatusBadge.jsx'
import { useUniversityDashboardStore } from './useUniversityDashboardStore.js'

function MentorDashboard({ userProfile = {}, onLogout }) {
  const store = useUniversityDashboardStore()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Dedicated in-dashboard detail view states
  const [viewingProblemDetail, setViewingProblemDetail] = useState(null)
  const [viewingTeamDetail, setViewingTeamDetail] = useState(null)
  const [viewingProjectDetail, setViewingProjectDetail] = useState(null)
  const [viewingContributionDetail, setViewingContributionDetail] = useState(null)

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false)
  const [preselectedProblemId, setPreselectedProblemId] = useState(null)
  const [feedbackToast, setFeedbackToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type })
    setTimeout(() => setFeedbackToast(null), 3500)
  }

  const currentMentorId = userProfile.id || 'm1'

  // Problems matched to this mentor
  const matchingProblems = store.problems.filter((p) =>
    (p.matchingMentorIds || []).includes(currentMentorId) || p.assignedMentorId === currentMentorId
  )

  // Problems accepted by this mentor (1/1 slot held)
  const acceptedProblems = store.problems.filter((p) => p.assignedMentorId === currentMentorId)

  // Total student mentees across accepted problems
  const totalMenteesCount = acceptedProblems.reduce(
    (acc, p) => acc + (p.assignedStudentIds?.length || 0),
    0
  )

  // Mentor's contributions
  const mentorContributions = store.contributions.filter(
    (c) => c.authorId === currentMentorId || acceptedProblems.some((p) => p.id === c.problemId)
  )

  const { markSectionAsRead } = store

  // Auto-mark active section as read
  useEffect(() => {
    markSectionAsRead('mentor', activeTab)
  }, [activeTab, markSectionAsRead])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Clear any active detail view when switching tabs
    setViewingProblemDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    store.markSectionAsRead('mentor', tabId)
    if (tabId === 'notifications') {
      store.markAllNotificationsAsRead()
    }
  }

  const handleAcceptProblem = (problemId) => {
    const res = store.acceptProblemAsMentor(problemId, currentMentorId)
    if (res.success) {
      showToast('Successfully accepted problem as Lead Faculty Mentor!')
    } else {
      showToast(res.message, 'error')
    }
  }

  const handleDeclineProblem = (problemId) => {
    const res = store.declineProblemAsMentor(problemId, currentMentorId)
    showToast(res.message, 'error')
  }

  const handleOpenContributionForProblem = (problem) => {
    setPreselectedProblemId(problem.id)
    setIsContributionModalOpen(true)
  }

  const handleOpenProblemDetail = (problem) => {
    setViewingProblemDetail(problem)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenTeamDetail = (problem) => {
    setViewingTeamDetail(problem)
    setViewingProblemDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenProjectDetail = (problem) => {
    setViewingProjectDetail(problem)
    setViewingProblemDetail(null)
    setViewingTeamDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenContributionDetail = (contribution) => {
    setViewingContributionDetail(contribution)
    setViewingProblemDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Active sync with store
  const currentProblem = viewingProblemDetail
    ? store.problems.find((p) => p.id === viewingProblemDetail.id) || viewingProblemDetail
    : null

  const currentTeamProblem = viewingTeamDetail
    ? store.problems.find((p) => p.id === viewingTeamDetail.id) || viewingTeamDetail
    : null

  const currentProjectProblem = viewingProjectDetail
    ? store.problems.find((p) => p.id === viewingProjectDetail.id) || viewingProjectDetail
    : null

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'matching',
      label: 'Problems',
      badge: store.isSectionRead('mentor', 'matching') ? null : (matchingProblems.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      id: 'accepted',
      label: 'Accepted',
      badge: store.isSectionRead('mentor', 'accepted') ? null : (acceptedProblems.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: 'teams',
      label: 'Teams',
      badge: store.isSectionRead('mentor', 'teams') ? null : (totalMenteesCount || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      badge: store.isSectionRead('mentor', 'projects') ? null : (acceptedProblems.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'contributions',
      label: 'Contributions',
      badge: store.isSectionRead('mentor', 'contributions') ? null : (mentorContributions.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Alerts',
      badge: store.isSectionRead('mentor', 'notifications') ? null : (store.notifications.filter((n) => !n.isRead).length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <UniversityDashboardLayout
      roleType="mentor"
      userProfile={userProfile}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      navItems={navItems}
      notifications={store.notifications}
      onMarkNotificationRead={store.markNotificationAsRead}
      onMarkAllNotificationsRead={store.markAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div className="space-y-8 font-outfit animate-fade-in relative">
        {/* Feedback Toast */}
        {feedbackToast && (
          <div
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold animate-fade-in ${
              feedbackToast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* ====================================================
            DEDICATED VIEW 1: PROBLEM DETAILS PAGE
            ==================================================== */}
        {currentProblem ? (
          <div className="space-y-6 animate-fade-in">
            {/* Top Back Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingProblemDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to {activeTab === 'accepted' ? 'Accepted Problems' : 'Matching Problems'}</span>
              </button>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={currentProblem.severity} size="xs" />
                <StatusBadge status={currentProblem.status} size="xs" />
              </div>
            </div>

            {/* Problem Overview Card */}
            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold text-[#176B5B] bg-[#DCEFEA] border border-[#BFD9D2]/60">
                  {currentProblem.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] leading-snug tracking-tight">
                  {currentProblem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-xs text-[#5C726E] pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span><strong>Location:</strong> {currentProblem.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="22" x2="21" y2="22" />
                      <line x1="6" y1="18" x2="6" y2="11" />
                      <line x1="10" y1="18" x2="10" y2="11" />
                      <line x1="14" y1="18" x2="14" y2="11" />
                      <line x1="18" y1="18" x2="18" y2="11" />
                      <polygon points="12 2 20 7 4 7" />
                    </svg>
                    <span><strong>Issued by:</strong> {currentProblem.submittedBy}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span><strong>Received:</strong> {currentProblem.dateReceived}</span>
                  </span>
                </div>
              </div>

              {/* Context Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                  Context &amp; Societal Need
                </h3>
                <p className="text-sm text-[#1F2A28]/85 leading-relaxed bg-[#F7FAF9] p-5 rounded-xl border border-[#BFD9D2]/60">
                  {currentProblem.description}
                </p>
              </div>

              {/* Research Focus & Domain Match */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-[#BFD9D2]/80 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Research Core &amp; Objectives
                  </h4>
                  <p className="text-xs font-medium text-[#1F2A28] leading-relaxed">
                    {currentProblem.researchRequired}
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#BFD9D2]/80 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Why This Matches Your Expertise
                  </h4>
                  <p className="text-xs font-medium text-[#1F2A28] leading-relaxed">
                    {currentProblem.matchingReason || 'Matched based on your declared faculty specialization and department domain.'}
                  </p>
                </div>
              </div>

              {/* Matched Departments & Domains */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C726E] block mb-1.5">Matched Departments:</span>
                  <div className="flex flex-wrap gap-2">
                    {(currentProblem.matchingDepartments || []).map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-white text-[#176B5B] text-xs font-semibold border border-[#BFD9D2]">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C726E] block mb-1.5">Matched Domains:</span>
                  <div className="flex flex-wrap gap-2">
                    {(currentProblem.matchingDomains || []).map((dom, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-[#DCEFEA] text-[#176B5B] text-xs font-semibold border border-[#BFD9D2]/70">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar (Solid SETU Green) */}
              <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{currentProblem.workflowStage} ({currentProblem.progressPercentage || 25}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#176B5B] to-[#125649] rounded-full transition-all duration-500"
                    style={{ width: `${currentProblem.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              {/* Team Slots & Members */}
              <div className="space-y-4 pt-4 border-t border-[#BFD9D2]/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1F2A28] tracking-tight">
                    Problem Team Structure (1 Mentor + 5 Students)
                  </h3>
                  <span className="text-xs font-bold text-[#176B5B]">
                    Mentor: {currentProblem.assignedMentorId ? '1/1' : '0/1'} • Students: {(currentProblem.assignedStudentIds || []).length}/5
                  </span>
                </div>

                {/* Faculty Mentor */}
                <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C726E] block">Faculty Mentor Lead</span>
                    <p className="font-bold text-sm text-[#1F2A28] mt-0.5">
                      {currentProblem.assignedMentor ? currentProblem.assignedMentor.name : 'Open for Faculty Lead'}
                    </p>
                    {currentProblem.assignedMentor && (
                      <p className="text-[#5C726E]">{currentProblem.assignedMentor.department} • {currentProblem.assignedMentor.university}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      currentProblem.assignedMentorId ? 'bg-[#DCEFEA] text-[#176B5B]' : 'bg-gray-100 text-[#5C726E]'
                    }`}
                  >
                    {currentProblem.assignedMentorId === currentMentorId ? 'Your Mentorship' : currentProblem.assignedMentorId ? '1/1 Assigned' : '0/1 Open'}
                  </span>
                </div>

                {/* Students Roster */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C726E] block">
                    Student Innovator Team Members ({(currentProblem.assignedStudents || []).length}/5):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(currentProblem.assignedStudents || []).map((student, idx) => (
                      <div
                        key={student.id || idx}
                        className="p-3 bg-white border border-[#BFD9D2] rounded-xl text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#1F2A28]">{student.name}</p>
                          <span className="text-[10px] font-semibold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                            Slot {idx + 1}/5
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C726E]">{student.department}</p>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - (currentProblem.assignedStudents || []).length) }).map((_, idx) => (
                      <div
                        key={`empty-slot-${idx}`}
                        className="p-3 bg-[#F7FAF9]/60 border border-dashed border-[#BFD9D2] rounded-xl flex items-center justify-center text-xs text-[#5C726E]"
                      >
                        <span>+ Open Student Slot</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#BFD9D2]/70">
                <button
                  type="button"
                  onClick={() => setViewingProblemDetail(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to List
                </button>

                <div className="flex items-center gap-3">
                  {currentProblem.assignedMentorId === currentMentorId ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDeclineProblem(currentProblem.id)}
                        className="px-4 py-2.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl cursor-pointer"
                      >
                        Relinquish Lead Mentor Slot
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenContributionForProblem(currentProblem)}
                        className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer transition-colors"
                      >
                        + Submit Proposal / Findings
                      </button>
                    </>
                  ) : currentProblem.assignedMentorId ? (
                    <span className="px-4 py-2.5 text-xs font-semibold bg-gray-100 text-[#5C726E] rounded-xl border border-gray-200">
                      Mentor Lead Slot Occupied (1/1)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAcceptProblem(currentProblem.id)}
                      className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer transition-colors"
                    >
                      Accept as Lead Faculty Mentor
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : viewingTeamDetail ? (
          /* ====================================================
             DEDICATED VIEW 2: TEAM DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingTeamDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Mentees &amp; Teams</span>
              </button>

              <StatusBadge status={currentTeamProblem?.workflowStage} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                  {currentTeamProblem?.id}
                </span>
                <h1 className="text-2xl font-bold text-[#1F2A28] mt-1.5 tracking-tight">
                  {currentTeamProblem?.title}
                </h1>
                <p className="text-xs text-[#5C726E]">{currentTeamProblem?.location}</p>
              </div>

              {/* Faculty Mentor */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Supervising Faculty Mentor</span>
                <p className="font-bold text-base text-[#1F2A28]">
                  {currentTeamProblem?.assignedMentor ? currentTeamProblem.assignedMentor.name : 'Open for Mentor Lead'}
                </p>
                <p className="text-[#5C726E]">
                  {currentTeamProblem?.assignedMentor ? `${currentTeamProblem.assignedMentor.department} • ${currentTeamProblem.assignedMentor.university}` : 'Unassigned slot'}
                </p>
              </div>

              {/* Student Mentees Roster (5 slots) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Assigned Student Innovators ({(currentTeamProblem?.assignedStudents || []).length}/5)
                  </h3>
                  <span className="text-xs font-bold text-[#176B5B] px-2.5 py-0.5 bg-[#DCEFEA] rounded-full">
                    {Math.max(0, 5 - (currentTeamProblem?.assignedStudents || []).length)} open slots remaining
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(currentTeamProblem?.assignedStudents || []).map((student, idx) => (
                    <div key={student.id || idx} className="p-4 bg-white border border-[#BFD9D2] rounded-xl space-y-2 text-xs shadow-2xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#1F2A28]">{student.name}</p>
                        <span className="text-[10px] font-semibold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                          Mentee {idx + 1}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C726E]">{student.department}</p>
                      {student.skills && (
                        <p className="text-[10px] text-[#176B5B] pt-1 border-t border-[#BFD9D2]/40 truncate">
                          {student.skills.join(' • ')}
                        </p>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: Math.max(0, 5 - (currentTeamProblem?.assignedStudents || []).length) }).map((_, idx) => (
                    <div
                      key={`empty-team-slot-${idx}`}
                      className="p-4 bg-[#F7FAF9]/60 border border-dashed border-[#BFD9D2] rounded-xl flex items-center justify-center text-xs text-[#5C726E]"
                    >
                      <span>+ Open Student Slot</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Progress (Solid SETU Green) */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{currentTeamProblem?.workflowStage} ({currentTeamProblem?.progressPercentage || 25}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#176B5B] to-[#125649] rounded-full transition-all duration-500"
                    style={{ width: `${currentTeamProblem?.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#BFD9D2]/70">
                <button
                  type="button"
                  onClick={() => setViewingTeamDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Teams
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenContributionForProblem(currentTeamProblem)}
                  className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  + File Team Contribution
                </button>
              </div>
            </div>
          </div>
        ) : viewingProjectDetail ? (
          /* ====================================================
             DEDICATED VIEW 3: PROJECT DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingProjectDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Research Projects</span>
              </button>

              <StatusBadge status={currentProjectProblem?.workflowStage} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                  {currentProjectProblem?.id}
                </span>
                <h1 className="text-2xl font-bold text-[#1F2A28] mt-1.5 tracking-tight">
                  {currentProjectProblem?.title}
                </h1>
                <p className="text-xs text-[#5C726E]">{currentProjectProblem?.location}</p>
              </div>

              {/* Research Scope & Specifications */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Research Core Specification</span>
                <p className="text-sm font-semibold text-[#1F2A28] leading-relaxed">
                  {currentProjectProblem?.researchRequired}
                </p>
                <p className="text-[#5C726E] text-xs pt-2 border-t border-[#BFD9D2]/40">
                  {currentProjectProblem?.description}
                </p>
              </div>

              {/* Milestone Progress (Solid SETU Green) */}
              <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{currentProjectProblem?.workflowStage} ({currentProjectProblem?.progressPercentage || 25}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#176B5B] to-[#125649] rounded-full transition-all duration-500"
                    style={{ width: `${currentProjectProblem?.progressPercentage || 25}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-center">
                  <div className="p-2.5 bg-[#F7FAF9] rounded-lg border border-[#BFD9D2]/50">
                    <span className="text-[10px] uppercase font-bold text-[#5C726E] block">Budget Grant</span>
                    <span className="font-bold text-sm text-[#1F2A28]">{currentProjectProblem?.estimatedBudget || '₹ 10.0 L'}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7FAF9] rounded-lg border border-[#BFD9D2]/50">
                    <span className="text-[10px] uppercase font-bold text-[#5C726E] block">Lead Mentor</span>
                    <span className="font-bold text-sm text-[#176B5B]">{currentProjectProblem?.assignedMentor ? '1/1 Active' : '0/1 Open'}</span>
                  </div>
                  <div className="p-2.5 bg-[#F7FAF9] rounded-lg border border-[#BFD9D2]/50">
                    <span className="text-[10px] uppercase font-bold text-[#5C726E] block">Student Mentees</span>
                    <span className="font-bold text-sm text-[#1F2A28]">{(currentProjectProblem?.assignedStudentIds || []).length}/5 Slots</span>
                  </div>
                  <div className="p-2.5 bg-[#F7FAF9] rounded-lg border border-[#BFD9D2]/50">
                    <span className="text-[10px] uppercase font-bold text-[#5C726E] block">Outputs Filed</span>
                    <span className="font-bold text-sm text-[#176B5B]">{currentProjectProblem?.contributionsCount || 1} Reports</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#BFD9D2]/70">
                <button
                  type="button"
                  onClick={() => setViewingProjectDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Projects
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenContributionForProblem(currentProjectProblem)}
                  className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  + Submit Milestone Deliverable
                </button>
              </div>
            </div>
          </div>
        ) : viewingContributionDetail ? (
          /* ====================================================
             DEDICATED VIEW 4: CONTRIBUTION DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingContributionDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Contributions</span>
              </button>

              <StatusBadge status={viewingContributionDetail.status} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
              <div className="space-y-2 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                    {viewingContributionDetail.problemId}
                  </span>
                  <span className="font-semibold text-[#5C726E]">{viewingContributionDetail.type}</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1F2A28] tracking-tight">
                  {viewingContributionDetail.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[#5C726E] pt-1">
                  <span><strong>Author:</strong> {viewingContributionDetail.authorName || 'Faculty Researcher'}</span>
                  <span>•</span>
                  <span><strong>Date:</strong> {viewingContributionDetail.submissionDate}</span>
                  <span>•</span>
                  <span className="text-[#176B5B] font-bold">{viewingContributionDetail.rating}</span>
                </div>
              </div>

              {/* Summary Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Executive Findings &amp; Methodology</span>
                <p className="text-sm text-[#1F2A28]/85 leading-relaxed bg-[#F7FAF9] p-5 rounded-xl border border-[#BFD9D2]/60">
                  {viewingContributionDetail.summary}
                </p>
              </div>

              {/* Attachments */}
              {viewingContributionDetail.attachments && viewingContributionDetail.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C726E] block">Technical Attachments</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingContributionDetail.attachments.map((file, idx) => (
                      <div key={idx} className="p-3 bg-white border border-[#BFD9D2] rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <div>
                            <p className="font-semibold text-[#1F2A28]">{file.name}</p>
                            <p className="text-[10px] text-[#5C726E]">{file.size}</p>
                          </div>
                        </div>
                        <span className="text-[#176B5B] font-bold cursor-pointer hover:underline">Download ↓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingContributionDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Contributions
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================
             MAIN TABS LISTING VIEWS
             ==================================================== */
          <>
            {/* 1. TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-linear-to-br from-[#176B5B] to-[#125649] rounded-2xl p-6 sm:p-8 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#DCEFEA] bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      Faculty Research Hub
                    </span>
                    <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight">
                      Welcome, {userProfile.name || 'Prof. K. Narayanan'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#DCEFEA] leading-relaxed">
                      Oversee verified community research challenges, guide multidisciplinary student innovators, and publish impactful solutions.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('matching')}
                      className="px-4 py-2.5 bg-white text-[#176B5B] hover:bg-[#F7FAF9] rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-all"
                    >
                      Explore Matching Problems ({matchingProblems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreselectedProblemId(acceptedProblems[0]?.id || null)
                        setIsContributionModalOpen(true)
                      }}
                      className="px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/25 cursor-pointer transition-all"
                    >
                      Submit Proposal / Idea
                    </button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard
                    title="Matching Problems"
                    value={matchingProblems.length}
                    subtitle="In your domain & department"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    }
                    trend="Live matches"
                    trendPositive={true}
                    colorScheme="primary"
                    onClick={() => setActiveTab('matching')}
                  />
                  <StatCard
                    title="Accepted Problems"
                    value={acceptedProblems.length}
                    subtitle="1/1 Lead Mentor Slots Held"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    }
                    trend={`${acceptedProblems.length} Active`}
                    trendPositive={true}
                    colorScheme="soft"
                    onClick={() => setActiveTab('accepted')}
                  />
                  <StatCard
                    title="Supervised Mentees"
                    value={totalMenteesCount}
                    subtitle="Students across active teams"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    trend="Max 5 / problem"
                    trendPositive={true}
                    colorScheme="primary"
                    onClick={() => setActiveTab('teams')}
                  />
                  <StatCard
                    title="Research Contributions"
                    value={mentorContributions.length}
                    subtitle="Filed reports & evaluations"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    }
                    trend="Verified"
                    trendPositive={true}
                    colorScheme="soft"
                    onClick={() => setActiveTab('contributions')}
                  />
                </div>

                {/* Time-Based Statistics Component */}
                <TimeFilterStats role="mentor" />

                {/* Active Commitments Overview */}
                <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
                    <h3 className="font-syne text-base font-bold text-[#1F2A28]">
                      My Active Research Projects ({acceptedProblems.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('accepted')}
                      className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {acceptedProblems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {acceptedProblems.map((prob) => (
                        <div
                          key={prob.id}
                          className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-3 font-outfit"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#176B5B]">
                              {prob.id}
                            </span>
                            <StatusBadge status={prob.workflowStage} size="xs" />
                          </div>
                          <h4 className="font-bold text-sm text-[#1F2A28]">{prob.title}</h4>
                          <div className="flex items-center justify-between text-xs text-[#5C726E] pt-2 border-t border-[#BFD9D2]/40">
                            <span>Students: <strong>{prob.assignedStudentIds?.length || 0}/5</strong></span>
                            <button
                              type="button"
                              onClick={() => handleOpenProblemDetail(prob)}
                              className="font-bold text-[#176B5B] hover:underline cursor-pointer"
                            >
                              Manage Team →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#F7FAF9] rounded-xl text-xs text-[#5C726E]">
                      You have not accepted any problem yet. Browse your matching problems to assume mentorship.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. TAB: MATCHING PROBLEMS */}
            {activeTab === 'matching' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Domain-Specific Opportunities
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Research Problems Matched to Your Profile
                    </h2>
                  </div>
                  <span className="text-xs text-[#5C726E]">
                    Filtered by your expertise domains &amp; department
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchingProblems.map((prob) => (
                    <ProblemCard
                      key={prob.id}
                      problem={prob}
                      currentRole="mentor"
                      currentUserId={currentMentorId}
                      onViewDetails={handleOpenProblemDetail}
                      onAccept={(problemId) => handleAcceptProblem(problemId)}
                      onDecline={(problemId) => handleDeclineProblem(problemId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. TAB: ACCEPTED PROBLEMS */}
            {activeTab === 'accepted' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Active Supervisory Workload
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Accepted Research Challenges ({acceptedProblems.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acceptedProblems.map((prob) => (
                    <ProblemCard
                      key={prob.id}
                      problem={prob}
                      currentRole="mentor"
                      currentUserId={currentMentorId}
                      onViewDetails={handleOpenProblemDetail}
                      onDecline={(problemId) => handleDeclineProblem(problemId)}
                    />
                  ))}
                </div>

                {acceptedProblems.length === 0 && (
                  <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                    No problems currently accepted. Explore &apos;Matching Problems&apos; to adopt a community challenge.
                  </div>
                )}
              </div>
            )}

            {/* 4. TAB: MENTEES & TEAMS */}
            {activeTab === 'teams' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Supervised Student Teams
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Student Teams (Max 5 Students Per Problem)
                  </h2>
                </div>

                <div className="space-y-6">
                  {acceptedProblems.map((prob) => (
                    <TeamCard
                      key={prob.id}
                      problem={prob}
                      onOpenProblem={handleOpenTeamDetail}
                      onSubmitContribution={handleOpenContributionForProblem}
                      currentRole="mentor"
                    />
                  ))}

                  {acceptedProblems.length === 0 && (
                    <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                      You have not accepted any problem yet. Accept a problem to start mentoring student teams.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. TAB: RESEARCH PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Supervised Portfolios
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Active Research Projects ({acceptedProblems.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {acceptedProblems.map((prob) => (
                    <div
                      key={prob.id}
                      className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all space-y-4 font-outfit flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                              {prob.id}
                            </span>
                            <h4 className="font-syne text-base font-bold text-[#1F2A28] mt-1.5">{prob.title}</h4>
                          </div>
                          <StatusBadge status={prob.workflowStage} size="xs" />
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C726E]">Location:</span>
                            <span className="font-bold text-[#1F2A28]">{prob.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C726E]">Student Team:</span>
                            <span className="font-semibold text-[#176B5B]">{prob.assignedStudentIds?.length || 0}/5 Students Joined</span>
                          </div>
                        </div>

                        {/* Solid SETU Green Progress Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-[#BFD9D2]/40">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#5C726E]">Research Milestone Progress:</span>
                            <span className="font-bold text-[#176B5B]">{prob.progressPercentage || 25}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-[#176B5B] to-[#125649] rounded-full transition-all duration-500"
                              style={{ width: `${prob.progressPercentage || 25}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#BFD9D2]/50">
                        <button
                          type="button"
                          onClick={() => handleOpenProjectDetail(prob)}
                          className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                        >
                          View Project Details →
                        </button>
                      </div>
                    </div>
                  ))}

                  {acceptedProblems.length === 0 && (
                    <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                      No active projects currently under your mentorship.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. TAB: CONTRIBUTIONS */}
            {activeTab === 'contributions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Research Submissions
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      My Research Proposals &amp; Analyses
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedProblemId(acceptedProblems[0]?.id || null)
                      setIsContributionModalOpen(true)
                    }}
                    disabled={acceptedProblems.length === 0}
                    className="px-4 py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    + New Proposal / Findings
                  </button>
                </div>

                {acceptedProblems.length === 0 && (
                  <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] text-[#5C726E] rounded-xl text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                    <span>You must accept at least one research problem before submitting technical proposals or findings.</span>
                  </div>
                )}

                <div className="space-y-4">
                  {mentorContributions.map((cnt) => (
                    <div
                      key={cnt.id}
                      className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 shadow-2xs space-y-3 text-xs font-outfit"
                    >
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded mr-2">
                            {cnt.problemId}
                          </span>
                          <span className="font-semibold text-[#5C726E]">{cnt.type}</span>
                          <h4 className="font-syne text-base font-bold text-[#1F2A28] mt-1">{cnt.title}</h4>
                        </div>
                        <StatusBadge status={cnt.status} size="xs" />
                      </div>

                      <p className="text-[#1F2A28]/80 leading-relaxed bg-[#F7FAF9] p-3 rounded-xl border border-[#BFD9D2]/50">
                        {cnt.summary}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-[#5C726E] pt-2 border-t border-[#BFD9D2]/40">
                        <span>{cnt.submissionDate}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#176B5B] font-bold">{cnt.rating}</span>
                          <button
                            type="button"
                            onClick={() => handleOpenContributionDetail(cnt)}
                            className="font-bold text-[#176B5B] hover:underline cursor-pointer"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/50">
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Mentor Notifications
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      store.markAllNotificationsAsRead()
                      showToast('All notifications marked as read.')
                    }}
                    className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-3">
                  {store.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-colors ${
                        notif.isRead ? 'bg-white border-[#BFD9D2]' : 'bg-[#DCEFEA]/30 border-[#176B5B]/30 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 text-xs">
                        <p className="font-bold text-[#1F2A28]">{notif.title}</p>
                        <span className="text-[10px] text-[#5C726E]">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#5C726E] mt-1.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TAB: FACULTY PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 font-outfit text-xs">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#176B5B] text-white font-syne text-2xl font-bold flex items-center justify-center">
                    KN
                  </div>
                  <div>
                    <h3 className="font-syne text-xl font-bold text-[#1F2A28]">
                      {userProfile.name || 'Prof. K. Narayanan'}
                    </h3>
                    <p className="text-[#5C726E]">
                      {userProfile.designation || 'Associate Professor'} • {userProfile.department || 'Civil & Environmental Engineering'}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] font-bold text-[11px]">
                      VERIFIED FACULTY MENTOR
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#BFD9D2]/50">
                  <div className="p-3.5 bg-[#F7FAF9] rounded-xl space-y-1">
                    <span className="text-[#5C726E] font-semibold block">University:</span>
                    <span className="font-bold text-[#1F2A28] text-sm">{userProfile.university || 'IIT Madras'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F7FAF9] rounded-xl space-y-1">
                    <span className="text-[#5C726E] font-semibold block">Email / Contact:</span>
                    <span className="font-bold text-[#1F2A28] text-sm">{userProfile.email || 'narayanan.mentor@iitm.ac.in'}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false)
          setPreselectedProblemId(null)
        }}
        authorizedProblems={acceptedProblems.length > 0 ? acceptedProblems : matchingProblems}
        preselectedProblemId={preselectedProblemId}
        currentUser={userProfile}
        currentRole="mentor"
        onSubmitContribution={(data) => {
          store.addContribution(data)
          showToast('Research contribution filed successfully!')
        }}
      />
    </UniversityDashboardLayout>
  )
}

export default MentorDashboard
