import React from 'react'

export default function DeleteComplaintModal({
  isOpen,
  complaintId,
  onClose,
  onConfirmDelete,
}) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-[#BFD9D2] shadow-2xl p-6 text-center animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning/Delete Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-[#E07A4E]/10 border border-[#E07A4E]/30 flex items-center justify-center mb-4 text-[#E07A4E]">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Modal Title */}
        <h3
          id="delete-modal-title"
          className="font-syne font-bold text-xl text-[#1F2A28] uppercase tracking-wide mb-2"
        >
          DELETE COMPLAINT?
        </h3>

        {complaintId && (
          <p className="font-outfit text-xs font-semibold text-[#176B5B] bg-[#DCEFEA]/40 px-3 py-1 rounded-md inline-block mb-3">
            {complaintId}
          </p>
        )}

        <p className="font-outfit text-sm text-[#1F2A28]/70 leading-relaxed mb-6">
          Are you sure you want to delete this complaint? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#BFD9D2] bg-[#F7FAF9] text-[#1F2A28] font-outfit font-semibold text-sm hover:bg-[#DCEFEA]/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmDelete}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#E07A4E] text-white font-outfit font-semibold text-sm hover:bg-[#c9663d] transition-colors shadow-sm"
          >
            Delete Complaint
          </button>
        </div>
      </div>
    </div>
  )
}
