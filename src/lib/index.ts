// place files you want to import through the `$lib` alias in this folder.
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Atlas Plumbing',
  description:
    'Professional residential and commercial plumbing services and new construction in Albany, Oregon.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Albany',
    addressRegion: 'OR',
    addressCountry: 'US'
  },
  areaServed: 'Albany, OR',
  telephone: '(541) 555-0123',
  url: 'https://atlasplumbed.com',
  serviceType: ['Residential Plumbing', 'Commercial Plumbing', 'New Construction Plumbing']
};
