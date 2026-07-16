import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

/* ─── Faculty data ─────────────────────────────────────────── */
const faculties = [
  {
    name: 'MedTech',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    decor: 'rgba(244,63,94,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Integrating with cutting edge medical technology and digital health solutions',
  },
  {
    name: 'LawTech',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
    decor: 'rgba(124,58,237,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M12 3v18" strokeLinecap="round" />
        <path d="M5 8l7-5 7 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12l-3 6h6l-3-6z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 12l-3 6h6l-3-6z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    ),
    description: 'Managing Law with technology, e-discovery and digital justice system',
  },
  {
    name: 'FinTech',
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    decor: 'rgba(249,115,22,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" strokeLinecap="round" />
        <circle cx="12" cy="15" r="2" />
        <path d="M6 15h.01M18 15h.01" strokeLinecap="round" />
      </svg>
    ),
    description: 'Blockchain, digital banking and financial data analytics',
  },
  {
    name: 'EdTech',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    decor: 'rgba(37,99,235,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" />
      </svg>
    ),
    description: 'Transforming Education through learning platforms, and E-learning',
  },
  {
    name: 'AgriTech',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
    decor: 'rgba(22,163,74,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M12 22V12" strokeLinecap="round" />
        <path d="M12 12C9 12 5 10 5 5c2-1 5 0 7 2 2-2 5-3 7-2 0 5-4 7-7 7z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 22h8" strokeLinecap="round" />
      </svg>
    ),
    description: 'Start farming, precision agriculture and food supply chain technology',
  },
  {
    name: 'Business Tech',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)',
    decor: 'rgba(13,148,136,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
        <path d="M8 12h8M8 16h5" strokeLinecap="round" />
      </svg>
    ),
    description: 'Digital entrepreneurship, ecommerce and technology driven strategy',
  },
  {
    name: 'GovTech',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #4f6ef7 100%)',
    decor: 'rgba(29,78,216,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v11M19 10v11M10 10v11M14 10v11" strokeLinecap="round" />
      </svg>
    ),
    description: 'Digital governance, civic technology, and public sector innovation.',
  },
  {
    name: 'HRTech',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
    decor: 'rgba(147,51,234,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 20v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
    description: 'People analytics, talent management platforms, and workforce automation.',
  },
  {
    name: 'CyberTech',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    decor: 'rgba(220,38,38,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Ethical hacking, digital forensics, network security, and threat intelligence.',
  },
  {
    name: 'MediaTech',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
    decor: 'rgba(234,88,12,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <rect x="2" y="3" width="15" height="13" rx="2" />
        <path d="M17 8l5 3-5 3V8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 20h20" strokeLinecap="round" />
      </svg>
    ),
    description: 'Digital journalism, content creation, streaming, and media analytics.',
  },
  {
    name: 'FaithTech',
    gradient: 'linear-gradient(135deg, #be123c 0%, #e11d48 100%)',
    decor: 'rgba(190,18,60,0.08)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={2}>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" />
        <path d="M9 7h6M9 11h6" strokeLinecap="round" />
      </svg>
    ),
    description: 'Technology applications in faith communities, ministry platforms, and spiritual innovation.',
  },
]

/* ─── Journey steps ────────────────────────────────────────── */
const journeySteps = [
  { num: 1, title: 'Discover Courses', desc: 'Browse 100+ programs across 11 faculties' },
  { num: 2, title: 'Register', desc: 'Simple enrollment with secure payment' },
  { num: 3, title: 'Learn Online', desc: 'Video lessons, PDFs, and live sessions' },
  { num: 4, title: 'Take Assessments', desc: 'Quizzes, tests, and practical exams' },
  { num: 5, title: 'Complete Projects', desc: 'Real world industry projects' },
  { num: 6, title: 'Earn Certificates', desc: 'Verified industry-recognized certificates' },
  { num: 7, title: 'Join Community', desc: 'Connect with innovators across Africa' },
]

/* ─── Why HIS features ─────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <circle cx="12" cy="7" r="3" />
        <path d="M5 20v-1a7 7 0 0114 0v1" strokeLinecap="round" />
        <rect x="8" y="13" width="8" height="5" rx="1" />
        <path d="M10 13v-2h4v2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Flexible Learning',
    desc: 'Study at your own pace, anytime anywhere',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <rect x="2" y="3" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        <circle cx="9" cy="9" r="2" />
        <path d="M13 8h4M13 11h3" strokeLinecap="round" />
      </svg>
    ),
    title: 'Expert Instructors',
    desc: 'Learn from top practitioners and academics',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <path d="M2 6c0-1.1.9-2 2-2h7l2 2h7a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11v6M9 14h6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Certifications',
    desc: 'Industry recognized digital certificates',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <circle cx="9" cy="7" r="3" />
        <circle cx="16" cy="8" r="2.5" />
        <path d="M2 20v-1a7 7 0 0114 0v1" strokeLinecap="round" />
        <path d="M16 11a5 5 0 016 5v1" strokeLinecap="round" />
      </svg>
    ),
    title: 'Community',
    desc: 'Network with students and alumni',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <path d="M12 3l8 4.5V12c0 4-3.3 7.7-8 9-4.7-1.3-8-5-8-9V7.5L12 3z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15.5" cy="14.5" r="3" />
        <path d="M13.5 14.5h.5M15.5 12.5v.5M17.5 14.5h-.5M15.5 16.5v-.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Practical Projects',
    desc: 'Hands on industry aligned projects',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 17v-4M12 17v-8M16 17v-6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Online Assessments',
    desc: 'Smart quizzes and adaptive testing',
  },
]

/* ─── Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* ── Hero (stays dark — photo background) ───────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background photo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero_bg.jpg')" }}
          />
          {/* Overlay — near-black on left for text, fades to almost nothing on right so photo shows */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(2,4,14,0.93) 0%, rgba(2,4,14,0.65) 45%, rgba(2,4,14,0.05) 100%)',
            }}
          />

          <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-3xl mb-5">
              Future-Proof Your Career With{' '}
              <span style={{ color: '#3ba4e5' }}>Technology-Driven</span> Education.
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed mb-10">
              Discover innovative programs in Healthcare, Business, Finance,
              Agriculture, Law, Cybersecurity and more., Earn industry relevant
              certificates and join next generation of innovators.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center w-full sm:w-auto px-14 py-3.5 bg-his-navy hover:bg-his-navy-light text-white font-semibold rounded-full transition-all duration-200 text-base whitespace-nowrap"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full sm:w-auto px-14 py-3.5 bg-white hover:bg-slate-100 text-his-navy font-bold rounded-full transition-all duration-200 text-base whitespace-nowrap"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* ── About ──────────────────────────────────────────── */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Pill badge */}
            <span className="inline-block bg-slate-100 text-his-navy font-bold text-sm px-5 py-2 rounded-full mb-5">
              About us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-his-navy leading-tight mb-5 max-w-4xl">
              Helen Innovative School - Where Professions Meet Innovation
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-4 max-w-3xl">
              HIS is a technology powered institution that enables students and professionals
              to discover courses , register , learn online, complete assessments, earn verified
              certificates and become part of an innovation community that is reshaping the world
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-3xl">
              Whether ypu are a student begining your career or a professional upskilling for
              the digital economy, HIS offers world class programs built for the modern learners
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-his-navy hover:bg-his-navy-light text-white font-bold px-8 py-4 rounded-full transition-colors duration-200 mb-14"
            >
              Learn More <span className="text-base">›</span>
            </Link>

            {/* 4 pillar cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: 'Vision',
                  text: "To be Africa's leading technology driven institution empowering every profession with excellence.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
                      <path d="M17 7l1.5-1.5M6.5 17.5L5 19" strokeLinecap="round" />
                      <path d="M19 7l-2 2" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Mission',
                  text: 'Delivering accessible, practical and tech integrated education across all sectors.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={1.8}>
                      <rect x="7" y="2" width="10" height="16" rx="2" />
                      <path d="M10 6h4M10 9h4M10 12h2" strokeLinecap="round" />
                      <circle cx="15" cy="16" r="4" />
                      <path d="M13.5 16l1 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Core Values',
                  text: 'Innovation, Excellence , integrity and collaborative drive is everything we do at HIS.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  title: 'Learning Models',
                  text: 'Self paced learning with video lessons, assessments real projects and community project.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth={1.8}>
                      <path d="M2 6c0-1.1.9-2 2-2h4l2 3H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-3H4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 14h6M12 11v6" strokeLinecap="round" />
                    </svg>
                  ),
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="bg-slate-50 border-2 border-his-navy rounded-2xl p-7 card-hover"
                >
                  {/* Dark navy pill icon */}
                  <div className="inline-flex items-center justify-center bg-his-navy px-5 py-3 rounded-2xl mb-5">
                    {p.icon}
                  </div>
                  <h3 className="text-his-navy font-bold text-xl mb-3">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Faculties ──────────────────────────────────────── */}
        <section id="faculties" className="py-20 bg-his-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">Schools &amp; Faculties</span>
              <h2 className="section-heading mb-4">11 Technology-Powered Faculties</h2>
              <p className="section-subheading max-w-xl mx-auto">
                Every profession reimagined through the lens of technology. Choose your faculty
                and begin your transformation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {faculties.map((f) => (
                <div
                  key={f.name}
                  className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col shadow-sm card-hover relative overflow-hidden"
                >
                  {/* Decorative square — top right */}
                  <div
                    className="absolute top-0 right-0 w-28 h-28 rounded-2xl translate-x-6 -translate-y-6"
                    style={{ background: f.decor }}
                  />

                  {/* Gradient icon — iOS app-icon style */}
                  <div
                    className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shrink-0"
                    style={{ background: f.gradient }}
                  >
                    {f.icon}
                  </div>

                  <h3 className="text-slate-900 font-bold text-lg mb-2">{f.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">{f.description}</p>

                  <Link
                    href={`/faculties/${f.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-1 text-his-blue font-semibold text-sm hover:gap-2 transition-all duration-150"
                  >
                    Explore Faculty
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Journey ────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">Your Journey</span>
              <h2 className="section-heading mb-4">How Your Learning Journey Works</h2>
              <p className="section-subheading max-w-xl mx-auto">
                From discovery to certification — a clear, structured path to professional excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {journeySteps.map((step) => (
                <div
                  key={step.num}
                  className="bg-white border border-slate-100 rounded-2xl p-6 card-hover shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-his-green flex items-center justify-center mb-4 shrink-0">
                    <span className="text-white font-bold text-lg">{step.num}</span>
                  </div>
                  <h3 className="text-slate-900 font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why HIS ────────────────────────────────────────── */}
        <section id="why-his" className="py-20 bg-his-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">Why HIS</span>
              <h2 className="section-heading mb-4">Everything You Need to Succeed</h2>
              <p className="section-subheading max-w-xl mx-auto">
                A complete learning ecosystem built for the next generation of professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white border border-slate-100 rounded-2xl p-5 flex gap-5 items-center card-hover shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-his-green flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-base mb-1">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Blog & Resources ───────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="section-label">Blog &amp; Resources</span>
                <h2 className="section-heading">Insights &amp; Perspectives</h2>
              </div>
              <Link
                href="/blog"
                className="text-his-blue text-sm font-semibold hover:text-his-blue-light flex items-center gap-1.5 transition-colors"
              >
                View all articles
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured card */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden card-hover shadow-sm">
                <div className="h-52 bg-gradient-to-br from-his-blue/20 via-slate-100 to-slate-50 flex items-end p-6 relative">
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(79,110,247,0.15) 0%, transparent 60%)' }} />
                  <span className="relative text-xs font-semibold text-his-blue bg-his-blue/10 border border-his-blue/20 rounded-full px-3 py-1">
                    Technology
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-slate-400 text-xs mb-3">June 13, 2026</p>
                  <h3 className="text-slate-900 font-bold text-xl mb-3 leading-snug">
                    Top 10 Emerging Tech Careers for Youths
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    Explore the fastest-growing technology roles reshaping Africa&apos;s digital
                    economy and how to position yourself for success in 2026 and beyond.
                  </p>
                  <Link href="/blog/top-10-emerging-tech-careers" className="text-his-blue text-sm font-semibold hover:text-his-blue-light flex items-center gap-1.5 transition-colors">
                    Read More
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Side card */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden card-hover shadow-sm">
                <div className="h-36 bg-gradient-to-br from-purple-100 via-slate-50 to-white relative">
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 60% 40%, rgba(139,92,246,0.12) 0%, transparent 60%)' }} />
                </div>
                <div className="p-5">
                  <p className="text-slate-400 text-xs mb-2">June 10, 2026</p>
                  <h3 className="text-slate-900 font-semibold text-base mb-2 leading-snug">
                    How AI is Transforming Healthcare in Africa
                  </h3>
                  <Link href="/blog" className="text-his-blue text-sm font-semibold hover:text-his-blue-light transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <section id="testimonials" className="py-20 bg-his-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">Testimonials</span>
              <h2 className="section-heading">What Our Community Says</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm card-hover">
                <svg className="w-10 h-10 text-his-blue/20 mb-5" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8C5.58 8 2 11.58 2 16s3.58 8 8 8h1v6l8-6h5c4.42 0 8-3.58 8-8s-3.58-8-8-8H10zm0 2h18c3.31 0 6 2.69 6 6s-2.69 6-6 6h-5.88L14 26v-4H10c-3.31 0-6-2.69-6-6s2.69-6 6-6z" />
                </svg>
                <p className="text-slate-700 text-lg leading-relaxed mb-6 italic">
                  &ldquo;HIS transformed how I understand healthcare technology. The AI in Healthcare
                  course was world class and the instructors were incredibly supportive. I earned my
                  certificate in just 8 weeks.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-his-blue/10 flex items-center justify-center">
                    <span className="text-his-blue font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">Adaeze Okonkwo</p>
                    <p className="text-slate-400 text-xs">Student · MedTech</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {[
                  {
                    initials: 'C',
                    name: 'Chukwuemeka Eze',
                    role: 'Student · FinTech',
                    text: 'The Blockchain & DeFi course gave me the skills to land my first role in a fintech startup within 3 months.',
                  },
                  {
                    initials: 'F',
                    name: 'Fatima Al-Hassan',
                    role: 'Professional · GovTech',
                    text: 'HIS completely changed how I approach public sector work. The instructors are real practitioners.',
                  },
                ].map((t) => (
                  <div key={t.name} className="bg-white border border-slate-200 rounded-xl p-5 flex-1 card-hover shadow-sm">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-his-blue/10 flex items-center justify-center">
                        <span className="text-his-blue font-bold text-xs">{t.initials}</span>
                      </div>
                      <div>
                        <p className="text-slate-900 font-semibold text-xs">{t.name}</p>
                        <p className="text-slate-400 text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Community ──────────────────────────────────────── */}
        <section className="py-20 bg-his-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-his-navy rounded-3xl overflow-hidden border border-white/5">
              <div className="p-10 lg:p-14">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-his-green mb-3">
                  Community
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  Join Innovation Community
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Learning is better together. HIS Community connects you with thousands of
                  students, professionals, and innovators across Africa and beyond. Ask,
                  discuss, collaborate, and grow.
                </p>
                <ul className="space-y-3 mb-10">
                  {[
                    'Ask Questions',
                    'Join Discussions',
                    'Connect with Students',
                    'Collaborate on Projects',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                      <span className="w-5 h-5 rounded-full bg-his-green/20 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" stroke="#3cb87a" strokeWidth={2}>
                          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/community"
                  className="inline-flex items-center gap-2 bg-his-green hover:bg-his-green-hover text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200"
                >
                  Join Community
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Decorative panel */}
              <div className="hidden lg:flex items-center justify-center relative overflow-hidden min-h-[320px] bg-his-navy-light">
                <div className="relative flex flex-col items-center gap-4">
                  {[
                    { label: '10,000+ Students', color: '#3cb87a' },
                    { label: '11 Faculties', color: '#60a5fa' },
                    { label: 'Active Daily Discussions', color: '#a78bfa' },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="bg-his-navy-light border border-white/10 rounded-xl px-6 py-3 text-sm font-semibold"
                      style={{ color: b.color }}
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="py-24 bg-his-blue relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/70 mb-3">
              Get Started Today
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Start Building Your Future Today.
            </h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10">
              Join thousands of students and professionals who are transforming their careers
              with Helen Innovative School.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center px-9 py-3.5 bg-his-green hover:bg-his-green-hover text-white font-semibold rounded-lg transition-all duration-200 text-base shadow-lg"
              >
                Apply Now
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-9 py-3.5 border border-white/40 hover:border-white/70 hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-200 text-base"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
