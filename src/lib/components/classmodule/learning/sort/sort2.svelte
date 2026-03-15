<!-- src/lib/components/ai/_SignVectorPatternCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';
	import { flatten01 } from '../../_utils/_mlTiny.js';

	export let title = '벡터에서도 규칙 찾기';
	export let dataset = [];
	export let topN = 15;

	$: vectors = dataset.map((d) => flatten01(d.pixels));
	$: dim = vectors?.[0]?.length ?? 0;

	function commonIdx(vs) {
		if (!vs.length) return [];
		const out = [];
		for (let i = 0; i < dim; i++) {
			if (vs.every((v) => v[i] === 1)) out.push(i);
		}
		return out;
	}

	function diffIdx(vs) {
		if (!vs.length) return [];
		const out = [];
		for (let i = 0; i < dim; i++) {
			const ones = vs.reduce((a, v) => a + v[i], 0);
			if (ones > 0 && ones < vs.length) out.push(i);
		}
		return out;
	}

	$: common = commonIdx(vectors);
	$: diff = diffIdx(vectors);

	// 공통 인덱스 중에서 "상위 N"만 보여주기 (그냥 앞에서부터)
	$: commonTop = common.slice(0, topN);
	$: diffTop = diff.slice(0, topN);

	// 시각화를 위해 공통/차이를 다시 16x16 픽셀로 복원
	function toPixelsFromSet(setIdx) {
		const w = 16,
			h = 16;
		const out = Array.from({ length: h }, () => Array(w).fill(0));
		for (const i of setIdx) {
			const r = Math.floor(i / w);
			const c = i % w;
			if (r < h) out[r][c] = 1;
		}
		return out;
	}

	$: commonPixels = toPixelsFromSet(commonTop);
	$: diffPixels = toPixelsFromSet(diffTop);
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="text-slate-400 text-sm font-semibold">module</div>
	<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
	<div class="text-slate-500 mt-2">
		벡터(한 줄 숫자)에서도 <b>공통 인덱스</b>, <b>차이 인덱스</b>를 찾아 규칙을 만들 수 있어요.
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">공통 인덱스 TOP {topN}</div>
			<div class="font-mono text-xs text-slate-700 break-all">
				[{commonTop.join(', ')}{common.length > topN ? ', …' : ''}]
			</div>
			<div class="mt-3">
				<PixelGrid pixels={commonPixels} size={12} />
			</div>
			<div class="text-slate-500 text-sm mt-3">“항상 1인 위치”가 규칙 후보가 돼요.</div>
		</div>

		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">차이 인덱스 TOP {topN}</div>
			<div class="font-mono text-xs text-slate-700 break-all">
				[{diffTop.join(', ')}{diff.length > topN ? ', …' : ''}]
			</div>
			<div class="mt-3">
				<PixelGrid pixels={diffPixels} size={12} />
			</div>
			<div class="text-slate-500 text-sm mt-3">
				“샘플마다 달라지는 위치”는 헷갈림(오답)의 원인이 될 수 있어요.
			</div>
		</div>
	</div>
</div>
