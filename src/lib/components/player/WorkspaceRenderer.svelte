<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	import ConceptCard from './cards/ConceptCard.svelte';
	import MissionCard from './cards/MissionCard.svelte';
	import PreviewCard from './cards/PreviewCard.svelte';
	import TeamMemoCard from './cards/TeamMemoCard.svelte';

	import PixelHeartModule from './modules/PixelHeartModule.svelte';
	import RgbLabModule from './modules/RgbLabModule.svelte';

	const playerStore = getPlayerContext();

	$: $playerStore;
	$: stage = $playerStore.currentStage;
</script>

<div class="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
	<div class="space-y-4">
		<MissionCard />

		{#if stage?.moduleType === 'rgb-lab'}
			<RgbLabModule />
		{:else if stage?.moduleType === 'pixel-heart'}
			<PixelHeartModule />
		{/if}
	</div>

	<div class="space-y-4">
		<ConceptCard />
		<TeamMemoCard />
		<PreviewCard />
	</div>
</div>
