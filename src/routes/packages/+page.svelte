<script lang="ts">
	import { enhance } from '$app/forms';
	import { dev } from '$app/environment';
	import StarRating from '$lib/StarRating.svelte';
	import {
		areas,
		facebookUrl,
		googleReviewsUrl,
		licenseNumber,
		mapsUrl,
		rating,
		site,
		testimonials,
		verifiedContact,
		type Contact
	} from '$lib';
	import { turnstile, publicKey as tsPublicKey, publicDevKeys as tsKeys } from '$lib/turnstile';
	import { fade } from 'svelte/transition';
	import {
		comparisonSections,
		estimate,
		faqs,
		featurePhotos,
		fixtureFootnote,
		formatDollars,
		packages
	} from '$lib/packages';
	import { MediaQuery } from 'svelte/reactivity';
	import Verified from 'virtual:icons/material-symbols/verified-outline';
	import LocationOn from 'virtual:icons/material-symbols/location-on-outline';
	import TaskAlt from 'virtual:icons/material-symbols/task-alt';

	const turnstileSiteKey = dev
		? tsKeys.pass // pass all turnstile requests in Dev
		: tsPublicKey;

	const sections = comparisonSections();
	const pageTitle = 'Electrical Packages | Marcus Dyess Electric | Lenoir, NC';
	const pageDescription =
		'Compare three electrical packages for your home, priced per square foot. Code-compliant wiring, HALO lighting, and a smart-home option from Marcus Dyess Electric in Lenoir, NC.';

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

	let sqftInput = $state('2000');
	let openSection = $state(sections[0]?.name ?? '');
	const desktop = new MediaQuery('(min-width: 768px)');

	const remembered = $derived($verifiedContact);

	$effect(() => {
		if (!contact && remembered) contact = remembered;
	});

	const sqft = $derived(Number(sqftInput.replace(/[^\d.]/g, '')));
	const estimates = $derived(packages.map((pkg) => estimate(sqft, pkg.rate)));
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="preconnect" href="https://challenges.cloudflare.com" />
	<script
		src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		defer
	></script>
	<link rel="canonical" href="{site.url}/packages" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{site.url}/packages" />
	<meta property="og:image" content="{site.url}/mde_logo.png" />
</svelte:head>

