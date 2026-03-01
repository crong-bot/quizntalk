<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let course = null; // { course: "cognitive", ... } 같은 형태
	export let lessons = []; // course.lessons 배열
	export let currentLessonId = '';
	export let currentLessonTitle = '';

	// ✅ +page.js(load)에서 내려준 값 받기
	export let prevCourse = null; // { course, title } or null
	export let nextCourse = null; // { course, title } or null

	// 현재 페이지 index (0-based)
	let step = 0;
	$: {
		const pathname = $page?.url?.pathname ?? '';
		const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
		step = Number(parts.at(-1) ?? '0') || 0;
	}

	function courseSlug() {
		// course.course가 "cognitive" 같은 값이라고 했지?
		return (course?.course ?? course?.id ?? '').trim();
	}

	function getLessonId(l) {
		return l?.lessonId ?? l?.id ?? '';
	}

	$: activeTitle =
		currentLessonTitle || lessons.find((x) => getLessonId(x) === currentLessonId)?.title || '강의';

	function openLesson(index) {
		const courseSlug = (course?.course ?? course?.id ?? '').trim(); // cognitive, rgb ...
		if (!courseSlug) return;

		goto(`/study/local/${encodeURIComponent(courseSlug)}/${index}`);
	}
</script>

<div class="font-gmarket bg-white h-full pt-24 px-4 pb-8 min-w-0">
	<div id="modal-title-container" class="px-1">
		<div class="font-normal text-graytext text-sm">단원</div>

		<!-- 전/현재/다음 코스 표시 (클릭 불가) -->
		<div class="mt-3 mb-5 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
			<div class="flex items-center justify-between text-xs">
				<span class="text-slate-400 font-medium">
					{prevCourse?.title ?? '--'}
				</span>
			</div>

			<div class="mt-2 flex items-center justify-between">
				<span class="text-base text-slate-900 font-extrabold">
					{course?.title ?? '--'}
				</span>
			</div>

			<div class="mt-2 flex items-center justify-between text-xs">
				<span class="text-slate-400 font-medium">
					{nextCourse?.title ?? '--'}
				</span>
			</div>
		</div>

		<!-- ✅ 코스 제목 아래 info 표시 + 여백 -->
		{#if course?.info}
			<div class="mb-2 text-sm font-semibold text-graytext">
				차시 [{course.info}]
			</div>
		{:else}
			<div class="mb-6" />
		{/if}

		<!-- ✅ 현재 레슨 타이틀 (기존 유지, 간격만 조금 정리) -->
		<!-- <div class="font-bold text-xl mb-6 text-navytext px-4">
			{activeTitle}
		</div> -->
	</div>

	<div class="font-light text-sm bg-white">
		{#if !Array.isArray(lessons) || lessons.length === 0}
			<div class="text-graytext text-xs px-4 py-2">목차가 없습니다.</div>
		{:else}
			{#each lessons as l, index (getLessonId(l) || index)}
				<button
					type="button"
					on:click={() => openLesson(index)}
					class="w-full text-left py-2 cursor-pointer
        flex items-center gap-2
        {currentLessonId === getLessonId(l) ? 'bg-emerald-50 rounded-lg' : ''}"
				>
					{#if currentLessonId === getLessonId(l)}
						<span class="w-6 flex justify-center text-emerald-600">▶</span>
					{:else}
						<span class="w-6" />
					{/if}

					<span class="font-bold text-sm text-bluetext mr-1">
						{'0' + (index + 1)}
					</span>

					<span
						class="text-sm
          {currentLessonId === getLessonId(l) ? 'text-emerald-700 font-bold' : 'text-graytext'}"
					>
						{l.title ?? getLessonId(l)}
					</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
