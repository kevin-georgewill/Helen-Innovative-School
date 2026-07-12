import Logo from './Logo'

// Dark brand panel shown beside the login / register forms (hidden on small screens).
export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex w-[44%] relative overflow-hidden bg-his-navy flex-col justify-between p-12">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <Logo variant="light" className="relative" />

      <div className="relative max-w-sm">
        <h2 className="text-3xl font-bold text-white leading-tight mb-4">
          Future-proof your career with technology-driven education.
        </h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Learn across 11 technology-powered faculties, earn verified certificates, and join a
          community of innovators reshaping Africa.
        </p>
        <ul className="space-y-3">
          {['Self-paced video lessons', 'Industry-recognized certificates', 'Innovation community & challenges'].map(
            (item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200 text-sm">
                <span className="w-5 h-5 rounded-full bg-his-green/20 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" stroke="#3cb87a" strokeWidth={2}>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} Helen Innovative School</p>
    </div>
  )
}
