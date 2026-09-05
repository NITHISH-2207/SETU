function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  colorScheme = 'primary', // 'primary' | 'accent' | 'soft' | 'neutral'
  onClick,
}) {
  const getBadgeStyle = () => {
    switch (colorScheme) {
      case 'accent':
        return 'bg-[#E07A4E]/10 text-[#E07A4E] border-[#E07A4E]/30'
      case 'soft':
        return 'bg-[#DCEFEA] text-[#176B5B] border-[#BFD9D2]'
      case 'primary':
      default:
        return 'bg-[#176B5B]/10 text-[#176B5B] border-[#176B5B]/20'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#BFD9D2]/80 rounded-2xl p-5 sm:p-6 shadow-2xs transition-all duration-200 hover:shadow-xs hover:border-[#176B5B]/40 font-outfit ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#5C726E] uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <h3 className="font-syne text-2xl sm:text-3xl font-bold text-[#1F2A28] tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  trendPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${getBadgeStyle()}`}
          >
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-3 pt-3 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default StatCard
