export type Cell = true | false | string;

export type PackageId = 'code' | 'comfort' | 'premium';

export type Package = {
	id: PackageId;
	option: 1 | 2 | 3;
	name: string;
	rate: number;
	summary: string;
	addon?: string;
};

export type ComparisonRow = {
	section: string;
	feature: string;
	values: [Cell, Cell, Cell];
};

export type FeaturePhoto = {
	title: string;
	caption: string;
	/** CSS gradient used until a real project photo is supplied. */
	tone: string;
};

export const packages: Package[] = [
	{
		id: 'code',
		option: 1,
		name: 'Code Compliant',
		rate: 8,
		summary: 'NEC-compliant wiring and LED lighting, built to pass inspection.',
		addon: 'Recessed LED lights, an additional $60 each.'
	},
	{
		id: 'comfort',
		option: 2,
		name: 'Comfort Essentials',
		rate: 12,
		summary:
			'HALO recessed lighting, room-by-room comfort features, and 10 Gig-ready structured cabling.'
	},
	{
		id: 'premium',
		option: 3,
		name: 'Smart-Home Premium',
		rate: 20,
		summary:
			'SPAN smart panel, smart dimmers, speaker pre-wire, a complete Omada network, cameras, and a home server.'
	}
];

export const comparison: ComparisonRow[] = [
	{
		section: 'General',
		feature: 'NEC compliant receptacle spacing and circuits',
		values: [true, true, true]
	},
	{
		section: 'General',
		feature: 'Pass inspection guaranteed',
		values: [true, true, true]
	},
	{ section: 'General', feature: 'SPAN Smart Panel', values: [false, false, true] },
	{
		section: 'General',
		feature: 'UL 916 Energy Management System',
		values: [false, false, true]
	},
	{
		section: 'General',
		feature: 'Battery backup / off-grid ready',
		values: [false, false, true]
	},
	{
		section: 'Lighting',
		feature: 'Light fixture type',
		values: [
			'Screw-in light sockets with LED bulbs',
			'HALO recessed LED lights with night-lights (replaces screw-in sockets)',
			'HALO recessed LED lights with night-lights + dimmers (replaces screw-in sockets)'
		]
	},
	{
		section: 'Bedrooms',
		feature: 'Switch + power circuits at all receptacles',
		values: [false, true, true]
	},
	{ section: 'Bedrooms', feature: 'Closet light wiring*', values: [false, true, true] },
	{
		section: 'Bedrooms',
		feature: 'Smart dimmers (connected to Home Assistant)',
		values: [false, false, true]
	},
	{
		section: 'Bedrooms',
		feature: 'Corner uplighting wiring + dimmer*',
		values: [false, false, true]
	},
	{ section: 'Kitchen', feature: 'Under-cabinet light wiring*', values: [false, true, true] },
	{ section: 'Kitchen', feature: 'Counter edge light wiring*', values: [false, false, true] },
	{ section: 'Kitchen', feature: 'In-cabinet light wiring*', values: [false, false, true] },
	{ section: 'Kitchen', feature: 'Speaker pre-wire', values: [false, false, true] },
	{
		section: 'Living room',
		feature: 'Corner trim light wiring*',
		values: [false, 'Wiring', 'Wiring + dimmer']
	},
	{
		section: 'Living room',
		feature: 'TV mount with framed backer',
		values: [false, true, true]
	},
	{
		section: 'Living room',
		feature: 'TV recessed box to hide all wires',
		values: [false, true, true]
	},
	{ section: 'Living room', feature: 'Speaker pre-wire', values: [false, false, true] },
	{ section: 'Bathrooms', feature: 'Vanity light wiring*', values: [true, true, true] },
	{ section: 'Bathrooms', feature: 'Premium quiet exhaust fans', values: [false, true, true] },
	{ section: 'Bathrooms', feature: 'Bidet receptacles', values: [false, true, true] },
	{ section: 'Bathrooms', feature: 'Spa receptacles', values: [false, true, true] },
	{
		section: 'Patio / Deck',
		feature: 'Low-voltage light wiring*',
		values: [false, false, true]
	},
	{ section: 'Patio / Deck', feature: 'Speaker pre-wire', values: [false, false, true] },
	{
		section: 'Garage',
		feature: 'EV charger or welder circuit',
		values: [false, false, true]
	},
	{
		section: 'Network',
		feature: 'ISP connection',
		values: ['Pre-wire for ISP', 'Conduit for ISP', 'Conduit for ISP']
	},
	{
		section: 'Network',
		feature: 'Network cabling',
		values: [false, '10 Gig ready + media enclosure', '100 Gig ready + network rack']
	},
	{ section: 'Network', feature: 'Equipment', values: [false, false, '2.5Gig WiFi'] },
	{
		section: 'Cameras + Server',
		feature: '5 × NC800 1/1.2" night-vision perimeter cameras',
		values: [false, false, true]
	},
	{
		section: 'Cameras + Server',
		feature:
			'N150 server running Frigate Camera System (AI Smart Detection) + Home Assistant (Automation)',
		values: [false, false, true]
	},
	{
		section: 'Service',
		feature: '1 year of Priority Service',
		values: [false, false, true]
	}
];

