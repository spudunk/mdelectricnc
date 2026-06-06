<script lang="ts">
	import { enhance } from '$app/forms';
  import { structuredData } from '$lib';
	import { PUBLIC_TURNSTILE_SITEKEY as turnstileSiteKey } from '$env/static/public';

	// Dev key that always passes (for local testing)
	// const turnstileSiteKey = '1x00000000000000000000AA';


	let contact = $state<{ phone: string; email: string; tel: string } | null>(null);
	let error = $state<string | null>(null);
	let widgetId: string | null = $state(null);

	function retry() {
		error = null;
		if (typeof window !== 'undefined' && (window as any).turnstile && widgetId) {
			(window as any).turnstile.reset(widgetId);
		}
	}

	// Render Turnstile explicitly once the container is in the DOM.
	// This guarantees the callback is attached and avoids timing issues
	// with the global data-callback approach.
	$effect(() => {
		if (contact) return; // nothing to do if already verified

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
					form.requestSubmit();
				}
			});
		}
	});
</script>

<svelte:head>
	<title>Atlas Plumbing | Residential & Commercial Plumbing in Albany, OR</title>
	<meta
		name="description"
		content="Atlas Plumbing provides professional residential and commercial plumbing services and new construction plumbing in Albany, Oregon."
	/>
  <!-- CF Turnstile optimization -->
  <link rel="preconnect" href="https://challenges.cloudflare.com" />

	<!-- Open Graph -->
	<meta property="og:title" content="Atlas Plumbing | Plumbing Services Albany, OR" />
	<meta
		property="og:description"
		content="Expert residential, commercial, and new construction plumbing services in Albany, Oregon."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://atlasplumbing.com" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Atlas Plumbing" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Atlas Plumbing | Albany, OR" />
	<meta
		name="twitter:description"
		content="Residential & commercial plumbing and new construction services in Albany, Oregon."
	/>

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}

  <!-- CF Turnstile script -->
  <script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  async
  defer
></script>

</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-200">
	<div class="max-w-md text-center">
		<h1 class="mb-4 text-5xl font-semibold tracking-tight">Atlas Plumbing</h1>
		<p class="mb-8 text-xl text-zinc-400">Albany, Oregon</p>

		<div class="mb-8 space-y-2 text-sm text-zinc-400">
			<p>Residential &amp; Commercial Service</p>
		</div>

		<div class="min-h-10 text-sm">
			{#if contact}
				<a href={`tel:${contact.tel}`} class="mb-1 hover:underline">{contact.phone}</a>
				<a href={`mailto:${contact.email}`} class="hover:underline">{contact.email}</a>
			{:else}
				{#if error}
					<div class="mt-2 mb-8 flex justify-center gap-2 text-xs text-red-400">
						<span>{error}</span>
						<button
							type="button"
							onclick={retry}
							class="underline hover:text-red-300"
						>
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
							if (result.type === 'success' && (result.data as any)?.success) {
								const d = result.data as any;
								contact = { phone: d.phone, email: d.email, tel: d.tel };
								error = null;
							} else if (result.type === 'failure') {
								error = (result.data as any)?.error || 'Verification failed';
							}
						};
					}}
				>
					<!-- Turnstile widget -->
					<div class="mt-3">
						<div id="cf-turnstile-widget"></div>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>
