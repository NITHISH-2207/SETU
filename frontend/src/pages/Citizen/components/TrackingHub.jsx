import { useState } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'
import { StatusBadge } from './RecentIssuesList'

function TrackingHub({ issues = [], selectedIssueId, onBack, onSelectIssue, onToggleUpvote }) {
  const { t } = useAppTranslation()
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [appealRecorded, setAppealRecorded] = useState(false)

  // Find the active issue
  const activeIssue = issues.find((i) => i.id === selectedIssueId) || issues[0]

  const handleQuickTrack = (e) => {
    e.preventDefault()
    const cleanId = searchInput.trim().toUpperCase().replace('#', '')
    if (!cleanId) return

    const found = issues.find(
      (i) => i.id.toUpperCase() === cleanId || i.id.toUpperCase().includes(cleanId)
    )
    if (found) {
      onSelectIssue(found.id)
      setSearchError(false)
      setSearchInput('')
    } else {
      setSearchError(true)
    }
  }

  if (!activeIssue) {
    return (
      <div className="p-10 text-center font-outfit bg-[#F7FAF9] rounded-2xl border border-[#BFD9D2]">
        <p className="text-base text-[#5C726E] font-medium">{t('tracking.notFound')}</p>
        <button
          onClick={onBack}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-sm font-semibold cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>{t('tracking.backToDashboard')}</span>
        </button>
      </div>
    )
  }

  // Calculate current stage index for the horizontal lifecycle
  const currentStepIndex = activeIssue.timeline.reduce((acc, step, idx) => {
    return step.completed ? idx : acc
  }, 0)

  return (
    <div className="space-y-6 sm:space-y-8 font-outfit">
      {/* ====================================================
          A. PROMINENT ISSUE TRACKER SECTION (Directly below navbar)
          ==================================================== */}
      <section className="bg-linear-to-r from-[#F7FAF9] to-[#DCEFEA]/50 border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#176B5B]/10 text-[#176B5B] border border-[#176B5B]/20 mb-2.5">
            <svg className="w-3.5 h-3.5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Issue Reference ID Lookup</span>
          </div>
          <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#1F2A28]">
            {t('tracking.trackYourIssue')}
          </h2>
          <p className="mt-1.5 text-sm text-[#5C726E] leading-relaxed">
            {t('tracking.trackYourIssueDesc')}
          </p>

          <form onSubmit={handleQuickTrack} className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  if (searchError) setSearchError(false)
                }}
                placeholder={t('tracking.quickTrackPlaceholder')}
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-[#1F2A28] placeholder-[#5C726E]/70 focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all shadow-2xs font-mono font-medium"
              />
              <svg
                className="w-4.5 h-4.5 text-[#176B5B] absolute left-3.5 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] rounded-xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-[0.99]"
            >
              <span>{t('tracking.trackButton')}</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {searchError && (
            <p className="text-xs sm:text-sm text-[#E07A4E] font-semibold mt-2.5 flex items-center gap-1.5 animate-fade-in">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{t('tracking.notFound')}</span>
            </p>
          )}
        </div>
      </section>

      {/* ====================================================
          E. INTEGRATED BACK LINK & ISSUE HEADER
          ==================================================== */}
      <section className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
        {/* Subtle Back Link Integrated naturally near heading */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#BFD9D2]/40">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#176B5B] hover:text-[#125649] group cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 text-[#176B5B] group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{t('tracking.backLink')}</span>
          </button>

          <span className="text-xs font-medium text-[#5C726E]">
            Citizen Grievance Resolution Stream
          </span>
        </div>

        {/* Issue Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-mono font-bold text-[#176B5B] bg-[#DCEFEA] px-3 py-1 rounded-lg border border-[#BFD9D2]/70">
              #{activeIssue.id}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#5C726E] bg-[#F7FAF9] px-3 py-1 rounded-lg border border-[#BFD9D2]/50">
              {activeIssue.category}
            </span>
          </div>
          <StatusBadge status={activeIssue.status} />
        </div>

        <h1 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] leading-snug">
          {activeIssue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-[#5C726E] pt-1">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#1F2A28]">
            <svg className="w-4 h-4 text-[#176B5B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{activeIssue.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#5C726E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Reported: {activeIssue.date}</span>
          </span>
        </div>
      </section>

      {/* ====================================================
          B. HORIZONTAL 5-STAGE LIFECYCLE TIMELINE
          ==================================================== */}
      <section className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#BFD9D2]/50">
          <div>
            <h2 className="font-syne text-lg sm:text-xl font-bold text-[#1F2A28]">
              {t('tracking.timeline')}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C726E] mt-0.5">
              5-Stage Transparent Lifecycle Progress
            </p>
          </div>

          {/* Elegant Unobtrusive Status Legend */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-[#5C726E] bg-[#F7FAF9] px-3.5 py-1.5 rounded-xl border border-[#BFD9D2]/60 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B5B]" />
              <span className="text-[#1F2A28]">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B5B] ring-2 ring-[#DCEFEA]" />
              <span className="text-[#176B5B] font-semibold">Current Stage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#E07A4E] bg-[#E07A4E]/20" />
              <span className="text-[#E07A4E]">Waiting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#BFD9D2] bg-white" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>

        {/* Horizontal Stepper Container (Scrollable on small screens, never shrinking text) */}
        <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
          <div className="min-w-[820px] flex items-start justify-between relative">
            {activeIssue.timeline.map((step, idx) => {
              // 4-Stage Status Determination
              let stageState = 'upcoming'
              if (activeIssue.status === 'resolved') {
                stageState = 'completed'
              } else if (idx < currentStepIndex) {
                stageState = 'completed'
              } else if (idx === currentStepIndex) {
                stageState = 'current'
              } else if (idx === currentStepIndex + 1) {
                stageState = 'waiting'
              } else {
                stageState = 'upcoming'
              }

              const isLast = idx === activeIssue.timeline.length - 1

              // Connector line color calculation
              let nextStageState = 'upcoming'
              if (idx + 1 < activeIssue.timeline.length) {
                if (activeIssue.status === 'resolved') {
                  nextStageState = 'completed'
                } else if (idx + 1 < currentStepIndex) {
                  nextStageState = 'completed'
                } else if (idx + 1 === currentStepIndex) {
                  nextStageState = 'current'
                } else if (idx + 1 === currentStepIndex + 1) {
                  nextStageState = 'waiting'
                } else {
                  nextStageState = 'upcoming'
                }
              }

              let connectorClass = 'bg-[#BFD9D2]/70'
              if (stageState === 'completed') {
                if (nextStageState === 'completed' || nextStageState === 'current') {
                  connectorClass = 'bg-[#176B5B]'
                } else if (nextStageState === 'waiting') {
                  connectorClass = 'bg-linear-to-r from-[#176B5B] to-[#E07A4E]'
                } else {
                  connectorClass = 'bg-linear-to-r from-[#176B5B] to-[#BFD9D2]'
                }
              } else if (stageState === 'current') {
                if (nextStageState === 'waiting') {
                  connectorClass = 'bg-linear-to-r from-[#176B5B] to-[#E07A4E]'
                } else {
                  connectorClass = 'bg-linear-to-r from-[#176B5B] to-[#BFD9D2]'
                }
              }

              return (
                <div key={idx} className="flex-1 relative flex flex-col items-center text-center px-2">
                  {/* Connecting Line between nodes */}
                  {!isLast && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-1 z-0 transition-colors duration-300 ${connectorClass}`}
                    />
                  )}

                  {/* Stage Node */}
                  <div className="relative z-10 mb-3">
                    {stageState === 'completed' && (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#176B5B] text-white shadow-xs transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}

                    {stageState === 'current' && (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-[#176B5B] text-white ring-4 ring-[#DCEFEA] ring-offset-2 ring-offset-white shadow-md animate-pulse transition-all duration-300">
                        <span className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    )}

                    {stageState === 'waiting' && (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 border-[#E07A4E] bg-[#E07A4E]/10 text-[#E07A4E] shadow-2xs transition-all duration-300">
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                    )}

                    {stageState === 'upcoming' && (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 border-[#BFD9D2] bg-white text-[#5C726E] transition-all duration-300">
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Stage Details Card (Preserves full detail) */}
                  <div
                    className={`w-full p-3.5 sm:p-4 rounded-xl border text-left flex flex-col justify-between min-h-[175px] transition-all ${
                      stageState === 'current'
                        ? 'bg-[#F7FAF9] border-[#176B5B] shadow-xs ring-1 ring-[#176B5B]/20'
                        : stageState === 'completed'
                        ? 'bg-white border-[#BFD9D2]/80'
                        : stageState === 'waiting'
                        ? 'bg-[#F7FAF9]/80 border-[#E07A4E]/40 hover:border-[#E07A4E]'
                        : 'bg-white/60 border-[#BFD9D2]/40 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Status State Tag & Stage Name */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider block ${
                            stageState === 'completed' || stageState === 'current'
                              ? 'text-[#176B5B]'
                              : stageState === 'waiting'
                              ? 'text-[#E07A4E]'
                              : 'text-[#5C726E]'
                          }`}
                        >
                          {t(step.labelKey)}
                        </span>

                        {/* Status Label Indicator */}
                        {stageState === 'current' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DCEFEA] text-[#176B5B] border border-[#176B5B]/20 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B] animate-pulse" />
                            Active
                          </span>
                        )}
                        {stageState === 'waiting' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E07A4E]/10 text-[#E07A4E] border border-[#E07A4E]/20 shrink-0">
                            Waiting
                          </span>
                        )}
                      </div>

                      {/* Action Title */}
                      <h4
                        className={`font-syne text-xs sm:text-sm font-bold leading-snug ${
                          stageState === 'completed' || stageState === 'current'
                            ? 'text-[#1F2A28]'
                            : stageState === 'waiting'
                            ? 'text-[#1F2A28]/90'
                            : 'text-[#5C726E]'
                        }`}
                      >
                        {step.title}
                      </h4>

                      {/* Note / Detail */}
                      <p className="text-xs text-[#5C726E] mt-1.5 leading-relaxed">
                        {step.note}
                      </p>
                    </div>

                    {/* Metadata: Actor & Timestamp */}
                    <div className="mt-3 pt-2 border-t border-[#BFD9D2]/40 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#176B5B]">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="truncate">{step.actor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#5C726E]">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{step.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================
          C & D. TWO-COLUMN INFO AREA (Details & Evidence)
          ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left / Primary Column: Reported Details, Location, Community Support, Resolution/Appeal */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Reported Details Card */}
          <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3 className="font-syne text-sm font-bold text-[#176B5B] uppercase tracking-wider">
                  {t('tracking.issueDetails')}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#1F2A28] leading-relaxed">
                {activeIssue.description}
              </p>
            </div>

            {/* Location & Administrative Ward info */}
            <div className="pt-4 border-t border-[#BFD9D2]/50">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <h3 className="font-syne text-sm font-bold text-[#176B5B] uppercase tracking-wider">
                  {t('tracking.location')}
                </h3>
              </div>
              <p className="text-sm text-[#1F2A28] font-semibold">
                {activeIssue.location}
              </p>
              <p className="text-xs sm:text-sm text-[#5C726E] mt-0.5">
                Jurisdiction: {activeIssue.ward}
              </p>
            </div>
          </div>

          {/* 2. Community Support & Upvote Card */}
          <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-syne text-base font-bold text-[#1F2A28]">
                  {t('tracking.communitySupport')}
                </h3>
                <p className="text-sm text-[#5C726E] mt-0.5">
                  <strong className="text-[#176B5B]">{activeIssue.upvotes}</strong> verified citizens support prioritizing this issue.
                </p>
              </div>

              <button
                onClick={() => onToggleUpvote(activeIssue.id)}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                  activeIssue.isUpvoted
                    ? 'bg-[#176B5B] text-white shadow-xs'
                    : 'bg-white border border-[#BFD9D2] text-[#176B5B] hover:bg-[#DCEFEA]/50 shadow-2xs'
                }`}
              >
                <svg className={`w-4 h-4 ${activeIssue.isUpvoted ? 'text-white' : 'text-[#176B5B]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span>{activeIssue.isUpvoted ? t('tracking.alreadySupported') : t('tracking.supportThisIssue')}</span>
              </button>
            </div>
          </div>

          {/* 3. Resolution & Appeal (When Resolved) */}
          {activeIssue.status === 'resolved' && (
            <div className="bg-[#DCEFEA]/60 border border-[#176B5B]/40 rounded-2xl p-6 shadow-2xs space-y-3.5 animate-fade-in">
              <div className="flex items-center gap-2.5 text-[#176B5B]">
                <span className="w-7 h-7 rounded-full bg-[#176B5B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h3 className="font-syne text-base font-bold">
                  {t('tracking.resolutionConfirmed')}
                </h3>
              </div>

              {activeIssue.resolutionSummary && (
                <p className="text-sm text-[#1F2A28]/90 leading-relaxed">
                  {activeIssue.resolutionSummary}
                </p>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setAppealRecorded(true)}
                  className="px-4 py-2 rounded-xl border border-[#E07A4E] text-[#E07A4E] hover:bg-[#E07A4E]/10 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                >
                  {t('tracking.appealButton')}
                </button>
              </div>

              {appealRecorded && (
                <p className="text-xs sm:text-sm text-[#176B5B] font-semibold flex items-center gap-1.5 animate-fade-in">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{t('tracking.appealNotice')}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right / Secondary Column: Attached Evidence (Preview Cards) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <h3 className="font-syne text-sm font-bold text-[#176B5B] uppercase tracking-wider">
                  {t('tracking.evidence')}
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#5C726E]">
                {activeIssue.evidence?.length || 0} Files Attached
              </span>
            </div>

            {activeIssue.evidence && activeIssue.evidence.length > 0 ? (
              <div className="space-y-3.5">
                {activeIssue.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#F7FAF9] border border-[#BFD9D2]/70 hover:border-[#176B5B]/50 rounded-xl flex items-center gap-3.5 transition-all group cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: ev.color || '#176B5B' }}
                    >
                      <svg className="w-6 h-6 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">IMG</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-syne text-xs sm:text-sm font-bold text-[#1F2A28] truncate">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#5C726E] mt-0.5 line-clamp-2">
                        {ev.caption}
                      </p>
                      <span className="text-[11px] font-medium text-[#176B5B] mt-1 inline-flex items-center gap-1 group-hover:underline">
                        <span>Preview Evidence</span>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-[#5C726E] py-4 text-center">
                No multimedia evidence uploaded with this report.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackingHub
