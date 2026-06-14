<script>
	import { timeMuseumRelics } from './timeMuseumCourse.js';
	import { timeMuseumLayerKeys } from './timeMuseumLayers.js';

	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {}
	};

	export let onFinalResultShown = () => {};

	$: layers = simulationState?.layers ?? {};

	$: systemDiagnosed = layers[timeMuseumLayerKeys.systemDiagnosed] === true;
	$: relicCardsRestored = layers[timeMuseumLayerKeys.relicCardsRestored] === true;
	$: exhibitionArranged = layers[timeMuseumLayerKeys.exhibitionArranged] === true;
	$: museumSystemRestored = layers[timeMuseumLayerKeys.museumSystemRestored] === true;

	$: statusText = museumSystemRestored
		? '시스템 정상'
		: exhibitionArranged
		  ? '시대별 정보 복구 완료'
		  : relicCardsRestored
		    ? '유물정보 카드 복구 완료'
		    : systemDiagnosed
		      ? '오류 확인 완료'
		      : '시스템 오류 발생';

	$: statusClass = museumSystemRestored
		? 'border-emerald-200 bg-emerald-50 text-emerald-700'
		: systemDiagnosed
		  ? 'border-amber-200 bg-amber-50 text-amber-700'
		  : 'border-rose-200 bg-rose-50 text-rose-700';

	$: visibleRelics = exhibitionArranged
		? [...timeMuseumRelics].sort((a, b) => getPeriodOrder(a.period) - getPeriodOrder(b.period))
		: getBrokenRelics();

	let finalShown = false;

	$: if (museumSystemRestored && !finalShown) {
		finalShown = true;
		setTimeout(() => {
			onFinalResultShown?.({ result: 'museumSystemRestored' });
		}, 900);
	}

	function getPeriodOrder(period) {
		const order = {
			선사시대: 1,
			삼국시대: 2,
			고려시대: 3,
			조선시대: 4
		};

		return order[period] ?? 99;
	}

	function getBrokenRelics() {
		return timeMuseumRelics.map((relic, index) => {
			if (relicCardsRestored) return relic;

			const wrongPeriods = ['조선시대', '선사시대', '고려시대', '삼국시대'];

			return {
				...relic,
				displayName: index % 3 === 0 ? '???' : relic.shortName,
				displayPeriod: index % 4 === 0 ? wrongPeriods[index % wrongPeriods.length] : '???',
				displayType: index % 2 === 0 ? '???' : relic.type
			};
		});
	}

	function getDisplayName(relic) {
		if (relicCardsRestored) return relic.shortName ?? relic.name;
		return relic.displayName ?? '???';
	}

	function getDisplayPeriod(relic) {
		if (relicCardsRestored || exhibitionArranged) return relic.period;
		return relic.displayPeriod ?? '???';
	}

	function getDisplayType(relic) {
		if (relicCardsRestored) return relic.type;
		return relic.displayType ?? '???';
	}

	function getPlacementText(relic) {
		if (exhibitionArranged) return relic.period;
		return '배치 오류';
	}

	function getRowClass() {
		if (museumSystemRestored || exhibitionArranged) {
			return 'border-emerald-100 bg-white';
		}

		if (relicCardsRestored) {
			return 'border-blue-100 bg-white';
		}

		if (systemDiagnosed) {
			return 'border-amber-200 bg-amber-50';
		}

		return 'border-rose-200 bg-rose-50';
	}

	function imageFallback(event) {
		event.currentTarget.style.display = 'none';
		const fallback = event.currentTarget.nextElementSibling;
		if (fallback) fallback.classList.remove('hidden');
	}
</script>

