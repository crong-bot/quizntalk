<!-- src/lib/components/ai/_EncodeVectorPipelineCore.svelte -->
<script>
	import PixelGrid from './_PixelGrid.svelte';
	import { flatten01 } from './_mlTiny.js';

	export let title = '도트 → 숫자 → 벡터';
	export let pixels = []; // 2D 0/1
	export let showMatrix = true;
	export let autoPlay = true;
	export let speed = 12; // 숫자 "다다다" 속도 (ms)
	export let boxLabel = 'AI 학습 상자';

	let phase = 0; // 0:도트, 1:숫자행렬, 2:벡터, 3:다다다
	let vec = [];
	let cursor = 0;
	let running = false;

	$: vec = Array.isArray(pixels) && pixels.length ? flatten01(pixels) : [];

	function reset() {
		phase = 0;
		cursor = 0;
		running = false;
	}

	async function play() {
		if (running) return;
		running = true;

		phase = 0;
		await tick(300);
		phase = 1;
		await tick(500);
		phase = 2;
		await tick(350);
		phase = 3;

		cursor = 0;
		for (let i = 0; i <= vec.length; i++) {
			cursor = i;
			// 너무 느리면 지루하니 speed는 8~18ms 추천
			// (큰 화면일수록 10~14가 보기 좋음)
			// eslint-disable-next-line no-await-in-loop
			await tick(speed);
		}

		running = false;
	}

	function tick(ms) {
		return new Promise((r) => setTimeout(r, ms));
	}

	// auto
	$: if (autoPlay && vec.length && phase === 0 && !running) {
		// 첫 렌더 후 자동 재생
		setTimeout(() => play(), 150);
	}
</script>

<div class="mx-auto w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
	<div class="flex items-end justify-between gap-4">
		<div>
			<div class="text-slate-400 text-sm font-semibold">module</div>
			<div class="text-2xl font-extrabold text-slate-900 mt-1">{title}</div>
			<div class="text-slate-500 mt-2">
				도트가 <b>0/1 숫자</b>가 되고, 그 숫자가 <b>한 줄 벡터</b>로 펼쳐져서 AI로 들어가요.
			</div>
		</div>
		<div class="flex gap-2">
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200"
				on:click={reset}>리셋</button
			>
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
				on:click={play}>재생</button
			>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
		<!-- 도트 -->
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">1) 도트</div>
			<div class:opacity-40={phase > 0} class="transition">
				<PixelGrid {pixels} size={12} />
			</div>
		</div>

		<!-- 숫자 행렬 -->
		<div class="rounded-2xl border border-slate-100 p-4">
			<div class="text-xs text-slate-400 font-semibold mb-2">2) 0/1 숫자</div>
			{#if showMatrix}
				<div class="font-mono text-xs leading-4 text-slate-700 max-h-48 overflow-auto">
					{#if phase >= 1}
						{#each pixels as row}
							<div>
								{#each row as v}
									<span class={v ? 'text-slate-900 font-bold' : 'text-slate-300'}>{v}</span>
								{/each}
							</div>
						{/each}
					{:else}
						<div class="text-slate-300">…</div>
					{/if}
				</div>
			{:else}
				<div class="text-slate-300">숨김</div>
			{/if}
		</div>

		<!-- 벡터 + 다다다 -->
		<div class="rounded-2xl border border-slate-100 p-4 relative overflow-hidden">
			<div class="text-xs text-slate-400 font-semibold mb-2">3) 한 줄 벡터 → {boxLabel}</div>

			<div class="font-mono text-xs text-slate-700 break-all">
				{#if phase >= 2}
					[{vec.slice(0, Math.max(0, cursor)).join(',')}{cursor < vec.length ? ', …' : ''}]
				{:else}
					<span class="text-slate-300">…</span>
				{/if}
			</div>

			<!-- AI 박스 + 다다다 -->
			<div class="mt-4 flex items-center gap-3">
				<div
					class="flex-1 h-10 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden"
				>
					{#if phase >= 3}
						<div
							class="absolute inset-y-0 left-0 bg-slate-900/10"
							style="width:{(cursor / Math.max(1, vec.length)) * 100}%"
						></div>
					{/if}
					<div
						class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-semibold"
					>
						{phase >= 3 ? `입력 중… ${Math.min(cursor, vec.length)}/${vec.length}` : '대기중'}
					</div>
				</div>
				<div class="px-3 py-2 rounded-2xl bg-slate-900 text-white text-sm font-bold">AI</div>
			</div>

			{#if phase >= 3 && cursor >= vec.length}
				<div class="mt-3 text-emerald-700 font-semibold">완료! 벡터가 AI로 들어갔어요 ✅</div>
			{/if}
		</div>
	</div>
</div>
