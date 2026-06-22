<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/Logo.svelte';
</script>

<svelte:head>
	<title>Error • Atlas Plumbing</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-950 px-6 text-center">


	<h1 class="mb-2 text-8xl font-bold tracking-tighter text-white">
		{page.status}
	</h1>

	<p class="mb-8 max-w-md text-balance text-xl text-zinc-400">
		{page.error?.message ?? 'Something went wrong on our end.'}
	</p>

	<div class="flex flex-col gap-3 sm:flex-row">
		<a
			href="/"
			class="rounded bg-primary px-8 py-3 text-sm font-medium text-white transition hover:brightness-80"
		>
			Back to homepage
		</a>
		<a
			href="/#contact"
			class="rounded border border-zinc-700 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
		>
			Contact support
		</a>
	</div>
</div>
