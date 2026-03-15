<!-- src/lib/components/ai/_TrainStepCore.svelte -->
<script>
	import EncodeVectorPipelineCore from '../../_utils/_EncodeVectorPipelineCore.svelte';
	import { flatten01, loadModel, predictProbs, saveModel, trainOne } from '../../_utils/_mlTiny.js';
	import PixelGrid from '../../_utils/_PixelGrid.svelte';

	export let title = '한 번 더 학습하기';
	export let sample = null;
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';
	export let lr = 0.25;
	export let showVectorAnim = true;

	let model = null;
	let probsBefore = [];
	let probsAfter = [];
	let trained = false;
	let message = '';

	$: if (!model) model = loadModel(modelKey, classes, 256);

	function computeBefore() {
		if (!sample?.pixels) return;
		const x = flatten01(sample.pixels);
		probsBefore = predictProbs(model, x);
	}

	$: if (sample) computeBefore();

	async function trainOnce() {
		if (!sample?.pixels) return;
		trained = false;
		message = '';

		// (선택) 애니메이션은 UI에서 보여주고, 로직은 그대로 진행
		const x = flatten01(sample.pixels);

		const res = trainOne(model, x, sample.truth, lr);
		probsBefore = res.probsBefore ?? probsBefore;
		probsAfter = res.probsAfter ?? predictProbs(model, x);

		saveModel(modelKey, model);

		trained = true;
		message = res.changed
			? '업데이트 완료! 중요도가 바뀌면서 예측이 달라졌어요.'
			: '이번엔 이미 맞혔어요! 그래도 모델은 유지됩니다.';
	}

	function pct(p) {
		return Math.round((p || 0) * 100);
	}
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<div class="text-slate-400 text-sm font-semibold">module</div>
			<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
			<div class="text-slate-500 mt-2">
				틀린 뒤에는 <b>중요도(가중치)</b>를 조정해서 다음에는 더 잘 맞히게 돼요.
			</div>
		</div>
		<button
			class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
			on:click={trainOnce}
		>
			한 번 더 학습하기
		</button>
	</div>

	{#if sample?.pixels}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">표지판</div>
				<PixelGrid pixels={sample.pixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					정답: <b class="text-slate-900">{sample.truth}</b>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">학습 전 → 후 비교</div>

				<div class="space-y-4">
					<div>
						<div class="text-slate-500 text-sm font-semibold mb-2">학습 전</div>
						{#each classes as c, i}
							<div class="flex items-center justify-between text-sm">
								<span class="font-semibold text-slate-700">{c}</span>
								<span class="font-bold text-slate-900">{pct(probsBefore[i])}%</span>
							</div>
						{/each}
					</div>

					<div class="border-t border-slate-100 pt-4">
						<div class="text-slate-500 text-sm font-semibold mb-2">학습 후</div>
						{#each classes as c, i}
							<div class="flex items-center justify-between text-sm">
								<span class="font-semibold text-slate-700">{c}</span>
								<span class="font-bold text-slate-900">{pct(probsAfter[i])}%</span>
							</div>
						{/each}
					</div>
				</div>

				{#if trained}
					<div class="mt-4 text-emerald-700 font-semibold">{message}</div>
				{:else}
					<div class="mt-4 text-slate-500 text-sm">버튼을 눌러 “오차 → 조정”을 실행해보세요.</div>
				{/if}
			</div>
		</div>

		{#if showVectorAnim}
			<div class="mt-6">
				<EncodeVectorPipelineCore
					title="학습 입력(다다다): 벡터가 AI로 들어가요"
					pixels={sample.pixels}
					autoPlay={false}
					showMatrix={true}
					boxLabel="학습 AI"
				/>
				<div class="text-slate-500 text-sm mt-2">
					팁: 1-2에서 본 장면이 여기서 다시 나와야 “학습 입력” 느낌이 살아나요.
				</div>
			</div>
		{/if}
	{:else}
		<div class="mt-6 text-slate-500">sample이 비어 있어요.</div>
	{/if}
</div>
