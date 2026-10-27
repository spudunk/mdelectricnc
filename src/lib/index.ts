// place files you want to import through the `$lib` alias in this folder.

import { writable } from 'svelte/store';

export type Contact = { phone?: string; email: string; tel?: string };

export const verifiedContact = writable<Contact | null>(null);

export const contact = {
	phone: '(828) 499-3520',
	email: 'info@mdelectricnc.com',
	tel: '+18284993520'
};

export const site = {
	name: 'Marcus Dyess Electric LLC',
	shortName: 'MDE',
	url: 'https://mdelectricnc.com',
	title: 'Marcus Dyess Electric | Custom Home Electrical in Lenoir, NC',
	description:
		'Licensed and insured electrical contractor for custom home builders across the Catawba Valley. New construction wiring, custom lighting, and panel work from a crew with 30+ years of experience.'
};

export const mapsUrl = 'https://maps.app.goo.gl/jMm7yuvyPPm1jtFw8';
export const facebookUrl = 'https://www.facebook.com/profile.php?id=61575121650048';
export const googlePlaceID = 'ChIJpRPX8HMjUYgRKmBgeY6KGBk';
export const licenseLookupUrl = 'https://arls-public.ncbeec.org/public/Search';
export const licenseNumber = '35895';

export const rating = { score: 5.0, count: 8, label: 'Google reviews' };

export const areas = [
	'Lenoir',
	'Hickory',
	'Granite Falls',
	'Taylorsville',
	'Morganton',
	'Hudson',
	'Maiden'
];

export const structuredData = {
	'@context': 'https://schema.org',
	'@type': 'Electrician',
	name: site.name,
	description: site.description,
	image: `${site.url}/mde_logo.png`,
	telephone: contact.phone,
	email: contact.email,
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Lenoir',
		addressRegion: 'NC',
		addressCountry: 'US'
	},
	geo: {
		'@type': 'GeoCoordinates',
		latitude: 35.908758,
		longitude: -81.413292
	},
	areaServed: areas.map((name) => ({ '@type': 'City', name, addressRegion: 'NC' })),
	url: site.url,
	sameAs: [facebookUrl, mapsUrl],
	hasMap: mapsUrl,
	founder: {
		'@type': 'Person',
		name: 'Marcus Dyess'
	},
	priceRange: '$$',
	knowsAbout: [
		'Custom home electrical',
		'New construction wiring',
		'Interior custom lighting',
		'Panel upgrades',
		'Dock wiring'
	]
};

export const testimonials = [
	{
		quote:
			'Marcus explained everything and completed the job efficiently. We really appreciated the attention to the details and how respectful they were of our home.',
		author: 'Google review'
	},
	{
		quote:
			'Marcus communicated directly, walked the entire project, and updated us throughout the day. He and his crew were polite and welcoming.',
		author: 'Google review'
	},
	{
		quote:
			'Marcus and his crew do excellent work and are very professional. Always responsive, and their prices can’t be beat.',
		author: 'Google review'
	}
];
