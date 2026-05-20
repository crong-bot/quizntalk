<!-- src/lib/components/workplace/modals/FinalSuccessModal.svelte -->

<script>
	export let show = false;
	export let jsonText = '';
	export let maxVerificationEnergy = 5;
	export let verificationEnergy = 5;
	export let onExit = () => {};
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
							🏆
						</div>

						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2">
								<div class="text-[31px] font-black tracking-[-0.075em] text-slate-950">
									작전 성공!
								</div>

								<div
									class="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-black text-emerald-700"
								>
									작전 완료 보고서
								</div>
							</div>

							<div class="mt-2 text-[15px] font-bold leading-7 text-slate-600">
								모둠원이 각자 맡은 JSON 값을 완성했습니다.
								<br />
								여러 값이 하나로 합쳐져 최종 JSON이 완성되었습니다.
							</div>
						</div>
					</div>

					<button
						type="button"
						on:click={onExit}
						class="shrink-0 rounded-2xl bg-slate-950 px-5 py-3 text-[14px] font-black text-white shadow-[0_12px_28px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
					>
						나가기
					</button>
				</div>

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
			</div>
		</div>
	</div>
{/if}