<script>
	import { createEventDispatcher } from 'svelte';
	export let items;
	export let activeItem;

	const dispatch = createEventDispatcher();
</script>

<div
	class="flex mt-2 overflow-x-auto overflow-y-hidden border-b sm:font-gmarket sm:font-thin sm:text-sm border-gray-200 whitespace-nowrap dark:border-gray-700"
>
	{#each items as item}
		<button
			on:click={() => dispatch('tabChange', item)}
			class:active={item === activeItem}
			class="inline-flex items-center font-gmarket font-medium text-zinc-400 h-10 px-4 -mb-px text-center bg-transparent border-b-4 sm:font-thin dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none"
		>
			{item}
		</button>
	{/each}

	<!-- <li
    style="active:none;"
      class="inline-flex items-center text-bold h-10 px-4 -mb-px text-center text-gray-700 bg-transparent border-b-2 border-transparent dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
    >
      소프트웨어 중급 과정
    </li>
  
    <li
      class="inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
    >
      AI 초급 과정
    </li>
    <li
      class="inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent  dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
    >
      AI 중급 과정
    </li>
     text-blue-600
      border-blue-500
   -->
</div>

<style>
	.active {
		color: #6a92fb;
		border-color: #6a92fb;
	}
</style>
