<script>
	import Nav from '$lib/components/nav.svelte';
	import '../../app.css';

	import { authUser } from '$lib/stores/authUser';
	import { LessonManager } from '$lib/stores/LessonManager.js';

	import { goto } from '$app/navigation';
	import lectureContent from '$lib/data/lecture_content.json';

	// ---- 유틸 ----
	const safeProgress = (lessonKey) => $LessonManager?.progress?.[lessonKey] ?? {};

	function lessonKeyFromUrl(url) {
		// ✅ 너가 lessonKey를 data.post.slug로 쓰고 있는데,
		// 정적은 url이 lesson_cognitive 같은 형태라면 그대로 key로 씀.
		// 만약 /study/ai/cognitive/1 처럼 슬러그가 다르면 여기서 매핑하면 됨.
		return url;
	}

	function calcLessonStats(lesson) {
		const lessonKey = lessonKeyFromUrl(lesson.url);
		const progress = safeProgress(lessonKey);

		const total = Array.isArray(lesson.list) ? lesson.list.length : 0;

		let done = 0;
		for (let i = 0; i < total; i++) {
			const chapter = i; // ✅ chapter 0-based (너가 지금 0-based로 가는 흐름)
			if (progress?.[chapter]?.success === true) done++;
		}

		const percent = total === 0 ? 0 : Math.round((done / total) * 100);
		const completed = total > 0 && done === total;

		return { lessonKey, total, done, percent, completed };
	}

	$: lessonCards = lectureContent.map((lesson) => {
		const s = calcLessonStats(lesson);
		return { ...lesson, ...s };
	});

	$: totalLessons = lessonCards.length;
	$: completedLessons = lessonCards.filter((x) => x.completed).length;

	$: avgPercent =
		totalLessons === 0
			? 0
			: Math.round(lessonCards.reduce((acc, x) => acc + x.percent, 0) / totalLessons);

	$: certificatesReady = lessonCards.filter((x) => x.completed);

	// ---- MVP1: Canvas 인증서 생성 ----
	function downloadCertificate(lessonTitle) {
		const userLabel = $authUser?.email ? $authUser.email.split('@')[0] : 'Guest';
		const dateStr = new Date().toLocaleDateString('ko-KR');

		const canvas = document.createElement('canvas');
		canvas.width = 1600;
		canvas.height = 1000;
		const ctx = canvas.getContext('2d');

		// 배경
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 카드
		ctx.fillStyle = '#ffffff';
		roundRect(ctx, 120, 120, 1360, 760, 36);
		ctx.fill();

		// 테두리
		ctx.strokeStyle = '#e2e8f0';
		ctx.lineWidth = 6;
		roundRect(ctx, 120, 120, 1360, 760, 36);
		ctx.stroke();

		// 상단 라인 (브랜드 느낌)
		ctx.fillStyle = '#10b981'; // emerald
		roundRect(ctx, 120, 120, 1360, 18, 12);
		ctx.fill();

		// 텍스트
		ctx.fillStyle = '#0f172a';
		ctx.font = '700 56px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText('CERTIFICATE', 200, 280);

		ctx.fillStyle = '#334155';
		ctx.font = '500 28px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText('이 증서는 아래 학습을 성실히 완료했음을 확인합니다.', 200, 340);

		// 이름(아이디)
		ctx.fillStyle = '#0f172a';
		ctx.font = '800 70px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText(userLabel, 200, 460);

		// 레슨명
		ctx.fillStyle = '#0f172a';
		ctx.font = '700 44px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		wrapText(ctx, `Course: ${lessonTitle}`, 200, 540, 1200, 52);

		// 날짜
		ctx.fillStyle = '#475569';
		ctx.font = '500 28px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText(`Issued at: ${dateStr}`, 200, 690);

		// 하단 서명 느낌
		ctx.fillStyle = '#0f172a';
		ctx.font = '700 30px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText('QuizNTalk', 1180, 820);

		ctx.fillStyle = '#94a3b8';
		ctx.font = '500 22px Pretendard, system-ui, -apple-system, Segoe UI, sans-serif';
		ctx.fillText('This certificate is generated in browser (MVP).', 200, 860);

		// 다운로드
		const a = document.createElement('a');
		a.href = canvas.toDataURL('image/png');
		a.download = `QuizNTalk_Certificate_${lessonTitle}.png`;
		a.click();
	}

	function roundRect(ctx, x, y, w, h, r) {
		const radius = Math.min(r, w / 2, h / 2);
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.arcTo(x + w, y, x + w, y + h, radius);
		ctx.arcTo(x + w, y + h, x, y + h, radius);
		ctx.arcTo(x, y + h, x, y, radius);
		ctx.arcTo(x, y, x + w, y, radius);
		ctx.closePath();
	}

	function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
		const words = String(text).split(' ');
		let line = '';
		for (let n = 0; n < words.length; n++) {
			const testLine = line + words[n] + ' ';
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, y);
	}

	function goStudy(lessonKey) {
		// 너 규칙대로 들어가면 됨
		// 예: /study/lesson_cognitive/0 (chapter 0부터)
		goto(`/study/${lessonKey}/0`);
	}
