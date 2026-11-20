// One place for identity, links and integrations. Edit here; every page reads from it.
export const SITE = {
  name: 'Apurva Raj',
  title: 'Apurva Raj — Technology Leader, AI & Agentic Systems',
  description:
    'Apurva Raj, Co-Founder & CTO at FidelFolio Investments: 13+ years building enterprise platforms and AI systems across agentic AI, fintech, blockchain and data.',
  role: 'Co-Founder & CTO, FidelFolio Investments',
  headline: 'Building Intelligent Systems. Engineering Scalable Products.',
  supporting:
    '13+ years of engineering experience, building enterprise platforms and intelligent systems at the intersection of software, AI, data, and technology.',
  positioning: ['Technology Leader', 'AI & Agentic Systems', 'Enterprise Architecture'],
  location: 'Bengaluru, India',
  email: 'just.apurva@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/apurva-raj-b3918b24/',
    github: 'https://github.com/apurvaRaj',
  },
  locale: 'en_IN',
};

// Integrations stay off until an ID is set as a build-time environment variable
// (GitHub: Settings → Secrets and variables → Actions → Variables).
export const INTEGRATIONS = {
  ga4: import.meta.env.PUBLIC_GA4_ID || '',
  googleVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  bingVerification: import.meta.env.PUBLIC_BING_SITE_VERIFICATION || '',
};

export const NAV = [
  { href: '/projects/', label: 'Work' },
  { href: '/experience/', label: 'Experience' },
  { href: '/insights/', label: 'Insights' },
  { href: '/about/', label: 'About' },
];
