<!-- src/lib/components/ai/_PredictorCore.svelte -->
<script>
	import EncodeVectorPipelineCore from '../../_utils/_EncodeVectorPipelineCore.svelte';
	import { argmax, flatten01, loadModel, predictProbs } from '../../_utils/_mlTiny.js';
	import PixelGrid from '../../_utils/_PixelGrid.svelte';

	export let title = 'AI 예측기';
	export let dataset = []; // sample[]
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';
	export let showEncodeAnim = true;

	let model = null;
	let selected = null;
	let probs = [];

	$: if (!model) model = loadModel(modelKey, classes, 256);
	$: selected = dataset?.[0] ?? null;

	function runPredict() {
		if (!selected?.pixels) return;
		const x = flatten01(selected.pixels);
		probs = predictProbs(model, x);
	}

	$: if (selected) runPredict();

	function resetModel() {
		model = null;
		probs = [];
		setTimeout(() => {
			model = loadModel(modelKey, classes, 256);
			runPredict();
		}, 0);
	}

	function labelOfMax() {
		if (!probs?.length) return '';
		return classes[argmax(probs)];
	}
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<div class="text-slate-400 text-sm font-semibold">module</div>
			<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
			<div class="text-slate-500 mt-2">
				AI는 벡터를 보고 <b>확률</b>로 말해요. (100%가 아닐 수도 있어요!)
			</div>
		</div>
		<button
			class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200"
			on:click={resetModel}>모델 초기화</button
		>
	</div>

	{#if selected}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">표지판 도트</div>
				<PixelGrid pixels={selected.pixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					AI 예측: <b class="text-slate-900">{labelOfMax()}</b>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">확률</div>
				<div class="space-y-3">
					{#each classes as c, i}
						<div>
							<div class="flex justify-between text-sm">
								<span class="font-semibold text-slate-700">{c}</span>
								<span class="font-bold text-slate-900">{Math.round((probs[i] || 0) * 100)}%</span>
							</div>
							<div class="h-3 bg-slate-200 rounded-full overflow-hidden mt-1">
								<div class="h-full bg-slate-900" style="width:{(probs[i] || 0) * 100}%"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		{#if showEncodeAnim}
			<div class="mt-6">
				<EncodeVectorPipelineCore
					title="도트가 벡터로 바뀌어 AI로 들어가는 장면"
					pixels={selected.pixels}
					autoPlay={true}
					showMatrix={true}
					boxLabel="예측 AI"
				/>
			</div>
		{/if}
	{:else}
		<div class="text-slate-500 mt-6">dataset이 비어 있어요.</div>
	{/if}
</div>
