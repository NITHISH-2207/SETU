import StatusBadge from './StatusBadge.jsx'

function ProblemDetailModal({
  problem,
  onClose,
  currentRole = 'admin', // 'admin' | 'mentor' | 'student'
  currentUserId,
  onAcceptMentor,
  onDeclineMentor,
  onJoinStudent,
  onLeaveStudent,
  onOpenContribution,
}) {
  if (!problem) return null

  const isMentor = currentRole === 'mentor'
  const isStudent = currentRole === 'student'
  const isAdmin = currentRole === 'admin'

  const mentor = problem.assignedMentor
  const students = problem.assignedStudents || []
  const isMentorAssigned = Boolean(problem.assignedMentorId)
  const isCurrentMentorAssigned = isMentor && problem.assignedMentorId === currentUserId
  const isMentorUnavailable = isMentor && isMentorAssigned && !isCurrentMentorAssigned

  const studentCount = students.length
  const isStudentFull = studentCount >= 5
  const isCurrentStudentJoined = isStudent && (problem.assignedStudentIds || []).includes(currentUserId)
  const isStudentUnavailable = isStudent && isStudentFull && !isCurrentStudentJoined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/60 backdrop-blur-xs font-outfit overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#F7FAF9] border-b border-[#BFD9D2]/70 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-1 rounded border border-[#BFD9D2]">
              {problem.id}
            </span>
            <span className="text-xs font-semibold text-[#5C726E]">{problem.category}</span>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={problem.severity} size="xs" />
            <StatusBadge status={problem.status} size="xs" />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-[#BFD9D2] text-[#5C726E] hover:text-[#1F2A28] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Main Title & Origin */}
          <div className="space-y-2">
            <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#1F2A28] leading-tight">
              {problem.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C726E]">
              <span>🏛️ <strong>Origin:</strong> {problem.submittedBy}</span>
              <span>📍 <strong>Location:</strong> {problem.location}</span>
              <span>📅 <strong>Received:</strong> {problem.dateReceived}</span>
              {problem.estimatedBudget && (
                <span>💰 <strong>Budget:</strong> {problem.estimatedBudget}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
              Problem Overview &amp; Context
            </h4>
            <p className="text-sm text-[#1F2A28]/80 leading-relaxed bg-[#F7FAF9] p-4 rounded-xl border border-[#BFD9D2]/60">
              {problem.description}
            </p>
          </div>

          {/* Research Requirements & Domain Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#BFD9D2] rounded-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] block">
                🔬 Required Research Core
              </span>
              <p className="text-xs font-semibold text-[#1F2A28] leading-normal">
                {problem.researchRequired}
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-[#5C726E] font-medium">Matching Reason:</span>
                <p className="text-xs text-[#E07A4E] font-medium italic mt-0.5">
                  {problem.matchingReason}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#BFD9D2] rounded-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] block">
                🏛️ Matched Departments &amp; Domains
              </span>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-[#5C726E] uppercase font-bold block mb-1">Departments:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(problem.matchingDepartments || []).map((dept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#F7FAF9] text-[#176B5B] text-xs font-semibold border border-[#BFD9D2]"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C726E] uppercase font-bold block mb-1">Domains:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(problem.matchingDomains || []).map((dom, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#DCEFEA] text-[#176B5B] text-xs font-semibold border border-[#BFD9D2]/70"
                      >
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Attachments */}
          {problem.evidence && problem.evidence.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                Government Evidence &amp; Attachments ({problem.evidence.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {problem.evidence.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-[#BFD9D2] rounded-xl flex items-center justify-between text-xs hover:border-[#176B5B]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <div>
                        <p className="font-semibold text-[#1F2A28]">{file.title}</p>
                        <p className="text-[10px] text-[#5C726E]">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <span className="text-[#176B5B] font-bold text-xs">Download ↓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow & Stage Stepper */}
          <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#176B5B] uppercase">Current Project Stage:</span>
              <span className="font-semibold text-[#1F2A28]">{problem.workflowStage} ({problem.progressPercentage || 0}%)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#176B5B] to-[#E07A4E] rounded-full transition-all duration-500"
                style={{ width: `${problem.progressPercentage || 10}%` }}
              />
            </div>
          </div>

          {/* Current Team Composition (1 Mentor + 5 Students) */}
          <div className="space-y-3 pt-2 border-t border-[#BFD9D2]/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
                Assigned Problem Team (1 Mentor + 5 Students)
              </h4>
              <span className="text-xs font-bold text-[#176B5B]">
                Mentor: {isMentorAssigned ? '1/1' : '0/1'} • Students: {studentCount}/5
              </span>
            </div>

            {/* Mentor Lead */}
            <div className="p-3.5 bg-white border border-[#BFD9D2] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#5C726E] uppercase font-bold block">Assigned Faculty Mentor</span>
                <p className="font-bold text-sm text-[#1F2A28] mt-0.5">
                  {mentor ? mentor.name : 'No mentor assigned yet'}
                </p>
                {mentor && (
                  <p className="text-[#5C726E]">{mentor.designation} • {mentor.department} ({mentor.university})</p>
                )}
              </div>
              <span
                className={`px-2.5 py-1 rounded font-bold text-xs ${
                  isMentorAssigned ? 'bg-[#DCEFEA] text-[#176B5B]' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isMentorAssigned ? '1/1 Assigned' : '0/1 Open'}
              </span>
            </div>

            {/* Students List */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#5C726E] uppercase font-bold block">
                Active Student Members ({students.length}/5):
              </span>
              {students.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {students.map((student, idx) => (
                    <div
                      key={student.id || idx}
                      className="p-2.5 bg-white border border-[#BFD9D2] rounded-xl text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#1F2A28]">{student.name}</p>
                        <p className="text-[11px] text-[#5C726E]">{student.department}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#176B5B] px-2 py-0.5 bg-[#DCEFEA] rounded">
                        Slot {idx + 1}/5
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#F7FAF9] border border-dashed border-[#BFD9D2] rounded-xl text-xs text-[#5C726E] text-center">
                  No student members have joined yet. Available slots: 5/5.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-[#F7FAF9] border-t border-[#BFD9D2]/70 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white hover:bg-gray-100 text-[#5C726E] border border-[#BFD9D2] rounded-xl cursor-pointer transition-colors"
          >
            Close Window
          </button>

          <div className="flex items-center gap-2">
            {/* Mentor Actions */}
            {isMentor && (
              <>
                {isCurrentMentorAssigned ? (
                  <button
                    onClick={() => {
                      onDeclineMentor?.(problem.id)
                      onClose()
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl cursor-pointer"
                  >
                    Relinquish Mentor Role
                  </button>
                ) : isMentorUnavailable ? (
                  <span className="px-4 py-2 text-xs font-semibold bg-gray-100 text-[#5C726E] border border-gray-200 rounded-xl">
                    Mentor Slot Occupied (1/1)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onAcceptMentor?.(problem.id)
                      onClose()
                    }}
                    className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer"
                  >
                    Accept as Lead Mentor
                  </button>
                )}
              </>
            )}

            {/* Student Actions */}
            {isStudent && (
              <>
                {isCurrentStudentJoined ? (
                  <button
                    onClick={() => {
                      onLeaveStudent?.(problem.id)
                      onClose()
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl cursor-pointer"
                  >
                    Leave Problem Team
                  </button>
                ) : isStudentUnavailable ? (
                  <span className="px-4 py-2 text-xs font-semibold bg-gray-100 text-[#5C726E] border border-gray-200 rounded-xl">
                    Student Slots Full (5/5)
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onJoinStudent?.(problem.id)
                      onClose()
                    }}
                    className="px-5 py-2.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-xl shadow-2xs cursor-pointer"
                  >
                    Join Problem Team ({studentCount}/5)
                  </button>
                )}
              </>
            )}

            {/* Contribution Button */}
            {(isCurrentMentorAssigned || isCurrentStudentJoined || isAdmin) && (
              <button
                onClick={() => {
                  onClose()
                  onOpenContribution?.(problem)
                }}
                className="px-5 py-2.5 text-xs font-bold bg-[#E07A4E] hover:bg-[#C9663D] text-white rounded-xl shadow-2xs cursor-pointer transition-colors"
              >
                Submit Contribution / Idea
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetailModal
