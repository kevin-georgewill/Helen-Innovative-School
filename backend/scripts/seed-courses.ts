import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── 1. Ensure a seed instructor exists ────────────────────────────────────────

async function ensureInstructor(): Promise<string> {
  const email = 'instructor@his.demo'

  // Check if profile already exists via admin API listing
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'instructor')
    .limit(1)
    .single()

  if (existing) {
    console.log(`  Using existing instructor: ${existing.id}`)
    return existing.id
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: 'HIS_seed_2024!',
    email_confirm: true,
    user_metadata: { full_name: 'Demo Instructor' },
  })

  if (authError) throw new Error(`Auth user creation failed: ${authError.message}`)

  const userId = authData.user.id

  // Create profile row
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: 'Demo Instructor',
    role: 'instructor',
    bio: 'Experienced industry practitioner across multiple technology domains.',
  })

  if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`)

  console.log(`  Created instructor: ${userId} (${email})`)
  return userId
}

// ── 2. Fetch faculty IDs by slug ──────────────────────────────────────────────

async function getFacultyMap(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('faculties').select('id, slug')
  if (error) throw new Error(`Faculty fetch failed: ${error.message}`)
  if (!data?.length) throw new Error('No faculties found — run the migrations first.')

  const map: Record<string, string> = {}
  for (const f of data) map[f.slug] = f.id
  console.log(`  Found ${data.length} faculties`)
  return map
}

// ── 3. Course definitions ─────────────────────────────────────────────────────

function buildCourses(instructorId: string, fm: Record<string, string>) {
  return [
    {
      course: {
        title: 'Introduction to Blockchain & Cryptocurrency',
        slug: 'intro-blockchain-crypto',
        description:
          'Understand how blockchain works, explore Bitcoin and Ethereum, and learn how decentralized finance is reshaping the global economy.',
        faculty_id: fm['fintech'],
        instructor_id: instructorId,
        price: 15000,
        level: 'beginner',
        program_type: 'express',
        duration: '6 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Blockchain Fundamentals',
          position: 0,
          lessons: [
            { title: 'What is Blockchain?', position: 0, content_text: 'A blockchain is a distributed ledger that records transactions across many computers. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data, making it resistant to modification.' },
            { title: 'How Consensus Mechanisms Work', position: 1, content_text: 'Consensus mechanisms like Proof of Work (PoW) and Proof of Stake (PoS) allow decentralized networks to agree on a single version of the truth without a central authority.' },
          ],
        },
        {
          title: 'Cryptocurrencies in Practice',
          position: 1,
          lessons: [
            { title: 'Bitcoin vs Ethereum', position: 0, content_text: 'Bitcoin was created as digital gold — a store of value and medium of exchange. Ethereum extended this with smart contracts, enabling programmable money and decentralized applications (dApps).' },
            { title: 'DeFi: Decentralized Finance', position: 1, content_text: 'DeFi protocols replicate traditional financial services — lending, borrowing, trading — on public blockchains without intermediaries. Key platforms include Uniswap, Aave, and MakerDAO.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Digital Health & MedTech Essentials',
        slug: 'digital-health-medtech',
        description:
          'Explore how technology is transforming healthcare — from electronic health records and telemedicine to AI diagnostics and wearable devices.',
        faculty_id: fm['medtech'],
        instructor_id: instructorId,
        price: 20000,
        level: 'beginner',
        program_type: 'certificate',
        duration: '10 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Healthcare in the Digital Age',
          position: 0,
          lessons: [
            { title: 'Electronic Health Records (EHR)', position: 0, content_text: 'EHR systems digitize patient records, enabling instant access, reducing errors, and supporting data-driven clinical decisions. Major platforms include Epic, Cerner, and OpenMRS.' },
            { title: 'Telemedicine & Remote Care', position: 1, content_text: 'Telemedicine uses video, messaging, and remote monitoring tools to deliver care outside traditional clinic settings. It has dramatically expanded access to healthcare in low-resource environments.' },
          ],
        },
        {
          title: 'AI & Wearables in Healthcare',
          position: 1,
          lessons: [
            { title: 'AI in Medical Imaging', position: 0, content_text: 'Deep learning models can detect cancers, fractures, and retinal diseases from scans with accuracy rivalling specialists. FDA-cleared AI tools now assist radiologists worldwide.' },
            { title: 'Wearable Health Devices', position: 1, content_text: 'Smartwatches, continuous glucose monitors, and ECG patches generate continuous health streams. These signals enable early detection of arrhythmias, metabolic changes, and sleep disorders.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Cybersecurity Essentials for Professionals',
        slug: 'cybersecurity-essentials',
        description:
          'Learn to identify threats, secure networks, and protect digital assets. Covers firewalls, encryption, ethical hacking basics, and incident response.',
        faculty_id: fm['cybertech'],
        instructor_id: instructorId,
        price: 25000,
        level: 'intermediate',
        program_type: 'certificate',
        duration: '12 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Threat Landscape',
          position: 0,
          lessons: [
            { title: 'Common Attack Vectors', position: 0, content_text: 'Attackers exploit phishing, SQL injection, XSS, man-in-the-middle, and zero-day vulnerabilities. Understanding each vector is the first step to building effective defences.' },
            { title: 'Social Engineering & Phishing', position: 1, content_text: 'Social engineering manipulates people rather than systems. Phishing emails, vishing calls, and pretexting account for over 80% of successful breaches. Security awareness training is the primary countermeasure.' },
          ],
        },
        {
          title: 'Defence & Response',
          position: 1,
          lessons: [
            { title: 'Firewalls & Network Segmentation', position: 0, content_text: 'Firewalls inspect and filter traffic based on rules. Network segmentation limits lateral movement — if one segment is breached, the attacker cannot freely access others.' },
            { title: 'Incident Response Playbook', position: 1, content_text: 'An IR playbook defines steps: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned. A well-drilled playbook reduces breach dwell time from months to hours.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Designing Online Learning Experiences',
        slug: 'designing-online-learning',
        description:
          'Master the principles of instructional design, create engaging e-learning content, and leverage LMS platforms to educate at scale.',
        faculty_id: fm['edtech'],
        instructor_id: instructorId,
        price: 12000,
        level: 'beginner',
        program_type: 'express',
        duration: '8 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Instructional Design Principles',
          position: 0,
          lessons: [
            { title: 'Bloom\'s Taxonomy & Learning Objectives', position: 0, content_text: 'Bloom\'s Taxonomy classifies learning outcomes from remembering facts to creating original work. Writing measurable objectives — "By end of lesson, learner will be able to…" — anchors course design.' },
            { title: 'ADDIE Model', position: 1, content_text: 'ADDIE (Analyse, Design, Develop, Implement, Evaluate) is the gold-standard instructional design framework. Each phase produces deliverables that inform the next, reducing costly late-stage revisions.' },
          ],
        },
        {
          title: 'Building & Delivering Content',
          position: 1,
          lessons: [
            { title: 'Microlearning & Video Scripts', position: 0, content_text: 'Microlearning breaks content into 3-7 minute chunks aligned to single learning objectives. Strong video scripts open with a hook, demonstrate the skill, and close with a clear takeaway.' },
            { title: 'LMS Platforms Comparison', position: 1, content_text: 'Canvas, Moodle, Google Classroom, and Thinkific each serve different contexts. Key evaluation criteria: SCORM compliance, analytics depth, white-labelling, and pricing model.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Digital Entrepreneurship & Startup Strategy',
        slug: 'digital-entrepreneurship',
        description:
          'From idea validation to product-market fit and fundraising — build the skills to launch and grow a technology-enabled business in Africa and beyond.',
        faculty_id: fm['businesstech'],
        instructor_id: instructorId,
        price: 18000,
        level: 'intermediate',
        program_type: 'certificate',
        duration: '14 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Idea to Validated MVP',
          position: 0,
          lessons: [
            { title: 'Problem Discovery & Customer Interviews', position: 0, content_text: 'The best startups solve painful, frequent problems. Customer discovery interviews uncover whether your assumed problem is real. Use the Mom Test framework: ask about past behaviour, not hypothetical future actions.' },
            { title: 'Building a Lean MVP', position: 1, content_text: 'An MVP is the minimum set of features needed to validate your riskiest assumption. Build a landing page, a Figma prototype, or a concierge service before writing a line of production code.' },
          ],
        },
        {
          title: 'Growth & Funding',
          position: 1,
          lessons: [
            { title: 'Unit Economics & Business Models', position: 0, content_text: 'Sustainable businesses have LTV:CAC ratios > 3:1. Common models — SaaS subscriptions, marketplace fees, freemium, and transactional revenue — each have different payback period implications.' },
            { title: 'Raising Angel & Seed Funding', position: 1, content_text: 'Pre-seed rounds typically raise $50K–$500K on SAFE notes or convertible instruments. Investors back the team first, traction second. A warm introduction from a mutual connection increases response rates by 10×.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Legal Tech & Contract Automation',
        slug: 'legal-tech-contracts',
        description:
          'Understand how technology is modernising legal practice — from smart contracts and e-signatures to AI document review and online dispute resolution.',
        faculty_id: fm['lawtech'],
        instructor_id: instructorId,
        price: 22000,
        level: 'intermediate',
        program_type: 'certificate',
        duration: '10 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Technology in Legal Practice',
          position: 0,
          lessons: [
            { title: 'E-Signatures & Digital Contracts', position: 0, content_text: 'E-signature laws (ESIGN in the US, eIDAS in the EU, NITDA guidelines in Nigeria) give digital signatures the same legal standing as wet ink. Platforms like DocuSign and PandaDoc automate execution workflows.' },
            { title: 'AI Document Review', position: 1, content_text: 'AI contract review tools (Kira, Luminance, Harvey) identify clauses, flag anomalies, and compare terms against standard positions in minutes — tasks that once took junior associates days.' },
          ],
        },
        {
          title: 'Smart Contracts & Dispute Resolution',
          position: 1,
          lessons: [
            { title: 'Smart Contracts on Ethereum', position: 0, content_text: 'Smart contracts are self-executing code on a blockchain. When pre-defined conditions are met, they automatically transfer assets or trigger actions — eliminating the need for intermediaries in many commercial agreements.' },
            { title: 'Online Dispute Resolution (ODR)', position: 1, content_text: 'ODR platforms like Modria and Smartsettle resolve disputes digitally — reducing costs and delays for consumer complaints, small claims, and cross-border commercial conflicts.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Smart Farming with IoT & Precision Agriculture',
        slug: 'smart-farming-iot',
        description:
          'Discover how sensors, drones, satellite imagery, and data analytics are revolutionising food production and helping farmers increase yields sustainably.',
        faculty_id: fm['agritech'],
        instructor_id: instructorId,
        price: 14000,
        level: 'beginner',
        program_type: 'express',
        duration: '7 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'IoT on the Farm',
          position: 0,
          lessons: [
            { title: 'Soil & Weather Sensors', position: 0, content_text: 'IoT soil sensors measure moisture, temperature, nitrogen, and pH in real-time. Combined with weather station data, they enable precision irrigation — reducing water use by up to 40% without yield loss.' },
            { title: 'Drones for Crop Monitoring', position: 1, content_text: 'Agricultural drones capture multispectral imagery to detect crop stress, pest damage, and nutrient deficiencies weeks before they become visible to the naked eye. NDVI indices are the core analytical output.' },
          ],
        },
        {
          title: 'Data-Driven Decisions',
          position: 1,
          lessons: [
            { title: 'Satellite Imagery & Remote Sensing', position: 0, content_text: 'Platforms like Planet Labs and Sentinel-2 provide free weekly satellite imagery with 10m resolution. Farmers and cooperatives use this data to monitor large-scale land use and forecast harvests.' },
            { title: 'Farm Management Software', position: 1, content_text: 'Farm management platforms (Farmerline, Hello Tractor, Agrostar) aggregate field data, automate record-keeping, and connect smallholders to inputs, credit, and markets through a single app.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'People Analytics & Modern HR Systems',
        slug: 'people-analytics-hr',
        description:
          'Use data to make better talent decisions. Covers HR information systems, workforce analytics, recruitment tech, and employee experience platforms.',
        faculty_id: fm['hrtech'],
        instructor_id: instructorId,
        price: 16000,
        level: 'beginner',
        program_type: 'certificate',
        duration: '9 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'HRIS & Core Systems',
          position: 0,
          lessons: [
            { title: 'Choosing an HRIS Platform', position: 0, content_text: 'HRIS platforms (BambooHR, Workday, SAP SuccessFactors) centralise employee data, automate payroll, and streamline compliance. SMEs typically start with lightweight SaaS tools before graduating to enterprise systems.' },
            { title: 'Applicant Tracking Systems (ATS)', position: 1, content_text: 'ATS software manages the entire recruitment lifecycle — job posting, CV parsing, interview scheduling, and offer management. Greenhouse, Lever, and Rippling are leading platforms in this space.' },
          ],
        },
        {
          title: 'Analytics & Employee Experience',
          position: 1,
          lessons: [
            { title: 'Workforce Analytics Fundamentals', position: 0, content_text: 'People analytics applies statistical analysis to HR data to answer questions like: Which factors predict employee attrition? What is the ROI of our training programme? How diverse is our leadership pipeline?' },
            { title: 'Pulse Surveys & eNPS', position: 1, content_text: 'Employee Net Promoter Score (eNPS) measures how likely employees are to recommend the company as a place to work. Pulse surveys — 5-10 questions, monthly — capture sentiment shifts before they become turnover spikes.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Content Creation & Digital Storytelling',
        slug: 'content-creation-digital-storytelling',
        description:
          'Develop skills in video production, social media strategy, podcasting, and branded content to build audiences and communicate with impact in the digital age.',
        faculty_id: fm['mediatech'],
        instructor_id: instructorId,
        price: 10000,
        level: 'beginner',
        program_type: 'express',
        duration: '6 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'Foundations of Digital Storytelling',
          position: 0,
          lessons: [
            { title: 'The Story Arc in Content', position: 0, content_text: 'Compelling content follows narrative arcs: establish a relatable protagonist, introduce a tension or problem, build towards resolution, and close with a clear call to action. This structure applies equally to Instagram Reels, long-form videos, and podcast episodes.' },
            { title: 'Platform Algorithm Basics', position: 1, content_text: 'Each platform favours different signals: YouTube optimises for watch time and click-through rate, Instagram for saves and shares, TikTok for completion rate. Align your format and length to the platform\'s distribution logic.' },
          ],
        },
        {
          title: 'Production & Distribution',
          position: 1,
          lessons: [
            { title: 'Smartphone Video Production', position: 0, content_text: 'Modern smartphones shoot professional-quality video. The key variables are lighting (natural side-light is best), audio (a $20 lapel mic beats a $500 camera microphone), and stable framing (a tripod + grid lines).' },
            { title: 'Content Calendar & Repurposing', position: 1, content_text: 'A content calendar maps topics, formats, and publishing cadences across platforms. A single interview can be repurposed into: a full YouTube video, 3 short clips, a podcast episode, 5 quotes for Twitter, and a newsletter segment.' },
          ],
        },
      ],
    },
    {
      course: {
        title: 'Civic Innovation & Digital Government',
        slug: 'civic-innovation-digital-govt',
        description:
          'Explore how governments leverage technology to improve service delivery, enhance transparency, and engage citizens — from e-government portals to open data initiatives.',
        faculty_id: fm['govtech'],
        instructor_id: instructorId,
        price: 0,
        level: 'beginner',
        program_type: 'express',
        duration: '5 hours',
        is_published: true,
      },
      modules: [
        {
          title: 'E-Government Fundamentals',
          position: 0,
          lessons: [
            { title: 'Digital Identity & Gov Portals', position: 0, content_text: 'National digital identity systems (India\'s Aadhaar, Estonia\'s e-ID, Nigeria\'s NIN) enable citizens to authenticate online and access government services without physical visits. Well-designed portals reduce service delivery times from weeks to minutes.' },
            { title: 'Open Data & Transparency', position: 1, content_text: 'Open data initiatives publish government datasets — budgets, contracts, health statistics — in machine-readable formats. Civil society organisations and journalists use this data to hold governments accountable and drive evidence-based policy advocacy.' },
          ],
        },
        {
          title: 'Civic Tech & Participation',
          position: 1,
          lessons: [
            { title: 'Digital Public Participation Tools', position: 0, content_text: 'Platforms like Consul, Decidim, and FixMyStreet enable citizens to report issues, propose policies, and vote on local priorities. Lagos State\'s e-government portal and Kenya\'s eCitizen are leading African examples.' },
            { title: 'GovTech Procurement & Challenges', position: 1, content_text: 'GovTech faces unique barriers: risk-averse procurement cycles, legacy IT infrastructure, and capacity gaps. Successful implementations combine agile delivery teams with strong change management and political will from senior leadership.' },
          ],
        },
      ],
    },
  ]
}

// ── 4. Insert everything ───────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 HIS Course Seeder\n')

  console.log('Step 1: Ensuring instructor account…')
  const instructorId = await ensureInstructor()

  console.log('Step 2: Loading faculties…')
  const facultyMap = await getFacultyMap()

  const courses = buildCourses(instructorId, facultyMap)

  console.log(`Step 3: Inserting ${courses.length} courses…\n`)

  for (const { course, modules } of courses) {
    // Skip if slug already exists
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', course.slug)
      .single()

    if (existing) {
      console.log(`  ⏭  Skipped (exists): ${course.title}`)
      continue
    }

    // Insert course
    const { data: inserted, error: courseError } = await supabase
      .from('courses')
      .insert(course)
      .select('id')
      .single()

    if (courseError) {
      console.error(`  ✗  Failed: ${course.title} — ${courseError.message}`)
      continue
    }

    const courseId = inserted.id

    // Insert modules + lessons
    for (const mod of modules) {
      const { data: modRow, error: modError } = await supabase
        .from('modules')
        .insert({ course_id: courseId, title: mod.title, position: mod.position })
        .select('id')
        .single()

      if (modError) {
        console.error(`    ✗ Module failed: ${mod.title} — ${modError.message}`)
        continue
      }

      const lessonRows = mod.lessons.map((l) => ({
        module_id: modRow.id,
        course_id: courseId,
        title: l.title,
        position: l.position,
        content_type: 'text' as const,
        content_text: l.content_text,
        is_free_preview: l.position === 0 && mod.position === 0,
      }))

      const { error: lessonsError } = await supabase.from('lessons').insert(lessonRows)
      if (lessonsError) {
        console.error(`    ✗ Lessons failed for module "${mod.title}": ${lessonsError.message}`)
      }
    }

    console.log(`  ✓  ${course.title}`)
  }

  console.log('\n✅ Seeding complete.\n')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
