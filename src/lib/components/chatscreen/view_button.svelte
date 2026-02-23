<script>
	import { goto } from '$app/navigation';
	import { LessonManager } from '$lib/stores/LessonManager.js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let next_url;
	let chatNum = 0; // 지금까지 몇 번째 버블을 보여줬는지 (childs.children 인덱스)

	let afterBubble = false; // “지금 block(퀴즈/모듈) 이후라서 진행이 막힌 상태인가?”
	let loading = true;
	//props
	export let childs; // 스크롤 가능한 채팅 컨테이너 DOM (bind:this={htmlchild})
	export let lessonKey; // progress에서 레슨을 식별하는 키 (예: "ai/cognitive/1")
	export let chapter = 0; // 현재 페이지(챕터) 번호

	onMount(() => {});
	const getChapterState = (lessonKey, chapter) =>
		$LessonManager?.progress?.[lessonKey]?.[chapter] ?? { success: false, lock: false };

	const setChapterState = (lessonKey, chapter, patch) => {
		LessonManager.update((s) => {
			s.progress ??= {};
			s.progress[lessonKey] ??= {};
			s.progress[lessonKey][chapter] = {
				...(s.progress[lessonKey][chapter] ?? { success: false, lock: false }),
				...patch
			};
			return s;
		});
	};
	// chat bubble 받아옴. 순회해서 보이게 했다가 안보이게 했다가.
	const getBubbles = () => {
		if (chatNum > childs.children.length - 1) return;

		const state = getChapterState(lessonKey, chapter);

		// // 모듈(또는 퀴즈) 이후면 success가 true 될 때까지 멈춤
		if (afterBubble && state.success === false) return;
		if (afterBubble && state.success === true) afterBubble = false;

		// bubble 보여주기
		childs.children[chatNum].style.display = '';

		const el = childs.children[chatNum];
		const shouldBlock = el?.dataset?.block === 'true';

		if (shouldBlock) {
			setChapterState(lessonKey, chapter, { lock: true, success: false });
			afterBubble = true;
		}

		childs.scrollTo(0, childs.scrollHeight - childs.clientHeight);
		chatNum++;
	};

	// const getBubbles = () => {
	// 	if (chatNum > childs.children.length - 1) {
	// 		return;
	// 	}
	// 	let num, path, lessonname, totalpages;
	// 	[num, path, lessonname] = get_location();
	// 	//after bubble = true 정답 false 면 리턴
	// 	// after bubble =true 정답 true 면 afterBubble=false
	// 	if (afterBubble == true && $LessonManager[lessonname][num]['success'] == false) {
	// 		return;
	// 	} else if (afterBubble == true && $LessonManager[lessonname][num]['success'] == true) {
	// 		afterBubble = false;
	// 	}
	// 	//bubble 화면에 보이게 하기
	// 	childs.children[chatNum].style.display = '';

	// 	//Bubble이 모듈이면 다음으로 넘어가지 않게 버튼 락해주는 코드
	// 	//console.log(childs.children[chatNum].id);
	// 	if (childs.children[chatNum].id != 'bubble') {
	// 		$LessonManager[lessonname][num]['lock'] = true;
	// 		afterBubble = true;
	// 		//childs.children[chatNum].style.display = "";
	// 	}
	// 	childs.scrollTo(0, childs.scrollHeight - childs.clientHeight);
	// 	//checkSuccess();
	// 	chatNum++;
	// };

	//function for get presen page and path
	// const get_location = () => {
	// 	let currentnum, currentpath, currentlesson;
	// 	let a = window.location.pathname;
	// 	currentnum = a.slice(-1); // a=>"/study/lessonname/num"
	// 	currentnum = Number(currentnum); // num
	// 	currentpath = a.slice(0, -1); // "/study/lessonname/num"
	// 	currentlesson = a.split('/').slice(-2, -1)[0]; // lessonname
	// 	return [currentnum, currentpath, currentlesson];
	// };

	//정답일 경우 락을 해제한다.

	const get_location = () => {
		const parts = window.location.pathname.split('/').filter(Boolean);
		// 예: ["study","lesson_rgb","12"]
		const currentnum = Number(parts.at(-1));
		const currentlesson = parts.at(-2);
		const currentpath = '/' + parts.slice(0, -1).join('/') + '/'; // "/study/lesson_rgb/"
		return [currentnum, currentpath, currentlesson];
	};

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

		// 마지막 챕터면 종료 토스트
		if (chapter >= totalPages) {
			toast('마지막페이지입니다.!!', { icon: '🧱⛔️', position: 'bottom-center' });
			return;
		}

		goto(`/study/${lessonKey}/${chapter + 1}`);
	};

	// const foward_action = () => {
	// 	let pagenum, path, lessonname, totalpages;
	// 	[pagenum, path, lessonname] = get_location();

	// 	// 다음 페이지로 가려면 현재 레슨번호에 1씩 더해줘야 되니까 따로 nownum으로 저장
	// 	let nextpage = pagenum + 1;

	// 	next_url = path + nextpage;
	// 	totalpages = Object.keys($LessonManager[lessonname]).length;
	// 	//총페이지의 수를 totalpages에 받아온 다음 그 페이지 넘지 않으면 다음페이지로 넘김

	// 	if ($LessonManager[lessonname][pagenum]['success'] == true && totalpages > pagenum) {
	// 		goto(`${next_url}`);
	// 	} else if (totalpages <= pagenum) {
	// 		loading = false;
	// 		//console.log("마지막페이지입니다.!!");
	// 		toast('마지막페이지입니다.!!', {
	// 			icon: '🧱⛔️',
	// 			style:
	// 				'font-family: Dodum; font-size:20px; border-radius: 200px; background: #333; color: #fff;',
	// 			position: 'bottom-center'
	// 		});
	// 	}
	// };
