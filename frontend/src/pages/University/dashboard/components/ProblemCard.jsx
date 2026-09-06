import StatusBadge, { PriorityBadge } from './StatusBadge.jsx'

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

  // Slot calculations
  const isMentorAssigned = Boolean(problem.assignedMentorId)
  const isCurrentMentorAssigned = isMentor && problem.assignedMentorId === currentUserId
  const isMentorSlotUnavailable = isMentor && isMentorAssigned && !isCurrentMentorAssigned

  const studentCount = (problem.assignedStudentIds || []).length
  const isStudentFull = studentCount >= 5
  const isCurrentStudentJoined = isStudent && (problem.assignedStudentIds || []).includes(currentUserId)
  const isStudentSlotUnavailable = isStudent && isStudentFull && !isCurrentStudentJoined

  return (
    <div className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all duration-200 font-outfit flex flex-col justify-between space-y-5">
      {/* Top Header: ID, Category & Severity */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/70">
              {problem.id}
            </span>
            <span className="text-xs font-semibold text-[#5C726E]">
              {problem.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={problem.severity} size="xs" />
            <StatusBadge status={problem.status} size="xs" />
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails?.(problem)}
          className="text-base sm:text-lg font-bold text-[#1F2A28] hover:text-[#176B5B] cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {problem.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#5C726E] line-clamp-2 leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* Summary Metadata: Research Domain */}
      <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/60 rounded-xl space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#176B5B] font-bold text-[11px] uppercase tracking-wider">Research Area:</span>
          <span className="text-[#1F2A28] font-medium truncate">{problem.researchRequired}</span>
        </div>
        {problem.matchingReason && (
          <div className="flex items-center gap-2 pt-1 border-t border-[#BFD9D2]/40 text-[11px]">
            <span className="text-[#5C726E] font-bold uppercase tracking-wider">Domain Match:</span>
            <span className="text-[#5C726E] italic truncate">{problem.matchingReason}</span>
          </div>
        )}
      </div>

      {/* Slot Status Preview */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#BFD9D2]/50 text-xs">
        {/* Mentor Slot */}
        <div className="p-3 bg-white border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5C726E] uppercase tracking-wider">Mentor</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                isMentorAssigned
                  ? 'bg-[#DCEFEA] text-[#176B5B]'
                  : 'bg-gray-100 text-[#5C726E]'
              }`}
            >
              {isMentorAssigned ? '1/1 Assigned' : '0/1 Open'}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#1F2A28] truncate">
            {problem.assignedMentor ? problem.assignedMentor.name : 'Open for Lead'}
          </p>
        </div>

        {/* Student Slots */}
        <div className="p-3 bg-white border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5C726E] uppercase tracking-wider">Student Team</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                isStudentFull
                  ? 'bg-gray-100 text-[#5C726E]'
                  : 'bg-[#DCEFEA] text-[#176B5B]'
              }`}
            >
              {studentCount}/5 Slots
            </span>
          </div>
          <p className="text-xs font-semibold text-[#1F2A28] truncate">
            {isStudentFull ? 'Team Full (5/5)' : `${5 - studentCount} Open Slots`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#BFD9D2]/60 gap-3">
        <button
          type="button"
          onClick={() => onViewDetails?.(problem)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
        >
          <span>View Details</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* Mentor Quick Actions */}
          {isMentor && (
            isCurrentMentorAssigned ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#176B5B] px-2.5 py-1 bg-[#DCEFEA] rounded-md">
                  Adopted Lead
                </span>
                <button
                  type="button"
                  onClick={() => onDecline?.(problem.id)}
                  className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  Relinquish
                </button>
              </div>
            ) : isMentorSlotUnavailable ? (
              <span className="text-[11px] font-semibold text-[#5C726E] px-2.5 py-1 bg-gray-100 rounded-md">
                Mentor Lead Occupied
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAccept?.(problem.id)}
                className="px-3.5 py-1.5 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Adopt Problem
              </button>
            )
          )}

          {/* Student Quick Actions */}
          {isStudent && (
            isCurrentStudentJoined ? (
              <span className="text-[11px] font-semibold text-[#176B5B] px-2.5 py-1 bg-[#DCEFEA] rounded-md">
                Joined Team
              </span>
            ) : isStudentSlotUnavailable ? (
              <span className="text-[11px] font-semibold text-[#5C726E] px-2.5 py-1 bg-gray-100 rounded-md">
                Team Full
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAccept?.(problem.id)}
                className="px-3.5 py-1.5 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Join Team
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemCard
