<script lang="ts">
	import Star from 'virtual:icons/material-symbols/star';
	import StarOutline from 'virtual:icons/material-symbols/star-outline';

	let { score = 5, count = 0, label = '' } = $props();

	const fullStars = $derived(Math.min(5, Math.max(0, Math.floor(score))));
	const fraction = $derived(fullStars < 5 ? Math.min(1, Math.max(0, score - fullStars)) : 0);
	const emptyStars = $derived(5 - fullStars - (fraction > 0 ? 1 : 0));
</script>

<div class="flex items-center gap-2">
	<div class="flex text-lg tracking-[-1px]">
		{#each Array(fullStars) as _, i (i)}
			<span class="text-yellow-400"><Star /></span>
		{/each}
		{#if fraction > 0}
			<span class="relative text-zinc-600">
				<StarOutline />
				<span
					class="absolute top-0 left-0 overflow-hidden text-yellow-400"
					style="width: {fraction * 100}%"
				>
					<span class="block w-[1em]"><Star /></span>
				</span>
			</span>
		{/if}
		{#each Array(emptyStars) as _, i (i)}
			<span class="text-zinc-600"><StarOutline /></span>
		{/each}
	</div>
	{#if count && label}
		<span class="text-zinc-400">{score.toFixed(1)} from {count} {label}</span>
	{/if}
</div>
