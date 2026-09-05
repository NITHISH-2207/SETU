import { useState } from 'react'
import UniversityDashboardLayout from './UniversityDashboardLayout.jsx'
import StatCard from './components/StatCard.jsx'
import StatusBadge from './components/StatusBadge.jsx'
import ProblemCard from './components/ProblemCard.jsx'
import ProblemDetailModal from './components/ProblemDetailModal.jsx'
import TeamCard from './components/TeamCard.jsx'
import ContributionModal from './components/ContributionModal.jsx'
import { useUniversityDashboardStore } from './useUniversityDashboardStore.js'

function AdminDashboard({ userProfile = {}, onLogout }) {
  const store = useUniversityDashboardStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProblem, setSelectedProblem] = useState(null)
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

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'problems', label: 'Government Problems', icon: '🏛️', badge: store.problems.length },
    { id: 'approvals', label: 'Registration Approvals', icon: '📝', badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} New` : null },
    { id: 'mentors', label: 'Faculty Mentors', icon: '🎓', badge: store.mentors.length },
    { id: 'students', label: 'Student Innovators', icon: '💡', badge: store.students.length },
    { id: 'departments', label: 'Academic Departments', icon: '🏢', badge: store.departments.length },
    { id: 'teams', label: 'Problem Teams', icon: '👥', badge: activeTeamsCount },
    { id: 'projects', label: 'Research Projects', icon: '🚀', badge: activeProjects.length },
    { id: 'contributions', label: 'Research Contributions', icon: '📑', badge: store.contributions.length },
    { id: 'notifications', label: 'System Alerts', icon: '🔔', badge: store.notifications.filter((n) => !n.isRead).length || null },
    { id: 'profile', label: 'University Profile', icon: '🏛️' },
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

  return (
    <UniversityDashboardLayout
      roleType="admin"
      userProfile={userProfile}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navItems={navItems}
      notifications={store.notifications}
      onMarkNotificationRead={store.markNotificationAsRead}
      onMarkAllNotificationsRead={store.markAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div className="space-y-6 font-outfit animate-fade-in relative">
        {/* Feedback Toast */}
        {feedbackToast && (
          <div
            className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold animate-fade-in ${
              feedbackToast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
            }`}
          >
            <span>{feedbackToast.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* ====================================================
            1. TAB: OVERVIEW
            ==================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
                  className="px-4 py-2.5 bg-[#E07A4E] text-white hover:bg-[#C9663D] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
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
                icon={<span className="text-xl">🏛️</span>}
                trend="+2 this week"
                trendPositive={true}
                colorScheme="primary"
                onClick={() => setActiveTab('problems')}
              />
              <StatCard
                title="Active Teams"
                value={activeTeamsCount}
                subtitle="1 Mentor + Max 5 Students"
                icon={<span className="text-xl">👥</span>}
                trend="100% capacity in 1 team"
                trendPositive={true}
                colorScheme="soft"
                onClick={() => setActiveTab('teams')}
              />
              <StatCard
                title="Pending Approvals"
                value={pendingApprovalsCount}
                subtitle="Faculty & Student Registrations"
                icon={<span className="text-xl">📝</span>}
                trend={pendingApprovalsCount > 0 ? 'Requires action' : 'All clear'}
                trendPositive={pendingApprovalsCount === 0}
                colorScheme="accent"
                onClick={() => setActiveTab('approvals')}
              />
              <StatCard
                title="Contributions Filed"
                value={store.contributions.length}
                subtitle="Research reports & prototypes"
                icon={<span className="text-xl">📑</span>}
                trend="+1 new output"
                trendPositive={true}
                colorScheme="primary"
                onClick={() => setActiveTab('contributions')}
              />
            </div>

            {/* End-to-End Workflow Visualization Banner */}
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

              {/* Stepper Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                  <span className="font-bold text-[#176B5B] block">01. Govt Dispatch</span>
                  <p className="text-[11px] text-[#5C726E]">Problem received with domain metadata and evidence.</p>
                </div>
                <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1">
                  <span className="font-bold text-[#176B5B] block">02. Domain Match</span>
                  <p className="text-[11px] text-[#5C726E]">Automatic routing to relevant departments &amp; faculty.</p>
                </div>
                <div className="p-3 bg-[#DCEFEA]/60 border border-[#176B5B]/30 rounded-xl space-y-1">
                  <span className="font-bold text-[#176B5B] block">03. Mentor (1/1)</span>
                  <p className="text-[11px] text-[#176B5B]">1 Lead Mentor claims &amp; locks the problem slot.</p>
                </div>
                <div className="p-3 bg-[#DCEFEA]/60 border border-[#176B5B]/30 rounded-xl space-y-1">
                  <span className="font-bold text-[#176B5B] block">04. Students (≤5)</span>
                  <p className="text-[11px] text-[#176B5B]">Up to 5 student researchers assemble project team.</p>
                </div>
                <div className="p-3 bg-[#E07A4E]/10 border border-[#E07A4E]/30 rounded-xl space-y-1">
                  <span className="font-bold text-[#E07A4E] block">05. Contributions</span>
                  <p className="text-[11px] text-[#1F2A28]">Prototypes &amp; findings submitted for verification.</p>
                </div>
              </div>
            </div>

            {/* Quick Action Tables: Recent Government Problems & Pending Approvals */}
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
                      onClick={() => setSelectedProblem(prob)}
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
                      className="p-3 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-[#1F2A28]">{req.name}</p>
                          <p className="text-[11px] text-[#5C726E]">{req.roleLabel} • {req.department}</p>
                        </div>
                        <StatusBadge status={req.status} size="xs" />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#BFD9D2]/40">
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
                  ))}

                  {pendingApprovalsCount === 0 && (
                    <div className="p-6 text-center text-xs text-[#5C726E]">
                      ✓ All faculty and student registrations are up to date.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            2. TAB: GOVERNMENT PROBLEMS
            ==================================================== */}
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
                  className="px-3.5 py-2 text-xs bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] w-48 sm:w-60"
                />

                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
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
                  onViewDetails={setSelectedProblem}
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

        {/* ====================================================
            3. TAB: APPROVALS QUEUE (Interactive State)
            ==================================================== */}
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
                  className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4 text-xs font-outfit"
                >
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
                    <StatusBadge status={req.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#F7FAF9] rounded-xl text-[11px]">
                    <div>
                      <span className="text-[#5C726E] block font-semibold">Affiliation:</span>
                      <span className="text-[#1F2A28] font-bold truncate block">{req.university}</span>
                    </div>
                    <div>
                      <span className="text-[#5C726E] block font-semibold">Submitted Date:</span>
                      <span className="text-[#1F2A28]">{req.registrationDate}</span>
                    </div>
                    {req.experience && (
                      <div>
                        <span className="text-[#5C726E] block font-semibold">Experience:</span>
                        <span className="text-[#1F2A28] font-bold">{req.experience}</span>
                      </div>
                    )}
                    {req.yearOfStudy && (
                      <div>
                        <span className="text-[#5C726E] block font-semibold">Study Level:</span>
                        <span className="text-[#1F2A28] font-bold">{req.yearOfStudy}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5C726E] block mb-1">Declared Competencies:</span>
                    <div className="flex flex-wrap gap-1">
                      {(req.skills || req.domains || []).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white text-[#176B5B] text-[10px] font-semibold border border-[#BFD9D2]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#BFD9D2]/50 flex items-center justify-between">
                    <span className="text-[11px] text-[#5C726E]">
                      Current Status: <strong>{req.status}</strong>
                    </span>

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
                      {req.status !== 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => store.resetRequestToPending(req.id)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#5C726E] font-medium rounded-lg cursor-pointer transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            4. TAB: FACULTY MENTORS DIRECTORY
            ==================================================== */}
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
                <div key={m.id} className="bg-white border border-[#BFD9D2] rounded-2xl p-5 shadow-2xs space-y-3">
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
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            5. TAB: STUDENT INNOVATORS DIRECTORY
            ==================================================== */}
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
                <div key={s.id} className="bg-white border border-[#BFD9D2] rounded-2xl p-4 shadow-2xs space-y-2">
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
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            6. TAB: ACADEMIC DEPARTMENTS (Dedicated Department Tab)
            ==================================================== */}
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
                        <span className="font-syne text-lg font-bold text-[#E07A4E]">{matchedProblems.length}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ====================================================
            7. TAB: TEAMS (1 Mentor + 5 Students Constraint)
            ==================================================== */}
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
                  onOpenProblem={setSelectedProblem}
                  currentRole="admin"
                />
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            8. TAB: RESEARCH PROJECTS (Dedicated Projects Tab)
            ==================================================== */}
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
                  className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4 font-outfit"
                >
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

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#BFD9D2]/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5C726E]">Execution Progress:</span>
                      <span className="font-bold text-[#176B5B]">{prob.progressPercentage || 25}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#176B5B] to-[#E07A4E] rounded-full"
                        style={{ width: `${prob.progressPercentage || 25}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            9. TAB: CONTRIBUTIONS REPOSITORY
            ==================================================== */}
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
                  className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-3 text-xs font-outfit"
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
                      <span className="text-xs font-bold text-[#E07A4E] px-2 py-0.5 bg-[#E07A4E]/10 rounded border border-[#E07A4E]/30">
                        {cnt.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#1F2A28]/80 leading-relaxed bg-[#F7FAF9] p-3 rounded-xl border border-[#BFD9D2]/50">
                    {cnt.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[#5C726E]">
                    <span>
                      ✍️ <strong>Author:</strong> {cnt.authorName} ({cnt.authorRole} • {cnt.authorUniversity})
                    </span>
                    <span>📅 {cnt.submissionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            10. TAB: NOTIFICATIONS
            ==================================================== */}
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

        {/* ====================================================
            11. TAB: UNIVERSITY PROFILE
            ==================================================== */}
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
                <div className="p-3 bg-[#F7FAF9] rounded-xl">
                  <span className="text-[#5C726E] font-semibold block">Designated Admin:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{userProfile.name || 'Dr. R. Sundaram'}</span>
                </div>
                <div className="p-3 bg-[#F7FAF9] rounded-xl">
                  <span className="text-[#5C726E] font-semibold block">Official Admin Email:</span>
                  <span className="font-bold text-[#1F2A28] text-sm">{userProfile.email || 'admin.setu@annauniv.edu'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        currentRole="admin"
        onOpenContribution={() => setIsContributionModalOpen(true)}
      />

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
