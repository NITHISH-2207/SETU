import CitizenScene from './scenes/CitizenScene.jsx'
import UniversityScene from './scenes/UniversityScene.jsx'
import IndustryScene from './scenes/IndustryScene.jsx'
import GovernmentScene from './scenes/GovernmentScene.jsx'

function RoleEcosystemScene({ roleId }) {
  switch (roleId) {
    case 'citizen':
      return <CitizenScene />
    case 'university':
      return <UniversityScene />
    case 'industry':
      return <IndustryScene />
    case 'government':
    default:
      return <GovernmentScene />
  }
}

function RoleStoryPanel({ role, mode = 'login' }) {
  const isLogin = mode === 'login'

  return (
    <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full shadow-2xs">
      <div>
        {/* Top Role Indicator Badge */}
        <div className="flex items-center gap-2 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>{role.title} • {isLogin ? 'Access Gateway' : 'Registration'}</span>
          </div>
          <span className="text-[11px] text-[#5C726E] font-outfit hidden sm:inline">
            Ecosystem Layer
          </span>
        </div>

        {/* 1. Short Emotional Headline (Syne) & Supporting text (Outfit) */}
        <div className="mb-6">
          <h2 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2A28] leading-tight">
            {role.headline}
          </h2>
          <p className="font-outfit text-sm text-[#1F2A28]/80 leading-relaxed font-normal mt-2">
            {role.storyText}
          </p>
        </div>

        {/* 2. Main Animated SETU Ecosystem Scene */}
        <div className="mb-6">
          <RoleEcosystemScene roleId={role.id} />
        </div>
      </div>

      {/* 3. Bottom Information Section: WHAT YOU CAN DO */}
      <div className="mt-4 pt-5 border-t border-[#BFD9D2]/70 font-outfit">
        <span className="text-[11px] font-bold tracking-wider text-[#176B5B] uppercase block mb-2.5">
          What You Can Do
        </span>
        <div className="space-y-2">
          {role.whatYouCanDo?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1F2A28]/85">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E07A4E] mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoleStoryPanel
