<script lang="ts">
	import { enhance } from '$app/forms';
	import { structuredData, site } from '$lib';
	import { env } from '$env/dynamic/public';
	import { dev } from '$app/environment';

	const turnstileSiteKey = dev
		? '1x00000000000000000000AA'
		: env.PUBLIC_TURNSTILE_SITEKEY;

	let contact = $state<{ phone?: string; email: string; tel?: string } | null>(null);
	let error = $state<string | null>(null);
	let submitting = $state(false);
	let widgetId: string | null = $state(null);

	function retry() {
		error = null;
		submitting = false;
		widgetId = null;
	}

	// Render Turnstile explicitly. Retry until the async script has loaded.
	$effect(() => {
		if (contact || submitting) return;

		let cancelled = false;
		const tryRender = () => {
			if (cancelled) return;
			const container = document.getElementById('cf-turnstile-widget');
			const form = document.getElementById('turnstile-form') as HTMLFormElement | null;
			if (
				typeof window !== 'undefined' &&
				(window as any).turnstile &&
				container &&
				form &&
				!widgetId
			) {
				widgetId = (window as any).turnstile.render(container, {
					sitekey: turnstileSiteKey,
					theme: 'dark',
					size: 'compact',
					callback: () => {
						submitting = true;
						form.requestSubmit();
					}
				});
			} else if (!widgetId) {
				setTimeout(tryRender, 50);
			}
		};
		tryRender();
		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
	<!-- CF Turnstile optimization -->
	<link rel="preconnect" href="https://challenges.cloudflare.com" />

	<!-- Open Graph -->
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={site.name} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={site.title} />
	<meta name="twitter:description" content={site.description} />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}

	<!-- CF Turnstile script -->
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-200">
	<div class="max-w-md text-center">
		<h1 class="mb-4 text-5xl font-semibold tracking-tight">Atlas Plumbing</h1>
		<p class="mb-8 text-xl text-zinc-400">Albany, Oregon</p>

		<div class="mb-8 space-y-2 text-sm text-zinc-400">
			<p>Residential &amp; Commercial Service</p>
		</div>

		<div class="min-h-10 text-sm">
			{#if contact}
				<div class="flex flex-col gap-3 text-base">
					{#if contact.phone && contact.tel}
						<a href={`tel:${contact.tel}`} class="inline-block py-2 hover:underline">{contact.phone}</a>
					{/if}
					<a href={`mailto:${contact.email}`} class="inline-block py-2 hover:underline">{contact.email}</a>
				</div>
			{:else}
				{#if error}
					<div class="mt-2 mb-8 flex justify-center gap-2 text-xs text-red-400">
						<span>{error}</span>
						<button type="button" onclick={retry} class="underline hover:text-red-300">
							Try again
						</button>
					</div>
				{/if}

				<form
					id="turnstile-form"
					method="POST"
					action="?/verify"
					use:enhance={() => {
						return async ({ result }) => {
							submitting = false;
							if (result.type === 'success' && (result.data as any)?.success) {
								const d = result.data as any;
								contact = { phone: d.phone, email: d.email, tel: d.tel };
								error = null;
							} else if (result.type === 'failure') {
								error = (result.data as any)?.error || 'Verification failed';
							} else if (result.type === 'error') {
								error = 'Something went wrong. Please try again.';
							}
						};
					}}
				>
					{#if !submitting}
						<!-- Turnstile widget -->
						<div class="mt-3">
							<div id="cf-turnstile-widget" class="cf-turnstile" data-sitekey={turnstileSiteKey}></div>
						</div>
					{:else}
						<div class="mt-3 text-xs text-zinc-500">Verifying…</div>
					{/if}
				</form>
			{/if}
		</div>
	</div>
</main>
