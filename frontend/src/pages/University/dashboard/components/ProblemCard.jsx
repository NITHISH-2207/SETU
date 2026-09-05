import StatusBadge from './StatusBadge.jsx'

function ProblemCard({
  problem,
  currentRole = 'admin', // 'admin' | 'mentor' | 'student'
  currentUserId,
  onViewDetails,
  onAccept,
  onDecline,
}) {
  const isMentor = currentRole === 'mentor'
  const isStudent = currentRole === 'student'
  const isAdmin = currentRole === 'admin'

  // Slot calculations
  const isMentorAssigned = Boolean(problem.assignedMentorId)
  const isCurrentMentorAssigned = isMentor && problem.assignedMentorId === currentUserId
  const isMentorSlotUnavailable = isMentor && isMentorAssigned && !isCurrentMentorAssigned

  const studentCount = (problem.assignedStudentIds || []).length
  const isStudentFull = studentCount >= 5
  const isCurrentStudentJoined = isStudent && (problem.assignedStudentIds || []).includes(currentUserId)
  const isStudentSlotUnavailable = isStudent && isStudentFull && !isCurrentStudentJoined

  return (
    <div className="bg-white border border-[#BFD9D2]/90 hover:border-[#176B5B]/50 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-200 font-outfit flex flex-col justify-between space-y-4">
      {/* Top Header: ID, Category & Severity */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA]/60 px-2.5 py-1 rounded-md border border-[#BFD9D2]/60">
              {problem.id}
            </span>
            <span className="text-xs font-semibold text-[#5C726E]">
              {problem.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <StatusBadge status={problem.severity} size="xs" />
            <StatusBadge status={problem.status} size="xs" />
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails?.(problem)}
          className="font-syne text-lg font-bold text-[#1F2A28] hover:text-[#176B5B] cursor-pointer transition-colors leading-snug line-clamp-2 pt-1"
        >
          {problem.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-[#5C726E] line-clamp-2 leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* Matching Domain & Research Requirement Box */}
      <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2]/60 rounded-xl space-y-2 text-xs">
        <div className="flex items-start gap-1.5">
          <span className="text-[#176B5B] font-bold shrink-0">🔬 Research:</span>
          <span className="text-[#1F2A28] font-medium line-clamp-1">{problem.researchRequired}</span>
        </div>
        {problem.matchingReason && (
          <div className="flex items-start gap-1.5 pt-1 border-t border-[#BFD9D2]/40">
            <span className="text-[#E07A4E] font-bold shrink-0">🎯 Match:</span>
            <span className="text-[#5C726E] italic line-clamp-1">{problem.matchingReason}</span>
          </div>
        )}
      </div>

      {/* Slots Information (Hard Constraint Indicator: 1 Mentor + Max 5 Students) */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#BFD9D2]/50 text-xs">
        {/* Mentor Slot */}
        <div className="p-2.5 bg-white border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#5C726E] uppercase">Faculty Mentor</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                isMentorAssigned
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isMentorAssigned ? '1 / 1 Assigned' : '0 / 1 Open'}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#1F2A28] truncate">
            {problem.assignedMentor ? problem.assignedMentor.name : 'Open for Faculty Adoption'}
          </p>
        </div>

        {/* Student Slots */}
        <div className="p-2.5 bg-white border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#5C726E] uppercase">Student Team</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                isStudentFull
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-[#DCEFEA] text-[#176B5B]'
              }`}
            >
              {studentCount} / 5 Slots
            </span>
          </div>
          <p className="text-xs font-semibold text-[#1F2A28] truncate">
            {isStudentFull ? 'Team Full (5/5)' : `${5 - studentCount} Slots Available`}
          </p>
        </div>
      </div>

      {/* Bottom Footer & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-[#BFD9D2]/50 gap-2">
        <button
          type="button"
          onClick={() => onViewDetails?.(problem)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
        >
          <span>View Problem</span>
          <span>→</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mentor Actions */}
          {isMentor && (
            <>
              {isCurrentMentorAssigned ? (
                <button
                  type="button"
                  onClick={() => onDecline?.(problem)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer transition-colors"
                >
                  Relinquish Role
                </button>
              ) : isMentorSlotUnavailable ? (
                <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-[#5C726E] rounded-lg border border-gray-200 select-none">
                  Mentor Slot Occupied
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onAccept?.(problem)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  Accept as Mentor
                </button>
              )}
            </>
          )}

          {/* Student Actions */}
          {isStudent && (
            <>
              {isCurrentStudentJoined ? (
                <button
                  type="button"
                  onClick={() => onDecline?.(problem)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg cursor-pointer transition-colors"
                >
                  Leave Team
                </button>
              ) : isStudentSlotUnavailable ? (
                <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-[#5C726E] rounded-lg border border-gray-200 select-none">
                  Student Slots Full
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onAccept?.(problem)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white rounded-lg shadow-2xs transition-all cursor-pointer"
                >
                  Join Problem Team
                </button>
              )}
            </>
          )}

          {/* Admin Action */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onViewDetails?.(problem)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#F7FAF9] hover:bg-[#DCEFEA]/50 text-[#176B5B] border border-[#BFD9D2] rounded-lg cursor-pointer transition-colors"
            >
              Monitor Workflow
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemCard
