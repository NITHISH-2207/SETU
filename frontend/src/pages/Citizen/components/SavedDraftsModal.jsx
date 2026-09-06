import { useState, useEffect } from 'react'
import { getSavedDrafts, removeDraftFromStorage } from '../citizenDraftsService.js'

function SavedDraftsModal({ isOpen, onClose, onResumeDraft }) {
  const [drafts, setDrafts] = useState([])

  // Refresh drafts on open
  useEffect(() => {
    if (isOpen) {
      const current = getSavedDrafts()
      const timer = setTimeout(() => {
        setDrafts(current)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleDelete = (id, e) => {
    e.stopPropagation()
    const updated = removeDraftFromStorage(id)
    setDrafts(updated)
  }

  const formatDraftTime = (isoString) => {
    if (!isoString) return 'Recently'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/40 backdrop-blur-xs animate-fade-in font-outfit">
      <div className="bg-white rounded-2xl border border-[#BFD9D2] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </span>
            <div>
              <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                My Saved Drafts
              </h3>
              <span className="text-xs text-[#5C726E]">
                {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} stored locally
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#5C726E] hover:text-[#1F2A28] p-1.5 rounded-lg hover:bg-[#F7FAF9] cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drafts List */}
        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
          {drafts.length === 0 ? (
            <div className="text-center py-8 px-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#DCEFEA]/60 text-[#176B5B] flex items-center justify-center mx-auto">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1F2A28]">No saved drafts</p>
              <p className="text-xs text-[#5C726E]">
                When filling out a complaint, click "Save as Draft" to save your progress and finish later.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => {
                  onResumeDraft(draft)
                  onClose()
                }}
                className="p-4 bg-[#F7FAF9] hover:bg-[#DCEFEA]/25 border border-[#BFD9D2] hover:border-[#176B5B] rounded-xl transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E07A4E]/15 text-[#E07A4E] uppercase tracking-wider">
                        Draft
                      </span>
                      {draft.category && (
                        <span className="text-xs font-semibold text-[#176B5B]">
                          {draft.category}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-[#1F2A28] group-hover:text-[#176B5B] transition-colors line-clamp-1 mt-1">
                      {draft.title || 'Untitled Draft'}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(draft.id, e)}
                    className="p-1.5 rounded-lg text-[#5C726E] hover:text-[#E07A4E] hover:bg-white transition-colors cursor-pointer shrink-0"
                    title="Delete draft"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5C726E] pt-1 border-t border-[#BFD9D2]/40">
                  <span>Saved: {formatDraftTime(draft.updatedAt)}</span>
                  <span className="font-semibold text-[#176B5B] group-hover:underline flex items-center gap-1">
                    Resume Editing →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#BFD9D2] hover:bg-[#F7FAF9] text-[#1F2A28] text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SavedDraftsModal
