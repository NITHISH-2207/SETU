import { useEffect } from 'react'

function SplashCoreLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Clean Single-Ring Circular SETU Loading Visual */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Single Elegant Rotating Orbit Ring */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-orbit-rotate pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Single Smooth Primary Arc */}
            <circle
              cx="100"
              cy="100"
              r="76"
              stroke="#176B5B"
              strokeWidth="2.5"
              strokeDasharray="120 360"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Central Solid Dark Green SETU Circle */}
        <div className="relative z-10 w-24 h-24 sm:w-26 sm:h-26 rounded-full bg-linear-to-b from-[#176B5B] to-[#125649] border-2 border-white shadow-md flex items-center justify-center text-white select-none animate-core-breathe">
          <span className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SETU
          </span>
        </div>
      </div>

      {/* SETU Official Tagline */}
      <p className="font-outfit text-sm sm:text-base text-[#1F2A28] font-normal tracking-wide mt-6">
        Societal Engagement &amp; Technology Utility
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
        <SplashCoreLoader />
      </div>
    </div>
  )
}

export default SplashScreen
