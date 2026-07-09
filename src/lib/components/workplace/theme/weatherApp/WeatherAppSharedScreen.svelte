<script>
	export let simulationState = {
		layers: {},
		sprites: {},
		camera: {},
		flags: {}
	};

	export let onFinalResultShown = () => {};
	export let currentMissionIndex = 0;

	$: flags = simulationState?.flags ?? {};

	$: items = [flags.item1, flags.item2, flags.item3, flags.item4].filter(Boolean);

	$: managerConnected = flags.managerConnected === true;
	$: categoryReady = flags.categoryReady === true;

	$: categories =
		categoryReady && Array.isArray(flags.categories) ? flags.categories.filter(Boolean) : [];

	$: storagePlaces =
		categoryReady && Array.isArray(flags.storagePlaces) ? flags.storagePlaces.filter(Boolean) : [];

	$: screenMode =
		items.length > 0 || flags.registerMode === true || currentMissionIndex >= 2
			? 'register'
			: flags.categoryReady === true || currentMissionIndex >= 1
				? 'category'
				: 'admin';

	// 카드/화면 상태가 바뀔 때 폰 내부 화면을 강제로 다시 그림
	$: weatherScreenKey = [
		currentMissionIndex,
		screenMode,
		flags.managerConnected === true ? 'manager-on' : 'manager-off',
		flags.categoryReady === true ? 'category-on' : 'category-off',
		flags.registerMode === true ? 'register-on' : 'register-off',
		items
			.map((item) =>
				[
					item?.cardNumber ?? '',
					item?.category ?? '',
					item?.color ?? '',
					item?.foundPlace ?? '',
					item?.storagePlace ?? '',
					Array.isArray(item?.features) ? item.features.join('|') : '',
					item?.ownerFound === true ? 'done' : 'finding'
				].join(':')
			)
			.join(',')
	].join('|');

	$: console.log('🟣 [WEATHER SCREEN] 화면 상태', {
		currentMissionIndex,
		screenMode,
		weatherScreenKey,
		flags,
		items
	});

	let finalShown = false;

	$: if (items.length >= 4 && !finalShown) {
		finalShown = true;

		setTimeout(() => {
			onFinalResultShown?.({ result: 'lostItemAppComplete' });
		}, 900);
	}

	$: if (items.length < 4 && finalShown) {
		finalShown = false;
	}

	function getItem(cardNumber) {
		return items.find((item) => Number(item?.cardNumber) === Number(cardNumber));
	}
</script>

