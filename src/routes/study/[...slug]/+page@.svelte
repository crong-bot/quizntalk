<script>
	import Sidebar from '$lib/components/chatscreen/view_sidebar.svelte';
	import Modal from '$lib/components/chatscreen/view_modal.svelte';
	import View_button from '$lib/components/chatscreen/view_button.svelte';
	//import View_tool from '$lib/view_tool.svelte';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import ChatBubble from '../../../lib/components/chatscreen/chat_bubble.svelte';
	import Quiz from '../../../lib/components/quizmodule.svelte';

	export let success;
	let htmlchild;
	export let bubbleContainer_channel;
	let chat_direction = true;
	let example = {
    one: 'sdfsdf',
    two: 'twotwo',
    three: 'sdggs',
    four: 'fourfo',
  };

	onMount(() => {
		//slot의 child들을 순회해서 숨기기(chatBubble,module을 시작과 동시에 숨긴다.)
		for (let i of htmlchild.children) {
			i.style.display = 'none';
		}
		console.log(htmlchild.children);
	});

	export let data;
	let bubbleContainer;
</script>

<!-- <h1>{data.post.title}</h1>
<div>{@html data.post.content}</div> -->

<!-- <ul>
	{#each data.post.content as { type, dial, choice, quiztype }, index (index)}
		{#if type == 'chat1'}
			<li>{dial}</li>
		{:else if type == 'chat2'}
			<li>{dial}</li>
		{/if}
	{/each}
</ul> -->

<Toaster />
<!-- main frame-->
<div class="min-h-screen w-1280 flex flex-col m-auto">
	<div class="relative flex flex-grow">
		<main id="mainframe" class="flex-1">
			<div id="view" class="h-full w-full grid grid-cols-12 gap-1">
				<Sidebar />
				<div id="main_content" class="h-full flex-grow flex flex-col rounded-lg col-span-7">
					<!-- 채팅 화면부분 -->
					<div id="chat_box_container" class="relative h-vh85 mx-8 mt-8 bg-white rounded-3xl">
						<div bind:this={htmlchild} id="scrollbar" class="overflow-y-auto h-vh85 pr-1 pl-2 pt-1">
							{#each data.post.content as { type, dial, choice, quiztype }, index (index)}
								{#if type == 'chat1'}
									<ChatBubble {chat_direction}>{dial}</ChatBubble>
								{:else if type == 'chat2'}
									<ChatBubble>{dial}</ChatBubble>
								{:else if type == 'quiz'}
									<Quiz type={'multiple'} question={'다음 중 골라'} example={example}/>
								{:else}
									<svelte:component this={data.components[type]} />
								{/if}
							{/each}
						</div>
					</div>
					<!-- 채팅 화면부분 -->
					<View_button childs={htmlchild} />
				</div>
				<Modal {data}></Modal>
			</div>
		</main>
	</div>
</div>

<!--class="h-hs px-12 py-6 overflow-y-auto"-->

<!--슬롯으로 스타일 전달하려면 글로벌로 지정, 슬릇 이름을 지정하면 특정 슬롯에만 스타일적용가능!중요 -->
<style>
	:global([slot='main']) {
		overflow-y: auto;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 1.5rem;
		/* padding-bottom: 1.5rem; */
		height: 85vh;
	}
	#mainframe {
		background: #f2f2f2;
		background-image: radial-gradient(#d2d6db 2px, transparent 0);
		background-size: 28px 28px;
		background-position: -3px -3px;
	}
</style>
