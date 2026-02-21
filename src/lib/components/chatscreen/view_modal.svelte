<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	// 표시용 상태
	let lessonKey = '';
	let chapter = 0;

	let current_title = '';
	let current_number = '';
	let current_info = '';
	let current_chapterlist = [];

	$: console.log('MODAL data.post =', data?.post);

	// ✅ chapter만 URL에서 읽고, lessonKey는 data에서 읽기
	$: {
		const pathname = $page?.url?.pathname ?? '';
		const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
		chapter = Number(parts.at(-1) ?? '0') || 0;
	}

	// ✅ data.post 들어오면 모달 내용 세팅 (목차는 list만!)
	$: if (data?.post) {
		// ✅ lecture_content.json 메타에서 오는 값들
		lessonKey = data.post.slug ?? data.post.url ?? ''; // slug/url 둘 중 네가 내려주는 걸로 통일
		current_title = data.post.title ?? '';
		current_number = data.post.number ?? data.post.slug ?? '';
		current_info = data.post.info ?? '';

		// ✅ 목차는 무조건 list
		current_chapterlist = Array.isArray(data.post.list) ? data.post.list : [];
	} else {
		lessonKey = '';
		current_title = '';
		current_number = '';
		current_info = '';
		current_chapterlist = [];
	}

	function linkPage(index) {
		if (!lessonKey) return;
		// ✅ 0-based chapter 이동
		goto(`/study/${lessonKey}/${index}`);
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
		{#if current_chapterlist.length === 0}
			<div class="text-graytext text-xs px-4 py-2">목차가 없습니다.</div>
		{:else}
			{#each current_chapterlist as item, index (index)}
				<div on:click={() => linkPage(index)} class="py-2 cursor-pointer">
					{#if chapter === index}
						<span class="w-6 inline-block">🔥</span>
					{:else}
						<span class="w-6 inline-block" />
					{/if}

					<span class="font-bold text-sm text-bluetext mr-2 inline">
						{'0' + (index + 1)}
					</span>

					<span class="text-graytext text-xs inline">{item}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>
