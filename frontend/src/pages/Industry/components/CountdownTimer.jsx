import { useState, useEffect } from 'react'

function calculateRemaining(deadline) {
  const difference = new Date(deadline).getTime() - new Date().getTime()
  if (difference <= 0) return null
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

/**
 * Real-time Countdown Timer Component
 * Accepts an ISO string deadline date and updates every second.
 * Shows "Funding Closed" when expired in subtle neutral tone.
 */
export default function CountdownTimer({ deadline, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateRemaining(deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemaining(deadline)
      setTimeLeft(remaining)
      if (!remaining) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [deadline])

  if (!timeLeft) {
    return (
      <span className="text-xs font-medium text-slate-500">
        Funding Closed
      </span>
    )
  }

  const pad = (num) => String(num).padStart(2, '0')

  if (compact) {
    return (
      <span className="font-mono text-xs font-medium text-slate-700">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>
    )
  }

  // Full-size countdown blocks in neutral theme
  return (
    <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-800">
      {timeLeft.days > 0 && (
        <>
          <span>{pad(timeLeft.days)}d</span>
          <span className="text-slate-300">:</span>
        </>
      )}
      <span>{pad(timeLeft.hours)}h</span>
      <span className="text-slate-300">:</span>
      <span>{pad(timeLeft.minutes)}m</span>
      <span className="text-slate-300">:</span>
      <span>{pad(timeLeft.seconds)}s</span>
    </div>
  )
}

