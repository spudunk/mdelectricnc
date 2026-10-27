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
export const googleReviewsUrl =
	'https://search.google.com/local/reviews?placeid=ChIJpRPX8HMjUYgRKmBgeY6KGBk';
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
		'Structured network cabling',
		'Dock wiring'
	]
};

export const testimonials = [
	{
		quote:
			'Marcus and his crew have done a few jobs around our house and recently did the electrical setup for our dock. They do excellent work and are very professional. He’s always been very responsive and their prices can’t be beat. Highly recommended if you’re looking for an electrician.',
		author: 'Matt Hill'
	},
	{
		quote:
			'Thank you Marcus (and crew) for the amazing job you did by updating our kitchen lights!! The recess lights are great. We also appreciate the timely manner in which you installed the lights and for being so diligent with being clean and tidying up the work area. We will definitely recommend you!',
		author: 'Jaimie Cansler'
	},
	{
		quote:
			'My experience with Marcus was delightful. He is kind, professional, responded immediately to my text, and kept lines of communication open. His pricing was fair and honest. I would highly recommend him!!!!!',
		author: 'DeDee Hubbard'
	}
];
