<script>
	export let show = false;

	export let title = '모든 JSON 데이터 수신 완료';
	export let subtitle = '팀원들의 데이터를 합치고 최종 결과를 분석하고 있어요.';
</script>

{#if show}
	<div
		class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
	>
		<div
			class="mission-drop w-[440px] overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
		>
			<div
				class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 px-7 py-7 text-white"
			>
				<div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl"></div>
				<div
					class="absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-cyan-200/20 blur-2xl"
				></div>

				<div class="relative z-10">
					<div
						class="mb-4 inline-flex items-center rounded-full bg-white/18 px-3 py-1 text-[11px] font-black tracking-[0.16em] text-white/90"
					>
						FINAL SYNC
					</div>

					<div class="text-[24px] font-black leading-tight">
						{title}
					</div>

					<div class="mt-2 text-[13px] font-bold leading-6 text-white/80">
						{subtitle}
					</div>
				</div>
			</div>

			<div class="px-7 py-6">
				<div class="flex items-center justify-center py-4">
					<div class="relative h-24 w-24">
						<div class="absolute inset-0 rounded-full border-[10px] border-slate-100"></div>
						<div
							class="absolute inset-0 rounded-full border-[10px] border-transparent border-t-blue-600 border-r-cyan-500 final-spin"
						></div>
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="text-2xl">🛰️</div>
						</div>
					</div>
				</div>

				<div class="mt-3 flex flex-col gap-2.5">
					{#each ['JSON 조각 수신', '데이터 병합', '최종 결과 분석'] as step, index}
						<div class="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
							<div
								class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[12px] font-black text-blue-700"
							>
								{index + 1}
							</div>

							<div class="text-[13px] font-black text-slate-700">
								{step}
							</div>

							<div class="ml-auto flex items-center gap-1">
								<span class="dot"></span>
								<span class="dot delay-1"></span>
								<span class="dot delay-2"></span>
							</div>
						</div>
					{/each}
				</div>

				<div
					class="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-center text-[12px] font-bold text-slate-200"
				>
					잠시만 기다리면 모든 팀원에게 결과가 열립니다.
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.final-spin {
		animation: finalSpin 0.9s linear infinite;
	}

	@keyframes finalSpin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.dot {
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: #2563eb;
		animation: dotPulse 0.9s ease-in-out infinite;
	}

	.delay-1 {
		animation-delay: 0.15s;
	}

	.delay-2 {
		animation-delay: 0.3s;
	}

	@keyframes dotPulse {
		0%,
		100% {
			opacity: 0.25;
			transform: translateY(0);
		}

		50% {
			opacity: 1;
			transform: translateY(-3px);
		}
	}
</style>