</script>

<!-- 이렇게 히든으로 하지 않으면 페이지를 바꿀때마다 잠깐씩 보임. -->
<!-- <div hidden={loading}>
  <Toaster />
</div> -->
<!-- <Toaster /> -->

<div class="flex flex-wrap justify-center gap-3 py-2 mb-2 mt-2">
	<!-- //---rewind button -->

	<button>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				d="M21.2069 17.9391L14.1949 13.2587C13.7362 12.9616 13.5069 12.542 13.5069 12C13.5069 11.458 13.7362 11.0384 14.1949 10.7413L21.2069 6.06083C21.7156 5.7304 22.2368 5.7054 22.7705 5.98583C23.3042 6.26627 23.571 6.71555 23.571 7.33368V16.6663C23.571 17.2844 23.3042 17.7337 22.7705 18.0141C22.2368 18.2946 21.7156 18.2696 21.2069 17.9391ZM9.39924 17.9391L2.37314 13.2587C1.92386 12.9616 1.69922 12.542 1.69922 12C1.69922 11.458 1.92386 11.0384 2.37314 10.7413L9.39924 6.06083C9.90794 5.7304 10.4291 5.7054 10.9628 5.98583C11.4965 6.26627 11.7634 6.71555 11.7634 7.33368V16.6663C11.7634 17.2844 11.4965 17.7337 10.9628 18.0141C10.4291 18.2946 9.90794 18.2696 9.39924 17.9391Z"
			/>
		</svg>
	</button>
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
	<!-- //---Play button -->
	<button on:click={getBubbles}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
			<path
				fill-rule="evenodd"
				d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
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
	<!-- //---fastFoward button -->

	<button on:click={foward_action} class="tooltip tooltip-info" data-tip="다음 챕터">
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
		button:hover {
			background-color: #216dfb;
			box-shadow: 0px 15px 20px rgba(46, 83, 229, 0.4);
			color: #fff;
			transform: translateY(-7px);
		}
	}

	button:active {
		transform: translateY(-1px);
	}
	/* :global(.tooltip) {
    white-space: nowrap;
    position: relative;
    padding-top: 0.35rem;
    cursor: zoom-in;
    border-bottom: 1px solid currentColor;
  } */

	/* :global(.tooltip::after) {
    margin: 0 0.15rem 0 0.25rem;
    content: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="-50 -50 100 100"%3E%3Cg fill="none" stroke="hsl(0, 0%25, 30%25)" stroke-linecap="round"%3E%3Cpath stroke-width="8" d="M -13 -13 m 0 -10 v 20 m 10 -10 h -20" /%3E%3Cg stroke-width="14"%3E%3Ccircle r="30" cx="-13" cy="-13" /%3E%3Cpath d="M 24 24 l 18 18" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  } */

	:global(#tooltip) {
		position: absolute;
		bottom: 100%;
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: hsl(0, 0%, 20%);
		color: hsl(0, 0%, 98%);
		font-size: 0.95em;
		border-radius: 0.25rem;
		filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
		width: max-content;
	}

	/* :global(.tooltip:not(:focus) #tooltip::before) {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0.6em;
    height: 0.25em;
    background: inherit;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  } */
</style>
