<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();

	$: $playerStore;
	$: stage = $playerStore.currentStage;
</script>

<div
	class="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
>
	<div class="flex items-start gap-3">
		<div class="mt-1 text-2xl text-violet-500">🎯</div>
		<div>
			<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">
				{stage?.missionTitle}
			</h3>
			<p class="mt-2 text-[20px] leading-8 text-slate-700">
				{stage?.missionText}
			</p>
		</div>
	</div>
</div>
