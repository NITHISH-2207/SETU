import { useState } from 'react'
import TataCSRProfile from './TataCSRProfile.jsx'
import Contribute from './Contribute.jsx'
import Payment from './Payment.jsx'

function IndustryDashboard({ userProfile = {}, onLogout, onNavigate: _onNavigate }) {
  const [activeView, setActiveView] = useState('overview') // 'overview' | 'profile' | 'contribute' | 'payment'
  const [_activeParams, _setActiveParams] = useState({
    id: 'SETU-CH-2041',
    title: 'High Arsenic & Heavy Metal Contamination in Feeder Wells',
    type: 'equipment',
    required: 1200000,
    raised: 750000,
  })

  const partnerName = userProfile.industryName || userProfile.name || 'Tata Group'

  const handleOpenContribute = (challenge) => {
    if (challenge) {
      setActiveParams({
        id: challenge.id,
        title: challenge.title,
        type: challenge.defaultType || 'equipment',
        required: challenge.required || 800000,
        raised: challenge.raised || 250000,
      })
    }
    setActiveView('contribute')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenPayment = (challenge) => {
    if (challenge) {
      setActiveParams({
        id: challenge.id,
        title: challenge.title,
        type: 'funding',
        required: challenge.required || 1200000,
        raised: challenge.raised || 750000,
      })
    }
    setActiveView('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openChallenges = [
    {
      id: 'SETU-CH-2041',
      tag: 'WATER & SANITATION',
      title: 'High Arsenic & Heavy Metal Contamination in Feeder Wells',
      location: 'Ward 12, Gandhi Nagar, Tiruppur',
      university: 'Anna University — Environmental Engineering Team',
      required: 1200000,
      raised: 750000,
      defaultType: 'equipment',
      description: 'Industrial effluent percolation detected in groundwater. Membrane filtration pilot ready to deploy across 12 borewells.',
    },
    {
      id: 'SETU-CH-2089',
      tag: 'RURAL LIVELIHOODS',
      title: 'Low Crop Yield & Irrigation Deficit for Smallholder Farmers',
      location: 'Godda Tribal Cluster, Jharkhand',
      university: 'NIT Trichy — Agritech Sensor Lab',
      required: 500000,
      raised: 440000,
      defaultType: 'manpower',
      description: 'Automated solar drip irrigation & soil moisture telemetry ready to scale for 45 farming families.',
    },
    {
      id: 'SETU-CH-3104',
      tag: 'PUBLIC HEALTH',
      title: 'Vector-Borne Disease Tracking & Stagnant Drain Remediation',
      location: 'South Zone, Madurai Corporation',
      university: 'PSG College of Tech — Civic IoT Group',
      required: 650000,
      raised: 300000,
      defaultType: 'equipment',
      description: 'Open culverts breeding mosquitoes during monsoon. IoT water-flow monitors and biological larvicide deployment needed.',
    },
  ]

  // Render Sub-Views (TataCSRProfile, Contribute, Payment) with unified return banner
  if (activeView === 'profile') {
    return (
      <div className="min-h-screen bg-[#f7f4ee]">
        <div className="bg-[#0f6857] text-white px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm font-outfit shadow-xs sticky top-0 z-[110]">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold tracking-tight text-white">SETU</span>
            <span className="text-[#BFD9D2]">• CSR Partner Profile Hub</span>
          </div>
          <button
            onClick={() => setActiveView('overview')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white font-medium transition-colors cursor-pointer"
          >
            ← Back to Industry Dashboard
          </button>
        </div>
        <TataCSRProfile />
      </div>
    )
  }

  if (activeView === 'contribute') {
    return (
      <div className="min-h-screen bg-[#f7f4ee]">
        <div className="bg-[#0f6857] text-white px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm font-outfit shadow-xs sticky top-0 z-[110]">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold tracking-tight text-white">SETU</span>
            <span className="text-[#BFD9D2]">• Offer Equipment &amp; Manpower</span>
          </div>
          <button
            onClick={() => setActiveView('overview')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white font-medium transition-colors cursor-pointer"
          >
            ← Back to Industry Dashboard
          </button>
        </div>
        <Contribute />
      </div>
    )
  }

  if (activeView === 'payment') {
    return (
      <div className="min-h-screen bg-[#f7f4ee]">
        <div className="bg-[#0f6857] text-white px-6 py-2.5 flex items-center justify-between text-xs sm:text-sm font-outfit shadow-xs sticky top-0 z-[110]">
          <div className="flex items-center gap-2">
            <span className="font-syne font-bold tracking-tight text-white">SETU</span>
            <span className="text-[#BFD9D2]">• Project Funding Checkout</span>
          </div>
          <button
            onClick={() => setActiveView('overview')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white font-medium transition-colors cursor-pointer"
          >
            ← Back to Industry Dashboard
          </button>
        </div>
        <Payment />
      </div>
    )
  }

  // Dashboard Overview Hub
  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#1F2A28] font-outfit flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#BFD9D2]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-syne text-2xl font-bold tracking-tight text-[#176B5B]">
                SETU
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/80">
                <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                CSR &amp; Industry Hub
              </span>
            </div>
          </div>

          {/* Quick Hub Nav Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'overview'
                  ? 'bg-[#DCEFEA] text-[#176B5B] font-semibold'
                  : 'text-[#5C726E] hover:text-[#176B5B]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors cursor-pointer"
            >
              Tata CSR Profile
            </button>
            <button
              onClick={() => handleOpenContribute()}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors cursor-pointer"
            >
              Contribute
            </button>
            <button
              onClick={() => handleOpenPayment()}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors cursor-pointer"
            >
              Funding Checkout
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#1F2A28]">{partnerName}</span>
              <span className="text-[11px] text-[#5C726E]">Verified Industry Partner</span>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#5C726E] hover:text-red-700 bg-white border border-[#BFD9D2] hover:border-red-200 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#176B5B] to-[#125649] rounded-2xl p-6 sm:p-8 text-white shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 mb-3">
              <span>Corporate Social Responsibility</span>
            </div>
            <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {partnerName}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/85 max-w-2xl font-outfit">
              Connect corporate funding, engineering manpower, and testing equipment with university research teams solving ground-level civic challenges.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('profile')}
              className="px-5 py-2.5 bg-white text-[#176B5B] font-semibold text-sm rounded-xl hover:bg-[#F7FAF9] transition-all shadow-xs cursor-pointer"
            >
              Open CSR Profile →
            </button>
          </div>
        </div>

        {/* 3 Dedicated Gateway Hub Cards */}
        <div className="mb-10">
          <h2 className="font-syne text-xl font-bold text-[#1F2A28] mb-4">
            CSR &amp; Industry Action Gateways
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Gateway 1: Tata CSR Partner Profile */}
            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center font-bold font-syne text-lg mb-4">
                  🏢
                </div>
                <h3 className="font-syne text-lg font-bold text-[#1F2A28] group-hover:text-[#176B5B] transition-colors">
                  Tata CSR Partner Profile
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5C726E] leading-relaxed">
                  Inspect solved civic initiatives, impact metrics across health &amp; education, and open focus areas matched to Tata Trusts.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40">
                <button
                  onClick={() => setActiveView('profile')}
                  className="w-full py-2.5 px-4 bg-[#F7FAF9] hover:bg-[#DCEFEA]/60 text-[#176B5B] text-xs sm:text-sm font-semibold rounded-xl border border-[#BFD9D2] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>View Full Profile</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Gateway 2: Offer Equipment & Manpower (Contribute) */}
            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E07A4E]/15 text-[#E07A4E] flex items-center justify-center font-bold font-syne text-lg mb-4">
                  🛠
                </div>
                <h3 className="font-syne text-lg font-bold text-[#1F2A28] group-hover:text-[#E07A4E] transition-colors">
                  Contribute Equipment &amp; Manpower
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5C726E] leading-relaxed">
                  Pledge specialized testing equipment, water filtration skids, engineering experts, and field mentors to active projects.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40">
                <button
                  onClick={() => handleOpenContribute()}
                  className="w-full py-2.5 px-4 bg-[#F7FAF9] hover:bg-[#E07A4E]/10 text-[#E07A4E] text-xs sm:text-sm font-semibold rounded-xl border border-[#BFD9D2] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Submit Support Pledge</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Gateway 3: Fund Verified Projects (Payment) */}
            <div className="bg-white border border-[#BFD9D2] rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#176B5B]/15 text-[#176B5B] flex items-center justify-center font-bold font-syne text-lg mb-4">
                  💳
                </div>
                <h3 className="font-syne text-lg font-bold text-[#1F2A28] group-hover:text-[#176B5B] transition-colors">
                  Direct CSR Project Funding
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#5C726E] leading-relaxed">
                  Provide capital grants to vetted student-faculty innovation teams with real-time financial tracking and impact audits.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#BFD9D2]/40">
                <button
                  onClick={() => handleOpenPayment()}
                  className="w-full py-2.5 px-4 bg-[#F7FAF9] hover:bg-[#DCEFEA]/60 text-[#176B5B] text-xs sm:text-sm font-semibold rounded-xl border border-[#BFD9D2] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Open Funding Checkout</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-[#BFD9D2] rounded-xl p-5 shadow-2xs">
            <span className="text-xs font-semibold text-[#5C726E] uppercase">Years of CSR History</span>
            <div className="mt-1 font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">145+</div>
            <span className="text-[11px] text-[#5C726E] mt-1 block">National Community Impact</span>
          </div>

          <div className="bg-white border border-[#BFD9D2] rounded-xl p-5 shadow-2xs">
            <span className="text-xs font-semibold text-[#5C726E] uppercase">Active Programme Areas</span>
            <div className="mt-1 font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">10+</div>
            <span className="text-[11px] text-[#5C726E] mt-1 block">Water, Health, Education</span>
          </div>

          <div className="bg-white border border-[#BFD9D2] rounded-xl p-5 shadow-2xs">
            <span className="text-xs font-semibold text-[#5C726E] uppercase">SETU Challenges Funded</span>
            <div className="mt-1 font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">3</div>
            <span className="text-[11px] text-[#5C726E] mt-1 block">₹4.2 Cr Total Disbursed</span>
          </div>

          <div className="bg-white border border-[#BFD9D2] rounded-xl p-5 shadow-2xs">
            <span className="text-xs font-semibold text-[#5C726E] uppercase">University Collaborations</span>
            <div className="mt-1 font-syne text-2xl sm:text-3xl font-bold text-[#176B5B]">8</div>
            <span className="text-[11px] text-[#5C726E] mt-1 block">Engineering &amp; Science Labs</span>
          </div>
        </div>

        {/* Matched Open Challenges Ready for Support */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-syne text-xl font-bold text-[#1F2A28]">
                Open Challenges Matched to Focus Areas
              </h2>
              <p className="text-xs sm:text-sm text-[#5C726E]">
                Validated problems routed to university teams, ready for industry resources or capital.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {openChallenges.map((challenge) => {
              const percentage = Math.min(100, Math.round((challenge.raised / challenge.required) * 100))
              return (
                <div
                  key={challenge.id}
                  className="bg-white border border-[#BFD9D2] rounded-2xl p-6 shadow-2xs hover:border-[#176B5B]/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E07A4E]/15 text-[#E07A4E]">
                        {challenge.tag}
                      </span>
                      <span className="font-mono text-xs text-[#5C726E]">ID: {challenge.id}</span>
                      <span className="text-xs text-[#5C726E]">• {challenge.location}</span>
                    </div>

                    <h3 className="font-syne text-base sm:text-lg font-bold text-[#1F2A28]">
                      {challenge.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#5C726E] max-w-3xl">
                      {challenge.description}
                    </p>
                    <div className="mt-2 text-xs font-medium text-[#176B5B]">
                      Partner Institution: {challenge.university}
                    </div>
                  </div>

                  <div className="lg:w-72 shrink-0 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[#BFD9D2]/60 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-[#176B5B] font-bold">
                          ₹{challenge.raised.toLocaleString('en-IN')} raised
                        </span>
                        <span className="text-[#5C726E]">
                          of ₹{challenge.required.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#DCEFEA] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#176B5B] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPayment(challenge)}
                        className="flex-1 py-2 px-3 bg-[#176B5B] hover:bg-[#125649] text-white text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer"
                      >
                        Fund Project →
                      </button>
                      <button
                        onClick={() => handleOpenContribute(challenge)}
                        className="py-2 px-3 bg-[#F7FAF9] hover:bg-[#DCEFEA]/60 text-[#176B5B] text-xs font-semibold rounded-lg border border-[#BFD9D2] transition-colors text-center cursor-pointer"
                      >
                        Offer Support
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#BFD9D2]/60 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#5C726E]">
          SETU • Societal Engagement &amp; Technology Utility • Industry &amp; CSR Partner Portal
        </div>
      </footer>
    </div>
  )
}

export default IndustryDashboard
