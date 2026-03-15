<!-- src/lib/components/ai/_ReplayFocusMapCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import {
		argmax,
		flatten01,
		loadModel,
		predictProbs,
		topKImportant
	} from '../../_utils/_mlTiny.js';

	export let title = '오답 리플레이: AI는 어디를 봤을까?';
	export let sample = null;
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';
	export let topK = 35;

	let model = null;
	let probs = [];
	let predI = 0;
	let focus = new Set(); // indices

	$: if (!model) model = loadModel(modelKey, classes, 256);

	function compute() {
		if (!sample?.pixels) return;
		const x = flatten01(sample.pixels);
		probs = predictProbs(model, x);
		predI = argmax(probs);
		focus = topKImportant(model, predI, topK);
	}

	$: if (sample) compute();

	function isFocused(r, c) {
		const w = sample?.pixels?.[0]?.length ?? 16;
		const idx = r * w + c;
		return focus.has(idx);
	}
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div>
		<div class="text-slate-400 text-sm font-semibold">module</div>
		<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
		<div class="text-slate-500 mt-2">
			AI가 예측할 때 <b>특히 중요하게 본 픽셀(top {topK})</b>을 표시해요.
		</div>
	</div>

	{#if sample?.pixels}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">입력 도트</div>
				<div class="relative inline-block">
					<PixelGrid pixels={sample.pixels} size={12} />
					<!-- 포커스 오버레이 -->
					<div class="absolute inset-0 pointer-events-none">
						{#each sample.pixels as row, r}
							{#each row as v, c}
								{#if isFocused(r, c)}
									<div
										class="absolute border-2 border-amber-400 rounded-sm"
										style="left:{c * 12}px; top:{r * 12}px; width:12px; height:12px;"
									/>
								{/if}
							{/each}
						{/each}
					</div>
				</div>

				<div class="mt-3 text-slate-500 text-sm">
					AI 예측: <b class="text-slate-900">{classes[predI]}</b>
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

				<div class="mt-4 text-slate-500 text-sm">
					해석 팁: 포커스가 <b>중앙</b>에만 몰리면 모양(삼각형 꼭짓점/테두리)을 놓칠 수 있어요.
				</div>
			</div>
		</div>
	{:else}
		<div class="mt-6 text-slate-500">sample이 비어 있어요.</div>
	{/if}
</div>
