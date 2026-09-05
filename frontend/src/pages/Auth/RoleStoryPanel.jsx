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
    <div className="bg-[#F7FAF9] border border-[#BFD9D2] rounded-2xl p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full w-full shadow-2xs">
      <div className="flex-1 flex flex-col">
        {/* Minimal Role Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#BFD9D2] text-[#176B5B] font-outfit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#176B5B]" />
            <span>{role.title} • {isLogin ? 'Access' : 'Registration'}</span>
          </div>
        </div>

        {/* 1 Short Line Header */}
        <div className="mb-6">
          <h2 className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-[#1F2A28] leading-tight">
            {role.headline}
          </h2>
        </div>

        {/* Prominent Animated Doodle Illustration */}
        <div className="flex-1 flex items-center justify-center my-auto min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]">
          <RoleEcosystemScene roleId={role.id} />
        </div>
      </div>

      {/* Minimal Footer Tagline */}
      <div className="mt-6 pt-4 border-t border-[#BFD9D2]/50 text-xs text-[#5C726E] font-outfit">
        {role.storyText}
      </div>
    </div>
  )
}

export default RoleStoryPanel
