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
		{ key: '선사시대', label: '선사시대 전시관' },
		{ key: '삼국시대', label: '삼국시대 전시관' },
		{ key: '고려시대', label: '고려시대 전시관' },
		{ key: '조선시대', label: '조선시대 전시관' }
	];

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
					? '틀린 부분 확인 완료'
					: '시스템 오류 발생';

	$: visibleRelics = getDisplayRelics();
	$: relicRows = periodGroups.map((period) => ({
		...period,
		items: visibleRelics.filter((relic) => getRowPeriod(relic) === period.key)
	}));

	let finalShown = false;

	$: if (museumSystemRestored && !finalShown) {
		finalShown = true;
		setTimeout(() => {
			onFinalResultShown?.({ result: 'museumSystemRestored' });
		}, 900);
	}

	function getDisplayRelics() {
		if (exhibitionArranged) {
			return [...timeMuseumRelics].sort((a, b) => getPeriodOrder(a.period) - getPeriodOrder(b.period));
		}

		return getBrokenRelics();
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
				displayType: index % 2 === 0 ? '???' : relic.type,
				brokenRowPeriod: getBrokenRowPeriod(index)
			};
		});
	}

	function getBrokenRowPeriod(index) {
		const period = periodGroups[index % periodGroups.length];
		return period?.key ?? '선사시대';
	}

	function getRowPeriod(relic) {
		if (exhibitionArranged) return relic.period;
		if (relicCardsRestored) return relic.period;
		return relic.brokenRowPeriod ?? relic.period;
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

	function getPlacementText(relic, rowPeriod) {
		if (exhibitionArranged) return relic.period;
		if (relicCardsRestored) return relic.period === rowPeriod ? '정상 배치' : '배치 오류';
		return '배치 오류';
	}

	function getCardClass(relic, rowPeriod) {
		if (museumSystemRestored || exhibitionArranged) {
			return 'border-emerald-200 bg-white';
		}

		if (relicCardsRestored) {
			return relic.period === rowPeriod ? 'border-emerald-200 bg-white' : 'border-amber-200 bg-white';
		}

		if (systemDiagnosed) {
			return 'border-amber-200 bg-white';
		}

		return 'border-slate-200 bg-white';
	}

	function getTopStatusClass() {
		if (museumSystemRestored || exhibitionArranged) {
			return 'border-emerald-200 bg-emerald-100 text-emerald-700';
		}

		if (relicCardsRestored) {
			return 'border-blue-200 bg-blue-100 text-blue-700';
		}

		if (systemDiagnosed) {
			return 'border-amber-200 bg-amber-100 text-amber-700';
		}

		return 'border-rose-200 bg-rose-100 text-rose-700';
	}

	function getPlacementClass(relic, rowPeriod) {
		if (exhibitionArranged || museumSystemRestored) return 'text-emerald-700';
		if (relicCardsRestored && relic.period === rowPeriod) return 'text-emerald-700';
		return 'text-rose-600';
	}

	function imageFallback(event) {
		event.currentTarget.style.display = 'none';
		const fallback = event.currentTarget.nextElementSibling;
		if (fallback) fallback.classList.remove('hidden');
	}
</script>

<div class="absolute inset-0 bg-slate-200 p-2 text-slate-900">
	<div class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
		<div class="border-b border-slate-200 bg-slate-100 px-3 py-2">
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-1.5">
					<div class="h-3 w-3 rounded-full bg-rose-400"></div>
					<div class="h-3 w-3 rounded-full bg-amber-400"></div>
					<div class="h-3 w-3 rounded-full bg-emerald-400"></div>
				</div>

				<div class="flex min-w-0 flex-1 items-center rounded-full border border-slate-300 bg-white px-3 py-1.5">
					<div class="truncate text-[11px] font-bold text-slate-500">
						www.museum.go.kr/relic-information-system
					</div>
				</div>

				<div class={`rounded-full border px-3 py-1 text-[11px] font-black ${getTopStatusClass()}`}>
					{statusText}
				</div>
			</div>
		</div>

		<div class="border-b border-slate-200 px-3 py-2">
			<div class="flex items-end justify-between gap-3">
				<div>
					<div class="text-[16px] font-black text-slate-950">
						국립중앙박물관 유물정보관리시스템
					</div>
					
				</div>

				<div class="text-[11px] font-black text-slate-400">전체 유물 {timeMuseumRelics.length}개</div>
			</div>
		</div>

		<main class="min-h-0 flex-1 overflow-auto px-2.5 py-2">
			<div class="space-y-2">
				{#each relicRows as row}
					<section class="rounded-xl border border-slate-200 bg-slate-50 p-2">
						<div class="mb-1.5 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<div class="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black text-white">
									{row.label}
								</div>
								<div class="text-[10px] font-bold text-slate-400">
									{row.items.length}개 유물
								</div>
							</div>

							<div class="text-[10px] font-black text-slate-400">
								{row.key}
							</div>
						</div>

						<div class="grid grid-cols-3 gap-2">
							{#each row.items as relic (relic.id)}
								<article
									class={`overflow-hidden rounded-xl border p-2 transition-all duration-700 ${getCardClass(relic, row.key)}`}
								>
									<div
										class="relative flex h-[118px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
									>
										<img
											src={relic.imageSrc}
											alt={relic.name}
											class="h-full w-full object-contain p-1.5"
											on:error={imageFallback}
										/>

										<div class="hidden text-4xl">🏺</div>

										{#if !relicCardsRestored}
											<div class="absolute inset-0 flex items-center justify-center bg-white/55 text-3xl font-black text-slate-500 backdrop-blur-[1px]">
												?
											</div>
										{/if}
									</div>

									<div class="mt-1.5">
										<div class="truncate text-[12px] font-black text-slate-950">
											{getDisplayName(relic)}
										</div>

										<div class="mt-1 grid grid-cols-3 gap-1 text-[10px]">
											<div class="rounded-lg bg-slate-50 px-1.5 py-1">
												<div class="font-bold text-slate-400">시대</div>
												<div class="mt-0.5 truncate font-black text-slate-700">
													{getDisplayPeriod(relic)}
												</div>
											</div>

											<div class="rounded-lg bg-slate-50 px-1.5 py-1">
												<div class="font-bold text-slate-400">종류</div>
												<div class="mt-0.5 truncate font-black text-slate-700">
													{getDisplayType(relic)}
												</div>
											</div>

											<div class="rounded-lg bg-slate-50 px-1.5 py-1">
												<div class="font-bold text-slate-400">배치</div>
												<div class={`mt-0.5 truncate font-black ${getPlacementClass(relic, row.key)}`}>
													{getPlacementText(relic, row.key)}
												</div>
											</div>
										</div>
									</div>
								</article>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</main>

		<footer class="border-t border-slate-200 bg-slate-50 px-3 py-2">
			<div class="truncate text-[12px] font-black text-slate-700">
				{#if museumSystemRestored}
					모든 유물정보가 정상으로 복구되었습니다.
				{:else if exhibitionArranged}
					시대별 정보가 정리되었습니다.
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