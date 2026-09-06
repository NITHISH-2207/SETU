import { useState, useRef } from 'react'

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
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const CONTRIBUTION_TYPES = [
    'Research Proposal',
    'Technical Analysis & Simulation',
    'Lab Test Findings',
    'Idea & Problem Formulation',
    'Prototype / Hardware Output',
    'Policy Draft & Legal Framework',
  ]

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile({
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type,
      })
      setErrorMsg('')
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
        attachments: selectedFile
          ? [
              {
                name: selectedFile.name,
                size: selectedFile.sizeFormatted,
              },
            ]
          : [
              {
                name: `${title.trim().slice(0, 20).replace(/\s+/g, '_')}_document.pdf`,
                size: '1.4 MB',
              },
            ],
      })
      setIsSubmitting(false)
      setSelectedFile(null)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white border border-[#BFD9D2] rounded-2xl max-w-xl w-full my-8 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F7FAF9] border-b border-[#BFD9D2]/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2] flex items-center justify-center text-sm font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2A28]">
                Submit Research Contribution
              </h3>
              <p className="text-xs text-[#5C726E]">
                Link your findings, idea, or prototype to your authorized problem.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-[#BFD9D2] text-[#5C726E] hover:text-[#1F2A28] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Problem Selector (Only Authorized Problems) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Select Authorized Problem <span className="text-[#176B5B]">*</span>
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
              <div className="p-3 bg-[#F7FAF9] border border-[#BFD9D2] text-[#5C726E] rounded-xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                <span>You have not joined or been assigned to any research problem yet. Accept or join a problem first.</span>
              </div>
            )}
          </div>

          {/* Contribution Type */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Contribution Type <span className="text-[#176B5B]">*</span>
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
              Contribution Title <span className="text-[#176B5B]">*</span>
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
              Summary &amp; Findings Description <span className="text-[#176B5B]">*</span>
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

          {/* Real Laptop File Attachment */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#1F2A28] mb-1.5">
              Attach Document / Research Output File
            </label>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
              className="hidden"
            />

            {selectedFile ? (
              <div className="p-3.5 bg-[#F7FAF9] border border-[#176B5B]/40 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#1F2A28] truncate">{selectedFile.name}</p>
                    <p className="text-[11px] text-[#5C726E]">{selectedFile.sizeFormatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-[#BFD9D2] text-[#176B5B] font-semibold rounded-lg text-xs hover:bg-[#DCEFEA]/40 cursor-pointer transition-colors"
                  >
                    Replace File
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-[#F7FAF9] border-2 border-dashed border-[#BFD9D2] hover:border-[#176B5B] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#BFD9D2] flex items-center justify-center text-[#176B5B] group-hover:bg-[#DCEFEA] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-[#176B5B] hover:underline">Choose File from Device</span>
                  <p className="text-[11px] text-[#5C726E] mt-0.5">Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, Images</p>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
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