<div class="absolute inset-0 flex items-start justify-center overflow-hidden bg-slate-900 p-0">
	<div class="relative h-[145%] max-h-none aspect-[9/16]">
		<img
			src="/images/themes/weather-app/phone-mockup.png"
			alt="분실물찾기 앱"
			class="h-full w-full object-contain"
		/>

		{#key weatherScreenKey}
			<div class="absolute left-[12%] top-[8%] h-[84%] w-[76%] overflow-hidden rounded-[2rem] bg-slate-50">
				{#if items.length > 0 || flags.registerMode === true || currentMissionIndex >= 2}
					<section class="flex h-full flex-col bg-white p-3 text-slate-900">
						<div class="mb-2 flex items-center justify-between">
							<div>
								<div class="text-[9px] font-black tracking-[0.14em] text-blue-600">
									LOST ITEM LIST
								</div>

								<div class="text-base font-black text-slate-950">
									분실물 목록
								</div>

								<div class="mt-0.5 text-[10px] font-bold text-slate-500">
									등록된 분실물 {items.length} / 4
								</div>
							</div>

							{#if items.length >= 4}
								<div class="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
									목록 완성
								</div>
							{:else}
								<div class="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500">
									등록 중
								</div>
							{/if}
						</div>

						<div class="min-h-0 flex-1 overflow-y-auto pb-2">
							<div class="grid grid-cols-2 gap-1.5">
								{#each [1, 2, 3, 4] as cardNumber}
									{@const item = getItem(cardNumber)}

									<article class="min-h-[98px] rounded-xl border border-slate-200 bg-yellow-50 px-2 py-1.5 shadow-sm">
										{#if item}
											<div class="flex items-center justify-between gap-1">
												<div class="shrink-0 text-[10px] font-black text-blue-700">
													#{item.cardNumber}
												</div>

												<div class="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-black text-amber-700">
													{item.ownerFound ? '완료' : '찾는 중'}
												</div>
											</div>

											<div class="mt-1 truncate text-[11px] font-black text-slate-950">
												{item.category || '분실물'} · {item.color || '-'}
											</div>

											<div class="mt-1 text-[9px] font-bold leading-4 text-slate-700">
												<div class="truncate">발견: {item.foundPlace || '-'}</div>
												<div class="truncate">보관: {item.storagePlace || '-'}</div>
											</div>

											<div class="mt-0.5 truncate text-[9px] font-bold leading-4 text-slate-500">
												특징: {item.features?.length ? item.features.join(', ') : '없음'}
											</div>
										{:else}
											<div class="text-[10px] font-black text-slate-400">
												#{cardNumber}
											</div>

											<div class="mt-6 text-center text-[11px] font-black text-slate-400">
												등록 대기
											</div>
										{/if}
									</article>
								{/each}
							</div>
						</div>
					</section>
				{:else if screenMode === 'category'}
					<section class="h-full overflow-auto bg-white p-4 text-slate-900">
						<div class="text-center">
							<div class="text-lg font-black text-slate-950">
								분류기준 만들기
							</div>

							<div
								class={`mt-1 text-xs font-bold ${
									categoryReady ? 'text-emerald-600' : 'text-slate-500'
								}`}
							>
								{categoryReady ? '분류 기준 준비 완료' : '분류 기준 설정 중'}
							</div>
						</div>

						<div class="mt-4 rounded-2xl bg-slate-100 p-3">
							<div class="text-xs font-black text-slate-900">
								사용 가능한 종류
							</div>

							{#if categories.length > 0}
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each categories as category}
										<span class="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-black text-blue-700">
											{category}
										</span>
									{/each}
								</div>
							{:else}
								<div class="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-xs font-black text-slate-400">
									분류 기준 입력 대기 중
								</div>
							{/if}
						</div>

						<div class="mt-3 rounded-2xl bg-blue-50 p-3">
							<div class="text-xs font-black text-slate-900">
								보관장소
							</div>

							{#if storagePlaces.length > 0}
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each storagePlaces as place}
										<span class="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-blue-700">
											{place}
										</span>
									{/each}
								</div>
							{:else}
								<div class="mt-3 rounded-xl border border-dashed border-blue-200 bg-white/70 px-3 py-4 text-center text-xs font-black text-blue-300">
									보관장소 입력 대기 중
								</div>
							{/if}
						</div>
					</section>
				{:else}
					<section class="flex h-full flex-col items-center justify-start bg-white p-5 text-center text-slate-900">
						<div
							class={`flex h-24 w-24 items-center justify-center rounded-full ${
								managerConnected ? 'bg-emerald-100' : 'bg-blue-100'
							}`}
						>
							<div
								class={`text-5xl font-black ${
									managerConnected ? 'text-emerald-600' : 'text-blue-700'
								}`}
							>
								{managerConnected ? '✓' : '관리'}
							</div>
						</div>

						<div class="mt-4 text-2xl font-black text-slate-950">
							{managerConnected ? '관리자접속 완료' : '접속대기 중'}
						</div>

						<div class="mt-3 text-sm font-bold text-slate-500">
							{managerConnected
								? '분실물 등록 시스템을 사용할 수 있습니다.'
								: '접속 정보를 확인하는 중입니다.'}
						</div>

						<div class="mt-4 rounded-2xl bg-slate-100 p-4 text-left">
							<div class="text-xs font-black text-blue-700">
								미션 1
							</div>

							<div class="mt-2 text-base font-black text-slate-900">
								관리자 접속이 완료되면 분실물 등록 준비를 시작합니다.
							</div>
						</div>
					</section>
				{/if}
			</div>
		{/key}
	</div>
</div>