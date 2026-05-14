<script>
	import PixiSimulationCanvas from './PixiSimulationCanvas.svelte';
	import OldCameraBootOverlay from './simulation/effects/OldCameraBootOverlay.svelte';
	import { spaceBaseTheme } from './theme/spaceBase/spaceBaseTheme';

	export let simulationState = {
		layers: {}
	};

	$: screenOn = simulationState?.layers?.screenOn === true;
</script>

<div
	class="relative h-full max-h-full min-h-0 w-full overflow-hidden border border-slate-200 bg-slate-950 shadow-sm"
>
	<OldCameraBootOverlay {screenOn}>
		<div class="absolute inset-0 h-full w-full overflow-hidden">
			<PixiSimulationCanvas theme={spaceBaseTheme} {simulationState} />
		</div>
	</OldCameraBootOverlay>
	<!-- <div
		class="pointer-events-none absolute bottom-4 left-4 right-4 z-50 rounded-2xl bg-slate-950/55 px-4 py-3 text-xs font-bold text-blue-100 backdrop-blur"
	>
		JSON 값에 따라 공용 월드의 빛, 움직임, 상태가 달라집니다.
	</div> -->
</div>
