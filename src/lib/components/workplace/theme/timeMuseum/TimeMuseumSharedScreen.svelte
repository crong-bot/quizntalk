<script>
	import { timeMuseumRelics } from './timeMuseumCourse.js';
	import { timeMuseumLayerKeys } from './timeMuseumLayers.js';

	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {}
	};

	export let onFinalResultShown = () => {};

	const periodGroups = [
		{
			key: '선사시대',
			label: '선사시대 전시관'
		},
		{
			key: '삼국시대',
			label: '삼국시대 전시관'
		},
		{
			key: '고려시대',
			label: '고려시대 전시관'
		},
		{
			key: '조선시대',
			label: '조선시대 전시관'
		}
	];

	/*
	 * =========================================
	 * 기본 상태
	 *
	 * 첫 렌더링 때 undefined가 되지 않도록
	 * 반드시 기본값을 먼저 선언한다.
	 * =========================================
	 */

	let restoredPeriods = {
		선사시대: false,
		삼국시대: false,
		고려시대: false,
		조선시대: false
	};

	$: layers = simulationState?.layers ?? {};

	$: systemDiagnosed = layers[timeMuseumLayerKeys.systemDiagnosed] === true;

	$: relicCardsRestored = layers[timeMuseumLayerKeys.relicCardsRestored] === true;

	$: exhibitionArranged = layers[timeMuseumLayerKeys.exhibitionArranged] === true;

	$: museumSystemRestored = layers[timeMuseumLayerKeys.museumSystemRestored] === true;

	$: restoredPeriods = {
		선사시대: relicCardsRestored || layers[timeMuseumLayerKeys.prehistoryRestored] === true,

		삼국시대: relicCardsRestored || layers[timeMuseumLayerKeys.threeKingdomsRestored] === true,

		고려시대: relicCardsRestored || layers[timeMuseumLayerKeys.goryeoRestored] === true,

		조선시대: relicCardsRestored || layers[timeMuseumLayerKeys.joseonRestored] === true
	};

	$: restoredCount = Object.values(restoredPeriods).filter(Boolean).length;

	$: statusText = museumSystemRestored
		? '시스템 정상'
		: restoredCount > 0
		  ? '데이터 복구 중'
		  : systemDiagnosed
		    ? '오류 확인 완료'
		    : '시스템 오류';

	/*
	 * =========================================
	 * 시대별 유물 목록
	 * =========================================
	 */

	$: relicRows = periodGroups.map((period) => ({
		...period,

		items: getRelicsForPeriod(period.key)
	}));

	function getRelicsForPeriod(period) {
		/*
		 * 조선시대
		 *
		 * 복구 전:
		 * 백자 달항아리
		 * 단원 풍속도첩
		 * 금속활자 ← 잘못 들어옴
		 *
		 * 복구 후:
		 * 백자 달항아리
		 * 단원 풍속도첩
		 * 대동여지도
		 */

		if (period === '조선시대' && !isPeriodRestored('조선시대') && !museumSystemRestored) {
			const moonJar = findRelic('moon-jar');

			const paintings = findRelic('genre-paintings');

			const metalType = findRelic('metal-type');

			return [moonJar, paintings, metalType].filter(Boolean);
		}

		return timeMuseumRelics.filter((relic) => relic.period === period);
	}

	function findRelic(id) {
		return timeMuseumRelics.find((relic) => relic.id === id);
	}

	/*
	 * =========================================
	 * 화면 표시 이름
	 * =========================================
	 */

	function getDisplayName(relic, rowPeriod) {
		if (isPeriodRestored(rowPeriod) || museumSystemRestored) {
			return relic.shortName ?? relic.name;
		}

		/*
		 * 선사시대 이름 오류
		 *
		 * 딱 주먹도끼 하나만 틀린다.
		 */
		if (rowPeriod === '선사시대' && relic.id === 'hand-axe') {
			return '반달돌칼';
		}

		/*
		 * 고려시대 이름 오류
		 *
		 * 청자 매병 하나만 틀린다.
		 */
		if (rowPeriod === '고려시대' && relic.id === 'celadon-maebyeong') {
			return '금속활자';
		}

		return relic.shortName ?? relic.name;
	}

	/*
	 * =========================================
	 * 시대
	 *
	 * 시대 오류는 사용하지 않는다.
	 * =========================================
	 */

	function getDisplayPeriod(relic, rowPeriod) {
		/*
		 * 조선 전시관에 잘못 들어온
		 * 금속활자를 보고 바로 답이
		 * 나오지 않도록 화면상 시대는
		 * 조선시대로 표시한다.
		 *
		 * 배치는 전시 목록을 보고
		 * 판단하게 한다.
		 */
		if (rowPeriod === '조선시대' && relic.id === 'metal-type' && !isPeriodRestored('조선시대')) {
			return '조선시대';
		}

		return relic.period;
	}

	/*
	 * =========================================
	 * 종류
	 * =========================================
	 */

	function getDisplayType(relic, rowPeriod) {
		if (isPeriodRestored(rowPeriod) || museumSystemRestored) {
			return relic.type;
		}

		/*
		 * 삼국시대 종류 오류
		 *
		 * 신라 금관 하나만 틀린다.
		 */
		if (rowPeriod === '삼국시대' && relic.id === 'silla-gold-crown') {
			return '도자기';
		}

		return relic.type;
	}

	function isPeriodRestored(period) {
		return restoredPeriods?.[period] === true;
	}

	/*
	 * =========================================
	 * 섹션 상태
	 * =========================================
	 */

	function getSectionStatusText(row) {
		if (isPeriodRestored(row.key)) {
			return '복구 완료';
		}

		if (systemDiagnosed) {
			return '오류 확인됨';
		}

		return '검사 필요';
	}

	function getSectionStatusClass(row) {
		if (isPeriodRestored(row.key)) {
			return 'border-emerald-200 bg-emerald-100 text-emerald-700';
		}

		if (systemDiagnosed) {
			return 'border-amber-200 bg-amber-100 text-amber-700';
		}

		return 'border-slate-200 bg-white text-slate-500';
	}

	function getTopStatusClass() {
		if (museumSystemRestored) {
			return 'border-emerald-200 bg-emerald-100 text-emerald-700';
		}

		if (restoredCount > 0) {
			return 'border-blue-200 bg-blue-100 text-blue-700';
		}

		if (systemDiagnosed) {
			return 'border-amber-200 bg-amber-100 text-amber-700';
		}

		return 'border-rose-200 bg-rose-100 text-rose-700';
	}

	/*
	 * =========================================
	 * 복구 애니메이션
	 * =========================================
	 */

	let initialized = false;

	let previousRestoredPeriods = {
		선사시대: false,
		삼국시대: false,
		고려시대: false,
		조선시대: false
	};

	let previousMuseumSystemRestored = false;

	let animatingPeriod = null;

	let periodAnimationToken = 0;

	let finalRestoreAnimating = false;

	$: {
		const currentPeriods = restoredPeriods;

		if (!initialized) {
			previousRestoredPeriods = {
				...currentPeriods
			};

			previousMuseumSystemRestored = museumSystemRestored;

			initialized = true;
		} else {
			const justFinalRestored =
				museumSystemRestored === true && previousMuseumSystemRestored === false;

			if (justFinalRestored) {
				startFinalRestoreAnimation();
			} else {
				for (const period of Object.keys(currentPeriods)) {
					if (currentPeriods[period] === true && previousRestoredPeriods[period] === false) {
						startPeriodRestoreAnimation(period);

						break;
					}
				}
			}

			previousRestoredPeriods = {
				...currentPeriods
			};

			previousMuseumSystemRestored = museumSystemRestored;
		}
	}

	function startPeriodRestoreAnimation(period) {
		const token = ++periodAnimationToken;

		animatingPeriod = period;

		setTimeout(() => {
			if (token !== periodAnimationToken) {
				return;
			}

			animatingPeriod = null;
		}, 1600);
	}

	function startFinalRestoreAnimation() {
		animatingPeriod = null;

		finalRestoreAnimating = true;

		setTimeout(() => {
			finalRestoreAnimating = false;
		}, 2100);
	}

	/*
	 * =========================================
	 * 최종 콜백
	 * =========================================
	 */

	let finalShown = false;

	$: if (museumSystemRestored && !finalShown) {
		finalShown = true;

		setTimeout(() => {
			onFinalResultShown?.({
				result: 'museumSystemRestored'
			});
		}, 2100);
	}

	function imageFallback(event) {
		event.currentTarget.style.display = 'none';

		const fallback = event.currentTarget.nextElementSibling;

		if (fallback) {
			fallback.classList.remove('hidden');
		}
	}
