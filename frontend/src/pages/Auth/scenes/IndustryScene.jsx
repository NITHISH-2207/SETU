function IndustryScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      {/* Prominent Line-Art Doodle for Industry / CSR */}
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ambient Ring */}
        <circle cx="100" cy="100" r="75" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Enterprise Building & Factory Skyline Doodle */}
        <g className="animate-float-slow">
          {/* Main Tower */}
          <rect
            x="65"
            y="70"
            width="32"
            height="75"
            rx="2"
            stroke="#176B5B"
            strokeWidth="2.5"
            fill="#DCEFEA"
          />
          {/* Windows */}
          <circle cx="76" cy="85" r="2.5" fill="#176B5B" />
          <circle cx="86" cy="85" r="2.5" fill="#176B5B" />
          <circle cx="76" cy="100" r="2.5" fill="#176B5B" />
          <circle cx="86" cy="100" r="2.5" fill="#176B5B" />
          <circle cx="76" cy="115" r="2.5" fill="#176B5B" />
          <circle cx="86" cy="115" r="2.5" fill="#176B5B" />

          {/* Secondary Facility Building */}
          <rect
            x="103"
            y="95"
            width="34"
            height="50"
            rx="2"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#FFFFFF"
          />
          {/* Facility Windows */}
          <rect x="110" y="105" width="8" height="8" rx="1" fill="#DCEFEA" />
          <rect x="122" y="105" width="8" height="8" rx="1" fill="#DCEFEA" />
        </g>

        {/* CSR Growth Trend / Gear Doodle */}
        <g className="animate-float-delayed">
          {/* Upward Resource Flow Arrow */}
          <path
            d="M135 85 L150 70 M150 70 L140 70 M150 70 L150 80"
            stroke="#E07A4E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="150" cy="70" r="3" fill="#E07A4E" />
        </g>

        {/* Ambient Scaling Base Line */}
        <path
          d="M50 145 H150"
          stroke="#BFD9D2"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default IndustryScene
