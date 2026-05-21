<!-- C:\quizntalk\src\routes\invite\[code]\+page.svelte -->
<script>
	import JsonMissionWorkspace from '$lib/components/workplace/JsonMissionWorkspace.svelte';
	import { getCourseByThemeId } from '$lib/components/workplace/theme/courseRegistry';
	import { getLocalParticipantId } from '$lib/firebase/missionRoom/missionRoomService';
	import { createMissionRoomStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { onDestroy, onMount } from 'svelte';

	export let data;
	$: currentRoom = $missionRoomStore.room ?? data.room;
	$: course = getCourseByThemeId(currentRoom?.themeId ?? data.lesson?.themeId);

	const missionRoomStore = createMissionRoomStore();

	let participantId = '';

	// $: if (data?.code) {
	// 	participantId = getLocalParticipantId(data.code);
	// }

	onMount(() => {
		participantId = getLocalParticipantId(data.code);

		missionRoomStore.start({
			lessonId: data.lessonId,
			roomId: data.roomId,
			initialRoom: data.room
		});
	});

	onDestroy(() => {
		missionRoomStore.stop();
	});
</script>

{#if $missionRoomStore.errorMessage}
	<div class="p-6 text-sm font-bold text-rose-600">
		{$missionRoomStore.errorMessage}
	</div>
{:else}
	<JsonMissionWorkspace
		roomCode={data.code}
		lessonId={data.lessonId}
		roomId={data.roomId}
		lesson={data.lesson}
		room={currentRoom}
		participants={$missionRoomStore.participants}
		{participantId}
		{course}
	/>
{/if}
