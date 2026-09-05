import { useAppTranslation } from '../../../hooks/useAppTranslation'

function RaiseIssueBanner({ onOpen }) {
  const { t } = useAppTranslation()

  return (
    <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-outfit">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 mb-2.5">
          <svg className="w-3.5 h-3.5 text-[#176B5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Community Action</span>
        </div>
        <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#1F2A28]">
          {t('dashboard.raiseIssue.title')}
        </h2>
        <p className="mt-2 text-sm text-[#5C726E] leading-relaxed">
          {t('dashboard.raiseIssue.description')}
        </p>
      </div>

      <button
        onClick={onOpen}
        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99] shrink-0 font-outfit"
      >
        <span>{t('dashboard.raiseIssue.button')}</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  )
}

export default RaiseIssueBanner
