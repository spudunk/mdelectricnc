<script lang="ts">
	import { enhance } from '$app/forms';
	import { dev } from '$app/environment';
	import Logo from '$lib/Logo.svelte';
	import StarRating from '$lib/StarRating.svelte';
	import {
		areas,
		facebookUrl,
		licenseNumber,
		googleReviewsUrl,
		mapsUrl,
		rating,
		site,
		structuredData,
		testimonials,
		verifiedContact,
		type Contact
	} from '$lib';
	import { turnstile, publicKey as tsPublicKey, publicDevKeys as tsKeys } from '$lib/turnstile';
	import House from 'virtual:icons/material-symbols/house-outline';
	import Handshake from 'virtual:icons/material-symbols/handshake-outline';
	import Groups from 'virtual:icons/material-symbols/groups-outline';
	import Verified from 'virtual:icons/material-symbols/verified-outline';

	const turnstileSiteKey = dev
		? tsKeys.pass // pass all turnstile requests in Dev
		: tsPublicKey;

	let { data } = $props();

	let contact = $state<Contact | null>(null);
	let error = $state<string | null>(null);
	let turnstileCtrl: { reset: () => void } | null = $state(null);

	function retry() {
		error = null;
		turnstileCtrl?.reset();
	}

	function handleTurnstileError(code: string) {
		error = 'Security check failed. Please try again.';
		console.error('Turnstile error:', code);
	}

	function handleTurnstileTimeout() {
		error = 'Security check timed out. Please complete the challenge.';
	}

	function handleTurnstileExpired() {
		error = 'Security check expired. Please try again.';
	}

	function handleTurnstileEnhance() {
		return async ({ result }: { result: { type: string; data?: Record<string, unknown> } }) => {
			if (result.type === 'success' && result.data?.success) {
				const d = result.data as Contact & { success?: boolean };
				contact = { phone: d.phone, email: d.email, tel: d.tel };
				verifiedContact.set(contact);
				error = null;
			} else if (result.type === 'failure') {
				error = (result.data?.error as string) || 'Verification failed';
			} else if (result.type === 'error') {
				error = 'Something went wrong. Please try again.';
			}
		};
	}

	const services = [
		{
			title: 'Custom Home Wiring',
			body: 'Rough-in and trim for custom homes — planned with the builder, sequenced to the schedule, and finished so the inspection is not the holdup.'
		},
		{
			title: 'Interior Custom Lighting',
			body: 'Recessed, architectural, and feature lighting laid out for the house, not a catalog. Clean switch legs and fixtures that match the design.'
		},
		{
			title: 'Panels & Service',
			body: 'Service entrances, panel upgrades, and dedicated circuits sized for the load a custom home actually carries — including shops, docks, and outbuildings.'
		},
		{
			title: 'Modern Network Cabling',
			body: 'Structured data cabling planned with the electrical rough-in — home runs, panel location, and pathways in place before the drywall, so the network is not an afterthought.'
		}
	];
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />

	<!-- CF Turnstile script -->
	<link rel="preconnect" href="https://challenges.cloudflare.com" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" defer></script>

	<link rel="canonical" href={site.url} />

	<!-- Open Graph -->
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:image" content="{site.url}/mde_logo.png" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={site.title} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content="{site.url}/mde_logo.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<main class="bg-zinc-950 text-zinc-200">
	<!-- Hero -->
	<section id="hero" class="flex min-h-[88vh] flex-col items-center justify-center px-6 py-20 text-center">
		<div class="max-w-3xl">
			<Logo class="mx-auto mb-8 h-auto w-72 drop-shadow-xl drop-shadow-primary/30 sm:w-96" />
			<p class="mb-4 text-sm font-medium tracking-[0.2em] text-primary uppercase">
				Lenoir, North Carolina
			</p>
			<h1 class="mb-6 text-5xl font-semibold tracking-tighter text-balance sm:text-6xl">
				The electrical crew custom home builders can count on
			</h1>
			<p class="mx-auto mb-10 max-w-2xl text-xl text-balance text-zinc-400">
				Marcus Dyess Electric wires custom homes across the Catawba Valley. Licensed, insured, and
				backed by more than 30 years in the trade.
			</p>

			<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
				{#if contact?.tel}
					<a
						href={`tel:${contact.tel}`}
						class="inline-block rounded bg-primary px-10 py-4 text-lg font-medium text-zinc-950 transition hover:brightness-110"
					>
						Call Now
					</a>
				{:else}
					<a
						href="#contact"
						class="inline-block rounded bg-primary px-10 py-4 text-lg font-medium text-zinc-950 transition hover:brightness-110"
					>
						Contact Us
					</a>
				{/if}
				<a
					href="#builders"
					class="inline-block rounded border border-zinc-700 px-10 py-4 text-lg font-medium text-white transition hover:border-primary hover:text-primary"
				>
					For Builders
				</a>
			</div>
		</div>
	</section>

	<!-- Services -->
	<section id="services" class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<p class="mb-3 text-center text-sm font-medium tracking-[0.18em] text-primary uppercase">
				What we wire
			</p>
			<h2 class="mb-12 text-center text-4xl font-semibold tracking-tight">
				Built for the house, not the service call
			</h2>

			<div class="grid gap-6 md:grid-cols-2">
				{#each services as service (service.title)}
					<div class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
						<h3 class="mb-3 text-2xl font-semibold">{service.title}</h3>
						<p class="text-zinc-400">{service.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Builders -->
	<section id="builders" class="border-t border-zinc-800 bg-zinc-900 px-6 py-20">
		<div class="mx-auto max-w-5xl">
			<p class="mb-3 text-center text-sm font-medium tracking-[0.18em] text-primary uppercase">
				For custom home contractors
			</p>
			<h2 class="mb-6 text-center text-4xl font-semibold tracking-tight">
				A sub who shows up and stays on the schedule
			</h2>
			<p class="mx-auto mb-12 max-w-3xl text-center text-lg text-zinc-400">
				Custom homes stall when the electrical crew is late, understaffed, or learning the plans on
				site. Marcus Dyess Electric is set up to be the contractor you put on the next set of plans.
			</p>

			<div class="grid gap-8 md:grid-cols-3">
				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<Handshake class="mb-4 h-12 w-12 text-primary" />
					<h3 class="mb-2 text-xl font-semibold">Direct with Marcus</h3>
					<p class="text-zinc-400">
						You talk to the person running the job — scope, sequencing, and changes — not a call
						center.
					</p>
				</div>
				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<Groups class="mb-4 h-12 w-12 text-primary" />
					<h3 class="mb-2 text-xl font-semibold">A growing crew</h3>
					<p class="text-zinc-400">
						Enough people to cover rough-in and trim without borrowing labor from the next house on
						your list.
					</p>
				</div>
				<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
					<Verified class="mb-4 h-12 w-12 text-primary" />
					<h3 class="mb-2 text-xl font-semibold">Licensed &amp; insured</h3>
					<p class="text-zinc-400">
						North Carolina electrical contractor license SP.SFD.{licenseNumber}.
						<a href="/license" class="inline-block py-3 text-primary hover:underline">See the state record</a>.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- About -->
	<section id="about" class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-8 text-4xl font-semibold tracking-tight">Meet Marcus Dyess</h2>
			<p class="text-xl leading-relaxed text-zinc-300">
				Marcus has spent more than 30 years as an electrician — long enough to know what a custom
				home needs before the drywall goes up. He built Marcus Dyess Electric LLC in Lenoir so
				builders and homeowners in the Catawba Valley have a local crew that does the work itself.
			</p>
			<p class="mt-6 text-primary">30+ years in the trade. A growing team. Based in Lenoir.</p>
		</div>
	</section>

	<!-- Why MDE -->
	<section class="border-t border-zinc-800 bg-zinc-900 px-6 py-20">
		<div class="mx-auto max-w-5xl">
			<h2 class="mb-12 text-center text-4xl font-semibold tracking-tight">
				Why builders call Marcus Dyess Electric
			</h2>
			<div class="grid gap-8 text-center md:grid-cols-3">
				<div>
					<div class="mb-4 flex justify-center"><House class="h-16 w-16 text-primary" /></div>
					<h3 class="mb-2 text-xl font-semibold">Custom homes first</h3>
					<p class="text-zinc-400">
						New construction wiring and finish electrical for houses that are not production floor
						plans.
					</p>
				</div>
				<div>
					<div class="mb-4 flex justify-center"><Verified class="h-16 w-16 text-primary" /></div>
					<h3 class="mb-2 text-xl font-semibold">Clean, code-ready work</h3>
					<p class="text-zinc-400">
						Installations meant to pass inspection and still look right when the owner walks the
						house.
					</p>
				</div>
				<div>
					<div class="mb-4 flex justify-center"><Groups class="h-16 w-16 text-primary" /></div>
					<h3 class="mb-2 text-xl font-semibold">Local and reachable</h3>
					<p class="text-zinc-400">
						Serving {areas.slice(0, -1).join(', ')}, and {areas.at(-1)}.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section id="reviews" class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-4 text-center text-4xl font-semibold tracking-tight">What customers say</h2>
			<a
				href={googleReviewsUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="mb-12 flex justify-center transition hover:opacity-80"
				aria-label="Read our Google reviews"
			>
				{#await data.googleRating}
					<StarRating score={rating.score} count={rating.count} label={rating.label} />
				{:then googleRating}
					<StarRating
						score={googleRating.rating ?? rating.score}
						count={googleRating.ratingCount ?? rating.count}
						label={rating.label}
					/>
				{/await}
			</a>

			<div class="grid gap-8 md:grid-cols-3">
				{#each testimonials as testimonial (testimonial.quote)}
					<figure class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
						<blockquote class="mb-6 text-lg">“{testimonial.quote}”</blockquote>
						<figcaption class="text-sm text-zinc-500">— {testimonial.author}</figcaption>
					</figure>
				{/each}
			</div>

			<p class="mt-10 text-center">
				<a href={googleReviewsUrl} class="inline-block py-3 text-primary hover:underline" rel="noopener noreferrer">
					See Marcus Dyess Electric on Google
				</a>
			</p>
		</div>
	</section>

	<!-- Contact -->
	<section id="contact" class="border-t border-zinc-800 bg-zinc-900 px-6 py-20">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="mb-4 text-4xl font-semibold tracking-tight">Put us on the next set of plans</h2>
			<p class="mb-3 text-lg text-zinc-400">
				Builders and homeowners can reach Marcus directly.
			</p>
			<p
				class="mb-3 text-lg text-zinc-400 transition-opacity duration-300 {contact
					? 'opacity-0'
					: 'opacity-100'}"
			>
				Verify you’re human to see the phone number and email.
			</p>

			<div class="min-h-36">
				{#if contact}
					{#if contact.tel && contact.phone}
						<a
							href={`tel:${contact.tel}`}
							class="my-4 inline-block rounded bg-primary px-10 py-3 text-lg font-medium text-zinc-950 transition hover:brightness-110"
						>
							Call Now: {contact.phone}
						</a>
					{/if}
					<div class="mt-2 flex flex-col gap-3 text-base">
						<a href={`mailto:${contact.email}`} class="inline-block py-3 text-primary hover:underline">
							{contact.email}
						</a>
					</div>
				{:else if error}
					<div class="mt-2 mb-8 flex justify-center gap-2 text-xs text-red-400">
						<span>{error}</span>
						<button type="button" onclick={retry} class="underline hover:text-red-300">Try again</button>
					</div>
				{/if}
			</div>

			<div class="text-sm mt-6">
				<form id="turnstile-form" method="POST" action="?/verify" use:enhance={handleTurnstileEnhance}>
					<div
						use:turnstile={{
							sitekey: turnstileSiteKey,
							onError: handleTurnstileError,
							onTimeout: handleTurnstileTimeout,
							onExpired: handleTurnstileExpired,
							ref: (ctrl) => (turnstileCtrl = ctrl)
						}}
						id="cf-turnstile-widget"
					></div>
				</form>
			</div>

			<p class="mt-10 flex justify-center gap-6 text-sm">
				<a href={mapsUrl} class="inline-block py-3 text-zinc-400 hover:text-primary" rel="noopener noreferrer">Google Maps</a>
				<a href={facebookUrl} class="inline-block py-3 text-zinc-400 hover:text-primary" rel="noopener noreferrer">Facebook</a>
			</p>
		</div>
	</section>
</main>
