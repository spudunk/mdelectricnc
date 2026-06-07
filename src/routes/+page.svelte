<script lang="ts">
	import { enhance } from '$app/forms';
	import { dev } from '$app/environment';
	import Logo from '$lib/Logo.svelte';
	import ogImage from '$lib/assets/og.png';
	import House from 'virtual:icons/material-symbols/house-outline';
	import Calendar from 'virtual:icons/material-symbols/calendar-clock-outline';
	import Trophy from 'virtual:icons/material-symbols/trophy-outline';
	import { structuredData, site, verifiedContact, testimonials, type Contact } from '$lib';
	import { turnstile } from '$lib/turnstile';

	const turnstileSiteKey = dev ? '1x00000000000000000000AA' : '0x4AAAAAADf42DRcZwo6HMU6';
	// const turnstileSiteKey = '1x00000000000000000000AA' // always pass
	// const turnstileSiteKey = '2x00000000000000000000AB' // always fail
	// const turnstileSiteKey = '3x00000000000000000000FF' // always challenge
	

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
		return async ({ result }: any) => {
			if (result.type === 'success' && result.data?.success) {
				const d = result.data as Contact;
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

	function onTurnstileSuccess() {
     //** Set Local State After Turnstile */
	}

</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />

	<!-- CF Turnstile script -->
	<link rel="preconnect" href="https://challenges.cloudflare.com" />
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		defer
	></script>

	<link rel="canonical" href="https://atlasplumbed.com" />

	<!-- Open Graph -->
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={site.title} />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<main class="bg-zinc-950 text-zinc-200">
	<!-- Hero -->
	<section
		id="hero"
		class="flex min-h-[90vh] flex-col items-center justify-center pb-12 text-center"
	>
		<div class="max-w-3xl">
			<Logo class="mx-auto h-auto w-fit sm:w-md md:w-lg" />
			<h1 class="mx-2 mb-4 text-6xl font-semibold tracking-tighter">
				Reliable Plumbing<br />Every Time
			</h1>
			<p class="mx-2 mb-10 text-2xl text-zinc-400">
				Coming Soon to Albany, OR — Residential repair and new construction — backed by over 20
				years of experience.
			</p>

			{#if contact && contact.tel}
				<a
					href={`tel:${contact.tel}`}
					class="inline-block rounded bg-primary px-10 py-4 text-lg font-medium text-white transition hover:brightness-80"
				>
					Call Now
				</a>
			{:else}
				<a
					href="#contact"
					class="inline-block rounded bg-primary px-10 py-4 text-lg font-medium text-white transition hover:brightness-80"
				>
					Contact Us
				</a>
			{/if}
		</div>
	</section>

	<!-- Services -->
	<section id="services" class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-4xl font-semibold tracking-tight">Services</h2>

			<div class="grid gap-8 md:grid-cols-2">
				<div class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
					<h3 class="mb-4 text-2xl font-semibold">Residential Repair</h3>
					<p class="text-zinc-400">
						Leaks, clogs, broken fixtures, water heaters, and every other plumbing problem a home
						can have. Miles brings exceptional skill to every repair, big or small.
					</p>
				</div>

				<div class="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
					<h3 class="mb-4 text-2xl font-semibold">New Construction</h3>
					<p class="text-zinc-400">
						Full plumbing rough-in and finish work for new homes and renovations. Quality
						installation that lasts, done right the first time.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- About -->
	<section hidden id="about" class="border-t border-zinc-800 bg-zinc-900 px-6 py-20">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-8 text-4xl font-semibold tracking-tight">Meet Miles Helm</h2>
			<p class="text-xl leading-relaxed text-zinc-300">
				Miles Helm has spent more than 20 years solving every kind of residential plumbing problem —
				big or small. He built Atlas Plumbing on the belief that quality work and honest service
				should be the standard, not the exception.
			</p>
			<p class="mt-6 text-primary">20+ years of dedicated craftsmanship in Albany, Oregon.</p>
		</div>
	</section>

	<!-- Why Atlas -->
	<section class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto max-w-5xl">
			<h2 class="mb-12 text-center text-4xl font-semibold tracking-tight">
				Why Homeowners Choose Atlas Plumbing
			</h2>
			<div class="grid gap-8 text-center md:grid-cols-3">
				<div>
					<div class="mb-4 flex justify-center text-3xl"><Calendar class="h-18 w-18" /></div>
					<h3 class="mb-2 text-xl font-semibold">20+ Years Experience</h3>
					<p class="text-zinc-400">Deep expertise across every residential plumbing challenge.</p>
				</div>
				<div>
					<div class="mb-4 flex justify-center text-3xl"><Trophy class="h-18 w-18" /></div>
					<h3 class="mb-2 text-xl font-semibold">Quality Workmanship</h3>
					<p class="text-zinc-400">Every job completed to the highest standard, guaranteed.</p>
				</div>
				<div>
					<div class="mb-4 flex justify-center text-3xl"><House class="h-18 w-18" /></div>
					<h3 class="mb-2 text-xl font-semibold">Repair &amp; New Construction</h3>
					<p class="text-zinc-400">
						Specialists in both service calls and full plumbing installations.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section hidden id="testimonials" class="border-t border-zinc-800 bg-zinc-900 px-6 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-4xl font-semibold tracking-tight">
				What Albany Homeowners Say
			</h2>

			<div class="grid gap-8 md:grid-cols-3">
				{#each testimonials as testimonial}
					<div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
						<p class="mb-6 text-lg">"{testimonial.quote}"</p>
						<p class="text-sm text-zinc-500">— {testimonial.author}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact -->
	<section id="contact" class="border-t border-zinc-800 px-6 py-20">
		<div class="mx-auto text-center">
			<h2 class="mb-4 text-4xl font-semibold tracking-tight">Want to Connect?</h2>

			<div class="min-h-32">
				{#if !contact}
					<p class="mb-8 py-2 text-xl text-zinc-400">
						Verify you're human to see our contact details...
					</p>
				{/if}

				{#if contact}
					{#if contact.tel}
						<a
							href={`tel:${contact.tel}`}
							class="mb-10 inline-block rounded bg-primary px-10 py-4 text-lg font-medium text-white transition hover:brightness-80"
						>
							Call Now: {contact.phone}
						</a>
					{/if}
					<div class="flex flex-col gap-3 text-base">
						<a
							href={`mailto:${contact.email}`}
							class="inline-block py-2 text-blue-300 hover:underline">{contact.email}</a
						>
					</div>
				{:else if error}
					<div class="mt-2 mb-8 flex justify-center gap-2 text-xs text-red-400">
						<span>{error}</span>
						<button type="button" onclick={retry} class="underline hover:text-red-300"
							>Try again</button
						>
					</div>
				{/if}
			</div>

			<div class="text-sm">
				<form
					id="turnstile-form"
					method="POST"
					action="?/verify"
					use:enhance={handleTurnstileEnhance}
				>
					<div
						use:turnstile={{
							sitekey: turnstileSiteKey,
							onSuccess: onTurnstileSuccess,
							onError: handleTurnstileError,
							onTimeout: handleTurnstileTimeout,
							onExpired: handleTurnstileExpired,
							ref: (ctrl) => (turnstileCtrl = ctrl)
						}}
						id="cf-turnstile-widget"
					></div>
				</form>
			</div>
		</div>
	</section>
</main>
