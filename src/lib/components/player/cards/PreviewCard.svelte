<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();

	$: $playerStore;
	$: stage = $playerStore.currentStage;
</script>

<div class="rounded-[28px] border border-slate-200/80 bg-white p-6">
	<h3 class="text-[30px] font-extrabold tracking-[-0.03em] text-slate-900">다음 모듈 미리보기</h3>
	<div class="mt-3 text-[18px] font-bold text-blue-600">{stage?.nextPreviewTitle}</div>
	<p class="mt-3 text-[19px] leading-8 text-slate-700">{stage?.nextPreviewText}</p>
	<div class="mt-5 flex justify-end text-5xl">🧩</div>
</div>