</script>

<Nav />

<div class="w-1280 m-auto px-10 py-10">
	<div class="flex items-end justify-between mb-8">
		<div>
			<div class="text-slate-400 text-sm font-semibold">Profile</div>
			<div class="font-dodum font-extrabold text-4xl text-slate-900 mt-2">내 프로필</div>
			<div class="text-slate-500 mt-2">
				{#if $authUser}
					{$authUser.email}
				{:else}
					로그인하면 성취율/인증서가 저장됩니다.
				{/if}
			</div>
		</div>
	</div>

	<!-- 상단 요약 -->
	<div class="grid grid-cols-3 gap-6 mb-10">
		<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
			<div class="text-slate-400 text-sm font-semibold">완료한 레슨</div>
			<div class="text-4xl font-extrabold text-slate-900 mt-2">
				{completedLessons}<span class="text-slate-400 text-2xl font-bold"> / {totalLessons}</span>
			</div>
			<div class="text-slate-500 mt-2">정적 레슨 기준</div>
		</div>

		<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
			<div class="text-slate-400 text-sm font-semibold">평균 성취율</div>
			<div class="text-4xl font-extrabold text-slate-900 mt-2">{avgPercent}%</div>
			<div class="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
				<div class="h-full bg-emerald-500" style="width:{avgPercent}%"></div>
			</div>
		</div>

		<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
			<div class="text-slate-400 text-sm font-semibold">발급 가능 인증서</div>
			<div class="text-4xl font-extrabold text-slate-900 mt-2">{certificatesReady.length}</div>
			<div class="text-slate-500 mt-2">완료한 레슨마다 1장</div>
		</div>
	</div>

	<!-- 레슨별 성취율 -->
	<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-10">
		<div class="flex items-center justify-between mb-6">
			<div>
				<div class="text-slate-400 text-sm font-semibold">Progress</div>
				<div class="text-2xl font-extrabold text-slate-900 mt-1">레슨 성취율</div>
			</div>
			<button
				class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
				on:click={() => goto('/study')}
			>
				수업 찾아보기
			</button>
		</div>

		<div class="grid grid-cols-2 gap-6">
			{#each lessonCards as l (l.url)}
				<div class="rounded-2xl border border-slate-100 p-6">
					<div class="flex items-start justify-between gap-4">
						<div>
							<div class="text-slate-400 text-xs font-semibold">{l.number} · {l.info}</div>
							<div class="text-xl font-extrabold text-slate-900 mt-1">{l.title}</div>
							<div class="text-slate-500 text-sm mt-2">{l.done}/{l.total} 완료</div>
						</div>

						{#if l.completed}
							<span
								class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"
							>
								완료 ✅
							</span>
						{:else}
							<span
								class="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100"
							>
								진행중
							</span>
						{/if}
					</div>

					<div class="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full bg-emerald-500" style="width:{l.percent}%"></div>
					</div>

					<div class="mt-5 flex items-center justify-between">
						<button
							class="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
							on:click={() => goStudy(l.lessonKey)}
						>
							계속하기
						</button>

						{#if l.completed}
							<button
								class="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
								on:click={() => downloadCertificate(l.title)}
							>
								인증서 발급
							</button>
						{:else}
							<button
								class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed"
								disabled
							>
								완료 후 발급
							</button>
						{/if}
					</div>

					<div class="mt-4 text-xs text-slate-400">
						목차: {#if Array.isArray(l.list)}{l.list.join(' · ')}{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- 인증서 섹션(발급 가능 목록) -->
	<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
		<div class="text-slate-400 text-sm font-semibold">Certification</div>
		<div class="text-2xl font-extrabold text-slate-900 mt-1 mb-6">인증서</div>

		{#if certificatesReady.length === 0}
			<div class="text-slate-500">
				아직 발급 가능한 인증서가 없어요. 레슨을 모두 완료하면 여기에서 발급할 수 있습니다.
			</div>
		{:else}
			<div class="grid grid-cols-3 gap-6">
				{#each certificatesReady as c (c.url)}
					<div class="rounded-2xl border border-slate-100 p-6">
						<div class="text-slate-400 text-xs font-semibold">Completed</div>
						<div class="text-lg font-extrabold text-slate-900 mt-1">{c.title}</div>
						<div class="text-slate-500 text-sm mt-2">{c.done}/{c.total} 완료</div>

						<button
							class="mt-5 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
							on:click={() => downloadCertificate(c.title)}
						>
							인증서 다운로드
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
