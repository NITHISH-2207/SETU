import SetuNexus from './SetuNexus.jsx'

function CitizenFigure({ label, role, className = '', color = 'teal' }) {
  const isTeal = color === 'teal'
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Abstract geometric head & torso */}
      <div className="relative flex flex-col items-center">
        <div
          className={`w-6 h-6 rounded-full border-2 border-white shadow-2xs flex items-center justify-center ${
            isTeal ? 'bg-[#176B5B]' : 'bg-[#DCEFEA] border-[#176B5B]'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isTeal ? 'bg-white' : 'bg-[#176B5B]'}`} />
        </div>
        <div
          className={`w-8 h-4 rounded-t-lg -mt-0.5 border border-white/60 ${
            isTeal ? 'bg-[#176B5B]/80' : 'bg-[#DCEFEA]'
          }`}
        />
      </div>
      {label && (
        <span className="font-outfit text-[11px] font-medium text-[#1F2A28] mt-1 bg-white/90 px-1.5 py-0.5 rounded-sm border border-[#BFD9D2]/60 shadow-2xs">
          {label}
        </span>
      )}
      {role && (
        <span className="font-outfit text-[9px] text-[#5C726E]">{role}</span>
      )}
    </div>
  )
}

function CitizenScene() {
  return (
    <div className="relative w-full h-[320px] bg-white rounded-xl border border-[#BFD9D2]/70 p-4 overflow-hidden flex items-center justify-center select-none">
      {/* Background SVG Grid & Energy Flowlines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Converging Dotted Energy Lines */}
        <path
          d="M60 70 C130 70, 150 160, 200 160"
          stroke="#176B5B"
          strokeWidth="1.5"
          className="animate-dash-flow"
        />
        <path
          d="M60 250 C130 250, 150 160, 200 160"
          stroke="#176B5B"
          strokeWidth="1.5"
          className="animate-dash-flow"
        />
        <path
          d="M100 160 L200 160"
          stroke="#176B5B"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M200 160 C250 160, 280 160, 340 160"
          stroke="#176B5B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Ambient Ring */}
        <circle cx="200" cy="160" r="110" stroke="#DCEFEA" strokeWidth="1" strokeDasharray="6 6" />
      </svg>

      {/* Top Left: Citizen Figure A */}
      <div className="absolute top-6 left-6 animate-float-slow">
        <CitizenFigure label="Resident" role="Community Reporter" color="teal" />
      </div>

      {/* Bottom Left: Citizen Figure B */}
      <div className="absolute bottom-6 left-8 animate-float-delayed">
        <CitizenFigure label="Volunteer" role="Local Ward" color="soft" />
      </div>

      {/* Center Left: Floating Issue Card */}
      <div className="absolute left-20 top-[40%] animate-float-slow z-10">
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg p-2.5 shadow-2xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E07A4E] animate-pulse" />
          <div className="font-outfit text-left">
            <p className="text-[10px] font-bold text-[#176B5B]">Community Issue</p>
            <p className="text-[9px] text-[#5C726E]">Water supply report #108</p>
          </div>
        </div>
      </div>

      {/* Center: SETU Nexus */}
      <div className="relative z-20">
        <SetuNexus size="md" />
      </div>

      {/* Top Right: Floating Support Verification Pill */}
      <div className="absolute top-8 right-8 animate-float-delayed z-10">
        <div className="bg-white border border-[#BFD9D2] rounded-full px-3 py-1 shadow-2xs flex items-center gap-1.5 font-outfit text-[11px] text-[#176B5B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
          <span className="font-semibold">+48 Residents</span> Verified
        </div>
      </div>

      {/* Right: Resolved Action Node */}
      <div className="absolute right-6 top-[42%] z-10 animate-float-slow flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-linear-to-b from-[#E07A4E] to-[#C9663D] border-2 border-white shadow-sm flex items-center justify-center text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="font-syne text-xs font-bold text-[#E07A4E] mt-1.5">Action</span>
        <span className="font-outfit text-[9px] text-[#5C726E]">Verified Solution</span>
      </div>
    </div>
  )
}

export default CitizenScene
