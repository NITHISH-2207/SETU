function GovernmentScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      {/* Prominent Line-Art Doodle for Government / Authority */}
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ambient Ring */}
        <circle cx="100" cy="100" r="75" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Civic Building & Columns Doodle */}
        <g className="animate-float-slow">
          {/* Pediment / Triangular Roof */}
          <polygon
            points="100,55 145,80 55,80"
            stroke="#176B5B"
            strokeWidth="2.5"
            fill="#DCEFEA"
            strokeLinejoin="round"
          />

          {/* Roof Base Architrave */}
          <rect
            x="52"
            y="80"
            width="96"
            height="8"
            rx="1"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#FFFFFF"
          />

          {/* 4 Pillars */}
          <line x1="65" y1="88" x2="65" y2="132" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="88" x2="88" y2="132" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="112" y1="88" x2="112" y2="132" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="135" y1="88" x2="135" y2="132" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Foundation Steps */}
          <rect
            x="48"
            y="132"
            width="104"
            height="8"
            rx="1"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#DCEFEA"
          />
        </g>

        {/* Policy Coordination / Approval Checkmark Badge */}
        <g className="animate-float-delayed">
          <circle cx="145" cy="65" r="12" fill="#E07A4E" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M140 65 L144 69 L151 61"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}

export default GovernmentScene
