export default function CSRFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 font-outfit mt-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-syne font-semibold text-slate-900">SETU</span>
            <span>•</span>
            <span className="text-slate-500">CSR & Industry Portal</span>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>Sec 80G Verified</span>
            <span>•</span>
            <span>Govt. Backed Platform</span>
            <span>•</span>
            <span>CSR Act Compliant</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} SETU Platform — All Rights Reserved</span>
          <span>Bridging Industries with Civic Progress</span>
        </div>
      </div>
    </footer>
  )
}

