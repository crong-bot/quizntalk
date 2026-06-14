<!-- C:\quizntalk\src\lib\components\workplace\SharedSimulationPanel.svelte -->
<script>
	import PixiSimulationCanvas from './PixiSimulationCanvas.svelte';
	import OldCameraBootOverlay from './simulation/effects/OldCameraBootOverlay.svelte';

	import { animalRescueTheme } from './theme/animalRescue/animalRescueTheme';
	import { hackerTraceTheme } from './theme/hackerTrace/hackerTraceTheme';
	import { monsterDefenseTheme } from './theme/monsterDefense/monsterDefenseTheme';
	import { robotCockpitTheme } from './theme/robotCockpit/robotCockpitTheme';
	import { spaceBaseTheme } from './theme/spaceBase/spaceBaseTheme';
	import TimeMuseumSharedScreen from './theme/timeMuseum/TimeMuseumSharedScreen.svelte';
	import { weatherAppTheme } from './theme/weatherApp/weatherAppTheme';

	export let themeId = 'spaceBase';

	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {}
	};

	export let onFinalResultShown = () => {};

	const pixiThemeById = {
		spaceBase: spaceBaseTheme,
		animalRescue: animalRescueTheme,
		hackerTrace: hackerTraceTheme,
		monsterDefense: monsterDefenseTheme,
		robotCockpit: robotCockpitTheme,
		weatherApp: weatherAppTheme
	};

	$: pixiTheme = pixiThemeById[themeId] ?? spaceBaseTheme;
	$: isSpaceBase = themeId === 'spaceBase';
	$: isTimeMuseum = themeId === 'timeMuseum';
	$: screenOn = simulationState?.layers?.screenOn === true;
</script>

<div
	class="relative h-full max-h-full min-h-0 w-full overflow-hidden border border-slate-200 bg-slate-950 shadow-sm"
>
	{#if isTimeMuseum}
		<TimeMuseumSharedScreen {simulationState} {onFinalResultShown} />
	{:else if isSpaceBase}
		<OldCameraBootOverlay {screenOn}>
			<div class="absolute inset-0 h-full w-full overflow-hidden">
				<PixiSimulationCanvas theme={pixiTheme} {simulationState} {onFinalResultShown} />
			</div>
		</OldCameraBootOverlay>
	{:else}
		<div class="absolute inset-0 h-full w-full overflow-hidden">
			<PixiSimulationCanvas theme={pixiTheme} {simulationState} {onFinalResultShown} />
		</div>
	{/if}
</div>
