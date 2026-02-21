<script>
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import { saveLesson } from '$lib/firebase/lessons';
	import { authUser } from '$lib/stores/authUser';
	import '../../app.css';

	// --- 기본 데이터 구조(너가 쓰는 steps 형식 최대한 맞춤) ---
	// step.kind: 'chat' | 'quiz' | 'module'
	// chat: { kind:'chat', role:'teacher'|'student', text:'' }
	// quiz: { kind:'quiz', quizType:'multiple'|'ox'|'short'|'photo', question:'', choices:[], answer:'0' }
	// module: { kind:'module', module:'', props:{} }

	let title = '새 수업';
	//let slug = 'lesson_custom_' + Math.floor(Math.random() * 9999);
	let info = '0개/0분';
	let lessonId = crypto.randomUUID();

	let steps = [
		{ kind: 'chat', role: 'teacher', text: '안녕! 오늘은 수업을 만들어볼거야.' },
		{ kind: 'chat', role: 'student', text: '오~ 어떻게 만들어요?' }
	];

	// 선택된 step
	let selectedIndex = -1;

	// 드래그 상태
	let draggingIndex = null; // canvas 내부 step reorder용
	let dropIndex = null;
	let saving = false;

	const PALETTE = [
		{ type: 'chat_teacher', label: '교사 말풍선', desc: '교사 대사 추가' },
		{ type: 'chat_student', label: '학생 말풍선', desc: '학생 대사 추가' },
		{ type: 'quiz_multiple', label: '객관식 퀴즈', desc: '선택지/정답' },
		{ type: 'quiz_ox', label: 'O / X 퀴즈', desc: 'o 또는 x' },
		{ type: 'quiz_short', label: '주관식 퀴즈', desc: '짧은 답' },
		{ type: 'module', label: '모듈', desc: '커스텀 모듈 삽입' }
	];

	function makeStepFromPalette(type) {
		if (type === 'chat_teacher')
			return { kind: 'chat', role: 'teacher', text: '교사 대사를 입력하세요.' };
		if (type === 'chat_student')
			return { kind: 'chat', role: 'student', text: '학생 대사를 입력하세요.' };

		if (type === 'quiz_multiple') {
			return {
				kind: 'quiz',
				quizType: 'multiple',
				question: '다음 중 정답을 고르세요.',
				choices: ['선택지 1', '선택지 2', '선택지 3', '선택지 4'],
				answer: '0' // index string
			};
		}
		if (type === 'quiz_ox') {
			return {
				kind: 'quiz',
				quizType: 'ox',
				question: 'O/X 문제를 입력하세요.',
				choices: null,
				answer: 'o'
			};
		}
		if (type === 'quiz_short') {
			return {
				kind: 'quiz',
				quizType: 'short',
				question: '짧은 답을 입력하세요.',
				choices: null,
				answer: ''
			};
		}
		if (type === 'module') {
			return {
				kind: 'module',
				module: 'sample_module',
				props: { transition_delay: 0 }
			};
		}
		return null;
	}

	function onPaletteDragStart(e, item) {
		e.dataTransfer.setData('text/palette', item.type);
		e.dataTransfer.effectAllowed = 'copy';
	}

	function onCanvasDragOver(e) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	function onCanvasDrop(e) {
		e.preventDefault();
		const paletteType = e.dataTransfer.getData('text/palette');
		if (!paletteType) return;

		const newStep = makeStepFromPalette(paletteType);
		if (!newStep) return;

		// dropIndex가 있으면 그 위치에 삽입, 없으면 끝에 추가
		const insertAt = dropIndex == null ? steps.length : dropIndex;
		steps = [...steps.slice(0, insertAt), newStep, ...steps.slice(insertAt)];
		selectedIndex = insertAt;
		dropIndex = null;

		recalcInfo();
	}

	// --- Canvas 내부 reorder ---
	function onStepDragStart(e, index) {
		draggingIndex = index;
		e.dataTransfer.setData('text/step-index', String(index));
		e.dataTransfer.effectAllowed = 'move';
	}

	function onStepDragOver(e, index) {
		e.preventDefault();
		dropIndex = index;
		e.dataTransfer.dropEffect = 'move';
	}

	function onStepDrop(e, targetIndex) {
		e.preventDefault();
		const from = Number(e.dataTransfer.getData('text/step-index'));
		if (Number.isNaN(from)) return;

		if (from === targetIndex) {
			draggingIndex = null;
			dropIndex = null;
			return;
		}

		const moved = steps[from];
		const copy = steps.filter((_, i) => i !== from);

		// from이 빠진 뒤 targetIndex 보정
		const insertAt = from < targetIndex ? targetIndex - 1 : targetIndex;
		copy.splice(insertAt, 0, moved);
		steps = copy;

		selectedIndex = insertAt;
		draggingIndex = null;
		dropIndex = null;
	}

	function onStepDragEnd() {
		draggingIndex = null;
		dropIndex = null;
	}

	function selectStep(i) {
		selectedIndex = i;
	}

	function removeStep(i) {
		steps = steps.filter((_, idx) => idx !== i);
		if (selectedIndex === i) selectedIndex = -1;
		else if (selectedIndex > i) selectedIndex -= 1;
		recalcInfo();
	}

	function moveStep(i, dir) {
		const j = i + dir;
		if (j < 0 || j >= steps.length) return;
		const copy = [...steps];
		[copy[i], copy[j]] = [copy[j], copy[i]];
		steps = copy;
		selectedIndex = j;
	}

	function recalcInfo() {
		// 간단히 "챕터(=목차 아이템)"는 quiz/module만 카운트해도 되고,
		// 지금은 전체 steps 길이로 표시
		const count = steps.length;
		info = `${count}개/약 ${Math.max(1, Math.round(count * 0.5))}분`;
	}

	// --- 저장/불러오기 ---
	const LS_KEY = 'qnt_builder_draft_v1';

	function makeTocFromSteps(steps) {
		// ✅ 목차: quiz/question 우선, 없으면 module 이름, 없으면 chat은 제외(대사로 목차 만들지 않겠다고 했으니)
		const toc = [];
		for (const s of steps) {
			if (s.kind === 'quiz') toc.push(s.question?.trim() ? s.question.trim() : '퀴즈');
			else if (s.kind === 'module') toc.push(s.module ?? '모듈');
		}
		// toc가 너무 비면, fallback으로 "챕터 1,2..."처럼
		if (toc.length === 0) {
			// 최소한 페이지 수를 만들고 싶으면 여기서 생성 가능
			// 지금은 빈 배열 그대로 두자
		}
		return toc;
	}

	function buildPayload() {
		return {
			lessonId, // lessonId로 쓸거라 slug를 저장 키로 사용
			title,
			info,
			list: makeTocFromSteps(steps),
			steps
		};
	}

	async function saveToFirestore() {
		if (!$authUser) {
			alert('로그인이 필요합니다.');
			goto('/login');
			return;
		}

		saving = true;
		try {
			const payload = buildPayload();
			await saveLesson({
				lessonId: payload.lessonId, // ✅ 문서ID
				ownerUid: $authUser.uid,
				title: payload.title,
				info: payload.info,
				list: payload.list,
				steps: payload.steps,
				visibility: 'private'
			});
			alert('Firestore 저장 완료!');
			goto('/library');
		} catch (e) {
			console.error(e);
			alert('저장 실패: ' + (e?.message ?? 'unknown'));
		} finally {
			saving = false;
		}
	}

	function loadDraft() {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return alert('저장된 임시저장이 없습니다.');
		try {
			const data = JSON.parse(raw);
			title = data.title ?? title;
			lessonId = data.lessonId ?? lessonId; // ✅ slug → lessonId
			info = data.info ?? info;
			steps = Array.isArray(data.steps) ? data.steps : steps;
			selectedIndex = -1;
			recalcInfo();
			alert('불러오기 완료');
		} catch (e) {
			alert('불러오기 실패: JSON 파싱 에러');
		}
	}

	let importText = '';

	function importFromText() {
		try {
			const data = JSON.parse(importText);
			title = data.title ?? title;
			lessonId = data.lessonId ?? lessonId;
			info = data.info ?? info;
			steps = Array.isArray(data.steps) ? data.steps : steps;
			selectedIndex = -1;
			recalcInfo();
			alert('가져오기 완료');
		} catch (e) {
			alert('가져오기 실패: JSON 형식 확인');
		}
	}

	function exportJson() {
		const payload = buildPayload();
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${slug}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// 최초 info 계산
	recalcInfo();

	// --- 편집 패널 바인딩 helpers ---
	$: selectedStep = selectedIndex >= 0 ? steps[selectedIndex] : null;

	function updateSelected(patch) {
		if (selectedIndex < 0) return;
		const copy = [...steps];
		copy[selectedIndex] = { ...copy[selectedIndex], ...patch };
		steps = copy;
		recalcInfo();
	}

	function updateSelectedQuizField(field, value) {
		if (selectedIndex < 0) return;
		const s = steps[selectedIndex];
		if (s.kind !== 'quiz') return;
		updateSelected({ [field]: value });
	}

	function updateSelectedChoice(i, value) {
		if (selectedIndex < 0) return;
		const s = steps[selectedIndex];
		if (s.kind !== 'quiz' || !Array.isArray(s.choices)) return;
		const choices = [...s.choices];
		choices[i] = value;
		updateSelected({ choices });
	}
</script>

<Nav />

<div class="w-1280 m-auto px-10 py-8">
	<div class="flex items-end justify-between">
		<div>
			<div class="text-slate-400 text-sm font-semibold">Lesson Builder</div>
			<div class="font-dodum font-extrabold text-3xl text-slate-900 mt-2">수업 만들기</div>
			<div class="text-slate-500 mt-2">오른쪽 블록을 드래그해서 채팅창에 놓으세요.</div>
		</div>

		<div class="flex items-center gap-3">
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50"
				on:click={loadDraft}
			>
				불러오기
			</button>
			<div class="flex items-center gap-3">
				<button
					class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
					on:click={saveToFirestore}
					disabled={saving}
				>
					{saving ? '저장 중...' : 'Firestore 저장'}
				</button>
			</div>

			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
				on:click={exportJson}
			>
				JSON 내보내기
			</button>
		</div>
	</div>

	<div class="grid grid-cols-12 gap-6 mt-8">
		<!-- ✅ 가운데: 채팅 캔버스 -->
		<div class="col-span-8">
			<div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
				<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="text-slate-400 text-xs font-semibold">TITLE</div>
						<input
							class="px-3 py-2 rounded-xl border border-slate-200 text-sm w-80"
							bind:value={title}
							placeholder="수업 제목"
						/>
					</div>
					<div class="text-slate-500 text-sm">{info}</div>
				</div>

				<!-- Canvas drop zone -->
				<div
					class="p-6 h-[68vh] overflow-y-auto bg-slate-50"
					on:dragover={onCanvasDragOver}
					on:drop={onCanvasDrop}
				>
					{#if steps.length === 0}
						<div class="text-slate-400 text-sm p-6 border border-dashed rounded-2xl bg-white">
							오른쪽 블록을 드래그해서 여기로 놓으세요.
						</div>
					{/if}

					{#each steps as s, i (i)}
						<div
							class="mb-3"
							draggable="true"
							on:dragstart={(e) => onStepDragStart(e, i)}
							on:dragover={(e) => onStepDragOver(e, i)}
							on:drop={(e) => onStepDrop(e, i)}
							on:dragend={onStepDragEnd}
						>
							<!-- 삽입 가이드 -->
							{#if dropIndex === i && draggingIndex !== null}
								<div class="h-2 rounded-full bg-emerald-400 mb-2"></div>
							{/if}

							<button
								class={`w-full text-left rounded-2xl border p-4 transition
									${
										selectedIndex === i
											? 'border-emerald-300 bg-white shadow-sm'
											: 'border-slate-200 bg-white hover:bg-slate-50'
									}
								`}
								on:click={() => selectStep(i)}
							>
								<div class="flex items-start justify-between gap-4">
									<div class="min-w-0">
										<div class="text-slate-400 text-xs font-semibold">
											{#if s.kind === 'chat'}
												CHAT · {s.role === 'teacher' ? '교사' : '학생'}
											{:else if s.kind === 'quiz'}
												QUIZ · {s.quizType}
											{:else}
												MODULE · {s.module}
											{/if}
										</div>

										<div class="text-slate-900 font-semibold mt-1 truncate">
											{#if s.kind === 'chat'}
												{s.text}
											{:else if s.kind === 'quiz'}
												{s.question}
											{:else}
												모듈 props: {JSON.stringify(s.props)}
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-2 shrink-0">
										<button
											class="px-2 py-1 rounded-lg text-xs border border-slate-200 hover:bg-slate-50"
											on:click|stopPropagation={() => moveStep(i, -1)}
										>
											▲
										</button>
										<button
											class="px-2 py-1 rounded-lg text-xs border border-slate-200 hover:bg-slate-50"
											on:click|stopPropagation={() => moveStep(i, 1)}
										>
											▼
										</button>
										<button
											class="px-2 py-1 rounded-lg text-xs border border-rose-200 text-rose-600 hover:bg-rose-50"
											on:click|stopPropagation={() => removeStep(i)}
										>
											삭제
										</button>
									</div>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<!-- ✅ 아래: 편집 패널 -->
			<div class="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-slate-400 text-sm font-semibold">Editor</div>
						<div class="text-slate-900 font-extrabold text-xl mt-1">선택한 블록 편집</div>
					</div>
				</div>

				{#if !selectedStep}
					<div class="text-slate-500 mt-4">
						왼쪽 채팅 캔버스에서 블록을 클릭하면 여기서 수정할 수 있어요.
					</div>
				{:else if selectedStep.kind === 'chat'}
					<div class="mt-4 grid grid-cols-12 gap-4 items-start">
						<div class="col-span-3">
							<div class="text-slate-400 text-xs font-semibold mb-2">ROLE</div>
							<select
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
								bind:value={selectedStep.role}
								on:change={(e) => updateSelected({ role: e.target.value })}
							>
								<option value="teacher">teacher</option>
								<option value="student">student</option>
							</select>
						</div>
						<div class="col-span-9">
							<div class="text-slate-400 text-xs font-semibold mb-2">TEXT</div>
							<textarea
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm min-h-[120px]"
								bind:value={selectedStep.text}
								on:input={(e) => updateSelected({ text: e.target.value })}
							/>
						</div>
					</div>
				{:else if selectedStep.kind === 'quiz'}
					<div class="mt-4 grid grid-cols-12 gap-4">
						<div class="col-span-3">
							<div class="text-slate-400 text-xs font-semibold mb-2">QUIZ TYPE</div>
							<select
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
								bind:value={selectedStep.quizType}
								on:change={(e) => updateSelectedQuizField('quizType', e.target.value)}
							>
								<option value="multiple">multiple</option>
								<option value="ox">ox</option>
								<option value="short">short</option>
								<option value="photo">photo</option>
							</select>
						</div>

						<div class="col-span-9">
							<div class="text-slate-400 text-xs font-semibold mb-2">QUESTION</div>
							<input
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
								bind:value={selectedStep.question}
								on:input={(e) => updateSelectedQuizField('question', e.target.value)}
							/>
						</div>

						{#if selectedStep.quizType === 'multiple'}
							<div class="col-span-12 mt-2">
								<div class="text-slate-400 text-xs font-semibold mb-2">CHOICES</div>

								<div class="grid grid-cols-2 gap-3">
									{#each selectedStep.choices ?? [] as c, ci (ci)}
										<input
											class="px-3 py-2 rounded-xl border border-slate-200 text-sm"
											value={c}
											on:input={(e) => updateSelectedChoice(ci, e.target.value)}
										/>
									{/each}
								</div>

								<div class="mt-3 grid grid-cols-12 gap-3 items-center">
									<div class="col-span-3">
										<div class="text-slate-400 text-xs font-semibold mb-2">ANSWER INDEX</div>
										<input
											class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
											bind:value={selectedStep.answer}
											on:input={(e) => updateSelectedQuizField('answer', e.target.value)}
											placeholder="0 ~ 3"
										/>
									</div>
									<div class="col-span-9 text-slate-500 text-sm">
										정답은 choices의 index 문자열로 저장 (예: "0")
									</div>
								</div>
							</div>
						{:else if selectedStep.quizType === 'ox'}
							<div class="col-span-12 mt-2 grid grid-cols-12 gap-3 items-center">
								<div class="col-span-3">
									<div class="text-slate-400 text-xs font-semibold mb-2">ANSWER</div>
									<select
										class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
										bind:value={selectedStep.answer}
										on:change={(e) => updateSelectedQuizField('answer', e.target.value)}
									>
										<option value="o">o</option>
										<option value="x">x</option>
									</select>
								</div>
								<div class="col-span-9 text-slate-500 text-sm">정답은 "o" 또는 "x"</div>
							</div>
						{:else if selectedStep.quizType === 'short'}
							<div class="col-span-12 mt-2 grid grid-cols-12 gap-3 items-center">
								<div class="col-span-12">
									<div class="text-slate-400 text-xs font-semibold mb-2">ANSWER</div>
									<input
										class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
										bind:value={selectedStep.answer}
										on:input={(e) => updateSelectedQuizField('answer', e.target.value)}
										placeholder="정답 텍스트"
									/>
								</div>
							</div>
						{:else if selectedStep.quizType === 'photo'}
							<div class="col-span-12 mt-2 text-slate-500 text-sm">
								photo 타입은 MVP에서는 생략. 필요하면 photos 배열 편집 UI도 붙여줄게.
							</div>
						{/if}
					</div>
				{:else}
					<div class="mt-4 grid grid-cols-12 gap-4">
						<div class="col-span-4">
							<div class="text-slate-400 text-xs font-semibold mb-2">MODULE KEY</div>
							<input
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
								bind:value={selectedStep.module}
								on:input={(e) => updateSelected({ module: e.target.value })}
							/>
						</div>
						<div class="col-span-8">
							<div class="text-slate-400 text-xs font-semibold mb-2">PROPS (JSON)</div>
							<textarea
								class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm min-h-[120px]"
								value={JSON.stringify(selectedStep.props ?? {}, null, 2)}
								on:input={(e) => {
									try {
										const obj = JSON.parse(e.target.value || '{}');
										updateSelected({ props: obj });
									} catch (err) {
										// JSON 에러는 일단 무시 (원하면 빨간 경고 UI 넣어줄게)
									}
								}}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- ✅ 오른쪽: 팔레트 + 가져오기 -->
		<div class="col-span-4">
			<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
				<div class="text-slate-400 text-sm font-semibold">Blocks</div>
				<div class="text-slate-900 font-extrabold text-xl mt-1">드래그해서 추가</div>

				<div class="mt-5 space-y-3">
					{#each PALETTE as p (p.type)}
						<div
							class="rounded-2xl border border-slate-200 p-4 bg-slate-50 hover:bg-slate-100 cursor-grab active:cursor-grabbing"
							draggable="true"
							on:dragstart={(e) => onPaletteDragStart(e, p)}
						>
							<div class="text-slate-900 font-bold">{p.label}</div>
							<div class="text-slate-500 text-sm mt-1">{p.desc}</div>
						</div>
					{/each}
				</div>

				<div class="mt-6 pt-6 border-t border-slate-100">
					<div class="text-slate-400 text-sm font-semibold">Import JSON</div>
					<div class="text-slate-500 text-sm mt-2">
						서버/외부에서 만든 레슨 JSON을 붙여넣고 불러올 수 있게.
					</div>

					<textarea
						class="mt-3 w-full px-3 py-2 rounded-2xl border border-slate-200 text-sm min-h-[140px]"
						bind:value={importText}
					/>

					<button
						class="mt-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold bg-white border border-slate-200 hover:bg-slate-50"
						on:click={importFromText}
					>
						가져오기
					</button>
				</div>
			</div>

			<!-- ✅ 목차 미리보기(자동 생성) -->
			<div class="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
				<div class="text-slate-400 text-sm font-semibold">TOC Preview</div>
				<div class="text-slate-900 font-extrabold text-xl mt-1">자동 목차</div>
				<div class="text-slate-500 text-sm mt-2">
					대사로 목차 만들지 않겠다고 했으니까, quiz/module만 목차로 뽑음.
				</div>

				{#if makeTocFromSteps(steps).length === 0}
					<div class="mt-4 text-slate-400 text-sm">아직 목차가 없어요. 퀴즈/모듈을 넣어보세요.</div>
				{:else}
					<ul class="mt-4 space-y-2">
						{#each makeTocFromSteps(steps) as t, i (i)}
							<li class="text-slate-700 text-sm">
								<span class="inline-block w-7 text-slate-400 font-semibold"
									>{String(i + 1).padStart(2, '0')}</span
								>
								{t}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
</div>
