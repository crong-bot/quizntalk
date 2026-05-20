<!-- src/lib/components/workplace/modals/FinalReadyModal.svelte -->

<script>
	export let show = false;
	export let jsonText = '';
	export let onRunFinalSequence = () => {};
</script>

{#if show}
	<div
		class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 pt-[88px]"
	>
		<div class="absolute inset-0 bg-slate-950/10"></div>

		<div
			role="dialog"
			aria-modal="true"
			class="mission-drop pointer-events-auto relative z-10 w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-md"
		>
			<div class="flex items-start gap-4">
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-violet-100 text-[30px] shadow-[0_0_30px_rgba(139,92,246,0.28)]"
				>
					🧩
				</div>

				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<div class="text-[24px] font-black tracking-[-0.06em] text-slate-950">
							최종 JSON 완성!
						</div>

						<div
							class="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-violet-600"
						>
							READY
						</div>
					</div>

					<div class="mt-1 text-[14px] font-bold leading-6 text-slate-500">
						모든 요원의 값이 모였습니다. 공용 화면의 변화를 확인한 뒤 최종 실행을 눌러 주세요.
					</div>
				</div>
			</div>

			<pre
				class="mt-4 max-h-[130px] overflow-auto rounded-2xl bg-slate-950 p-4 text-[12px] font-bold leading-5 text-emerald-200">{jsonText}</pre>

			<button
				type="button"
				on:click={onRunFinalSequence}
				class="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 active:translate-y-0"
			>
				최종 실행하기
			</button>
		</div>
	</div>
{/if}