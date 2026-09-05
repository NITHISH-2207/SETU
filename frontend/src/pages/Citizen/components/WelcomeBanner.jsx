import { useAppTranslation } from '../../../hooks/useAppTranslation'

function WelcomeBanner({ userName = 'NITHISH' }) {
  const { t } = useAppTranslation()

  return (
    <div className="bg-linear-to-r from-[#176B5B] to-[#125649] rounded-2xl p-6 sm:p-8 text-white shadow-xs relative overflow-hidden select-none">
      {/* Subtle Background SVG Ring Vector */}
      <svg
        className="absolute -right-12 -bottom-12 w-64 h-64 pointer-events-none opacity-15"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 8" />
        <circle cx="100" cy="100" r="50" stroke="#FFFFFF" strokeWidth="3" />
      </svg>

      <div className="relative z-10 max-w-2xl">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/15 text-white backdrop-blur-xs border border-white/20 mb-3.5 font-outfit">
          <svg className="w-3.5 h-3.5 text-[#DCEFEA] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="tracking-wide">{t('dashboard.wardLocation')}</span>
        </div>

        <h1 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          {t('dashboard.welcomeTitle', { name: userName })}
        </h1>

        <p className="mt-2.5 text-sm sm:text-base text-white/85 font-outfit font-normal leading-relaxed">
          {t('dashboard.welcomeSubtitle')}
        </p>
      </div>
    </div>
  )
}

export default WelcomeBanner
