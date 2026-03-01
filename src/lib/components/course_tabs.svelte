<script>
	import { createEventDispatcher } from 'svelte';
	export let items;
	export let activeItem;

	const dispatch = createEventDispatcher();
	const select = (id) => dispatch('tabChange', id);
</script>

<div
	class="flex mt-2 gap-2 overflow-x-auto overflow-y-hidden sm:font-gmarket sm:text-sm whitespace-nowrap"
>
	{#each items as item (item.id)}
		<button
			type="button"
			on:click={() => select(item.id)}
			class="px-4 py-2 rounded-2xl text-sm font-bold transition
        {activeItem === item.id
				? 'bg-slate-900 text-white'
				: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}"
		>
			{item.label}
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
		font-weight: 700;
	}
</style>
