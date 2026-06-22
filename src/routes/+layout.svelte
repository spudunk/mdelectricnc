<script lang="ts">
	import './layout.css';
	import Logo from '$lib/Logo.svelte';
	import { verifiedContact } from '$lib';

	let { children } = $props();

	const vc = $derived($verifiedContact);
</script>

<svelte:head>
	<link rel="icon" href="https://atlasplumbed.com/favicon.svg" />
</svelte:head>

<header class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950">
	<nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-4">
			<Logo class="h-16 w-auto drop-shadow-sm drop-shadow-blue-300/70" />
			<span class="font-semibold text-xl tracking-tight text-white">Atlas Plumbing</span>
		</a>

		<div class="hidden items-center gap-8 text-sm md:flex">
			<a href="#services" class="hover:text-primary transition-colors">Services</a>
			<a href="#about" class="hover:text-primary transition-colors">About</a>
			<a href="#testimonials" class="hover:text-primary transition-colors">Testimonials</a>
			<a href="#contact" class="hover:text-primary transition-colors">Contact</a>
		</div>

		<a
			href={vc?.tel ? `tel:${vc.tel}` : '#contact'}
			class="rounded bg-primary px-5 py-2 text-sm font-medium text-white transition hover:brightness-80"
		>
			{vc?.phone ? `Call ${vc.phone}` : 'Contact Us'}
		</a>
	</nav>
</header>

{@render children()}
