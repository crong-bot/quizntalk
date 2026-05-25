<script>
	import JsonLearningWorkspace from '$lib/components/jsonstudy/JsonLearningWorkspace.svelte';

	export let data;
</script>

<JsonLearningWorkspace
	course={data.course}
	lesson={data.lesson}
	lessonIndex={data.lessonIndex}
	stepNumber={data.stepNumber}
	totalCount={data.totalCount}
/>
