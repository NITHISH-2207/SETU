import { useState, useRef } from 'react'

function OtpInput({ length = 6, onComplete, value, onChange }) {
  const [internalOtp, setInternalOtp] = useState(Array(length).fill(''))
  const inputRefs = useRef([])

  const otp = value && Array.isArray(value) ? value : internalOtp

  const updateOtp = (newOtp) => {
    if (!value) {
      setInternalOtp(newOtp)
    }
    onChange?.(newOtp)
  }

  const handleChange = (index, val) => {
    const cleanVal = val.replace(/\D/g, '')
    
    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, length).split('')
      const newOtp = [...otp]
      pastedDigits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit
        }
      })
      updateOtp(newOtp)
      const nextIdx = Math.min(index + pastedDigits.length, length - 1)
      inputRefs.current[nextIdx]?.focus()
      if (newOtp.every((d) => d !== '')) {
        onComplete?.(newOtp.join(''))
      }
      return
    }

    const newOtp = [...otp]
    newOtp[index] = cleanVal
    updateOtp(newOtp)

    if (cleanVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== '')) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        updateOtp(newOtp)
      } else if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        updateOtp(newOtp)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-10 h-11 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-bold font-syne bg-white border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all duration-150"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
    </div>
  )
}

export default OtpInput
