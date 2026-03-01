<script>
	import Module_button from '$lib/components/module_button.svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	//import { LessonManager } from '../../../stores/LessonManager.js';
	import ModuleCard from '$lib/components/module_card.svelte';

	//문장 안에 빈칸 있는 모듈!!!

	export let transition_delay;
	let answer_one;
	let answer_two;
	let answer_three;
	//const answers = {};
	const data = [];

	// 제출한 정답을 answers에 가지고 오는 함수
	function onSubmit(e) {
		// const inputs = e.target.elements;
		// for (let field of inputs) {
		//   let { id, value } = field;
		//   if (id !== '') answers[id] = value;
		// }
	}
</script>

<div
	on:introend
	in:scale={{
		delay: transition_delay,
		duration: 400,
		easing: quintOut
	}}
	out:scale={{
		delay: 0,
		duration: 0
	}}
	class="relative w-full my-1 py-3"
>
	<div class="flex flex-row py-4">
		<div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
		<div class=" font-dongle text-xl text-gray-300 mx-4">module</div>
		<div class="mt-3 w-2/4 border-t border-gray-200 border-dashed" />
	</div>

	<div class="flex flex-col justify-center items-center m-10">
		<ModuleCard>
			<form on:submit|preventDefault={onSubmit}>
				<div class="m-8 font-dodum text-2xl">
					<p class="">
						<span>칠해져 있는 부분의 숫자는 &nbsp</span>
						<input
							bind:value={data[0]}
							class=" text-center inline text-slate-600 text-opacity-90 font-dongle text-3xl font-bold h-8 w-14 bg-white border border-slate-300 rounded-md py-1 px-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
							type="text"
							id="1"
						/>
						<span>이고 칠해져 있지 않는 부분의 숫자는 &nbsp </span>
						<input
							bind:value={data[1]}
							class="text-center inline text-slate-600 text-opacity-90 mt-4 font-dongle text-3xl font-bold h-8 w-14 bg-white border border-slate-300 rounded-md py-1 px-1 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
							type="text"
							id="2"
						/>
						<span>입니다.</span>
					</p>
				</div>

				<!-- component need to mark to type submit -->
				<!-- 정답은 자동으로 answers props로 넘어감 몇개 든 상관 없고 id를 숫자로 순서대로 적어줘야 됨!!!!!!!!!!-->
			</form>
		</ModuleCard>
		<div class="mt-8">
			<Module_button type="submit" {data} />
		</div>
	</div>

	<div class="flex flex-row py-4">
		<div class="mt-3 w-full border-t border-gray-200 border-dashed" />
	</div>
</div>
