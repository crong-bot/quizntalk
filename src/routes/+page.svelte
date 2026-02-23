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

<!-- ✅ 고정폭(w-1280) 제거: 반응형 컨테이너 -->
<div class="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
	<main>
		<div id="landing_wrapper" class="flex flex-col">
			<!-- ===================== 1st HERO ===================== -->
			<section
				class="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 py-16 lg:py-0"
			>
				<!-- Text -->
				<div class="w-full lg:w-1/2 flex flex-col justify-center items-start">
					<div
						id="landingtitle"
						class="flex flex-col font-dodum font-extrabold tracking-normal
                   text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
					>
						<h1>QuizNTalk으로</h1>
						<h1>인공지능의 원리를</h1>
						<h1 class="pt-3">쉽게 배워보세요.</h1>
					</div>

					<div class="mt-8 sm:mt-10 space-y-1">
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							QuizNTalk는 채팅인터페이스에 익숙한 학생들을 위한 교육도구입니다.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							AI 및 소프트웨어뿐만 아니라 다양한 분야를 배울 수 있습니다.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							QuizNTalk로 통해 인공지능의 원리를 파악해보세요.
						</p>
					</div>

					<div class="mt-8">
						{#if $authUser}
							<button type="button" on:click={() => goto('/study')}>
								<HoverButton hoverBtnContent={'AI 학습하기'} />
							</button>
						{:else}
							<button type="button" on:click={() => goto('/login')}>
								<HoverButton hoverBtnContent={'로그인'} />
							</button>
						{/if}
					</div>
				</div>

				<!-- Image -->
				<div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
					<img
						class="w-full max-w-[560px] sm:max-w-[640px] lg:max-w-[704px] h-auto object-contain"
						src="/landing1.webp"
						alt="landing"
						width="704"
						height="555"
						loading="lazy"
					/>
				</div>
			</section>

			<!-- ===================== 2nd HERO ===================== -->
			<section
				class="min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-14 py-16 lg:py-0"
			>
				<!-- Image -->
				<div class="w-full lg:w-1/2 flex justify-center lg:justify-start">
					<img
						class="w-full max-w-[600px] sm:max-w-[760px] lg:max-w-[901px] h-auto object-contain"
						src="/landing2.webp"
						alt="landing"
						width="901"
						height="796"
						loading="lazy"
					/>
				</div>

				<!-- Text -->
				<div class="w-full lg:w-1/2 flex flex-col justify-center items-start">
					<div
						class="flex flex-col font-dodum font-extrabold tracking-normal
                   text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
					>
						<h1>자신만의</h1>
						<h1>수업을 만들어</h1>
						<h1 class="pt-4">공유할 수 있습니다.</h1>
					</div>

					<div class="mt-8 sm:mt-10 space-y-1">
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							채팅방식의 다이얼로그를 작성해서.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							사진과 동영상을 첨부할 수 있습니다.
						</p>
						<p class="font-dodum font-normal text-sm sm:text-base leading-6 sm:leading-7">
							STEP.AI에 자신의 수업을 만들어서 공유하세요.
						</p>
					</div>

					<div class="mt-8 flex items-center gap-4">
						{#if $authUser}
							<button type="button" on:click={() => goto('/library')}>
								<HoverButton hoverBtnContent={'내 수업실'} />
							</button>
						{:else}
							<button type="button" on:click={() => goto('/login')}>
								<HoverButton hoverBtnContent={'시작하기'} />
							</button>
						{/if}
					</div>
				</div>
			</section>

			<div class="h-16 sm:h-24" />

			<!-- ===================== Footer ===================== -->
			<footer class="items-center p-4 footer bg-neutral text-neutral-content">
				<div class="items-center grid-flow-col">
					<svg
						width="36"
						height="36"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						fill-rule="evenodd"
						clip-rule="evenodd"
						class="fill-current"
					>
						<path
							d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
						/>
					</svg>
					<p>Copyright © 2021 - All right reserved</p>
				</div>

				<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
					<!-- a 태그 href 없어서 경고 뜨니 버튼/링크 둘 중 하나로 -->
					<button type="button" aria-label="twitter" class="opacity-80 hover:opacity-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
							/>
						</svg>
					</button>

					<button type="button" aria-label="youtube" class="opacity-80 hover:opacity-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
							/>
						</svg>
					</button>

					<button type="button" aria-label="facebook" class="opacity-80 hover:opacity-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							class="fill-current"
						>
							<path
								d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
							/>
						</svg>
					</button>
				</div>
			</footer>
		</div>
	</main>
</div>
