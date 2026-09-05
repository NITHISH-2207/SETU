function LandingPage({ onNavigate }) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Navigation */}
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
              Get Started <span className="ml-1.5 transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
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
                Connecting citizens, institutions, experts, industry, and government to resolve societal issues.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto font-outfit">
                <button
                  onClick={() => onNavigate('signup')}
                  className="inline-flex items-center justify-center text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-7 py-3.5 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer active:scale-[0.99]"
                >
                  Share an Issue <span className="ml-2">→</span>
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center text-base font-medium text-[#1F2A28] bg-[#F7FAF9] hover:bg-[#DCEFEA]/40 border border-[#BFD9D2] px-6 py-3.5 rounded-xl transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] cursor-pointer"
                >
                  Explore Issues
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
                  aria-label="Abstract diagram showing societal issue merging through connections to action"
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

                  {/* Primary Pathway Bridge */}
                  <path
                    d="M40 140 C110 140, 150 140, 200 140 C250 140, 290 140, 320 140"
                    stroke="#176B5B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Upstream Branches (Inputs / Societal Issues) */}
                  <path
                    d="M50 80 C100 80, 150 130, 200 140"
                    stroke="#176B5B"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 200 C100 200, 150 150, 200 140"
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

                  {/* Left Node: Institution */}
                  <circle cx="50" cy="200" r="6" fill="#176B5B" />
                  <circle cx="50" cy="200" r="3" fill="#FFFFFF" />
                  <text x="50" y="224" fill="#5C726E" fontSize="10" fontFamily="Outfit" textAnchor="middle" fontWeight="500">Institution</text>

                  {/* Central SETU Hub Node */}
                  <circle cx="200" cy="140" r="14" fill="#DCEFEA" stroke="#176B5B" strokeWidth="2" />
                  <circle cx="200" cy="140" r="6" fill="#176B5B" />
                  <circle cx="200" cy="140" r="2.5" fill="#FFFFFF" />
                  <text x="200" y="174" fill="#176B5B" fontSize="12" fontFamily="Syne" textAnchor="middle" fontWeight="700">SETU</text>
                  <text x="200" y="188" fill="#5C726E" fontSize="9" fontFamily="Outfit" textAnchor="middle">Match &amp; Connect</text>

                  {/* Downstream Path to Action */}
                  <path
                    d="M200 140 C240 140, 270 140, 310 140"
                    stroke="#176B5B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Right Action Node with Coral Accent */}
                  <circle cx="314" cy="140" r="10" fill="#E07A4E" fillOpacity="0.2" />
                  <circle cx="314" cy="140" r="7" fill="#E07A4E" />
                  <circle cx="314" cy="140" r="3" fill="#FFFFFF" />
                  <text x="314" y="166" fill="#E07A4E" fontSize="12" fontFamily="Outfit" textAnchor="middle" fontWeight="600">Action</text>
                  <text x="314" y="179" fill="#5C726E" fontSize="9" fontFamily="Outfit" textAnchor="middle">Impact</text>
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

        {/* How SETU Works Section */}
        <section id="how-it-works" className="border-t border-[#BFD9D2]/50 bg-[#F7FAF9] py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-left mb-16">
              <span className="text-xs font-semibold tracking-wider uppercase font-outfit text-[#176B5B]">
                Framework
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A28] mt-2">
                How SETU Works
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                A streamlined pathway from ground reality to collaborative execution.
              </p>
            </div>

            {/* 3 Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative font-outfit">
              {/* Step 1 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between relative shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#176B5B] uppercase mb-4">
                    01 — Share
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-3">
                    Submit Issue
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    Citizens and organizations submit societal issues with context and evidence.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Open to all citizens &amp; communities
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between relative shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#176B5B] uppercase mb-4">
                    02 — Connect
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-3">
                    Curate &amp; Match
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    Categorize and route issues to relevant researchers and institutions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Automated routing &amp; expert panels
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-7 rounded-xl border border-[#BFD9D2]/70 flex flex-col justify-between relative shadow-2xs">
                <div>
                  <div className="text-xs font-bold tracking-wider text-[#E07A4E] uppercase mb-4">
                    03 — Solve
                  </div>
                  <h3 className="font-syne text-xl font-bold text-[#1F2A28] mb-3">
                    Collaborative Action
                  </h3>
                  <p className="text-sm text-[#1F2A28]/80 leading-relaxed font-normal">
                    Institutions, industry, and authorities execute sustainable solutions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40 text-xs text-[#5C726E]">
                  Pilots, policy support &amp; deployment
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24">
          <div className="rounded-2xl border border-[#BFD9D2] bg-white p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#1F2A28] tracking-tight">
                Have an issue worth solving?
              </h2>
              <p className="mt-3 font-outfit text-base text-[#1F2A28]/70">
                Join the platform and bring visibility to societal needs in your area.
              </p>
            </div>
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center justify-center text-base font-medium text-white bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] px-8 py-4 rounded-xl shadow-xs transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] focus-visible:ring-offset-2 cursor-pointer font-outfit shrink-0 active:scale-[0.99]"
            >
              Get Started <span className="ml-2">→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Minimal Clean Footer */}
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
