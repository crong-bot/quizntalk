<script>
	import { onMount, beforeUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	//import Content from '../../../routes/study/data.json';

	export let data;

	let lesson_name,
		chapter,
		current_content,
		current_title,
		current_number,
		current_info,
		current_chapterlist;

	[lesson_name, chapter] = [...$page.url.pathname.split('/').slice(-2)];
	console.log('aa' + data.post.title);
	//let a = data.find((record) => record.slug === lesson_name);

	//console.log(a.list);
	current_chapterlist = data.post.list;
	current_title = data.post.title;
	current_number = data.post.slug;
	current_info = data.post.title;
	// current_chapterlist = [...Content[0][lesson_name]['list']];
	// current_title = [Content[0][lesson_name]['title']];
	// current_number = [Content[0][lesson_name]['number']];
	// current_info = [Content[0][lesson_name]['info']];

	function linkPage(index) {
		let currentnum, currentpath, currentlesson;
		let a = window.location.pathname;
		currentnum = a.slice(-1); // a=>"/study/lessonname/num"
		currentnum = Number(currentnum); // num
		currentpath = a.slice(0, -1); // "/study/lessonname"
		currentlesson = a.split('/').slice(-2, -1)[0];
		let url = currentpath + (index + 1);
		console.log(url);
		goto(url);
	}
</script>

<div class="font-gmarket bg-white h-full pt-24 px-4 pb-8 col-span-2">
	<div id="modal-title-container">
		<div class="font-light text-graytext text-sm">Lesson</div>
		<div class="flex justify-between mb-4">
			<div class="mb-4 font-bold text-xl text-bluetext">{current_number}</div>
			<div class="font-thin text-xs text-graytext">{current_info}</div>
		</div>
		<div class="font-bold text-xl mb-8 text-navytext px-4">
			{current_title}
		</div>
	</div>
	<div class="font-light text-sm bg-white">
		{#each current_chapterlist as list, index}
			<div on:click={() => linkPage(index)} class="py-2 cursor-pointer">
				{#if chapter == index + 1}
					<span class="w-6 inline-block">🔥</span>
				{:else}
					<span class="w-6 inline-block" />
				{/if}
				<span class="font-bold text-sm text-bluetext mr-2 inline">{'0' + (index + 1)}</span>
				<span class="text-graytext text-xs inline"> {list}</span>
			</div>
		{/each}
	</div>
</div>
