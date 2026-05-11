<script>
	import PixiSimulationCanvas from './PixiSimulationCanvas.svelte';
	import { spaceBaseTheme } from './theme/spaceBase/spaceBaseTheme';

	export let simulationState = {
		layers: {}
	};
</script>

<div
	class="relativeh-full max-h-full min-h-0 w-full overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950 shadow-sm"
>
	<!-- <div
		class="absolute left-4 top-4 z-10 rounded-xl bg-white/90 px-3 py-2 text-sm font-extrabold text-slate-900"
	>
		공유 시뮬레이션
	</div> -->

	<PixiSimulationCanvas theme={spaceBaseTheme} {simulationState} />

	<div
		class="absolute bottom-4 left-4 right-4 z-10 rounded-2xl bg-slate-950/55 px-4 py-3 text-xs font-bold text-blue-100 backdrop-blur"
	>
		JSON 값에 따라 공용 월드의 빛, 움직임, 상태가 달라집니다.
	</div>
</div>
