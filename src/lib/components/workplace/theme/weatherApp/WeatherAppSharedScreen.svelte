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
    $: screenMode =
        currentMissionIndex >= 2 || flags.registerMode === true || items.length > 0
            ? 'register'
            : currentMissionIndex >= 1
                ? 'category'
                : 'admin';

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

<div class="absolute inset-0 flex items-start justify-center overflow-hidden bg-slate-900 p-0">
	<div class="relative h-[145%] max-h-none aspect-[9/16]">
	
		<img
			src="/images/themes/weather-app/phone-mockup.png"
			alt="분실물찾기 앱"
			class="h-full w-full object-contain"
		/>

		<div class="absolute left-[12%] top-[8%] h-[84%] w-[76%] overflow-hidden rounded-[2rem] bg-slate-50">
			{#if screenMode === 'register'}
				<section class="flex h-full flex-col p-4">
					<div class="text-center">
						<div class="text-xl font-black text-slate-950">분실물 목록</div>
						<div class="mt-1 text-sm font-bold text-slate-500">
							등록된 분실물 {items.length} / 4
						</div>

						{#if items.length >= 4}
							<div class="mx-auto mt-2 w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
								목록 완성
							</div>
						{:else}
							<div class="mt-2 text-xs font-bold text-slate-400">
								4개의 카드가 모두 모이면 완성됩니다.
							</div>
						{/if}
					</div>

					<div class="mt-4 mb-32 grid min-h-0 flex-1 grid-cols-2 gap-2">
						{#each [1, 2, 3, 4] as cardNumber}
							{@const item = getItem(cardNumber)}

							{#if item}
								<article class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
									<div class="flex items-center justify-between">
										<div class="text-xs font-black text-blue-700">#{item.cardNumber}</div>
										<div class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
											{item.ownerFound ? '주인 찾음' : '찾는 중'}
										</div>
									</div>

									<div class="mt-2 truncate text-base font-black text-slate-950">
										{item.name || '이름 없음'}
									</div>

									<div class="mt-1 truncate text-xs font-bold text-slate-500">
										{item.category || '-'} · {item.color || '-'}
									</div>

									<div class="mt-3 space-y-1 text-[11px] font-bold text-slate-700">
										<div class="truncate">발견: {item.foundPlace || '-'}</div>
										<div class="truncate">보관: {item.storagePlace || '-'}</div>
									</div>

									<div class="mt-2 line-clamp-2 text-[11px] font-bold text-slate-400">
										특징: {item.features?.length ? item.features.join(', ') : '특징 없음'}
									</div>
								</article>
							{:else}
								<div class="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-center text-sm font-black text-slate-400">
									#{cardNumber}<br />
									등록 대기
								</div>
							{/if}
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
						<div class="mt-3 flex flex-wrap gap-2">
							{#each flags.categories?.length ? flags.categories : ['학용품', '의류', '우산', '생활용품', '기타'] as category}
								<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
									{category}
								</span>
							{/each}
						</div>
					</div>

					<div class="mt-4 rounded-2xl bg-blue-50 p-4">
						<div class="text-sm font-black text-slate-900">보관장소</div>
						<div class="mt-3 flex flex-wrap gap-2">
							{#each flags.storagePlaces?.length ? flags.storagePlaces : ['교무실', '교실', '도서관', '분실물보관함'] as place}
								<span class="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700">
									{place}
								</span>
							{/each}
						</div>
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