</script>

<div class="absolute inset-0 bg-slate-200 p-2 text-slate-900">
	<div
		class={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-xl transition-all duration-700 ${
			finalRestoreAnimating ? 'border-emerald-400 shadow-2xl' : 'border-slate-300'
		}`}
	>
		<!-- =================================== -->
		<!-- 브라우저 -->
		<!-- =================================== -->

		<div class="shrink-0 border-b border-slate-300 bg-slate-100 px-3 py-2">
			<div class="flex items-center gap-3">
				<div class="flex shrink-0 items-center gap-1.5">
					<div class="h-3 w-3 rounded-full bg-rose-400"></div>

					<div class="h-3 w-3 rounded-full bg-amber-400"></div>

					<div class="h-3 w-3 rounded-full bg-emerald-400"></div>
				</div>

				<div
					class="flex min-w-0 flex-1 items-center rounded-full border border-slate-300 bg-white px-3 py-1.5"
				>
					<div class="truncate text-[11px] font-bold text-slate-500">
						www.museum.go.kr/relic-information-system
					</div>
				</div>

				<div
					class={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-black ${getTopStatusClass()}`}
				>
					{statusText}
				</div>
			</div>
		</div>

		<!-- =================================== -->
		<!-- 사이트 헤더 -->
		<!-- =================================== -->

		<div class="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
			<div class="flex items-center justify-between gap-4">
				<div class="min-w-0">
					<div class="truncate text-[17px] font-black tracking-tight text-slate-950">
						국립중앙박물관 유물정보관리시스템
					</div>

					<div class="mt-0.5 text-[11px] font-bold text-slate-400">
						유물정보 데이터베이스 · 전시관 관리
					</div>
				</div>

				<div class="flex shrink-0 items-center gap-4">
					<div class="text-right">
						<div class="text-[10px] font-bold text-slate-400">복구 진행</div>

						<div class="text-[14px] font-black text-slate-900">
							{restoredCount}
							<span class="text-slate-400"> / 4 </span>
						</div>
					</div>

					<div class="h-8 w-px bg-slate-200"></div>

					<div class="text-right">
						<div class="text-[10px] font-bold text-slate-400">등록 유물</div>

						<div class="text-[14px] font-black text-slate-900">
							{timeMuseumRelics.length}개
						</div>
					</div>
				</div>
			</div>

			<div class="mt-2 grid grid-cols-4 gap-1">
				{#each periodGroups as period}
					<div
						class={`h-1.5 rounded-full transition-all duration-500 ${
							isPeriodRestored(period.key) ? 'bg-emerald-400' : 'bg-slate-200'
						}`}
					></div>
				{/each}
			</div>
		</div>

		<!-- =================================== -->
		<!-- 본문 -->
		<!-- =================================== -->

		<main class="min-h-0 flex-1 overflow-auto bg-slate-50 px-3 py-3">
			<div class="space-y-3">
				{#each relicRows as row}
					<section
						class={`relative overflow-hidden rounded-xl border bg-white transition-all duration-500 ${
							animatingPeriod === row.key
								? 'scale-[1.006] border-emerald-400 shadow-lg'
								: isPeriodRestored(row.key)
								  ? 'border-emerald-200 shadow-sm'
								  : 'border-slate-200 shadow-sm'
						}`}
					>
						<!-- 시대 제목 -->

						<div
							class={`flex items-center justify-between border-b px-3 py-2 ${
								isPeriodRestored(row.key)
									? 'border-emerald-100 bg-emerald-50/60'
									: 'border-slate-200 bg-slate-50'
							}`}
						>
							<div class="flex items-center gap-2">
								<div class="text-[14px] font-black text-slate-900">
									{row.label}
								</div>

								<div class="text-[10px] font-bold text-slate-400">3개 유물</div>
							</div>

							<div
								class={`rounded-full border px-2.5 py-1 text-[10px] font-black ${getSectionStatusClass(
									row
								)}`}
							>
								{#if isPeriodRestored(row.key)}
									✓
								{/if}

								{getSectionStatusText(row)}
							</div>
						</div>

						<!-- 유물 카드 -->

						<div class="grid grid-cols-3 gap-2 p-2.5">
							{#each row.items as relic, index (relic.id)}
								<article
									class={`overflow-hidden rounded-xl border bg-white p-2 transition-all duration-500 ${
										isPeriodRestored(row.key) ? 'border-emerald-200' : 'border-slate-200'
									} ${animatingPeriod === row.key ? 'restore-card' : ''}`}
									style={animatingPeriod === row.key ? `animation-delay: ${index * 150}ms` : ''}
								>
									<div
										class="flex h-[100px] items-center justify-center overflow-hidden rounded-lg bg-slate-50"
									>
										<img
											src={relic.imageSrc}
											alt={relic.name}
											class="h-full w-full object-contain p-1.5"
											on:error={imageFallback}
										/>

										<div class="hidden text-4xl">🏺</div>
									</div>

									<!-- 이름 -->

									<div class="mt-2 truncate text-[13px] font-black text-slate-950">
										{getDisplayName(relic, row.key)}
									</div>

									<!-- 정보 -->

									<div class="mt-2 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
										<div
											class="flex items-center justify-between gap-2 border-b border-slate-100 px-2 py-1.5"
										>
											<span class="shrink-0 text-[9px] font-bold text-slate-400"> 시대 </span>

											<span class="truncate text-right text-[10px] font-black text-slate-700">
												{getDisplayPeriod(relic, row.key)}
											</span>
										</div>

										<div class="flex items-center justify-between gap-2 px-2 py-1.5">
											<span class="shrink-0 text-[9px] font-bold text-slate-400"> 종류 </span>

											<span class="truncate text-right text-[10px] font-black text-slate-700">
												{getDisplayType(relic, row.key)}
											</span>
										</div>
									</div>

									{#if isPeriodRestored(row.key)}
										<div
											class="mt-1.5 flex items-center gap-1 text-[9px] font-black text-emerald-600"
										>
											<span>✓</span>
											<span> 데이터 정상 </span>
										</div>
									{:else}
										<div class="mt-1.5 text-[9px] font-bold text-slate-400">데이터 확인 필요</div>
									{/if}
								</article>
							{/each}
						</div>

						<!-- 미션2 복구 효과 -->

						{#if animatingPeriod === row.key}
							<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl">
								<div class="absolute inset-0 bg-emerald-100/15"></div>

								<div
									class="restore-scan absolute left-0 right-0 h-[3px] bg-emerald-400/90 shadow-[0_0_14px_rgba(52,211,153,0.85)]"
								></div>

								<div class="absolute inset-0 flex items-center justify-center">
									<div
										class="restore-badge rounded-xl border border-emerald-300 bg-white/95 px-5 py-3 text-center shadow-xl"
									>
										<div class="text-[9px] font-black tracking-[0.16em] text-emerald-500">
											DATA RESTORED
										</div>

										<div class="mt-0.5 text-[14px] font-black text-emerald-700">
											✓ {row.key} 데이터 복구
										</div>
									</div>
								</div>
							</div>
						{/if}
					</section>
				{/each}
			</div>
		</main>

		<!-- =================================== -->
		<!-- 하단 -->
		<!-- =================================== -->

		<footer class="shrink-0 border-t border-slate-200 bg-white px-4 py-2.5">
			<div class="flex items-center justify-between gap-4">
				<div class="truncate text-[11px] font-black text-slate-700">
					{#if museumSystemRestored}
						✓ 모든 유물정보가 정상적으로 복구되었습니다.
					{:else if restoredCount > 0}
						담당 시대 데이터 복구 완료 · 팀원들과 전체 데이터를 완성하세요.
					{:else if systemDiagnosed}
						오류 확인 완료 · 담당 시대 데이터를 복구하세요.
					{:else}
						⚠ 유물정보에서 이상 데이터가 감지되었습니다.
					{/if}
				</div>

				<div class="shrink-0 text-[9px] font-black text-slate-400">MUSEUM DATA SYSTEM</div>
			</div>
		</footer>

		<!-- =================================== -->
		<!-- 미션3 전체 복구 -->
		<!-- =================================== -->

		{#if finalRestoreAnimating}
			<div class="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-2xl">
				<div class="final-overlay absolute inset-0 bg-emerald-100/30"></div>

				<div
					class="final-scan absolute left-0 right-0 h-[4px] bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.95)]"
				></div>

				<div class="absolute inset-0 flex items-center justify-center">
					<div
						class="final-result rounded-2xl border border-emerald-300 bg-white/95 px-8 py-6 text-center shadow-2xl"
					>
						<div class="text-[10px] font-black tracking-[0.24em] text-emerald-500">
							MUSEUM DATA SYSTEM
						</div>

						<div class="mt-1 text-[11px] font-black tracking-[0.18em] text-emerald-500">
							SYSTEM RESTORED
						</div>

						<div class="mt-2 text-[22px] font-black text-emerald-700">✓ 전체 시스템 복구 완료</div>

						<div class="mt-1 text-[11px] font-bold text-slate-500">
							모든 유물정보가 정상으로 돌아왔습니다.
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes restoreScan {
		0% {
			top: -4px;
			opacity: 0;
		}

		8% {
			opacity: 1;
		}

		90% {
			opacity: 1;
		}

		100% {
			top: 100%;
			opacity: 0;
		}
	}

	.restore-scan {
		animation: restoreScan 1.2s ease-in-out forwards;
	}

	@keyframes restoreCard {
		0% {
			opacity: 0.45;
			transform: scale(0.95);
			filter: blur(2px);
		}

		45% {
			opacity: 1;
			transform: scale(1.035);
			filter: blur(0);
		}

		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	.restore-card {
		animation: restoreCard 0.7s ease-out both;
	}

	@keyframes restoreBadge {
		0% {
			opacity: 0;
			transform: scale(0.88);
		}

		18% {
			opacity: 1;
			transform: scale(1.05);
		}

		72% {
			opacity: 1;
			transform: scale(1);
		}

		100% {
			opacity: 0;
			transform: scale(0.98);
		}
	}

	.restore-badge {
		animation: restoreBadge 1.45s ease-out forwards;
	}

	@keyframes finalScan {
		0% {
			top: -6px;
			opacity: 0;
		}

		8% {
			opacity: 1;
		}

		92% {
			opacity: 1;
		}

		100% {
			top: 100%;
			opacity: 0;
		}
	}

	.final-scan {
		animation: finalScan 1.55s ease-in-out forwards;
	}

	@keyframes finalOverlay {
		0% {
			opacity: 0;
		}

		20% {
			opacity: 1;
		}

		80% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	.final-overlay {
		animation: finalOverlay 2s ease-out forwards;
	}

	@keyframes finalResult {
		0% {
			opacity: 0;
			transform: scale(0.84) translateY(10px);
		}

		18% {
			opacity: 1;
			transform: scale(1.04) translateY(0);
		}

		75% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}

		100% {
			opacity: 0;
			transform: scale(0.98) translateY(-5px);
		}
	}

	.final-result {
		animation: finalResult 2s ease-out forwards;
	}
</style>
