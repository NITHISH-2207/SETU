import { useState, useRef, useEffect } from 'react'
import { useUniversityDashboardStore } from './useUniversityDashboardStore.js'

// ============================================================================
// 1. UNIFIED SETU PRIORITY BADGE (GREEN BADGE + SUBTLE PULSING DOT ONLY)
// ============================================================================
function PriorityBadge({ priority, size = 'sm', className = '' }) {
  const norm = (priority || '').toUpperCase()

  const getDotColor = () => {
    switch (norm) {
      case 'CRITICAL':
        return 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.9)]'
      case 'HIGH':
        return 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)]'
      case 'MEDIUM':
        return 'bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.9)]'
      case 'LOW':
      default:
        return 'bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.9)]'
    }
  }

  const getLabel = () => {
    switch (norm) {
      case 'CRITICAL':
        return 'CRITICAL'
      case 'HIGH':
        return 'HIGH'
      case 'MEDIUM':
        return 'MEDIUM'
      case 'LOW':
        return 'LOW'
      default:
        return (priority || 'NORMAL').toUpperCase()
    }
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-2.5 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#176B5B] text-white border border-[#125649] ${sizeClasses} ${className} select-none tracking-wide`}
    >
      <span className={`w-2 h-2 rounded-full ${getDotColor()} animate-pulse shrink-0`} />
      <span className="whitespace-nowrap">{getLabel()}</span>
    </span>
  )
}

// ============================================================================
// 2. UNIFIED SETU STATUS BADGE (CLEAN MINT SURFACE + FOREST GREEN TEXT)
// ============================================================================
function UnifiedStatusBadge({ status, size = 'sm', className = '' }) {
  const norm = (status || '').toUpperCase().replace(/\s+/g, '_')

  const getLabel = () => {
    switch (norm) {
      case 'APPROVED':
        return 'Approved'
      case 'ACTIVE':
        return 'Active'
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'SUBMITTED':
      case 'AWAITING_MENTOR_REVIEW':
        return 'Submitted (Under Mentor Review)'
      case 'REJECTED':
        return 'Rejected (Feedback Available)'
      case 'OPEN':
        return 'Open for Team'
      case 'SLOTS_FULL':
      case 'TEAM_FULL':
        return 'Team Slots Full (5/5)'
      case 'COMPLETED':
        return 'Completed'
      default:
        return status || 'Active'
    }
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-2.5 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2] ${sizeClasses} ${className} select-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] shrink-0" />
      <span className="whitespace-nowrap">{getLabel()}</span>
    </span>
  )
}

// ============================================================================
// 3. INITIAL MOCK IDEAS WITH MULTI-STAGE REVIEW HISTORY
// ============================================================================
const INITIAL_STUDENT_IDEAS = [
  {
    id: 'idea-301',
    projectId: 'SETU-PRJ-301',
    problemId: 'SETU-GOV-RES-301',
    problemTitle: 'Heavy Metal & Dye Contamination in Noyyal River Industrial Stretch',
    title: 'IoT Multi-Sensor Turbidity & Total Dissolved Solids Telemetry Node',
    description:
      'Solar-powered ESP32 floating telemetry buoy with optical turbidity probe, pH sensor, and GPS for continuous industrial discharge tracking.',
    proposedSolution:
      'Deploy in-situ edge-processing telemetry nodes along 12km industrial discharge stretch transmitting live metrics via GSM MQTT to municipal control center.',
    expectedImpact:
      'Immediate 90-second automated alert dispatch to TNPCB when heavy metal discharge exceeds permissible thresholds.',
    technologies: 'ESP32, LoRaWAN, GSM/MQTT, Python, FastAPI, React',
    attachment: { name: 'IoT_Telemetry_Buoy_Schematic_v2.pdf', size: '3.2 MB' },
    authorId: 's1',
    authorName: 'Kavitha R.',
    submissionDate: '03 Sep 2026',
    status: 'APPROVED',
    mentorReview: {
      mentorName: 'Prof. K. Narayanan',
      mentorId: 'MNT-2045',
      approvedDate: '04 Sep 2026',
      feedback:
        'Hardware architecture and telemetry specifications meet TNPCB pilot standards. Approved for phase-2 field trials.',
    },
    reviewHistory: [
      {
        event: 'Submitted',
        date: '03 Sep 2026',
        note: 'Initial proposal and circuit schematics submitted by student team.',
      },
      {
        event: 'Under Mentor Review',
        date: '04 Sep 2026',
        note: 'Faculty lead Prof. K. Narayanan initiated technical feasibility audit.',
      },
      {
        event: 'Approved',
        date: '04 Sep 2026',
        note: 'Approved by Prof. K. Narayanan for live pilot instrumentation.',
      },
    ],
  },
  {
    id: 'idea-302',
    projectId: 'SETU-PRJ-301',
    problemId: 'SETU-GOV-RES-301',
    problemTitle: 'Heavy Metal & Dye Contamination in Noyyal River Industrial Stretch',
    title: 'Multi-Stage Nano-Cellulose Composite Filtration Column for Textile Azo-Dyes',
    description:
      'Eco-friendly biodegradable nano-cellulose membranes infused with activated biochar from agricultural stubble to adsorb synthetic dyes.',
    proposedSolution:
      'Design modular gravity-fed filtration columns that can be installed directly at small-scale textile dyeing unit effluent outlets.',
    expectedImpact:
      '88% reduction in chemical oxygen demand (COD) and 94% removal of synthetic azo-dyes prior to river entry.',
    technologies: 'Nano-Cellulose Synthesis, Biochar Activation, Spectrophotometry, Python Analytics',
    attachment: { name: 'Nano_Cellulose_Membrane_Design.pdf', size: '4.8 MB' },
    authorId: 's1',
    authorName: 'Kavitha R.',
    submissionDate: '05 Sep 2026',
    status: 'SUBMITTED',
    mentorReview: null,
    reviewHistory: [
      {
        event: 'Submitted',
        date: '05 Sep 2026',
        note: 'Submitted for mentor review and lab access authorization.',
      },
      {
        event: 'Awaiting Mentor Review',
        date: '05 Sep 2026',
        note: 'Assigned to faculty mentor Prof. K. Narayanan for review.',
      },
    ],
  },
  {
    id: 'idea-303',
    projectId: 'SETU-PRJ-302',
    problemId: 'SETU-GOV-RES-302',
    problemTitle: 'Edge-AI Microgrid Inverter Balancing for High-Density Rooftop Solar',
    title: 'Deep Q-Network Reactive Power Control for 11kV Radial Feeders',
    description:
      'Reinforcement learning algorithm running on edge microcontrollers to balance voltage fluctuations caused by intermittent cloud cover.',
    proposedSolution:
      'Train a DQN agent on IEEE 33-bus benchmark data to adjust smart inverter power factors in real-time.',
    expectedImpact:
      'Prevent overvoltage trips across 450 residential rooftop solar installations.',
    technologies: 'Python, PyTorch, MATLAB/Simulink, IEEE 33-Bus System',
    attachment: { name: 'DQN_Volt_VAR_Control_Spec.pdf', size: '2.1 MB' },
    authorId: 's1',
    authorName: 'Kavitha R.',
    submissionDate: '02 Sep 2026',
    status: 'REJECTED',
    mentorReview: {
      mentorName: 'Dr. Priya Sundararajan',
      mentorId: 'MNT-1082',
      rejectedDate: '03 Sep 2026',
      rejectionReason:
        'Please provide detailed mathematical stability proofs for the Lyapunov function under extreme feeder loading before lab simulation.',
    },
    reviewHistory: [
      {
        event: 'Submitted',
        date: '02 Sep 2026',
        note: 'Initial proposal submitted for edge-AI microgrid balancing.',
      },
      {
        event: 'Under Mentor Review',
        date: '03 Sep 2026',
        note: 'Reviewed by Dr. Priya Sundararajan.',
      },
      {
        event: 'Rejected',
        date: '03 Sep 2026',
        note: 'Reason: Please provide detailed mathematical stability proofs for the Lyapunov function under extreme feeder loading before lab simulation.',
      },
    ],
  },
]

