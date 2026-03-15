<script>
	import EncodeVectorPipelineCore from '../../_utils/_EncodeVectorPipelineCore.svelte';
	import { SIGN_SAMPLES } from '../../_utils/sign_data.js';

	// 레슨 props에서 들어오는 값
	export let sampleRef = 'STOP_SAMPLE_1';

	// 옵션들(필요하면 레슨에서 props로 조절)
	export let autoPlay = true;
	export let speed = 12;
	export let showMatrix = true;

	// sampleRef로 샘플 찾기
	$: sample = SIGN_SAMPLES[sampleRef];

	// 안전장치: 없으면 첫 샘플로
	$: if (!sample) {
		const firstKey = Object.keys(SIGN_SAMPLES)[0];
		sample = SIGN_SAMPLES[firstKey];
	}
</script>

{#if sample?.pixels}
	<EncodeVectorPipelineCore
		title="표지판 도트 → 0/1 숫자 → 한 줄 벡터"
		pixels={sample.pixels}
		{autoPlay}
		{speed}
		{showMatrix}
		boxLabel="학습 AI"
	/>
{:else}
	<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
		<div class="text-slate-400 text-sm font-semibold">module</div>
		<div class="text-2xl font-extrabold text-slate-900 mt-1">인코딩 모듈</div>
		<div class="text-rose-600 font-semibold mt-2">
			sampleRef "{sampleRef}" 에 해당하는 pixels 데이터가 없어요.
		</div>
	</div>
{/if}
