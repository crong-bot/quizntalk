<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';

	type BaseStep = {
		id?: string;
		kind: 'mission' | 'scenario' | 'choice' | 'quiz' | 'sort' | 'info' | 'complete';
		title?: string;
		text?: string;
		image?: string;
		nextLabel?: string;
		autoNext?: boolean;
	};

	type MissionStep = BaseStep & {
		kind: 'mission';
		goal?: string;
		tip?: string;
	};

	type ScenarioStep = BaseStep & {
		kind: 'scenario';
		speaker?: string;
		aiBox?: {
			title?: string;
			text: string;
		};
	};

	type ChoiceOption = {
		text: string;
		correct?: boolean;
		feedback?: string;
		nextStepIndex?: number;
	};

	type ChoiceStep = BaseStep & {
		kind: 'choice';
		question: string;
		options: ChoiceOption[];
		multiple?: false;
	};

	type QuizStep = BaseStep & {
		kind: 'quiz';
		question: string;
		options: ChoiceOption[];
		answerExplanation?: string;
	};

	type SortItem = {
		id: string;
		text: string;
	};

	type SortStep = BaseStep & {
		kind: 'sort';
		question: string;
		items: SortItem[];
		correctOrder: string[];
		answerExplanation?: string;
	};

	type InfoStep = BaseStep & {
		kind: 'info';
		bullets?: string[];
	};

	type CompleteStep = BaseStep & {
		kind: 'complete';
		badge?: string;
		summary?: string[];
	};

	export type StudyStep =
		| MissionStep
		| ScenarioStep
		| ChoiceStep
		| QuizStep
		| SortStep
		| InfoStep
		| CompleteStep;

	export let title = '학습 미션';
	export let lessonKey = '';
	export let steps: StudyStep[] = [];

	// 기존 progress 불러와서 시작할 수 있게 외부에서 주입 가능
	export let initialStepIndex = 0;

	const dispatch = createEventDispatcher();

	let currentIndex = initialStepIndex;
	let containerEl: HTMLDivElement | null = null;

	let selectedIndex: number | null = null;
	let submitted = false;
	let isCorrect = false;
	let choiceFeedback = '';

	let sortItems: SortItem[] = [];
	let sortSubmitted = false;
	let sortCorrect = false;
	let draggedIndex: number | null = null;

	$: currentStep = steps[currentIndex];

	onMount(async () => {
		setupStepState();
		await tick();
		scrollTop();
		emitProgress();
	});

	$: if (currentStep) {
		setupStepState();
		tick().then(scrollTop);
	}

	function setupStepState() {
		selectedIndex = null;
		submitted = false;
		isCorrect = false;
		choiceFeedback = '';

		sortSubmitted = false;
		sortCorrect = false;
		draggedIndex = null;

		if (currentStep?.kind === 'sort') {
			sortItems = [...currentStep.items];
		} else {
			sortItems = [];
		}
	}

	function scrollTop() {
		containerEl?.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function emitProgress() {
		dispatch('progress', {
			lessonKey,
			stepIndex: currentIndex,
			totalSteps: steps.length,
			completed: currentIndex >= steps.length - 1
		});
	}

	function goNext() {
		if (currentIndex >= steps.length - 1) {
			dispatch('complete', {
				lessonKey,
				stepIndex: currentIndex
			});
			return;
		}

		currentIndex += 1;
		emitProgress();
	}

	function goPrev() {
		if (currentIndex <= 0) return;
		currentIndex -= 1;
		emitProgress();
	}

	function jumpTo(index: number) {
		if (index < 0 || index >= steps.length) return;
		currentIndex = index;
		emitProgress();
	}

	function handleChoiceSelect(index: number) {
		if (submitted) return;
		selectedIndex = index;
	}

	function submitChoiceStep() {
		if (selectedIndex === null) return;

		if (currentStep.kind !== 'choice' && currentStep.kind !== 'quiz') return;

		const selected = currentStep.options[selectedIndex];
		submitted = true;
		isCorrect = !!selected.correct;
		choiceFeedback = selected.feedback || (isCorrect ? '잘 판단했어요.' : '한 번 더 생각해보세요.');

		if (selected.nextStepIndex !== undefined) {
			dispatch('branch', {
				fromStepIndex: currentIndex,
				toStepIndex: selected.nextStepIndex
			});
		}
	}

	function proceedAfterChoice() {
		if (selectedIndex === null) return;
		const step = currentStep;

		if (step.kind !== 'choice' && step.kind !== 'quiz') return;

		const selected = step.options[selectedIndex];

		if (selected.nextStepIndex !== undefined) {
			jumpTo(selected.nextStepIndex);
			return;
		}

		goNext();
	}

	function moveSortItem(from: number, to: number) {
		const copied = [...sortItems];
		const [target] = copied.splice(from, 1);
		copied.splice(to, 0, target);
		sortItems = copied;
	}

	function onDragStart(index: number) {
		draggedIndex = index;
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(index: number) {
		if (draggedIndex === null || draggedIndex === index) return;
		moveSortItem(draggedIndex, index);
		draggedIndex = null;
	}

	function moveUp(index: number) {
		if (index === 0) return;
		moveSortItem(index, index - 1);
	}

	function moveDown(index: number) {
		if (index === sortItems.length - 1) return;
		moveSortItem(index, index + 1);
	}

	function submitSort() {
		if (currentStep.kind !== 'sort') return;

		sortSubmitted = true;

		const currentOrder = sortItems.map((item) => item.id);
		sortCorrect = JSON.stringify(currentOrder) === JSON.stringify(currentStep.correctOrder);
	}

	function proceedAfterSort() {
		goNext();
	}

	function canSubmitCurrent() {
		if (!currentStep) return false;

		if (currentStep.kind === 'choice' || currentStep.kind === 'quiz') {
			return selectedIndex !== null && !submitted;
		}

		if (currentStep.kind === 'sort') {
			return !sortSubmitted;
		}

		return false;
	}

	function canGoNextDirectly() {
		if (!currentStep) return false;

		return (
			currentStep.kind === 'mission' ||
			currentStep.kind === 'scenario' ||
			currentStep.kind === 'info' ||
			currentStep.kind === 'complete'
		);
	}

	function stepProgressPercent() {
		if (!steps.length) return 0;
		return Math.round(((currentIndex + 1) / steps.length) * 100);
	}
</script>

<div class="study-player" bind:this={containerEl}>
	<div class="topbar">
		<div class="topbar__text">
			<div class="eyebrow">MISSION CARD PLAYER</div>
			<h1>{title}</h1>
			<p>{currentIndex + 1} / {steps.length} 단계</p>
		</div>

		<div class="progress-wrap" aria-label="progress">
			<div class="progress-track">
				<div class="progress-fill" style={`width: ${stepProgressPercent()}%`} />
			</div>
		</div>
	</div>

	{#if currentStep}
		<section class="card">
			{#if currentStep.kind === 'mission'}
				<div class="badge">오늘의 미션</div>
				<h2>{currentStep.title}</h2>
				{#if currentStep.text}<p class="body">{currentStep.text}</p>{/if}
				{#if currentStep.goal}
					<div class="panel">
						<div class="panel__title">목표</div>
						<div>{currentStep.goal}</div>
					</div>
				{/if}
				{#if currentStep.tip}
					<div class="tip">힌트: {currentStep.tip}</div>
				{/if}
			{/if}

			{#if currentStep.kind === 'scenario'}
				<div class="badge">상황 보기</div>
				<h2>{currentStep.title}</h2>

				{#if currentStep.speaker}
					<div class="speaker">{currentStep.speaker}</div>
				{/if}

				{#if currentStep.text}
					<p class="body">{currentStep.text}</p>
				{/if}

				{#if currentStep.image}
					<img
						class="preview"
						src={currentStep.image}
						alt={currentStep.title || 'scenario image'}
					/>
				{/if}

				{#if currentStep.aiBox}
					<div class="ai-box">
						<div class="ai-box__title">{currentStep.aiBox.title || 'AI 답변'}</div>
						<div class="ai-box__body">{currentStep.aiBox.text}</div>
					</div>
				{/if}
			{/if}

			{#if currentStep.kind === 'choice'}
				<div class="badge">선택하기</div>
				<h2>{currentStep.title}</h2>
				<p class="question">{currentStep.question}</p>

				<div class="options">
					{#each currentStep.options as option, index}
						<button
							type="button"
							class:selected={selectedIndex === index}
							class="option-btn"
							on:click={() => handleChoiceSelect(index)}
							disabled={submitted}
						>
							<span class="option-index">{index + 1}</span>
							<span>{option.text}</span>
						</button>
					{/each}
				</div>

				{#if submitted}
					<div class:is-correct={isCorrect} class:is-wrong={!isCorrect} class="feedback">
						<div class="feedback__label">
							{#if isCorrect}좋은 선택이야{/if}
							{#if !isCorrect}다시 생각해볼 점이 있어{/if}
						</div>
						<div>{choiceFeedback}</div>
					</div>
				{/if}
			{/if}

			{#if currentStep.kind === 'quiz'}
				<div class="badge">퀴즈</div>
				<h2>{currentStep.title}</h2>
				<p class="question">{currentStep.question}</p>

				<div class="options">
					{#each currentStep.options as option, index}
						<button
							type="button"
							class:selected={selectedIndex === index}
							class="option-btn"
							on:click={() => handleChoiceSelect(index)}
							disabled={submitted}
						>
							<span class="option-index">{index + 1}</span>
							<span>{option.text}</span>
						</button>
					{/each}
				</div>

				{#if submitted}
					<div class:is-correct={isCorrect} class:is-wrong={!isCorrect} class="feedback">
						<div class="feedback__label">
							{#if isCorrect}정답!{/if}
							{#if !isCorrect}오답이야{/if}
						</div>
						<div>{choiceFeedback}</div>

						{#if currentStep.answerExplanation}
							<div class="explanation">{currentStep.answerExplanation}</div>
						{/if}
					</div>
				{/if}
			{/if}

			{#if currentStep.kind === 'sort'}
				<div class="badge">순서 배열</div>
				<h2>{currentStep.title}</h2>
				<p class="question">{currentStep.question}</p>

				<div class="sort-list">
					{#each sortItems as item, index}
						<div
							class="sort-item"
							draggable={!sortSubmitted}
							on:dragstart={() => onDragStart(index)}
							on:dragover={onDragOver}
							on:drop={() => onDrop(index)}
						>
							<div class="sort-left">
								<div class="sort-number">{index + 1}</div>
								<div class="sort-text">{item.text}</div>
							</div>

							<div class="sort-actions">
								<button
									type="button"
									on:click={() => moveUp(index)}
									disabled={sortSubmitted || index === 0}
								>
									↑
								</button>
								<button
									type="button"
									on:click={() => moveDown(index)}
									disabled={sortSubmitted || index === sortItems.length - 1}
								>
									↓
								</button>
							</div>
						</div>
					{/each}
				</div>

				{#if sortSubmitted}
					<div class:is-correct={sortCorrect} class:is-wrong={!sortCorrect} class="feedback">
						<div class="feedback__label">
							{#if sortCorrect}좋아, 순서를 잘 맞췄어{/if}
							{#if !sortCorrect}순서를 다시 살펴보자{/if}
						</div>
						{#if currentStep.answerExplanation}
							<div class="explanation">{currentStep.answerExplanation}</div>
						{/if}
					</div>
				{/if}
			{/if}

			{#if currentStep.kind === 'info'}
				<div class="badge">핵심 정리</div>
				<h2>{currentStep.title}</h2>
				{#if currentStep.text}<p class="body">{currentStep.text}</p>{/if}
				{#if currentStep.bullets?.length}
					<ul class="bullets">
						{#each currentStep.bullets as bullet}
							<li>{bullet}</li>
						{/each}
					</ul>
				{/if}
			{/if}

			{#if currentStep.kind === 'complete'}
				<div class="badge">미션 완료</div>
				<h2>{currentStep.title}</h2>
				{#if currentStep.badge}
					<div class="complete-badge">{currentStep.badge}</div>
				{/if}
				{#if currentStep.text}<p class="body">{currentStep.text}</p>{/if}
				{#if currentStep.summary?.length}
					<ul class="bullets">
						{#each currentStep.summary as item}
							<li>{item}</li>
						{/each}
					</ul>
				{/if}
			{/if}

			<div class="footer">
				<button type="button" class="ghost" on:click={goPrev} disabled={currentIndex === 0}>
					이전
				</button>

				<div class="footer-right">
					{#if (currentStep.kind === 'choice' || currentStep.kind === 'quiz') && !submitted}
						<button
							type="button"
							class="primary"
							on:click={submitChoiceStep}
							disabled={!canSubmitCurrent()}
						>
							제출하기
						</button>
					{/if}

					{#if (currentStep.kind === 'choice' || currentStep.kind === 'quiz') && submitted}
						<button type="button" class="primary" on:click={proceedAfterChoice}>
							{currentStep.nextLabel || '다음'}
						</button>
					{/if}

					{#if currentStep.kind === 'sort' && !sortSubmitted}
						<button type="button" class="primary" on:click={submitSort}> 순서 확인 </button>
					{/if}

					{#if currentStep.kind === 'sort' && sortSubmitted}
						<button type="button" class="primary" on:click={proceedAfterSort}>
							{currentStep.nextLabel || '다음'}
						</button>
					{/if}

					{#if canGoNextDirectly()}
						<button type="button" class="primary" on:click={goNext}>
							{currentStep.nextLabel || (currentStep.kind === 'complete' ? '끝내기' : '다음')}
						</button>
					{/if}
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.study-player {
		width: 100%;
		height: 100%;
		overflow: auto;
		padding: 24px;
		box-sizing: border-box;
		background: radial-gradient(circle at top left, rgba(107, 114, 255, 0.1), transparent 28%),
			linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
	}

	.topbar {
		max-width: 900px;
		margin: 0 auto 20px;
	}

	.eyebrow {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: #6366f1;
		margin-bottom: 8px;
	}

	h1 {
		margin: 0;
		font-size: 32px;
		line-height: 1.2;
		color: #111827;
	}

	.topbar p {
		margin: 8px 0 0;
		color: #6b7280;
		font-size: 14px;
	}

	.progress-wrap {
		margin-top: 16px;
	}

	.progress-track {
		width: 100%;
		height: 10px;
		border-radius: 999px;
		background: rgba(99, 102, 241, 0.12);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
		transition: width 0.25s ease;
	}

	.card {
		max-width: 900px;
		margin: 0 auto;
		background: rgba(255, 255, 255, 0.82);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(99, 102, 241, 0.1);
		border-radius: 28px;
		padding: 28px;
		box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		border-radius: 999px;
		background: #eef2ff;
		color: #4f46e5;
		font-size: 12px;
		font-weight: 800;
		margin-bottom: 16px;
	}

	h2 {
		margin: 0 0 14px;
		font-size: 28px;
		line-height: 1.3;
		color: #111827;
	}

	.body,
	.question {
		font-size: 18px;
		line-height: 1.7;
		color: #374151;
		margin: 0 0 18px;
	}

	.speaker {
		display: inline-block;
		margin-bottom: 10px;
		padding: 6px 10px;
		border-radius: 12px;
		background: #f3f4f6;
		color: #4b5563;
		font-size: 13px;
		font-weight: 700;
	}

	.panel {
		margin-top: 12px;
		padding: 16px;
		border-radius: 18px;
		background: #f8fafc;
		border: 1px solid #e5e7eb;
	}

	.panel__title {
		font-size: 12px;
		font-weight: 800;
		color: #6366f1;
		margin-bottom: 8px;
	}

	.tip {
		margin-top: 14px;
		padding: 14px 16px;
		border-radius: 16px;
		background: #fff7ed;
		color: #9a3412;
		font-size: 14px;
		font-weight: 600;
	}

	.preview {
		width: 100%;
		max-height: 300px;
		object-fit: cover;
		border-radius: 20px;
		margin-bottom: 18px;
	}

	.ai-box {
		margin-top: 16px;
		border-radius: 20px;
		border: 1px solid #dbeafe;
		background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
		padding: 18px;
	}

	.ai-box__title {
		font-size: 13px;
		font-weight: 800;
		color: #2563eb;
		margin-bottom: 8px;
	}

	.ai-box__body {
		font-size: 17px;
		line-height: 1.7;
		color: #1f2937;
	}

	.options {
		display: grid;
		gap: 12px;
		margin-top: 16px;
	}

	.option-btn {
		width: 100%;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		text-align: left;
		padding: 16px 18px;
		border-radius: 18px;
		border: 1px solid #e5e7eb;
		background: #ffffff;
		color: #111827;
		font-size: 16px;
		line-height: 1.5;
		cursor: pointer;
		transition:
			transform 0.12s ease,
			border-color 0.12s ease,
			box-shadow 0.12s ease;
	}

	.option-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: #a5b4fc;
		box-shadow: 0 8px 22px rgba(99, 102, 241, 0.1);
	}

	.option-btn.selected {
		border-color: #6366f1;
		background: #eef2ff;
	}

	.option-btn:disabled {
		cursor: default;
		opacity: 1;
	}

	.option-index {
		min-width: 28px;
		height: 28px;
		border-radius: 999px;
		background: #f3f4f6;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 800;
		color: #374151;
	}

	.feedback {
		margin-top: 18px;
		padding: 18px;
		border-radius: 18px;
		font-size: 16px;
		line-height: 1.6;
	}

	.feedback.is-correct {
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		color: #065f46;
	}

	.feedback.is-wrong {
		background: #fff7ed;
		border: 1px solid #fed7aa;
		color: #9a3412;
	}

	.feedback__label {
		font-weight: 800;
		margin-bottom: 8px;
	}

	.explanation {
		margin-top: 10px;
	}

	.sort-list {
		display: grid;
		gap: 12px;
		margin-top: 18px;
	}

	.sort-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 16px;
		border-radius: 18px;
		border: 1px solid #e5e7eb;
		background: #fff;
	}

	.sort-left {
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 0;
	}

	.sort-number {
		width: 34px;
		height: 34px;
		flex-shrink: 0;
		border-radius: 999px;
		background: #eef2ff;
		color: #4f46e5;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
	}

	.sort-text {
		font-size: 16px;
		line-height: 1.5;
		color: #111827;
	}

	.sort-actions {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}

	.sort-actions button {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		border: 1px solid #d1d5db;
		background: #fff;
		cursor: pointer;
		font-size: 16px;
	}

	.sort-actions button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.bullets {
		margin: 16px 0 0;
		padding-left: 20px;
		color: #374151;
		font-size: 17px;
		line-height: 1.7;
	}

	.complete-badge {
		display: inline-flex;
		margin-bottom: 14px;
		padding: 10px 14px;
		border-radius: 999px;
		background: linear-gradient(90deg, #fde68a 0%, #fca5a5 100%);
		color: #111827;
		font-weight: 900;
		font-size: 14px;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid #e5e7eb;
	}

	.footer-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.ghost,
	.primary {
		border: none;
		border-radius: 16px;
		padding: 14px 18px;
		font-size: 15px;
		font-weight: 800;
		cursor: pointer;
	}

	.ghost {
		background: #f3f4f6;
		color: #374151;
	}

	.primary {
		background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
		box-shadow: 0 10px 24px rgba(99, 102, 241, 0.22);
	}

	.ghost:disabled,
	.primary:disabled {
		opacity: 0.45;
		cursor: default;
		box-shadow: none;
	}

	@media (max-width: 720px) {
		.study-player {
			padding: 14px;
		}

		h1 {
			font-size: 24px;
		}

		h2 {
			font-size: 22px;
		}

		.card {
			padding: 18px;
			border-radius: 22px;
		}

		.body,
		.question,
		.ai-box__body,
		.bullets {
			font-size: 15px;
		}

		.footer {
			flex-direction: column;
			align-items: stretch;
		}

		.footer-right {
			width: 100%;
		}

		.footer-right :global(button),
		.footer :global(button) {
			width: 100%;
		}
	}
</style>
