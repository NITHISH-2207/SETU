import { useState } from 'react'
import { useAppTranslation } from '../../../hooks/useAppTranslation'

function ChatbotPlaceholder() {
  const { t } = useAppTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40 font-outfit select-none">
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-linear-to-b from-[#176B5B] to-[#125649] hover:from-[#156152] hover:to-[#0F473C] text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative group border-2 border-white"
        aria-label={t('chatbot.title')}
      >
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="9.01" y2="10" />
          <line x1="15" y1="10" x2="15.01" y2="10" />
        </svg>

        {/* Tooltip on hover */}
        <span className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 bg-[#1F2A28] text-white text-xs font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {t('chatbot.tooltip')}
        </span>
      </button>

      {/* Floating Preview Card / Modal */}
      {open && (
        <div className="absolute bottom-18 right-0 w-80 sm:w-92 bg-white border border-[#BFD9D2] rounded-2xl shadow-2xl p-5 sm:p-6 animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#BFD9D2]/50">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#DCEFEA] text-[#176B5B] flex items-center justify-center">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div>
                <h4 className="font-syne text-sm sm:text-base font-bold text-[#1F2A28]">
                  {t('chatbot.modalTitle')}
                </h4>
                <span className="text-xs text-[#E07A4E] font-semibold">Phase 2 Planned Feature</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#5C726E] hover:text-[#1F2A28] p-1.5 rounded-lg hover:bg-[#F7FAF9] cursor-pointer"
              aria-label="Close assistant preview"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#5C726E] leading-relaxed">
            {t('chatbot.modalDescription')}
          </p>

          <div className="p-3.5 bg-[#F7FAF9] rounded-xl border border-[#BFD9D2]/60 text-xs sm:text-sm text-[#176B5B] space-y-2">
            <p className="font-bold">Chatbot Capabilities (Phase 2):</p>
            <ul className="list-disc list-inside text-[#5C726E] text-xs space-y-1">
              <li>Voice &amp; text multilingual complaints</li>
              <li>Instant Issue status lookup</li>
              <li>Regional dialect assistance (Tamil, Hindi, etc.)</li>
            </ul>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full py-2.5 bg-[#176B5B] hover:bg-[#125649] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  )
}

export default ChatbotPlaceholder
