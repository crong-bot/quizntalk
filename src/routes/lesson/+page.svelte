<script>
	import { jsonLearningCourses } from '$lib/components/jsonstudy/courses/index.js';
	import Nav from '$lib/components/nav.svelte';

	const course = jsonLearningCourses[0];

	function getLessonImage(lesson) {
		const imageBlock = lesson.contentBlocks?.find((block) => block.type === 'image');
		return imageBlock?.src ?? lesson.image ?? '';
	}
</script>

<Nav />
<div class="min-h-screen bg-[#f4f7fb] px-4 py-4 font-nanum text-slate-800">
	<div class="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
		<header class="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
			<div class="px-6 py-4">
				<div class="mt-0 flex flex-col justify-between gap-4 md:flex-row md:items-end">
					<div>
						<div class="flex flex-wrap items-center gap-3">
							<h1 class="font-gmarket text-[34px] font-bold tracking-[-0.065em] text-slate-950">
								{course.title}
							</h1>

							<div
								class="rounded-2xl bg-blue-50 px-4 py-2.5 text-[13px] font-extrabold text-blue-700"
							>
								총 {course.lessons.length}단계
							</div>
						</div>

						<p class="mt-2 text-[15px] font-bold leading-7 text-slate-500">
							{course.subtitle}
						</p>
					</div>

					<div
						class="rounded-[22px] border border-blue-100 bg-blue-50 px-5 py-4 text-[14px] font-extrabold leading-6 text-blue-700"
					>
						AI 시대에 필요한 데이터의 모양을<br class="hidden md:block" />
						하나씩 배워요.
					</div>
				</div>
			</div>
		</header>

		<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{#each course.lessons as lesson, index}
				{@const lessonImage = getLessonImage(lesson)}

				<a
					href={`/lesson/${course.slug}/${index + 1}`}
					class="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
				>
					<div class="relative h-[108px] overflow-hidden bg-slate-900">
						{#if lessonImage}
							<img
								src={lessonImage}
								alt={`${lesson.title} 대표 이미지`}
								class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
							/>

							<!-- 전체 톤 다운 레이어 -->
							<div class="absolute inset-0 bg-slate-950/25"></div>

							<!-- 아래쪽 그라데이션으로 카드와 연결 -->
							<div
								class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/45 via-slate-950/12 to-transparent"
							></div>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-[34px]"
							>
								🤖
							</div>
						{/if}

						<div class="absolute left-3 top-3">
							<div
								class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 font-gmarket text-[18px] font-bold text-blue-600 shadow-sm backdrop-blur"
							>
								{index + 1}
							</div>
						</div>
					</div>

					<div class="flex flex-1 flex-col p-5">
						<div class="flex items-start justify-between gap-3">
							<div
								class="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700"
							>
								{lesson.conceptLabel}
							</div>

							<div class="text-[11px] font-extrabold text-slate-300">
								LESSON {String(index + 1).padStart(2, '0')}
							</div>
						</div>

						<div
							class="mt-4 line-clamp-2 font-gmarket text-[19px] font-bold leading-7 tracking-[-0.055em] text-slate-950"
						>
							{lesson.title}
						</div>

						<p class="mt-2 line-clamp-2 text-[13px] font-bold leading-6 text-slate-500">
							{lesson.task}
						</p>

						<!-- <div
							class="mt-auto pt-4 text-[13px] font-extrabold text-blue-600 transition group-hover:translate-x-1"
						>
							{index + 1}단계 시작하기 →
						</div> -->
					</div>
				</a>
			{/each}
		</section>
	</div>
</div>