<main class="bg-zinc-100 text-zinc-900">
	<section class="relative isolate overflow-hidden bg-zinc-950 text-white">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,120,0.18),transparent_42%),linear-gradient(160deg,#18181b_0%,#09090b_55%,#052e1c_100%)]"
			aria-hidden="true"
		></div>
		<div
			class="absolute inset-0 opacity-30"
			style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 48px 48px;"
			aria-hidden="true"
		></div>

		<div class="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
			<p class="mb-4 text-sm font-semibold tracking-[0.22em] text-primary uppercase">
				Marcus Dyess Electric
			</p>
			<h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
				Electrical packages built to fit your home.
			</h1>
			<p class="mt-5 max-w-2xl text-lg text-zinc-300 sm:text-xl">
				Compare three packages side by side. Every option is priced per square foot.
			</p>

			<div class="mt-8">
				<a
					href={contact?.tel ? `tel:${contact.tel}` : '#call'}
					class="inline-block rounded bg-primary px-6 py-3.5 text-center text-base font-semibold text-zinc-950 transition hover:brightness-110"
				>
					{contact?.phone ? `Call ${contact.phone}` : 'Call for a quote'}
				</a>
			</div>
		</div>
	</section>

	<section class="border-b border-zinc-200 bg-white" aria-label="Credentials">
		<ul class="mx-auto grid max-w-6xl gap-4 px-5 py-5 sm:grid-cols-3 sm:px-6">
			<li class="flex items-center gap-3 text-sm">
				<Verified class="h-6 w-6 shrink-0 text-primary" />
				<span>NC licensed <span class="font-medium">#SP.SFD.{licenseNumber}</span></span>
			</li>
			<li class="flex items-center gap-3 text-sm">
				<LocationOn class="h-6 w-6 shrink-0 text-primary" />
				<span>Based in Lenoir, NC</span>
			</li>
			<li class="flex items-center gap-3 text-sm">
				<TaskAlt class="h-6 w-6 shrink-0 text-primary" />
				<span class="font-medium">Pass inspection guaranteed</span>
			</li>
		</ul>
	</section>

	<section id="packages" class="px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-6xl">
			<p class="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">Packages</p>
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
				Three ways to wire the house
			</h2>
			<p class="mt-3 max-w-2xl text-zinc-600">
				Choose your level of comfort and future-readiness.
			</p>

			<div class="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
				<label for="sqft" class="block text-sm font-medium">Home size, in square feet</label>
				<div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
					<input
						id="sqft"
						name="sqft"
						inputmode="decimal"
						bind:value={sqftInput}
						class="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-lg sm:max-w-xs"
					/>
					<p class="text-sm text-zinc-500">Estimate only. Final price comes from a walkthrough.</p>
				</div>
			</div>

			<div class="mt-6 grid gap-4 lg:grid-cols-3">
				{#each packages as pkg, i (pkg.id)}
					<article
						class="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm {pkg.id ===
						'premium'
							? 'premium-card'
							: ''}"
					>
						<p class="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
							Option {pkg.option}
						</p>
						<h3 class="mt-2 text-2xl font-semibold">{pkg.name}</h3>
						<p class="mt-1 text-3xl font-semibold tracking-tight">
							${pkg.rate}<span class="text-base font-medium text-zinc-500">/sq ft</span>
						</p>
						<p class="mt-4 flex-1 text-zinc-600">{pkg.summary}</p>
						{#if pkg.addon}
							<p class="mt-4 text-sm text-zinc-500">Add-on: {pkg.addon}</p>
						{/if}
						<p class="mt-6 border-t border-zinc-100 pt-4">
							<span class="block text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
								Estimated total
							</span>
							<span class="text-2xl font-semibold">
								{estimates[i] == null ? '—' : formatDollars(estimates[i])}
							</span>
						</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<section id="compare" class="border-t border-zinc-200 bg-white px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-6xl">
			<p class="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">Compare</p>
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">What’s in each package</h2>
			<p class="mt-3 text-zinc-600">
				A check means included. A dash means it is not in that package.
			</p>

			{#if desktop.current}
				<div class="mt-8 overflow-hidden rounded-2xl border border-zinc-200">
					<table class="w-full border-collapse text-left text-sm">
						<thead class="bg-zinc-950 text-white">
							<tr>
								<th scope="col" class="px-4 py-3 font-medium">Feature</th>
								{#each packages as pkg (pkg.id)}
									<th scope="col" class="px-4 py-3 text-center font-medium">
										Option {pkg.option}
										<span class="block text-xs font-normal text-zinc-300">{pkg.name}</span>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each sections as section (section.name)}
								<tr class="bg-zinc-100">
									<th
										scope="colgroup"
										colspan="4"
										class="px-4 py-2 text-left text-xs font-semibold tracking-[0.16em] text-primary uppercase"
									>
										{section.name}
									</th>
								</tr>
								{#each section.rows as row (row.feature)}
									<tr class="border-t border-zinc-200">
										<th scope="row" class="px-4 py-3 font-medium">{row.feature}</th>
										{#each row.values as value, i (packages[i].id)}
											<td
												class="px-4 py-3 text-center align-top {packages[i].id === 'premium'
													? 'premium-col'
													: ''}"
											>
												{#if value === true}
													<span class="text-primary" aria-label="Included">✓</span>
												{:else if value === false}
													<span class="text-zinc-400" aria-label="Not included">—</span>
												{:else}
													{value}
												{/if}
											</td>
										{/each}
									</tr>
								{/each}
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="mt-8 space-y-3">
					{#each sections as section (section.name)}
						<div class="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
							<h3>
								<button
									type="button"
									class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold tracking-[0.14em] text-primary uppercase"
									aria-expanded={openSection === section.name}
									onclick={() => (openSection = openSection === section.name ? '' : section.name)}
								>
									{section.name}
									<span aria-hidden="true">{openSection === section.name ? '–' : '+'}</span>
								</button>
							</h3>
							{#if openSection === section.name}
								<div class="border-t border-zinc-200 bg-white">
									<div class="grid grid-cols-3 bg-zinc-950 text-center text-xs text-white">
										{#each packages as pkg (pkg.id)}
											<span class="px-2 py-2">Opt {pkg.option}</span>
										{/each}
									</div>
									<div class="premium-stack">
									{#each section.rows as row (row.feature)}
										<div class="border-t border-zinc-100 px-4 py-3">
											<p class="text-sm font-medium">{row.feature}</p>
											<div class="-mx-4 mt-2 grid grid-cols-3 text-center text-sm">
												{#each row.values as value, i (packages[i].id)}
													<span class="px-1 py-1 text-center">
														{#if value === true}
															<span
																class="text-primary"
																aria-label="Option {packages[i].option} included">✓</span
															>
														{:else if value === false}
															<span
																class="text-zinc-400"
																aria-label="Option {packages[i].option} not included">—</span
															>
														{:else}
															{value}
														{/if}
													</span>
												{/each}
											</div>
										</div>
									{/each}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

			<p class="mt-4 text-sm text-zinc-500">{fixtureFootnote}</p>
		</div>
	</section>

	<section id="proof" class="px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-6xl">
			<p class="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">The work</p>
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
				What these features look like
			</h2>
			<p class="mt-3 text-zinc-600">Project photos are on the way. These stand in until then.</p>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each featurePhotos as photo (photo.title)}
					<figure class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
						<div
							class="flex aspect-[4/3] items-end bg-linear-to-br {photo.tone} p-4 text-sm text-zinc-300"
							role="img"
							aria-label="Placeholder photo: {photo.title}"
						>
							Photo coming
						</div>
						<figcaption class="p-4">
							<p class="font-semibold">{photo.title}</p>
							<p class="mt-1 text-sm text-zinc-600">{photo.caption}</p>
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<section id="reviews" class="border-t border-zinc-200 bg-white px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-6xl">
			<p class="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">Proof</p>
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
				Homeowners who already called
			</h2>

			<a
				href={googleReviewsUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-6 inline-flex py-2"
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

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				{#each testimonials as testimonial (testimonial.author)}
					<figure class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
						<blockquote class="text-zinc-700">“{testimonial.quote}”</blockquote>
						<figcaption class="mt-4 text-sm font-medium text-zinc-500">
							— {testimonial.author}
						</figcaption>
					</figure>
				{/each}
			</div>

			<div class="mt-8 grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:grid-cols-3">
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-primary uppercase">License</p>
					<p class="mt-1 font-medium">NC #SP.SFD.{licenseNumber}</p>
					<a href="/license" class="mt-1 inline-block py-2 text-sm text-primary hover:underline"
						>See the state record</a
					>
				</div>
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Inspection</p>
					<p class="mt-1 font-medium">Pass inspection guaranteed</p>
					<p class="mt-1 text-sm text-zinc-600">Every package is built to pass.</p>
				</div>
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
						Network partner
					</p>
					<p class="mt-1 font-medium">First Light Networks</p>
					<a
						href="https://firstlightnetworks.com"
						class="mt-1 inline-block py-2 text-sm text-primary hover:underline"
						rel="noopener noreferrer"
					>
						firstlightnetworks.com
					</a>
				</div>
			</div>
			<p class="mt-4 text-sm text-zinc-500">
				Serving {areas.slice(0, -1).join(', ')}, and {areas.at(-1)}.
			</p>
		</div>
	</section>

	<section class="px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
			<p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Fixtures</p>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight">We wire it. You choose the style.</h2>
			<p class="mt-4 text-lg text-zinc-600">
				Decorative fixtures are customer-provided. Want help picking? Ask about our preferred
				designers.
			</p>
		</div>
	</section>

	<section id="faq" class="border-t border-zinc-200 bg-white px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-3xl">
			<p class="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">Questions</p>
			<h2 class="text-3xl font-semibold tracking-tight">Before you call</h2>
			<div class="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
				{#each faqs as item (item.question)}
					<details class="group py-4">
						<summary
							class="cursor-pointer list-none py-1 font-medium marker:content-none [&::-webkit-details-marker]:hidden"
						>
							<span class="flex items-center justify-between gap-4">
								{item.question}
								<span class="text-primary group-open:hidden" aria-hidden="true">+</span>
								<span class="hidden text-primary group-open:inline" aria-hidden="true">–</span>
							</span>
						</summary>
						<p class="pt-3 text-zinc-600">{item.answer}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section id="contact" class="scroll-mt-20 px-5 py-16 sm:px-6">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Next step</p>
			<h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
				Call Marcus for a quote
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-zinc-600">
				Tell him the house size and which package you are leaning toward. He will price it from
				there.
			</p>
			<p class="mt-3 text-sm text-zinc-500 {contact ? 'sr-only' : ''}">
				Verify you’re human to see the phone number.
			</p>

			<div class="mt-6 min-h-16">
				{#if contact?.tel && contact.phone}
					<div in:fade={{ duration: 300 }}>
						<a
							href="tel:{contact.tel}"
							class="inline-block rounded bg-primary px-8 py-4 text-lg font-semibold text-zinc-950 transition hover:brightness-110"
						>
							Call {contact.phone}
						</a>
						{#if contact.email}
							<a href="mailto:{contact.email}" class="mt-4 block py-2 text-primary hover:underline">
								{contact.email}
							</a>
						{/if}
					</div>
				{:else if error}
					<p class="text-sm text-red-700">
						{error}
						<button type="button" onclick={retry} class="ml-2 underline">Try again</button>
					</p>
				{/if}
			</div>

			{#if !contact}
				<form
					id="turnstile-form"
					method="POST"
					action="?/verify"
					class="mt-4"
					use:enhance={handleTurnstileEnhance}
				>
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
			{/if}
		</div>
	</section>

	<footer class="border-t border-zinc-800 bg-zinc-950 px-5 py-10 text-sm text-zinc-400 sm:px-6">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>Marcus Dyess Electric LLC · Lenoir, NC · License SP.SFD.{licenseNumber}</p>
			<p class="flex gap-4">
				<a href={mapsUrl} class="py-2 hover:text-primary" rel="noopener noreferrer">Maps</a>
				<a href={facebookUrl} class="py-2 hover:text-primary" rel="noopener noreferrer">Facebook</a>
				<a href="/" class="py-2 hover:text-primary">Home</a>
			</p>
		</div>
	</footer>
</main>

<style>
	.premium-card {
		position: relative;
		overflow: hidden;
		border-color: color-mix(in srgb, var(--color-primary) 45%, #d4d4d8);
	}

	.premium-card::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			circle at 100% 0%,
			rgb(0 200 120 / 0.28),
			rgb(0 200 120 / 0.08) 42%,
			rgb(0 200 120 / 0.04) 100%
		);
	}

	.premium-col {
		box-shadow: inset 0 0 0 100vmax rgb(0 200 120 / 0.08);
	}

	.premium-stack {
		background-image: linear-gradient(90deg, transparent 66.66%, rgb(0 200 120 / 0.08) 66.66%);
		background-attachment: local;
	}
</style>
