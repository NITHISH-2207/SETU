function StudentVisualScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Planetary Ring */}
        <ellipse cx="100" cy="115" rx="80" ry="32" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Central Problem / Research Core Cube */}
        <g className="animate-float-slow">
          {/* Isometric Innovation Cube */}
          <polygon points="100,58 132,74 100,90 68,74" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
          <polygon points="68,74 100,90 100,126 68,110" fill="#F7FAF9" stroke="#176B5B" strokeWidth="2" />
          <polygon points="100,90 132,74 132,110 100,126" fill="#176B5B" stroke="#125649" strokeWidth="2" />

          {/* Core Spark Indicator */}
          <circle cx="100" cy="90" r="5" fill="#E07A4E" stroke="#FFFFFF" strokeWidth="1.5" className="animate-pulse" />
        </g>

        {/* Collaborating Student Figure 1 (Left) */}
        <g className="animate-float-delayed">
          <circle cx="48" cy="85" r="7" fill="#176B5B" />
          <path d="M36 108 C36 98, 60 98, 60 108" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Connection beam to core */}
          <line x1="56" y1="96" x2="74" y2="92" stroke="#176B5B" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>

        {/* Collaborating Student Figure 2 (Right) */}
        <g className="animate-float-slow">
          <circle cx="152" cy="85" r="7" fill="#176B5B" />
          <path d="M140 108 C140 98, 164 98, 164 108" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Connection beam to core */}
          <line x1="144" y1="96" x2="126" y2="92" stroke="#176B5B" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>

        {/* Collaborating Student Figure 3 (Bottom Center) */}
        <g className="animate-float-delayed">
          <circle cx="100" cy="148" r="7" fill="#176B5B" />
          <path d="M88 170 C88 160, 112 160, 112 170" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Vertical connection beam */}
          <line x1="100" y1="130" x2="100" y2="140" stroke="#E07A4E" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Solution Ideation Nodes & Code / Data Badges */}
        <g className="animate-float-slow">
          <rect x="34" y="132" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.5" />
          <polyline points="39,141 43,145 51,137" stroke="#E07A4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g className="animate-float-delayed">
          <rect x="144" y="132" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#176B5B" strokeWidth="1.5" />
          <path d="M150 141 L154 137 M160 141 L156 145" stroke="#176B5B" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

export default StudentVisualScene
