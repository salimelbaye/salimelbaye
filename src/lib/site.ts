import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, Activity, Code2, Zap, Rocket } from 'lucide-react';

/**
 * Single source of truth for every piece of content on the site.
 * Edit here, not in components — sections read from these arrays.
 */

export const site = {
  name: 'Salim Elbaye',
  role: 'Software Engineer • AI Automation • Cybersecurity',
  tagline: 'Building AI SaaS, browser extensions and automation systems.',
  url: 'https://salimelbaye.com',
  email: 'contact@salimelbaye.com',
  locale: 'en_US',
  positioning: 'Available for international collaboration',
  description:
    'I turn repetitive business work into software that runs without anyone watching it — data platforms that have processed 100,000+ business records, Chrome extensions people open every morning, and AI workflows that answer customers at 3am.',
  ogImage: '/og.png',
  portrait: '/salim-elbaye.jpg',
  social: {
    github: 'https://github.com/salimelbaye',
    linkedin: 'https://www.linkedin.com/in/salim-el-baye-b124a9112/',
    email: 'mailto:contact@salimelbaye.com',
  },
} as const;

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Code', href: '/#code' },
  { label: 'Journey', href: '/#about' },
  { label: 'Notes', href: '/#notes' },
  { label: 'Resume', href: '/#resume' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const currentlyBuilding = [
  { label: 'Maps Data Platform', tone: 'blue' },
  { label: 'AI Domain Discovery', tone: 'purple' },
  { label: 'WhatsApp Automation', tone: 'emerald' },
] as const;

export type Stat = { value: number; suffix: string; label: string; sub: string };

/** TODO(salim): replace every figure below with your real, defensible numbers. */
export const stats: Stat[] = [
  { value: 100, suffix: 'K+', label: 'Business records', sub: 'Processed' },
  { value: 5, suffix: '', label: 'SaaS products', sub: 'Built & shipped' },
  { value: 3, suffix: '', label: 'AI automations', sub: 'In production' },
  { value: 2, suffix: '', label: 'Chrome extensions', sub: 'Published' },
  { value: 6, suffix: '+', label: 'Years building', sub: 'Since 2019' },
];

export type Project = {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  chips: string[];
  tone: 'blue' | 'purple' | 'emerald';
  href: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'google-maps-data-platform',
    kicker: 'Data platform',
    title: 'Google Maps Data Platform',
    summary:
      "Turns any city and category into a clean, verified list of businesses — names, phones, sites, ratings and coordinates. Built for sales teams who need real leads instead of scraped noise.",
    chips: ['100K+ records', '40+ countries', 'Dedupe & enrich', 'CSV / JSON / API'],
    tone: 'blue',
    href: '/projects/google-maps-data-platform',
    featured: true,
  },
  {
    slug: 'ai-domain-discovery',
    kicker: 'AI product',
    title: 'AI Domain Discovery',
    summary:
      'Scores available domains on brandability, length and market signals — 500 names swept in under three seconds.',
    chips: ['LLM scoring', 'Live availability', 'Bulk export'],
    tone: 'purple',
    href: '/projects/ai-domain-discovery',
  },
  {
    slug: 'whatsapp-automation',
    kicker: 'Automation',
    title: 'WhatsApp Automation',
    summary:
      'Answers routine customer messages around the clock, escalates the rest with full context, and logs every thread to the CRM.',
    chips: ['24/7 replies', 'Lead routing', 'CRM sync'],
    tone: 'emerald',
    href: '/projects/whatsapp-automation',
  },
];

export type Milestone = { title: string; period: string; body: string; icon: LucideIcon };

export const journey: Milestone[] = [
  {
    title: 'Military',
    period: 'Where it started',
    body: 'Learned to operate under pressure, follow a standard, and finish what I start. Everything after this borrowed that habit.',
    icon: ShieldCheck,
  },
  {
    title: 'Athlete',
    period: 'Same trait, new arena',
    body: 'Years of training taught me the compounding curve: small work repeated daily beats intensity that quits.',
    icon: Activity,
  },
  {
    title: 'Software Engineer',
    period: 'Learning to ship',
    body: 'Moved from tutorials to production: TypeScript, React, Next.js, Postgres, and the unglamorous parts — deploys, monitoring, support.',
    icon: Code2,
  },
  {
    title: 'Automation Developer',
    period: 'Removing manual work',
    body: 'Built the scrapers, browser extensions and AI workflows that replaced hours of copy-paste for real teams — and found the market by accident.',
    icon: Zap,
  },
  {
    title: 'Founder',
    period: 'Now',
    body: 'I run my own products end to end — first line of code to first paying customer, and every support ticket in between.',
    icon: Rocket,
  },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
};

