<!-- src/lib/components/ai/_NoisePredictorCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import { argmax, flatten01, loadModel, predictProbs } from '../../_utils/_mlTiny';

	export let title = '노이즈 실험 예측기';
	export let sample = null; // single sample
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';
	export let maxNoise = 25;

	let model = null;
	let noise = 0; // %
	let noisyPixels = [];
	let probs = [];

	$: if (!model) model = loadModel(modelKey, classes, 256);

	function clone2d(p) {
		return p.map((r) => r.slice());
	}

	function applyNoise(pixels, percent) {
		const out = clone2d(pixels);
		const h = out.length,
			w = out[0]?.length ?? 0;
		const total = h * w;
		const flips = Math.round(total * (percent / 100));
		for (let t = 0; t < flips; t++) {
			const idx = Math.floor(Math.random() * total);
			const r = Math.floor(idx / w);
			const c = idx % w;
			out[r][c] = out[r][c] ? 0 : 1;
		}
		return out;
	}

	function run() {
		if (!sample?.pixels) return;
		noisyPixels = applyNoise(sample.pixels, noise);
		const x = flatten01(noisyPixels);
		probs = predictProbs(model, x);
	}

	$: if (sample) run();
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div>
		<div class="text-slate-400 text-sm font-semibold">module</div>
		<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
		<div class="text-slate-500 mt-2">
			비/먼지 때문에 픽셀이 흔들리면 AI 확률이 어떻게 바뀌는지 확인해요.
		</div>
	</div>

	<div class="mt-6 flex items-center gap-3">
		<div class="font-semibold text-slate-700">노이즈</div>
		<input type="range" min="0" max={maxNoise} bind:value={noise} class="w-full" on:input={run} />
		<div class="font-bold text-slate-900 w-16 text-right">{noise}%</div>
		<button
			class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
			on:click={run}>예측</button
		>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">노이즈 적용 도트</div>
			<PixelGrid pixels={noisyPixels} size={12} />
		</div>

		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">확률</div>
			<div class="text-slate-500 text-sm mb-2">
				예측: <b class="text-slate-900">{classes[argmax(probs || [])] ?? '-'}</b>
			</div>
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
</div>