// ============================================================================
// 4. MAIN UNIVERSITY STUDENT DASHBOARD COMPONENT
// ============================================================================
function StudentDashboard({ userProfile = {}, onLogout }) {
  const store = useUniversityDashboardStore()

  // Navigation and dedicated detail view states
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'matching' | 'my-teams' | 'projects' | 'ideas' | 'notifications' | 'profile'
  const [viewingProblemDetail, setViewingProblemDetail] = useState(null)
  const [viewingTeamDetail, setViewingTeamDetail] = useState(null)
  const [viewingResearchDetail, setViewingResearchDetail] = useState(null)
  const [viewingIdeaDetail, setViewingIdeaDetail] = useState(null)

  // Header Dropdowns
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isSubmitIdeaOpen, setIsSubmitIdeaOpen] = useState(false)
  const [isEditIdeaOpen, setIsEditIdeaOpen] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectingIdeaId, setRejectingIdeaId] = useState(null)
  const [rejectionReasonText, setRejectionReasonText] = useState('')

  // Toast feedback
  const [feedbackToast, setFeedbackToast] = useState(null)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Refs
  const notifRef = useRef(null)
  const accountRef = useRef(null)
  const photoInputRef = useRef(null)
  const ideaFileInputRef = useRef(null)
  const editIdeaFileInputRef = useRef(null)

  const currentStudentId = userProfile.id || 's1'

  // --------------------------------------------------------------------------
  // Profile State (with LocalStorage prototype persistence)
  // --------------------------------------------------------------------------
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('setu_student_profile_data')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // ignore parse error
      }
    }
    return {
      // Personal Information (Editable)
      name: userProfile.name || 'Kavitha R.',
      phone: userProfile.phone || '+91 98451 23456',
      dob: userProfile.dob || '2004-05-14',
      gender: userProfile.gender || 'Female',
      email: userProfile.email || 'kavitha.student@annauniv.edu', // Disabled

      // Academic Information (Controlled by University Admin - Read Only)
      university: userProfile.university || 'Anna University, Chennai',
      department: userProfile.department || 'Computer Science & Engineering (AI/Data)',
      degree: userProfile.degree || 'B.Tech Information Technology',
      yearOfStudy: userProfile.yearOfStudy || '3rd Year (6th Semester)',
      registerNo: userProfile.registerNo || '23IT123',

      // Address (Editable)
      address: userProfile.address || 'No. 42, Sardar Patel Road, Guindy',
      city: userProfile.city || 'Chennai',
      district: userProfile.district || 'Chennai',
      state: userProfile.state || 'Tamil Nadu',
      pincode: userProfile.pincode || '600025',

      // Professional Information (Editable)
      github: userProfile.github || 'https://github.com/kavitha-innovator',
      linkedin: userProfile.linkedin || 'https://linkedin.com/in/kavitha-r-setu',
      portfolio: userProfile.portfolio || 'https://kavitha-dev.setu.edu',
      skills: userProfile.skills || 'Python, Java, Machine Learning, IoT, GIS & Spatial Mapping',
      interests: userProfile.interests || 'Water Quality, AI, Environmental Monitoring, Smart Mobility',
      photoUrl: userProfile.photoUrl || null,
    }
  })

  // --------------------------------------------------------------------------
  // Ideas State (with LocalStorage prototype persistence)
  // --------------------------------------------------------------------------
  const [studentIdeas, setStudentIdeas] = useState(() => {
    const saved = localStorage.getItem('setu_student_ideas_data')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // ignore parse error
      }
    }
    return INITIAL_STUDENT_IDEAS
  })

  // Persist ideas to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('setu_student_ideas_data', JSON.stringify(studentIdeas))
    } catch {}
  }, [studentIdeas])

  // --------------------------------------------------------------------------
  // Idea Submission Form State
  // --------------------------------------------------------------------------
  const [newIdeaForm, setNewIdeaForm] = useState({
    title: '',
    problemId: 'SETU-GOV-RES-301',
    description: '',
    proposedSolution: '',
    expectedImpact: '',
    technologies: '',
    selectedFile: null,
  })

  // --------------------------------------------------------------------------
  // Password Change Form State
  // --------------------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')

  // --------------------------------------------------------------------------
  // Click outside listener for dropdowns
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifMenuOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-mark active section as read
  const { markSectionAsRead } = store
  useEffect(() => {
    markSectionAsRead('student', activeTab)
  }, [activeTab, markSectionAsRead])

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type })
    setTimeout(() => setFeedbackToast(null), 3500)
  }

  // --------------------------------------------------------------------------
  // Derived Data
  // --------------------------------------------------------------------------
  const matchingProblems = store.problems.filter(
    (p) =>
      (p.matchingStudentIds || []).includes(currentStudentId) ||
      (p.assignedStudentIds || []).includes(currentStudentId)
  )

  const myJoinedProblems = store.problems.filter((p) =>
    (p.assignedStudentIds || []).includes(currentStudentId)
  )

  const unreadNotifsCount = store.notifications.filter((n) => !n.isRead).length

  // Filtered matching problems
  const filteredProblems = matchingProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.researchRequired?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const uniqueCategories = Array.from(new Set(matchingProblems.map((p) => p.category)))

  // Helper to construct shared Project ID from Problem ID
  const getProjectIdForProblem = (problemId) => {
    const suffix = (problemId || '301').split('-').pop()
    return `SETU-PRJ-${suffix}`
  }

  // --------------------------------------------------------------------------
  // Team Join / Leave Handlers
  // --------------------------------------------------------------------------
  const handleJoinProblem = (problemId) => {
    const res = store.joinProblemAsStudent(problemId, currentStudentId)
    if (res.success) {
      showToast('Successfully joined problem team (1 Mentor + Max 5 Students).')
    } else {
      showToast(res.message, 'error')
    }
  }

  const handleLeaveProblem = (problemId) => {
    const res = store.leaveProblemAsStudent(problemId, currentStudentId)
    if (res.success) {
      showToast('Successfully left the problem team.')
      if (viewingProblemDetail?.id === problemId) {
        setViewingProblemDetail((prev) => (prev ? { ...prev, assignedStudentIds: (prev.assignedStudentIds || []).filter((id) => id !== currentStudentId) } : null))
      }
    } else {
      showToast(res.message || 'Updated team status.', 'success')
    }
  }

  // --------------------------------------------------------------------------
  // Navigation & Detail Views
  // --------------------------------------------------------------------------
  const clearDetailViews = () => {
    setViewingProblemDetail(null)
    setViewingTeamDetail(null)
    setViewingResearchDetail(null)
    setViewingIdeaDetail(null)
  }

  const handleOpenProblemDetail = (problem) => {
    clearDetailViews()
    setViewingProblemDetail(problem)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenTeamDetail = (problem) => {
    clearDetailViews()
    setViewingTeamDetail(problem)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenResearchDetail = (problem) => {
    clearDetailViews()
    setViewingResearchDetail(problem)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenIdeaDetail = (idea) => {
    clearDetailViews()
    setViewingIdeaDetail(idea)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNotificationClick = (notif) => {
    store.markNotificationAsRead(notif.id)
    setNotifMenuOpen(false)
    if (notif.problemId) {
      const match = store.problems.find((p) => p.id === notif.problemId) || store.problems[0]
      if (match) {
        handleOpenProblemDetail(match)
      }
    } else {
      setActiveTab('notifications')
      clearDetailViews()
    }
  }

  // --------------------------------------------------------------------------
  // Profile Photo Upload / Remove (Real Laptop File Picker)
  // --------------------------------------------------------------------------
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be less than 5MB.', 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        const newUrl = event.target.result
        setProfileData((prev) => {
          const updated = { ...prev, photoUrl: newUrl }
          localStorage.setItem('setu_student_profile_data', JSON.stringify(updated))
          return updated
        })
        showToast('Profile photo updated successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfileData((prev) => {
      const updated = { ...prev, photoUrl: null }
      localStorage.setItem('setu_student_profile_data', JSON.stringify(updated))
      return updated
    })
    if (photoInputRef.current) photoInputRef.current.value = ''
    showToast('Profile photo removed.')
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    localStorage.setItem('setu_student_profile_data', JSON.stringify(profileData))
    showToast('Student profile changes saved successfully!')
  }

  // --------------------------------------------------------------------------
  // Password Change Handler
  // --------------------------------------------------------------------------
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordError('')
    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsChangePasswordOpen(false)
    showToast('Password updated successfully!')
  }

  // --------------------------------------------------------------------------
  // Ideas Management (Submit, Edit, Delete, Mentor Review Simulation)
  // --------------------------------------------------------------------------
  const handleFileSelection = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`
      setNewIdeaForm((prev) => ({
        ...prev,
        selectedFile: { name: file.name, size: sizeStr },
      }))
    }
  }

  const handleRemoveIdeaFile = () => {
    setNewIdeaForm((prev) => ({ ...prev, selectedFile: null }))
    if (ideaFileInputRef.current) ideaFileInputRef.current.value = ''
  }

  const handleSubmitIdea = (e) => {
    e.preventDefault()
    if (!newIdeaForm.title.trim()) {
      showToast('Please enter an idea title.', 'error')
      return
    }
    if (!newIdeaForm.description.trim()) {
      showToast('Please enter a description.', 'error')
      return
    }

    const problemObj = store.problems.find((p) => p.id === newIdeaForm.problemId) || store.problems[0]
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const newIdea = {
      id: `idea-${Math.floor(100 + Math.random() * 900)}`,
      projectId: getProjectIdForProblem(problemObj.id),
      problemId: problemObj.id,
      problemTitle: problemObj.title,
      title: newIdeaForm.title.trim(),
      description: newIdeaForm.description.trim(),
      proposedSolution: newIdeaForm.proposedSolution.trim() || 'Comprehensive technical execution plan.',
      expectedImpact: newIdeaForm.expectedImpact.trim() || 'Societal benefit and measurable efficiency gain.',
      technologies: newIdeaForm.technologies.trim() || 'Python, IoT, React, Data Analytics',
      attachment: newIdeaForm.selectedFile || { name: 'Technical_Proposal_Doc.pdf', size: '1.8 MB' },
      authorId: currentStudentId,
      authorName: profileData.name,
      submissionDate: dateFormatted,
      status: 'SUBMITTED',
      mentorReview: null,
      reviewHistory: [
        {
          event: 'Submitted',
          date: dateFormatted,
          note: 'Initial idea submission filed by student innovator.',
        },
        {
          event: 'Under Mentor Review',
          date: dateFormatted,
          note: `Queued for evaluation under faculty mentor lead.`,
        },
      ],
    }

    setStudentIdeas((prev) => [newIdea, ...prev])
    setNewIdeaForm({
      title: '',
      problemId: myJoinedProblems[0]?.id || 'SETU-GOV-RES-301',
      description: '',
      proposedSolution: '',
      expectedImpact: '',
      technologies: '',
      selectedFile: null,
    })
    setIsSubmitIdeaOpen(false)
    showToast('Idea proposal submitted successfully!')
  }

  const handleDeleteIdea = (ideaId) => {
    setStudentIdeas((prev) => prev.filter((i) => i.id !== ideaId))
    if (viewingIdeaDetail?.id === ideaId) {
      setViewingIdeaDetail(null)
    }
    showToast('Idea proposal deleted.')
  }

  const handleOpenEditIdea = (idea) => {
    setEditingIdea(idea)
    setIsEditIdeaOpen(true)
  }

  const handleSaveEditedIdea = (e) => {
    e.preventDefault()
    if (!editingIdea) return

    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const updated = {
      ...editingIdea,
      status: 'SUBMITTED',
      mentorReview: null,
      reviewHistory: [
        ...editingIdea.reviewHistory,
        {
          event: 'Resubmitted',
          date: dateFormatted,
          note: 'Revised proposal resubmitted by student after incorporating feedback.',
        },
      ],
    }

    setStudentIdeas((prev) => prev.map((i) => (i.id === editingIdea.id ? updated : i)))
    if (viewingIdeaDetail?.id === editingIdea.id) {
      setViewingIdeaDetail(updated)
    }
    setIsEditIdeaOpen(false)
    setEditingIdea(null)
    showToast('Idea resubmitted successfully for mentor review!')
  }

  // Mentor Review Simulation Actions (for demonstration)
  const handleApproveIdea = (ideaId) => {
    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    setStudentIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== ideaId) return idea
        const updated = {
          ...idea,
          status: 'APPROVED',
          mentorReview: {
            mentorName: 'Prof. K. Narayanan',
            mentorId: 'MNT-2045',
            approvedDate: dateFormatted,
            feedback: 'Technical methodology verified and approved for prototype development.',
          },
          reviewHistory: [
            ...idea.reviewHistory,
            {
              event: 'Approved',
              date: dateFormatted,
              note: 'Approved by Prof. K. Narayanan (Mentor Lead).',
            },
          ],
        }
        if (viewingIdeaDetail?.id === ideaId) setViewingIdeaDetail(updated)
        return updated
      })
    )
    showToast('Idea proposal approved by faculty mentor!')
  }

  const handleOpenRejectModal = (ideaId) => {
    setRejectingIdeaId(ideaId)
    setRejectionReasonText('')
    setIsRejectModalOpen(true)
  }

  const handleConfirmRejectIdea = () => {
    if (!rejectionReasonText.trim() || !rejectingIdeaId) return

    const dateFormatted = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    setStudentIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== rejectingIdeaId) return idea
        const updated = {
          ...idea,
          status: 'REJECTED',
          mentorReview: {
            mentorName: 'Prof. K. Narayanan',
            mentorId: 'MNT-2045',
            rejectedDate: dateFormatted,
            rejectionReason: rejectionReasonText.trim(),
          },
          reviewHistory: [
            ...idea.reviewHistory,
            {
              event: 'Rejected',
              date: dateFormatted,
              note: `Reason: ${rejectionReasonText.trim()}`,
            },
          ],
        }
        if (viewingIdeaDetail?.id === rejectingIdeaId) setViewingIdeaDetail(updated)
        return updated
      })
    )

    setIsRejectModalOpen(false)
    setRejectingIdeaId(null)
    setRejectionReasonText('')
    showToast('Idea rejected with mentor feedback.', 'error')
  }

  // Sync viewing problem detail with latest store state
  const currentDetailProblem = viewingProblemDetail
    ? store.problems.find((p) => p.id === viewingProblemDetail.id) || viewingProblemDetail
    : null

  // --------------------------------------------------------------------------
  // EXACT 6 HORIZONTAL NAVIGATION TABS (ONE LINE LABELS ONLY)
  // --------------------------------------------------------------------------
  const navTabs = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: (
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
      count: store.isSectionRead('student', 'matching') ? undefined : matchingProblems.length,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      id: 'my-teams',
      label: 'Teams',
      count: store.isSectionRead('student', 'my-teams') ? undefined : myJoinedProblems.length,
      icon: (
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
      label: 'Research',
      count: store.isSectionRead('student', 'projects') ? undefined : myJoinedProblems.length,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'ideas',
      label: 'Ideas',
      count: store.isSectionRead('student', 'ideas') ? undefined : studentIdeas.length,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Alerts',
      count: store.isSectionRead('student', 'notifications') ? undefined : unreadNotifsCount,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    },
  ]

  // Team Member Roster helper for Problem/Project
  const getProblemTeamRoster = (problem) => {
    const mentor = problem.assignedMentor || {
      name: 'Prof. K. Narayanan',
      id: 'MNT-2045',
      department: 'Civil & Environmental Engineering',
      university: 'IIT Madras',
    }

    const students = [
      { name: 'Kavitha R.', registerNo: '23IT123', department: 'CSE (AI/Data)', year: '3rd Year' },
      { name: 'Vignesh M.', registerNo: '23IT145', department: 'Civil & Env', year: '4th Year' },
      { name: 'Ananya Sharma', registerNo: '23IT156', department: 'Civil & Env', year: 'M.Tech 2nd Year' },
      { name: 'Rahul Krishna', registerNo: '23IT178', department: 'CSE (AI/Data)', year: '3rd Year' },
      { name: 'Arvind Swaminathan', registerNo: '23IT192', department: 'EEE', year: '3rd Year' },
    ]

    const assignedCount = Math.min(5, Math.max(1, (problem.assignedStudentIds || []).length || 5))
    return {
      mentor,
      students: students.slice(0, assignedCount),
      totalSlots: 5,
      activeCount: assignedCount,
    }
  }

  return (
    <div
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
      className="min-h-screen bg-[#FFFFFF] text-[#1F2A28] flex flex-col selection:bg-[#DCEFEA] selection:text-[#176B5B]"
    >
      {/* ====================================================================
          TOP NAVIGATION BAR (Times New Roman, Single Line, No Emojis)
          ==================================================================== */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-[#BFD9D2]/70 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Left: Brand Identity & Portal Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  clearDetailViews()
                  setActiveTab('overview')
                }}
                className="flex items-center gap-2.5 text-left focus:outline-hidden group cursor-pointer"
              >
                <span className="text-3xl font-bold tracking-tight text-[#176B5B] group-hover:opacity-90">
                  SETU
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
                  Student Portal
                </span>
              </button>
            </div>

            {/* Center: Horizontal Navigation (6 Tabs, Single Line Labels) */}
            <nav className="hidden lg:flex items-center gap-1.5 whitespace-nowrap">
              {navTabs.map((tab) => {
                const isActive =
                  activeTab === tab.id &&
                  !viewingProblemDetail &&
                  !viewingTeamDetail &&
                  !viewingResearchDetail &&
                  !viewingIdeaDetail
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      clearDetailViews()
                      setActiveTab(tab.id)
                      store.markSectionAsRead('student', tab.id)
                      if (tab.id === 'notifications') {
                        store.markAllNotificationsAsRead()
                      }
                      window.scrollTo({ top: 0, behavior: 'instant' })
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#176B5B] text-white shadow-xs'
                        : 'bg-white text-[#1F2A28]/85 hover:text-[#176B5B] hover:bg-[#DCEFEA]/40 border border-transparent hover:border-[#BFD9D2]/60'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-[#5C726E]'}>{tab.icon}</span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-xs px-1.5 py-0.2 rounded-full font-bold whitespace-nowrap ${
                          isActive ? 'bg-white/25 text-white' : 'bg-[#DCEFEA] text-[#176B5B]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Right: Notification Bell + Student Account Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Notification Icon & Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                  className="relative p-2.5 rounded-xl border border-[#BFD9D2] bg-white hover:bg-[#F7FAF9] text-[#5C726E] hover:text-[#176B5B] transition-colors cursor-pointer"
                  aria-label="View notifications"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#176B5B] text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#BFD9D2] rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-[#BFD9D2]/50">
                      <span className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                        Recent Alerts
                      </span>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={() => store.markAllNotificationsAsRead()}
                          className="text-xs text-[#176B5B] hover:underline font-semibold cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                      {store.notifications.length > 0 ? (
                        store.notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                              notif.isRead
                                ? 'bg-white border-[#BFD9D2]/60 text-[#5C726E]'
                                : 'bg-[#DCEFEA]/30 border-[#176B5B]/30 text-[#1F2A28] font-medium'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-bold text-sm text-[#1F2A28]">{notif.title}</p>
                              <span className="text-xs text-[#5C726E] shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-[#5C726E] mt-1 leading-snug">{notif.message}</p>
                            <span className="inline-block mt-1.5 text-xs text-[#176B5B] font-bold hover:underline">
                              Inspect Alert →
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-[#5C726E]">No notifications.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Account Button & Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F7FAF9] border border-[#BFD9D2] cursor-pointer transition-colors"
                >
                  {profileData.photoUrl ? (
                    <img
                      src={profileData.photoUrl}
                      alt={profileData.name}
                      className="w-9 h-9 rounded-lg object-cover border border-[#176B5B]/40"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#176B5B] text-white font-bold text-sm flex items-center justify-center">
                      {(profileData.name || 'KR').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-sm font-bold text-[#1F2A28] truncate max-w-[130px]">
                      {profileData.name}
                    </p>
                    <p className="text-xs text-[#5C726E] truncate max-w-[130px]">
                      {profileData.registerNo || '23IT123'}
                    </p>
                  </div>
                </button>

                {/* Account Dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#BFD9D2] rounded-2xl shadow-xl z-50 p-3 space-y-1.5 text-sm animate-fade-in">
                    <div className="p-2.5 border-b border-[#BFD9D2]/50">
                      <p className="font-bold text-base text-[#1F2A28]">{profileData.name}</p>
                      <p className="text-[#5C726E] text-xs truncate">{profileData.email}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] font-bold text-xs">
                        Student Account ({profileData.registerNo || '23IT123'})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        clearDetailViews()
                        setActiveTab('profile')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#1F2A28] hover:bg-[#F7FAF9] hover:text-[#176B5B] font-medium transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-4 h-4 text-[#5C726E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>View / Edit Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        setIsChangePasswordOpen(true)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#1F2A28] hover:bg-[#F7FAF9] hover:text-[#176B5B] font-medium transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-4 h-4 text-[#5C726E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>Change Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        onLogout?.()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#176B5B] hover:bg-[#DCEFEA]/40 font-bold transition-colors cursor-pointer border-t border-[#BFD9D2]/50 pt-2 text-left"
                    >
                      <svg className="w-4 h-4 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#5C726E] hover:text-[#1F2A28] hover:bg-[#F7FAF9] border border-[#BFD9D2] cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-[#BFD9D2]/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navTabs.map((tab) => {
                const isActive =
                  activeTab === tab.id &&
                  !viewingProblemDetail &&
                  !viewingTeamDetail &&
                  !viewingResearchDetail &&
                  !viewingIdeaDetail
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      clearDetailViews()
                      setActiveTab(tab.id)
                      setMobileMenuOpen(false)
                      store.markSectionAsRead('student', tab.id)
                      window.scrollTo({ top: 0, behavior: 'instant' })
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#176B5B] text-white shadow-xs'
                        : 'text-[#1F2A28]/80 hover:text-[#176B5B] hover:bg-[#F7FAF9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isActive ? 'text-white' : 'text-[#5C726E]'}>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#DCEFEA] text-[#176B5B]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {/* ====================================================================
          MAIN CONTENT PANE (Times New Roman, Spacious, Clean)
          ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Feedback Toast */}
        {feedbackToast && (
          <div
            className={`fixed top-22 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-semibold animate-fade-in ${
              feedbackToast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{feedbackToast.message}</span>
          </div>
        )}

        {/* ====================================================================
            VIEW: DEDICATED IN-PAGE PROBLEM DETAIL VIEW
            ==================================================================== */}
        {currentDetailProblem ? (
          <div className="space-y-6 animate-fade-in">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingProblemDetail(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Problems</span>
              </button>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={currentDetailProblem.severity} size="xs" />
                <UnifiedStatusBadge status={currentDetailProblem.status} size="xs" />
              </div>
            </div>

            {/* Problem Overview Card */}
            <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold text-[#176B5B] bg-[#DCEFEA] border border-[#BFD9D2]/60">
                    {currentDetailProblem.id}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold text-[#176B5B] bg-[#DCEFEA] border border-[#BFD9D2]/60">
                    {currentDetailProblem.category}
                  </span>
                  <span className="text-xs text-[#5C726E] font-medium">
                    Project ID: {getProjectIdForProblem(currentDetailProblem.id)}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] leading-snug tracking-tight">
                  {currentDetailProblem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#5C726E] pt-1">
                  <span><strong>Location:</strong> {currentDetailProblem.location}</span>
                  <span>•</span>
                  <span><strong>Issued by:</strong> {currentDetailProblem.submittedBy}</span>
                  <span>•</span>
                  <span><strong>Received:</strong> {currentDetailProblem.dateReceived}</span>
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                  Context &amp; Societal Need
                </h3>
                <p className="text-base text-[#1F2A28]/90 leading-relaxed bg-[#F7FAF9] p-5 rounded-xl border border-[#BFD9D2]/60">
                  {currentDetailProblem.description}
                </p>
              </div>

              {/* Research Focus & Domain Match */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 bg-white border border-[#BFD9D2]/80 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                    Research Core &amp; Objectives
                  </h4>
                  <p className="text-sm font-medium text-[#1F2A28] leading-relaxed">
                    {currentDetailProblem.researchRequired}
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#BFD9D2]/80 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                    Why This Matches Your Profile
                  </h4>
                  <p className="text-sm font-medium text-[#1F2A28] leading-relaxed">
                    {currentDetailProblem.matchingReason || 'Matched based on your declared department competencies.'}
                  </p>
                </div>
              </div>

              {/* Milestone Progress Bar (Single-color SETU Green, No Gradient) */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{currentDetailProblem.workflowStage} ({currentDetailProblem.progressPercentage || 25}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#176B5B] rounded-full transition-all duration-500"
                    style={{ width: `${currentDetailProblem.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              {/* Team Slots & Members (1 Mentor + Max 5 Students) */}
              <div className="space-y-4 pt-4 border-t border-[#BFD9D2]/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#1F2A28] tracking-tight">
                    Project Team Structure (1 Mentor + Maximum 5 Students)
                  </h3>
                  <span className="text-sm font-bold text-[#176B5B]">
                    Project ID: {getProjectIdForProblem(currentDetailProblem.id)}
                  </span>
                </div>

                {/* Faculty Mentor */}
                <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E] block">
                      Faculty Mentor Lead
                    </span>
                    <p className="font-bold text-base text-[#1F2A28] mt-0.5">
                      {currentDetailProblem.assignedMentor ? currentDetailProblem.assignedMentor.name : 'Prof. K. Narayanan'}
                    </p>
                    <p className="text-xs text-[#5C726E]">
                      Mentor ID: MNT-2045 • {currentDetailProblem.assignedMentor?.department || 'Civil & Environmental Engineering'} • {currentDetailProblem.assignedMentor?.university || 'IIT Madras'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#DCEFEA] text-[#176B5B]">
                    1/1 Mentor Slot Assigned
                  </span>
                </div>

                {/* Students Roster with Register Numbers */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E] block">
                    Student Team Members ({(currentDetailProblem.assignedStudentIds || []).length}/5 Slots):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {getProblemTeamRoster(currentDetailProblem).students.map((student, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-white border border-[#BFD9D2] rounded-xl text-sm space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#1F2A28]">{student.name}</p>
                          <span className="text-xs font-semibold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                            Slot {idx + 1}/5
                          </span>
                        </div>
                        <p className="text-xs text-[#5C726E]">Register No: {student.registerNo}</p>
                        <p className="text-xs text-[#5C726E]">{student.department}</p>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 5 - getProblemTeamRoster(currentDetailProblem).students.length) }).map((_, idx) => (
                      <div
                        key={`empty-slot-${idx}`}
                        className="p-3.5 bg-[#F7FAF9]/60 border border-dashed border-[#BFD9D2] rounded-xl flex items-center justify-center text-xs text-[#5C726E]"
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
                  className="px-5 py-2.5 text-sm font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer transition-colors"
                >
                  ← Back to List
                </button>

                <div className="flex items-center gap-3">
                  {(currentDetailProblem.assignedStudentIds || []).includes(currentStudentId) ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleLeaveProblem(currentDetailProblem.id)}
                        className="px-4 py-2.5 rounded-xl border border-[#BFD9D2] bg-[#DCEFEA] hover:bg-[#cbe6df] text-[#176B5B] text-sm font-bold cursor-pointer transition-colors"
                      >
                        Leave Team
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewIdeaForm((prev) => ({ ...prev, problemId: currentDetailProblem.id }))
                          setIsSubmitIdeaOpen(true)
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-sm font-bold shadow-2xs cursor-pointer transition-all"
                      >
                        Submit Idea / Output →
                      </button>
                    </>
                  ) : (currentDetailProblem.assignedStudentIds || []).length >= 5 ? (
                    <span className="px-5 py-2.5 rounded-xl bg-gray-100 text-[#5C726E] border border-gray-200 text-sm font-semibold select-none">
                      Team Slots Full (5/5)
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleJoinProblem(currentDetailProblem.id)}
                      className="px-7 py-3 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-sm font-bold shadow-xs cursor-pointer transition-all"
                    >
                      Join Problem Team ({(currentDetailProblem.assignedStudentIds || []).length}/5) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : viewingTeamDetail ? (
          /* ====================================================================
              VIEW: DEDICATED TEAM DETAILS VIEW
              ==================================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingTeamDetail(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Teams</span>
              </button>

              <UnifiedStatusBadge status="ACTIVE" size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Project ID: {getProjectIdForProblem(viewingTeamDetail.id)}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Problem ID: {viewingTeamDetail.id}
                  </span>
                  <span className="text-xs text-[#5C726E] font-bold">
                    Members: {getProblemTeamRoster(viewingTeamDetail).students.length + 1}/6 Total (1 Mentor + 5 Students)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                  {viewingTeamDetail.title}
                </h1>
                <p className="text-sm text-[#5C726E]">
                  Domain: {viewingTeamDetail.category} • Location: {viewingTeamDetail.location}
                </p>
              </div>

              {/* Faculty Mentor Lead */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] block">
                  Faculty Mentor Lead
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2A28]">
                      {getProblemTeamRoster(viewingTeamDetail).mentor.name}
                    </h3>
                    <p className="text-xs text-[#5C726E]">
                      Mentor Roll/ID: {getProblemTeamRoster(viewingTeamDetail).mentor.id} • {getProblemTeamRoster(viewingTeamDetail).mentor.department} • {getProblemTeamRoster(viewingTeamDetail).mentor.university}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#DCEFEA] text-[#176B5B]">
                    Certified Lead
                  </span>
                </div>
              </div>

              {/* Student Members Roster */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                  Student Innovators (Shared Project ID: {getProjectIdForProblem(viewingTeamDetail.id)})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {getProblemTeamRoster(viewingTeamDetail).students.map((student, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-[#BFD9D2] rounded-xl space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-[#1F2A28]">{student.name}</p>
                        <span className="text-xs font-bold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                          Slot {idx + 1}/5
                        </span>
                      </div>
                      <p className="text-xs text-[#5C726E]">Register No: {student.registerNo}</p>
                      <p className="text-xs text-[#5C726E]">{student.department}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Progress */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Project Progress</span>
                  <span className="font-semibold text-[#1F2A28]">{viewingTeamDetail.progressPercentage || 25}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#176B5B] rounded-full transition-all duration-500"
                    style={{ width: `${viewingTeamDetail.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingTeamDetail(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Teams
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewIdeaForm((prev) => ({ ...prev, problemId: viewingTeamDetail.id }))
                    setIsSubmitIdeaOpen(true)
                  }}
                  className="px-6 py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-sm font-bold shadow-2xs cursor-pointer transition-colors"
                >
                  + Submit Idea / Output
                </button>
              </div>
            </div>
          </div>
        ) : viewingResearchDetail ? (
          /* ====================================================================
              VIEW: DEDICATED RESEARCH DETAILS VIEW
              ==================================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingResearchDetail(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Research</span>
              </button>

              <UnifiedStatusBadge status={viewingResearchDetail.workflowStage || 'IN_PROGRESS'} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Project ID: {getProjectIdForProblem(viewingResearchDetail.id)}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Problem ID: {viewingResearchDetail.id}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                  {viewingResearchDetail.title}
                </h1>
                <p className="text-sm text-[#5C726E]">
                  Research Area: {viewingResearchDetail.researchRequired}
                </p>
              </div>

              {/* Research Methodology */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] block">
                  Problem Context &amp; Objective
                </span>
                <p className="text-base text-[#1F2A28]/85 leading-relaxed bg-[#F7FAF9] p-5 rounded-xl border border-[#BFD9D2]/60">
                  {viewingResearchDetail.description}
                </p>
              </div>

              {/* Progress Bar (Green Only) */}
              <div className="p-5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#176B5B] uppercase tracking-wider">Milestone Execution</span>
                  <span className="font-semibold text-[#1F2A28]">{viewingResearchDetail.progressPercentage || 25}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#176B5B] rounded-full transition-all duration-500"
                    style={{ width: `${viewingResearchDetail.progressPercentage || 25}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingResearchDetail(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Research
                </button>
              </div>
            </div>
          </div>
        ) : viewingIdeaDetail ? (
          /* ====================================================================
              VIEW: DEDICATED IDEA DETAILS & REVIEW HISTORY VIEW
              ==================================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => setViewingIdeaDetail(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Ideas</span>
              </button>

              <UnifiedStatusBadge status={viewingIdeaDetail.status} size="xs" />
            </div>

            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="space-y-2 pb-4 border-b border-[#BFD9D2]/60">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Project ID: {viewingIdeaDetail.projectId || 'SETU-PRJ-301'}
                  </span>
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/60">
                    Problem: {viewingIdeaDetail.problemId}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                  {viewingIdeaDetail.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#5C726E] pt-1">
                  <span><strong>Author:</strong> {viewingIdeaDetail.authorName}</span>
                  <span>•</span>
                  <span><strong>Submitted:</strong> {viewingIdeaDetail.submissionDate}</span>
                </div>
              </div>

              {/* Idea Formulation & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                    Problem Formulation &amp; Description
                  </h4>
                  <p className="text-sm text-[#1F2A28] leading-relaxed">
                    {viewingIdeaDetail.description}
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#BFD9D2] rounded-xl space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                    Proposed Solution &amp; Impact
                  </h4>
                  <p className="text-sm text-[#1F2A28] leading-relaxed">
                    {viewingIdeaDetail.proposedSolution}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-1.5 text-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                  Technologies / Skills Involved:
                </span>
                <p className="font-semibold text-[#1F2A28]">{viewingIdeaDetail.technologies}</p>
              </div>

              {/* Actual Attachment Details */}
              {viewingIdeaDetail.attachment && (
                <div className="p-4 bg-white border border-[#BFD9D2] rounded-xl flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center font-bold text-xs">
                      DOC
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2A28]">{viewingIdeaDetail.attachment.name}</p>
                      <p className="text-xs text-[#5C726E]">{viewingIdeaDetail.attachment.size}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#176B5B] px-3 py-1 bg-[#DCEFEA] rounded-md">
                    Verified Attachment
                  </span>
                </div>
              )}

              {/* Mentor Review Feedback (If Approved or Rejected) */}
              {viewingIdeaDetail.status === 'APPROVED' && viewingIdeaDetail.mentorReview && (
                <div className="p-5 bg-[#DCEFEA]/40 border border-[#176B5B]/30 rounded-xl space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#176B5B]">
                      Approved by {viewingIdeaDetail.mentorReview.mentorName}
                    </span>
                    <span className="text-xs text-[#5C726E]">
                      {viewingIdeaDetail.mentorReview.approvedDate}
                    </span>
                  </div>
                  <p className="text-sm text-[#1F2A28]">
                    {viewingIdeaDetail.mentorReview.feedback || 'This idea has been officially approved into the research workflow.'}
                  </p>
                  <p className="text-xs text-[#5C726E] italic">
                    Note: Approved ideas are locked and cannot be edited or deleted.
                  </p>
                </div>
              )}

              {viewingIdeaDetail.status === 'REJECTED' && viewingIdeaDetail.mentorReview && (
                <div className="p-5 bg-red-50/70 border border-red-200 rounded-xl space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-red-800">
                      Mentor Feedback (Reviewed by {viewingIdeaDetail.mentorReview.mentorName})
                    </span>
                    <span className="text-xs text-red-600">
                      {viewingIdeaDetail.mentorReview.rejectedDate}
                    </span>
                  </div>
                  <p className="text-sm text-red-900 font-medium bg-white p-3 rounded-lg border border-red-200">
                    "{viewingIdeaDetail.mentorReview.rejectionReason}"
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditIdea(viewingIdeaDetail)}
                      className="px-4 py-2 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit &amp; Resubmit Proposal →
                    </button>
                  </div>
                </div>
              )}

              {/* Review History Timeline */}
              <div className="space-y-3 pt-4 border-t border-[#BFD9D2]/60">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#176B5B]">
                  Review History Timeline
                </h3>
                <div className="space-y-3">
                  {(viewingIdeaDetail.reviewHistory || []).map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#176B5B] mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1F2A28]">{entry.event}</span>
                          <span className="text-xs text-[#5C726E]">({entry.date})</span>
                        </div>
                        <p className="text-xs text-[#5C726E]">{entry.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idea Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setViewingIdeaDetail(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#5C726E] hover:bg-gray-50 border border-[#BFD9D2] rounded-xl cursor-pointer"
                >
                  ← Back to Ideas
                </button>

                <div className="flex items-center gap-3">
                  {viewingIdeaDetail.status === 'SUBMITTED' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDeleteIdea(viewingIdeaDetail.id)}
                        className="px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl cursor-pointer transition-colors"
                      >
                        Delete Proposal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditIdea(viewingIdeaDetail)}
                        className="px-4 py-2.5 text-xs font-bold text-[#176B5B] bg-[#DCEFEA] hover:bg-[#cbe6df] border border-[#BFD9D2] rounded-xl cursor-pointer transition-colors"
                      >
                        Edit Proposal
                      </button>
                      {/* Simulation Controls for Demonstration */}
                      <button
                        type="button"
                        onClick={() => handleApproveIdea(viewingIdeaDetail.id)}
                        className="px-4 py-2.5 text-xs font-bold text-white bg-[#176B5B] hover:bg-[#125649] rounded-xl shadow-2xs cursor-pointer transition-colors"
                      >
                        Mentor: Approve Idea
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRejectModal(viewingIdeaDetail.id)}
                        className="px-4 py-2.5 text-xs font-bold text-white bg-[#125649] hover:bg-[#0F473C] rounded-xl shadow-2xs cursor-pointer transition-colors"
                      >
                        Mentor: Reject with Reason
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
              MAIN TABS (DASHBOARD, PROBLEMS, TEAMS, RESEARCH, IDEAS, ALERTS, PROFILE)
              ==================================================================== */
          <>
            {/* ----------------------------------------------------------------
                1. TAB: DASHBOARD HOME
                ---------------------------------------------------------------- */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* Clean Hero Card */}
                <div className="bg-white border border-[#BFD9D2]/80 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-3">
                  <span className="text-xs font-bold tracking-wider uppercase text-[#176B5B] bg-[#DCEFEA] px-3 py-1 rounded-md border border-[#BFD9D2]/70 inline-block">
                    Student Innovation Workspace
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2A28]">
                    Welcome back, {profileData.name}
                  </h1>
                  <p className="text-sm sm:text-base text-[#5C726E] max-w-2xl leading-relaxed">
                    Discover verified societal research opportunities, collaborate in multidisciplinary teams under certified faculty mentors, and build solutions that matter.
                  </p>
                </div>

                {/* Compact Statistics Grid (4 Clean Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveTab('matching')}
                    className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[#176B5B]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">Problems</span>
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-[#176B5B]">{matchingProblems.length}</p>
                    <p className="text-xs text-[#5C726E]">Available in domain</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('my-teams')}
                    className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[#176B5B]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">Teams</span>
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-[#1F2A28]">{myJoinedProblems.length}</p>
                    <p className="text-xs text-[#5C726E]">Active team slots</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('projects')}
                    className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[#176B5B]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">Research</span>
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-[#1F2A28]">{myJoinedProblems.length}</p>
                    <p className="text-xs text-[#5C726E]">Guided projects</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('ideas')}
                    className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-5 shadow-2xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[#176B5B]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">Ideas</span>
                      <svg className="w-5 h-5 text-[#176B5B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-[#1F2A28]">{studentIdeas.length}</p>
                    <p className="text-xs text-[#5C726E]">Submissions &amp; outputs</p>
                  </div>
                </div>

                {/* Recommended Problems (Minimal, Compact Information Only) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#1F2A28] tracking-tight">
                        Recommended Problems
                      </h2>
                      <p className="text-sm text-[#5C726E]">
                        Civic challenges aligned with your department competencies.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('matching')}
                      className="text-sm font-bold text-[#176B5B] hover:underline cursor-pointer"
                    >
                      View All ({matchingProblems.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {matchingProblems.slice(0, 2).map((problem) => {
                      const studentCount = (problem.assignedStudentIds || []).length
                      return (
                        <div
                          key={problem.id}
                          className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-4 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/60">
                                {problem.id}
                              </span>
                              <PriorityBadge priority={problem.severity} size="xs" />
                            </div>
                            <p className="text-xs text-[#5C726E] font-semibold">{problem.category}</p>
                            <h3 className="text-lg font-bold text-[#1F2A28] leading-snug">
                              {problem.title}
                            </h3>
                            <p className="text-sm text-[#5C726E] line-clamp-2 leading-relaxed">
                              {problem.description}
                            </p>
                          </div>

                          <div className="p-3 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/50 text-xs flex items-center justify-between text-[#5C726E]">
                            <span>Mentor: <strong className="text-[#1F2A28]">{problem.assignedMentor ? problem.assignedMentor.name : 'Prof. K. Narayanan'}</strong></span>
                            <span className="font-bold text-[#176B5B]">{studentCount}/5 Team</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#BFD9D2]/50">
                            <button
                              type="button"
                              onClick={() => handleOpenProblemDetail(problem)}
                              className="text-sm font-bold text-[#176B5B] hover:underline cursor-pointer"
                            >
                              View Details →
                            </button>
                            <span className="text-xs text-[#5C726E]">
                              Project: {getProjectIdForProblem(problem.id)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------
                2. TAB: PROBLEMS (COMPACT PROBLEM CARDS)
                ---------------------------------------------------------------- */}
            {activeTab === 'matching' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/60">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                      Matching Problems
                    </h1>
                    <p className="text-sm text-[#5C726E] mt-0.5">
                      Curated challenges matched to your department and domain.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search problem..."
                      className="px-3.5 py-2 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] w-48 sm:w-60 shadow-2xs"
                    />

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] shadow-2xs"
                    >
                      <option value="ALL">All Categories</option>
                      {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProblems.map((problem) => {
                    const studentCount = (problem.assignedStudentIds || []).length
                    const isJoined = (problem.assignedStudentIds || []).includes(currentStudentId)

                    return (
                      <div
                        key={problem.id}
                        className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4 transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/60">
                              {problem.id}
                            </span>
                            <PriorityBadge priority={problem.severity} size="xs" />
                          </div>

                          <p className="text-xs text-[#5C726E] font-semibold">{problem.category}</p>

                          <h3 className="text-lg font-bold text-[#1F2A28] leading-snug tracking-tight">
                            {problem.title}
                          </h3>

                          <p className="text-sm text-[#5C726E] line-clamp-2 leading-relaxed">
                            {problem.description}
                          </p>
                        </div>

                        <div className="p-3.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#5C726E]">
                              Mentor: <strong className="text-[#1F2A28]">{problem.assignedMentor ? problem.assignedMentor.name : 'Prof. K. Narayanan'}</strong>
                            </span>
                            <span className="text-[#176B5B] font-bold">
                              Team: {studentCount}/5
                            </span>
                          </div>
                          <p className="text-xs text-[#5C726E] pt-1 border-t border-[#BFD9D2]/40">
                            Project ID: <strong className="text-[#1F2A28]">{getProjectIdForProblem(problem.id)}</strong>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#BFD9D2]/50">
                          <button
                            type="button"
                            onClick={() => handleOpenProblemDetail(problem)}
                            className="text-sm font-bold text-[#176B5B] hover:underline cursor-pointer"
                          >
                            View Details →
                          </button>

                          {isJoined ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#176B5B] px-3 py-1.5 bg-[#DCEFEA] rounded-lg">
                              Joined Team
                            </span>
                          ) : studentCount >= 5 ? (
                            <span className="px-3.5 py-1.5 text-xs font-semibold bg-gray-100 text-[#5C726E] rounded-lg border border-gray-200 select-none">
                              Team Full (5/5)
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleJoinProblem(problem.id)}
                              className="px-4 py-2 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
                            >
                              Join Team ({studentCount}/5)
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------
                3. TAB: TEAMS
                ---------------------------------------------------------------- */}
            {activeTab === 'my-teams' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-[#BFD9D2]/60">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                    Teams
                  </h1>
                  <p className="text-sm text-[#5C726E] mt-0.5">
                    Multidisciplinary research teams (1 Mentor + Maximum 5 Students).
                  </p>
                </div>

                <div className="space-y-6">
                  {myJoinedProblems.map((problem) => {
                    const roster = getProblemTeamRoster(problem)
                    return (
                      <div
                        key={problem.id}
                        className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#BFD9D2]/60">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/60">
                                Project ID: {getProjectIdForProblem(problem.id)}
                              </span>
                              <span className="text-xs font-semibold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/60">
                                Problem ID: {problem.id}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2A28] mt-2 tracking-tight">
                              {problem.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#176B5B] px-3 py-1 bg-[#DCEFEA] rounded-full border border-[#BFD9D2]">
                              Members: {roster.students.length + 1}/6
                            </span>
                          </div>
                        </div>

                        {/* Mentor & Students Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
                            <span className="text-xs font-bold uppercase text-[#176B5B] block">Mentor Lead</span>
                            <p className="font-bold text-sm text-[#1F2A28]">{roster.mentor.name}</p>
                            <p className="text-[#5C726E]">Mentor ID: {roster.mentor.id} • {roster.mentor.department}</p>
                          </div>

                          <div className="p-3.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-1">
                            <span className="text-xs font-bold uppercase text-[#176B5B] block">Student Team ({roster.students.length}/5)</span>
                            <p className="font-bold text-sm text-[#1F2A28]">
                              {roster.students.map((s) => s.name).join(', ')}
                            </p>
                            <p className="text-[#5C726E]">Register Nos: {roster.students.map((s) => s.registerNo).join(', ')}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#BFD9D2]/60">
                          <button
                            type="button"
                            onClick={() => handleOpenTeamDetail(problem)}
                            className="text-sm font-bold text-[#176B5B] hover:underline cursor-pointer"
                          >
                            View Team →
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewIdeaForm((prev) => ({ ...prev, problemId: problem.id }))
                              setIsSubmitIdeaOpen(true)
                            }}
                            className="px-5 py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                          >
                            + Submit Idea / Output
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {myJoinedProblems.length === 0 && (
                    <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E] space-y-3">
                      <p>You have not joined any problem team yet.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('matching')}
                        className="px-5 py-2.5 bg-[#176B5B] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                      >
                        Browse Problems →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------
                4. TAB: RESEARCH
                ---------------------------------------------------------------- */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-[#BFD9D2]/60">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                    Research
                  </h1>
                  <p className="text-sm text-[#5C726E] mt-0.5">
                    Track research deliverables and milestone progression.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myJoinedProblems.map((problem) => (
                    <div
                      key={problem.id}
                      className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                          <div>
                            <span className="text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/60">
                              Project ID: {getProjectIdForProblem(problem.id)}
                            </span>
                            <h3 className="text-lg font-bold text-[#1F2A28] mt-2 leading-snug">
                              {problem.title}
                            </h3>
                          </div>
                          <UnifiedStatusBadge status={problem.workflowStage || 'IN_PROGRESS'} size="xs" />
                        </div>

                        <div className="space-y-2 text-xs">
                          <p className="text-[#5C726E]">
                            Problem ID: <strong className="text-[#1F2A28]">{problem.id}</strong>
                          </p>
                          <p className="text-[#5C726E]">
                            Mentor: <strong className="text-[#1F2A28]">{problem.assignedMentor ? problem.assignedMentor.name : 'Prof. K. Narayanan'}</strong>
                          </p>
                        </div>

                        {/* Progress Bar (Green Only, No Red Gradient) */}
                        <div className="space-y-1.5 pt-2 border-t border-[#BFD9D2]/40">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#5C726E]">Progress:</span>
                            <span className="font-bold text-[#176B5B]">{problem.progressPercentage || 25}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#176B5B] rounded-full transition-all duration-500"
                              style={{ width: `${problem.progressPercentage || 25}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#BFD9D2]/50">
                        <button
                          type="button"
                          onClick={() => handleOpenResearchDetail(problem)}
                          className="text-sm font-bold text-[#176B5B] hover:underline cursor-pointer"
                        >
                          View Research →
                        </button>
                      </div>
                    </div>
                  ))}

                  {myJoinedProblems.length === 0 && (
                    <div className="p-12 text-center bg-white border border-[#BFD9D2] rounded-2xl text-sm text-[#5C726E]">
                      No active research projects found. Join a problem team to start research.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------
                5. TAB: IDEAS
                ---------------------------------------------------------------- */}
            {activeTab === 'ideas' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]/60">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                      Ideas
                    </h1>
                    <p className="text-sm text-[#5C726E] mt-0.5">
                      Submit ideas and prototypes for faculty mentor evaluation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNewIdeaForm((prev) => ({
                        ...prev,
                        problemId: myJoinedProblems[0]?.id || 'SETU-GOV-RES-301',
                      }))
                      setIsSubmitIdeaOpen(true)
                    }}
                    className="px-5 py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    + Submit Idea
                  </button>
                </div>

                <div className="space-y-4">
                  {studentIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-3 text-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#BFD9D2]/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md">
                              Project ID: {idea.projectId || 'SETU-PRJ-301'}
                            </span>
                            <span className="text-xs text-[#5C726E]">
                              Problem: {idea.problemId}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-[#1F2A28] mt-1.5">{idea.title}</h4>
                        </div>

                        <UnifiedStatusBadge status={idea.status} size="xs" />
                      </div>

                      <p className="text-sm text-[#1F2A28]/85 leading-relaxed bg-[#F7FAF9] p-4 rounded-xl border border-[#BFD9D2]/50">
                        {idea.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-[#5C726E]">
                        <span>Submitted: {idea.submissionDate}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenIdeaDetail(idea)}
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

            {/* ----------------------------------------------------------------
                6. TAB: ALERTS (INTERACTIVE ALERTS)
                ---------------------------------------------------------------- */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                      Alerts
                    </h1>
                    <p className="text-sm text-[#5C726E] mt-0.5">
                      Click any alert to mark it as read and inspect the associated problem.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      store.markAllNotificationsAsRead()
                      showToast('All alerts marked as read.')
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
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-2xs ${
                        notif.isRead
                          ? 'bg-white border-[#BFD9D2]/80'
                          : 'bg-[#DCEFEA]/30 border-[#176B5B]/40 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-base text-[#1F2A28]">{notif.title}</p>
                        <span className="text-xs text-[#5C726E]">{notif.timestamp}</span>
                      </div>
                      <p className="text-sm text-[#5C726E] mt-1.5 leading-relaxed">{notif.message}</p>
                      <div className="pt-2 mt-2 border-t border-[#BFD9D2]/40 flex items-center justify-between text-xs">
                        <span className="text-[#176B5B] font-bold">Inspect Details →</span>
                        {!notif.isRead && (
                          <span className="px-2 py-0.5 rounded bg-[#176B5B] text-white text-[10px] font-bold">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------
                7. TAB: STUDENT PROFILE (MULTI-CARD CLEAN LAYOUT)
                ---------------------------------------------------------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in max-w-4xl">
                <div className="pb-4 border-b border-[#BFD9D2]/60">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
                    Student Profile
                  </h1>
                  <p className="text-sm text-[#5C726E] mt-0.5">
                    View and manage your student profile information and credentials.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-8">
                  {/* CARD 1: Profile Photo */}
                  <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-[#1F2A28]">Profile Photo</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <input
                        type="file"
                        ref={photoInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />

                      {profileData.photoUrl ? (
                        <img
                          src={profileData.photoUrl}
                          alt={profileData.name}
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-[#176B5B] shadow-2xs"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#176B5B] text-white text-3xl font-bold flex items-center justify-center shadow-2xs">
                          {(profileData.name || 'KR').slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs text-[#5C726E]">
                          Select an image from your laptop. Formats: JPG, PNG, WEBP (Max 5MB).
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="px-4 py-2 bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                          >
                            {profileData.photoUrl ? 'Replace Photo' : 'Upload Photo'}
                          </button>
                          {profileData.photoUrl && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold border border-red-200 cursor-pointer transition-colors"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: Personal Information */}
                  <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-[#1F2A28]">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Full Name <span className="text-[#176B5B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          placeholder="+91 98451 23456"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={profileData.dob}
                          onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Gender
                        </label>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28]">
                            Institutional Email (Disabled / Read-Only)
                          </label>
                          <span className="text-xs text-[#5C726E] font-semibold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            Locked Institutional Identity
                          </span>
                        </div>
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Academic Information (Strictly Disabled / Read-Only) */}
                  <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#1F2A28]">Academic Information</h3>
                      <span className="text-xs text-[#5C726E] italic">
                        Academic information is managed by your university administrator.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#5C726E] mb-1.5">
                          University
                        </label>
                        <input
                          type="text"
                          disabled
                          value={profileData.university}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#5C726E] mb-1.5">
                          Department
                        </label>
                        <input
                          type="text"
                          disabled
                          value={profileData.department}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#5C726E] mb-1.5">
                          Degree
                        </label>
                        <input
                          type="text"
                          disabled
                          value={profileData.degree}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#5C726E] mb-1.5">
                          Academic Year
                        </label>
                        <input
                          type="text"
                          disabled
                          value={profileData.yearOfStudy}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#5C726E] mb-1.5">
                          Register / Roll Number
                        </label>
                        <input
                          type="text"
                          disabled
                          value={profileData.registerNo}
                          className="w-full px-4 py-2.5 bg-gray-100 border border-[#BFD9D2] rounded-xl text-sm text-gray-600 cursor-not-allowed select-none font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: Address Information */}
                  <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-[#1F2A28]">Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          District
                        </label>
                        <input
                          type="text"
                          value={profileData.district}
                          onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          value={profileData.state}
                          onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={profileData.pincode}
                          onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARD 5: Professional Information */}
                  <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-[#1F2A28]">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          value={profileData.github}
                          onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                          placeholder="https://github.com/handle"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          LinkedIn Profile URL
                        </label>
                        <input
                          type="url"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/handle"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={profileData.portfolio}
                          onChange={(e) => setProfileData({ ...profileData, portfolio: e.target.value })}
                          placeholder="https://yourportfolio.dev"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Skills (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={profileData.skills}
                          onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                          placeholder="Python, Java, Machine Learning, IoT"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                          Areas of Interest (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={profileData.interests}
                          onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                          placeholder="Water Quality, AI, Environmental Monitoring"
                          className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Profile Button */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#176B5B] hover:bg-[#125649] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-6 py-3 border border-[#BFD9D2] hover:bg-gray-50 text-[#5C726E] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {/* ====================================================================
          MODAL: CHANGE PASSWORD (Account → Change Password)
          ==================================================================== */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
              <h3 className="text-xl font-bold text-[#1F2A28]">Change Password</h3>
              <button
                type="button"
                onClick={() => {
                  setIsChangePasswordOpen(false)
                  setPasswordError('')
                }}
                className="text-[#5C726E] hover:text-[#1F2A28] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Current Password <span className="text-[#176B5B]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  New Password <span className="text-[#176B5B]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Confirm New Password <span className="text-[#176B5B]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              {passwordError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {passwordError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangePasswordOpen(false)
                    setPasswordError('')
                  }}
                  className="px-4 py-2 border border-[#BFD9D2] text-[#5C726E] text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: SUBMIT IDEA (Actual Laptop File Input, No Fake Files)
          ==================================================================== */}
      {isSubmitIdeaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
              <div>
                <h3 className="text-xl font-bold text-[#1F2A28]">Submit Idea / Solution</h3>
                <p className="text-xs text-[#5C726E]">Submit your technical solution for faculty mentor review.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitIdeaOpen(false)}
                className="text-[#5C726E] hover:text-[#1F2A28] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitIdea} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Idea Title <span className="text-[#176B5B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newIdeaForm.title}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, title: e.target.value })}
                  placeholder="e.g. Multi-Stage Nano-Filtration Telemetry Prototype"
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Related Problem <span className="text-[#176B5B]">*</span>
                </label>
                <select
                  value={newIdeaForm.problemId}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, problemId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                >
                  {matchingProblems.map((prob) => (
                    <option key={prob.id} value={prob.id}>
                      {prob.id} — {prob.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Description / Problem Formulation <span className="text-[#176B5B]">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={newIdeaForm.description}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, description: e.target.value })}
                  placeholder="Describe the problem context and your research idea..."
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Proposed Solution
                </label>
                <textarea
                  rows="2"
                  value={newIdeaForm.proposedSolution}
                  onChange={(e) => setNewIdeaForm({ ...newIdeaForm, proposedSolution: e.target.value })}
                  placeholder="Technical methodology, execution architecture..."
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                    Expected Impact
                  </label>
                  <input
                    type="text"
                    value={newIdeaForm.expectedImpact}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, expectedImpact: e.target.value })}
                    placeholder="e.g. 85% reduction in pollutant runoff"
                    className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                    Technologies / Skills
                  </label>
                  <input
                    type="text"
                    value={newIdeaForm.technologies}
                    onChange={(e) => setNewIdeaForm({ ...newIdeaForm, technologies: e.target.value })}
                    placeholder="e.g. Python, ESP32, LoRaWAN, React"
                    className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                  />
                </div>
              </div>

              {/* Real Laptop File Input (Attachment) */}
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Attachment (Select from Device)
                </label>
                <input
                  type="file"
                  ref={ideaFileInputRef}
                  onChange={handleFileSelection}
                  accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                  className="hidden"
                />

                {newIdeaForm.selectedFile ? (
                  <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#176B5B]">File:</span>
                      <span className="font-medium text-[#1F2A28]">{newIdeaForm.selectedFile.name}</span>
                      <span className="text-[#5C726E]">({newIdeaForm.selectedFile.size})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => ideaFileInputRef.current?.click()}
                        className="text-xs text-[#176B5B] hover:underline font-semibold cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveIdeaFile}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => ideaFileInputRef.current?.click()}
                    className="w-full p-4 border border-dashed border-[#BFD9D2] rounded-xl text-center hover:bg-[#F7FAF9] text-xs text-[#5C726E] font-medium cursor-pointer transition-colors"
                  >
                    Click to select documentation / diagram / schema from your laptop (PDF, DOCX, ZIP, JPG, PNG)
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => setIsSubmitIdeaOpen(false)}
                  className="px-4 py-2 border border-[#BFD9D2] text-[#5C726E] text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: EDIT & RESUBMIT IDEA
          ==================================================================== */}
      {isEditIdeaOpen && editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
              <div>
                <h3 className="text-xl font-bold text-[#1F2A28]">Edit &amp; Resubmit Proposal</h3>
                <p className="text-xs text-[#5C726E]">Update details and submit for re-evaluation.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditIdeaOpen(false)
                  setEditingIdea(null)
                }}
                className="text-[#5C726E] hover:text-[#1F2A28] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedIdea} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Idea Title <span className="text-[#176B5B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Description / Problem Formulation <span className="text-[#176B5B]">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={editingIdea.description}
                  onChange={(e) => setEditingIdea({ ...editingIdea, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Proposed Solution
                </label>
                <textarea
                  rows="2"
                  value={editingIdea.proposedSolution}
                  onChange={(e) => setEditingIdea({ ...editingIdea, proposedSolution: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                    Expected Impact
                  </label>
                  <input
                    type="text"
                    value={editingIdea.expectedImpact}
                    onChange={(e) => setEditingIdea({ ...editingIdea, expectedImpact: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                    Technologies / Skills
                  </label>
                  <input
                    type="text"
                    value={editingIdea.technologies}
                    onChange={(e) => setEditingIdea({ ...editingIdea, technologies: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
                  />
                </div>
              </div>

              {/* Attachment Edit */}
              <div>
                <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28] mb-1.5">
                  Attachment File
                </label>
                <input
                  type="file"
                  ref={editIdeaFileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      const sz =
                        f.size > 1024 * 1024
                          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(f.size / 1024).toFixed(0)} KB`
                      setEditingIdea((prev) => ({
                        ...prev,
                        attachment: { name: f.name, size: sz },
                      }))
                    }
                  }}
                  accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                  className="hidden"
                />

                {editingIdea.attachment ? (
                  <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F2A28]">
                      {editingIdea.attachment.name} ({editingIdea.attachment.size})
                    </span>
                    <button
                      type="button"
                      onClick={() => editIdeaFileInputRef.current?.click()}
                      className="text-[#176B5B] font-bold hover:underline cursor-pointer"
                    >
                      Replace File
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editIdeaFileInputRef.current?.click()}
                    className="w-full p-3 border border-dashed border-[#BFD9D2] rounded-xl text-center text-xs text-[#5C726E] font-medium cursor-pointer"
                  >
                    Select new file from laptop
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#BFD9D2]/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditIdeaOpen(false)
                    setEditingIdea(null)
                  }}
                  className="px-4 py-2 border border-[#BFD9D2] text-[#5C726E] text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Save &amp; Resubmit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: MENTOR REJECTION REASON (Mandatory Reason Input)
          ==================================================================== */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/60">
              <h3 className="text-xl font-bold text-[#1F2A28]">Reject Idea Proposal</h3>
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false)
                  setRejectingIdeaId(null)
                  setRejectionReasonText('')
                }}
                className="text-[#5C726E] hover:text-[#1F2A28] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <label className="block font-bold text-xs uppercase tracking-wider text-[#1F2A28]">
                Reason for Rejection <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-[#5C726E]">
                A constructive rejection reason is mandatory to guide student revision.
              </p>
              <textarea
                rows="4"
                required
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="Specify missing feasibility, theoretical gaps, or required improvements..."
                className="w-full px-4 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-sm text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#BFD9D2]/60">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false)
                  setRejectingIdeaId(null)
                  setRejectionReasonText('')
                }}
                className="px-4 py-2 border border-[#BFD9D2] text-[#5C726E] text-xs font-semibold rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReasonText.trim()}
                onClick={handleConfirmRejectIdea}
                className="px-5 py-2 bg-[#125649] hover:bg-[#0F473C] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Idea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CLEAN FOOTER (Times New Roman)
          ==================================================================== */}
      <footer className="border-t border-[#BFD9D2]/50 py-6 bg-white text-sm text-[#5C726E] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#176B5B]">SETU</span>
            <span>— University Student Innovation Portal</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>{profileData.university}</span>
            <span>•</span>
            <span>Version 2.0 (SIH 2026)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentDashboard
