import SetuNexus from './SetuNexus.jsx'

function GovernmentScene() {
  return (
    <div className="relative w-full h-[320px] bg-white rounded-xl border border-[#BFD9D2]/70 p-4 overflow-hidden flex items-center justify-center select-none">
      {/* Background SVG Governance Coordination Grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Coordination Geometric Lines */}
        <path
          d="M80 75 L200 160"
          stroke="#176B5B"
          strokeWidth="1.5"
          className="animate-dash-flow"
        />
        <path
          d="M80 245 L200 160"
          stroke="#176B5B"
          strokeWidth="1.5"
          className="animate-dash-flow"
        />
        <path
          d="M200 160 L320 160"
          stroke="#176B5B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Ambient Ring */}
        <circle cx="200" cy="160" r="110" stroke="#DCEFEA" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Top Left: Public Department / Ward Card */}
      <div className="absolute top-6 left-6 animate-float-slow z-10">
        <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-xl p-3 shadow-2xs font-outfit text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-[#176B5B] text-white flex items-center justify-center text-[10px]">
              🏛️
            </div>
            <span className="text-[11px] font-bold text-[#176B5B]">Public Administration</span>
          </div>
          <p className="text-[9px] text-[#5C726E]">Ward 24 infrastructure pipeline</p>
        </div>
      </div>

      {/* Bottom Left: Policy Alignment Node */}
      <div className="absolute bottom-6 left-8 animate-float-delayed z-10">
        <div className="bg-white border border-[#BFD9D2] rounded-lg px-3 py-2 shadow-2xs flex items-center gap-2 font-outfit">
          <span className="w-2 h-2 rounded-full bg-[#176B5B] animate-pulse" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-[#1F2A28]">Scheme Matching</p>
            <p className="text-[9px] text-[#5C726E]">State welfare program #302</p>
          </div>
        </div>
      </div>

      {/* Center: SETU Nexus */}
      <div className="relative z-20">
        <SetuNexus size="md" />
      </div>

      {/* Top Right: Departmental Sync Status */}
      <div className="absolute top-7 right-8 animate-float-slow z-10">
        <div className="bg-white border border-[#BFD9D2] rounded-full px-3 py-1 shadow-2xs flex items-center gap-1.5 font-outfit text-[11px] text-[#176B5B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]" />
          <span className="font-semibold">Civic Depts</span> Synced
        </div>
      </div>

      {/* Right: Coordinated Action Node */}
      <div className="absolute right-6 top-[38%] z-10 animate-float-delayed flex flex-col items-center">
        <div className="bg-[#F7FAF9] border-2 border-[#E07A4E] rounded-xl p-3 shadow-xs font-outfit text-center">
          <div className="w-7 h-7 rounded-full bg-[#E07A4E] text-white mx-auto flex items-center justify-center font-bold text-xs mb-1">
            ⚖️
          </div>
          <h4 className="font-syne text-[11px] font-bold text-[#1F2A28]">Coordinated Action</h4>
          <p className="text-[9px] text-[#5C726E]">Inter-agency execution</p>
        </div>
      </div>
    </div>
  )
}

export default GovernmentScene