export const fixtureFootnote =
	'*Decorative fixtures provided by customer. Ask about our preferred designers.';

export const featurePhotos: FeaturePhoto[] = [
	{
		title: 'HALO recessed lights',
		caption: 'Night-light mode built into the recessed LEDs, so hallways stay usable after dark.',
		tone: 'from-zinc-700 via-zinc-800 to-zinc-950'
	},
	{
		title: 'Kitchen lighting',
		caption: 'Under-cabinet and in-cabinet lighting, wired before the cabinets go in.',
		tone: 'from-amber-950 via-zinc-800 to-zinc-950'
	},
	{
		title: 'Hidden TV wiring',
		caption: 'A recessed box behind the TV so power and signal cables stay out of sight.',
		tone: 'from-zinc-600 via-zinc-800 to-zinc-950'
	},
	{
		title: 'SPAN smart panel',
		caption: 'A smart panel you can see and control from the app, including backup-ready circuits.',
		tone: 'from-emerald-950 via-zinc-800 to-zinc-950'
	},
	{
		title: 'Structured cabling',
		caption: 'A media enclosure or network rack, planned with the electrical rough-in.',
		tone: 'from-sky-950 via-zinc-800 to-zinc-950'
	},
	{
		title: 'EV charger circuit',
		caption: 'A dedicated circuit for an EV charger or welder, sized for the load.',
		tone: 'from-zinc-700 via-zinc-900 to-zinc-950'
	},
	{
		title: 'Cameras and automation',
		caption: 'Perimeter cameras with AI detection, plus a Home Assistant dashboard for the house.',
		tone: 'from-indigo-950 via-zinc-800 to-zinc-950'
	}
];

export const faqs = [
	{
		question: 'How is pricing calculated?',
		answer:
			'Square footage times the package rate. A 2,000 square foot home is about $16,000 on Option 1, $24,000 on Option 2, and $40,000 on Option 3. The calculator on this page is an estimate, not a bid.'
	},
	{
		question: 'Can I customize a package?',
		answer:
			'Yes. Packages are a starting point. Ask about custom upgrades such as dimmers, extra recessed lights, or a feature from a higher option.'
	},
	{
		question: 'Who provides light fixtures?',
		answer:
			'HALO recessed LEDs are included where the package lists them. Decorative fixtures are customer-provided. Ask about our preferred designers if you want help picking them.'
	},
	{
		question: "What's the service area?",
		answer:
			'Lenoir, NC and the surrounding area, including Hickory, Granite Falls, Taylorsville, Morganton, Hudson, and Maiden. Confirm the job location with Marcus before you count on a date.'
	}
];

export function estimate(sqft: number, rate: number) {
	if (!Number.isFinite(sqft) || sqft <= 0) return null;
	return Math.round(sqft * rate);
}

export function formatDollars(amount: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(amount);
}

export function comparisonSections() {
	const sections: { name: string; rows: ComparisonRow[] }[] = [];
	for (const row of comparison) {
		const last = sections.at(-1);
		if (last?.name === row.section) last.rows.push(row);
		else sections.push({ name: row.section, rows: [row] });
	}
	return sections;
}
