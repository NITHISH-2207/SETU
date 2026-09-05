import { useState } from 'react'

function ContributionModal({
  isOpen,
  onClose,
  authorizedProblems = [],
  preselectedProblemId,
  currentUser,
  currentRole,
  onSubmitContribution,
}) {
  const [selectedProblemId, setSelectedProblemId] = useState(
    preselectedProblemId || (authorizedProblems[0]?.id || '')
  )
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Research Proposal')
  const [summary, setSummary] = useState('')
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const CONTRIBUTION_TYPES = [
    'Research Proposal',
    'Technical Analysis & Simulation',
    'Lab Test Findings',
    'Idea & Problem Formulation',
    'Prototype / Hardware Output',
    'Policy Draft & Legal Framework',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedProblemId) {
      setErrorMsg('Please select an authorized research problem.')
      return
    }
    if (!title.trim()) {
      setErrorMsg('Please enter a descriptive contribution title.')
      return
    }
    if (!summary.trim()) {
      setErrorMsg('Please provide a research summary or technical description.')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    const problemObj = authorizedProblems.find((p) => p.id === selectedProblemId)

    setTimeout(() => {
      onSubmitContribution({
        problemId: selectedProblemId,
        problemTitle: problemObj?.title || 'Community Research Project',
        authorId: currentUser?.id || 'usr-1',
        authorName: currentUser?.name || 'Authorized Researcher',
        authorRole: currentRole === 'mentor' ? 'Faculty Mentor' : currentRole === 'student' ? 'Student Innovator' : 'Administrator',
        authorUniversity: currentUser?.university || 'Affiliated Institution',
        title: title.trim(),
        type,
        summary: summary.trim(),
        attachments: [
          {
            name: fileName || `${title.slice(0, 18).replace(/\s+/g, '_')}_output.pdf`,
            size: '3.4 MB',
          },
        ],
      })
      setIsSubmitting(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/60 backdrop-blur-xs font-outfit overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-xl w-full my-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F7FAF9] border-b border-[#BFD9D2]/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E07A4E]/10 text-[#E07A4E] border border-[#E07A4E]/30 flex items-center justify-center text-sm font-bold">
              💡
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-[#1F2A28]">
                Submit Research Contribution
              </h3>
              <p className="text-xs text-[#5C726E]">
                Link your findings, idea, or prototype to your authorized problem.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-[#BFD9D2] text-[#5C726E] hover:text-[#1F2A28] flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Problem Selector (Only Authorized Problems) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Select Authorized Problem <span className="text-[#E07A4E]">*</span>
            </label>
            {authorizedProblems.length > 0 ? (
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-xs text-[#1F2A28] font-medium focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20"
              >
                {authorizedProblems.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    [{prob.id}] {prob.title.slice(0, 55)}...
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                ⚠️ You have not joined or been assigned to any research problem yet. Accept or join a problem first.
              </div>
            )}
          </div>

          {/* Contribution Type */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Contribution Type <span className="text-[#E07A4E]">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-xs text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
            >
              {CONTRIBUTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Contribution Title <span className="text-[#E07A4E]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. IoT Edge Inverter Control Firmware v1.0"
              className="w-full px-3.5 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-xs text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B]"
            />
          </div>

          {/* Summary / Technical Details */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Summary &amp; Findings Description <span className="text-[#E07A4E]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Outline the methodology, experimental findings, simulation parameters, and societal implications..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#BFD9D2] rounded-xl text-xs text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden focus:border-[#176B5B] resize-none"
            />
          </div>

          {/* Simulated File Attachment */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Supporting Documentation / Dataset (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. simulation_dataset_and_schematic.zip"
                className="flex-1 px-3.5 py-2 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl text-xs text-[#1F2A28] placeholder-[#5C726E]/60"
              />
              <button
                type="button"
                onClick={() => setFileName('Research_Findings_Output_' + Date.now().toString().slice(-4) + '.pdf')}
                className="px-3 py-2 bg-white border border-[#BFD9D2] text-[#176B5B] font-semibold rounded-xl text-xs hover:bg-[#DCEFEA]/30 cursor-pointer"
              >
                + Attach File
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#E07A4E] font-medium">{errorMsg}</p>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#BFD9D2]/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#BFD9D2] text-[#5C726E] hover:bg-gray-50 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || authorizedProblems.length === 0}
              className="px-6 py-2.5 rounded-xl bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Publish Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContributionModal
