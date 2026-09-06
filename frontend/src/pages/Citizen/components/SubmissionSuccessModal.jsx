import React, { useState } from 'react'

export default function SubmissionSuccessModal({
  isOpen,
  complaintId = 'SETU-CIT-2026-0000',
  onClose,
  onGoToDashboard,
  onViewComplaint,
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(complaintId)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      } else {
        // Fallback for environments where clipboard API is unavailable
        const textArea = document.createElement('textarea')
        textArea.value = complaintId
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          setCopied(true)
          setTimeout(() => setCopied(false), 3000)
        }
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl border border-[#BFD9D2] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F7FAF9] border border-[#BFD9D2] text-[#1F2A28]/60 hover:text-[#176B5B] hover:bg-[#DCEFEA]/50 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#176B5B]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#DCEFEA] border-2 border-[#176B5B]/30 flex items-center justify-center mb-5 text-[#176B5B]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Headings */}
        <h2
          id="submission-success-title"
          className="font-syne font-bold text-2xl text-[#176B5B] tracking-tight mb-1"
        >
          Complaint Submitted Successfully
        </h2>
        <p className="font-outfit font-semibold text-base text-[#1F2A28] mb-2">
          Thank you, NITHISH!
        </p>
        <p className="font-outfit text-sm text-[#1F2A28]/70 leading-relaxed mb-1">
          Your complaint has been successfully submitted. We will keep you updated as it progresses.
        </p>
        <p className="font-outfit text-xs font-medium text-[#176B5B] mb-6">
          Thank you for helping improve your community.
        </p>

        {/* Tracking ID Box */}
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl p-4 mb-6">
          <span className="block font-outfit text-[11px] font-bold text-[#1F2A28]/60 uppercase tracking-widest mb-1.5">
            YOUR TRACKING ID
          </span>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="font-syne font-bold text-lg sm:text-xl text-[#176B5B] tracking-wider select-all">
              {complaintId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#BFD9D2] text-xs font-outfit font-medium text-[#176B5B] hover:bg-[#DCEFEA]/40 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#176B5B]"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#176B5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-[#176B5B]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="font-outfit text-xs font-semibold text-[#176B5B] animate-fadeIn">
              Tracking ID copied to clipboard
            </p>
          )}
          <p className="font-outfit text-[11px] text-[#1F2A28]/60 mt-1">
            Use this ID anytime to track your complaint.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[#BFD9D2] bg-[#F7FAF9] text-[#1F2A28] font-outfit font-semibold text-sm hover:bg-[#DCEFEA]/50 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            type="button"
            onClick={onViewComplaint}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#176B5B] text-white font-outfit font-semibold text-sm hover:bg-[#125548] transition-colors shadow-sm"
          >
            View My Complaint
          </button>
        </div>
      </div>
    </div>
  )
}
