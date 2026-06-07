// place files you want to import through the `$lib` alias in this folder.

import { writable } from 'svelte/store';

export type Contact = { phone?: string; email: string; tel?: string };

export const verifiedContact = writable<Contact | null>(null);

export const contact = {
  phone: '(971) 239-3552',
  email: 'info@atlasplumbed.com',
  tel: '+19712393552',
  showTel: false
};

export const site = {
  name: 'Atlas Plumbing',
  url: 'https://atlasplumbed.com',
  title: 'Atlas Plumbing | Professional Plumbing Service in Albany, OR',
  description:
    'Atlas Plumbing provides professional residential and commercial plumbing services and new construction plumbing in Albany, Oregon.'
};

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: site.name,
  description:
    site.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Albany',
    addressRegion: 'OR',
    addressCountry: 'US'
  },
  areaServed: 'Albany, OR',
  url: 'https://atlasplumbed.com',
  serviceType: ['Residential Plumbing', 'Commercial Plumbing', 'New Construction Plumbing'],
  ...(contact.showTel && { telephone: contact.phone })
};

export const testimonials = [
  {
    quote:
      'Atlas Plumbing fixed our leaking pipe the same day. Professional, clean, and honest. Highly recommend.',
    author: 'Sarah T., Albany'
  }
];


export const turnstileDevKeys = {
	public: {
		pass: '1x00000000000000000000AA',
		fail: '2x00000000000000000000AB',
		challenge: '3x00000000000000000000FF'
	},
	private: {
		pass: '1x0000000000000000000000000000000AA',
		fail: '2x0000000000000000000000000000000AA',
		used: '3x0000000000000000000000000000000AA'
	}
}