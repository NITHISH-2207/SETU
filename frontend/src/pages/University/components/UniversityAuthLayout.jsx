import AdminVisualScene from './scenes/AdminVisualScene.jsx'
import MentorVisualScene from './scenes/MentorVisualScene.jsx'
import StudentVisualScene from './scenes/StudentVisualScene.jsx'

function UniversityRoleScene({ roleType }) {
  switch (roleType) {
    case 'admin':
      return <AdminVisualScene />
    case 'mentor':
      return <MentorVisualScene />
    case 'student':
    default:
      return <StudentVisualScene />
  }
}

function UniversityAuthLayout({
  roleType = 'student', // 'admin' | 'mentor' | 'student'
  roleBadgeText = 'University Portal',
  headline = 'Turn learning into meaningful impact.',
  storyText = 'Connect student initiatives and academic research directly to verified societal issues.',
  onBack,
  backLabel = 'Back to University Roles',
  children,
}) {
  return (
    <div className="min-h-screen bg-white text-[#1F2A28] flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 selection:bg-[#DCEFEA] selection:text-[#176B5B]">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center text-sm font-medium text-[#5C726E] hover:text-[#176B5B] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B5B] rounded-sm py-1 font-outfit cursor-pointer"
        >
          <span className="mr-1.5">←</span> {backLabel}
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne text-xl font-bold text-[#176B5B]">SETU</span>
          <span className="text-xs text-[#5C726E] font-outfit hidden sm:inline">
            • {roleBadgeText}
          </span>
        </div>
      </header>

      {/* Main 2-Column Experience */}
      <main className="max-w-7xl w-full mx-auto my-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Role Identity & Story Panel */}
          <div className="lg:col-span-5 xl:col-span-5 flex">
            <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full w-full shadow-2xs">
              <div className="flex-1 flex flex-col">
                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
                    <span>{roleBadgeText}</span>
                  </div>
                </div>

                {/* Role Headline */}
                <div className="mb-4">
                  <h2 className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-[#1F2A28] leading-tight">
                    {headline}
                  </h2>
                </div>

                {/* Animated Visual Scene */}
                <div className="flex-1 flex items-center justify-center my-auto min-h-[260px] sm:min-h-[290px]">
                  <UniversityRoleScene roleType={roleType} />
                </div>
              </div>

              {/* Footer Story Text */}
              <div className="mt-4 pt-3 border-t border-[#BFD9D2]/50 text-xs text-[#5C726E] font-outfit">
                {storyText}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form Area */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-[#5C726E] font-outfit pt-4">
        <span>SETU • Societal Engagement &amp; Technology Utility</span>
      </footer>
    </div>
  )
}

export default UniversityAuthLayout
