<script>
	import { getPlayerContext } from '$lib/player/playerContext';

	const playerStore = getPlayerContext();
	const currentStageStore = playerStore.currentStage;
	const currentStageDataStore = playerStore.currentStageData;

	$: stage = $currentStageStore;
	$: stageData = $currentStageDataStore;
	$: rgb = stageData?.rgb || { r: 255, g: 165, b: 0 };
</script>

<div class="rounded-[28px] border border-slate-200/80 bg-violet-50 p-6">
	<h3 class="text-[28px] font-extrabold tracking-[-0.03em] text-violet-900">
		{stage?.conceptTitle}
	</h3>

	{#if stage?.moduleType === 'rgb-lab'}
		<div
			class="mt-4 rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-[18px] font-bold text-slate-800"
		>
			R: {rgb.r} · G: {rgb.g} · B: {rgb.b}
		</div>

		<p class="mt-4 text-[19px] leading-8 text-slate-700">
			AI는 색을 감각으로 느끼지 않고 숫자 조합으로 읽어요.
		</p>
	{:else if stage?.moduleType === 'pixel-heart'}
		<p class="mt-4 text-[19px] leading-8 text-slate-700">
			그림도 작은 점(픽셀)마다 숫자를 넣어서 표현할 수 있어요.
		</p>
	{:else if stage?.moduleType === 'sensor-select'}
		<p class="mt-4 text-[19px] leading-8 text-slate-700">
			자율주행차는 카메라 하나만 보는 게 아니라 여러 센서를 함께 사용해요.
		</p>
	{/if}
</div>
