<script>
	// import Coursecard from '$lib/course_card.svelte';
	import Ai1 from '$lib/pages/ai_lv1.svelte';
	// import Ai2 from '$lib/ui/course_info/ai_lv2.svelte';
	// import Sw1 from '$lib/ui/course_info/sw_lv1.svelte';
	// import Sw2 from '$lib/ui/course_info/sw_lv2.svelte';
	import CourseTabs from '$lib/components/course_tabs.svelte';
	import '../../app.css';
	import Nav from '$lib/components/nav.svelte';

	const items = ['AI 교육', '소프트웨어 교육', '수학', '국어'];
	let activeItem = 'AI 교육';
	const tabChange = (e) => {
		activeItem = e.detail;
	};
	export let data;
	console.log(data);
</script>

<!-- 
<h1>blog</h1>

<ul>
	{#each data.summaries as { slug, title }}
		<li><a href="/study/{slug}">{title}</a></li>
	{/each}
</ul> -->

<div class="w-1280 m-auto">
	<!-- <div class="min-h-screen flex flex-col"> -->
	<Nav />
	<!-- <div class="relative flex flex-grow "> -->
	<main class="">
		<div class="container flex flex-col items-start pt-14 pl-12 pr-4">
			<div class="flex flex-row">
				<h1 class="font-gmarket text-4xl font-bold mt-2 mr-8">학습 코스</h1>
				<div class="flex flex-col item-center">
					<CourseTabs {items} {activeItem} on:tabChange={tabChange} />
				</div>
			</div>

			{#if activeItem == 'AI 교육'}
				<Ai1 {data} />
			{:else if activeItem == '소프트웨어 교육'}
				<Ai1 {data} />
			{:else if activeItem == '수학'}
				<Ai1 {data} />
			{:else if activeItem == '국어'}
				<Ai1 {data} />
			{/if}
		</div>
	</main>
	<!-- </div> -->
	<!-- </div> -->
</div>