<div class="absolute inset-0 bg-slate-100 p-3 text-slate-900">
	<div
		class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
	>
		<header class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
			<div>
				<div class="text-[17px] font-black text-slate-950">국립중앙박물관 유물정보관리시스템</div>
				<div class="mt-0.5 text-[11px] font-bold text-slate-500">유물 데이터 복구 관리 화면</div>
			</div>

			<div class={`rounded-full border px-3 py-1.5 text-[11px] font-black ${statusClass}`}>
				{statusText}
			</div>
		</header>

		<section class="grid grid-cols-3 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
			<div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
				<div class="text-[10px] font-black text-slate-400">MISSION 1</div>
				<div
					class={`mt-0.5 text-[12px] font-black ${
						systemDiagnosed ? 'text-emerald-700' : 'text-rose-600'
					}`}
				>
					{systemDiagnosed ? '틀린 부분 확인 완료' : '틀린 부분 확인 필요'}
				</div>
			</div>

			<div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
				<div class="text-[10px] font-black text-slate-400">MISSION 2</div>
				<div
					class={`mt-0.5 text-[12px] font-black ${
						relicCardsRestored ? 'text-emerald-700' : 'text-slate-500'
					}`}
				>
					{relicCardsRestored ? '유물정보 카드 복구' : '유물정보 복구 대기'}
				</div>
			</div>

			<div class="rounded-xl border border-slate-200 bg-white px-3 py-2">
				<div class="text-[10px] font-black text-slate-400">MISSION 3</div>
				<div
					class={`mt-0.5 text-[12px] font-black ${
						exhibitionArranged ? 'text-emerald-700' : 'text-slate-500'
					}`}
				>
					{exhibitionArranged ? '시대별 정보 복구' : '시대별 복구 대기'}
				</div>
			</div>
		</section>

		<main class="min-h-0 flex-1 overflow-auto p-3">
			<div class="mb-2 flex items-center justify-between">
				<div>
					<div class="text-[14px] font-black text-slate-900">전체 유물정보 목록</div>
					<div class="text-[11px] font-bold text-slate-500">
						미션이 진행될수록 손상된 데이터가 원래 정보로 복구됩니다.
					</div>
				</div>

				<div class="text-[11px] font-black text-slate-400">
					총 {timeMuseumRelics.length}개
				</div>
			</div>

			<div class="grid grid-cols-3 gap-2">
				{#each visibleRelics as relic (relic.id)}
					<article
						class={`flex min-h-[92px] gap-3 rounded-2xl border p-2 transition-all duration-700 ${getRowClass()}`}
					>
						<div
							class="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
						>
							<img
								src={relic.imageSrc}
								alt={relic.name}
								class="h-full w-full object-contain p-1"
								on:error={imageFallback}
							/>

							<div class="hidden text-2xl">🏺</div>

							{#if !relicCardsRestored}
								<div
									class="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-xl font-black text-white"
								>
									?
								</div>
							{/if}
						</div>

						<div class="min-w-0 flex-1">
							<div class="truncate text-[13px] font-black text-slate-950">
								{getDisplayName(relic)}
							</div>

							<div class="mt-1.5 space-y-0.5 text-[10px] font-bold">
								<div class="flex justify-between gap-2">
									<span class="text-slate-400">시대</span>
									<span class="font-black text-slate-700">{getDisplayPeriod(relic)}</span>
								</div>

								<div class="flex justify-between gap-2">
									<span class="text-slate-400">종류</span>
									<span class="font-black text-slate-700">{getDisplayType(relic)}</span>
								</div>

								<div class="flex justify-between gap-2">
									<span class="text-slate-400">배치</span>
									<span
										class={`font-black ${
											exhibitionArranged ? 'text-emerald-700' : 'text-rose-600'
										}`}
									>
										{getPlacementText(relic)}
									</span>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</main>

		<footer class="border-t border-slate-200 bg-slate-50 px-4 py-2">
			<div class="text-[12px] font-black text-slate-700">
				{#if museumSystemRestored}
					✅ 모든 유물정보가 정상으로 복구되었습니다.
				{:else if exhibitionArranged}
					✅ 시대별 정보가 정리되었습니다.
				{:else if relicCardsRestored}
					유물정보 카드가 복구되었습니다. 이제 시대별 정보 복구가 필요합니다.
				{:else if systemDiagnosed}
					틀린 부분이 확인되었습니다. 유물정보 카드 복구를 진행하세요.
				{:else}
					유물정보관리시스템에 오류가 발생했습니다. 먼저 틀린 부분을 확인하세요.
				{/if}
			</div>
		</footer>
	</div>
</div>
