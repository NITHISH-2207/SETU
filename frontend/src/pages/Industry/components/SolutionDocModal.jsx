export default function SolutionDocModal({ solutionDoc, onClose }) {
  if (!solutionDoc) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-outfit"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
            Government Verified Technical Proposal
          </span>
          <h2 className="font-syne text-lg sm:text-xl font-semibold text-slate-900">
            {solutionDoc.documentName}
          </h2>
          <span className="text-xs text-slate-500 block mt-1">
            {solutionDoc.documentSize} • {solutionDoc.university} ({solutionDoc.department})
          </span>
        </div>

        {/* Document Content Preview */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-6 space-y-5 text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 text-[11px] text-slate-500 font-mono">
            <span>Document Preview • Page 1 of 12</span>
            <span>Ref: {solutionDoc.studentTeam || 'SETU-DPR-2026'}</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-syne text-sm font-semibold text-slate-900 mb-1">
                1. Executive Project Summary & Technical Approach
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {solutionDoc.solutionSummary}
              </p>
            </div>

            <div>
              <h4 className="font-syne text-sm font-semibold text-slate-900 mb-1">
                2. Student Research Team & Faculty Leadership
              </h4>
              <div className="bg-white p-3 rounded-md border border-slate-200/80 space-y-1 text-xs">
                <p><strong>Faculty Lead:</strong> {solutionDoc.mentor}</p>
                <p><strong>Student Engineers:</strong> {solutionDoc.students?.join(', ')}</p>
                <p><strong>Department:</strong> {solutionDoc.department}</p>
              </div>
            </div>

            <div>
              <h4 className="font-syne text-sm font-semibold text-slate-900 mb-1">
                3. Financial Budget & Implementation Plan
              </h4>
              <p className="text-slate-600 leading-relaxed">
                The project budget encompasses component procurement, field installation, and 2-year maintenance operations audited by government engineers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500">
            Digital signature verified on SETU ledger.
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

