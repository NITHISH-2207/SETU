import { STAKEHOLDER_ROLES } from '../Auth/rolesData.jsx'

function LandingPage({ onNavigate }) {
  const citizenRole = STAKEHOLDER_ROLES[0]

  const handleShareIssue = () => {
    // Bypasses the main role selection screen and navigates directly to Citizen Login
    onNavigate('auth-login', { role: citizenRole })
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* ====================================================
          1. HEADER / NAVIGATION
          ==================================================== */}
      <header className="w-full border-b border-[#BFD9D2]/40 bg-white/95 sticky top-0 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <span className="font-syne text-2xl md:text-3xl font-bold tracking-tight text-[#176B5B]">
              SETU
            </span>
            <span className="hidden sm:inline-block text-xs md:text-sm font-medium text-[#1F2A28]/60 font-outfit border-l border-[#BFD9D2] pl-3 py-0.5">
              Societal Engagement &amp; Technology Utility
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4 sm:gap-6 font-outfit">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-[#1F2A28] hover:text-[#176B5B] transition-colors py-2 px-3 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-md cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center justify-center text-sm font-medium text-white bg-linear-to-b from-[#176B5B] to-[#135A4D] hover:from-[#156152] hover:to-[#0F4A3F] px-4 sm:px-5 py-2.5 rounded-lg shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* ====================================================
            2 & 3. HERO SECTION & HERO ACTIONS
            ==================================================== */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B] bg-[#DCEFEA]/60 border border-[#BFD9D2]/60 mb-6">
                Collaborative Problem Solving
              </span>

              <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2A28] leading-[1.12]">
                Every issue deserves a pathway to action.
              </h1>

              <p className="mt-6 font-outfit text-base sm:text-lg text-[#1F2A28]/80 leading-relaxed max-w-2xl font-normal">
                SETU transforms real-world challenges into verified impact by connecting citizens, academic institutions, public authorities, and CSR partners on a unified collaboration platform.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto font-outfit">
                <button
                  onClick={() => onNavigate('signup')}
                  className="inline-flex items-center justify-center text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-7 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                >
                  Get Started
                </button>
                <button
                  onClick={handleShareIssue}
                  className="inline-flex items-center justify-center text-base font-medium text-[#176B5B] bg-[#F7FAF9] hover:bg-[#DCEFEA]/50 border border-[#BFD9D2] px-6 py-3.5 rounded-xl transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer active:scale-[0.99]"
                >
                  Share an Issue
                </button>
              </div>
            </div>

            {/* Hero Visual — Inline Abstract Pathway SVG */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#F7FAF9] border border-[#BFD9D2]/70 shadow-xs relative">
                <svg
                  viewBox="0 0 360 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-label="Abstract diagram showing societal issue moving through SETU matching to collaborative action and verified impact"
                >
                  {/* Outer Ambient Flow Lines */}
                  <path
                    d="M30 60 C110 60, 140 140, 200 140 C260 140, 290 80, 330 80"
                    stroke="#DCEFEA"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M30 220 C110 220, 140 140, 200 140 C260 140, 290 200, 330 200"
                    stroke="#DCEFEA"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  {/* Upstream Branches (Inputs / Societal Issues) */}
                  <path
                    d="M50 80 C110 80, 150 130, 200 140"
                    stroke="#176B5B"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 140 C110 140, 150 140, 200 140"
                    stroke="#176B5B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 200 C110 200, 150 150, 200 140"
                    stroke="#176B5B"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                  />

                  {/* Left Node: Citizen / Community */}
                  <circle cx="50" cy="80" r="6" fill="#176B5B" />
                  <circle cx="50" cy="80" r="3" fill="#FFFFFF" />
                  <text x="50" y="62" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle" fontWeight="500">Citizen</text>

                  {/* Left Node: Issue Origin */}
                  <circle cx="40" cy="140" r="7" fill="#176B5B" />
                  <circle cx="40" cy="140" r="3.5" fill="#FFFFFF" />
                  <text x="40" y="165" fill="#176B5B" fontSize="11" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Issue</text>

                  {/* Left Node: Institution / Partner */}
                  <circle cx="50" cy="200" r="6" fill="#176B5B" />
                  <circle cx="50" cy="200" r="3" fill="#FFFFFF" />
                  <text x="50" y="224" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle" fontWeight="500">Community</text>

                  {/* Central SETU Hub Node */}
                  <circle cx="200" cy="140" r="16" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="200" cy="140" r="7" fill="#176B5B" />
                  <circle cx="200" cy="140" r="3" fill="#FFFFFF" />
                  <text x="200" y="174" fill="#176B5B" fontSize="12" fontFamily="Syne" textAnchor="middle" fontWeight="700">SETU</text>
                  <text x="200" y="188" fill="#5C726E" fontSize="9" fontFamily="Outfit" textAnchor="middle">Match &amp; Connect</text>

                  {/* Downstream Path to Action & Impact */}
                  <path
                    d="M200 140 C240 140, 270 140, 310 140"
                    stroke="#176B5B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Right Action & Impact Node */}
                  <circle cx="314" cy="140" r="11" fill="#E07A4E" fillOpacity="0.2" />
                  <circle cx="314" cy="140" r="7" fill="#E07A4E" />
                  <circle cx="314" cy="140" r="3" fill="#FFFFFF" />
                  <text x="314" y="166" fill="#E07A4E" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Action</text>
                  <text x="314" y="179" fill="#5C726E" fontSize="9" fontFamily="Outfit" textAnchor="middle">Verified Impact</text>
                </svg>

                {/* Subtitle caption under visual */}
                <div className="mt-4 pt-3 border-t border-[#BFD9D2]/50 flex items-center justify-between text-xs text-[#5C726E] font-outfit">
                  <span>Structured Collaboration</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#176B5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A4E]" />
                    Verified Outcomes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            4. SETU ECOSYSTEM / CONNECTION SECTION
            ==================================================== */}
        <section className="border-t border-[#BFD9D2]/50 bg-white py-18 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-left mb-12 sm:mb-16">
              <span className="text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B]">
                The Ecosystem
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28] mt-2">
                Connecting Society&apos;s Problem Solvers
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                SETU is the collaborative bridge bringing four core stakeholder pillars together around verified real-world challenges.
              </p>
            </div>

            {/* Ecosystem SVG Pathway Diagram */}
            <div className="bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-2xl p-6 sm:p-10 shadow-xs">
              <div className="w-full max-w-4xl mx-auto">
                <svg
                  viewBox="0 0 800 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-label="SETU ecosystem diagram showing Citizens, Universities, Government, and CSR connecting through SETU to Collaborative Action and Verified Impact"
                >
                  {/* Ambient Connecting Flow Lines */}
                  <path d="M160 60 C280 60, 320 160, 400 160" stroke="#BFD9D2" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M160 120 C270 120, 310 160, 400 160" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M160 200 C270 200, 310 160, 400 160" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M160 260 C280 260, 320 160, 400 160" stroke="#BFD9D2" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Central Hub to Outcomes */}
                  <path d="M400 160 C490 160, 540 110, 640 110" stroke="#176B5B" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M400 160 C490 160, 540 210, 640 210" stroke="#E07A4E" strokeWidth="3" strokeLinecap="round" />

                  {/* Left Stakeholder Pillar Nodes */}
                  {/* Pillar 1: Citizen & Community */}
                  <circle cx="160" cy="60" r="9" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="160" cy="60" r="4.5" fill="#176B5B" />
                  <text x="140" y="64" fill="#1F2A28" fontSize="13" fontFamily="Outfit" textAnchor="end" fontWeight="600">Citizen &amp; Community</text>
                  <text x="140" y="78" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="end">Ground Reality &amp; Local Issues</text>

                  {/* Pillar 2: University & Academia */}
                  <circle cx="160" cy="120" r="9" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="160" cy="120" r="4.5" fill="#176B5B" />
                  <text x="140" y="124" fill="#1F2A28" fontSize="13" fontFamily="Outfit" textAnchor="end" fontWeight="600">University &amp; R&amp;D</text>
                  <text x="140" y="138" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="end">Research &amp; Student Projects</text>

                  {/* Pillar 3: Government & Authorities */}
                  <circle cx="160" cy="200" r="9" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="160" cy="200" r="4.5" fill="#176B5B" />
                  <text x="140" y="204" fill="#1F2A28" fontSize="13" fontFamily="Outfit" textAnchor="end" fontWeight="600">Government &amp; Public Bodies</text>
                  <text x="140" y="218" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="end">Policy Support &amp; Civic Execution</text>

                  {/* Pillar 4: CSR & Industry */}
                  <circle cx="160" cy="260" r="9" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="160" cy="260" r="4.5" fill="#176B5B" />
                  <text x="140" y="264" fill="#1F2A28" fontSize="13" fontFamily="Outfit" textAnchor="end" fontWeight="600">CSR &amp; Industry</text>
                  <text x="140" y="278" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="end">Funding, Resources &amp; Scale</text>

                  {/* Central SETU Connector Hub */}
                  <circle cx="400" cy="160" r="32" fill="#FFFFFF" stroke="#BFD9D2" strokeWidth="2" />
                  <circle cx="400" cy="160" r="24" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="400" cy="160" r="10" fill="#176B5B" />
                  <circle cx="400" cy="160" r="4" fill="#FFFFFF" />
                  <text x="400" y="204" fill="#176B5B" fontSize="14" fontFamily="Syne" textAnchor="middle" fontWeight="700">SETU</text>
                  <text x="400" y="218" fill="#5C726E" fontSize="11" fontFamily="Outfit" textAnchor="middle">Curate • Match • Align</text>

                  {/* Right Destination Nodes */}
                  {/* Outcome 1: Collaborative Execution */}
                  <circle cx="640" cy="110" r="10" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="640" cy="110" r="5" fill="#176B5B" />
                  <text x="660" y="114" fill="#1F2A28" fontSize="13" fontFamily="Outfit" textAnchor="start" fontWeight="600">Collaborative Execution</text>
                  <text x="660" y="128" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="start">Joint Projects &amp; Field Pilots</text>

                  {/* Outcome 2: Verified Impact */}
                  <circle cx="640" cy="210" r="14" fill="#E07A4E" fillOpacity="0.2" />
                  <circle cx="640" cy="210" r="9" fill="#E07A4E" />
                  <circle cx="640" cy="210" r="4" fill="#FFFFFF" />
                  <text x="660" y="214" fill="#E07A4E" fontSize="13" fontFamily="Outfit" textAnchor="start" fontWeight="600">Verified Impact</text>
                  <text x="660" y="228" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="start">Measurable Societal Solutions</text>
                </svg>
              </div>

              {/* Minimal Four-Pillar Legend Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#BFD9D2]/50 font-outfit text-xs">
                <div className="flex items-center gap-2 text-[#1F2A28]">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B] shrink-0" />
                  <span className="font-medium">Citizen Voice</span>
                </div>
                <div className="flex items-center gap-2 text-[#1F2A28]">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B] shrink-0" />
                  <span className="font-medium">Academic R&amp;D</span>
                </div>
                <div className="flex items-center gap-2 text-[#1F2A28]">
                  <span className="w-2 h-2 rounded-full bg-[#176B5B] shrink-0" />
                  <span className="font-medium">Civic Authority</span>
                </div>
                <div className="flex items-center gap-2 text-[#1F2A28]">
                  <span className="w-2 h-2 rounded-full bg-[#E07A4E] shrink-0" />
                  <span className="font-medium">CSR &amp; Industry Scale</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            5. HOW SETU WORKS
            ==================================================== */}
        <section id="how-it-works" className="border-t border-[#BFD9D2]/50 bg-[#F7FAF9] py-18 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-left mb-14 sm:mb-16">
              <span className="text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B]">
                Framework
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28] mt-2">
                How SETU Works
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                A streamlined three-step pathway from ground reality to collaborative execution.
              </p>
            </div>

            {/* 3 Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 font-outfit">
              {/* Step 1 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#176B5B] uppercase mb-4">
                    01 — Share
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-2">
                    Submit Issue
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    Citizens and communities log real-world challenges with local context and evidence.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Ground reality &amp; community validation
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#176B5B] uppercase mb-4">
                    02 — Connect
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-2">
                    Curate &amp; Match
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    SETU categorizes and routes issues to relevant institutions, experts, and partners.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Intelligent routing &amp; stakeholder alignment
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#E07A4E] uppercase mb-4">
                    03 — Solve
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-2">
                    Collaborative Action
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    Institutions, industry, and authorities execute coordinated solutions with verified outcomes.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Pilots, policy support &amp; measurable impact
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            6. OUTCOME / IMPACT SECTION
            ==================================================== */}
        <section className="border-t border-[#BFD9D2]/50 bg-white py-18 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-left mb-12 sm:mb-16">
              <span className="text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B]">
                Verified Outcomes
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28] mt-2">
                Beyond Reporting to Real Resolution
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                SETU doesn&apos;t stop at logging complaints — every issue moves through a clear milestone track toward tangible societal change.
              </p>
            </div>

            {/* Lifecycle Visual Track */}
            <div className="bg-[#F7FAF9] border border-[#BFD9D2]/70 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
              <div className="w-full">
                <svg
                  viewBox="0 0 760 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-label="Progressive milestone track from Issue to Connection, Collaboration, Action, and Impact"
                >
                  {/* Connecting Track Line */}
                  <path d="M50 50 L710 50" stroke="#BFD9D2" strokeWidth="2.5" strokeDasharray="4 4" />
                  <path d="M50 50 L530 50" stroke="#176B5B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M530 50 L710 50" stroke="#E07A4E" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Milestone 1: Issue */}
                  <circle cx="50" cy="50" r="10" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="50" cy="50" r="5" fill="#176B5B" />
                  <text x="50" y="80" fill="#1F2A28" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Issue</text>
                  <text x="50" y="94" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle">Ground Context</text>

                  {/* Milestone 2: Connection */}
                  <circle cx="215" cy="50" r="10" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="215" cy="50" r="5" fill="#176B5B" />
                  <text x="215" y="80" fill="#1F2A28" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Connection</text>
                  <text x="215" y="94" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle">Stakeholder Match</text>

                  {/* Milestone 3: Collaboration */}
                  <circle cx="380" cy="50" r="10" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="380" cy="50" r="5" fill="#176B5B" />
                  <text x="380" y="80" fill="#1F2A28" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Collaboration</text>
                  <text x="380" y="94" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle">R&amp;D &amp; Resources</text>

                  {/* Milestone 4: Action */}
                  <circle cx="545" cy="50" r="10" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="545" cy="50" r="5" fill="#176B5B" />
                  <text x="545" y="80" fill="#1F2A28" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Action</text>
                  <text x="545" y="94" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle">Pilot &amp; Execution</text>

                  {/* Milestone 5: Verified Impact */}
                  <circle cx="710" cy="50" r="13" fill="#E07A4E" fillOpacity="0.2" />
                  <circle cx="710" cy="50" r="8" fill="#E07A4E" />
                  <circle cx="710" cy="50" r="3.5" fill="#FFFFFF" />
                  <text x="710" y="80" fill="#E07A4E" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Impact</text>
                  <text x="710" y="94" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle">Verified Resolution</text>
                </svg>
              </div>
            </div>

            {/* Concise Impact Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-outfit">
              <div className="p-6 rounded-xl border border-[#BFD9D2]/60 bg-white">
                <span className="text-xs font-semibold text-[#176B5B] uppercase tracking-wider block mb-1">
                  Validation
                </span>
                <h3 className="font-syne font-bold text-[#1F2A28] text-base mb-1">
                  Evidence-Backed Context
                </h3>
                <p className="text-xs text-[#5C726E] leading-relaxed">
                  Community issues carry ground data, geolocation, and direct civic validation.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#BFD9D2]/60 bg-white">
                <span className="text-xs font-semibold text-[#176B5B] uppercase tracking-wider block mb-1">
                  Accountability
                </span>
                <h3 className="font-syne font-bold text-[#1F2A28] text-base mb-1">
                  Multi-Sector Ownership
                </h3>
                <p className="text-xs text-[#5C726E] leading-relaxed">
                  Academia, government, and industry share ownership of solutions from pilot to scale.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#BFD9D2]/60 bg-white">
                <span className="text-xs font-semibold text-[#E07A4E] uppercase tracking-wider block mb-1">
                  Transparency
                </span>
                <h3 className="font-syne font-bold text-[#1F2A28] text-base mb-1">
                  Milestone-Driven Tracking
                </h3>
                <p className="text-xs text-[#5C726E] leading-relaxed">
                  Every step in the resolution journey is visible, trackable, and verifiable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            7. FINAL CTA
            ==================================================== */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-18 sm:py-24">
          <div className="rounded-2xl border border-[#BFD9D2] bg-white p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xs">
            <div className="max-w-xl">
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#1F2A28] tracking-tight">
                Ready to create an impact?
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                Join citizens, researchers, public leaders, and industry partners on SETU today.
              </p>
            </div>
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center justify-center text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-8 py-4 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer font-outfit shrink-0 active:scale-[0.99]"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      {/* ====================================================
          FOOTER
          ==================================================== */}
      <footer className="border-t border-[#BFD9D2]/40 py-8 bg-white text-xs text-[#5C726E] font-outfit">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold text-[#176B5B]">SETU</span>
            <span>— Societal Engagement &amp; Technology Utility</span>
          </div>
          <div>
            A digital platform for societal action and collaboration.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
