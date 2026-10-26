<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/Logo.svelte';
</script>

<svelte:head>
	<title>Error • Marcus Dyess Electric</title>
</svelte:head>

<div
	class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-950 px-6 text-center"
>
	<Logo class="mb-8 h-16 w-auto" />

	<h1 class="mb-2 text-8xl font-bold tracking-tighter text-white">
		{page.status}
	</h1>

	<p class="mb-8 max-w-md text-xl text-balance text-zinc-400">
		{page.error?.message ?? 'Something went wrong on our end.'}
	</p>

	<div class="flex flex-col gap-3 sm:flex-row">
		<a
			href="/"
			class="rounded bg-primary px-8 py-3 text-sm font-medium text-zinc-950 transition hover:brightness-110"
		>
			Back to homepage
		</a>
		<a
			href="/#contact"
			class="rounded border border-zinc-700 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
		>
			Contact Marcus
		</a>
	</div>
</div>
