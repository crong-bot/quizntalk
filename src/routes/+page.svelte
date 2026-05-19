<script>
	import Nav from '$lib/components/nav.svelte';
	import '../app.css';
	import HoverButton from '../lib/components/hoverButton.svelte';

	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authUser';

	function goStart() {
		if ($authUser) goto('/study');
		else goto('/login');
	}
</script>

<Nav />

<div class="flex h-[calc(100vh-124px)] min-h-0 flex-col overflow-hidden">
	<main class="mx-auto flex min-h-0 w-full max-w-[1180px] flex-1 px-4 sm:px-6 lg:px-6">
		<div id="landing_wrapper" class="flex w-full flex-col">
			<section
				class="flex flex-1 flex-col items-center justify-center gap-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-10"
			>
				<!-- Text -->
				<div class="w-full lg:w-[48%] flex flex-col items-start">
					<div
						id="landingtitle"
						class="flex flex-col font-dodum font-extrabold tracking-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
					>
						<!-- <h1>제이 클래스로</h1> -->
						<h1>데이터 미션을</h1>
						<h1 class="pt-3">함께 해결해보세요.</h1>
					</div>

					<div class="mt-6 space-y-1">
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							제이 클래스는 JSON과 데이터 구조를 쉽고 재미있게 배우는 학습 도구입니다.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							학생들은 각자의 단서를 바탕으로 데이터를 완성하고, 협동 미션을 수행합니다.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							학습은 혼자서, 미션은 친구들과 함께 게임 코드로 참여할 수 있습니다.
						</p>
					</div>

					<div class="mt-12 flex flex-wrap items-center gap-3">
						<button type="button" on:click={() => goto('/study')}>
							<HoverButton hoverBtnContent={'학습하기'} />
						</button>

						{#if $authUser}
							<button type="button" on:click={() => goto('/library')}>
								<HoverButton hoverBtnContent={'게임 생성하기'} />
							</button>
						{:else}
							<button type="button" on:click={() => goto('/invite')}>
								<HoverButton hoverBtnContent={'게임 참여하기'} />
							</button>
						{/if}
					</div>
				</div>

				<!-- Image -->
				<div class="w-full lg:w-[48%] flex items-center justify-center lg:justify-end">
					<img
						class="block w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[560px] h-auto object-contain"
						src="/landing1.webp"
						alt="landing"
						width="704"
						height="555"
						loading="lazy"
					/>
				</div>
			</section>
		</div>
	</main>

	<footer
		class="mt-auto border-t border-slate-200/80 bg-white/70 px-4 py-5 text-slate-500 backdrop-blur"
	>
		<div
			class="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-3 sm:flex-row"
		>
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-white"
				>
					J
				</div>

				<div class="text-sm font-extrabold text-slate-700">제이미션</div>

				<div class="hidden h-4 w-px bg-slate-200 sm:block"></div>

				<p class="text-xs font-bold text-slate-400">데이터를 배우고 친구들과 미션을 해결해요.</p>
			</div>

			<div class="flex items-center gap-3 text-xs font-bold text-slate-400">
				<button type="button" class="transition hover:text-slate-700">학습</button>
				<span class="h-3 w-px bg-slate-200"></span>
				<button type="button" class="transition hover:text-slate-700">게임 참여</button>
				<span class="h-3 w-px bg-slate-200"></span>
				<button type="button" class="transition hover:text-slate-700">교사용</button>
			</div>
		</div>
	</footer>
</div>
