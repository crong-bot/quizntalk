<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// ✅ 부모에서 이렇게 넘김: <Modal course={data.course} lessons={data.lessons} />
	export let course = null;
	export let lessons = [];
	export let currentLessonId = '';
	export let currentLessonTitle = '';

	// (옵션) 현재 재생 중 레슨 표시하려면 부모에서 currentLessonId도 넘기는 게 베스트
	// export let currentLessonId = '';

	let chapter = 0;

	$: {
		const pathname = $page?.url?.pathname ?? '';
		const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
		chapter = Number(parts.at(-1) ?? '0') || 0;
	}

	function getLessonId(l) {
		return l?.lessonId ?? l?.id ?? '';
	}
	$: activeTitle =
		currentLessonTitle || lessons.find((x) => getLessonId(x) === currentLessonId)?.title || '강의';

	function openLesson(l) {
		const lessonId = getLessonId(l);
		if (!lessonId) return;

		// ✅ 코스 컨텍스트 유지 라우트가 있다면 이걸 추천:
		// goto(`/study/c/${encodeURIComponent(course.id)}/${encodeURIComponent(lessonId)}/0`);

		// ✅ 당장 /study/u 라우트만 있으면:
		goto(`/study/u/${encodeURIComponent(lessonId)}/0`);
	}
</script>

<div class="font-gmarket bg-white h-full pt-24 px-4 pb-8 col-span-2">
	<div id="modal-title-container">
		<div class="font-light text-graytext text-sm">Course</div>

		<div class="flex justify-between mb-4">
			<div class="mb-4 font-bold text-xl text-bluetext">
				{course?.title ?? '제목없음'}
			</div>
			<div class="font-thin text-xs text-graytext">{course?.info ?? ''}</div>
		</div>

		<div class="font-bold text-xl mb-8 text-navytext px-4">
			{activeTitle}
		</div>
	</div>

	<div class="font-light text-sm bg-white">
		{#if !Array.isArray(lessons) || lessons.length === 0}
			<div class="text-graytext text-xs px-4 py-2">목차가 없습니다.</div>
		{:else}
			{#each lessons as l, index (getLessonId(l) || index)}
				<button
					type="button"
					on:click={() => openLesson(l)}
					class="w-full text-left py-2 cursor-pointer
          flex items-center gap-2
          {currentLessonId === getLessonId(l) ? 'bg-emerald-50 rounded-lg' : ''}"
				>
					<!-- ✅ 현재 차시면 ▶ 아이콘 -->
					{#if currentLessonId === getLessonId(l)}
						<span class="w-6 flex justify-center text-emerald-600">▶</span>
					{:else}
						<span class="w-6" />
					{/if}

					<span class="font-bold text-sm text-bluetext mr-1">
						{'0' + (index + 1)}
					</span>

					<span
						class="text-xs
            {currentLessonId === getLessonId(l) ? 'text-emerald-700 font-bold' : 'text-graytext'}"
					>
						{l.title ?? getLessonId(l)}
					</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
