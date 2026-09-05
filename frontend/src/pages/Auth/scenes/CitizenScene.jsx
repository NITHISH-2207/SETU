function CitizenScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      {/* Prominent Line-Art Doodle for Citizen */}
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Ambient Ring */}
        <circle cx="100" cy="100" r="75" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Floating Citizen Doodle (Head & Torso) */}
        <g className="animate-float-slow">
          {/* Head */}
          <circle cx="85" cy="85" r="18" stroke="#176B5B" strokeWidth="2.5" fill="#F7FAF9" />
          <circle cx="85" cy="85" r="5" fill="#176B5B" />
          {/* Body */}
          <path
            d="M60 135 C60 115, 70 110, 85 110 C100 110, 110 115, 110 135"
            stroke="#176B5B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#DCEFEA"
          />
        </g>

        {/* Issue / Speech Bubble Doodle with Coral Accent */}
        <g className="animate-float-delayed">
          <path
            d="M115 65 C115 55, 125 45, 140 45 C155 45, 165 55, 165 65 C165 75, 155 83, 142 83 L135 90 L136 83 C125 83, 115 75, 115 65 Z"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#FFFFFF"
          />
          {/* Issue Marker Dot inside Bubble */}
          <circle cx="140" cy="64" r="4" fill="#E07A4E" />
        </g>

        {/* Connecting Dynamic Dotted Line */}
        <path
          d="M100 100 C120 100, 130 115, 145 130"
          stroke="#176B5B"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-dash-flow"
        />

        {/* Community Ground Line */}
        <circle cx="145" cy="130" r="10" stroke="#BFD9D2" strokeWidth="1.5" fill="#F7FAF9" />
        <circle cx="145" cy="130" r="3" fill="#176B5B" />
      </svg>
    </div>
  )
}

export default CitizenScene
