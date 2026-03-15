<!-- src/lib/components/ai/_LossCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import { argmax, flatten01, loadModel, lossCE, predictProbs } from '../../_utils/_mlTiny.js';

	export let title = '오차 점수(LOSS)';
	export let sample = null;
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';

	let model = null;
	let probs = [];
	let predI = 0;
	let chosenTruth = ''; // 학생이 선택
	let loss = null;

	$: if (!model) model = loadModel(modelKey, classes, 256);

	function compute() {
		if (!sample?.pixels) return;
		const x = flatten01(sample.pixels);
		probs = predictProbs(model, x);
		predI = argmax(probs);
		if (chosenTruth) {
			const ti = classes.indexOf(chosenTruth);
			loss = lossCE(probs, ti);
		} else {
			loss = null;
		}
	}

	$: if (sample) compute();
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div>
		<div class="text-slate-400 text-sm font-semibold">module</div>
		<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
		<div class="text-slate-500 mt-2">
			AI는 “맞/틀”만 보는 게 아니라 <b>얼마나 틀렸는지</b> 점수로 계산해요.
		</div>
	</div>

	{#if sample?.pixels}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">표지판</div>
				<PixelGrid pixels={sample.pixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					AI 예측: <b class="text-slate-900">{classes[predI]}</b>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">정답 선택</div>
				<div class="flex gap-2 flex-wrap">
					{#each classes as c}
						<button
							class="px-4 py-2 rounded-2xl border text-sm font-bold transition
              {chosenTruth === c
								? 'bg-slate-900 text-white border-slate-900'
								: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}"
							on:click={() => {
								chosenTruth = c;
								compute();
							}}
						>
							{c}
						</button>
					{/each}
				</div>

				<div class="mt-5 text-xs text-slate-400 font-semibold">오차 게이지</div>
				<div class="mt-2 h-3 bg-slate-200 rounded-full overflow-hidden">
					<div class="h-full bg-rose-500" style="width:{(loss?.scaled ?? 0) * 100}%"></div>
				</div>
				<div class="mt-2 text-slate-500 text-sm">
					{#if loss}
						오차(0~1): <b class="text-slate-900">{loss.scaled.toFixed(2)}</b>
						· (정답 확률이 낮을수록 오차가 커져요)
					{:else}
						정답을 누르면 오차가 계산돼요.
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-6 text-slate-500">sample이 비어 있어요.</div>
	{/if}
</div>
