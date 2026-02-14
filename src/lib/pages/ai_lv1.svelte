<script>
	// import Coursecard from '$lib/ui/course_card.svelte';
	// import CardShadow from '../card_shadow.svelte';
	// import Coc from '$lib/course_card.svelte';
	import CourseCardHover from '$lib/components/course_card_hover.svelte';
	//import Content from '$lib/data/lecture_info.json';
	import { posts } from '../../routes/study/data';

	export let data;
</script>

<div class="mt-14 mb-7">
	<div id="course_line1" class="flex flex-col mr-3">
		<div class="bg-white mb-2 font-gmarket font-bold text-xl pl-4">
			<p class="text-blue-400">인식</p>
			<!-- <p>AI의 눈, 귀, 언어능력</p> -->
			<p>AI는 사람이 아닌데 어떻게 보고 듣고 이해할까?</p>
		</div>
	</div>
	<div class="grid grid-cols-5 gap-6">
		{#each data.posts as c, i}
			<CourseCardHover
				course_card_cartegory={c.category}
				course_card_adress={c.slug}
				course_card_url={c.url}
				course_card_color={'#ffffff'}
				course_card_number={`${i + 1}.`}
				course_card_title={c.title}
				course_card_contents={c.detail}
				course_card_time={'2개/10분'}
				course_card_image={c.image}
			></CourseCardHover>
		{/each}
	</div>
</div>

<div class="my-14">
	<div id="course_line1" class="flex flex-col mr-3">
		<div class="bg-white mb-2 font-gmarket font-bold text-xl pl-4">
			<p class="text-blue-400">행동</p>
			<p>AI는 어떻게 행동할까요??</p>
		</div>
	</div>
	<div class="grid grid-cols-5 gap-4">
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
	</div>
</div>

<div class="my-14">
	<div id="course_line1" class="flex flex-col mr-3">
		<div class="bg-white mb-2 font-gmarket font-bold text-xl pl-4">
			<p class="text-blue-400">영향</p>
			<p>AI의 좋은 점과 나쁜 점</p>
		</div>
	</div>
	<div class="grid grid-cols-5 gap-4">
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
		<CourseCardHover
			course_card_cartegory={'ai'}
			course_card_url={'lesson_cognitive'}
			course_card_color={'#ffffff'}
			course_card_number={'1.'}
			course_card_title={'인공지능의 인식'}
			course_card_contents={'인공지능은 어떻게 사물을 보고, 소리를 듣고, 글자를 이해할까요?'}
			course_card_time={'2개/10분'}
			course_card_image={'/heart.png'}
		></CourseCardHover>
	</div>
</div>
