<script>
	import { goto } from '$app/navigation';
	import {
		formatJsonText,
		validateJsonLearningAnswer
	} from '$lib/components/jsonstudy/jsonLearningValidator.js';
	import JsonCodeMirrorEditor from '$lib/components/workplace/JsonCodeMirrorEditor.svelte';
	import { tick } from 'svelte';
	export let course;
	export let lesson;
	export let lessonIndex = 0;
	export let stepNumber = 1;
	export let totalCount = 1;

	let jsonText = lesson.initialCode ?? '';
	let resultMessage = '';
	let resultType = 'ready';
	let showHint = false;
	let isMenuOpen = false;

	let isQuizOpen = false;
	let selectedQuizAnswer = '';
	let quizMessage = '';
	let clearedVersion = 0;

	let leftContentScrollEl;
	let introRightScrollEl;

	$: progressPercent = Math.round((stepNumber / totalCount) * 100);
	$: storageKey = `json_learning_progress_${course.slug}`;

	$: currentLessonCleared = getCurrentLessonCleared(clearedVersion, lesson?.id, storageKey);

	let imageModal = {
		open: false,
		src: '',
		title: '',
		description: ''
	};
	let showFinalSuccessModal = false;

	$: isLastStep = stepNumber >= totalCount;

	function getSavedProgress() {
		if (typeof localStorage === 'undefined') {
			return {
				currentStep: stepNumber,
				clearedLessonIds: [],
				codeByLessonId: {},
				initialCodeByLessonId: {}
			};
		}

		try {
			return JSON.parse(localStorage.getItem(storageKey) ?? '{}');
		} catch {
			return {
				currentStep: stepNumber,
				clearedLessonIds: [],
				codeByLessonId: {},
				initialCodeByLessonId: {}
			};
		}
	}

	function isAllLessonsCleared() {
		const progress = getSavedProgress();
		const clearedLessonIds = progress.clearedLessonIds ?? [];

		// 실제 정답 검사를 하는 단계만 완료 조건에 포함
		const clearableLessons = course.lessons.filter((item) => item.type !== 'intro' && item.answer);

		return (
			clearableLessons.length > 0 &&
			clearableLessons.every((item) => clearedLessonIds.includes(item.id))
		);
	}

	function openFinalSuccessIfCompleted() {
		if (isAllLessonsCleared()) {
			showFinalSuccessModal = true;
		}
	}

	function openImageModal({ src, title = '이미지 보기', description = '' }) {
		imageModal = {
			open: true,
			src,
			title,
			description
		};
	}

	function closeImageModal() {
		imageModal = {
			open: false,
			src: '',
			title: '',
			description: ''
		};
	}

	function getTextToneClass(tone) {
		if (tone === 'blue') return 'font-black text-blue-600';
		if (tone === 'purple') return 'font-black text-violet-600';
		if (tone === 'amber') return 'font-black text-amber-600';
		if (tone === 'emerald') return 'font-black text-emerald-600';
		if (tone === 'rose') return 'font-black text-rose-600';
		if (tone === 'green') return 'font-black text-green-600';

		return 'text-slate-600';
	}

	function loadSavedCode() {
		if (lesson.type === 'intro') {
			jsonText = '';
			return;
		}

		jsonText = lesson.initialCode ?? '';

		if (typeof localStorage === 'undefined') return;

		try {
			const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');

			const savedCode = saved.codeByLessonId?.[lesson.id];
			const savedInitialCode = saved.initialCodeByLessonId?.[lesson.id];

			// 레슨 파일의 initialCode가 바뀌었으면 예전 저장 코드는 버림
			if (savedCode && savedInitialCode === lesson.initialCode) {
				jsonText = savedCode;
			}
		} catch {
			// 저장값이 잘못되었으면 초기 코드 사용
		}
	}
	let activeLessonId = '';

	$: if (lesson?.id && lesson.id !== activeLessonId) {
		activeLessonId = lesson.id;

		resultMessage = '';
		resultType = 'ready';
		showHint = false;
		selectedQuizAnswer = '';
		quizMessage = '';
		isQuizOpen = false;

		loadSavedCode();
		resetLessonScroll();
	}

	async function resetLessonScroll() {
		await tick();

		leftContentScrollEl?.scrollTo({
			top: 0,
			behavior: 'auto'
		});

		introRightScrollEl?.scrollTo({
			top: 0,
			behavior: 'auto'
		});
	}

	function saveProgress() {
		if (typeof localStorage === 'undefined') return;

		let progress = {
			currentStep: stepNumber,
			clearedLessonIds: [],
			codeByLessonId: {},
			initialCodeByLessonId: {}
		};

		try {
			const saved = localStorage.getItem(storageKey);

			if (saved) {
				progress = {
					...progress,
					...JSON.parse(saved)
				};
			}
		} catch {
			// 무시
		}

		progress.currentStep = stepNumber;

		if (lesson.type !== 'intro') {
			progress.codeByLessonId = {
				...(progress.codeByLessonId ?? {}),
				[lesson.id]: jsonText
			};

			progress.initialCodeByLessonId = {
				...(progress.initialCodeByLessonId ?? {}),
				[lesson.id]: lesson.initialCode ?? ''
			};
		}

		localStorage.setItem(storageKey, JSON.stringify(progress));
	}
	function markCleared() {
		if (typeof localStorage === 'undefined') return;

		let progress = {
			currentStep: stepNumber,
			clearedLessonIds: [],
			codeByLessonId: {},
			initialCodeByLessonId: {}
		};

		try {
			const saved = localStorage.getItem(storageKey);

			if (saved) {
				progress = {
					...progress,
					...JSON.parse(saved)
				};
			}
		} catch {
			// 무시
		}

		const cleared = new Set(progress.clearedLessonIds ?? []);
		cleared.add(lesson.id);

		progress.currentStep = stepNumber;
		progress.clearedLessonIds = Array.from(cleared);

		if (lesson.type !== 'intro') {
			progress.codeByLessonId = {
				...(progress.codeByLessonId ?? {}),
				[lesson.id]: jsonText
			};

			progress.initialCodeByLessonId = {
				...(progress.initialCodeByLessonId ?? {}),
				[lesson.id]: lesson.initialCode ?? ''
			};
		}

		localStorage.setItem(storageKey, JSON.stringify(progress));
		clearedVersion += 1;
	}
	function isLessonCleared(item) {
		if (typeof localStorage === 'undefined') return false;

		try {
			const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
			return saved.clearedLessonIds?.includes(item.id) ?? false;
		} catch {
			return false;
		}
	}

	function checkAnswer() {
		if (lesson.type === 'intro') {
			openQuiz();
			return;
		}

		const result = validateJsonLearningAnswer({
			jsonText,
			lesson
		});

		resultMessage = result.message;
		resultType = result.ok ? 'success' : 'error';

		if (result.ok) {
			markCleared();

			if (isAllLessonsCleared()) {
				showFinalSuccessModal = true;
			}
		} else {
			saveProgress();
		}
	}
	function formatCode() {
		const result = formatJsonText(jsonText);

		resultMessage = result.message;
		resultType = result.ok ? 'info' : 'error';

		if (result.ok) {
			jsonText = result.text;
			saveProgress();
		}
	}

	function resetLesson() {
		jsonText = lesson.initialCode ?? '';
		resultMessage = '';
		resultType = 'ready';
		showHint = false;
		saveProgress();
	}

	function goStep(nextStep) {
		if (nextStep < 1 || nextStep > totalCount) return;

		saveProgress();
		goto(`/lesson/${course.slug}/${nextStep}`);
	}

	function goNext() {
		if (isLastStep) {
			if (isAllLessonsCleared()) {
				showFinalSuccessModal = true;
				return;
			}

			if (currentLessonCleared) {
				resultMessage =
					'아직 완료하지 않은 이전 단계가 있어요. 목차에서 완료 표시를 확인해 주세요.';
				resultType = 'error';
				return;
			}

			resultMessage = '마지막 단계예요. 이 단계를 성공하면 모든 학습이 완료돼요.';
			resultType = 'info';
			return;
		}

		if (lesson.type === 'intro' && !currentLessonCleared) {
			openQuiz();
			return;
		}

		if (!currentLessonCleared) {
			resultMessage = '이번 단계를 먼저 성공해야 다음 단계로 갈 수 있어요.';
			resultType = 'error';
			return;
		}

		goStep(stepNumber + 1);
	}

	function goPrev() {
		goStep(stepNumber - 1);
	}

	function goHome() {
		saveProgress();
		goto('/');
	}

	function getResultClass(type) {
		if (type === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
		if (type === 'error') return 'border-rose-200 bg-rose-50 text-rose-700';
		if (type === 'info') return 'border-blue-200 bg-blue-50 text-blue-700';

		return 'border-slate-200 bg-slate-50 text-slate-500';
	}

	function getCurrentLessonCleared(_version, lessonId, key) {
		if (typeof localStorage === 'undefined') return false;
		if (!lessonId || !key) return false;

		try {
			const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
			return saved.clearedLessonIds?.includes(lessonId) ?? false;
		} catch {
			return false;
		}
	}
	function openQuiz() {
		selectedQuizAnswer = '';
		quizMessage = '';
		isQuizOpen = true;
	}

	function closeQuiz() {
		isQuizOpen = false;
		selectedQuizAnswer = '';
		quizMessage = '';
	}

	function submitQuiz() {
		if (!lesson.quiz) return;

		if (!selectedQuizAnswer) {
			quizMessage = '답을 하나 골라주세요.';
			return;
		}

		if (selectedQuizAnswer !== lesson.quiz.answerId) {
			quizMessage = lesson.quiz.failMessage ?? '다시 생각해보세요.';
			return;
		}

		quizMessage = lesson.quiz.successMessage ?? '정답이에요!';
		markCleared();

		setTimeout(() => {
			closeQuiz();
			goStep(stepNumber + 1);
		}, 500);
	}
</script>

<div class="flex h-screen flex-col overflow-hidden bg-[#f4f7fb] font-nanum text-slate-800">
	<header class="z-30 shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
		<div class="mx-auto flex h-[76px] w-full max-w-[1280px] items-center gap-4 px-4">
			<button
				type="button"
				on:click={() => (isMenuOpen = true)}
				class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[22px] font-black text-slate-700 transition hover:bg-slate-200"
				aria-label="목차 열기"
			>
				☰
			</button>

			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
						JSON LEARNING
					</div>

					<div class="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-700">
						{stepNumber}/{totalCount}단계
					</div>
				</div>

				<div
					class="mt-1 truncate font-gmarket text-[22px] font-bold tracking-[-0.055em] text-slate-950"
				>
					{course.title}
				</div>
			</div>

			<div class="hidden w-[260px] md:block">
				<div class="flex items-center justify-between text-[12px] font-extrabold text-slate-500">
					<span>진도</span>
					<span>{progressPercent}%</span>
				</div>

				<div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
					<div class="h-full rounded-full bg-blue-600" style={`width: ${progressPercent}%`}></div>
				</div>
			</div>

			<button
				type="button"
				on:click={goHome}
				class="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-extrabold text-slate-600 transition hover:bg-slate-50 sm:block"
			>
				홈 화면
			</button>
		</div>
	</header>

	{#if isMenuOpen}
		<div class="fixed inset-0 z-50">
			<button
				type="button"
				class="absolute inset-0 bg-slate-950/40"
				aria-label="목차 닫기"
				on:click={() => (isMenuOpen = false)}
			></button>

			<aside
				class="absolute left-0 top-0 flex h-full w-[340px] max-w-[86vw] flex-col bg-white p-5 shadow-2xl"
			>
				<div class="flex items-center justify-between">
					<div>
						<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
							MENU
						</div>

						<div class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.055em] text-slate-950">
							목차
						</div>
					</div>

					<button
						type="button"
						on:click={() => (isMenuOpen = false)}
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-black text-slate-600"
						aria-label="목차 닫기"
					>
						×
					</button>
				</div>

				<div class="mt-5 grid grid-cols-2 gap-2">
					<button
						type="button"
						on:click={goHome}
						class="rounded-2xl bg-slate-950 px-4 py-3 text-[13px] font-extrabold text-white"
					>
						학습 홈
					</button>

					<button
						type="button"
						on:click={() => {
							isMenuOpen = false;
							resetLesson();
						}}
						class="rounded-2xl bg-slate-100 px-4 py-3 text-[13px] font-extrabold text-slate-700"
					>
						다시하기
					</button>
				</div>

				<div class="mt-5 flex-1 overflow-y-auto pr-1">
					<div class="mb-2 text-[12px] font-extrabold text-slate-400">단계 목록</div>

					<div class="flex flex-col gap-2">
						{#each course.lessons as item, index}
							<button
								type="button"
								on:click={() => {
									isMenuOpen = false;
									goStep(index + 1);
								}}
								class={`rounded-2xl px-4 py-3 text-left transition ${
									stepNumber === index + 1
										? 'bg-blue-600 text-white shadow-sm'
										: 'bg-slate-50 text-slate-600 hover:bg-slate-100'
								}`}
							>
								<div class="flex items-center justify-between gap-2">
									<div class="text-[12px] font-extrabold opacity-70">
										{index + 1}단계
									</div>

									{#if isLessonCleared(item)}
										<div
											class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700"
										>
											완료
										</div>
									{/if}
								</div>

								<div class="mt-0.5 text-[14px] font-extrabold">
									{item.title}
								</div>
							</button>
						{/each}
					</div>
				</div>
			</aside>
		</div>
	{/if}

	<main
		class="mx-auto grid min-h-0 w-full max-w-[1280px] flex-1 grid-cols-1 gap-5 overflow-hidden px-4 py-5 lg:grid-cols-[0.92fr_1.08fr]"
	>
		<section
			class="min-h-0 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
		>
			<div bind:this={leftContentScrollEl} class="flex h-full min-h-0 flex-col overflow-y-auto p-6">
				<div class={`${lesson.image ? 'mt-4' : ''} flex items-center justify-between gap-3`}>
					<div class="flex min-w-0 items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2">
						<span
							class="shrink-0 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-extrabold text-white"
						>
							{stepNumber}단계
						</span>

						<span
							class="truncate font-gmarket text-[17px] font-bold tracking-[-0.045em] text-slate-950"
						>
							{lesson.conceptLabel}
						</span>
					</div>

					<div
						class="shrink-0 rounded-2xl bg-slate-100 px-3 py-2 text-[12px] font-extrabold text-slate-500"
					>
						전체 <span class="text-slate-900">{stepNumber}/{totalCount}</span>
					</div>
				</div>

				<h1 class="mt-6 mb-4 font-gmarket text-[30px] font-bold tracking-[-0.065em] text-slate-950">
					{lesson.title}
				</h1>
				{#if lesson.contentBlocks?.length}
					<div class="mt-4 flex flex-col gap-4 font-gmarket">
						{#each lesson.contentBlocks as block}
							{#if block.type === 'paragraph'}
								<p class="text-[16px] font-normal leading-8 text-slate-600">
									{#each block.parts as part}
										<span class={getTextToneClass(part.tone)}>
											{part.text}
										</span>
									{/each}
								</p>
							{:else if block.type === 'image'}
								<div class="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
									<img src={block.src} alt={block.alt ?? ''} class="h-auto w-full object-cover" />
								</div>
							{:else if block.type === 'tip'}
								<div class="rounded-[24px] bg-slate-50 p-4">
									<div class="text-[13px] font-extrabold text-slate-500">
										{block.title}
									</div>

									<ul class="mt-3 flex flex-col gap-2">
										{#each block.items as item}
											<li class="flex gap-2 text-[14px] font-bold leading-6 text-slate-600">
												<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
												<span>{item}</span>
											</li>
										{/each}
									</ul>
								</div>
							{:else if block.type === 'example'}
								<div class="rounded-[26px] border border-blue-100 bg-blue-50 p-4">
									<div class="text-[13px] font-extrabold text-blue-700">
										{block.title}
									</div>

									<div
										class="mt-3 rounded-[20px] bg-white p-4 text-[15px] font-extrabold leading-7 text-slate-800 shadow-sm"
									>
										“{block.before}”
									</div>

									<div class="my-3 flex justify-center">
										<div
											class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white"
										>
											↓
										</div>
									</div>

									<pre
										class="overflow-x-auto rounded-[20px] bg-slate-950 p-4 font-mono text-[14px] font-bold leading-7 text-emerald-100">{block.after}</pre>
								</div>
							{:else if block.type === 'imageModalButton'}
								<div class="rounded-[24px] border border-blue-100 bg-blue-50 p-4">
									<div class="flex items-center justify-between gap-3">
										<div>
											<div class="text-[13px] font-extrabold text-blue-700">
												{block.label}
											</div>

											{#if block.description}
												<div class="mt-1 text-[13px] font-bold leading-5 text-slate-600">
													{block.description}
												</div>
											{/if}
										</div>

										<button
											type="button"
											on:click={() =>
												openImageModal({
													src: block.image,
													title: block.modalTitle ?? block.label,
													description: block.description ?? ''
												})}
											class="shrink-0 rounded-2xl bg-blue-600 px-4 py-2.5 text-[13px] font-extrabold text-white transition hover:bg-blue-700"
										>
											보기
										</button>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<p class="mt-3 whitespace-pre-line text-[16px] font-bold leading-8 text-slate-600">
						{lesson.description}
					</p>
				{/if}

				<div class="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
					<div class="text-[13px] font-extrabold text-amber-700">이번 단계에서 할 일</div>
					<div class="mt-2 text-[16px] font-extrabold leading-7 text-slate-800">
						{lesson.task}
					</div>
				</div>

				<div class="mt-auto pt-5">
					{#if lesson.hints?.length}
						<button
							type="button"
							on:click={() => (showHint = !showHint)}
							class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-extrabold text-slate-600 transition hover:bg-slate-50"
						>
							{showHint ? '힌트 닫기' : '힌트 보기'}
						</button>
					{/if}

					{#if showHint && lesson.hints?.length}
						<div class="mt-3 rounded-[22px] bg-slate-950 p-4 text-white">
							<div class="text-[12px] font-extrabold text-slate-400">HINT</div>
							<ul class="mt-2 flex flex-col gap-1.5">
								{#each lesson.hints as hint}
									<li class="text-[13px] font-bold leading-6 text-slate-100">
										• {hint}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<section
			class="flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm"
		>
			{#if lesson.type === 'intro'}
				<div class="flex min-h-0 flex-1 flex-col">
					<div bind:this={introRightScrollEl} class="min-h-0 flex-1 overflow-y-auto pr-1">
						<div>
							<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
								WHY JSON?
							</div>

							<h2 class="mt-1 font-gmarket text-[26px] font-bold tracking-[-0.06em] text-slate-950">
								문장을 정보로 바꾸면 더 정확해져요
							</h2>

							<p class="mt-3 text-[14px] font-gmarket font-normal leading-7 text-slate-500">
								AI와 컴퓨터는 문장도 읽을 수 있지만, 정보를 이름표와 값으로 정리하면 더 정확하게
								이해할 수 있어요.
							</p>
						</div>

						<div class="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
							<div class="text-[13px] font-extrabold text-slate-500">사람이 말하는 문장</div>

							<div class="mt-3 rounded-[22px] bg-white p-2 shadow-sm">
								<p class="text-[18px] font-dodum font-extrabold leading-8 text-slate-900">
									“{lesson.introSentence}”
								</p>
							</div>
						</div>

						<div class="mt-4 flex justify-center">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-[20px] font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]"
							>
								↓
							</div>
						</div>

						<div class="mt-4 rounded-[28px] border border-blue-100 bg-blue-50 p-5">
							<div class="flex items-center justify-between gap-3">
								<div class="text-[13px] font-extrabold text-blue-700">정리된 정보</div>

								<div
									class="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-blue-600"
								>
									JSON
								</div>
							</div>

							<pre
								class="mt-3 overflow-x-auto rounded-[22px] bg-slate-950 p-5 font-mono text-[14px] font-bold leading-6 text-emerald-100">{lesson.introJson}</pre>
						</div>

						<div class="mt-5 grid gap-3">
							{#each lesson.introCards ?? [] as card}
								<div class="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
									<div class="font-gmarket text-[18px] font-bold tracking-[-0.04em] text-slate-950">
										{card.title}
									</div>

									<p class="mt-2 text-[14px] font-bold leading-6 text-slate-600">
										{card.text}
									</p>
								</div>
							{/each}
						</div>

						<div class="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
							<div class="text-[13px] font-extrabold text-amber-700">오늘의 핵심</div>

							<p class="mt-2 text-[15px] font-extrabold leading-7 text-slate-800">
								{lesson.takeaway}
							</p>
						</div>
					</div>

					<div class="shrink-0 border-t border-slate-100 bg-white pt-4">
						<button
							type="button"
							on:click={goNext}
							class="h-12 w-full rounded-2xl bg-blue-600 px-5 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
						>
							{currentLessonCleared ? '2단계로 가기' : '퀴즈 풀고 2단계로 가기'}
						</button>
					</div>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<div>
						<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-slate-400">
							PLAYGROUND
						</div>

						<h2 class="mt-1 font-gmarket text-[22px] font-bold tracking-[-0.055em] text-slate-950">
							제이슨 연습장
						</h2>
					</div>

					<div class="flex items-center gap-2">
						<button
							type="button"
							on:click={formatCode}
							class="rounded-xl bg-slate-100 px-3 py-2 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-200"
						>
							포맷 정리
						</button>

						<button
							type="button"
							on:click={resetLesson}
							class="rounded-xl bg-slate-100 px-3 py-2 text-[12px] font-extrabold text-slate-600 transition hover:bg-slate-200"
						>
							다시하기
						</button>
					</div>
				</div>

				<div
					class="mt-4 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-slate-800 bg-[#101827] transition focus-within:ring-4 focus-within:ring-blue-100"
				>
					<JsonCodeMirrorEditor
						bind:value={jsonText}
						onChange={(nextValue) => {
							jsonText = nextValue;
						}}
					/>
				</div>

				<div
					class={`mt-4 whitespace-pre-wrap rounded-2xl border px-4 py-3 text-[14px] font-extrabold ${getResultClass(
						resultType
					)}`}
				>
					{#if resultMessage}
						{resultMessage}
					{:else}
						실행하기를 누르면 결과가 여기에 표시돼요.
					{/if}
				</div>

				<div class="mt-4 flex items-center gap-3">
					<button
						type="button"
						on:click={goPrev}
						disabled={stepNumber === 1}
						class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						이전
					</button>

					<button
						type="button"
						on:click={checkAnswer}
						class="h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
					>
						실행하기
					</button>

					<button
						type="button"
						on:click={goNext}
						class={`h-12 rounded-2xl px-5 text-[14px] font-extrabold text-white transition ${
							currentLessonCleared ? 'bg-slate-950 hover:bg-slate-800' : 'bg-slate-400'
						}`}
					>
						{#if isLastStep}
							{currentLessonCleared ? '완료 축하 보기' : '마지막 단계'}
						{:else}
							{currentLessonCleared ? '다음' : '성공해야 다음'}
						{/if}
					</button>
				</div>
			{/if}
		</section>
	</main>
	{#if isQuizOpen}
		<div class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4">
			<div class="w-full max-w-[520px] rounded-[32px] bg-white p-6 shadow-2xl">
				<div class="flex items-start justify-between gap-4">
					<div>
						<div class="font-gmarket text-[11px] font-bold tracking-[0.18em] text-blue-500">
							CHECK POINT
						</div>

						<h2 class="mt-2 font-gmarket text-[26px] font-bold tracking-[-0.06em] text-slate-950">
							확인 퀴즈
						</h2>
					</div>

					<button
						type="button"
						on:click={closeQuiz}
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-black text-slate-500 transition hover:bg-slate-200"
						aria-label="퀴즈 닫기"
					>
						×
					</button>
				</div>

				<div class="mt-5 rounded-[14px] bg-blue-50 p-4">
					<p class="text-[17px] font-gmarket font-bold leading-7 text-slate-900">
						{lesson.quiz?.question}
					</p>
				</div>

				<div class="mt-4 flex flex-col gap-2">
					{#each lesson.quiz?.options ?? [] as option}
						<button
							type="button"
							on:click={() => {
								selectedQuizAnswer = option.id;
								quizMessage = '';
							}}
							class={`rounded-xl border px-4 py-3 text-left text-[16px] font-gmarket font-normal leading-6 transition ${
								selectedQuizAnswer === option.id
									? 'border-blue-500 bg-blue-50 text-blue-700'
									: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
							}`}
						>
							{option.text}
						</button>
					{/each}
				</div>

				{#if quizMessage}
					<div
						class={`mt-4 rounded-2xl px-4 py-3 text-[14px] font-extrabold leading-6 ${
							selectedQuizAnswer === lesson.quiz?.answerId
								? 'bg-emerald-50 text-emerald-700'
								: 'bg-rose-50 text-rose-700'
						}`}
					>
						{quizMessage}
					</div>
				{/if}

				<div class="mt-5 flex gap-3">
					<button
						type="button"
						on:click={closeQuiz}
						class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-extrabold text-slate-600 transition hover:bg-slate-50"
					>
						닫기
					</button>

					<button
						type="button"
						on:click={submitQuiz}
						class="h-12 flex-1 rounded-2xl bg-blue-600 px-5 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
					>
						정답 확인
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if imageModal.open && imageModal.src}
		<div class="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4">
			<button
				type="button"
				class="absolute inset-0"
				aria-label="이미지 모달 닫기"
				on:click={closeImageModal}
			></button>

			<div class="relative z-10 w-full max-w-[920px] rounded-[32px] bg-white p-5 shadow-2xl">
				<div class="flex items-center justify-between gap-4">
					<div>
						<div class="font-gmarket text-[11px] font-bold tracking-[0.16em] text-blue-500">
							IMAGE GUIDE
						</div>

						<h2 class="mt-1 font-gmarket text-[24px] font-bold tracking-[-0.05em] text-slate-950">
							{imageModal.title}
						</h2>

						{#if imageModal.description}
							<p class="mt-1 text-[13px] font-bold leading-5 text-slate-500">
								{imageModal.description}
							</p>
						{/if}
					</div>

					<button
						type="button"
						on:click={closeImageModal}
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-black text-slate-500 transition hover:bg-slate-200"
						aria-label="닫기"
					>
						×
					</button>
				</div>

				<div class="mt-4 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
					<img
						src={imageModal.src}
						alt={imageModal.title}
						class="max-h-[70vh] w-full object-contain"
					/>
				</div>

				<div class="mt-4 flex justify-end">
					<button
						type="button"
						on:click={closeImageModal}
						class="rounded-2xl bg-slate-950 px-5 py-3 text-[14px] font-extrabold text-white transition hover:bg-slate-800"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	{/if}
	{#if showFinalSuccessModal}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm"
		>
			<button
				type="button"
				class="absolute inset-0"
				aria-label="축하 모달 닫기"
				on:click={() => (showFinalSuccessModal = false)}
			></button>

			<div
				class="relative z-10 w-full max-w-[540px] overflow-hidden rounded-[34px] border border-yellow-200 bg-white p-8 text-center shadow-2xl"
			>
				<div
					class="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-200/50 blur-3xl"
				></div>

				<div
					class="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl"
				></div>

				<div
					class="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-5xl shadow-inner"
				>
					🏆
				</div>

				<div class="relative mb-2 text-[12px] font-black tracking-[0.22em] text-yellow-500">
					JSON LEARNING COMPLETE
				</div>

				<h2 class="relative font-gmarket text-[30px] font-black tracking-[-0.06em] text-slate-950">
					모든 단계 완료!
				</h2>

				<p class="relative mt-4 text-[15px] font-bold leading-7 text-slate-500">
					축하해요! 모든 JSON 학습 단계를 끝까지 성공했어요.<br />
					이제 AI가 읽을 수 있는 데이터를 직접 만들 준비가 되었어요.
				</p>

				<div
					class="relative mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-left text-[14px] font-bold leading-7 text-slate-600"
				>
					<div>✅ JSON 구조 이해 완료</div>
					<div>✅ 오류 메시지 확인 완료</div>
					<div>✅ 데이터 입력 연습 완료</div>
					<div>✅ 최종 학습 준비 완료</div>
				</div>

				<div class="relative mt-7 flex gap-3">
					<button
						type="button"
						on:click={() => (showFinalSuccessModal = false)}
						class="h-12 flex-1 rounded-2xl bg-slate-950 px-5 text-[14px] font-black text-white transition hover:bg-slate-800"
					>
						확인
					</button>

					<button
						type="button"
						on:click={goHome}
						class="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-[14px] font-black text-slate-600 transition hover:bg-slate-50"
					>
						학습 홈
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
