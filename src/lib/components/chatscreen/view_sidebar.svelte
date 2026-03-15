<script>
	export let current_chapterlist = [];
</script>

<div class="bg-white h-full pl-4 min-w-0">
	<!-- view layout title -->
	<div class="flex flex-row items-center justify-between pt-10 pb-10">
		<a href="/">
			<img class="object-contain max-w-[140px] h-12" src="/logo.png" alt="logo" />
		</a>
	</div>
	<!-- view layout menu dropdown -->

	<!-- <div class="text-4xl font-bold">
      <p class="font-gmarket text-2xl font-light">👋 Hello!!</p>
    </div> -->
	<!-- <div class="text-2xl font-bold mt-5 ml-6">MENU</div> -->
	<!-- 여기 부터 메뉴들-->
	<div
		class="md:ml-auto md:mr-auto flex flex-col space-y-4 mt-2 font-gmarket font-medium text-xs pl-4 text-titletext"
	>
		<a href="/" class="flex flex-row item-center space-x-3 leading-loose"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-home"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="#5d5d5d"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<polyline points="5 12 3 12 12 3 21 12 19 12" />
				<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
				<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
			</svg>

			<p>홈!!</p>
		</a>
		<a href="/study" class="flex flex-row items-center space-x-3 leading-loose"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-ai"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M8 16v-6a2 2 0 1 1 4 0v6"
				/><path d="M8 13h4" /><path d="M16 8v8" /></svg
			>
			<p>AI학습</p>
		</a>
		<a href="/study" class="flex flex-row items-center space-x-3 leading-loose"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-device-laptop"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="#5d5d5d"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<line x1="3" y1="19" x2="21" y2="19" />
				<rect x="5" y="6" width="14" height="10" rx="1" />
			</svg>
			<p>내 수업실</p>
		</a>
		<a href="/qa" class="flex flex-row items-center space-x-3 leading-loose"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon icon-tabler icons-tabler-outline icon-tabler-chalkboard-teacher"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M8 19h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v11a1 1 0 0 1 -1 1"
				/><path d="M12 14a2 2 0 1 0 4.001 -.001a2 2 0 0 0 -4.001 .001" /><path
					d="M17 19a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -2 2"
				/></svg
			>
			<p>강의실</p>
		</a>
	</div>

	<div class="relative flex py-10 pr-12 pl-2 items-center">
		<div class="flex-grow border-t border-gray-300" />
		<!-- <span class="flex-shrink mx-4 text-gray-400">Content</span> -->
		<div class="flex-grow border-t border-gray-300" />
	</div>

	<div class="rounded-3xl bg-stone-200 mr-8 h-1/2" />
	<!--
     {#each current_chapterlist as aa}
    <div>{aa}</div>
  {/each}
  -->
</div>

<style>
	#classMenu :hover {
		background-color: aqua;
	}
</style>
