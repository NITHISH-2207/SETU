function UniversityScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      {/* Prominent Line-Art Doodle for University / Academia */}
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Ambient Orbit */}
        <circle cx="100" cy="100" r="75" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Floating Mortarboard / Academic Cap Doodle */}
        <g className="animate-float-slow">
          {/* Cap Diamond */}
          <polygon
            points="100,50 145,65 100,80 55,65"
            stroke="#176B5B"
            strokeWidth="2.5"
            fill="#DCEFEA"
            strokeLinejoin="round"
          />
          {/* Cap Base */}
          <path
            d="M75 73 V88 C75 96, 125 96, 125 88 V73"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#F7FAF9"
          />
          {/* Tassel */}
          <path
            d="M145 65 V85"
            stroke="#E07A4E"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="145" cy="87" r="3" fill="#E07A4E" />
        </g>

        {/* Floating Open Book Doodle */}
        <g className="animate-float-delayed">
          {/* Left Page */}
          <path
            d="M65 130 C78 126, 92 127, 100 132 V152 C92 147, 78 146, 65 150 Z"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
          {/* Right Page */}
          <path
            d="M135 130 C122 126, 108 127, 100 132 V152 C108 147, 122 146, 135 150 Z"
            stroke="#176B5B"
            strokeWidth="2"
            fill="#FFFFFF"
            strokeLinejoin="round"
          />
        </g>

        {/* Idea Spark / Innovation Dot */}
        <circle cx="100" cy="108" r="4" fill="#E07A4E" className="animate-pulse" />
      </svg>
    </div>
  )
}

export default UniversityScene
