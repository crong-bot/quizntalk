<!-- src/lib/components/ai/_WeightSliderCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import { argmax, flatten01, softmax } from '../../_utils/_mlTiny.js';

	export let title = '중요도 조절 실험(수동)';
	export let sample = null;
	export let classes = ['STOP', 'WARN', 'GO'];

	// 영역 프리셋(16x16): 테두리, 중앙, 꼭짓점(삼각형용), 기타
	// region: { id, label, mask:Set<number>, weight:number }
	function buildRegions() {
		const w = 16,
			h = 16;
		const idx = (r, c) => r * w + c;
		const border = new Set();
		const center = new Set();
		const corners = new Set();

		for (let r = 0; r < h; r++) {
			for (let c = 0; c < w; c++) {
				if (r === 0 || c === 0 || r === h - 1 || c === w - 1) border.add(idx(r, c));
				if (r >= 5 && r <= 10 && c >= 5 && c <= 10) center.add(idx(r, c));
				// 네 모서리 근처 (꼭짓점 느낌)
				if ((r <= 2 && c >= 6 && c <= 9) || (r >= 13 && c <= 2) || (r >= 13 && c >= 13))
					corners.add(idx(r, c));
			}
		}
		return [
			{ id: 'border', label: '테두리', mask: border, weight: 1.0 },
			{ id: 'center', label: '중앙', mask: center, weight: 1.0 },
			{ id: 'corners', label: '꼭짓점/모서리', mask: corners, weight: 1.0 }
		];
	}

	let regions = buildRegions();

	// “클래스별로 중요하게 보는 영역”을 교육용으로 미리 설정(고정 규칙)
	// STOP: border+center, WARN: corners+border, GO: center(화살표 중앙 강조)
	const classPreference = {
		STOP: { border: 1.0, center: 0.9, corners: 0.2 },
		WARN: { border: 0.8, center: 0.2, corners: 1.0 },
		GO: { border: 0.3, center: 1.0, corners: 0.2 }
	};

	let probs = [];

	function regionWeightOf(idx) {
		for (const r of regions) if (r.mask.has(idx)) return r.weight;
		return 1.0;
	}

	function compute() {
		if (!sample?.pixels) return;
		const x = flatten01(sample.pixels); // 0/1 256
		const logits = classes.map((c) => {
			const pref = classPreference[c] || {};
			let s = 0;
			for (let i = 0; i < x.length; i++) {
				if (!x[i]) continue;
				// 영역별 가중치(학생 조절) × 클래스 선호도(고정)
				const rw = regionWeightOf(i);
				const id = regions.find((rr) => rr.mask.has(i))?.id;
				const pw = id && pref[id] != null ? pref[id] : 0.5;
				s += rw * pw;
			}
			return s;
		});
		probs = softmax(logits);
	}

	$: if (sample) compute();

	function pct(p) {
		return Math.round((p || 0) * 100);
	}

	// 오버레이: 현재 regions 가중치를 픽셀 위에 히트처럼 보여주고 싶으면 확장 가능
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="text-slate-400 text-sm font-semibold">module</div>
	<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
	<div class="text-slate-500 mt-2">영역의 중요도(가중치)를 바꾸면, AI의 판단(확률)이 달라져요.</div>

	{#if sample?.pixels}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">표지판 도트</div>
				<PixelGrid pixels={sample.pixels} size={12} />
				<div class="mt-3 text-slate-500 text-sm">
					현재 예측: <b class="text-slate-900">{classes[argmax(probs)]}</b>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-100 p-4">
				<div class="text-xs text-slate-400 font-semibold mb-2">확률</div>
				<div class="space-y-3">
					{#each classes as c, i}
						<div>
							<div class="flex justify-between text-sm">
								<span class="font-semibold text-slate-700">{c}</span>
								<span class="font-bold text-slate-900">{pct(probs[i])}%</span>
							</div>
							<div class="h-3 bg-slate-200 rounded-full overflow-hidden mt-1">
								<div class="h-full bg-slate-900" style="width:{(probs[i] || 0) * 100}%"></div>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-5 text-slate-500 text-sm">
					미션: “정지(STOP)” 확률이 가장 크게 나오도록 슬라이더를 조절해보세요.
				</div>
			</div>
		</div>

		<div class="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
			<div class="font-bold text-slate-900">영역 중요도 조절</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
				{#each regions as r (r.id)}
					<div class="rounded-2xl bg-white border border-slate-100 p-4">
						<div class="font-semibold text-slate-700">{r.label}</div>
						<div class="flex items-center gap-3 mt-3">
							<input
								type="range"
								min="0"
								max="2"
								step="0.05"
								bind:value={r.weight}
								class="w-full"
								on:input={compute}
							/>
							<div class="w-14 text-right font-bold text-slate-900">{r.weight.toFixed(2)}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
