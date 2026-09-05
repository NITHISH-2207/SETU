import { useState, useEffect } from 'react'
import {
  INITIAL_GOVERNMENT_PROBLEMS,
  INITIAL_APPROVAL_REQUESTS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_NOTIFICATIONS,
  ALL_MENTORS,
  ALL_STUDENTS,
  DASHBOARD_UNIVERSITIES,
  DASHBOARD_DEPARTMENTS,
  TIME_BASED_STATISTICS,
} from './universityDashboardData.js'

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function useUniversityDashboardStore() {
  // 1. Problems State
  const [problems, setProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROBLEMS)
      return saved ? JSON.parse(saved) : INITIAL_GOVERNMENT_PROBLEMS
    } catch {
      return INITIAL_GOVERNMENT_PROBLEMS
    }
  })

  // 2. Approvals State
  const [approvals, setApprovals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS)
      return saved ? JSON.parse(saved) : INITIAL_APPROVAL_REQUESTS
    } catch {
      return INITIAL_APPROVAL_REQUESTS
    }
  })

  // 3. Contributions State
  const [contributions, setContributions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS)
      return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS
    } catch {
      return INITIAL_CONTRIBUTIONS
    }
  })

  // 4. Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS
    } catch {
      return INITIAL_NOTIFICATIONS
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems))
    } catch {}
  }, [problems])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals))
    } catch {}
  }, [approvals])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions))
    } catch {}
  }, [contributions])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    } catch {}
  }, [notifications])

  // ==========================================
  // Problem Actions (1 Mentor + 5 Students Constraint)
  // ==========================================

  const acceptProblemAsMentor = (problemId, mentorId) => {
    let success = false
    let message = ''

    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id !== problemId) return prob

        // Constraint check: Max 1 Mentor
        if (prob.assignedMentorId && prob.assignedMentorId !== mentorId) {
          message = 'This problem already has an assigned mentor (1/1 Slot Full).'
          return prob
        }

        success = true
        message = 'Successfully adopted research problem as Faculty Mentor!'
        return {
          ...prob,
          assignedMentorId: mentorId,
          status: prob.status === 'OPEN' ? 'IN_PROGRESS' : prob.status,
          workflowStage: prob.workflowStage === 'Awaiting Faculty & Student Adoption' ? 'Faculty Assigned & Project Initiated' : prob.workflowStage,
          progressPercentage: prob.progressPercentage === 0 ? 25 : prob.progressPercentage,
        }
      })
    )

    if (success) {
      addNotification({
        title: 'Faculty Mentor Assigned',
        message: `A mentor has accepted and assumed leadership for problem ${problemId}.`,
        type: 'team_update',
        problemId,
      })
    }

    return { success, message }
  }

  const declineProblemAsMentor = (problemId, mentorId) => {
    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id !== problemId) return prob
        if (prob.assignedMentorId === mentorId) {
          return {
            ...prob,
            assignedMentorId: null,
            status: prob.assignedStudentIds.length === 0 ? 'OPEN' : prob.status,
          }
        }
        return prob
      })
    )
    return { success: true, message: 'Relinquished mentor assignment for this problem.' }
  }

  const joinProblemAsStudent = (problemId, studentId) => {
    let success = false
    let message = ''

    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id !== problemId) return prob

        if (prob.assignedStudentIds.includes(studentId)) {
          message = 'You are already an active team member on this problem.'
          return prob
        }

        // Constraint check: Max 5 Students
        if (prob.assignedStudentIds.length >= 5) {
          message = 'Student team is already full (5/5 Slots Occupied).'
          return prob
        }

        success = true
        const updatedStudentIds = [...prob.assignedStudentIds, studentId]
        message = `Successfully joined problem team (${updatedStudentIds.length}/5 students).`

        return {
          ...prob,
          assignedStudentIds: updatedStudentIds,
          status: prob.status === 'OPEN' ? 'IN_PROGRESS' : prob.status,
          workflowStage: prob.workflowStage === 'Awaiting Faculty & Student Adoption' ? 'Student Team Assembling' : prob.workflowStage,
          progressPercentage: prob.progressPercentage === 0 ? 20 : prob.progressPercentage,
        }
      })
    )

    if (success) {
      addNotification({
        title: 'Student Joined Research Problem',
        message: `A new student has joined problem ${problemId}. Team slot is now active.`,
        type: 'team_update',
        problemId,
      })
    }

    return { success, message }
  }

  const leaveProblemAsStudent = (problemId, studentId) => {
    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id !== problemId) return prob
        const updated = prob.assignedStudentIds.filter((id) => id !== studentId)
        return {
          ...prob,
          assignedStudentIds: updated,
          status: updated.length === 0 && !prob.assignedMentorId ? 'OPEN' : prob.status,
        }
      })
    )
    return { success: true, message: 'Left the problem team.' }
  }

  // ==========================================
  // Approval Queue Actions
  // ==========================================

  const approveRequest = (requestId) => {
    setApprovals((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'APPROVED' } : req))
    )
    addNotification({
      title: 'Registration Approved',
      message: `Registration request ${requestId} has been officially approved by University Administration.`,
      type: 'approval_req',
    })
  }

  const rejectRequest = (requestId) => {
    setApprovals((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'REJECTED' } : req))
    )
    addNotification({
      title: 'Registration Rejected',
      message: `Registration request ${requestId} has been marked as rejected.`,
      type: 'approval_req',
    })
  }

  const resetRequestToPending = (requestId) => {
    setApprovals((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'PENDING' } : req))
    )
  }

  // ==========================================
  // Contribution Actions
  // ==========================================

  const addContribution = (contributionData) => {
    const newId = generateId('cnt')
    const newEntry = {
      id: newId,
      submissionDate: `Just now • ${getFormattedDate()}`,
      status: 'UNDER_ADMIN_REVIEW',
      rating: 'Submitted (Pending Verification)',
      attachments: contributionData.attachments || [
        { name: `${contributionData.title.slice(0, 20).replace(/\s+/g, '_')}_document.pdf`, size: '2.1 MB' },
      ],
      ...contributionData,
    }

    setContributions((prev) => [newEntry, ...prev])

    // Update problem contribution count
    setProblems((prev) =>
      prev.map((prob) => {
        if (prob.id === contributionData.problemId) {
          return {
            ...prob,
            contributionsCount: (prob.contributionsCount || 0) + 1,
            progressPercentage: Math.min(100, (prob.progressPercentage || 20) + 15),
          }
        }
        return prob
      })
    )

    addNotification({
      title: 'New Contribution Submitted',
      message: `${contributionData.authorName} (${contributionData.authorRole}) submitted "${contributionData.title}" for problem ${contributionData.problemId}.`,
      type: 'contribution',
      problemId: contributionData.problemId,
    })

    return newEntry
  }

  // ==========================================
  // Notification Actions
  // ==========================================

  const addNotification = ({ title, message, type = 'system', problemId }) => {
    const newNotif = {
      id: generateId('notif'),
      title,
      message,
      timestamp: 'Just now',
      type,
      isRead: false,
      problemId,
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  const markNotificationAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  // ==========================================
  // Helper Resolvers
  // ==========================================

  const getMentorById = (mentorId) => ALL_MENTORS.find((m) => m.id === mentorId) || null

  const getStudentById = (studentId) => ALL_STUDENTS.find((s) => s.id === studentId) || null

  const getEnrichedProblem = (prob) => {
    const assignedMentor = prob.assignedMentorId ? getMentorById(prob.assignedMentorId) : null
    const assignedStudents = (prob.assignedStudentIds || []).map((id) => getStudentById(id)).filter(Boolean)
    const isMentorSlotFull = Boolean(prob.assignedMentorId)
    const studentSlotsCount = assignedStudents.length
    const isStudentSlotsFull = studentSlotsCount >= 5
    const isTeamComplete = isMentorSlotFull && isStudentSlotsFull

    return {
      ...prob,
      assignedMentor,
      assignedStudents,
      isMentorSlotFull,
      studentSlotsCount,
      isStudentSlotsFull,
      isTeamComplete,
    }
  }

  const enrichedProblems = problems.map(getEnrichedProblem)

  return {
    problems: enrichedProblems,
    rawProblems: problems,
    approvals,
    contributions,
    notifications,
    mentors: ALL_MENTORS,
    students: ALL_STUDENTS,
    universities: DASHBOARD_UNIVERSITIES,
    departments: DASHBOARD_DEPARTMENTS,
    timeStatistics: TIME_BASED_STATISTICS,

    // Actions
    acceptProblemAsMentor,
    declineProblemAsMentor,
    joinProblemAsStudent,
    leaveProblemAsStudent,
    approveRequest,
    rejectRequest,
    resetRequestToPending,
    addContribution,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getMentorById,
    getStudentById,
  }
}
