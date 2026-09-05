import { useState } from 'react'

function UniversityVerification({ targetValue, targetType = 'Email', onVerified, isVerified = false }) {
  const [codeSent, setCodeSent] = useState(false)
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [errorMsg, setErrorMsg] = useState('')
  const [resendNotice, setResendNotice] = useState(false)

  const handleSendCode = () => {
    if (!targetValue || !targetValue.trim()) {
      setErrorMsg(`Please enter your ${targetType.toLowerCase()} first.`)
      return
    }
    setErrorMsg('')
    setCodeSent(true)
  }

  const handleDigitChange = (index, val) => {
    const clean = val.replace(/\D/g, '')
    const newDigits = [...digits]

    if (clean.length > 1) {
      const pasted = clean.slice(0, 6).split('')
      pasted.forEach((d, i) => {
        if (index + i < 6) newDigits[index + i] = d
      })
      setDigits(newDigits)
      if (newDigits.every((d) => d !== '')) {
        verifyCode(newDigits.join(''))
      }
      return
    }

    newDigits[index] = clean
    setDigits(newDigits)
    setErrorMsg('')

    // Auto-focus next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`univ-otp-${index + 1}`)
      nextInput?.focus()
    }

    if (newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const nextDigits = [...digits]
        nextDigits[index - 1] = ''
        setDigits(nextDigits)
        const prevInput = document.getElementById(`univ-otp-${index - 1}`)
        prevInput?.focus()
      } else if (digits[index]) {
        const nextDigits = [...digits]
        nextDigits[index] = ''
        setDigits(nextDigits)
      }
    }
  }

  const verifyCode = (enteredCode) => {
    if (enteredCode.length === 6) {
      onVerified(true)
      setErrorMsg('')
    } else {
      setErrorMsg('Please enter a 6-digit code.')
    }
  }

  const handleSimulateQuickVerify = () => {
    const mockDigits = ['1', '2', '3', '4', '5', '6']
    setDigits(mockDigits)
    onVerified(true)
    setErrorMsg('')
  }

  const handleResend = () => {
    setResendNotice(true)
    setTimeout(() => setResendNotice(false), 3000)
  }

  if (isVerified) {
    return (
      <div className="p-3 bg-[#DCEFEA]/60 border border-[#176B5B]/30 rounded-xl flex items-center justify-between font-outfit animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#176B5B]">
            {targetType} Verification Complete
          </span>
        </div>
        <span className="text-xs font-mono text-[#5C726E]">{targetValue}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3 font-outfit">
      {!codeSent ? (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleSendCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#DCEFEA] hover:bg-[#cbe8e0] text-[#176B5B] border border-[#BFD9D2] transition-colors cursor-pointer"
          >
            <span>Verify {targetType}</span>
            <span>→</span>
          </button>
          <span className="text-xs text-[#5C726E]">
            Verification code required to proceed
          </span>
        </div>
      ) : (
        <div className="p-4 bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl space-y-3 animate-fade-in shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#176B5B]">
              Enter 6-Digit Code sent to {targetValue}
            </label>
            <button
              type="button"
              onClick={handleSimulateQuickVerify}
              className="text-[11px] font-semibold text-[#176B5B] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-[#BFD9D2]"
            >
              Demo Auto-Fill
            </button>
          </div>

          <div className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-xs">
            {digits.map((digit, i) => (
              <input
                key={i}
                id={`univ-otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-10 h-11 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-bold font-syne bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5C726E] pt-1">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#176B5B] hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          </div>

          {resendNotice && (
            <p className="text-xs text-[#176B5B] font-medium animate-fade-in">
              ✓ A fresh 6-digit code has been dispatched.
            </p>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-[#E07A4E] font-medium animate-fade-in">
          {errorMsg}
        </p>
      )}
    </div>
  )
}

export default UniversityVerification
