import { site, projects } from './site';

/** Schema.org structured data — rendered as JSON-LD in the root layout. */

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  url: site.url,
  image: `${site.url}${site.portrait}`,
  email: site.email,
  jobTitle: site.role,
  description: site.description,
  knowsAbout: [
    'Software engineering',
    'SaaS product development',
    'AI automation',
    'Web scraping and data platforms',
    'Browser extensions',
    'Next.js',
    'TypeScript',
  ],
  sameAs: [site.social.github, site.social.linkedin],
  address: { '@type': 'PostalAddress', addressCountry: 'MA' },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { '@id': `${site.url}/#person` },
  inLanguage: 'en',
};

export const projectsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Featured projects',
  itemListElement: projects.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: p.title,
      description: p.summary,
      applicationCategory: 'BusinessApplication',
      author: { '@id': `${site.url}/#person` },
    },
  })),
};
