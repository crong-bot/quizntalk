<script>
	import IndividualWriteWorkspace from '$lib/components/individual/IndividualWriteWorkspace.svelte';
	import {
		getLocalParticipantId,
		getLocalParticipantName
	} from '$lib/firebase/missionRoom/missionRoomService';
	import { createMissionRoomStore } from '$lib/firebase/missionRoom/missionRoomStore';
	import { onDestroy, onMount } from 'svelte';

	export let data;

	const missionRoomStore = createMissionRoomStore();

	let participantId = '';
	let participantName = '';

	$: currentRoom = $missionRoomStore.room ?? data.room;
	$: participants = $missionRoomStore.participants;

	onMount(() => {
		participantId = getLocalParticipantId(data.code);
		participantName = getLocalParticipantName(data.code);

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
	<IndividualWriteWorkspace
		roomCode={data.code}
		lessonId={data.lessonId}
		roomId={data.roomId}
		lesson={data.lesson}
		room={currentRoom}
		participants={participants}
		{participantId}
		{participantName}
	/>
{/if}