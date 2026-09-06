import { useState } from 'react'
import {
  calculateTimeStatus,
  deriveComplaintPriority,
  deriveComplaintUrgency,
  deriveComplaintSeverity,
  PRIORITY_OPTIONS,
  URGENCY_OPTIONS,
  SEVERITY_OPTIONS,
  DEMO_PASSWORDS,
} from '../governmentConfig.js'

function GovernmentComplaintDetail({
  complaint,
  departmentName,
  onBack,
  onUpdateComplaint,
}) {
  if (!complaint) return null

  // Normalize initial values
  const initialPriority = deriveComplaintPriority(complaint)
  const initialUrgency = deriveComplaintUrgency(complaint)
  const initialSeverity = deriveComplaintSeverity(complaint)

  // Normalize raw status to display status
  const getNormalizedStatus = (raw) => {
    if (!raw) return 'Received'
    if (raw === 'resolved') return 'Resolved'
    if (raw === 'under_review') return 'Under Review'
    if (raw === 'in_progress' || raw === 'assigned' || raw === 'action_taken') return 'In Progress'
    return 'Received'
  }

  const [currentPriority, setCurrentPriority] = useState(initialPriority)
  const [currentUrgency, setCurrentUrgency] = useState(initialUrgency)
  const [currentSeverity, setCurrentSeverity] = useState(initialSeverity)
  const [currentStatus, setCurrentStatus] = useState(getNormalizedStatus(complaint.status))
  const [departmentNotes, setDepartmentNotes] = useState(complaint.adminNotes || '')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Changes Saved')

  // Password-gated resolution modal states
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [modalPassword, setModalPassword] = useState('')
  const [modalError, setModalError] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const isResolved = currentStatus === 'Resolved' || complaint.status === 'resolved'
  const timeStatus = calculateTimeStatus(complaint)

  // Unresolved status lifecycle options (excluding "Resolved" per strict requirement)
  const UNRESOLVED_STATUS_OPTIONS = ['Received', 'Under Review', 'In Progress']

  // Map display status to store status value
  const mapDisplayStatusToRaw = (disp) => {
    switch (disp) {
      case 'Received':
        return 'submitted'
      case 'Under Review':
        return 'under_review'
      case 'In Progress':
        return 'in_progress'
      case 'Resolved':
        return 'resolved'
      default:
        return 'submitted'
    }
  }

  const handlePriorityChange = (newVal) => {
    setCurrentPriority(newVal)
    handlePersistChange({ priority: newVal })
  }

  const handleUrgencyChange = (newVal) => {
    setCurrentUrgency(newVal)
    handlePersistChange({ urgency: newVal })
  }

  const handleSeverityChange = (newVal) => {
    setCurrentSeverity(newVal)
    handlePersistChange({ severity: newVal })
  }

  const handleStatusChange = (newVal) => {
    // Only allow changing between unresolved statuses via dropdown
    if (newVal === 'Resolved') return
    setCurrentStatus(newVal)
    const rawStatus = mapDisplayStatusToRaw(newVal)
    handlePersistChange({ status: rawStatus, statusDisplay: newVal })
  }

  const handlePersistChange = (updatedFields, customMsg = 'Changes Saved') => {
    if (onUpdateComplaint) {
      onUpdateComplaint(complaint.id, {
        ...updatedFields,
        adminNotes: departmentNotes,
      })
      setSaveMessage(customMsg)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    }
  }

  const handleSaveNotes = () => {
    handlePersistChange({ adminNotes: departmentNotes }, 'Notes Saved')
  }

  // Handle password-gated resolution verification
  const handleConfirmResolution = (e) => {
    e.preventDefault()
    setModalError(null)

    if (!modalPassword.trim()) {
      setModalError('Please enter the department password to confirm resolution.')
      return
    }

    const expectedPassword = DEMO_PASSWORDS[departmentName] || 'water'

    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (modalPassword.trim().toLowerCase() === expectedPassword.toLowerCase()) {
        // Password correct -> mark resolved
        setCurrentStatus('Resolved')
        if (onUpdateComplaint) {
          onUpdateComplaint(complaint.id, {
            status: 'resolved',
            statusDisplay: 'Resolved',
            adminNotes: departmentNotes,
            resolvedAt: new Date().toISOString(),
          })
        }
        setIsResolveModalOpen(false)
        setModalPassword('')
        setSaveMessage('Issue Successfully Resolved')
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        // Password incorrect -> show inline error, do NOT expose password
        setModalError('Incorrect department password. Please verify and try again.')
      }
    }, 250)
  }

  const getTimeStatusBadge = (ts) => {
    switch (ts) {
      case 'Overdue':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Due Soon':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'On Track':
      default:
        return 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn font-outfit">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5C726E] hover:text-[#176B5B] transition-colors cursor-pointer group"
        >
          <span className="w-7 h-7 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2] flex items-center justify-center group-hover:bg-[#176B5B] group-hover:text-white transition-all">
            ←
          </span>
          <span>Back to Complaints List</span>
        </button>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2] animate-fadeIn">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{saveMessage}</span>
            </span>
          )}

          <span className="text-xs font-mono font-bold text-[#176B5B] bg-[#DCEFEA] px-3 py-1.5 rounded-lg border border-[#BFD9D2]">
            {complaint.id}
          </span>
        </div>
      </div>

      {/* ====================================================
          ROW 1 — COMPLAINT DETAILS (full-width, standalone, first)
          ==================================================== */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="font-semibold text-[#176B5B] bg-[#DCEFEA]/60 px-2.5 py-0.5 rounded-md">
              {complaint.category}
            </span>
            <span className="text-[#BFD9D2]">•</span>
            <span className="text-[#5C726E]">Submitted on {complaint.date}</span>
            <span className="text-[#BFD9D2]">•</span>
            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getTimeStatusBadge(
                isResolved ? 'Resolved' : timeStatus
              )}`}
            >
              Schedule: {isResolved ? 'Resolved' : timeStatus}
            </span>
          </div>

          <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight leading-snug">
            {complaint.title}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C726E]">
            Citizen Description
          </h3>
          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/70 text-sm text-[#1F2A28] leading-relaxed">
            {complaint.description}
          </div>
        </div>

        {/* Location & Community Endorsement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-[#BFD9D2]/60 bg-[#F7FAF9]/40 space-y-1">
            <span className="text-[11px] font-semibold text-[#5C726E] uppercase tracking-wider block">
              Location / Address
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#1F2A28] flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-[#176B5B] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{complaint.location || complaint.ward || 'Tiruppur Ward Area'}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#BFD9D2]/60 bg-[#F7FAF9]/40 space-y-1">
            <span className="text-[11px] font-semibold text-[#5C726E] uppercase tracking-wider block">
              Community Endorsement
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#1F2A28] flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-[#E07A4E] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span>{complaint.upvotes || 0} Citizens Supported</span>
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================
          ROW 2 — ISSUE MANAGEMENT (full-width, standalone, second)
          ==================================================== */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="pb-4 border-b border-[#BFD9D2]/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] mb-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>Department Authority Controls</span>
          </div>
          <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
            Issue Management
          </h2>
          <p className="text-xs text-[#5C726E] mt-0.5">
            Manage triage parameters, log operational notes, and trigger verified departmental resolution.
          </p>
        </div>

        {/* Management Controls: Status Lifecycle -> Priority -> Urgency -> Severity -> Resolved */}
        <div className="space-y-4">
          {/* Responsive Grid of 4 Dropdowns (Left-to-Right layout across the full width) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Status Lifecycle Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="status-dropdown"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1F2A28]"
              >
                Status Lifecycle
              </label>
              <div className="relative">
                <select
                  id="status-dropdown"
                  value={currentStatus}
                  disabled={isResolved}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all appearance-none shadow-2xs ${
                    isResolved ? 'opacity-90 bg-[#DCEFEA]/40 text-[#176B5B] cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isResolved ? (
                    <option value="Resolved">Resolved</option>
                  ) : (
                    UNRESOLVED_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))
                  )}
                </select>
                <svg
                  className="w-3.5 h-3.5 text-[#5C726E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* 2. Priority Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="priority-dropdown"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1F2A28]"
              >
                Priority Level
              </label>
              <div className="relative">
                <select
                  id="priority-dropdown"
                  value={currentPriority}
                  disabled={isResolved}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all appearance-none shadow-2xs ${
                    isResolved ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-3.5 h-3.5 text-[#5C726E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* 3. Urgency Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="urgency-dropdown"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1F2A28]"
              >
                Urgency
              </label>
              <div className="relative">
                <select
                  id="urgency-dropdown"
                  value={currentUrgency}
                  disabled={isResolved}
                  onChange={(e) => handleUrgencyChange(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all appearance-none shadow-2xs ${
                    isResolved ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {URGENCY_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-3.5 h-3.5 text-[#5C726E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* 4. Severity Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="severity-dropdown"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#1F2A28]"
              >
                Severity
              </label>
              <div className="relative">
                <select
                  id="severity-dropdown"
                  value={currentSeverity}
                  disabled={isResolved}
                  onChange={(e) => handleSeverityChange(e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 text-xs font-semibold bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all appearance-none shadow-2xs ${
                    isResolved ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {SEVERITY_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-3.5 h-3.5 text-[#5C726E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* 5. RESOLVED ACTION (Always Placed Last, Distinct & Password-Gated) */}
          <div className="pt-2">
            {isResolved ? (
              <div className="w-full py-3 px-4 rounded-xl bg-[#DCEFEA] border border-[#BFD9D2] text-[#176B5B] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs">
                <svg
                  className="w-4 h-4 text-[#176B5B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Grievance Verified &amp; Resolved</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsResolveModalOpen(true)
                  setModalPassword('')
                  setModalError(null)
                }}
                className="w-full py-3 px-4 rounded-xl bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white font-bold text-xs transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Resolve Complaint (Password Required)</span>
              </button>
            )}
          </div>
        </div>

        {/* Department Internal Operational Notes */}
        <div className="space-y-2 pt-3 border-t border-[#BFD9D2]/60">
          <label
            htmlFor="dept-notes"
            className="block text-xs font-bold uppercase tracking-wider text-[#1F2A28]"
          >
            Department Operational Notes
          </label>
          <textarea
            id="dept-notes"
            rows={3}
            value={departmentNotes}
            onChange={(e) => setDepartmentNotes(e.target.value)}
            placeholder="Log field inspection notes, contractor dispatch details, or scheduled repair timeline..."
            className="w-full p-3 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all"
          />
          <button
            type="button"
            onClick={handleSaveNotes}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            Save Department Notes
          </button>
        </div>
      </div>

      {/* ====================================================
          ROW 3 — CONTRIBUTIONS / ADDITIONAL DETAILS ←→ SUBMITTED EVIDENCE (two-column row)
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT: Additional Complaint Details / Contributions */}
        <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#BFD9D2]/60">
              <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                Contributions &amp; Collaborative Details
              </h3>
              <p className="text-xs text-[#5C726E] mt-0.5">
                Academic research, technical findings, and CSR corporate partnerships committed for this issue.
              </p>
            </div>

            <div className="space-y-4">
              {/* University Contributions Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#176B5B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  <h4 className="font-syne text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
                    University Contributions
                  </h4>
                </div>
                <div className="p-4 rounded-xl bg-[#F7FAF9] border border-dashed border-[#BFD9D2] text-center space-y-1">
                  <p className="text-xs font-semibold text-[#1F2A28]">
                    No university contributions yet
                  </p>
                  <p className="text-[11px] text-[#5C726E] leading-relaxed">
                    Academic field studies or technical test reports for this grievance will appear here once submitted.
                  </p>
                </div>
              </div>

              {/* Industry / CSR Contributions Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#E07A4E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <h4 className="font-syne text-xs font-bold uppercase tracking-wider text-[#1F2A28]">
                    Industry / CSR Contributions
                  </h4>
                </div>
                <div className="p-4 rounded-xl bg-[#F7FAF9] border border-dashed border-[#BFD9D2] text-center space-y-1">
                  <p className="text-xs font-semibold text-[#1F2A28]">
                    No industry contributions yet
                  </p>
                  <p className="text-[11px] text-[#5C726E] leading-relaxed">
                    Corporate CSR sponsorships or material execution partnerships will appear here once committed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Submitted Evidence */}
        <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4 flex flex-col">
          <div className="pb-3 border-b border-[#BFD9D2]/60">
            <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
              Submitted Evidence &amp; Media
            </h3>
            <p className="text-xs text-[#5C726E] mt-0.5">
              Photographs, documents, and proof submitted by citizen.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {complaint.evidence && complaint.evidence.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {complaint.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[#BFD9D2] bg-[#F7FAF9] flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${ev.color || '#176B5B'}15` }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: ev.color || '#176B5B' }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F2A28] truncate">{ev.title}</p>
                      <p className="text-[11px] text-[#5C726E] truncate">{ev.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-[#BFD9D2] bg-[#F7FAF9]/50 text-xs text-[#5C726E] text-center">
                No photographic attachments uploaded by citizen.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================
          ROW 4 — RESOLUTION STATUS (full-width, final row)
          ==================================================== */}
      <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#BFD9D2]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCEFEA] border border-[#BFD9D2] flex items-center justify-center text-[#176B5B]">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                Resolution Schedule &amp; SLA Status
              </h3>
              <span className="text-xs text-[#5C726E]">
                Department Benchmark Assessment
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5C726E]">Current Assessment:</span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTimeStatusBadge(
                isResolved ? 'Resolved' : timeStatus
              )}`}
            >
              {isResolved ? 'Resolved' : timeStatus}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#5C726E] leading-relaxed">
          {isResolved
            ? 'This complaint has completed verified departmental action, supervisor clearance, and formal municipal resolution.'
            : `Derived automatically from citizen submission timestamp (${complaint.date}) and standard municipal resolution benchmarks for ${complaint.category}.`}
        </p>
      </div>

      {/* ====================================================
          PASSWORD CONFIRMATION MODAL BEFORE RESOLVING
          ==================================================== */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#BFD9D2]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCEFEA] border border-[#BFD9D2] flex items-center justify-center text-[#176B5B]">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-syne text-lg font-bold text-[#1F2A28]">
                    Confirm Resolution
                  </h3>
                  <span className="text-xs text-[#5C726E]">
                    {departmentName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="p-1 rounded-lg text-[#5C726E] hover:text-[#1F2A28] hover:bg-[#F7FAF9] transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5C726E] leading-relaxed">
              Department password verification is required before permanently marking complaint{' '}
              <strong className="text-[#176B5B] font-mono">{complaint.id}</strong> as resolved in the municipal system.
            </p>

            {/* Error Message within modal */}
            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2 animate-fadeIn">
                <svg
                  className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmResolution} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="resolve-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1F2A28]"
                >
                  Department Password <span className="text-[#E07A4E]">*</span>
                </label>
                <input
                  id="resolve-password"
                  type="password"
                  value={modalPassword}
                  onChange={(e) => {
                    setModalPassword(e.target.value)
                    setModalError(null)
                  }}
                  placeholder="Enter department password"
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#BFD9D2] bg-white hover:bg-[#F7FAF9] text-xs font-semibold text-[#5C726E] hover:text-[#1F2A28] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-5 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Resolve</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GovernmentComplaintDetail
