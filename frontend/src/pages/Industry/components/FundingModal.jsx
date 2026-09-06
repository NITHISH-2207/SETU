import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function FundingModal({ problem, onClose, onConfirmFunding }) {
  const { t } = useTranslation()

  const remaining = Math.max(0, problem.totalFundingRequired - problem.currentFunding)
  const [amount, setAmount] = useState(remaining > 0 ? String(remaining) : '0')
  const [error, setError] = useState('')
  const [showPaymentPlaceholder, setShowPaymentPlaceholder] = useState(false)

  const formatRupee = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  const quickAmounts = [5000, 10000, 25000].filter((v) => v < remaining)

  const handleQuickAmount = (val) => {
    setError('')
    setAmount(String(Math.min(val, remaining)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const numVal = Number(amount)
    if (!amount || isNaN(numVal)) { setError('Please enter a valid numeric funding amount.'); return }
    if (numVal <= 0) { setError('Funding amount must be greater than ₹0.'); return }
    if (numVal > remaining) { setError(`Amount cannot exceed the remaining requirement of ${formatRupee(remaining)}.`); return }
    setShowPaymentPlaceholder(true)
  }

  const handleSimulateFinish = () => {
    onConfirmFunding(problem.id, Number(amount))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-outfit"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="p-6 space-y-5">
          {!showPaymentPlaceholder ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  {t('csr.pledgeTitle', 'CSR Corporate Grant Pledge')}
                </span>
                <h2 className="font-syne text-base font-semibold text-slate-900 line-clamp-2">{problem.title}</h2>
                <span className="text-xs text-slate-500 mt-0.5 block">{problem.id} • {problem.category}</span>
              </div>

              {/* Funding Summary */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t('csr.totalRequired', 'Total Requirement:')}</span>
                  <span className="font-semibold text-slate-900 font-mono">{formatRupee(problem.totalFundingRequired)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('csr.alreadyFunded', 'Already Funded:')}</span>
                  <span className="font-semibold text-[#176B5B] font-mono">{formatRupee(problem.currentFunding)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/80">
                  <span className="font-semibold text-slate-900">{t('csr.maxAllowed', 'Max Allowed Pledge:')}</span>
                  <span className="font-semibold text-slate-900 font-mono">{formatRupee(remaining)}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  {t('csr.enterAmount', 'Enter Funding Amount (₹)')}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError('') }}
                  placeholder="e.g. 25000"
                  max={remaining}
                  min={1}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-base font-semibold text-slate-900 focus:outline-none focus:border-[#176B5B]"
                />

                {/* Quick Select */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 self-center">{t('csr.quickSelect', 'Quick:')}</span>
                  {quickAmounts.map((qVal) => (
                    <button
                      key={qVal}
                      type="button"
                      onClick={() => handleQuickAmount(qVal)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-mono transition-colors cursor-pointer"
                    >
                      {formatRupee(qVal)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(remaining)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    {t('csr.fullRemaining', 'Full Remaining')}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md font-medium">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer text-center"
                >
                  {t('csr.continuePayment', 'Continue to Payment')} →
                </button>
              </div>
            </form>
          ) : (
            /* Payment Placeholder */
            <div className="text-center space-y-4 py-2">
              <div>
                <h3 className="font-syne text-base font-semibold text-slate-900">
                  {t('csr.paymentPlaceholderTitle', 'Payment Gateway Integration')}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t('csr.paymentPlaceholderDesc', 'In production, clicking this will securely open the Razorpay / Banking Payment Gateway order window for grant disbursement.')}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pledged Amount:</span>
                  <span className="font-semibold text-slate-900 font-mono">{formatRupee(Number(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-medium text-slate-800">SETU CSR Escrow</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Problem:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">{problem.title}</span>
                </div>
              </div>

              <button
                onClick={handleSimulateFinish}
                className="w-full py-2.5 px-4 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer text-center block"
              >
                {t('csr.simulateSuccess', 'Simulate Successful Funding')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

