<!-- src/lib/components/ai/_SignPatternCompareCore.svelte -->
<script>
	import PixelGrid from '../../_utils/_PixelGrid.svelte';

	export let title = '패턴 찾기: 공통점 비교';
	export let dataset = []; // 같은 truth끼리 4~6개 권장

	function andPixels(list) {
		if (!list?.length) return [];
		const h = list[0].length;
		const w = list[0][0].length;
		const out = Array.from({ length: h }, () => Array(w).fill(1));
		for (let r = 0; r < h; r++) {
			for (let c = 0; c < w; c++) {
				out[r][c] = list.every((p) => p[r][c] === 1) ? 1 : 0;
			}
		}
		return out;
	}

	function xorPixels(list) {
		if (!list?.length) return [];
		const h = list[0].length;
		const w = list[0][0].length;
		const out = Array.from({ length: h }, () => Array(w).fill(0));
		for (let r = 0; r < h; r++) {
			for (let c = 0; c < w; c++) {
				const ones = list.reduce((acc, p) => acc + (p[r][c] ? 1 : 0), 0);
				out[r][c] = ones > 0 && ones < list.length ? 1 : 0; // 서로 다른 칸
			}
		}
		return out;
	}

	$: pixelsList = dataset.map((d) => d.pixels).filter(Boolean);
	$: common = andPixels(pixelsList);
	$: diff = xorPixels(pixelsList);
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="text-slate-400 text-sm font-semibold">module</div>
	<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
	<div class="text-slate-500 mt-2">
		여러 장을 비교해서 <b>모든 사진에 항상 있는 픽셀(공통)</b>과 <b>서로 다른 픽셀(차이)</b>를
		찾아요.
	</div>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
		{#each dataset as d (d.id)}
			<div class="rounded-2xl border border-slate-100 p-3">
				<div class="text-slate-400 text-xs font-semibold mb-2">샘플 {d.id}</div>
				<PixelGrid pixels={d.pixels} size={10} />
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">공통 패턴(AND)</div>
			<PixelGrid pixels={common} size={12} />
			<div class="text-slate-500 text-sm mt-3">
				이 모양이 “규칙” 후보예요. (항상 보이는 픽셀만 남음)
			</div>
		</div>

		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">차이 픽셀(XOR)</div>
			<PixelGrid pixels={diff} size={12} />
			<div class="text-slate-500 text-sm mt-3">
				여기 픽셀은 샘플마다 달라서 헷갈리게 만들 수 있어요.
			</div>
		</div>
	</div>
</div>
