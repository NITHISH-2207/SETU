import { useEffect } from 'react'

function SplashNexusLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Scaled Single-Ring Circular SETU Loading Visual */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Single Ambient Base Circular Track */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r="76"
            stroke="#DCEFEA"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
        </svg>

        {/* Single Rotating Arc System with Coral Accent Node */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-nexus-circulate pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Primary Segmented Arc */}
            <circle
              cx="100"
              cy="100"
              r="76"
              stroke="#176B5B"
              strokeWidth="2.5"
              strokeDasharray="60 45 30 55"
              strokeLinecap="round"
            />
            {/* Subtle Soft Secondary Segment */}
            <circle
              cx="100"
              cy="100"
              r="76"
              stroke="#BFD9D2"
              strokeWidth="1.5"
              strokeDasharray="20 70"
              strokeLinecap="round"
            />
            {/* Coral Accent Signal Node */}
            <circle
              cx="176"
              cy="100"
              r="4.5"
              fill="#E07A4E"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Small Clean Connection Dot */}
            <circle
              cx="100"
              cy="24"
              r="3.5"
              fill="#176B5B"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Central Solid Dark Green SETU Circle (15-20% Scaled Up) */}
        <div className="relative z-10 w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-linear-to-b from-[#176B5B] to-[#125649] border-2 border-white shadow-md flex items-center justify-center text-white select-none animate-nexus-breathe">
          <span className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SETU
          </span>
        </div>
      </div>

      {/* SETU Official Tagline */}
      <p className="font-outfit text-sm sm:text-base text-[#1F2A28] font-normal tracking-wide mt-6">
        Societal Engagement &amp; Technology Utility
      </p>

      {/* Preparing Connections Status */}
      <p className="font-outfit text-xs font-medium text-[#5C726E] tracking-wider mt-2.5">
        Preparing connections<span className="inline-block animate-pulse">...</span>
      </p>
    </div>
  )
}

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, 2800)

    const handleKeyDown = () => onFinish()
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onFinish])

  return (
    <div
      onClick={onFinish}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-white cursor-pointer select-none px-6"
      role="region"
      aria-label="SETU Introduction Screen"
    >
      <div className="flex flex-col items-center text-center animate-fade-in">
        <SplashNexusLoader />
      </div>
    </div>
  )
}

export default SplashScreen
