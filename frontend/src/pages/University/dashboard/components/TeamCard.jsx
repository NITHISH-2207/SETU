import StatusBadge from './StatusBadge.jsx'

function TeamCard({ problem, onOpenProblem, onSubmitContribution }) {
  const mentor = problem.assignedMentor
  const students = problem.assignedStudents || []
  const emptySlotsCount = Math.max(0, 5 - students.length)

  return (
    <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-5 font-outfit">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#BFD9D2]/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#176B5B] bg-[#DCEFEA] px-2.5 py-0.5 rounded border border-[#BFD9D2]">
              {problem.id}
            </span>
            <span className="text-xs text-[#5C726E]">{problem.location}</span>
          </div>
          <h4
            onClick={() => onOpenProblem?.(problem)}
            className="font-syne text-base sm:text-lg font-bold text-[#1F2A28] hover:text-[#176B5B] cursor-pointer transition-colors"
          >
            {problem.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={problem.workflowStage} size="xs" />
          <span className="text-xs font-bold text-[#176B5B] px-2.5 py-1 bg-[#DCEFEA] rounded-full border border-[#BFD9D2]">
            {students.length}/5 Students
          </span>
        </div>
      </div>

      {/* Team Composition Grid */}
      <div className="space-y-4">
        {/* Mentor Section */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B] block mb-2">
            Faculty Mentor (1/1 Maximum)
          </span>
          {mentor ? (
            <div className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#176B5B] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  {mentor.avatar || 'M'}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#1F2A28]">{mentor.name}</h5>
                  <p className="text-xs text-[#5C726E]">{mentor.designation} • {mentor.department}</p>
                  <p className="text-[11px] text-[#176B5B] font-semibold">{mentor.university}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#DCEFEA] text-[#176B5B] text-xs font-bold shrink-0">
                Mentor Lead
              </span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50/70 border border-dashed border-amber-300 rounded-xl text-xs text-amber-800 flex items-center justify-between">
              <span>⚠️ No faculty mentor assigned yet. Open for relevant department faculty adoption.</span>
              <span className="font-bold text-[11px] px-2 py-0.5 bg-white rounded border border-amber-300">0/1 Slot</span>
            </div>
          )}
        </div>

        {/* Students Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
              Student Innovators ({students.length}/5 Team Members)
            </span>
            <span className="text-xs text-[#5C726E]">
              {students.length >= 5 ? 'Team Full (5/5)' : `${emptySlotsCount} slots remaining`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {students.map((student, idx) => (
              <div
                key={student.id || idx}
                className="p-3 bg-white border border-[#BFD9D2]/70 rounded-xl flex items-start gap-2.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-full bg-[#DCEFEA] text-[#176B5B] font-bold flex items-center justify-center text-xs shrink-0">
                  {student.avatar || `S${idx + 1}`}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1F2A28] truncate">{student.name}</p>
                    <span className="text-[10px] text-[#5C726E]">{student.yearOfStudy}</span>
                  </div>
                  <p className="text-[11px] text-[#5C726E] truncate">{student.department}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(student.skills || []).slice(0, 2).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] bg-[#F7FAF9] text-[#176B5B] px-1.5 py-0.5 rounded border border-[#BFD9D2]/50 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Available Slots */}
            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-3 bg-[#F7FAF9]/60 border border-dashed border-[#BFD9D2] rounded-xl flex items-center justify-center text-xs text-[#5C726E]"
              >
                <span>+ Open Student Slot ({students.length + idx + 1}/5)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#BFD9D2]/50">
        <button
          type="button"
          onClick={() => onOpenProblem?.(problem)}
          className="text-xs font-bold text-[#176B5B] hover:underline cursor-pointer"
        >
          View Research Details →
        </button>

        {onSubmitContribution && (
          <button
            type="button"
            onClick={() => onSubmitContribution?.(problem)}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#176B5B] hover:bg-[#125649] text-white rounded-lg transition-colors cursor-pointer"
          >
            Submit Contribution / Idea
          </button>
        )}
      </div>
    </div>
  )
}

export default TeamCard
