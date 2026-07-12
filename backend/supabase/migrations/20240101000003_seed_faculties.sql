-- ============================================================
-- HIS — Seed: 11 Faculties
-- Run order: 3
-- ============================================================

insert into faculties (id, name, slug, description, icon) values
  (gen_random_uuid(), 'MedTech',      'medtech',      'Health, medicine, and medical technology innovation',          '🏥'),
  (gen_random_uuid(), 'LawTech',      'lawtech',      'Legal technology, digital law, and justice innovation',        '⚖️'),
  (gen_random_uuid(), 'FinTech',      'fintech',      'Financial technology, payments, and investment innovation',     '💳'),
  (gen_random_uuid(), 'EdTech',       'edtech',       'Education technology, learning design, and e-learning tools',  '📚'),
  (gen_random_uuid(), 'AgriTech',     'agritech',     'Agricultural technology, food systems, and agribusiness',      '🌱'),
  (gen_random_uuid(), 'BusinessTech', 'businesstech', 'Entrepreneurship, digital business, and startup strategy',     '💼'),
  (gen_random_uuid(), 'GovTech',      'govtech',      'Government technology, civic innovation, and public service',  '🏛️'),
  (gen_random_uuid(), 'HRTech',       'hrtech',       'Human resources technology, talent management, and people ops','👥'),
  (gen_random_uuid(), 'CyberTech',    'cybertech',    'Cybersecurity, ethical hacking, and digital safety',           '🔐'),
  (gen_random_uuid(), 'MediaTech',    'mediatech',    'Media technology, content creation, and digital storytelling', '🎬'),
  (gen_random_uuid(), 'FaithTech',    'faithtech',    'Faith, ethics, and technology at the intersection of purpose', '✝️')
on conflict (slug) do nothing;
