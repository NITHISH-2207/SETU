import { useState } from 'react'
import UniversityDashboardLayout from './UniversityDashboardLayout.jsx'
import StatCard from './components/StatCard.jsx'
import ProblemCard from './components/ProblemCard.jsx'
import ProblemDetailModal from './components/ProblemDetailModal.jsx'
import TeamCard from './components/TeamCard.jsx'
import ContributionModal from './components/ContributionModal.jsx'
import TimeFilterStats from './components/TimeFilterStats.jsx'
import StatusBadge from './components/StatusBadge.jsx'
import { useUniversityDashboardStore } from './useUniversityDashboardStore.js'

function MentorDashboard({ userProfile = {}, onLogout }) {
  const store = useUniversityDashboardStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProblem, setSelectedProblem] = useState(null)
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

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'matching', label: 'Matching Problems', icon: '🎯', badge: matchingProblems.length },
    { id: 'accepted', label: 'Accepted Problems', icon: '✅', badge: acceptedProblems.length },
    { id: 'teams', label: 'Mentees & Teams', icon: '👥', badge: totalMenteesCount },
    { id: 'projects', label: 'Research Projects', icon: '🚀', badge: acceptedProblems.length },
    { id: 'contributions', label: 'Research Contributions', icon: '📑', badge: mentorContributions.length },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: store.notifications.filter((n) => !n.isRead).length || null },
    { id: 'profile', label: 'Faculty Profile', icon: '🎓' },
  ]

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

  return (
    <UniversityDashboardLayout
      roleType="mentor"
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
                  className="px-4 py-2.5 bg-[#E07A4E] text-white hover:bg-[#C9663D] rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                >
                  Explore Matching Problems ({matchingProblems.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedProblemId(acceptedProblems[0]?.id || null)
                    setIsContributionModalOpen(true)
                  }}
                  className="px-4 py-2.5 bg-white text-[#176B5B] hover:bg-[#F7FAF9] rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
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
                subtitle="In your domain &amp; department"
                icon={<span className="text-xl">🎯</span>}
                trend="Live matches"
                trendPositive={true}
                colorScheme="primary"
                onClick={() => setActiveTab('matching')}
              />
              <StatCard
                title="Accepted Problems"
                value={acceptedProblems.length}
                subtitle="1/1 Lead Mentor Slots Held"
                icon={<span className="text-xl">✅</span>}
                trend={`${acceptedProblems.length} Active`}
                trendPositive={true}
                colorScheme="soft"
                onClick={() => setActiveTab('accepted')}
              />
              <StatCard
                title="Supervised Mentees"
                value={totalMenteesCount}
                subtitle="Students across active teams"
                icon={<span className="text-xl">👥</span>}
                trend="Max 5 / problem"
                trendPositive={true}
                colorScheme="accent"
                onClick={() => setActiveTab('teams')}
              />
              <StatCard
                title="Research Contributions"
                value={mentorContributions.length}
                subtitle="Filed reports &amp; evaluations"
                icon={<span className="text-xl">📑</span>}
                trend="Verified"
                trendPositive={true}
                colorScheme="primary"
                onClick={() => setActiveTab('contributions')}
              />
            </div>

            {/* Time-Based Statistics Component (7d / 1m / 3m / 6m / 1y) */}
            <TimeFilterStats role="mentor" />

            {/* Active Commitments Overview */}
            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-4">
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
                      className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-3"
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
                          onClick={() => setSelectedProblem(prob)}
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

        {/* ====================================================
            2. TAB: MATCHING PROBLEMS (Domain Matched)
            ==================================================== */}
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
                  onViewDetails={setSelectedProblem}
                  onAccept={(p) => handleAcceptProblem(p.id)}
                  onDecline={(p) => handleDeclineProblem(p.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            3. TAB: ACCEPTED PROBLEMS
            ==================================================== */}
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
                  onViewDetails={setSelectedProblem}
                  onDecline={(p) => handleDeclineProblem(p.id)}
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

        {/* ====================================================
            4. TAB: MENTEES & TEAMS
            ==================================================== */}
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
                  onOpenProblem={setSelectedProblem}
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

        {/* ====================================================
            5. TAB: RESEARCH PROJECTS (Dedicated Projects Tab)
            ==================================================== */}
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
                      <span className="text-[#5C726E]">Location:</span>
                      <span className="font-bold text-[#1F2A28]">{prob.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C726E]">Student Team:</span>
                      <span className="font-semibold text-[#176B5B]">{prob.assignedStudentIds?.length || 0}/5 Students Joined</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5C726E]">Contributions Filed:</span>
                      <span className="font-bold text-[#1F2A28]">{prob.contributionsCount || 0} Submissions</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-[#BFD9D2]/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5C726E]">Research Milestone Progress:</span>
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

              {acceptedProblems.length === 0 && (
                <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                  No active projects currently under your mentorship.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            6. TAB: CONTRIBUTIONS (Authorized Problems Only)
            ==================================================== */}
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
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                ⚠️ You must accept at least one research problem before submitting technical proposals or findings.
              </div>
            )}

            <div className="space-y-4">
              {mentorContributions.map((cnt) => (
                <div
                  key={cnt.id}
                  className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-3 text-xs"
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

                  <div className="flex items-center justify-between text-[11px] text-[#5C726E]">
                    <span>📅 {cnt.submissionDate}</span>
                    <span className="text-[#176B5B] font-bold">{cnt.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            7. TAB: NOTIFICATIONS
            ==================================================== */}
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

        {/* ====================================================
            8. TAB: FACULTY PROFILE
            ==================================================== */}
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
              <div className="p-3 bg-[#F7FAF9] rounded-xl">
                <span className="text-[#5C726E] font-semibold block">University:</span>
                <span className="font-bold text-[#1F2A28] text-sm">{userProfile.university || 'IIT Madras'}</span>
              </div>
              <div className="p-3 bg-[#F7FAF9] rounded-xl">
                <span className="text-[#5C726E] font-semibold block">Email / Contact:</span>
                <span className="font-bold text-[#1F2A28] text-sm">{userProfile.email || 'narayanan.mentor@iitm.ac.in'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problem Detail Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        currentRole="mentor"
        currentUserId={currentMentorId}
        onAcceptMentor={handleAcceptProblem}
        onDeclineMentor={handleDeclineProblem}
        onOpenContribution={handleOpenContributionForProblem}
      />

      {/* Contribution Modal (Scoped to Authorized Problems) */}
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