export const posts: Post[] = [
  {
    slug: 'from-scraping-to-data-products',
    title: 'Why I stopped scraping and started building data products',
    excerpt:
      'A scraper is a script. A data product is a promise about freshness, accuracy and support — and the second one is what people pay for.',
    category: 'Engineering',
    date: '2026-03-04',
    readingTime: '6 min read',
  },
  {
    slug: 'ai-features-people-keep-using',
    title: 'Shipping an AI feature people actually keep using',
    excerpt:
      'Most AI features get tried once. The ones that stick remove a decision, not just a keystroke — here is the test I run before building.',
    category: 'Product',
    date: '2026-02-11',
    readingTime: '8 min read',
  },
  {
    slug: 'my-automation-stack',
    title: 'The automation stack I run my business on',
    excerpt:
      'Every tool I use to keep a one-person software company running, what each one replaced, and the three I would drop tomorrow.',
    category: 'Automation',
    date: '2026-01-19',
    readingTime: '5 min read',
  },
];

/* ────────────────────────────────────────────────────────────
   v2 content — flagship case study, stack, GitHub, notes, resume
   ──────────────────────────────────────────────────────────── */

export const flagship = {
  badge: 'Flagship · Chrome Extension + SaaS',
  title: 'Google Maps Data Platform',
  summary:
    "Turns any city and category into a verified, deduplicated list of businesses — delivered straight into a sales team's CRM. Runs in production today.",
  stack: ['TypeScript', 'Chrome Extensions', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
  /** TODO(salim): every impact figure must be replaced with a real, defensible number. */
  impact: [
    { icon: 'database', value: 100, suffix: 'K+', label: 'Business records processed' },
    { icon: 'globe', value: 40, suffix: '+', label: 'Countries covered' },
    { icon: 'shield', value: 98, suffix: '%', label: 'Deduplication accuracy' },
    { icon: 'timer', value: 4, suffix: 'min', label: 'To build a 3,000-lead list' },
  ],
} as const;

/** GitHub is fetched server-side. Repos need no auth; contributions need a read-only PAT. */
export const github = {
  username: 'salimelbaye', // TODO(salim): set your real handle
  profileUrl: 'https://github.com/salimelbaye',
  revalidateSeconds: 3600,
};

export type Note = {
  slug: string;
  tag: string;
  tone: 'blue' | 'purple' | 'emerald';
  title: string;
  excerpt: string;
  metrics: { value: string; label: string }[];
};

export const notes: Note[] = [
  {
    slug: 'deduplicating-business-records',
    tag: 'Case study',
    tone: 'blue',
    title: 'Cutting duplicate business records from 1-in-5 to 1-in-50',
    excerpt:
      'Exact string matching failed on the first real dataset. What finally worked was normalising aggressively, then matching on geohash proximity plus name distance rather than on any single field.',
    metrics: [
      { value: '-90%', label: 'duplicates' },
      { value: '100K+', label: 'records tested' },
    ],
  },
  {
    slug: 'resumable-long-running-jobs',
    tag: 'Architecture',
    tone: 'purple',
    title: 'Making a six-hour scrape survive a dropped connection',
    excerpt:
      'Long jobs need to be resumable, not fast. Moving to checkpointed queue workers meant a failure costs the last chunk instead of the whole run — and made concurrency safe to raise.',
    metrics: [
      { value: '6h → 4m', label: '3k-record job' },
      { value: '0', label: 'full restarts' },
    ],
  },
  {
    slug: 'shipping-a-chrome-mv3-extension',
    tag: 'Open source',
    tone: 'emerald',
    title: "Shipping a Chrome MV3 extension that doesn't get rejected",
    excerpt:
      'Manifest V3 killed the patterns most scraping extensions relied on. Notes on service-worker lifecycles, permission scoping, and passing store review the first time.',
    metrics: [
      { value: 'MV3', label: 'compliant' },
      { value: '1st', label: 'review pass' },
    ],
  },
];

export const resume = {
  cvUrl: '/salim-elbaye-cv.pdf', // TODO(salim): add this file to /public
  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Chrome MV3'] },
    { group: 'Backend & data', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Prisma'] },
    { group: 'Infrastructure', items: ['Docker', 'Cloudflare', 'Vercel', 'GitHub Actions'] },
    { group: 'AI', items: ['Claude API', 'OpenAI', 'pgvector', 'n8n'] },
  ],
  /** placeholder: true renders a visible dashed marker so nothing fake ever ships silently. */
  education: [
    {
      title: 'Computer Science',
      subtitle: 'Self-directed, project-based — shipped products as the curriculum',
      when: '2019 — now',
      placeholder: true,
    },
    {
      title: '',
      subtitle: 'Add your formal qualification here',
      when: '',
      placeholder: true,
    },
  ],
  certifications: [
    {
      title: '',
      subtitle: 'Cloud, security or language certificates carry real weight on a German visa file',
      when: '',
      placeholder: true,
    },
  ],
  /** TODO(salim): confirm your actual CEFR levels before publishing. */
  languages: [
    { name: 'Arabic', level: 'Native', pct: 100 },
    { name: 'French', level: 'C1 · fluent', pct: 85 },
    { name: 'English', level: 'C1 · fluent', pct: 80 },
    { name: 'German', level: 'A2 · learning', pct: 35 },
  ],
};
