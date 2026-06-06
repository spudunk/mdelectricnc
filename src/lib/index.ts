// place files you want to import through the `$lib` alias in this folder.

export const contact = {
  phone: '(541) 555-0123',
  email: 'info@atlasplumbed.com',
  tel: '+15415550123'
};

export const site = {
  name: 'Atlas Plumbing',
  url: 'https://atlasplumbed.com',
  title: 'Atlas Plumbing | Residential & Commercial Plumbing in Albany, OR',
  description:
    'Atlas Plumbing provides professional residential and commercial plumbing services and new construction plumbing in Albany, Oregon.',
  og: {
    title: 'Atlas Plumbing | Plumbing Services Albany, OR',
    description:
      'Expert residential, commercial, and new construction plumbing services in Albany, Oregon.'
  },
  twitter: {
    title: 'Atlas Plumbing | Albany, OR',
    description:
      'Residential & commercial plumbing and new construction services in Albany, Oregon.'
  }
};

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
  telephone: contact.phone,
  url: 'https://atlasplumbed.com',
  serviceType: ['Residential Plumbing', 'Commercial Plumbing', 'New Construction Plumbing']
};
