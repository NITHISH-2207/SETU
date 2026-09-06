import { useState, useEffect } from 'react'
import UniversityDashboardLayout from './UniversityDashboardLayout.jsx'
import StatCard from './components/StatCard.jsx'
import StatusBadge, { PriorityBadge } from './components/StatusBadge.jsx'
import ProblemCard from './components/ProblemCard.jsx'
import TeamCard from './components/TeamCard.jsx'
import ContributionModal from './components/ContributionModal.jsx'
import { useUniversityDashboardStore } from './useUniversityDashboardStore.js'

function AdminDashboard({ userProfile = {}, onLogout }) {
  const store = useUniversityDashboardStore()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Dedicated in-dashboard detail view states
  const [viewingProblemDetail, setViewingProblemDetail] = useState(null)
  const [viewingApprovalDetail, setViewingApprovalDetail] = useState(null)
  const [viewingMentorDetail, setViewingMentorDetail] = useState(null)
  const [viewingStudentDetail, setViewingStudentDetail] = useState(null)
  const [viewingTeamDetail, setViewingTeamDetail] = useState(null)
  const [viewingProjectDetail, setViewingProjectDetail] = useState(null)
  const [viewingContributionDetail, setViewingContributionDetail] = useState(null)

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false)
  const [approvalFilter, setApprovalFilter] = useState('ALL') // 'ALL' | 'mentor' | 'student' | 'PENDING'
  const [problemSearch, setProblemSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [feedbackToast, setFeedbackToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type })
    setTimeout(() => setFeedbackToast(null), 3500)
  }

  const pendingApprovalsCount = store.approvals.filter((a) => a.status === 'PENDING').length
  const activeTeamsCount = store.problems.filter((p) => p.assignedMentorId || p.assignedStudentIds?.length > 0).length
  const activeProjects = store.problems.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'COMPLETED')

  const { markSectionAsRead } = store

  // Auto-mark active section as read
  useEffect(() => {
    markSectionAsRead('admin', activeTab)
  }, [activeTab, markSectionAsRead])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Clear any active detail view when switching tabs
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    store.markSectionAsRead('admin', tabId)
    if (tabId === 'notifications') {
      store.markAllNotificationsAsRead()
    }
  }

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
      id: 'problems',
      label: 'Problems',
      badge: store.isSectionRead('admin', 'problems') ? null : (store.problems.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="21" y2="22" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </svg>
      ),
    },
    {
      id: 'approvals',
      label: 'Approvals',
      badge: store.isSectionRead('admin', 'approvals') ? null : (pendingApprovalsCount > 0 ? `${pendingApprovalsCount} New` : null),
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
      id: 'mentors',
      label: 'Mentors',
      badge: store.isSectionRead('admin', 'mentors') ? null : (store.mentors.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 'students',
      label: 'Students',
      badge: store.isSectionRead('admin', 'students') ? null : (store.students.length || null),
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
      id: 'departments',
      label: 'Departments',
      badge: store.isSectionRead('admin', 'departments') ? null : (store.departments.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="22" x2="9" y2="22.01" />
          <line x1="15" y1="22" x2="15" y2="22.01" />
          <line x1="9" y1="6" x2="9" y2="6.01" />
          <line x1="15" y1="6" x2="15" y2="6.01" />
          <line x1="9" y1="10" x2="9" y2="10.01" />
          <line x1="15" y1="10" x2="15" y2="10.01" />
          <line x1="9" y1="14" x2="9" y2="14.01" />
          <line x1="15" y1="14" x2="15" y2="14.01" />
          <line x1="9" y1="18" x2="9" y2="18.01" />
          <line x1="15" y1="18" x2="15" y2="18.01" />
        </svg>
      ),
    },
    {
      id: 'teams',
      label: 'Teams',
      badge: store.isSectionRead('admin', 'teams') ? null : (activeTeamsCount || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4" />
          <path d="M17 11a3 3 0 1 0 0-6" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      badge: store.isSectionRead('admin', 'projects') ? null : (activeProjects.length || null),
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
      badge: store.isSectionRead('admin', 'contributions') ? null : (store.contributions.length || null),
      iconSvg: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Alerts',
      badge: store.isSectionRead('admin', 'notifications') ? null : (store.notifications.filter((n) => !n.isRead).length || null),
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

  // Filtered approvals
  const filteredApprovals = store.approvals.filter((req) => {
    if (approvalFilter === 'ALL') return true
    if (approvalFilter === 'PENDING') return req.status === 'PENDING'
    if (approvalFilter === 'mentor') return req.role === 'mentor'
    if (approvalFilter === 'student') return req.role === 'student'
    return true
  })

  // Filtered problems
  const filteredProblems = store.problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
      prob.id.toLowerCase().includes(problemSearch.toLowerCase()) ||
      prob.category.toLowerCase().includes(problemSearch.toLowerCase())
    const matchesDept =
      departmentFilter === 'ALL' || (prob.matchingDepartments || []).includes(departmentFilter)
    return matchesSearch && matchesDept
  })

  const handleApprove = (reqId, reqName) => {
    store.approveRequest(reqId)
    showToast(`Successfully approved registration for ${reqName}!`)
  }

  const handleReject = (reqId, reqName) => {
    store.rejectRequest(reqId)
    showToast(`Registration request for ${reqName} has been rejected.`, 'error')
  }

  const handleOpenProblemDetail = (problem) => {
    setViewingProblemDetail(problem)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenApprovalDetail = (approval) => {
    setViewingApprovalDetail(approval)
    setViewingProblemDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenMentorDetail = (mentor) => {
    setViewingMentorDetail(mentor)
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenStudentDetail = (student) => {
    setViewingStudentDetail(student)
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenTeamDetail = (problem) => {
    setViewingTeamDetail(problem)
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingProjectDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenProjectDetail = (problem) => {
    setViewingProjectDetail(problem)
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingContributionDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenContributionDetail = (contribution) => {
    setViewingContributionDetail(contribution)
    setViewingProblemDetail(null)
    setViewingApprovalDetail(null)
    setViewingMentorDetail(null)
    setViewingStudentDetail(null)
    setViewingTeamDetail(null)
    setViewingProjectDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentProblem = viewingProblemDetail
    ? store.problems.find((p) => p.id === viewingProblemDetail.id) || viewingProblemDetail
    : null

  const currentApproval = viewingApprovalDetail
    ? store.approvals.find((a) => a.id === viewingApprovalDetail.id) || viewingApprovalDetail
    : null

  return (
    <UniversityDashboardLayout
      roleType="admin"
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
                <span>Back to Government Problems</span>
              </button>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={currentProblem.severity} size="xs" />
                <StatusBadge status={currentProblem.status} size="xs" />
              </div>
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold text-[#176B5B] bg-[#DCEFEA] border border-[#BFD9D2]/60">
                  {currentProblem.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] leading-snug tracking-tight">
                  {currentProblem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-xs text-[#5C726E] pt-1">
                  <span><strong>Origin Agency:</strong> {currentProblem.submittedBy}</span>
                  <span>•</span>
                  <span><strong>Location:</strong> {currentProblem.location}</span>
                  <span>•</span>
                  <span><strong>Received:</strong> {currentProblem.dateReceived}</span>
                  {currentProblem.estimatedBudget && (
                    <>
                      <span>•</span>
                      <span><strong>Sanctioned Budget:</strong> {currentProblem.estimatedBudget}</span>
                    </>
                  )}
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

              {/* Research Core & Matched Departments */}
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
                    Matched Departments &amp; Academic Focus
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(currentProblem.matchingDepartments || []).map((dept, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-[#F7FAF9] text-[#176B5B] text-xs font-semibold border border-[#BFD9D2]">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar (Solid SETU Green) */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2.5">
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

              {/* Problem Team Structure */}
              <div className="space-y-4 pt-4 border-t border-[#BFD9D2]/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1F2A28] tracking-tight">
                    Institutional Team Assembly (1 Mentor + 5 Students)
                  </h3>
                  <span className="text-xs font-bold text-[#176B5B]">
                    Mentor: {currentProblem.assignedMentorId ? '1/1 Assigned' : '0/1 Open'} • Students: {(currentProblem.assignedStudentIds || []).length}/5
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
                    {currentProblem.assignedMentorId ? '1/1 Assigned' : '0/1 Open Slot'}
                  </span>
                </div>

                {/* Students Roster */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C726E] block">
                    Assigned Student Innovators ({(currentProblem.assignedStudents || []).length}/5):
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
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-[#BFD9D2]/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setViewingProblemDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Problems Catalog
                </button>
              </div>
            </div>
          </div>
        ) : currentApproval ? (
          /* ====================================================
             DEDICATED VIEW 2: REGISTRATION APPROVAL DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingApprovalDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Registration Approvals</span>
              </button>

              <StatusBadge status={currentApproval.status} size="sm" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 font-outfit text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#176B5B] text-white font-bold text-xl flex items-center justify-center">
                    {currentApproval.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#1F2A28] tracking-tight">{currentApproval.name}</h1>
                    <p className="text-sm font-semibold text-[#176B5B]">{currentApproval.roleLabel} • {currentApproval.department}</p>
                    <p className="text-[#5C726E] text-xs">{currentApproval.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentApproval.status !== 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(currentApproval.id, currentApproval.name)}
                      className="px-5 py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white font-bold rounded-xl cursor-pointer shadow-2xs transition-colors"
                    >
                      Approve Registration
                    </button>
                  )}
                  {currentApproval.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleReject(currentApproval.id, currentApproval.name)}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl border border-red-200 cursor-pointer transition-colors"
                    >
                      Reject Request
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl">
                <div>
                  <span className="text-[#5C726E] font-semibold block text-[11px]">Affiliation:</span>
                  <span className="font-bold text-[#1F2A28] text-sm block mt-0.5">{currentApproval.university}</span>
                </div>
                <div>
                  <span className="text-[#5C726E] font-semibold block text-[11px]">Submission Date:</span>
                  <span className="font-bold text-[#1F2A28] text-sm block mt-0.5">{currentApproval.registrationDate}</span>
                </div>
                {currentApproval.experience && (
                  <div>
                    <span className="text-[#5C726E] font-semibold block text-[11px]">Teaching Experience:</span>
                    <span className="font-bold text-[#1F2A28] text-sm block mt-0.5">{currentApproval.experience}</span>
                  </div>
                )}
                {currentApproval.yearOfStudy && (
                  <div>
                    <span className="text-[#5C726E] font-semibold block text-[11px]">Academic Year:</span>
                    <span className="font-bold text-[#1F2A28] text-sm block mt-0.5">{currentApproval.yearOfStudy}</span>
                  </div>
                )}
              </div>

              {/* Declared Competencies */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B5B] block">
                  Declared Competencies &amp; Research Domains:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(currentApproval.skills || currentApproval.domains || []).map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white text-[#176B5B] border border-[#BFD9D2] rounded-lg text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingApprovalDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Approvals Queue
                </button>
              </div>
            </div>
          </div>
        ) : viewingMentorDetail ? (
          /* ====================================================
             DEDICATED VIEW 3: MENTOR PROFILE DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingMentorDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Faculty Mentors</span>
              </button>

              <StatusBadge status="ACTIVE" size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs font-outfit">
              <div className="flex items-center gap-4 pb-4 border-b border-[#BFD9D2]/60">
                <div className="w-16 h-16 rounded-2xl bg-[#176B5B] text-white font-bold text-2xl flex items-center justify-center">
                  {viewingMentorDetail.avatar || 'M'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1F2A28] tracking-tight">{viewingMentorDetail.name}</h1>
                  <p className="text-sm text-[#5C726E]">{viewingMentorDetail.designation} • {viewingMentorDetail.department}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] font-bold text-[11px]">
                    VERIFIED FACULTY MENTOR
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl">
                <div>
                  <span className="text-[#5C726E] font-semibold block">University:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{viewingMentorDetail.university}</span>
                </div>
                <div>
                  <span className="text-[#5C726E] font-semibold block">Academic Department:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{viewingMentorDetail.department}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B5B] block">Supervisory Domains:</span>
                <div className="flex flex-wrap gap-2">
                  {(viewingMentorDetail.domains || []).map((dom, idx) => (
                    <span key={idx} className="px-3 py-1 rounded bg-[#DCEFEA] text-[#176B5B] font-semibold border border-[#BFD9D2]/70">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingMentorDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Mentors Directory
                </button>
              </div>
            </div>
          </div>
        ) : viewingStudentDetail ? (
          /* ====================================================
             DEDICATED VIEW 4: STUDENT DETAILS PAGE
             ==================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingStudentDetail(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Student Innovators</span>
              </button>

              <StatusBadge status="ACTIVE" size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs font-outfit">
              <div className="flex items-center gap-4 pb-4 border-b border-[#BFD9D2]/60">
                <div className="w-14 h-14 rounded-2xl bg-[#DCEFEA] text-[#176B5B] font-bold text-xl flex items-center justify-center">
                  {viewingStudentDetail.avatar || 'S'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#1F2A28] tracking-tight">{viewingStudentDetail.name}</h1>
                  <p className="text-sm text-[#5C726E]">{viewingStudentDetail.department} • {viewingStudentDetail.yearOfStudy}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl">
                <div>
                  <span className="text-[#5C726E] font-semibold block">Academic Department:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{viewingStudentDetail.department}</span>
                </div>
                <div>
                  <span className="text-[#5C726E] font-semibold block">Year of Study:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{viewingStudentDetail.yearOfStudy}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingStudentDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Students Roster
                </button>
              </div>
            </div>
          </div>
        ) : viewingTeamDetail ? (
          /* ====================================================
             DEDICATED VIEW 5: TEAM DETAILS PAGE
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
                <span>Back to Problem Teams</span>
              </button>

              <StatusBadge status={viewingTeamDetail.workflowStage} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs font-outfit">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                  {viewingTeamDetail.id}
                </span>
                <h1 className="text-2xl font-bold text-[#1F2A28] mt-1.5 tracking-tight">
                  {viewingTeamDetail.title}
                </h1>
                <p className="text-[#5C726E]">{viewingTeamDetail.location}</p>
              </div>

              {/* Faculty Mentor */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Supervising Faculty Lead (1/1)</span>
                <p className="font-bold text-base text-[#1F2A28]">
                  {viewingTeamDetail.assignedMentor ? viewingTeamDetail.assignedMentor.name : 'Open for Faculty Lead'}
                </p>
                <p className="text-[#5C726E]">
                  {viewingTeamDetail.assignedMentor ? `${viewingTeamDetail.assignedMentor.department} • ${viewingTeamDetail.assignedMentor.university}` : 'Unassigned slot'}
                </p>
              </div>

              {/* Student Mentees Roster */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                  Assigned Student Innovators ({(viewingTeamDetail.assignedStudents || []).length}/5)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(viewingTeamDetail.assignedStudents || []).map((student, idx) => (
                    <div key={student.id || idx} className="p-3.5 bg-white border border-[#BFD9D2] rounded-xl space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[#1F2A28]">{student.name}</p>
                        <span className="text-[10px] font-semibold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                          Slot {idx + 1}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C726E]">{student.department}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingTeamDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Problem Teams
                </button>
              </div>
            </div>
          </div>
        ) : viewingProjectDetail ? (
          /* ====================================================
             DEDICATED VIEW 6: PROJECT DETAILS PAGE
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

              <StatusBadge status={viewingProjectDetail.workflowStage} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs font-outfit">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                  {viewingProjectDetail.id}
                </span>
                <h1 className="text-2xl font-bold text-[#1F2A28] mt-1.5 tracking-tight">
                  {viewingProjectDetail.title}
                </h1>
                <p className="text-[#5C726E]">{viewingProjectDetail.location}</p>
              </div>

              {/* Research Scope */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Research Specification</span>
                <p className="text-sm font-semibold text-[#1F2A28]">{viewingProjectDetail.researchRequired}</p>
                <p className="text-[#5C726E] text-xs pt-2 border-t border-[#BFD9D2]/40">{viewingProjectDetail.description}</p>
              </div>

              {/* Progress Bar (Solid SETU Green) */}
              <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{viewingProjectDetail.workflowStage} ({viewingProjectDetail.progressPercentage || 25}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#176B5B] to-[#125649] rounded-full transition-all duration-500"
                    style={{ width: `${viewingProjectDetail.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingProjectDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Projects Portfolio
                </button>
              </div>
            </div>
          </div>
        ) : viewingContributionDetail ? (
          /* ====================================================
             DEDICATED VIEW 7: CONTRIBUTION DETAILS PAGE
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
                <span>Back to Research Contributions</span>
              </button>

              <StatusBadge status={viewingContributionDetail.status} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 text-xs font-outfit">
              <div className="space-y-2 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                    {viewingContributionDetail.problemId}
                  </span>
                  <span className="font-semibold text-[#5C726E]">{viewingContributionDetail.type}</span>
                </div>
                <h1 className="text-2xl font-bold text-[#1F2A28] tracking-tight">{viewingContributionDetail.title}</h1>
                <p className="text-[#5C726E]">
                  <strong>Author:</strong> {viewingContributionDetail.authorName} ({viewingContributionDetail.authorRole} • {viewingContributionDetail.authorUniversity})
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Executive Findings &amp; Methodology</span>
                <p className="text-sm text-[#1F2A28]/85 leading-relaxed bg-[#F7FAF9] p-5 rounded-xl border border-[#BFD9D2]/60">
                  {viewingContributionDetail.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingContributionDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Contributions Repository
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
                      Institutional Governance Center
                    </span>
                    <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight">
                      Welcome back, {userProfile.name || 'Dr. Administrator'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#DCEFEA] leading-relaxed">
                      Monitoring research problem dispatches, approving faculty mentors, and governing multidisciplinary student project teams.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('approvals')}
                      className="px-4 py-2.5 bg-white text-[#176B5B] hover:bg-[#F7FAF9] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      Review Approvals ({pendingApprovalsCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('problems')}
                      className="px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/25 transition-all cursor-pointer"
                    >
                      View Dispatched Problems
                    </button>
                  </div>
                </div>

                {/* Overview KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Problems Received"
                    value={store.problems.length}
                    subtitle="From state and municipal agencies"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="22" x2="21" y2="22" />
                        <line x1="6" y1="18" x2="6" y2="11" />
                        <line x1="10" y1="18" x2="10" y2="11" />
                        <line x1="14" y1="18" x2="14" y2="11" />
                        <line x1="18" y1="18" x2="18" y2="11" />
                        <polygon points="12 2 20 7 4 7" />
                      </svg>
                    }
                    trend="+2 this week"
                    trendPositive={true}
                    colorScheme="primary"
                    onClick={() => setActiveTab('problems')}
                  />
                  <StatCard
                    title="Active Teams"
                    value={activeTeamsCount}
                    subtitle="1 Mentor + Max 5 Students"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    trend="100% capacity in 1 team"
                    trendPositive={true}
                    colorScheme="soft"
                    onClick={() => setActiveTab('teams')}
                  />
                  <StatCard
                    title="Pending Approvals"
                    value={pendingApprovalsCount}
                    subtitle="Faculty & Student Registrations"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    }
                    trend={pendingApprovalsCount > 0 ? 'Requires action' : 'All clear'}
                    trendPositive={pendingApprovalsCount === 0}
                    colorScheme="primary"
                    onClick={() => setActiveTab('approvals')}
                  />
                  <StatCard
                    title="Contributions Filed"
                    value={store.contributions.length}
                    subtitle="Research reports & prototypes"
                    icon={
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    }
                    trend="+1 new output"
                    trendPositive={true}
                    colorScheme="soft"
                    onClick={() => setActiveTab('contributions')}
                  />
                </div>

                {/* Stepper Pipeline */}
                <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                        SETU Problem-to-Action Pipeline
                      </span>
                      <h3 className="font-syne text-lg font-bold text-[#1F2A28]">
                        Live Multi-tier Governance Workflow
                      </h3>
                    </div>
                    <span className="text-xs text-[#5C726E]">Constraint: 1 Mentor + Max 5 Students</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
                    <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                      <span className="font-bold text-[#176B5B] block">01. Govt Dispatch</span>
                      <p className="text-[11px] text-[#5C726E]">Problem received with domain metadata and evidence.</p>
                    </div>
                    <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                      <span className="font-bold text-[#176B5B] block">02. Domain Match</span>
                      <p className="text-[11px] text-[#5C726E]">Automatic routing to relevant departments &amp; faculty.</p>
                    </div>
                    <div className="p-3.5 bg-[#DCEFEA]/60 border border-[#176B5B]/30 rounded-xl space-y-1">
                      <span className="font-bold text-[#176B5B] block">03. Mentor (1/1)</span>
                      <p className="text-[11px] text-[#176B5B]">1 Lead Mentor claims &amp; locks the problem slot.</p>
                    </div>
                    <div className="p-3.5 bg-[#DCEFEA]/60 border border-[#176B5B]/30 rounded-xl space-y-1">
                      <span className="font-bold text-[#176B5B] block">04. Students (≤5)</span>
                      <p className="text-[11px] text-[#176B5B]">Up to 5 student researchers assemble project team.</p>
                    </div>
                    <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                      <span className="font-bold text-[#176B5B] block">05. Contributions</span>
                      <p className="text-[11px] text-[#1F2A28]">Prototypes &amp; findings submitted for verification.</p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Recent Problems */}
                  <div className="lg:col-span-7 bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
                      <h3 className="font-syne text-base font-bold text-[#1F2A28]">
                        Recent Community Research Dispatches
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('problems')}
                        className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                      >
                        View All ({store.problems.length}) →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {store.problems.slice(0, 3).map((prob) => (
                        <div
                          key={prob.id}
                          onClick={() => handleOpenProblemDetail(prob)}
                          className="p-3.5 bg-[#F7FAF9] hover:bg-[#DCEFEA]/30 border border-[#BFD9D2]/70 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-[#176B5B] bg-white px-2 py-0.5 rounded border border-[#BFD9D2]">
                                {prob.id}
                              </span>
                              <StatusBadge status={prob.severity} size="xs" />
                            </div>
                            <p className="text-xs font-bold text-[#1F2A28] truncate">{prob.title}</p>
                            <p className="text-[11px] text-[#5C726E] truncate">{prob.location}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-bold text-[#176B5B] block">
                              {prob.assignedMentorId ? 'Mentor: 1/1' : 'Mentor: 0/1'}
                            </span>
                            <span className="text-[10px] text-[#5C726E]">
                              {prob.assignedStudentIds?.length || 0}/5 Students
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Pending Approvals Widget */}
                  <div className="lg:col-span-5 bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
                      <h3 className="font-syne text-base font-bold text-[#1F2A28]">
                        Pending Registrations
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('approvals')}
                        className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                      >
                        Manage Queue →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {store.approvals.filter((a) => a.status === 'PENDING').slice(0, 3).map((req) => (
                        <div
                          key={req.id}
                          className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-[#1F2A28]">{req.name}</p>
                              <p className="text-[11px] text-[#5C726E]">{req.roleLabel} • {req.department}</p>
                            </div>
                            <StatusBadge status={req.status} size="xs" />
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#BFD9D2]/40">
                            <button
                              type="button"
                              onClick={() => handleOpenApprovalDetail(req)}
                              className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                            >
                              Review Details →
                            </button>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleReject(req.id, req.name)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id, req.name)}
                                className="px-3 py-1 rounded-md text-[11px] font-bold text-white bg-[#176B5B] hover:bg-[#125649] cursor-pointer shadow-2xs"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {pendingApprovalsCount === 0 && (
                        <div className="p-6 text-center text-xs text-[#5C726E]">
                          All faculty and student registrations are up to date.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. TAB: GOVERNMENT PROBLEMS */}
            {activeTab === 'problems' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Civic Innovation Intake
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Government Research Challenges Catalog
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="text"
                      value={problemSearch}
                      onChange={(e) => setProblemSearch(e.target.value)}
                      placeholder="Search problem, category, ID..."
                      className="px-3.5 py-2 text-xs bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] w-48 sm:w-60 shadow-2xs"
                    />

                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] shadow-2xs"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Civil & Environmental Engineering">Civil &amp; Env Engineering</option>
                      <option value="Computer Science & Engineering (AI/Data)">Computer Science (AI/Data)</option>
                      <option value="Electrical & Renewable Energy Systems">Electrical &amp; Energy</option>
                      <option value="Agronomy, Soil Science & Water Management">Agronomy &amp; Agriculture</option>
                      <option value="Public Health & Community Epidemiology">Public Health</option>
                      <option value="Cyber Law, Data Governance & Public Policy">Cyber Law &amp; Policy</option>
                      <option value="Integrative Medicine & Yoga Sciences">Yoga &amp; Integrative Med</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProblems.map((prob) => (
                    <ProblemCard
                      key={prob.id}
                      problem={prob}
                      currentRole="admin"
                      onViewDetails={handleOpenProblemDetail}
                    />
                  ))}
                </div>

                {filteredProblems.length === 0 && (
                  <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                    No government problems match the selected search filters.
                  </div>
                )}
              </div>
            )}

            {/* 3. TAB: APPROVALS QUEUE */}
            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Identity &amp; Institutional Governance
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Faculty &amp; Student Registration Approvals
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 p-1 bg-white border border-[#BFD9D2] rounded-xl">
                    {['ALL', 'PENDING', 'mentor', 'student'].map((filt) => (
                      <button
                        key={filt}
                        type="button"
                        onClick={() => setApprovalFilter(filt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          approvalFilter === filt
                            ? 'bg-[#176B5B] text-white'
                            : 'text-[#5C726E] hover:text-[#1F2A28]'
                        }`}
                      >
                        {filt === 'ALL' ? 'All Requests' : filt === 'PENDING' ? 'Pending Review' : filt === 'mentor' ? 'Mentors' : 'Students'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredApprovals.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 shadow-2xs space-y-4 text-xs font-outfit flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#BFD9D2]/50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1F2A28]">{req.name}</span>
                              <span className="text-[10px] font-mono text-[#5C726E]">[{req.id}]</span>
                            </div>
                            <p className="text-[11px] text-[#176B5B] font-semibold mt-0.5">
                              {req.roleLabel} • {req.department}
                            </p>
                            <p className="text-[11px] text-[#5C726E]">{req.email}</p>
                          </div>
                          <StatusBadge status={req.status} size="xs" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3 bg-[#F7FAF9] rounded-xl text-[11px]">
                          <div>
                            <span className="text-[#5C726E] block font-semibold">Affiliation:</span>
                            <span className="text-[#1F2A28] font-bold truncate block">{req.university}</span>
                          </div>
                          <div>
                            <span className="text-[#5C726E] block font-semibold">Submitted:</span>
                            <span className="text-[#1F2A28]">{req.registrationDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#BFD9D2]/50 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleOpenApprovalDetail(req)}
                          className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                        >
                          Review Request →
                        </button>

                        <div className="flex items-center gap-2">
                          {req.status !== 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id, req.name)}
                              className="px-3.5 py-1.5 bg-[#176B5B] hover:bg-[#125649] text-white font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                            >
                              Approve
                            </button>
                          )}
                          {req.status !== 'REJECTED' && (
                            <button
                              type="button"
                              onClick={() => handleReject(req.id, req.name)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200 cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TAB: FACULTY MENTORS */}
            {activeTab === 'mentors' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Faculty Network
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Certified University Mentors Directory
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.mentors.map((m) => (
                    <div key={m.id} className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#176B5B] text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {m.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#1F2A28]">{m.name}</h4>
                            <p className="text-xs text-[#5C726E]">{m.designation} • {m.department}</p>
                            <p className="text-[11px] text-[#176B5B] font-semibold">{m.university}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#BFD9D2]/40 text-xs">
                          <span className="text-[10px] uppercase font-bold text-[#5C726E] block mb-1">Expertise Domains:</span>
                          <div className="flex flex-wrap gap-1">
                            {m.domains.map((d, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-[#F7FAF9] text-[#176B5B] text-[10px] font-medium border border-[#BFD9D2]">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#BFD9D2]/40">
                        <button
                          type="button"
                          onClick={() => handleOpenMentorDetail(m)}
                          className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                        >
                          View Faculty Profile →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TAB: STUDENT INNOVATORS */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Student Researchers
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Enrolled Student Innovators Roster
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {store.students.map((s) => (
                    <div key={s.id} className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#DCEFEA] text-[#176B5B] font-bold text-xs flex items-center justify-center shrink-0">
                            {s.avatar}
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#1F2A28] truncate">{s.name}</h5>
                            <p className="text-[10px] text-[#5C726E] truncate">{s.department}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#BFD9D2]/40 text-[11px] text-[#5C726E] flex justify-between">
                          <span>{s.yearOfStudy}</span>
                          <span className="text-[#176B5B] font-bold">Active</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#BFD9D2]/40">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentDetail(s)}
                          className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
                        >
                          View Student Record →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. TAB: ACADEMIC DEPARTMENTS */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Academic Structure
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    Participating Departments &amp; Research Centers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {store.departments.map((dept) => {
                    const deptMentors = store.mentors.filter((m) => m.deptCode === dept.code || m.department === dept.name)
                    const deptStudents = store.students.filter((s) => s.deptCode === dept.code || s.department === dept.name)
                    const matchedProblems = store.problems.filter((p) => (p.matchingDepartments || []).some((d) => d.includes(dept.name) || dept.name.includes(d)))

                    return (
                      <div
                        key={dept.id}
                        className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4 font-outfit"
                      >
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#BFD9D2]/50">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded">
                              {dept.code}
                            </span>
                            <h3 className="font-syne text-base font-bold text-[#1F2A28] mt-1.5">{dept.name}</h3>
                          </div>
                          <StatusBadge status="ACTIVE" size="xs" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/50">
                            <span className="text-[#5C726E] text-[10px] uppercase font-bold block">Mentors</span>
                            <span className="font-syne text-lg font-bold text-[#176B5B]">{deptMentors.length}</span>
                          </div>
                          <div className="p-2.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/50">
                            <span className="text-[#5C726E] text-[10px] uppercase font-bold block">Students</span>
                            <span className="font-syne text-lg font-bold text-[#1F2A28]">{deptStudents.length}</span>
                          </div>
                          <div className="p-2.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/50">
                            <span className="text-[#5C726E] text-[10px] uppercase font-bold block">Problems</span>
                            <span className="font-syne text-lg font-bold text-[#176B5B]">{matchedProblems.length}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 7. TAB: TEAMS */}
            {activeTab === 'teams' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Research Assemblies
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Active Problem Teams (1 Mentor + 5 Students Constraint)
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-[#176B5B] px-3 py-1 bg-[#DCEFEA] rounded-full border border-[#BFD9D2]">
                    {activeTeamsCount} Active Collaborative Units
                  </span>
                </div>

                <div className="space-y-6">
                  {store.problems.map((prob) => (
                    <TeamCard
                      key={prob.id}
                      problem={prob}
                      onOpenProblem={handleOpenTeamDetail}
                      currentRole="admin"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 8. TAB: RESEARCH PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Sanctioned Initiatives
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Institutional Research Projects Portfolio
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeProjects.map((prob) => (
                    <div
                      key={prob.id}
                      className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4 font-outfit flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                          <div>
                            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded">
                              {prob.id}
                            </span>
                            <h4 className="font-syne text-base font-bold text-[#1F2A28] mt-1.5">{prob.title}</h4>
                          </div>
                          <StatusBadge status={prob.workflowStage} size="xs" />
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C726E]">Sanctioned Grant:</span>
                            <span className="font-bold text-[#1F2A28]">{prob.estimatedBudget || '₹ 10.0 Lakhs'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C726E]">Faculty Mentor:</span>
                            <span className="font-bold text-[#176B5B]">{prob.assignedMentor ? prob.assignedMentor.name : 'Pending Assignment'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#5C726E]">Team Assembly:</span>
                            <span className="font-semibold text-[#1F2A28]">{prob.assignedStudentIds?.length || 0}/5 Students</span>
                          </div>
                        </div>

                        {/* Solid SETU Green Progress Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-[#BFD9D2]/40">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#5C726E]">Execution Progress:</span>
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
                </div>
              </div>
            )}

            {/* 9. TAB: CONTRIBUTIONS */}
            {activeTab === 'contributions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Research Output Repository
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      Submitted Proposals &amp; Prototypes
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsContributionModalOpen(true)}
                    className="px-4 py-2 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                  >
                    + Record Institutional Contribution
                  </button>
                </div>

                <div className="space-y-4">
                  {store.contributions.map((cnt) => (
                    <div
                      key={cnt.id}
                      className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 shadow-2xs space-y-3 text-xs font-outfit"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#176B5B] bg-[#DCEFEA] px-2 py-0.5 rounded mr-2">
                            {cnt.problemId}
                          </span>
                          <span className="font-semibold text-[#5C726E]">{cnt.type}</span>
                          <h4 className="font-syne text-base font-bold text-[#1F2A28] mt-1">{cnt.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <StatusBadge status={cnt.status} size="xs" />
                          <span className="text-xs font-bold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded border border-[#BFD9D2]/70">
                            {cnt.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#1F2A28]/80 leading-relaxed bg-[#F7FAF9] p-3 rounded-xl border border-[#BFD9D2]/50">
                        {cnt.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#5C726E]">
                        <span>
                          <strong>Author:</strong> {cnt.authorName} ({cnt.authorRole} • {cnt.authorUniversity})
                        </span>
                        <div className="flex items-center gap-3">
                          <span>{cnt.submissionDate}</span>
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

            {/* 10. TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                      Broadcast Stream
                    </span>
                    <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                      System &amp; Government Alerts
                    </h2>
                  </div>
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
                      <p className="text-xs text-[#5C726E] mt-1.5 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. TAB: UNIVERSITY PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#BFD9D2]/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                    Institutional Credentials
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#1F2A28]">
                    University Profile &amp; Accreditation
                  </h2>
                </div>

                <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#176B5B] text-white font-syne text-2xl font-bold flex items-center justify-center">
                      AU
                    </div>
                    <div>
                      <h3 className="font-syne text-xl font-bold text-[#1F2A28]">
                        {userProfile.university || 'Anna University, Chennai'}
                      </h3>
                      <p className="text-xs text-[#5C726E]">
                        State Affiliated Premier Technical University • Code: AU-CHE
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#DCEFEA] text-[#176B5B] text-xs font-bold">
                        NAAC A++ Accredited • SETU Node Hub
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#BFD9D2]/50">
                    <div className="p-3.5 bg-[#F7FAF9] rounded-xl space-y-1">
                      <span className="text-[#5C726E] font-semibold block">Designated Admin:</span>
                      <span className="font-bold text-[#1F2A28] text-sm">{userProfile.name || 'Dr. R. Sundaram'}</span>
                    </div>
                    <div className="p-3.5 bg-[#F7FAF9] rounded-xl space-y-1">
                      <span className="text-[#5C726E] font-semibold block">Official Admin Email:</span>
                      <span className="font-bold text-[#1F2A28] text-sm">{userProfile.email || 'admin.setu@annauniv.edu'}</span>
                    </div>
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
        onClose={() => setIsContributionModalOpen(false)}
        authorizedProblems={store.problems}
        currentUser={userProfile}
        currentRole="admin"
        onSubmitContribution={(data) => {
          store.addContribution(data)
          showToast('Contribution successfully recorded and published!')
        }}
      />
    </UniversityDashboardLayout>
  )
}

export default AdminDashboard
