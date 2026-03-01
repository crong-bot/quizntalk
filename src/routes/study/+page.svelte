<script>
	import CourseCardHover from '$lib/components/course_card_hover.svelte';
	import CourseTabs from '$lib/components/course_tabs.svelte';
	import Nav from '$lib/components/nav.svelte';
	import '../../app.css';

	export let data;

	// ✅ 탭: id 기반
	const items = [
		{ id: 'ai', label: '1. AI의 원리' },
		{ id: 'data', label: '2. AI와 데이터' },
		{ id: 'apply', label: '3. AI의 활용' },
		{ id: 'ethics', label: '4. AI 윤리' },
		{ id: 'project', label: '5. 프로젝트 만들기' }
	];

	let activeItem = 'ai';
	const tabChange = (e) => (activeItem = e.detail);

	// ✅ 현재 탭/섹션 자동 선택
	$: activeTab = data.lecture.tabs.find((t) => t.id === activeItem);
	$: sections = activeTab?.sections ?? [];
</script>

<div class="w-1280 m-auto">
	<Nav />

	<main>
		<div class="container flex flex-col items-start pt-14 pl-12 pr-4">
			<div class="flex flex-row">
				<h1 class="font-gmarket text-4xl font-bold mt-2 mr-8">🏆 AI 레벨업 챌린지</h1>
				<div class="flex flex-col item-center">
					<CourseTabs {items} {activeItem} on:tabChange={tabChange} />
				</div>
			</div>

			{#if sections.length === 0}
				<div class="mt-10 text-slate-500">아직 준비 중인 탭입니다.</div>
			{:else}
				{#each sections as section (section.id)}
					<div class="mt-7 w-full">
						<div class="bg-white mb-3 font-gmarket font-bold text-xl pl-4 py-3 rounded-2xl">
							<p class="text-blue-400">{section.title}</p>
							<p class="text-slate-700 font-medium">{section.subtitle}</p>
						</div>

						<div class="grid grid-cols-5 gap-6">
							{#each section.courses as c, i (c.course)}
								<CourseCardHover
									course_card_cartegory={activeTab?.title ?? 'Course'}
									course_card_adress={c.course}
									course_card_color={'#ffffff'}
									course_card_number={`${i + 1}.`}
									course_card_title={c.title}
									course_card_contents={c.summary}
									course_card_time={c.info}
									course_card_image={'/heart.png'}
								/>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</main>
</div>
