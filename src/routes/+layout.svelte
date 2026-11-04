<script lang="ts">
	import './layout.css';
	import Logo from '$lib/Logo.svelte';
	import { verifiedContact } from '$lib';

	let { children } = $props();

	let menuOpen = $state(false);

	const vc = $derived($verifiedContact);
	const contactHref = $derived(vc?.tel ? `tel:${vc.tel}` : '#contact');
	const links = [
		{ href: '/#services', label: 'Services' },
		{ href: '/packages', label: 'Pricing' },
		{ href: '/#builders', label: 'Builders' },
		{ href: '/#about', label: 'About' },
		{ href: '/#contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="MDE" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<header class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950">
	<nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-3" onclick={() => (menuOpen = false)}>
			<Logo class="h-12 w-auto" />
		</a>

		<div class="hidden items-center gap-8 text-sm text-accent md:flex">
			{#each links as link (link.href)}
				<a href={link.href} class="py-3 transition-colors hover:text-primary">{link.label}</a>
			{/each}
		</div>

		<div class="flex items-center gap-2">
			<a
				href={contactHref}
				class="rounded bg-primary px-4 py-2 text-sm font-medium text-zinc-950 transition hover:brightness-110 sm:px-5"
			>
				{vc?.phone ? `Call ${vc.phone}` : 'Contact Us'}
			</a>
			<button
				type="button"
				class="inline-flex h-11 w-11 items-center justify-center rounded text-accent md:hidden"
				aria-expanded={menuOpen}
				aria-controls="mobile-nav"
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
				<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2">
					{#if menuOpen}
						<path d="M6 6l12 12M18 6L6 18" />
					{:else}
						<path d="M4 7h16M4 12h16M4 17h16" />
					{/if}
				</svg>
			</button>
		</div>
	</nav>

	{#if menuOpen}
		<nav id="mobile-nav" class="border-t border-zinc-800 px-6 py-2 md:hidden">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="block py-3 text-accent transition-colors hover:text-primary"
					onclick={() => (menuOpen = false)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

{@render children()}
