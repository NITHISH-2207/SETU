import { useState, useRef, useEffect } from 'react'
import { MOCK_UNIVERSITIES } from '../universityMockData'

function UniversitySelect({ value, onChange, required = false, label = 'University / Institution' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = MOCK_UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase()) ||
    u.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-2 font-outfit relative" ref={containerRef}>
      <label className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase">
        {label} {required && <span className="text-[#E07A4E]">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-sm bg-white border border-[#BFD9D2] rounded-xl text-left flex items-center justify-between text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B] focus:ring-2 focus:ring-[#176B5B]/20 transition-all cursor-pointer shadow-2xs"
      >
        <span className={value ? 'text-[#1F2A28] font-medium truncate' : 'text-[#5C726E]/70 truncate'}>
          {value || 'Select your affiliated university / institution...'}
        </span>
        <svg className={`w-4 h-4 text-[#5C726E] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#BFD9D2] rounded-xl shadow-xl z-50 p-2 space-y-2 animate-fade-in">
          {/* Search bar inside dropdown */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search university by name or code..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7FAF9] border border-[#BFD9D2] rounded-lg text-[#1F2A28] focus:outline-hidden focus:border-[#176B5B]"
              autoFocus
            />
            <svg className="w-3.5 h-3.5 text-[#5C726E] absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* List of options */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filtered.length > 0 ? (
              filtered.map((univ) => {
                const isSelected = value === univ.name
                return (
                  <button
                    key={univ.id}
                    type="button"
                    onClick={() => {
                      onChange(univ.name)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#DCEFEA] text-[#176B5B] font-bold'
                        : 'text-[#1F2A28] hover:bg-[#F7FAF9]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{univ.name}</p>
                      <p className="text-[11px] text-[#5C726E]">{univ.state}</p>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/80 border border-[#BFD9D2]/70 text-[#176B5B]">
                      {univ.code}
                    </span>
                  </button>
                )
              })
            ) : (
              <p className="text-xs text-[#5C726E] p-3 text-center">
                No matching university found in directory.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UniversitySelect
