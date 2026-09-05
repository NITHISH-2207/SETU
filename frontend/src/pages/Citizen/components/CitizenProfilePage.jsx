import React from 'react'
import { computeComplaintStats } from '../citizenComplaintStore'

export default function CitizenProfilePage({
  complaints = [],
  onNavigateToMyComplaints,
  onRaiseNewIssue,
  onBackToDashboard,
}) {
  const stats = computeComplaintStats(complaints)

  const overviewCards = [
    {
      label: 'Total Complaints Posted',
      value: stats.total,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      ),
    },
    {
      label: 'Under Review',
      value: stats.underReview,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#E07A4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      renderIcon: () => (
        <svg className="w-5 h-5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-6 font-outfit max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#BFD9D2]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2] text-[#1F2A28] hover:text-[#176B5B] hover:bg-[#DCEFEA]/40 transition-colors"
            title="Back to Dashboard"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#176B5B] uppercase tracking-tight">
              MY PROFILE
            </h1>
            <p className="text-sm text-[#1F2A28]/70">
              Verified Citizen Account Details & Activity Overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToMyComplaints}
            className="px-4 py-2 rounded-xl border border-[#BFD9D2] bg-[#F7FAF9] text-[#176B5B] text-xs sm:text-sm font-semibold hover:bg-[#DCEFEA]/40 transition-colors"
          >
            View My Complaints
          </button>
          <button
            type="button"
            onClick={onRaiseNewIssue}
            className="px-4 py-2 rounded-xl bg-[#176B5B] text-white text-xs sm:text-sm font-semibold hover:bg-[#125548] transition-colors shadow-sm"
          >
            Raise an Issue
          </button>
        </div>
      </div>

      {/* Citizen Identity Summary Card */}
      <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-[#BFD9D2]/40">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#176B5B] text-white flex items-center justify-center font-syne text-2xl font-bold shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
                  NITHISH
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#DCEFEA] text-[#176B5B] px-2.5 py-0.5 rounded-full border border-[#BFD9D2]/60">
                  <svg className="w-3 h-3 text-[#176B5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Citizen
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1F2A28]/60 mt-0.5">
                Ward 12, Gandhi Nagar, Tiruppur Corporation
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/60">
            <span className="block text-xs font-bold text-[#1F2A28]/50 uppercase tracking-wider mb-1">
              Full Name
            </span>
            <span className="font-syne font-bold text-base text-[#1F2A28]">
              NITHISH
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/60">
            <span className="block text-xs font-bold text-[#1F2A28]/50 uppercase tracking-wider mb-1">
              Mobile Number
            </span>
            <span className="font-outfit font-semibold text-base text-[#176B5B]">
              +91 90932 14543
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAF9] border border-[#BFD9D2]/60">
            <span className="block text-xs font-bold text-[#1F2A28]/50 uppercase tracking-wider mb-1">
              Registered Address
            </span>
            <span className="font-outfit font-medium text-sm text-[#1F2A28] leading-snug">
              11TH STREET, GANDHI NAGAR, TIRUPPUR
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Activity Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne text-lg sm:text-xl font-bold text-[#1F2A28]">
              Your Activity Overview
            </h2>
            <p className="text-xs text-[#1F2A28]/60">
              Real-time summary of your reported civic issues
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {overviewCards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl border border-[#BFD9D2] bg-white shadow-2xs flex flex-col justify-between hover:border-[#176B5B]/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#1F2A28]/70 font-medium leading-tight">
                  {card.label}
                </span>
                <div className="p-1.5 rounded-lg bg-[#F7FAF9] border border-[#BFD9D2]/50">
                  {card.renderIcon()}
                </div>
              </div>
              <div className="mt-3">
                <span className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28]">
                  {card.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
