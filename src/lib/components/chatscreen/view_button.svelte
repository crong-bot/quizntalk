<script>
	import { goto } from '$app/navigation';
	import { LessonManager } from '$lib/stores/LessonManager.js';
	import toast from 'svelte-french-toast';

	// ✅ 부모에서 내려줘야 함
	export let onNext = () => {}; // "다음 버블/다음 스텝" 실행 함수
	export let locked = false; // 퀴즈/모듈 때문에 막혔는지
	export let lessonKey = ''; // progress key
	export let chapter = 0; // 현재 챕터
	export let totalPages = 9999; // 마지막 챕터 체크용 (부모에서 계산해서 넘겨)

	const getChapterState = (lessonKey, chapter) =>
		$LessonManager?.progress?.[lessonKey]?.[chapter] ?? { success: false, lock: false };

	// ✅ 챕터 이동 (이전/다음)
	const back_action = () => {
		const prev = Math.max(0, chapter - 1);
		goto(`/study/${lessonKey}/${prev}`);
	};

	const foward_action = () => {
		const state = getChapterState(lessonKey, chapter);

		// 현재 챕터가 성공이어야 다음으로 이동
		if (!state.success) {
			toast('먼저 퀴즈를 완료해주세요.', { icon: '🔒', position: 'bottom-center' });
			return;
		}

		// if (chapter >= totalPages) {
		// 	toast('마지막페이지입니다.!!', { icon: '🧱⛔️', position: 'bottom-center' });
		// 	return;
		// }

		goto(`/study/${lessonKey}/${chapter + 1}`);
	};

	$: playDisabled = !!locked; // locked면 "다음" 못 누름
</script>

<div class="flex flex-wrap justify-center gap-3 py-2 mb-2 mt-2">
	<!-- //---Bell button -->
	<button class="learn-more">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				fill-rule="evenodd"
				d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
	<!-- //---Pen button -->
	<button on:click={foward_action} class="learn-more">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
			/>
		</svg>
	</button>
	<!-- 뒤로 -->
	<button type="button" on:click={back_action} class="tooltip tooltip-info" data-tip="이전 챕터">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				d="M21.2069 17.9391L14.1949 13.2587C13.7362 12.9616 13.5069 12.542 13.5069 12C13.5069 11.458 13.7362 11.0384 14.1949 10.7413L21.2069 6.06083C21.7156 5.7304 22.2368 5.7054 22.7705 5.98583C23.3042 6.26627 23.571 6.71555 23.571 7.33368V16.6663C23.571 17.2844 23.3042 17.7337 22.7705 18.0141C22.2368 18.2946 21.7156 18.2696 21.2069 17.9391ZM9.39924 17.9391L2.37314 13.2587C1.92386 12.9616 1.69922 12.542 1.69922 12C1.69922 11.458 1.92386 11.0384 2.37314 10.7413L9.39924 6.06083C9.90794 5.7304 10.4291 5.7054 10.9628 5.98583C11.4965 6.26627 11.7634 6.71555 11.7634 7.33368V16.6663C11.7634 17.2844 11.4965 17.7337 10.9628 18.0141C10.4291 18.2946 9.90794 18.2696 9.39924 17.9391Z"
			/>
		</svg>
	</button>

	<!-- 다음(버블/스텝 진행) -->
	<button
		type="button"
		on:click={onNext}
		disabled={playDisabled}
		class="tooltip tooltip-info disabled:opacity-50 disabled:cursor-not-allowed"
		data-tip={playDisabled ? '퀴즈를 풀어야 다음으로' : '다음 스텝'}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				fill-rule="evenodd"
				d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	<!-- 다음 챕터 -->
	<button type="button" on:click={foward_action} class="tooltip tooltip-info" data-tip="다음 챕터">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path
				d="M2.81727 17.9391C2.30857 18.2696 1.78737 18.2946 1.25367 18.0141C0.719975 17.7337 0.453125 17.2844 0.453125 16.6663V7.33368C0.453125 6.71555 0.719975 6.26627 1.25367 5.98583C1.78737 5.7054 2.30857 5.7304 2.81727 6.06083L9.82925 10.7413C10.288 11.0384 10.5173 11.458 10.5173 12C10.5173 12.542 10.288 12.9616 9.82925 13.2587L2.81727 17.9391ZM14.6249 17.9391C14.1162 18.2696 13.595 18.2946 13.0613 18.0141C12.5276 17.7337 12.2608 17.2844 12.2608 16.6663V7.33368C12.2608 6.71555 12.5276 6.26627 13.0613 5.98583C13.595 5.7054 14.1162 5.7304 14.6249 6.06083L21.651 10.7413C22.1003 11.0384 22.3249 11.458 22.3249 12C22.3249 12.542 22.1003 12.9616 21.651 13.2587L14.6249 17.9391Z"
			/>
		</svg>
	</button>
</div>

<style>
	button {
		padding: 0.75rem; /* 모바일 기본 */
		font-size: 12px;
		letter-spacing: 1px;
		font-weight: 600;
		color: #216dfb;
		background-color: #fff;
		border: none;
		border-radius: 9999px;
		box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		cursor: pointer;
		outline: none;
	}

	@media (min-width: 1024px) {
		button {
			padding: 1.2em 1.2em;
			letter-spacing: 2.5px;
		}
		button:hover:enabled {
			background-color: #216dfb;
			box-shadow: 0px 15px 20px rgba(46, 83, 229, 0.4);
			color: #fff;
			transform: translateY(-7px);
		}
	}

	button:active:enabled {
		transform: translateY(-1px);
	}
</style>
