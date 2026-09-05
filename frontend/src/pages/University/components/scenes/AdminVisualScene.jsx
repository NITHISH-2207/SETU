function AdminVisualScene() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[340px] bg-white rounded-xl border border-[#BFD9D2]/60 p-6 sm:p-8 overflow-hidden flex items-center justify-center select-none shadow-2xs">
      <svg
        className="w-56 h-56 sm:w-68 sm:h-68 lg:w-76 lg:h-76 max-w-full max-h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Grid Orbit */}
        <circle cx="100" cy="100" r="78" stroke="#DCEFEA" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="100" cy="100" r="50" stroke="#DCEFEA" strokeWidth="1" />

        {/* Connecting Workflow Lines */}
        <path d="M100 55 L50 120 L150 120 Z" stroke="#176B5B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <line x1="100" y1="55" x2="100" y2="155" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="120" x2="150" y2="120" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" />

        {/* Central Institution / Administration Node */}
        <g className="animate-float-slow">
          {/* Main Institution Building Block */}
          <rect x="76" y="80" width="48" height="42" rx="6" fill="#176B5B" stroke="#125649" strokeWidth="2" />
          {/* Roof Pediment */}
          <polygon points="100,60 128,78 72,78" fill="#176B5B" stroke="#125649" strokeWidth="2" />
          {/* Pillared Structure Lines */}
          <line x1="86" y1="92" x2="86" y2="114" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="92" x2="100" y2="114" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="114" y1="92" x2="114" y2="114" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Approval Stamp Badge */}
          <circle cx="124" cy="74" r="8" fill="#E07A4E" stroke="#FFFFFF" strokeWidth="1.5" />
          <polyline points="121,74 123,76 127,72" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Top Node: Institutional Governance */}
        <g className="animate-float-delayed">
          <circle cx="100" cy="42" r="14" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2.5" />
          <path d="M94 42 H106 M100 36 V48" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="42" r="4" fill="#E07A4E" />
        </g>

        {/* Left Node: Mentor & Faculty Approvals */}
        <g className="animate-float-slow">
          <rect x="36" y="108" width="28" height="28" rx="6" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <circle cx="50" cy="118" r="4" fill="#176B5B" />
          <path d="M43 128 C43 124, 57 124, 57 128" stroke="#176B5B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Right Node: Student Verification & Projects */}
        <g className="animate-float-delayed">
          <rect x="136" y="108" width="28" height="28" rx="6" fill="#FFFFFF" stroke="#176B5B" strokeWidth="2" />
          <polygon points="150,113 158,118 150,123 142,118" fill="#DCEFEA" stroke="#176B5B" strokeWidth="1.5" />
          <path d="M145 120 V126 C145 129, 155 129, 155 126 V120" stroke="#176B5B" strokeWidth="1.5" />
        </g>

        {/* Bottom Node: Verified University Gateway */}
        <g className="animate-float-slow">
          <circle cx="100" cy="158" r="14" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
          <polyline points="95,158 98,161 105,154" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  )
}

export default AdminVisualScene
