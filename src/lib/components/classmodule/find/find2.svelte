<script>
	import { createEventDispatcher } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { DOG_TRAIN } from './catdog_data.js';

	export let transition_delay = 0;
	const dispatch = createEventDispatcher();

	const options = [
		{ id: 'ear_small', text: '귀 숫자가 작다 (3 이하)' },
		{ id: 'tail_big', text: '꼬리 숫자가 크다 (7 이상)' },
		{ id: 'whisker_small', text: '수염 숫자가 작다 (4 이하)' },
		{ id: 'ear_big', text: '귀 숫자가 크다 (7 이상)' },
		{ id: 'tail_small', text: '꼬리 숫자가 작다 (3 이하)' }
	];

	let selected = new Set();
	let result = null;

	function toggle(id) {
		const next = new Set(selected);
		next.has(id) ? next.delete(id) : next.add(id);
		selected = next;
	}

	function submit() {
		const must = ['ear_small', 'tail_big', 'whisker_small'];
		const ok = must.every((m) => selected.has(m)) && selected.size === must.length;
		result = ok ? 'ok' : 'no';
		if (ok) dispatch('complete', { success: true });
	}
</script>

<div
	id="bubble"
	on:introend
	in:scale={{ delay: transition_delay, duration: 400, easing: quintOut }}
	out:scale={{ delay: 0, duration: 0 }}
	class="relative w-full my-1 py-3"
>
	<div class="flex flex-row py-4">
		<div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
		<div class="font-dongle text-xl text-gray-300 mx-4">module</div>
		<div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
	</div>

	<div class="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
		<div class="font-dodum font-extrabold text-2xl text-slate-900">🐶 강아지 데이터</div>
		<div class="text-slate-500 mt-2">강아지는 어떤 공통점이 있을까요?</div>

		<div class="grid grid-cols-3 gap-4 mt-6">
			{#each DOG_TRAIN as d}
				<div class="rounded-2xl border border-slate-100 p-4">
					<div class="text-xs text-slate-400 font-semibold mb-2">강아지</div>
					<div class="flex justify-between text-lg font-extrabold text-slate-800">
						<span>귀 {d.ear}</span>
						<span>수염 {d.whisker}</span>
						<span>꼬리 {d.tail}</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-8">
			<div class="text-slate-900 font-extrabold text-lg">공통점 후보</div>

			<div class="grid grid-cols-1 gap-3 mt-3">
				{#each options as o}
					<button
						class="text-left px-4 py-3 rounded-2xl border transition
              {selected.has(o.id)
							? 'bg-emerald-50 border-emerald-200 text-emerald-800'
							: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}"
						on:click={() => toggle(o.id)}
					>
						{selected.has(o.id) ? '✅ ' : ''}{o.text}
					</button>
				{/each}
			</div>

			<div class="flex items-center gap-3 mt-6">
				<button
					class="px-5 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
					on:click={submit}
				>
					제출하기
				</button>

				{#if result === 'ok'}
					<div class="text-emerald-700 font-bold">정답! 강아지 규칙을 찾았어요 ✅</div>
				{:else if result === 'no'}
					<div class="text-rose-600 font-bold">아쉽! 다시 골라볼까요?</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex flex-row py-4">
		<div class="mt-3 w-full border-t border-gray-200 border-dashed" />
	</div>
</div>
