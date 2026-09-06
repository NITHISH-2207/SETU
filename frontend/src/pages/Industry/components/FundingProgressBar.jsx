export default function FundingProgressBar({ currentFunding = 0, totalFundingRequired = 1, showDetails = true }) {
  const percentage = Math.min(100, Math.max(0, Math.round((currentFunding / totalFundingRequired) * 100)))
  const remaining = Math.max(0, totalFundingRequired - currentFunding)

  const formatRupee = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="w-full space-y-1.5 font-outfit">
      {showDetails && (
        <div className="flex items-center justify-between text-xs text-slate-700">
          <div className="font-medium">
            <span className="font-semibold text-slate-900 font-mono">{formatRupee(currentFunding)}</span>
            <span className="text-slate-500 font-normal"> of {formatRupee(totalFundingRequired)}</span>
          </div>
          <div className="font-mono text-xs text-slate-600 font-medium">
            {percentage}%
          </div>
        </div>
      )}

      {/* Bar track */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#176B5B] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <span>
            {remaining > 0 ? (
              <>
                <span className="font-mono text-slate-700 font-medium">{formatRupee(remaining)}</span> remaining
              </>
            ) : (
              <span className="text-emerald-700 font-medium">Fully Funded</span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

