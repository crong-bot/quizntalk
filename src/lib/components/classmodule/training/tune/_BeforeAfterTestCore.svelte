<!-- src/lib/components/ai/_BeforeAfterTestCore.svelte -->
<script>
	import {
		argmax,
		flatten01,
		loadModel,
		predictProbs,
		saveModel,
		trainOne
	} from '../../_utils/_mlTiny.js';

	export let title = '시운전 테스트: 학습 전 vs 학습 후';
	export let testset = []; // sample[]
	export let classes = ['STOP', 'WARN', 'GO'];
	export let modelKey = 'td_sign_model_v1';
	export let trainSteps = 3;
	export let lr = 0.25;

	let beforeModel = null;
	let afterModel = null;
	let beforeScore = 0;
	let afterScore = 0;

	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	function evalScore(model) {
		let ok = 0;
		for (const s of testset) {
			const x = flatten01(s.pixels);
			const p = predictProbs(model, x);
			const pred = classes[argmax(p)];
			if (pred === s.truth) ok++;
		}
		return ok;
	}

	function run() {
		beforeModel = loadModel(modelKey, classes, 256);
		beforeScore = evalScore(beforeModel);

		// after는 before를 복사해서 “학습 몇 번” 시뮬레이션
		afterModel = clone(beforeModel);

		// 간단히 앞에서부터 trainSteps 만큼 학습
		for (let i = 0; i < Math.min(trainSteps, testset.length); i++) {
			const s = testset[i];
			const x = flatten01(s.pixels);
			trainOne(afterModel, x, s.truth, lr);
		}

		afterScore = evalScore(afterModel);
	}

	function applyAfterAsRealModel() {
		if (!afterModel) return;
		saveModel(modelKey, afterModel);
	}

	$: if (testset?.length) run();
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<div class="text-slate-400 text-sm font-semibold">module</div>
			<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
			<div class="text-slate-500 mt-2">
				같은 테스트 표지판을 학습 전/후 모델이 얼마나 맞히는지 비교해요.
			</div>
		</div>
		<div class="flex gap-2">
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200"
				on:click={run}
			>
				다시 측정
			</button>
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
				on:click={applyAfterAsRealModel}
			>
				업데이트 적용
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-slate-500 text-sm font-semibold">학습 전</div>
			<div class="text-3xl font-extrabold text-slate-900 mt-2">
				{beforeScore} / {testset.length}
			</div>
			<div class="text-slate-500 mt-2">현재 모델 성능</div>
		</div>

		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-slate-500 text-sm font-semibold">학습 후</div>
			<div class="text-3xl font-extrabold text-slate-900 mt-2">{afterScore} / {testset.length}</div>
			<div class="text-slate-500 mt-2">({trainSteps}번 학습 시뮬레이션 후)</div>
			{#if afterScore > beforeScore}
				<div class="mt-3 text-emerald-700 font-semibold">성능이 좋아졌어요 ✅</div>
			{:else if afterScore === beforeScore}
				<div class="mt-3 text-slate-500 font-semibold">
					변화가 거의 없어요 (데이터/학습 더 필요)
				</div>
			{:else}
				<div class="mt-3 text-rose-600 font-semibold">오히려 나빠졌어요(과하게 학습했을 수도!)</div>
			{/if}
		</div>
	</div>
</div>
