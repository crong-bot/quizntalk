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
	$: categories = categoryReady && Array.isArray(flags.categories) ? flags.categories.filter(Boolean) : [];
	$: storagePlaces =
		categoryReady && Array.isArray(flags.storagePlaces) ? flags.storagePlaces.filter(Boolean) : [];
   $: screenMode =
	items.length > 0 || flags.registerMode === true || currentMissionIndex >= 2
		? 'register'
		: flags.categoryReady === true || currentMissionIndex >= 1
			? 'category'
			: 'admin';
	$: console.log('🟣 [WEATHER SCREEN] 최종 화면 props', {
	currentMissionIndex,
	flags: simulationState?.flags,
	items
});			



	let finalShown = false;

	$: if (items.length >= 4 && !finalShown) {
		finalShown = true;
		setTimeout(() => {
			onFinalResultShown?.({ result: 'lostItemAppComplete' });
		}, 900);
	}
	

	function getItem(cardNumber) {
		return items.find((item) => item?.cardNumber === cardNumber);
	}
</script>

<div class="absolute left-2 top-2 z-[99999] rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white">
	TEST / items: {items.length}
</div>

<!-- 임시 강제 테스트: 여기 넣기 -->
<div class="absolute inset-0 z-[99998] overflow-auto bg-white p-3 text-slate-900">
	<div class="mb-3 text-lg font-black">
		강제 카드 테스트 / items: {items.length}
	</div>

	<div class="grid grid-cols-2 gap-2">
		{#each items as item}
			<article class="rounded-2xl border-4 border-red-500 bg-yellow-200 p-3">
				<div class="text-sm font-black text-blue-700">#{item.cardNumber}</div>
				<div class="mt-1 text-sm font-black">
					{item.category || '-'} · {item.color || '-'}
				</div>
				<div class="mt-1 text-xs font-bold">
					발견: {item.foundPlace || '-'}
				</div>
				<div class="text-xs font-bold">
					보관: {item.storagePlace || '-'}
				</div>
				<div class="mt-1 text-xs font-bold">
					특징: {item.features?.join(', ') || '-'}
				</div>
			</article>
		{/each}
	</div>
</div>

<div class="absolute inset-0 flex items-start justify-center overflow-hidden bg-slate-900 p-0">
	<div class="relative h-[145%] max-h-none aspect-[9/16]">
	
		<img
			src="/images/themes/weather-app/phone-mockup.png"
			alt="분실물찾기 앱"
			class="h-full w-full object-contain"
		/>

		<div class="absolute left-[12%] top-[8%] h-[84%] w-[76%] overflow-hidden rounded-[2rem] bg-slate-50">
			{#if screenMode === 'register'}
	<section class="relative h-full w-full overflow-auto bg-white p-3 text-slate-900">
		<div class="mb-3 flex items-center justify-between">
			<div>
				<div class="text-[10px] font-black tracking-[0.14em] text-blue-600">
					LOST ITEM LIST
				</div>
				<div class="text-lg font-black text-slate-950">
					분실물 목록
				</div>
				<div class="mt-0.5 text-xs font-bold text-slate-500">
					등록된 분실물 {items.length} / 4
				</div>
			</div>

			{#if items.length >= 4}
				<div class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
					목록 완성
				</div>
			{:else}
				<div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
					등록 중
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-2">
			{#each [1, 2, 3, 4] as cardNumber}
				{@const item = getItem(cardNumber)}

				<article class="min-h-[145px] rounded-2xl border border-slate-200 bg-yellow-50 p-3 shadow-sm">
					{#if item}
						<div class="flex items-center justify-between gap-2">
							<div class="shrink-0 text-xs font-black text-blue-700">
								#{item.cardNumber}
							</div>

							<div class="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
								{item.ownerFound ? '완료' : '찾는 중'}
							</div>
						</div>

						<div class="mt-2 truncate text-sm font-black text-slate-950">
							{item.category || '분실물'} · {item.color || '-'}
						</div>

						<div class="mt-2 space-y-0.5 text-[11px] font-bold leading-5 text-slate-700">
							<div class="truncate">발견: {item.foundPlace || '-'}</div>
							<div class="truncate">보관: {item.storagePlace || '-'}</div>
						</div>

						<div class="mt-2 line-clamp-2 text-[11px] font-bold leading-4 text-slate-500">
							특징: {item.features?.length ? item.features.join(', ') : '없음'}
						</div>
					{:else}
						<div class="text-xs font-black text-slate-400">#{cardNumber}</div>

						<div class="mt-10 text-center text-sm font-black text-slate-400">
							등록 대기
						</div>
					{/if}
				</article>
			{/each}
		</div>
	</section>
			{:else if screenMode === 'category'}
				<section class="h-full p-5">
					<div class="text-center">
						<div class="text-xl font-black text-slate-950">분류기준 만들기</div>
						<div class={`mt-1 text-sm font-bold ${categoryReady ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {categoryReady ? '분류 기준 준비 완료' : '분류 기준 설정 중'}
                        </div>
					</div>

					<div class="mt-6 rounded-2xl bg-slate-100 p-4">
						<div class="text-sm font-black text-slate-900">사용 가능한 종류</div>

						{#if categories.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each categories as category}
									<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
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

					<div class="mt-4 rounded-2xl bg-blue-50 p-4">
						<div class="text-sm font-black text-slate-900">보관장소</div>

						{#if storagePlaces.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each storagePlaces as place}
									<span class="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">
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
				<section class="flex h-full flex-col items-center justify-start p-5 text-center">
					<div class="flex h-24 w-24 items-center justify-center rounded-full {managerConnected ? 'bg-emerald-100' : 'bg-blue-100'}">
						<div class="text-5xl font-black {managerConnected ? 'text-emerald-600' : 'text-blue-700'}">
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
						<div class="text-xs font-black text-blue-700">미션 1</div>
						<div class="mt-2 text-base font-black text-slate-900">
							관리자 접속이 완료되면 분실물 등록 준비를 시작합니다.
						</div>
					</div>
				</section>
			{/if}
		</div>
	</div>
</div>