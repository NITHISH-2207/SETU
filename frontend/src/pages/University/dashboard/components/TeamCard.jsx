import StatusBadge from './StatusBadge.jsx'

function TeamCard({ problem, onOpenProblem, onSubmitContribution }) {
  const mentor = problem.assignedMentor
  const students = problem.assignedStudents || []
  const emptySlotsCount = Math.max(0, 5 - students.length)

  return (
    <div className="bg-white border border-[#BFD9D2]/80 hover:border-[#176B5B]/50 rounded-2xl p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all duration-200 font-outfit flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="space-y-2.5 pb-4 border-b border-[#BFD9D2]/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded-md border border-[#BFD9D2]/70">
              {problem.id}
            </span>
            <span className="text-xs text-[#5C726E]">{problem.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={problem.workflowStage} size="xs" />
            <span className="text-xs font-bold text-[#176B5B] px-2.5 py-0.5 bg-[#DCEFEA] rounded-full border border-[#BFD9D2]/70">
              {students.length}/5 Students
            </span>
          </div>
        </div>

        <h4
          onClick={() => onOpenProblem?.(problem)}
          className="text-base sm:text-lg font-bold text-[#1F2A28] hover:text-[#176B5B] cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {problem.title}
        </h4>
      </div>

      {/* Summary Team Composition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Mentor Lead */}
        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B] block">Faculty Mentor Lead</span>
          <p className="font-bold text-sm text-[#1F2A28] truncate">
            {mentor ? mentor.name : 'Open for Faculty Lead'}
          </p>
          <p className="text-[11px] text-[#5C726E] truncate">
            {mentor ? `${mentor.department} • ${mentor.university}` : 'Unassigned slot'}
          </p>
        </div>

        {/* Student Team Capacity */}
        <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C726E] block">Student Innovators</span>
          <p className="font-bold text-sm text-[#176B5B]">
            {students.length} of 5 Slots Filled
          </p>
          <p className="text-[11px] text-[#5C726E]">
            {emptySlotsCount === 0 ? 'Team capacity complete' : `${emptySlotsCount} open student slots remaining`}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#BFD9D2]/60 gap-3">
        <button
          type="button"
          onClick={() => onOpenProblem?.(problem)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B5B] hover:text-[#125649] hover:underline cursor-pointer"
        >
          <span>View Team Details</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {onSubmitContribution && (
          <button
            type="button"
            onClick={() => onSubmitContribution(problem)}
            className="px-4 py-1.5 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            + Contribution
          </button>
        )}
      </div>
    </div>
  )
}

export default TeamCard
