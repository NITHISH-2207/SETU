import { useState } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'

function RaiseIssueBanner() {
  const { t } = useAppTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-outfit">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 mb-2.5">
            <svg className="w-3.5 h-3.5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{t('dashboard.raiseIssue.phase2Badge')}</span>
          </div>
          <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#1F2A28]">
            {t('dashboard.raiseIssue.title')}
          </h2>
          <p className="mt-2 text-sm text-[#5C726E] leading-relaxed">
            {t('dashboard.raiseIssue.description')}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] shrink-0 font-outfit"
        >
          <span>{t('dashboard.raiseIssue.button')}</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Clean Phase 2 Integration Placeholder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2A28]/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#BFD9D2] max-w-md w-full p-6 sm:p-7 shadow-xl space-y-4 font-outfit">
            <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
                <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                  {t('dashboard.raiseIssue.modalTitle')}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#5C726E] hover:text-[#1F2A28] p-1.5 rounded-lg hover:bg-[#F7FAF9] cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-[#5C726E] leading-relaxed">
              {t('dashboard.raiseIssue.modalDescription')}
            </p>

            <div className="p-4 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 text-xs sm:text-sm text-[#176B5B] space-y-2">
              <p className="font-bold">Planned Phase 2 Features:</p>
              <ul className="list-disc list-inside space-y-1 text-[#5C726E] text-xs">
                <li>Multi-step categorized complaint filing</li>
                <li>Live GPS &amp; Ward geo-tagging</li>
                <li>Photo, audio &amp; video evidence upload pipeline</li>
                <li>Automated institutional match and priority dispatch</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#176B5B] hover:bg-[#125649] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                {t('dashboard.raiseIssue.closeModal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RaiseIssueBanner
