<!-- C:\quizntalk\src\lib\components\workplace\SharedSimulationPanel.svelte -->
<script>
	import PixiSimulationCanvas from './PixiSimulationCanvas.svelte';
	import OldCameraBootOverlay from './simulation/effects/OldCameraBootOverlay.svelte';

	import { animalRescueTheme } from './theme/animalRescue/animalRescueTheme';
	import { hackerTraceTheme } from './theme/hackerTrace/hackerTraceTheme';
	import { spaceBaseTheme } from './theme/spaceBase/spaceBaseTheme';

	export let themeId = 'spaceBase';

	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {}
	};

	const pixiThemeById = {
		spaceBase: spaceBaseTheme,
		animalRescue: animalRescueTheme,
		hackerTrace: hackerTraceTheme
	};

	$: pixiTheme = pixiThemeById[themeId] ?? spaceBaseTheme;
	$: isSpaceBase = themeId === 'spaceBase';
	$: screenOn = simulationState?.layers?.screenOn === true;
</script>

<div
	class="relative h-full max-h-full min-h-0 w-full overflow-hidden border border-slate-200 bg-slate-950 shadow-sm"
>
	{#if isSpaceBase}
		<OldCameraBootOverlay {screenOn}>
			<div class="absolute inset-0 h-full w-full overflow-hidden">
				<PixiSimulationCanvas theme={pixiTheme} {simulationState} />
			</div>
		</OldCameraBootOverlay>
	{:else}
		<div class="absolute inset-0 h-full w-full overflow-hidden">
			<PixiSimulationCanvas theme={pixiTheme} {simulationState} />
		</div>
	{/if}
</div>
