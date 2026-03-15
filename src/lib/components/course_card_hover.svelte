<script>
	export let course_card_number;
	export let course_card_title;
	export let course_card_contents;
	export let course_card_time;
	export let course_card_color;
	export let course_card_url;
	export let course_card_cartegory;
	export let course_card_adress;
	export let course_card_image;
</script>

<a
	href={`/study/local/${course_card_adress}/0`}
	class="group relative block w-full aspect-square max-w-48 mx-auto bg-black rounded-3xl overflow-hidden"
>
	<img
		alt="Developer"
		src={course_card_image}
		class="absolute inset-0 h-full w-full opacity-75 transition-opacity group-hover:opacity-50"
	/>

	<div class="relative p-3">
		<p class="text-[10px] font-medium uppercase tracking-widest text-pink-500">
			{course_card_cartegory}
		</p>

		<p class="text-xl font-bold text-white sm:text-2xl">
			<!-- {course_card_number} -->
			{course_card_title}
		</p>

		<div class="mt-2 sm:mt-8 lg:mt-8">
			<div
				class="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
			>
				<p class="text-sm text-white">
					{course_card_contents}
				</p>
			</div>
		</div>
	</div>
</a>
