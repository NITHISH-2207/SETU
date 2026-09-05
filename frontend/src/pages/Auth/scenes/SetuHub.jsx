function SetuHub({ size = 'md', className = '' }) {
  const isLarge = size === 'lg'
  const hubSize = isLarge ? 'w-24 h-24' : 'w-20 h-20'
  const ringSize = isLarge ? 'w-32 h-32' : 'w-28 h-28'

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Breathing Outer Glow */}
      <div
        className={`absolute ${ringSize} rounded-full bg-[#DCEFEA]/60 animate-pulse-glow blur-xs pointer-events-none`}
      />

      {/* Rotating Segmented Ring */}
      <svg
        className={`absolute ${ringSize} animate-spin-slow pointer-events-none`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#BFD9D2"
          strokeWidth="1.5"
          strokeDasharray="8 8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#176B5B"
          strokeWidth="2"
          strokeDasharray="28 80"
          strokeLinecap="round"
        />
      </svg>

      {/* Core Hub */}
      <div
        className={`${hubSize} rounded-full bg-linear-to-b from-[#176B5B] to-[#125649] border-2 border-white shadow-md flex flex-col items-center justify-center text-white relative z-10`}
      >
        {/* Coral Status Accent Dot */}
        <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#E07A4E] ring-2 ring-white animate-pulse" />

        <span className="font-syne text-base md:text-lg font-bold tracking-tight text-white leading-none">
          SETU
        </span>
      </div>
    </div>
  )
}

export default SetuHub
