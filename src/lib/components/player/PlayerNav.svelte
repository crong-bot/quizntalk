<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();
	const canGoPrevStore = playerStore.canGoPrev;
	const canGoNextStore = playerStore.canGoNext;
	const currentStageStore = playerStore.currentStage;

	$: lesson = $playerStore?.lesson || {};
	$: stages = Array.isArray(lesson?.stages) ? lesson.stages : [];
	$: currentStage = $currentStageStore;
	$: currentStageId = currentStage?.id ?? $playerStore?.currentStageId ?? null;
	$: currentIndex = stages.findIndex((s) => s?.id === currentStageId);

	function prev() {
		playerStore.actions.goPrev();
	}

	function next() {
		playerStore.actions.goNext();
	}
</script>

<div class="flex gap-3">
	<button
		type="button"
		on:click={prev}
		disabled={!$canGoPrevStore}
		class="flex-1 rounded-[22px] border border-slate-200 bg-white px-6 py-4 text-[22px] font-extrabold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
	>
		이전 단계
	</button>

	<button
		type="button"
		on:click={next}
		disabled={!$canGoNextStore}
		class="flex-1 rounded-[22px] bg-violet-500 px-6 py-4 text-[22px] font-extrabold text-white shadow-[0_12px_22px_rgba(139,92,246,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
	>
		{currentIndex >= stages.length - 1 ? '마지막 단계' : '다음 단계'}
	</button>
</div>
