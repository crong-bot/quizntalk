<!-- src/lib/components/workplace/modals/FinalSuccessModal.svelte -->

<script>
	export let show = false;
	export let jsonText = '';
	export let maxVerificationEnergy = 5;
	export let verificationEnergy = 5;
	export let onExit = () => {};

	// write | read
	export let mode = 'write';

	// course.completion
	export let completion = null;

	$: isRead = mode === 'read';

	$: safeCompletion = completion ?? {};

	$: modalIcon = safeCompletion.icon ?? (isRead ? '📋' : '🏆');
	$: modalTitle = safeCompletion.title ?? (isRead ? '분석 미션 성공!' : '작전 성공!');
	$: modalBadge = safeCompletion.badge ?? (isRead ? '최종 분석 보고서' : '작전 완료 보고서');

	$: modalDescription =
		safeCompletion.description ??
		(isRead
			? '모둠원이 JSON 단서를 읽고 근거를 모아 최종 결론을 완성했습니다.'
			: '모둠원이 각자 맡은 JSON 값을 완성했습니다.\n여러 값이 하나로 합쳐져 최종 JSON이 완성되었습니다.');

	$: resultTitle = safeCompletion.resultTitle ?? '최종 결론';
	$: result = safeCompletion.result ?? '';
	$: reasons = Array.isArray(safeCompletion.reasons) ? safeCompletion.reasons : [];
	$: message = safeCompletion.message ?? '';
	$: exitButtonText = safeCompletion.exitButtonText ?? '나가기';
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[72px]">
		<button
			type="button"
			aria-label="작전 완료 보고서"
			class="absolute inset-0 cursor-default bg-transparent"
			tabindex="-1"
		></button>

		<div
			role="dialog"
			aria-modal="true"
			class="relative z-10 w-full max-w-[860px] -translate-x-[277px] overflow-hidden rounded-[34px] border border-white/70 bg-white/95 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.30)]"
		>
			<div
				class="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-emerald-300/45 blur-3xl"
			></div>

			<div
				class="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-cyan-300/30 blur-3xl"
			></div>

			<div class="relative z-10">
				<div class="flex items-start justify-between gap-5">
					<div class="flex min-w-0 items-start gap-5">
						<div
							class="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-emerald-300 text-[42px] shadow-[0_0_36px_rgba(52,211,153,0.48)]"
						>
							{modalIcon}
						</div>

						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2">
								<div class="text-[31px] font-black tracking-[-0.075em] text-slate-950">
									{modalTitle}
								</div>

								<div
									class="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-black text-emerald-700"
								>
									{modalBadge}
								</div>
							</div>

							<div class="mt-2 whitespace-pre-line text-[15px] font-bold leading-7 text-slate-600">
								{modalDescription}
							</div>
						</div>
					</div>

					<button
						type="button"
						on:click={onExit}
						class="shrink-0 rounded-2xl bg-slate-950 px-5 py-3 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
					>
						{exitButtonText}
					</button>
				</div>

				{#if isRead}
					<div class="mt-5 grid grid-cols-[1fr_1fr] gap-3">
						<div class="space-y-3">
							<div class="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-emerald-500">
									FINAL RESULT
								</div>

								<div class="mt-2 text-[20px] font-black tracking-[-0.055em] text-slate-950">
									{resultTitle}
								</div>

								{#if result}
									<div
										class="mt-3 rounded-2xl bg-white px-4 py-4 text-[24px] font-black tracking-[-0.06em] text-emerald-700 shadow-sm"
									>
										{result}
									</div>
								{/if}

								{#if message}
									<div
										class="mt-3 rounded-2xl bg-white px-4 py-3 text-[14px] font-bold leading-6 text-slate-600 shadow-sm"
									>
										{message}
									</div>
								{:else}
									<div
										class="mt-3 rounded-2xl bg-white px-4 py-3 text-[14px] font-bold leading-6 text-slate-600 shadow-sm"
									>
										팀의 데이터 분석 결과가 최종 승인되었습니다.
									</div>
								{/if}
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									JSON 읽기 미션 결과
								</div>

								<div class="mt-3 grid grid-cols-3 gap-2">
									<div class="rounded-2xl bg-blue-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-blue-500">데이터 읽기</div>
										<div class="mt-1 text-[22px] font-black text-blue-700">완료</div>
										<div class="mt-1 text-[10px] font-bold text-blue-500">JSON 단서 분석</div>
									</div>

									<div class="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-emerald-500">근거 판단</div>
										<div class="mt-1 text-[22px] font-black text-emerald-700">완료</div>
										<div class="mt-1 text-[10px] font-bold text-emerald-500">핵심 값 찾기</div>
									</div>

									<div class="rounded-2xl bg-amber-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-amber-500">팀 협동</div>
										<div class="mt-1 text-[22px] font-black text-amber-700">완료</div>
										<div class="mt-1 text-[10px] font-bold text-amber-500">결론 공유</div>
									</div>
								</div>
							</div>
						</div>

						<div class="space-y-3">
							<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									판단 근거
								</div>

								{#if reasons.length > 0}
									<ul class="mt-3 flex flex-col gap-2">
										{#each reasons as reason}
											<li
												class="flex gap-2 rounded-2xl bg-white px-3 py-3 text-[13px] font-bold leading-5 text-slate-600 shadow-sm"
											>
												<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>
												<span>{reason}</span>
											</li>
										{/each}
									</ul>
								{:else}
									<div
										class="mt-3 rounded-2xl bg-white px-3 py-3 text-[13px] font-bold leading-6 text-slate-500 shadow-sm"
									>
										팀이 제출한 분석 결과를 바탕으로 최종 결론이 승인되었습니다.
									</div>
								{/if}
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									모둠 협동 결과
								</div>

								<div
									class="mt-3 rounded-2xl bg-slate-50 px-3 py-3 text-[13px] font-bold leading-6 text-slate-500"
								>
									각자 다른 JSON 단서를 읽고, 친구들과 근거를 공유하여 하나의 결론을 만들었습니다.
								</div>
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									학습 포인트
								</div>

								<div class="mt-3 grid grid-cols-1 gap-2">
									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[13px] font-black text-slate-800">JSON은 데이터를 담는 구조입니다.</div>
										<div class="mt-1 text-[12px] font-bold leading-5 text-slate-500">
											키와 값을 읽으면 데이터 안의 중요한 정보를 찾을 수 있습니다.
										</div>
									</div>

									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[13px] font-black text-slate-800">AI와 앱은 데이터를 보고 판단합니다.</div>
										<div class="mt-1 text-[12px] font-bold leading-5 text-slate-500">
											좋은 판단을 하려면 데이터의 근거를 함께 확인해야 합니다.
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="mt-5 grid grid-cols-[1.05fr_1fr] gap-3">
						<div class="space-y-3">
							<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
											FINAL JSON
										</div>
										<div class="mt-1 text-[18px] font-black tracking-[-0.055em] text-slate-950">
											최종 JSON 완성
										</div>
									</div>

									<div
										class="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-black text-white"
									>
										값 결합
									</div>
								</div>

								<pre
									class="mt-3 max-h-[150px] overflow-auto rounded-2xl bg-slate-950 p-4 text-[13px] font-bold leading-6 text-emerald-200">{jsonText}</pre>
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									JSON 학습 결과
								</div>

								<div class="mt-3 grid grid-cols-3 gap-2">
									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">숫자 number</div>
										<div class="mt-1 text-[17px] font-black text-slate-950">100</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">따옴표 없이 입력</div>
									</div>

									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">문자열 string</div>
										<div class="mt-1 text-[17px] font-black text-blue-600">"AD32"</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">따옴표로 감싸기</div>
									</div>

									<div class="rounded-2xl bg-slate-50 px-3 py-3">
										<div class="text-[11px] font-black text-slate-400">불리언 boolean</div>
										<div class="mt-1 text-[17px] font-black text-emerald-600">true</div>
										<div class="mt-1 text-[11px] font-bold text-slate-500">true / false</div>
									</div>
								</div>
							</div>
						</div>

						<div class="space-y-3">
							<div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">
									모둠 협동 결과
								</div>

								<div
									class="mt-3 rounded-2xl bg-white px-3 py-3 text-[13px] font-bold leading-6 text-slate-500 shadow-sm"
								>
									각 요원이 맡은 값을 제출했고, 제출된 값이 모여 하나의 JSON 데이터가 완성되었습니다.
								</div>
							</div>

							<div class="rounded-3xl border border-slate-200 bg-white p-4">
								<div class="text-[11px] font-black tracking-[0.16em] text-slate-400">검증 기록</div>

								<div class="mt-3 grid grid-cols-3 gap-2">
									<div class="rounded-2xl bg-blue-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-blue-500">검증 에너지</div>
										<div class="mt-1 text-[22px] font-black text-blue-700">
											{maxVerificationEnergy - verificationEnergy}
										</div>
										<div class="mt-1 text-[10px] font-bold text-blue-500">회 사용</div>
									</div>

									<div class="rounded-2xl bg-emerald-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-emerald-500">완료 상태</div>
										<div class="mt-1 text-[22px] font-black text-emerald-700">완료</div>
										<div class="mt-1 text-[10px] font-bold text-emerald-500">성공</div>
									</div>

									<div class="rounded-2xl bg-amber-50 px-3 py-3 text-center">
										<div class="text-[11px] font-black text-amber-500">검증하며 수정</div>
										<div class="mt-1 text-[22px] font-black text-amber-700">
											{Math.max(maxVerificationEnergy - verificationEnergy, 0)}
										</div>
										<div class="mt-1 text-[10px] font-bold text-amber-500">회</div>
									</div>
								</div>

								<div
									class="mt-3 rounded-2xl bg-slate-50 px-3 py-3 text-[13px] font-bold leading-6 text-slate-500"
								>
									JSON은 검증하고 수정하면서 정확한 데이터 구조를 만들어 가는 과정이 중요합니다.
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}