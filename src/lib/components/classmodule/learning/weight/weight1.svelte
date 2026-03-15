<!-- src/lib/components/ai/_FeatureMaskExperimentCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import { argmax, flatten01, loadModel, predictProbs } from '../../_utils/_mlTiny.js';

	export let title = '중요한 부분 실험: 가리면 어떻게 될까?';
	export let sample = null;
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';

	// 간단: 16x16에서 “사각형 마스크”만 제공 (브러시는 나중에 확장 가능)
	let mask = { x: 4, y: 4, w: 8, h: 8 }; // 기본 중앙 가리기
	let maskedPixels = [];
	let probsBefore = [];
	let probsAfter = [];

	let model = null;
	$: if (!model) model = loadModel(modelKey, classes, 256);

	function applyMask(pixels, m) {
		const out = pixels.map((r) => r.slice());
		for (let r = m.y; r < m.y + m.h; r++) {
			for (let c = m.x; c < m.x + m.w; c++) {
				if (out[r] && typeof out[r][c] !== 'undefined') out[r][c] = 0; // 가리기=0
			}
		}
		return out;
	}

	function recompute() {
		if (!sample?.pixels) return;
		const x0 = flatten01(sample.pixels);
		probsBefore = predictProbs(model, x0);

		maskedPixels = applyMask(sample.pixels, mask);
		const x1 = flatten01(maskedPixels);
		probsAfter = predictProbs(model, x1);
	}

	$: if (sample) recompute();

	function pct(p) {
		return Math.round((p || 0) * 100);
	}
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="text-slate-400 text-sm font-semibold">module</div>
	<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
	<div class="text-slate-500 mt-2">
		일부 영역을 가리면 예측이 흔들릴 수 있어요. 그 영역이 “중요한 특징”일 수 있죠.
	</div>

	{#if sample?.pixels}
		<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">원본</div>
				<PixelGrid pixels={sample.pixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					예측: <b class="text-slate-900">{classes[argmax(probsBefore)]}</b>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">가린 후</div>
				<PixelGrid pixels={maskedPixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					예측: <b class="text-slate-900">{classes[argmax(probsAfter)]}</b>
				</div>
			</div>
		</div>

		<div class="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
			<div class="font-bold text-slate-900">가릴 영역 조절</div>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
				<label class="text-sm text-slate-600 font-semibold"
					>x
					<input
						type="range"
						min="0"
						max="12"
						bind:value={mask.x}
						on:input={recompute}
						class="w-full"
					/>
				</label>
				<label class="text-sm text-slate-600 font-semibold"
					>y
					<input
						type="range"
						min="0"
						max="12"
						bind:value={mask.y}
						on:input={recompute}
						class="w-full"
					/>
				</label>
				<label class="text-sm text-slate-600 font-semibold"
					>w
					<input
						type="range"
						min="1"
						max="16"
						bind:value={mask.w}
						on:input={recompute}
						class="w-full"
					/>
				</label>
				<label class="text-sm text-slate-600 font-semibold"
					>h
					<input
						type="range"
						min="1"
						max="16"
						bind:value={mask.h}
						on:input={recompute}
						class="w-full"
					/>
				</label>
			</div>

			<div class="mt-4 grid grid-cols-3 gap-3">
				{#each classes as c, i}
					<div class="rounded-xl bg-white border border-slate-100 p-3">
						<div class="text-xs text-slate-400 font-semibold">{c}</div>
						<div class="font-extrabold text-slate-900">
							{pct(probsBefore[i])}% → {pct(probsAfter[i])}%
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
