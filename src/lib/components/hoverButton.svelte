<script>
	export let hoverBtnContent;
</script>

<!-- 
<div
	class="relative rounded w-48 h-16 px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
>
	<span
		class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
	></span>
	<span class="relative">{hoverBtnContent}</span>
</div> -->
<div
	class="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
>
	<span
		class="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"
	></span>
	<span
		class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease"
	>
		<svg
			class="w-5 h-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M14 5l7 7m0 0l-7 7m7-7H3"
			></path></svg
		>
	</span>
	<span class="relative">{hoverBtnContent}</span>
</div>
