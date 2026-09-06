function MentorVisualScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Concentric Radar Rings */}
        <circle cx="100" cy="100" r="75" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="100" cy="100" r="48" stroke="#DCEFEA" strokeWidth="1" />

        {/* Dynamic Radiating Link Vectors */}
        <line x1="100" y1="100" x2="52" y2="60" stroke="#176B5B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="100" y1="100" x2="148" y2="60" stroke="#176B5B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="100" y1="100" x2="48" y2="140" stroke="#176B5B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="100" y1="100" x2="152" y2="140" stroke="#176B5B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="100" y1="100" x2="100" y2="168" stroke="#176B5B" strokeWidth="2" />

        {/* Central Expert / Mentor Node */}
        <g className="animate-float-slow">
          {/* Glowing Aura Ring */}
          <circle cx="100" cy="100" r="28" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2.5" />
          {/* Expert Figure Line Icon */}
          <circle cx="100" cy="92" r="8" fill="#176B5B" />
          <path d="M86 114 C86 106, 114 106, 114 114" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Expert Spark Pin */}
          <circle cx="118" cy="84" r="5" fill="#E07A4E" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* Satellite Node 1: Research Paper / Study */}
        <g className="animate-float-delayed">
          <rect x="38" y="46" width="28" height="28" rx="6" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <line x1="44" y1="54" x2="56" y2="54" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="60" x2="60" y2="60" stroke="#176B5B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="66" x2="52" y2="66" stroke="#E07A4E" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Satellite Node 2: Student Mentee Pod */}
        <g className="animate-float-slow">
          <circle cx="148" cy="60" r="14" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <polygon points="148,54 156,59 148,64 140,59" fill="#DCEFEA" stroke="#176B5B" strokeWidth="1.5" />
          <circle cx="148" cy="67" r="2" fill="#E07A4E" />
        </g>

        {/* Satellite Node 3: Laboratory / Technical Prototype */}
        <g className="animate-float-delayed">
          <circle cx="48" cy="140" r="14" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <path d="M44 144 L48 135 L52 144 Z" stroke="#176B5B" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="48" cy="141" r="2" fill="#176B5B" />
        </g>

        {/* Satellite Node 4: Community Impact Verified */}
        <g className="animate-float-slow">
          <circle cx="152" cy="140" r="14" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <polyline points="146,140 150,144 158,136" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Satellite Node 5: Field Deployment */}
        <g className="animate-float-delayed">
          <rect x="88" y="156" width="24" height="24" rx="6" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
          <path d="M100 162 V174 M94 168 H106" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

export default MentorVisualScene
