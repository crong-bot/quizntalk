<!-- src/lib/components/workplace/modals/RoomWaitingModal.svelte -->

<script>
	export let show = false;
	export let joinedParticipantCount = 0;
	export let requiredParticipantCount = 0;
	export let onClose = () => {};
</script>

{#if show}
	<div class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/30 px-4">
		<div
			role="dialog"
			aria-modal="true"
			class="w-full max-w-[460px] overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
		>
			<div class="flex items-start gap-4">
				<div
					class="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-amber-100 text-[30px]"
				>
					⏳
				</div>

				<div class="min-w-0 flex-1">
					<div class="text-[22px] font-black tracking-[-0.06em] text-slate-950">
						아직 팀원이 모두 모이지 않았어요
					</div>

					<div class="mt-2 text-[14px] font-bold leading-6 text-slate-500">
						모든 팀원이 입장해야 미션을 시작할 수 있습니다.
					</div>
				</div>
			</div>

			<div class="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
				<div class="text-[11px] font-black tracking-[0.14em] text-amber-600">ROOM WAITING</div>

				<div class="mt-1 text-[18px] font-black text-slate-950">
					현재 {joinedParticipantCount}/{requiredParticipantCount}명 입장
				</div>

				<div class="mt-1 text-[13px] font-bold leading-5 text-slate-600">
					남은 팀원이 입장한 뒤 다시 실행해 주세요.
				</div>
			</div>

			<button
				type="button"
				on:click={onClose}
				class="mt-4 h-12 w-full rounded-2xl bg-slate-950 text-[15px] font-black text-white shadow-[0_14px_30px_rgba(15,23,42,0.24)] transition hover:bg-slate-800"
			>
				확인
			</button>
		</div>
	</div>
{/if}
