<script lang="ts">
	import { licenseLookupUrl } from '$lib';

	let { data } = $props();

	const rows = [
		['License', data.license.number],
		['Type', data.license.type],
		['Status', data.license.status],
		['Expires', data.license.expires]
	];
</script>

<svelte:head>
	<title>NC electrical license • Marcus Dyess Electric</title>
	<meta
		name="description"
		content="North Carolina electrical contractor license {data.license.number} for Marcus Dyess Electric LLC, verified with the state board."
	/>
</svelte:head>

<main class="bg-zinc-950 px-6 py-20 text-zinc-200">
	<div class="mx-auto max-w-2xl">
		<p class="mb-3 text-sm font-medium tracking-[0.18em] text-primary uppercase">
			NC Board of Examiners of Electrical Contractors
		</p>
		<h1 class="mb-4 text-4xl font-semibold tracking-tight">{data.license.name}</h1>
		<p class="mb-10 text-zinc-400">
			Pulled from the state board’s public license lookup. <br />
			<a href={licenseLookupUrl} target="_blank" class="inline-block py-3 text-primary hover:underline" rel="noopener noreferrer">
				Search the official NC Board Examiners of Electrical Contractors lookup.
			</a>
		</p>

		<dl class="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900">
			{#each rows as [label, value] (label)}
				<div class="grid gap-1 px-6 py-4 sm:grid-cols-3">
					<dt class="text-sm text-zinc-500">{label}</dt>
					<dd class="sm:col-span-2">{value}</dd>
				</div>
			{/each}
		</dl>

		{#if data.license.qualifier.length}
			<h2 class="mt-10 mb-4 text-2xl font-semibold">Qualifier</h2>
			<ul class="space-y-3">
				{#each data.license.qualifier as person (person.number)}
					<li class="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4">
						<p class="font-medium">{person.name}</p>
						<p class="text-sm text-zinc-400">{person.number} · {person.status}</p>
					</li>
				{/each}
			</ul>
		{/if}

	</div>
</main>
